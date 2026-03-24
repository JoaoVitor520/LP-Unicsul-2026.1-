import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const rootDir = process.cwd();
const localEnvPath = path.join(rootDir, '.env.local');
const sqlTemplatePath = path.join(rootDir, 'sql', 'setup_dashboard_manager_access.sql');

for (const envFile of ['.env.local', '.env']) {
  dotenv.config({ path: path.join(rootDir, envFile), override: false, quiet: true });
}

const required = (name) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

const optional = (name) => process.env[name]?.trim() || '';

const normalizeEmail = (value) => value.trim().toLowerCase();

const escapeSqlLiteral = (value) => value.replaceAll("'", "''");

const generatePassword = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+=';
  const bytes = randomBytes(24);
  let password = '';

  for (const byte of bytes) {
    password += alphabet[byte % alphabet.length];
  }

  return password;
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const formatEnvValue = (value) => JSON.stringify(value);

const upsertEnvValue = (content, key, value) => {
  const line = `${key}=${formatEnvValue(value)}`;
  const pattern = new RegExp(`^${escapeRegExp(key)}=.*$`, 'm');

  if (pattern.test(content)) {
    return content.replace(pattern, line);
  }

  const suffix = content.trimEnd() ? '\n' : '';
  return `${content.trimEnd()}${suffix}${line}\n`;
};

const writeLocalEnv = (values) => {
  let content = fs.existsSync(localEnvPath) ? fs.readFileSync(localEnvPath, 'utf8') : '';

  for (const [key, value] of Object.entries(values)) {
    content = upsertEnvValue(content, key, value);
  }

  fs.writeFileSync(localEnvPath, content, 'utf8');
};

const getManagementHeaders = (managementToken) => ({
  Authorization: `Bearer ${managementToken}`,
  'Content-Type': 'application/json',
});

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  const text = await response.text();
  let body = null;

  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (!response.ok) {
    const message =
      (body && typeof body === 'object' && (body.message || body.error)) ||
      text ||
      `${response.status} ${response.statusText}`;
    throw new Error(`${options.method || 'GET'} ${url} failed: ${message}`);
  }

  return body;
};

const readDashboardAccess = async (client) => {
  const rpcResult = await client.rpc('dashboard_list_leads');

  if (!rpcResult.error) {
    return;
  }

  const { error: selectError } = await client
    .from('leads')
    .select('id', { count: 'exact', head: true });

  if (selectError) {
    throw new Error(
      `Dashboard read validation failed: ${rpcResult.error.message}. Fallback SELECT failed: ${selectError.message}`,
    );
  }
};

const resolvePublicKey = async (projectRef, managementToken) => {
  const url = `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`;
  const keys = await fetchJson(url, {
    method: 'GET',
    headers: getManagementHeaders(managementToken),
  });

  const candidates = Array.isArray(keys) ? keys.filter((key) => typeof key?.api_key === 'string' && key.api_key) : [];

  const anonKey =
    candidates.find((key) => key.name === 'anon')?.api_key ||
    candidates.find((key) => typeof key.name === 'string' && key.name.toLowerCase().includes('publishable'))?.api_key;

  if (!anonKey) {
    throw new Error('Could not resolve a public Supabase API key from the Management API.');
  }

  return anonKey;
};

const findUserByEmail = async (adminClient, email) => {
  let page = 1;

  while (page <= 10) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 1000 });

    if (error) {
      throw new Error(`Failed to list Supabase users: ${error.message}`);
    }

    const users = data?.users || [];
    const match = users.find((user) => normalizeEmail(user.email || '') === email);

    if (match) {
      return match;
    }

    if (users.length < 1000) {
      break;
    }

    page += 1;
  }

  return null;
};

const upsertDashboardUser = async (adminClient, email, password) => {
  const existingUser = await findUserByEmail(adminClient, email);
  const attributes = {
    email,
    password,
    email_confirm: true,
    user_metadata: {
      dashboard_access: true,
    },
    app_metadata: {
      dashboard_access: true,
    },
  };

  if (existingUser) {
    const { data, error } = await adminClient.auth.admin.updateUserById(existingUser.id, attributes);

    if (error) {
      throw new Error(`Failed to update dashboard user: ${error.message}`);
    }

    return data.user;
  }

  const { data, error } = await adminClient.auth.admin.createUser(attributes);

  if (error) {
    throw new Error(`Failed to create dashboard user: ${error.message}`);
  }

  return data.user;
};

const applyDashboardSql = async (projectRef, managementToken, managerEmail, managerUid) => {
  const sqlTemplate = fs.readFileSync(sqlTemplatePath, 'utf8');
  const query = sqlTemplate
    .replaceAll('{{DASHBOARD_MANAGER_EMAIL}}', escapeSqlLiteral(managerEmail))
    .replaceAll('{{DASHBOARD_MANAGER_UID}}', managerUid);

  const url = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  await fetchJson(url, {
    method: 'POST',
    headers: getManagementHeaders(managementToken),
    body: JSON.stringify({ query }),
  });
};

const validateDashboardAccess = async (supabaseUrl, anonKey, email, password) => {
  const client = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error: loginError } = await client.auth.signInWithPassword({ email, password });

  if (loginError) {
    throw new Error(`Dashboard login validation failed: ${loginError.message}`);
  }

  await readDashboardAccess(client);

  await client.auth.signOut();
};

const main = async () => {
  const projectRef = required('SUPABASE_PROJECT_REF');
  const managementToken = optional('SUPABASE_MANAGEMENT_TOKEN');
  const serviceRoleKey = optional('SUPABASE_SERVICE_ROLE_KEY');
  const configuredManagerEmail = normalizeEmail(optional('DASHBOARD_MANAGER_EMAIL') || optional('VITE_DASHBOARD_MANAGER_EMAIL'));
  const managerEmail = configuredManagerEmail || 'dashboard-manager@example.com';
  const managerPassword = optional('DASHBOARD_MANAGER_PASSWORD');
  const supabaseUrl = optional('VITE_SUPABASE_URL') || `https://${projectRef}.supabase.co`;
  const anonKey = optional('VITE_SUPABASE_ANON_KEY') || (managementToken ? await resolvePublicKey(projectRef, managementToken) : '');

  if (!anonKey) {
    throw new Error('Missing required env var: VITE_SUPABASE_ANON_KEY');
  }

  if (!anonKey) {
    throw new Error('Missing required env var: VITE_SUPABASE_ANON_KEY');
  }

  if (!serviceRoleKey) {
    if (!configuredManagerEmail) {
      throw new Error('Missing required env var: DASHBOARD_MANAGER_EMAIL');
    }

    if (!managerPassword) {
      throw new Error('Missing required env var: DASHBOARD_MANAGER_PASSWORD');
    }

    writeLocalEnv({
      SUPABASE_PROJECT_REF: projectRef,
      VITE_SUPABASE_URL: supabaseUrl,
      VITE_SUPABASE_ANON_KEY: anonKey,
      VITE_DASHBOARD_MANAGER_EMAIL: configuredManagerEmail,
      VITE_DASHBOARD_LOGIN_EMAIL: configuredManagerEmail,
    });

    await validateDashboardAccess(supabaseUrl, anonKey, configuredManagerEmail, managerPassword);

    console.log('Dashboard access validated successfully using local credentials.');
    console.log('Admin bootstrap was skipped because SUPABASE_SERVICE_ROLE_KEY is not set.');
    return;
  }

  if (!configuredManagerEmail && !managementToken) {
    throw new Error('Missing required env var: DASHBOARD_MANAGER_EMAIL');
  }

  const finalManagerPassword = managerPassword || generatePassword();

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const user = await upsertDashboardUser(adminClient, managerEmail, finalManagerPassword);

  if (!user?.id) {
    throw new Error('Supabase did not return a dashboard user id.');
  }

  if (managementToken) {
    await applyDashboardSql(projectRef, managementToken, managerEmail, user.id);
  } else {
    console.log('SQL bootstrap skipped because SUPABASE_MANAGEMENT_TOKEN is not set.');
  }

  writeLocalEnv({
    SUPABASE_PROJECT_REF: projectRef,
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: anonKey,
    VITE_DASHBOARD_MANAGER_EMAIL: managerEmail,
    VITE_DASHBOARD_MANAGER_UID: user.id,
    VITE_DASHBOARD_LOGIN_EMAIL: managerEmail,
    DASHBOARD_MANAGER_EMAIL: managerEmail,
    DASHBOARD_MANAGER_PASSWORD: finalManagerPassword,
  });

  await validateDashboardAccess(supabaseUrl, anonKey, managerEmail, finalManagerPassword);

  console.log('Dashboard access configured successfully.');
  console.log(`Dashboard login email saved to ${path.basename(localEnvPath)}.`);
  console.log(`Dashboard manager uid: ${user.id}`);
  console.log('The dashboard password was saved locally and was not printed to the terminal.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

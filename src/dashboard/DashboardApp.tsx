import React, { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type Lead = {
  id: string;
  nome: string;
  email: string | null;
  whatsapp: string | null;
  cidade: string | null;
  curso: string | null;
  indicacao: string | null;
  created_at: string;
};

type AuthView = 'checking' | 'login' | 'authorizing' | 'reset' | 'ready' | 'forbidden';
type RangeFilter = '24h' | '7d' | '30d' | 'all';

const LIVE_REFRESH_MS = 20000;
const DASHBOARD_MANAGER_EMAIL = (import.meta.env.VITE_DASHBOARD_MANAGER_EMAIL || '').trim().toLowerCase();
const DASHBOARD_MANAGER_UID = (import.meta.env.VITE_DASHBOARD_MANAGER_UID || '').trim().toLowerCase();
const DASHBOARD_LOGIN_EMAIL = (import.meta.env.VITE_DASHBOARD_LOGIN_EMAIL || DASHBOARD_MANAGER_EMAIL || '').trim();
const HAS_DASHBOARD_MANAGER_CONFIG = !!(DASHBOARD_MANAGER_EMAIL || DASHBOARD_MANAGER_UID);
const DASHBOARD_MANAGERS: Record<string, string> = DASHBOARD_MANAGER_EMAIL
  ? {
      [DASHBOARD_MANAGER_EMAIL]: 'Gestor',
    }
  : {};
const DASHBOARD_LEAD_FIELDS = 'id, nome, email, whatsapp, cidade, curso, indicacao, created_at';

const normalizeText = (value: string | null | undefined) =>
  (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const readDashboardLeads = async () => {
  const rpcResult = await supabase.rpc('dashboard_list_leads');

  if (!rpcResult.error) {
    return {
      data: (rpcResult.data || []) as Lead[],
      error: null,
    };
  }

  const selectResult = await supabase
    .from('leads')
    .select(DASHBOARD_LEAD_FIELDS)
    .order('created_at', { ascending: false })
    .limit(250);

  return {
    data: (selectResult.data || []) as Lead[],
    error: selectResult.error || rpcResult.error,
  };
};

const getTopValues = (values: Array<string | null | undefined>) => {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    if (!value) return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([value]) => value);
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

const inRange = (date: string, range: RangeFilter) => {
  if (range === 'all') return true;
  const diff = Date.now() - new Date(date).getTime();
  if (range === '24h') return diff <= 24 * 60 * 60 * 1000;
  if (range === '7d') return diff <= 7 * 24 * 60 * 60 * 1000;
  return diff <= 30 * 24 * 60 * 60 * 1000;
};

const startOfDay = (value: Date | string) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfWeek = (value: Date | string) => {
  const date = startOfDay(value);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
};

export default function DashboardApp() {
  const [authView, setAuthView] = useState<AuthView>('checking');
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({
    email: DASHBOARD_LOGIN_EMAIL,
    password: '',
  });
  const [resetRequestStatus, setResetRequestStatus] = useState('');
  const [resetRequestLoading, setResetRequestLoading] = useState(false);
  const [resetForm, setResetForm] = useState({ password: '', confirm: '' });
  const [resetLoading, setResetLoading] = useState(false);
  const [changeForm, setChangeForm] = useState({ password: '', confirm: '' });
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');
  const [changeLoading, setChangeLoading] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [range, setRange] = useState<RangeFilter>('7d');
  const [course, setCourse] = useState('Todas');
  const [city, setCity] = useState('Todas');
  const [search, setSearch] = useState('');
  const [dataError, setDataError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [readBlocked, setReadBlocked] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const assertAuthorized = useCallback((nextSession: Session) => {
    if (!HAS_DASHBOARD_MANAGER_CONFIG) return;

    const email = nextSession.user.email?.trim().toLowerCase();
    const userId = nextSession.user.id?.trim().toLowerCase();

    if (!email && !userId) {
      throw new Error('Nao foi possivel identificar o gestor autenticado.');
    }

    const allowedByEmail = email ? DASHBOARD_MANAGERS[email] : '';
    const allowedByUid = !!DASHBOARD_MANAGER_UID && userId === DASHBOARD_MANAGER_UID;

    if (!allowedByEmail && !allowedByUid) {
      throw new Error('Seu e-mail nao esta liberado para este dashboard.');
    }
  }, []);

  const verifyAccess = useCallback((nextSession: Session) => {
    assertAuthorized(nextSession);

    setAuthView('ready');
    setAuthError('');
  }, [assertAuthorized]);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setDataError('');

    const { data, error } = await readDashboardLeads();

    if (error) {
      const message = `${error.code || ''} ${error.message}`.toLowerCase();
      const blocked = message.includes('permission denied') || message.includes('42501') || message.includes('403');
      setReadBlocked(blocked);
      if (blocked && !HAS_DASHBOARD_MANAGER_CONFIG) {
        setAuthError('Seu e-mail nao esta liberado para este dashboard.');
        setAuthView('forbidden');
        setDataError('Sem permissao para leitura. Verifique se o e-mail/UID estao autorizados no Supabase.');
      } else {
        setDataError(
          blocked
            ? 'O dashboard ainda nao tem permissao de leitura. Rode novamente o SQL atualizado de sql/setup_dashboard_manager_access.sql, saia da conta e entre de novo.'
            : error.message,
        );
      }
      setIsLoading(false);
      return;
    }

    setReadBlocked(false);
    setLeads((data || []) as Lead[]);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        setAuthError('');
        return setAuthView('login');
      }

      setAuthView('authorizing');

      try {
        verifyAccess(data.session);
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : 'Falha ao validar acesso.');
        setAuthView('forbidden');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, nextSession) => {
      if (!nextSession) {
        setAuthError('');
        return setAuthView('login');
      }

      if (event === 'PASSWORD_RECOVERY') {
        try {
          assertAuthorized(nextSession);
          setAuthError('');
          setAuthView('reset');
        } catch (error) {
          setAuthError(error instanceof Error ? error.message : 'Falha ao validar acesso.');
          setAuthView('forbidden');
        }
        return;
      }

      setAuthView('authorizing');

      try {
        verifyAccess(nextSession);
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : 'Falha ao validar acesso.');
        setAuthView('forbidden');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [verifyAccess]);

  useEffect(() => {
    if (authView !== 'ready') return;

    fetchLeads();

    if (readBlocked) return;

    const intervalId = window.setInterval(() => {
      fetchLeads(true);
    }, LIVE_REFRESH_MS);

    const channel = supabase
      .channel('dashboard-leads-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchLeads(true);
      })
      .subscribe();

    return () => {
      window.clearInterval(intervalId);
      void supabase.removeChannel(channel);
    };
  }, [authView, fetchLeads, readBlocked]);

  const rangeLeads = useMemo(() => leads.filter((lead) => inRange(lead.created_at, range)), [leads, range]);
  const courseOptions = useMemo(
    () => ['Todas', ...Array.from(new Set(leads.map((lead) => lead.curso).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'pt-BR'))],
    [leads],
  );
  const cityOptions = useMemo(
    () => ['Todas', ...Array.from(new Set(leads.map((lead) => lead.cidade).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, 'pt-BR'))],
    [leads],
  );

  const scopedLeads = useMemo(
    () =>
      rangeLeads.filter((lead) => {
        const matchesCourse = course === 'Todas' || lead.curso === course;
        const matchesCity = city === 'Todas' || lead.cidade === city;
        return matchesCourse && matchesCity;
      }),
    [rangeLeads, course, city],
  );

  const filteredLeads = useMemo(() => {
    const term = normalizeText(deferredSearch);

    return scopedLeads.filter((lead) => {
      const haystack = normalizeText([lead.nome, lead.email, lead.whatsapp, lead.cidade, lead.curso].filter(Boolean).join(' '));
      return !term || haystack.includes(term);
    });
  }, [scopedLeads, deferredSearch]);

  const leadsToday = useMemo(() => {
    const today = startOfDay(new Date());
    return scopedLeads.filter((lead) => new Date(lead.created_at) >= today).length;
  }, [scopedLeads]);

  const indicated = useMemo(() => scopedLeads.filter((lead) => lead.indicacao === 'sim').length, [scopedLeads]);
  const referralRate = scopedLeads.length ? Math.round((indicated / scopedLeads.length) * 100) : 0;
  const rankedCities = useMemo(() => getTopValues(scopedLeads.map((lead) => lead.cidade)), [scopedLeads]);
  const rankedCourses = useMemo(() => getTopValues(scopedLeads.map((lead) => lead.curso)), [scopedLeads]);
  const topCity = useMemo(() => rankedCities[0] || '-', [rankedCities]);
  const topCourse = useMemo(() => rankedCourses[0] || '-', [rankedCourses]);
  const secondTopCourse = useMemo(() => rankedCourses[1] || '-', [rankedCourses]);
  const hotLeads = useMemo(
    () => scopedLeads.filter((lead) => Date.now() - new Date(lead.created_at).getTime() <= 2 * 60 * 60 * 1000).length,
    [scopedLeads],
  );

  const dailySeries = useMemo(() => {
    const today = startOfDay(new Date());

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));

      return {
        key: date.toISOString(),
        label: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').slice(0, 3).toUpperCase(),
        value: scopedLeads.filter((lead) => startOfDay(lead.created_at).getTime() === date.getTime()).length,
      };
    });
  }, [scopedLeads]);

  const weeklySeries = useMemo(() => {
    const currentWeek = startOfWeek(new Date());

    return Array.from({ length: 6 }, (_, index) => {
      const weekStart = new Date(currentWeek);
      weekStart.setDate(currentWeek.getDate() - (5 - index) * 7);

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      return {
        key: weekStart.toISOString(),
        label: weekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        value: scopedLeads.filter((lead) => {
          const createdAt = new Date(lead.created_at);
          return createdAt >= weekStart && createdAt <= weekEnd;
        }).length,
      };
    });
  }, [scopedLeads]);

  const dailyMax = useMemo(() => Math.max(...dailySeries.map((item) => item.value), 1), [dailySeries]);
  const weeklyMax = useMemo(() => Math.max(...weeklySeries.map((item) => item.value), 1), [weeklySeries]);

  const dayPartSeries = useMemo(() => {
    const morning = scopedLeads.filter((lead) => new Date(lead.created_at).getHours() < 12).length;
    const afternoon = scopedLeads.length - morning;
    const total = Math.max(scopedLeads.length, 1);

    return [
      {
        label: 'Manha',
        value: morning,
        percent: Math.round((morning / total) * 100),
        color: 'from-[#31f7c5] to-[#1fd7ab]',
      },
      {
        label: 'Tarde',
        value: afternoon,
        percent: Math.round((afternoon / total) * 100),
        color: 'from-[#d8f85f] to-[#b9df32]',
      },
    ];
  }, [scopedLeads]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');
    setResetRequestStatus('');
    setAuthView('authorizing');

    const { error } = await supabase.auth.signInWithPassword(loginForm);

    if (error) {
      setAuthError(error.message);
      setAuthView('login');
    }
  };

  const handlePasswordResetRequest = async () => {
    const email = loginForm.email.trim();
    setResetRequestStatus('');

    if (!email) {
      setResetRequestStatus('Informe o e-mail para enviar o link de recuperacao.');
      return;
    }

    setResetRequestLoading(true);
    const redirectTo = `${window.location.origin}/gestao/`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setResetRequestLoading(false);

    if (error) {
      setResetRequestStatus(error.message);
      return;
    }

    setResetRequestStatus('Se o e-mail estiver cadastrado, enviamos um link para definir a nova senha.');
  };

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthError('');

    if (!resetForm.password || resetForm.password.length < 8) {
      setAuthError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (resetForm.password !== resetForm.confirm) {
      setAuthError('As senhas nao conferem.');
      return;
    }

    setResetLoading(true);
    const { error } = await supabase.auth.updateUser({ password: resetForm.password });
    setResetLoading(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    await supabase.auth.signOut();
    setResetForm({ password: '', confirm: '' });
    setAuthError('Senha atualizada. Faca login novamente.');
    setAuthView('login');
  };

  const handleOpenChangePassword = () => {
    setChangeForm({ password: '', confirm: '' });
    setChangeError('');
    setChangeSuccess('');
    setShowChangePassword(true);
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!changeForm.password || changeForm.password.length < 8) {
      setChangeError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    if (changeForm.password !== changeForm.confirm) {
      setChangeError('As senhas nao conferem.');
      return;
    }

    setChangeLoading(true);
    const { error } = await supabase.auth.updateUser({ password: changeForm.password });
    setChangeLoading(false);

    if (error) {
      setChangeError(error.message);
      return;
    }

    setChangeSuccess('Senha atualizada com sucesso.');
    setChangeForm({ password: '', confirm: '' });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setLeads([]);
    setReadBlocked(false);
    setShowChangePassword(false);
    setAuthView('login');
  };

  if (authView === 'checking' || authView === 'authorizing') {
    return (
      <div className="dashboard-shell min-h-screen flex items-center justify-center px-6">
        <div className="dashboard-panel max-w-md w-full rounded-[2rem] p-8 text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#91ffe4]" />
          <h1 className="mt-5 font-headline text-3xl font-extrabold text-white">Conectando painel</h1>
          <p className="mt-3 text-sm leading-6 text-[#a8b6df]">Sincronizando acesso e dados.</p>
        </div>
      </div>
    );
  }

  if (authView === 'login') {
    return (
      <div className="dashboard-shell min-h-screen px-6 py-8">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-panel w-full overflow-hidden rounded-[2rem] border border-white/10"
          >
            <div className="px-8 py-10 md:px-10 md:py-12">
              <div className="mx-auto max-w-md text-center">
                <img src="/logo.png" alt="Cruzeiro do Sul Virtual" className="mx-auto h-14 w-auto opacity-95" />
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#91ffe4]">
                  <ShieldCheck className="h-4 w-4" />
                  Painel do gestor
                </div>
                <h2 className="mt-6 font-headline text-3xl font-extrabold text-white md:text-4xl">Entrar no dashboard</h2>
                <p className="mt-3 text-sm text-[#9fb1dd]">Acesso restrito.</p>
              </div>

              <form className="mx-auto mt-10 max-w-md space-y-5" onSubmit={handleLogin}>
                <label htmlFor="dashboard-login-email" className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">E-mail</span>
                  <input
                    id="dashboard-login-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={loginForm.email}
                    onChange={(event) => {
                      setLoginForm((current) => ({ ...current, email: event.target.value }));
                      setResetRequestStatus('');
                    }}
                    className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                  />
                </label>
                <label htmlFor="dashboard-login-password" className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">Senha</span>
                  <input
                    id="dashboard-login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                  />
                </label>
                {authError && <div className="rounded-[1rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{authError}</div>}
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-[#d8f85f] px-5 py-3.5 font-bold text-[#08152f] transition hover:brightness-105"
                >
                  Entrar no dashboard
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#a8b6df]">
                  Precisa cadastrar uma nova senha? Enviamos um link para redefinir quando voce informar o e-mail acima.
                </div>
                <button
                  type="button"
                  onClick={handlePasswordResetRequest}
                  disabled={resetRequestLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] border border-white/10 bg-white/6 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10 disabled:opacity-60"
                >
                  {resetRequestLoading ? 'Enviando link...' : 'Enviar link de nova senha'}
                </button>
                {resetRequestStatus && (
                  <div className="rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#a8b6df]">{resetRequestStatus}</div>
                )}
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (authView === 'reset') {
    return (
      <div className="dashboard-shell min-h-screen px-6 py-8">
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-xl items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-panel w-full overflow-hidden rounded-[2rem] border border-white/10"
          >
            <div className="px-8 py-10 md:px-10 md:py-12">
              <div className="mx-auto max-w-md text-center">
                <img src="/logo.png" alt="Cruzeiro do Sul Virtual" className="mx-auto h-14 w-auto opacity-95" />
                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#91ffe4]">
                  <ShieldCheck className="h-4 w-4" />
                  Atualizar senha
                </div>
                <h2 className="mt-6 font-headline text-3xl font-extrabold text-white md:text-4xl">Defina sua nova senha</h2>
                <p className="mt-3 text-sm text-[#9fb1dd]">Use uma senha forte e exclusiva.</p>
              </div>

              <form className="mx-auto mt-10 max-w-md space-y-5" onSubmit={handlePasswordReset}>
                <label htmlFor="dashboard-reset-password" className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">Nova senha</span>
                  <input
                    id="dashboard-reset-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={resetForm.password}
                    onChange={(event) => setResetForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                  />
                </label>
                <label htmlFor="dashboard-reset-confirm" className="block space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">Confirmar senha</span>
                  <input
                    id="dashboard-reset-confirm"
                    name="confirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={resetForm.confirm}
                    onChange={(event) => setResetForm((current) => ({ ...current, confirm: event.target.value }))}
                    className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                  />
                </label>
                {authError && <div className="rounded-[1rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{authError}</div>}
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[1.1rem] bg-[#d8f85f] px-5 py-3.5 font-bold text-[#08152f] transition hover:brightness-105 disabled:opacity-60"
                >
                  {resetLoading ? 'Atualizando...' : 'Atualizar senha'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (authView === 'forbidden') {
    return (
      <div className="dashboard-shell min-h-screen flex items-center justify-center px-6">
        <div className="dashboard-panel max-w-lg w-full rounded-[2rem] p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-200" />
          <h1 className="mt-5 font-headline text-3xl font-extrabold text-white">Acesso bloqueado</h1>
          <p className="mt-3 text-sm leading-7 text-[#a8b6df]">{authError}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 inline-flex items-center justify-center rounded-[1rem] border border-white/10 bg-white/6 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Trocar usuario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell min-h-screen px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b1b]/80 px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="dashboard-panel w-full max-w-md rounded-[2rem] border border-white/10 p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#91ffe4]">
                  <KeyRound className="h-4 w-4" />
                  Trocar senha
                </div>
                <h2 className="mt-4 font-headline text-2xl font-extrabold text-white">Atualize sua senha agora</h2>
                <p className="mt-2 text-sm text-[#9fb1dd]">Use uma senha forte e diferente das anteriores.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePassword(false)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/10"
              >
                Fechar
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleChangePassword}>
              <label htmlFor="dashboard-change-password" className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">Nova senha</span>
                <input
                  id="dashboard-change-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={changeForm.password}
                  onChange={(event) => setChangeForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                />
              </label>
              <label htmlFor="dashboard-change-confirm" className="block space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8eb6ff]">Confirmar senha</span>
                <input
                  id="dashboard-change-confirm"
                  name="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={changeForm.confirm}
                  onChange={(event) => setChangeForm((current) => ({ ...current, confirm: event.target.value }))}
                  className="w-full rounded-[1.1rem] border border-white/10 bg-[#08173d] px-4 py-3.5 text-white outline-none transition focus:border-[#31f7c5]/45 focus:ring-2 focus:ring-[#31f7c5]/15"
                />
              </label>
              {changeError && <div className="rounded-[1rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{changeError}</div>}
              {changeSuccess && <div className="rounded-[1rem] border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{changeSuccess}</div>}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={changeLoading}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] bg-[#d8f85f] px-5 py-3.5 font-bold text-[#08152f] transition hover:brightness-105 disabled:opacity-60"
                >
                  {changeLoading ? 'Salvando...' : 'Atualizar senha'}
                  <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.1rem] border border-white/10 bg-white/6 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dashboard-panel rounded-[2rem] px-4 py-5 sm:px-8 sm:py-6 lg:px-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#91ffe4]">
                <LayoutDashboard className="h-4 w-4" />
                URL do gestor: /gestao/
              </div>
              <h1 className="font-headline text-[2rem] font-extrabold leading-tight text-white sm:text-5xl">
                Painel de captacao <span className="text-[#31f7c5]">executiva</span>
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs text-[#bfd0f6]">
                {lastUpdated ? `Atualizado ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Sincronizando'}
              </div>
              <button
                type="button"
                onClick={() => fetchLeads()}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Atualizar
              </button>
              <button
                type="button"
                onClick={handleOpenChangePassword}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <KeyRound className="h-4 w-4" />
                Trocar senha
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#08173d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#0b214d]"
              >
                <LogOut className="h-4 w-4" />
                Trocar usuario
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: 'Leads no recorte', value: scopedLeads.length, detail: range === 'all' ? 'Base completa' : `Janela ${range}`, icon: Users },
              { title: 'Entradas hoje', value: leadsToday, detail: 'Volume do dia atual', icon: Calendar },
              { title: 'Taxa de indicacao', value: `${referralRate}%`, detail: `${indicated} lead(s) indicados`, icon: Sparkles },
              { title: 'Leads quentes', value: hotLeads, detail: 'Ultimas 2 horas', icon: TrendingUp },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.03] p-5">
                <div className="flex items-start justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">{item.title}</p>
                    <p className="mt-4 font-headline text-3xl font-extrabold text-white sm:text-4xl">{item.value}</p>
                    <p className="mt-2 text-sm text-white/65">{item.detail}</p>
                  </div>
                  <item.icon className="h-5 w-5 text-white/55" />
                </div>
              </div>
            ))}
          </div>
        </motion.header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
          <section className="dashboard-panel rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-headline text-2xl font-extrabold text-white">Leads</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <label htmlFor="dashboard-search" className="dashboard-filter">
                  <span>Busca</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                    <input
                      id="dashboard-search"
                      name="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Nome, cidade, curso..."
                      className="w-full rounded-[1rem] border border-white/10 bg-[#08173d] py-3 pl-10 pr-4 text-sm text-white outline-none transition focus:border-[#31f7c5]/40 focus:ring-2 focus:ring-[#31f7c5]/10"
                    />
                  </div>
                </label>
                <label htmlFor="dashboard-range" className="dashboard-filter">
                  <span>Janela</span>
                  <select id="dashboard-range" name="range" value={range} onChange={(event) => setRange(event.target.value as RangeFilter)} className="dashboard-select">
                    <option value="24h">Ultimas 24h</option>
                    <option value="7d">Ultimos 7 dias</option>
                    <option value="30d">Ultimos 30 dias</option>
                    <option value="all">Tudo</option>
                  </select>
                </label>
                <label htmlFor="dashboard-course" className="dashboard-filter">
                  <span>Curso</span>
                  <select id="dashboard-course" name="course" value={course} onChange={(event) => setCourse(event.target.value)} className="dashboard-select">
                    {courseOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label htmlFor="dashboard-city" className="dashboard-filter">
                  <span>Cidade</span>
                  <select id="dashboard-city" name="city" value={city} onChange={(event) => setCity(event.target.value)} className="dashboard-select">
                    {cityOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {dataError && <div className="mt-4 rounded-[1rem] border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{dataError}</div>}

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#06142f]/95">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.85fr] gap-4 border-b border-white/6 px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white/45 md:grid">
                <span>Lead</span>
                <span>Curso</span>
                <span>Cidade</span>
                <span>Entrada</span>
              </div>
              <div className="max-h-[540px] overflow-y-auto scrollbar-hide">
                {filteredLeads.length === 0 ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center px-6 py-10 text-center">
                    <Search className="h-8 w-8 text-white/35" />
                    <p className="mt-4 text-base font-bold text-white">Nenhum lead encontrado.</p>
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="border-b border-white/6 px-4 py-4 text-sm text-white/85 transition hover:bg-white/[0.03] sm:px-5 md:grid md:grid-cols-[1.2fr_1fr_1fr_0.85fr] md:gap-4">
                      <div className="md:hidden">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-white">{lead.nome}</p>
                            <p className="mt-1 truncate text-xs text-white/55">{lead.email || lead.whatsapp || 'Contato nao informado'}</p>
                          </div>
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">
                            {lead.curso || 'Curso'}
                          </span>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Cidade</p>
                            <p className="mt-1 text-sm text-white">{lead.cidade || 'Cidade nao informada'}</p>
                          </div>
                          <div className="rounded-[1rem] border border-white/8 bg-white/[0.03] px-3 py-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">Entrada</p>
                            <p className="mt-1 text-sm text-white">{formatDateTime(lead.created_at)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <p className="font-semibold text-white">{lead.nome}</p>
                        <p className="mt-1 text-xs text-white/55">{lead.email || lead.whatsapp || 'Contato nao informado'}</p>
                      </div>
                      <div className="hidden md:block">{lead.curso || 'Curso nao informado'}</div>
                      <div className="hidden md:block">{lead.cidade || 'Cidade nao informada'}</div>
                      <div className="hidden md:block">{formatDateTime(lead.created_at)}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <section className="dashboard-panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-2xl font-extrabold text-white">Resumo</h3>
                <MapPin className="h-5 w-5 text-white/55" />
              </div>
              <div className="mt-6 grid gap-3">
                {[
                  { label: 'Top cidade', value: topCity },
                  { label: 'Top curso', value: topCourse },
                  { label: '2o curso', value: secondTopCourse },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">{item.label}</p>
                    <p className="mt-2 text-sm text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel rounded-[2rem] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-headline text-2xl font-extrabold text-white">Evolucao da captacao</h3>
                  <p className="mt-1 text-sm text-white/55">Leitura diaria, por faixa do dia e semanal.</p>
                </div>
                <TrendingUp className="h-5 w-5 text-[#d8f85f]" />
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Evolucao diaria</p>
                      <p className="mt-2 text-sm text-white/65">Ultimos 7 dias</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {dailySeries.reduce((total, item) => total + item.value, 0)} leads
                    </p>
                  </div>

                  <div className="mt-5 grid h-36 grid-cols-7 items-end gap-2">
                    {dailySeries.map((item) => (
                      <div key={item.key} className="flex h-full flex-col justify-end gap-2">
                        <div className="flex-1 rounded-full bg-white/[0.04] p-1">
                          <div
                            className="w-full rounded-full bg-gradient-to-t from-[#1fd7ab] via-[#31f7c5] to-[#91ffe4]"
                            style={{
                              height: `${Math.max((item.value / dailyMax) * 100, item.value > 0 ? 16 : 6)}%`,
                              marginTop: 'auto',
                            }}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-semibold text-white">{item.value}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/40">{item.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                  {dayPartSeries.map((item) => (
                    <div key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">{item.label}</p>
                          <p className="mt-2 text-2xl font-extrabold text-white">{item.value}</p>
                        </div>
                        <p className="text-sm font-semibold text-white/70">{item.percent}%</p>
                      </div>
                      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/8">
                        <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.percent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/45">Evolucao semanal</p>
                      <p className="mt-2 text-sm text-white/65">Ultimas 6 semanas</p>
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {weeklySeries.reduce((total, item) => total + item.value, 0)} leads
                    </p>
                  </div>

                  <div className="mt-5 space-y-3">
                    {weeklySeries.map((item) => (
                      <div key={item.key} className="grid grid-cols-[56px_1fr_32px] items-center gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">{item.label}</p>
                        <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#d8f85f] via-[#91ffe4] to-[#31f7c5]"
                            style={{ width: `${Math.max((item.value / weeklyMax) * 100, item.value > 0 ? 10 : 0)}%` }}
                          />
                        </div>
                        <p className="text-right text-sm font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

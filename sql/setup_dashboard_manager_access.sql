-- =============================================
-- Setup do dashboard do gestor com acesso seguro
-- URL sugerida: /gestao/
-- LP-Unicsul-2026.1
-- =============================================
--
-- Antes de executar este script no Supabase SQL Editor:
-- 1. Substitua {{DASHBOARD_MANAGER_EMAIL}} pelo e-mail autorizado.
-- 2. Substitua {{DASHBOARD_MANAGER_UID}} pelo UUID do usuario em Authentication > Users.
-- 3. Defina a senha somente no painel do Supabase. Nunca commite a senha no Git.

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.leads TO authenticated;

DROP POLICY IF EXISTS "dashboard_managers_select_leads" ON public.leads;
DROP POLICY IF EXISTS "dashboard_select_manager_uid" ON public.leads;
DROP POLICY IF EXISTS "dashboard_select_manager_email" ON public.leads;

CREATE POLICY "dashboard_select_manager_uid"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = '{{DASHBOARD_MANAGER_UID}}'::uuid);

CREATE POLICY "dashboard_select_manager_email"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (lower(COALESCE(auth.jwt() ->> 'email', '')) = lower('{{DASHBOARD_MANAGER_EMAIL}}'));

DROP FUNCTION IF EXISTS public.dashboard_list_leads();
CREATE FUNCTION public.dashboard_list_leads()
RETURNS TABLE (
  id TEXT,
  nome TEXT,
  email TEXT,
  whatsapp TEXT,
  cidade TEXT,
  curso TEXT,
  indicacao TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT (
    lower(COALESCE(auth.jwt() ->> 'email', '')) = lower('{{DASHBOARD_MANAGER_EMAIL}}')
    OR auth.uid() = '{{DASHBOARD_MANAGER_UID}}'::uuid
  ) THEN
    RAISE EXCEPTION 'Acesso nao autorizado ao dashboard.'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  SELECT
    leads.id::text,
    leads.nome,
    leads.email,
    leads.whatsapp,
    leads.cidade,
    leads.curso,
    leads.indicacao,
    leads.created_at
  FROM public.leads AS leads
  ORDER BY leads.created_at DESC
  LIMIT 250;
END;
$$;

REVOKE ALL ON FUNCTION public.dashboard_list_leads() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dashboard_list_leads() TO authenticated;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_publication
    WHERE pubname = 'supabase_realtime'
  ) AND NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;
END $$;

-- Crie ou atualize o usuario gestor em Authentication > Users:
-- email: {{DASHBOARD_MANAGER_EMAIL}}
-- uid esperado: {{DASHBOARD_MANAGER_UID}}
-- Defina a senha diretamente no painel do Supabase.
-- Depois de aplicar este SQL, saia da conta no dashboard e entre novamente.

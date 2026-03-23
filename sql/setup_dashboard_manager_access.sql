-- =============================================
-- Setup do dashboard do gestor com acesso seguro
-- URL sugerida: /gestao/
-- LP-Unicsul-2026.1
-- =============================================

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.leads TO authenticated;

DROP POLICY IF EXISTS "dashboard_managers_select_leads" ON public.leads;
DROP POLICY IF EXISTS "dashboard_select_jvcabral520" ON public.leads;

CREATE POLICY "dashboard_select_jvcabral520"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (
    lower(COALESCE(auth.jwt() ->> 'email', '')) = 'jvcabral520@gmail.com'
    OR auth.uid() = '1da13605-adf5-465a-a66a-3986eb978c28'::uuid
  );

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
    lower(COALESCE(auth.jwt() ->> 'email', '')) = 'jvcabral520@gmail.com'
    OR auth.uid() = '1da13605-adf5-465a-a66a-3986eb978c28'::uuid
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

-- Crie este usuario em Authentication > Users:
-- email: jvcabral520@gmail.com
-- senha: Cruzeiro08
-- uid esperado: 1da13605-adf5-465a-a66a-3986eb978c28

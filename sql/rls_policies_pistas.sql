-- =============================================
-- Politicas de INSERT anonimo para public.pistas
-- LP-Unicsul-2026.1
-- =============================================

ALTER TABLE public.pistas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_pistas" ON public.pistas;

CREATE POLICY "anon_insert_pistas"
  ON public.pistas
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT INSERT ON public.pistas TO anon;

-- =============================================
-- Adiciona a coluna cidade na tabela public.leads
-- LP-Unicsul-2026.1
-- =============================================

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS cidade TEXT;

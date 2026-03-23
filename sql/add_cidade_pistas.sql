-- =============================================
-- Adiciona a coluna cidade na tabela public.pistas
-- LP-Unicsul-2026.1
-- =============================================

ALTER TABLE public.pistas
  ADD COLUMN IF NOT EXISTS cidade TEXT;

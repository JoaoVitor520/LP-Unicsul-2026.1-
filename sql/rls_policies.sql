-- =============================================
-- Migração: Políticas de Segurança (RLS), Timestamp e Sobrenome
-- LP-Unicsul-2026.1
-- Executado em: 2026-03-20
-- =============================================

-- 1. Adicionar coluna sobrenome na tabela leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS sobrenome TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS cidade TEXT;

-- 2. Garantir coluna created_at com default e not null
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.leads ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.leads ALTER COLUMN created_at SET NOT NULL;

-- 3. Habilitar Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;

-- 4. Remover policies antigas/duplicadas
DROP POLICY IF EXISTS "Cursos visiveis para todos" ON public.cursos;
DROP POLICY IF EXISTS "cursos_public_read" ON public.cursos;
DROP POLICY IF EXISTS "Qualquer um pode inserir lead" ON public.leads;
DROP POLICY IF EXISTS "leads_public_insert" ON public.leads;
DROP POLICY IF EXISTS "anon_select_cursos" ON public.cursos;
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;

-- 5. Políticas para LEADS: anon pode apenas INSERIR (formulário)
-- Sem SELECT/UPDATE/DELETE para proteger dados pessoais dos leads
CREATE POLICY "anon_insert_leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 6. Políticas para CURSOS: anon pode apenas LER (catálogo)
-- Sem INSERT/UPDATE/DELETE para proteger integridade do catálogo
CREATE POLICY "anon_select_cursos"
  ON public.cursos
  FOR SELECT
  TO anon
  USING (true);

-- 7. Garantir permissões de acesso para role anon
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.cursos TO anon;

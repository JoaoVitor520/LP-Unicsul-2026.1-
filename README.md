# Landing Page Unicsul

## Rodando localmente

Pré-requisito: Node.js

1. Instale as dependências:
   `npm install`
2. Crie um arquivo `.env` na raiz com base em `.env.example`.
3. Preencha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_LEADS_TABLE` opcionalmente com `pistas`, se essa for a tabela de inscrições do seu projeto
4. Rode a aplicação:
   `npm run dev`

## Supabase

- O catálogo de cursos é lido de `public.cursos`.
- O formulário tenta salvar na tabela definida em `VITE_SUPABASE_LEADS_TABLE`.
- Se a tabela configurada falhar, o app faz fallback entre `leads` e `pistas`.
- Se sua tabela de inscrições for `pistas`, aplique a policy em `sql/rls_policies_pistas.sql` para permitir `INSERT` com a chave `anon`.

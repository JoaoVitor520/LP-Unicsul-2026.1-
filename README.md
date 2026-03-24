# Landing Page Unicsul

## Rodando localmente

Pre-requisito: Node.js

1. Instale as dependencias:
   `npm install`
2. Crie um arquivo `.env` na raiz com base em `.env.example`.
3. Preencha:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_LEADS_TABLE` opcionalmente com `pistas`, se essa for a tabela de inscricoes do seu projeto
4. Rode a aplicacao:
   `npm run dev`

## Supabase

- O catalogo de cursos e lido de `public.cursos`.
- O formulario tenta salvar na tabela definida em `VITE_SUPABASE_LEADS_TABLE`.
- Se a tabela configurada falhar, o app faz fallback entre `leads` e `pistas`.
- Se sua tabela de inscricoes for `pistas`, aplique a policy em `sql/rls_policies_pistas.sql` para permitir `INSERT` com a chave `anon`.

## Dashboard do Gestor

- URL sugerida: `/gestao/`
- A pagina usa `Supabase Auth` para login do gestor.
- Defina `VITE_DASHBOARD_MANAGER_EMAIL` e/ou `VITE_DASHBOARD_MANAGER_UID` no `.env`.
- Para liberar leitura segura dos leads sem abrir acesso publico, rode `sql/setup_dashboard_manager_access.sql`.
- O dashboard usa a funcao `public.dashboard_list_leads()` com fallback para `SELECT` direto.
- No `Supabase Authentication > Users`, crie ou edite o usuario gestor e defina a senha diretamente por la.
- Nao salve a senha do dashboard no repositório.

### Automacao local

1. Crie `.env.local` com base em `.env.local.example`.
2. Preencha localmente:
   - `SUPABASE_PROJECT_REF`
   - `SUPABASE_MANAGEMENT_TOKEN`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Rode:
   `npm run dashboard:setup`

O script cria ou atualiza o usuario do dashboard no Supabase Auth, aplica o SQL de acesso via Management API, grava as variaveis `VITE_*` localmente e valida login + leitura da tabela `leads`.

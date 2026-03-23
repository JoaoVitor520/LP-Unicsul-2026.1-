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
- Para liberar leitura segura dos leads sem abrir acesso publico, rode `sql/setup_dashboard_manager_access.sql`.
- O dashboard usa a funcao `public.dashboard_list_leads()` com fallback para `SELECT` direto.
- Depois crie o usuario gestor em `Authentication > Users` com:
- e-mail: `jvcabral520@gmail.com`
- senha: `Cruzeiro08`

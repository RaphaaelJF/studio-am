# Entrega para integração no Gravity

Este ZIP já contém o projeto completo e a reconstrução visual do painel. O
Gravity não deve redesenhar, reinterpretar ou substituir a camada visual.

## Ação permitida

1. Substituir/mesclar os arquivos mantendo exatamente a estrutura recebida.
2. Preservar o `.env.local` existente no computador do usuário.
3. Executar `npm ci` somente se as dependências ainda não estiverem instaladas.
4. Executar `npx tsc --noEmit`.
5. Executar uma única vez `npm run build`.
6. Iniciar o projeto e capturar as rotas demonstrativas em desktop e mobile.

## Não fazer

- Não gerar outro layout.
- Não trocar a grade escura por um dashboard branco genérico.
- Não apagar `_reference/`.
- Não alterar Supabase, RLS, migrations ou variáveis de ambiente.
- Não modificar o site público.
- Não substituir imagens locais por URLs externas no painel.

## Rotas para conferência

- `/admin?visual=demo`
- `/admin/projetos?visual=demo`
- `/admin/projetos/demo-andreia-marco/editar?visual=demo`
- `/admin/aparencia?visual=demo`

Compare as capturas com os quatro arquivos em `_reference/`. Build concluído
não é, sozinho, prova de fidelidade visual.

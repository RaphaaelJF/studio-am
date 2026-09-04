# Studio AM — referência visual do painel

Este arquivo impede que a camada administrativa volte a ser tratada como uma
inspiração genérica. A composição foi reconstruída a partir dos quatro recortes
aprovados pelo cliente.

## Arquivos visuais aprovados

- `_reference/01-fluxo-permissoes-tecnologias.png`
- `_reference/02-sidebar-modulos-perfis.png`
- `_reference/03-header-painel.png`
- `_reference/04-telas-principais.png`

Esses arquivos são a fonte de verdade visual. Eles não devem ser substituídos
por referências genéricas nem removidos durante uma mesclagem.

## Geometria de referência

- Conjunto principal: aproximadamente `1445 × 876 px`.
- Cabeçalho: `130 px` de altura.
- Coluna lateral: `224 px` de largura.
- Área clara de trabalho: aproximadamente `1230 × 741 px` na arte original.
- Faixa técnica inferior: proporção de referência `1874 × 201 px`.
- Espaço entre blocos: `14 px`.
- Bordas: `1 px`, discretas.
- Raio dos quadros: `7–8 px`.

## Estrutura obrigatória

1. Marca no canto superior esquerdo.
2. Cabeçalho escuro com nome do painel, quatro benefícios e princípio.
3. Coluna escura com módulos e perfis de acesso.
4. Janela clara para o conteúdo da rota ativa.
5. Etiqueta bege numerada sobre a janela clara.
6. Faixa inferior com fluxo, permissões e tecnologias.

As quatro telas apresentadas na prancha — Dashboard, Projetos, Editor e
Aparência — são rotas do mesmo sistema. Na aplicação real, o conteúdo central
muda conforme a navegação; a moldura escura permanece.

## Paleta extraída da arte

- Fundo externo: `#0A0D10`.
- Superfície escura: `#0C1014`.
- Borda escura: `#3B4044`.
- Texto claro: `#F3F1ED`.
- Bege: `#EAD3B5`.
- Bege claro: `#F5E2C6`.
- Canvas interno: `#F5F5F3`.
- Superfície interna: `#FFFFFF`.
- Texto interno: `#111518`.
- Linha interna: `#E1E1DD`.
- Verde de sucesso: `#48AA70`.

## Regra de implementação

Não substituir esta composição por um dashboard SaaS genérico. Alterações
futuras devem preservar a grade principal, a relação escuro/claro, a densidade,
as etiquetas numeradas e a faixa técnica inferior.

## Conferência antes de concluir

1. Abrir `/admin?visual=demo` em `1440 × 900`.
2. Conferir header, sidebar, janela clara e faixa inferior com os quatro PNGs.
3. Abrir Projetos, Editor e Aparência no mesmo modo demonstrativo.
4. Verificar `390 × 844` sem overflow horizontal.
5. Não considerar somente o build como prova de fidelidade visual.

# STUDIO AM — ESPECIFICAÇÃO DO PROJETO

## 1. Dados do Projeto
- **Nome:** Studio AM
- **Segmento:** Arquitetura + Engenharia
- **Natureza:** Site Institucional e Portfólio Digital Contemporâneo
- **Visão Visual:** "Arquitetura editorial contemporânea com precisão técnica."

## 2. Objetivo
Construir uma presença digital de alto impacto visual e rigor técnico para o Studio AM, apresentando seus projetos de arquitetura e soluções de engenharia com narrativa editorial, composição refinada e navegação responsiva.

## 3. Arquitetura de Páginas e Rotas

| Rota | Descrição | Status Fase 0 |
| --- | --- | --- |
| `/` | Home | Estrutura mínima |
| `/studio` | Apresentação do Studio | Estrutura mínima |
| `/projetos` | Galeria de Projetos | Estrutura mínima |
| `/projetos/[slug]` | Detalhe do Projeto | Estrutura mínima |
| `/metodo` | Processo e Método de Trabalho | Estrutura mínima |
| `/contato` | Canais de Contato | Estrutura mínima |

## 4. Princípios de Desenvolvimento
- **Simplicidade:** Código previsível, modular e sem abstrações prematuras.
- **Rigor Semântico:** Uso correto de tags HTML5, acessibilidade (WCAG) e SEO técnico.
- **Responsividade Nativa:** Layouts construídos para mobile, tablet, desktop e telas wide desde a origem.
- **Separação de Preocupações:** Dados e conteúdos tipados e isolados da camada de apresentação.
- **Zero Dependências Supérfluas:** Ausência de bibliotecas pesadas de UI, animação ou CMS/Backend desnecessários nesta etapa.

## 5. Gestão de Conteúdo e Placeholders
- Os dados de projetos e informações institucionais residem temporariamente em estruturas fortissimas e tipadas TypeScript em `src/data/`.
- Fotografia e mídias de projetos serão integradas em fases dedicadas, utilizando rigorosos critérios de alinhamento visual e proporção editorial.

# STUDIO AM — BUILD PLAN (PLANO DE EXECUÇÃO)

Este documento estabelece o plano de desenvolvimento em Fases incrementais para o site do **Studio AM (Arquitetura + Engenharia)**.

---

## DIRETRIZ FUNDAMENTAL DE RESPONSIVIDADE
A responsividade é implementada **nativamente durante TODAS as fases do projeto** (mobile-first).
A **FASE 9** não é responsável por "tornar o site responsivo", mas sim por auditorias completas em múltiplos dispositivos, validação rigorosa de breakpoints, refinamento de alinhamentos e correções finas.

---

## Fases do Projeto

### FASE 0 — Fundação (CONCLUÍDA)
- Estrutura base de diretórios Next.js com App Router.
- Configuração do TypeScript em modo estrito (`strict: true`).
- Configuração inicial do Tailwind CSS e estrutura de Design Tokens em `src/styles/globals.css`.
- Criação das especificações técnicas centrais (`docs/PROJECT-SPEC.md`, `docs/DESIGN-SYSTEM.md`, `docs/BUILD-PLAN.md`).
- Definição de rotas mínimas e estruturas de dados em `src/data/`.
- Verificação de Lint e Build sem erros.

---

### FASE 1 — Design System V1 (CONCLUÍDA)
- Configuração de fontes do Google (`Cormorant Garamond` e `Manrope`) via `next/font`.
- Definição de tokens de cor, escala tipográfica fluida (`clamp()`), espaçamento vertical de seções e motion tokens em `src/styles/globals.css` e `tailwind.config.ts`.
- Criação dos componentes primitivos puramente Server Components:
  - `Container` (`narrow`, `content`, `wide`, `full`)
  - `Section`
  - `Heading` (separando tag HTML `as` da variante visual `variant`)
  - `Text` (separando tag HTML `as` da variante visual `variant`)
  - `TechnicalLabel` (renomeado para evitar conflito com `<label>` de formulários)
  - `Button` (com `type="button"` por padrão)
  - `EditorialLink` (com `aria-hidden="true"` para a seta indicadora)
- Documentação completa em `docs/DESIGN-SYSTEM.md`.

---

### FASE 2 — Shell Global (CONCLUÍDA)
- `SkipLink` acessível apontando para `#main-content`.
- `SiteHeader` institucional (Server Component, fluxo normal de página, usando Wordmark Manrope "STUDIO AM / Arquitetura + Engenharia").
- `DesktopNavigation` (Server Component com links horizontais e estados de hover/foco).
- `MobileNavigation` (Client Component isolado com `<dialog>` nativo, suporte a tecla Escape, `aria-expanded` e `aria-controls`).
- `SiteFooter` institucional com direitos autorais dinâmicos (`© ${year} Studio AM`).
- Layout base compartilhado (`src/app/layout.tsx`) com `<main id="main-content">`.

---

### FASE 3 — Home (Subdividida)

#### FASE 3A — Primeira impressão
- **Status:** IMPLEMENTADA / AGUARDANDO VALIDAÇÃO VISUAL
- Entregáveis:
  - `HeroSection` (Foco na imagem, composição e alinhamento textual).
  - `ManifestoSection` (Grande área de respiro editorial com grid deslocado).
  - `StudioIntroSection` (Layout editorial assimétrico apresentando Anne Martins com proporção 4:5).

#### FASE 3B — Projetos
- **Status:** BLOQUEADA (Aguardando aprovação visual da Fase 3A)
- Entregáveis:
  - Projetos selecionados.
  - Projeto em evidência.
  - Ritmo fotográfico.

#### FASE 3C — Fechamento
- **Status:** BLOQUEADA
- Entregáveis:
  - Método resumido.
  - Contato.
  - Transição para o rodapé.

---

### FASE 6 — Studio
- Página institucional (`/studio`).
- História, visão, equipe e posicionamento técnico.

---

### FASE 7 — Método
- Página de processos e metodologia (`/metodo`).
- Detalhamento das etapas de projeto de arquitetura e engenharia.

---

### FASE 8 — Contato
- Página de contato (`/contato`).
- Formulário institucional e informações de localização/atendimento.

---

### FASE 9 — Responsividade e Refinamento (Auditoria)
- Auditoria de responsividade em breakpoints mobile, tablet, desktop e wide desktop.
- Polimento de alinhamentos, espaçamentos e comportamentos de tela.

---

### FASE 10 — SEO, Acessibilidade e Performance
- Metadata completa, tags OpenGraph e Twitter Cards.
- Otimização de imagens (`next/image`) e Core Web Vitals.
- Auditoria de acessibilidade (ARIA, contraste, foco, navegação por teclado).

---

### FASE 11 — QA Final
- Testes completos em diferentes navegadores e dispositivos.
- Verificação final de build de produção e rotas.

---

> **Nota:** Painel administrativo e backend/banco de dados permanecem fora deste ciclo inicial.

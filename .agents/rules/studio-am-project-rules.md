---
trigger: always_on
---

# Studio AM — Project Rules

## Mission

This workspace is the official implementation of **Studio AM — Arquitetura + Engenharia**.

The visual direction is already approved.

Your role is to implement, preserve, validate and technically improve the approved experience — NOT to invent another design.

The latest approved Studio AM V2.5 reference is the visual source of truth for the Home.

When information conflicts, use this priority:

1. Current explicit user instruction
2. Approved Studio AM V2.5 visual reference
3. Studio AM project documentation
4. Existing valid implementation
5. General assumptions

Never override higher-priority information with assumptions.

---

## Approved Identity

Studio AM must feel:

- editorial
- architectural
- contemporary
- human
- precise
- technically confident
- sophisticated without ostentation
- minimal without feeling empty
- asymmetric in a controlled way

It must NOT resemble:

- generic architecture template
- SaaS
- dashboard
- startup landing page
- CAD board
- technical report
- construction-company catalog
- real-estate listing
- generic luxury portfolio

The intended perception is:

**a contemporary architecture publication combined with a trustworthy architecture + engineering studio.**

---

## Design Is Frozen

The V2.5 Home direction is approved.

Do NOT redesign or reinterpret it unless explicitly requested.

Do NOT:

- invent another Hero
- reorder sections
- change typography
- change palette
- create a new logo or monogram
- introduce generic cards
- add CAD decoration
- add technical codes or coordinates
- add colorful gradients
- add effects only to appear modern
- replace the editorial visual language

Technical responsive, accessibility and performance corrections are allowed.

Unrequested visual reinterpretation is not.

---

## Home Structure

Preserve this order:

1. Header
2. Hero
3. Manifesto
4. Projetos Selecionados
5. Anne Martins
6. Casa Andreia e Marco — Caso de Estudo
7. Serviços
8. Processo
9. Contato
10. Footer

Do not reorder without explicit approval.

---

## Header

Preserve:

- light warm background
- dark graphite/black text
- independent from Hero
- stable visual identity
- sticky behavior when appropriate

Do NOT use:

- mix-blend-difference
- automatic color inversion
- unpredictable color changes during scroll

Anchor navigation must account for sticky header height.

No section title or important content may be hidden behind the Header.

Use maintainable `scroll-padding`, `scroll-margin` or equivalent behavior and validate desktop + mobile.

---

## Hero

The approved Hero is an **editorial cover**.

Never return to:

**full-screen architectural image with text over the photograph.**

Preserve:

**Arquitetura que conecta.**  
**Engenharia que sustenta.**

Supporting text:

**Projetos residenciais e comerciais personalizados, funcionais e tecnicamente viáveis — pensados para a vida real e para cada etapa da construção.**

Primary CTA:

**Falar sobre meu projeto**

Secondary CTA:

**Conhecer projetos**

Preserve:

- warm light background
- typography-first composition
- supporting copy
- CTAs
- large editorial architectural image below the text

The image complements the identity. It does not replace it.

---

## Typography & Colors

Primary family:

**Montserrat**

Do not introduce serif fonts or parallel typography systems.

Keep small navigation, button, label and footer text readable.

Identity colors are restricted to:

- black
- graphite
- gray
- light gray
- beige
- warm white
- white

Do not introduce unrelated brand colors.

Use reusable design tokens instead of scattered arbitrary values.

---

## Layout

Preserve:

- editorial grid
- strong but purposeful whitespace
- controlled asymmetry
- varied image proportions
- precise alignment
- contrast between light and dark sections

Avoid repetitive equal blocks.

Avoid generic cards.

Do not create excessive vertical empty space only to appear premium.

---

## Projects

Projects are commercial proof, not decoration.

Priority:

1. Casa Andreia e Marco
2. Casa Carlos
3. Casa Cristina de Oliveira

Preserve asymmetric editorial presentation.

Never fabricate:

- location
- area
- year
- status
- client information
- authorship
- photography
- quantitative results

Missing content must use an honest placeholder.

Temporary imagery must be clearly identified:

**Imagem conceitual temporária**

Alt text must also remain honest.

Never present stock imagery as real Studio AM work.

---

## Images

For the real implementation, prefer project-controlled/local assets.

Do not make the final site depend permanently on fragile stock-image URLs.

When appropriate in Next.js:

- use `next/image`
- define dimensions
- use responsive `sizes`
- reserve image space
- optimize loading
- avoid layout shift

Critical above-the-fold imagery must be performance-aware.

Do not hide broken images by removing alt text.

Fix the asset or provide a controlled fallback.

---

## Anne Martins

Confirmed professional identity:

**Anne Martins**  
**Engenheira Civil**

Do NOT call Anne an architect.

Studio AM may communicate Architecture as a field of work, but Anne's professional title must remain accurate.

Until a real professional portrait exists, preserve a neutral placeholder.

Never use a generated or stock woman pretending to be Anne.

Do not publish unconfirmed:

- awards
- certifications
- project totals
- exact experience claims
- registration presentation
- other credentials

Never invent professional information.

---

## Casa Andreia e Marco

This is the strategic reasoning-based case study.

Use the narrative:

**context → challenge → decision → solution/result**

Relevant themes:

- sloped terrain
- real constraints
- architecture + engineering integration
- intelligent use of terrain
- constructible decisions

Do not invent:

- area gained
- savings
- budget
- private values
- unconfirmed quantities

Show competence through reasoning, not self-praise.

---

## Services

Preserve:

1. Projeto Arquitetônico
2. Projetos Complementares
3. Reformas e Regularizações
4. Acompanhamento de Obra

Present them as editorial chapters, not generic cards.

Each service should explain clearly:

- what it is
- what problem it helps solve
- when a client may need it

Technical language must create confidence, not confusion.

---

## Process

Preserve:

1. Conversar e levantar
2. Estudar e desenvolver
3. Aprovar e integrar
4. Acompanhar e orientar

Purpose: reduce client uncertainty.

Approved Step 04:

**Acompanhamos as etapas previstas no escopo, buscando preservar a fidelidade técnica e estética durante a execução.**

Do not use absolute promises such as:

- garantimos
- guarantee
- ensures
- always

unless explicitly approved and supported.

---

## Contact

Preserve the approved dark contact section.

Primary conversion path:

**WhatsApp**

Keep first contact low-friction.

Do not transform this form into the complete briefing.

Basic first-contact fields may include:

- name
- project city
- need/type
- initial message

Detailed briefing belongs to its own flow.

---

## Commercial Principle

The Home should sell without visually behaving like a marketing funnel.

Natural journey:

**identity → clarity → proof → humanity → competence → scope → process → contact**

Avoid:

- fake urgency
- scarcity
- countdowns
- fabricated social proof
- invented statistics
- aggressive CTA repetition

Trust must come from clarity, real work, professional reasoning and presentation quality.

---

## Tone

Use language that is:

- human
- clear
- direct
- welcoming
- didactic
- technically secure

Avoid:

- arrogance
- excessive luxury language
- generic architecture clichés
- unnecessary jargon
- empty marketing phrases

Avoid phrases such as:

- “Transformamos sonhos em realidade.”
- “Excelência em cada detalhe.”
- “Projetos únicos e exclusivos.”

unless explicitly supplied and approved.

---

## Responsiveness

Mobile is NOT just desktop scaled down.

Recompose when necessary while preserving hierarchy.

Validate:

- large desktop
- notebook
- tablet
- common mobile widths

Prevent:

- horizontal overflow
- broken headline wrapping
- unusable touch targets
- desktop asymmetry harming mobile readability

Technical adaptation is allowed.

Visual redesign is not.

---

## Accessibility

Target practical WCAG AA behavior.

Maintain:

- semantic HTML
- one page H1
- correct heading hierarchy
- keyboard navigation
- visible focus
- real labels
- sufficient contrast
- truthful alt text
- usable forms
- comfortable touch targets
- reduced-motion support when applicable

Do not rely exclusively on hover.

---

## Motion

Motion must remain subtle.

Allowed when useful:

- opacity
- small translations
- restrained hover states
- gentle image transitions

Avoid:

- scroll hijacking
- aggressive parallax
- cursor-following effects
- constant animations
- large zoom effects
- decorative movement without UX value

---

## Performance

Prefer:

- optimized images
- minimal client JavaScript
- existing platform capabilities
- lightweight interaction
- project-controlled assets

Avoid unnecessary:

- animation libraries
- carousel libraries
- large UI dependencies
- WebGL
- Canvas
- autoplay video backgrounds

Do not sacrifice Core Web Vitals for decoration.

---

## Next.js Integrity

The existing project architecture must be preserved.

The Figma Make prototype is a **visual reference**, not the technical architecture.

Do NOT rebuild the real project as Vite because the prototype used Vite.

Preserve the existing Next.js architecture unless migration is explicitly requested.

Reuse compatible:

- components
- layouts
- utilities
- tokens
- typed data
- conventions

Do not duplicate systems unnecessarily.

---

## Content Architecture

Centralize content whenever practical.

Prefer typed data structures for:

- projects
- services
- professional information
- temporary/final asset state

Final client assets should be replaceable without rebuilding page structure.

---

## No Invented Facts

Never fabricate:

- projects
- cities
- areas
- dates
- status
- testimonials
- awards
- statistics
- contact information
- professional credentials
- technical results

If required information is unavailable:

use an explicit placeholder or ask the user.

---

## Change Discipline

Before editing:

1. identify requested scope
2. inspect relevant files
3. understand current implementation
4. locate reusable solutions
5. make the smallest safe change

Do not modify unrelated sections.

Do not perform unsolicited cleanup or redesign.

Do not rename/move files unnecessarily.

---

## Visual Validation

When implementing approved sections, compare with V2.5.

Check:

- typography
- alignment
- spacing
- image proportions
- section order
- light/dark transitions
- CTA hierarchy
- responsive behavior

A successful build alone does not mean the visual implementation is complete.

---

## Validation

During focused work use targeted validation.

After meaningful phases check as appropriate:

- lint
- typecheck
- build
- responsive behavior
- browser console

Do not repeatedly run full builds after every small visual edit.

Never suppress errors just to pass validation.

---

## Definition of Done

A task is complete only when:

- requested scope is implemented
- approved design is preserved
- responsive behavior works
- interactions work
- no relevant overflow exists
- accessibility is not degraded
- relevant validation passes
- no project fact was invented

Report unresolved issues clearly.

---

## Final Rule

**Preserve the approved design. Improve the engineering.**

When choosing between:

A. a technically strong implementation faithful to V2.5

and

B. a more creative implementation that changes V2.5

choose **A**.

If an unrequested design change appears desirable, suggest it separately and wait for approval.
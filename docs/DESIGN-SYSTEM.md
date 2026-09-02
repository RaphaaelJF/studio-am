# STUDIO AM — DESIGN SYSTEM V1

## 1. Conceito Visual Definitivo
**"Arquitetura editorial contemporânea com precisão técnica."**

A identidade do Studio AM equilibra dois pilares:
- **ARQUITETURA:** Fotografia protagonista, espaço negativo intencional, proporção editorial, valorização da luz e materialidade, narrativa visual e emoção.
- **ENGENHARIA:** Precisão técnica, alinhamentos estritos no grid, hierarquia clara de metadados, estrutura lógica, legibilidade e organização das informações.

O design evita ostentação cromática, sombras pesadas ou estéticas típicas de SaaS, startups, construtoras genéricas ou portfólios digitais saturados.

---

## 2. Color System
Paleta estritamente atemporal sem cor de destaque (accent color) cromática nesta versão. A fotografia dos projetos fornece as variações de cor naturais.

| Token | Valor Hex | Aplicação |
| --- | --- | --- |
| `--color-background` | `#F2EFE8` | Fundo principal da página (tom mineral quente) |
| `--color-surface` | `#E9E5DD` | Superfície secundária e containers destacados |
| `--color-foreground` | `#1A1917` | Texto principal e elementos de contraste |
| `--color-muted` | `#716E68` | Texto secundário, legendas e metadados |
| `--color-border` | `#D4CFC6` | Linhas técnicas, bordas de grids e divisores |
| `--color-dark` | `#171614` | Seções com fundo escuro e botões primários |
| `--color-on-dark` | `#F3F0E9` | Texto sobre fundo escuro |

---

## 3. Tipografia

### Display / Editorial Serif
- **Família:** `Cormorant Garamond` (via `next/font/google`)
- **Variável CSS:** `--font-display`
- **Uso:** Títulos principais, manifestos institucionais, nomes de projetos, destaques editoriais.

### Sans / Interface & Corpo
- **Família:** `Manrope` (via `next/font/google`)
- **Variável CSS:** `--font-sans`
- **Uso:** Texto corrido, navegação, labels técnicos, fichas técnicas, botões, metadados.

*Nota:* Não é utilizada fonte monospace. A precisão técnica é transmitida por grid, alinhamento, espaçamento, labels e hierarquia.

---

## 4. Escala Tipográfica Fluida

| Variante | Classe / Estilo | Proporção / Fluid Range (`clamp`) | Aplicação |
| --- | --- | --- | --- |
| `display-xl` | `font-display` | `clamp(3.75rem, 7vw, 7.5rem)` | Hero, frases de manifesto de altíssimo impacto |
| `display-lg` | `font-display` | `clamp(3rem, 5.5vw, 6rem)` | Títulos de grandes seções editoriais |
| `heading-1` | `font-display` | `clamp(2.75rem, 4.5vw, 4.75rem)` | H1 das páginas principais |
| `heading-2` | `font-display` | `clamp(2.25rem, 3.5vw, 3.75rem)` | H2 de blocos e títulos de projetos |
| `heading-3` | `font-display` | `clamp(1.75rem, 2.5vw, 2.5rem)` | H3 de subseções |
| `body-lg` | `font-sans` | `1.125rem` – `1.25rem` | Introduções de parágrafos e resumos |
| `body` | `font-sans` | `1rem` | Texto corrido principal |
| `body-sm` | `font-sans` | `0.875rem` | Detalhes secundários e fichas técnicas |
| `label` | `font-sans` | `0.75rem` (uppercase) | Metadados, categorias, especificações técnicas |
| `caption` | `font-sans` | `0.75rem` | Legendas de fotos e notas de rodapé |

---

### Technical Labels
- **Componente Primitive:** `TechnicalLabel`
- **Base:** Manrope (Sans)
- **Transformação:** Visual via CSS (`text-transform: uppercase`)
- **Estilo:** Pequeno (`0.75rem`), peso médio (`font-medium`), espaçamento entre letras discreto (`tracking-wider` / `0.08em`).
- **Exemplo de apresentação:** `RESIDENCIAL · LONDRINA · PR · 2026`

---

## 6. Spacing System
Escala estrita de tokens numéricos: `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `96px`, `120px`, `160px`.

## 7. Section Spacing
Espaçamento vertical fluido de seções:
- **Mobile:** `72px` – `96px`
- **Desktop:** `120px` – `160px`
- **Variável Fluid:** `clamp(4.5rem, 10vw, 10rem)`

---

## 8. Grid System
Alinhamento baseado no breakpoint do dispositivo:
- **Mobile:** 4 colunas
- **Tablet:** 8 colunas
- **Desktop / Wide:** 12 colunas

---

## 9. Containers

| Variante | Largura Máxima | Finalidade |
| --- | --- | --- |
| `narrow` | `760px` | Leitura editorial densa, manifestos, textos institucionais |
| `content` | `1280px` | Largura padrão para conteúdos gerais e navegação |
| `wide` | `1440px` | Portfólio, grids amplos de imagens de projetos |
| `full` | `100%` (`w-full`) | Seções estendidas sem max-width (sem `100vw` para evitar overflow) |

---

## 10. Bordas e Radius
- **Espessura:** `1px` (`border-border`)
- **Radius Padrão:** `0px` (cantos retos técnicos)
- **Exceção Máxima Permitida:** `2px` (apenas para foco interativo)

---

## 11. Botões e Links

### Button Primary
Fundo escuro (`#171614`), texto claro (`#F3F0E9`), cantos retos (`rounded-none`), área de toque adequada, transição suave em hover.

### Button Secondary
Fundo transparente, borda fina (`#D4CFC6`), texto principal (`#1A1917`), cantos retos (`rounded-none`).

### Editorial Link
Link textual de alta elegância editorial com seta técnica de navegação (ex: `Explorar projeto →`).

---

## 12. Fotografia Architecture System
- **Ratios Permitidos:** `16:10`, `3:2`, `4:5`, `1:1`, `full-bleed`.
- **Regras:** Luz natural preservada, sem filtros artificiais, sem overlays pesados, integração com `next/image`.

---

## 13. Motion Tokens
- `--transition-fast`: `180ms ease-out`
- `--transition-normal`: `280ms ease-out`
- `--transition-slow`: `480ms ease-out`
- **Foco:** Opacidade e micro-deslocamento transform sutil. Proibido bounce, 3D ou parallax exagerado.

---

## 14. Regras de Composição
1. Fotografia como protagonista visual.
2. Assimetria editorial intencional e alinhada ao grid.
3. Respiro e espaço negativo intencional.
4. Engenharia presente pela precisão dos alinhamentos e tipografia estruturada.
5. Foco em cada seção sem sobrecarga visual.

---

## 14.1 Project Presentation Patterns
- dominant landscape
- offset portrait
- featured technical
- allowed aspect ratios (`16/10`, `3/2`, `4/5`)
- metadata behavior (label, technical block)
- spacing rules (grid offsets, vertical gaps)

## 15. Elementos Proibidos
Nenhum dos seguintes itens é permitido no projeto:
- Glassmorphism ou neomorphism
- Gradientes decorativos de produtos SaaS
- Cards coloridos com sombras elevadas
- Pill buttons e grandes border-radius (`rounded-full`, `rounded-xl`, `rounded-2xl`)
- Ícones genéricos decorativos
- Contadores animados ou estatísticas comerciais
- Sliders/carrosséis automáticos
- Elementos CAD/blueprint fictícios decorativos
- Cor dourada de "luxo" artificial
- Estética de terminal / fonte mono

# AI Engineer Portfolio Redesign

## Objective

Reposition Fernando Felippe's static portfolio toward AI Engineering while preserving its restrained engineering aesthetic, GitHub Pages compatibility, accessibility, progressive enhancement, and HTML/CSS/ES-module architecture.

## Experience

The page keeps a graphite background, warm white type, amber accents, Space Grotesk, IBM Plex Mono, technical grids, connections, nodes, and procedural construction. The visual language communicates systems being assembled rather than generic futuristic decoration.

The header contains the existing mark, Fernando Felippe's name, links to Inicio, Sobre, Competencias, Projetos, and Contato, plus a relative CV link to `docs/Fernando-Felippe-CV.pdf`. The missing PDF is an explicit deployment notice, not a generated artifact.

The hero presents Fernando Felippe as an AI Engineer, names the focus stack, highlights problem solving and impact, and uses a restrained procedural system diagram. The about section preserves `images/Foto.jpg`, accurately frames a software developer building an AI Engineering specialization, and presents AI, software, and data pillars. Skills are grouped into AI Engineering, Backend & APIs, Data, and Software Engineering without proficiency claims.

Lexora, Talentos Barbearia, and the Process section are removed. Projects becomes an honest coming-soon state with a lightweight CSS procedural construction. Contact retains the existing email, LinkedIn, GitHub, and WhatsApp. The footer contains identity, core navigation, LinkedIn, and GitHub.

## Behavior

Navigation remains usable without JavaScript and becomes a keyboard-accessible mobile disclosure when JavaScript is available. Reveal effects and both terminal cursors respect reduced motion. The preloader exits on load, exits immediately for an already complete document, and uses a short safety fallback. The Canvas retains bounded mobile density, capped DPR, page-visibility pause, and coarse-pointer safeguards.

## Architecture

`index.html` remains the only page. The six existing CSS files retain their responsibilities. `main.js` orchestrates `navigation.js`, `reveal.js`, and `technical-canvas.js`; no new module or dependency is required. Local asset paths remain relative for GitHub Project Pages.

## Verification

The Node test suite validates semantic structure, new positioning, removed content, contact and CV links, mobile navigation, reduced motion, Canvas limits, corrected preloader behavior, and local references. `npm test` and `npm run validate` must pass before completion.


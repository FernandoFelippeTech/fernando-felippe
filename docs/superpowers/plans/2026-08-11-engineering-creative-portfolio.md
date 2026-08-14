# Portfólio Engenharia Criativa — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular o portfólio de Fernando Felippe com a identidade autoral “Engenharia Criativa”, mantendo HTML/CSS/JavaScript puro, desempenho mobile e publicação no GitHub Pages.

**Architecture:** O HTML permanece semântico e utilizável sem JavaScript. O CSS atual será substituído por arquivos separados por responsabilidade, agregados por `css/style.css`. JavaScript será dividido em módulos independentes para navegação, revelação/preloader e Canvas; todos os efeitos são aprimoramentos progressivos e respeitam movimento reduzido.

**Tech Stack:** HTML5, CSS moderno, SVG, JavaScript ES modules, Canvas 2D, Node.js `node:test`, GitHub Pages

## Global Constraints

- Não adicionar React, Three.js, bundler ou dependência de runtime.
- Paleta: grafite quase preto, branco quente, cinza metálico e âmbar elétrico; remover ciano/roxo/rosa.
- Hero sem foto, com “Explorar projetos” e “Entrar em contato”.
- Foto somente na seção Sobre.
- Lexora e Talentos Barbearia usam o mesmo layout e exibem “Em desenvolvimento”.
- Não publicar métricas, clientes, resultados ou links de demonstração inventados.
- Não adicionar download de currículo.
- Conteúdo e navegação principal devem funcionar sem JavaScript.
- Respeitar `prefers-reduced-motion` e simplificar efeitos em dispositivos móveis.
- Preservar e-mail, LinkedIn, GitHub e WhatsApp já presentes; links externos abrem com proteção `noopener noreferrer`.
- Trabalhar em branch separada e abrir Pull Request contra `main` somente após testes e revisão.

---

## File Map

- `index.html` — conteúdo semântico, metadados, marcação de todas as seções e fallback sem JavaScript.
- `images/ff-mark.svg` — novo monograma geométrico reutilizado por preloader, header e rodapé.
- `css/style.css` — agregador dos módulos CSS.
- `css/base.css` — tokens, reset, tipografia, acessibilidade e layout global.
- `css/components.css` — header, navegação, botões, chips, cards e rodapé.
- `css/sections.css` — hero, sobre, projetos, competências, processo e contato.
- `css/motion.css` — preloader, reveal, parallax visual e movimento reduzido.
- `css/responsive.css` — breakpoints e simplificação mobile.
- `js/main.js` — inicialização defensiva dos módulos.
- `js/navigation.js` — menu acessível, scroll suave e seção ativa.
- `js/reveal.js` — preloader curto e IntersectionObserver.
- `js/technical-canvas.js` — fundo técnico Canvas, ponteiro, pausa e controle de densidade.
- `tests/portfolio.test.mjs` — contrato estrutural, conteúdo e requisitos visuais/acessíveis.
- `scripts/check-local-links.mjs` — valida arquivos locais e âncoras internas.
- `package.json` — comandos `test` e `validate` sem dependências.
- `README.md` — execução local, validação e publicação.

### Task 1: Criar a rede de segurança do portfólio estático

**Files:**
- Create: `package.json`
- Create: `tests/portfolio.test.mjs`
- Create: `scripts/check-local-links.mjs`

**Interfaces:**
- Produces: `npm test`, `npm run validate`, função CLI que falha para arquivo local ou âncora ausente.
- Consumes: `index.html`, folhas CSS e módulos JS presentes no repositório.

- [ ] **Step 1: Criar o teste contratual inicialmente vermelho**

O teste deve ler arquivos com `readFileSync` e afirmar, no mínimo:

```js
assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/);
assert.match(html, /<main id="main-content">/);
assert.match(html, />Lexora</);
assert.match(html, />Talentos Barbearia</);
assert.equal((html.match(/Em desenvolvimento/g) ?? []).length, 2);
assert.doesNotMatch(html, /Projeto 0[123]|Em breve, cases|gradient-text/);
assert.match(html, /href="#projects"[^>]*>\s*Explorar projetos/);
assert.match(html, /href="#contact"[^>]*>\s*Entrar em contato/);
assert.match(html, /id="skills"/);
assert.match(html, /id="process"/);
assert.match(css, /--color-accent:\s*#f5a623/i);
assert.match(motionCss, /prefers-reduced-motion:\s*reduce/);
assert.match(canvasJs, /visibilitychange/);
assert.doesNotMatch(css, /#00d4ff|#7b2ff7|#f472b6/i);
```

Também validar que todo `target="_blank"` contém `rel="noopener noreferrer"` e que existe apenas um `h1`.

- [ ] **Step 2: Executar e confirmar falha**

```bash
node --test tests/portfolio.test.mjs
```

Expected: FAIL porque a identidade, seções e arquivos novos ainda não existem.

- [ ] **Step 3: Criar o validador de links locais**

`scripts/check-local-links.mjs` deve:

1. ler `index.html`;
2. coletar `href` e `src` com expressão regular;
3. ignorar `http`, `https`, `mailto`, `tel` e `wa.me`;
4. validar que cada `#id` existe no HTML;
5. remover query/hash de caminhos locais e validar com `existsSync`;
6. imprimir todos os erros e definir `process.exitCode = 1` quando houver falhas;
7. imprimir `Local links OK` quando tudo estiver válido.

- [ ] **Step 4: Criar comandos sem dependências**

```json
{
  "name": "fernando-felippe-portfolio",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "validate": "npm test && node scripts/check-local-links.mjs"
  }
}
```

- [ ] **Step 5: Commit da rede de segurança**

```bash
git add package.json tests/portfolio.test.mjs scripts/check-local-links.mjs
git commit -m "test: define portfolio redesign contract"
```

### Task 2: Substituir marcação, conteúdo e marca visual

**Files:**
- Create: `images/ff-mark.svg`
- Modify: `index.html`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Produces: IDs `main-content`, `hero`, `about`, `projects`, `skills`, `process`, `contact`; menu button `.menu-toggle`; painel `#mobile-menu`; elementos `[data-reveal]`; Canvas `#technical-canvas`.
- Consumes: links de contato existentes e `images/Foto.jpg`.

- [ ] **Step 1: Criar o novo monograma SVG**

Criar `images/ff-mark.svg` com `viewBox="0 0 64 64"`, título acessível “Fernando Felippe”, traços geométricos sólidos em `currentColor`, duas construções angulares que formem “FF” sem simples espelhamento, e um pequeno nó âmbar representado por círculo. Não usar gradiente.

- [ ] **Step 2: Reescrever o documento semântico**

O `body` deve seguir esta ordem exata:

```html
<a class="skip-link" href="#main-content">Pular para o conteúdo</a>
<div id="preloader" aria-hidden="true">...</div>
<canvas id="technical-canvas" aria-hidden="true"></canvas>
<header>...</header>
<main id="main-content">
  <section id="hero">...</section>
  <section id="about">...</section>
  <section id="projects">...</section>
  <section id="skills">...</section>
  <section id="process">...</section>
  <section id="contact">...</section>
</main>
<footer>...</footer>
<script type="module" src="js/main.js"></script>
```

Menu desktop e mobile devem conter Início, Sobre, Projetos, Competências, Processo e Contato. O botão mobile deve iniciar com `aria-expanded="false"`, `aria-controls="mobile-menu"` e rótulo “Abrir menu”.

- [ ] **Step 3: Aplicar copy aprovada do hero e Sobre**

Usar exatamente:

```text
Etiqueta: ENGENHARIA CRIATIVA • FULL STACK
Título: Fernando Felippe
Cargo: Desenvolvedor Full Stack
Resumo: Transformo problemas em produtos digitais claros, robustos e memoráveis — da interface à arquitetura.
CTAs: Explorar projetos | Entrar em contato
Sobre — título: Código com intenção. Experiências com estrutura.
Sobre — corpo: Uno desenvolvimento e pensamento visual para construir aplicações que funcionam bem, comunicam com clareza e evoluem com segurança.
```

A foto deve ter `width="768"`, `height="1376"`, `loading="lazy"` e alt “Fernando Felippe, desenvolvedor full stack”.

- [ ] **Step 4: Criar os dois cards de projeto com estrutura idêntica**

Ambos usam `article.project-card`, `.project-status`, `.project-problem`, `.project-features`, `.project-stage` e `.project-tags`.

Lexora:

```text
Status: Em desenvolvimento
Problema: Tornar o estudo de idiomas mais estruturado, pessoal e consistente.
Funcionalidades: vocabulário por contexto; revisão espaçada; progresso de aprendizagem.
Estágio: Arquitetura e experiência principal em evolução.
Tecnologias: TypeScript, React, SQLite, Prisma
```

Talentos Barbearia:

```text
Status: Em desenvolvimento
Problema: Simplificar a descoberta de serviços e o agendamento pelo celular.
Funcionalidades: seleção de serviços; calendário e horários; gestão de agendamentos.
Estágio: Fluxo de agendamento e experiência mobile em refinamento.
Tecnologias: React, TypeScript, UX Mobile, Design Responsivo
```

Não inserir links de demo ou repositório nesses cards.

- [ ] **Step 5: Criar Competências, Processo e Contato**

Competências, em quatro grupos: Interfaces (`HTML`, `CSS`, `JavaScript`, `React`), Aplicações (`TypeScript`, `Next.js`, `Node.js`), Dados (`SQLite`, `Prisma`, `APIs`) e Qualidade (`Responsividade`, `Acessibilidade`, `Testes`).

Processo: quatro etapas numeradas — Entender, Estruturar, Construir, Validar — cada uma com uma frase objetiva.

Contato deve manter e-mail, LinkedIn, GitHub `https://github.com/FernandoFelippeTech` e WhatsApp existente. Remover o formulário falso e substituí-lo por painel com CTA `mailto:fernandofelippe2018@gmail.com`.

- [ ] **Step 6: Executar testes de conteúdo e links**

```bash
npm run validate
```

Expected: testes visuais/JS ainda falham porque CSS e módulos restantes não existem; assertions de HTML, conteúdo e links passam.

- [ ] **Step 7: Commit do conteúdo semântico**

```bash
git add index.html images/ff-mark.svg tests/portfolio.test.mjs
git commit -m "feat: rebuild portfolio content and identity"
```

### Task 3: Implementar o sistema visual Engenharia Criativa

**Files:**
- Replace: `css/style.css`
- Create: `css/base.css`
- Create: `css/components.css`
- Create: `css/sections.css`
- Create: `css/motion.css`
- Create: `css/responsive.css`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Consumes: classes e IDs produzidos pela Task 2.
- Produces: tokens CSS aprovados, layout desktop/mobile, estados de foco/hover e fallback de movimento reduzido.

- [ ] **Step 1: Transformar `style.css` em agregador**

```css
@import url("./base.css");
@import url("./components.css");
@import url("./sections.css");
@import url("./motion.css");
@import url("./responsive.css");
```

- [ ] **Step 2: Implementar tokens e base**

`base.css` deve declarar:

```css
:root {
  --color-bg: #090a0c;
  --color-surface: #111318;
  --color-surface-raised: #181b21;
  --color-text: #f2efe8;
  --color-text-muted: #9a9ca3;
  --color-accent: #f5a623;
  --color-accent-soft: rgba(245, 166, 35, 0.14);
  --color-line: rgba(242, 239, 232, 0.12);
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  --content-width: 1200px;
}
```

Adicionar reset, `color-scheme: dark`, seleção âmbar, `.container`, `.eyebrow`, `.section-heading`, `.skip-link`, `:focus-visible` com outline âmbar e fundo quadriculado discreto no `body` usando dois linear-gradients monocromáticos.

- [ ] **Step 3: Implementar componentes**

`components.css` cobre header translúcido, marca, navegação, menu mobile, botões angulares, chips monoespaçados, cards, status, links de contato e rodapé. Botões e cards usam cantos pequenos/chanfrados, não pills genéricos. Hover de card usa `--pointer-x` e `--pointer-y` com radial-gradient âmbar, mas permanece legível sem essas variáveis.

- [ ] **Step 4: Implementar seções**

`sections.css` deve criar:

- hero em grid 7/5 colunas, texto à esquerda e `.hero-construct` à direita;
- construct com três planos CSS 3D e linhas de medição, sem imagem raster;
- Sobre em duas colunas, foto com moldura técnica e índice “01”;
- projetos em grid de duas colunas, visuais abstratos distintos construídos com CSS;
- competências em quatro módulos;
- processo como linha de quatro etapas;
- contato em composição assimétrica com CTA amplo.

- [ ] **Step 5: Implementar movimento e responsividade**

`motion.css` contém preloader de no máximo 900 ms após `load`, transições `[data-reveal]`, animação sutil do construct e estados `.is-visible`. Adicionar bloco:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  #technical-canvas { display: none; }
  [data-reveal] { opacity: 1; transform: none; }
}
```

`responsive.css` usa breakpoints em `960px`, `720px` e `480px`; colapsa grids, oculta linhas 3D secundárias, mantém CTAs com pelo menos 44px e impede overflow horizontal.

- [ ] **Step 6: Executar contrato CSS**

```bash
npm test
```

Expected: assertions CSS passam; assertions JavaScript restantes ainda falham.

- [ ] **Step 7: Commit do sistema visual**

```bash
git add css tests/portfolio.test.mjs
git commit -m "feat: implement engineering creative visual system"
```

### Task 4: Implementar interações progressivas e Canvas técnico

**Files:**
- Replace: `js/main.js`
- Create: `js/navigation.js`
- Create: `js/reveal.js`
- Create: `js/technical-canvas.js`
- Test: `tests/portfolio.test.mjs`

**Interfaces:**
- Produces: `initNavigation()`, `initReveal()`, `initTechnicalCanvas()`.
- Consumes: seletores da Task 2 e estados CSS da Task 3.

- [ ] **Step 1: Implementar navegação acessível**

`initNavigation()` deve retornar silenciosamente se elementos não existirem; alternar `.is-open`, `aria-expanded` e rótulo Abrir/Fechar menu; fechar com Escape, clique em link e clique fora; restaurar foco ao botão; marcar `.is-active` via IntersectionObserver; não impedir navegação padrão quando APIs não existirem.

- [ ] **Step 2: Implementar preloader e reveal**

`initReveal()` deve remover o preloader em `load` ou imediatamente se `document.readyState === "complete"`, usando atraso máximo de 900 ms. Em movimento reduzido, revela tudo imediatamente. Sem IntersectionObserver, aplica `.is-visible` diretamente.

- [ ] **Step 3: Implementar Canvas limitado**

`initTechnicalCanvas()` deve:

- encerrar imediatamente em movimento reduzido ou Canvas indisponível;
- limitar `devicePixelRatio` a 1.5;
- desenhar no máximo 42 nós no desktop e 18 no mobile;
- usar apenas linhas grafite e poucos nós âmbar;
- reagir suavemente ao ponteiro sem seguir toque;
- pausar `requestAnimationFrame` quando `document.hidden`;
- reiniciar ao voltar para a aba;
- recalcular com resize debounced;
- expor cleanup interno para cancelar frame e listeners quando necessário.

- [ ] **Step 4: Adicionar iluminação dos cards**

No `main.js`, registrar `pointermove` apenas quando `(hover: hover) and (pointer: fine)` for verdadeiro. Atualizar `--pointer-x`/`--pointer-y` por card usando coordenadas locais. Não adicionar listeners em dispositivos touch.

- [ ] **Step 5: Inicializar módulos defensivamente**

```js
import { initNavigation } from "./navigation.js";
import { initReveal } from "./reveal.js";
import { initTechnicalCanvas } from "./technical-canvas.js";

initNavigation();
initReveal();
initTechnicalCanvas();
```

Adicionar a inicialização de iluminação após os três módulos.

- [ ] **Step 6: Executar validação completa**

```bash
npm run validate
```

Expected: todos os testes e links passam.

- [ ] **Step 7: Commit das interações**

```bash
git add js tests/portfolio.test.mjs
git commit -m "feat: add progressive portfolio interactions"
```

### Task 5: QA, documentação e preparação do Pull Request

**Files:**
- Modify: `README.md`
- Modify: arquivos de implementação somente se a verificação revelar defeitos.

**Interfaces:**
- Consumes: página final das Tasks 1–4.
- Produces: documentação reproduzível, evidência visual e branch pronta para review.

- [ ] **Step 1: Atualizar README**

Documentar objetivo, stack sem dependências, estrutura de arquivos, execução `python -m http.server 8000`, validação `npm run validate`, URL local `http://localhost:8000` e publicação automática pelo GitHub Pages.

- [ ] **Step 2: Rodar verificações automatizadas**

```bash
npm run validate
git diff --check
```

Expected: exit 0 e nenhum erro de whitespace.

- [ ] **Step 3: Fazer QA visual em servidor local**

Executar servidor e conferir em 1440×900, 390×844 e 360×800:

- sem overflow horizontal;
- hero e CTAs visíveis;
- dois projetos com status correto;
- menu mobile abre, fecha, responde a Escape e mantém foco;
- foco por teclado visível;
- conteúdo legível com JavaScript desabilitado;
- movimento reduzido remove Canvas/animações;
- foto carrega sem distorção;
- nenhum erro no console.

Salvar capturas desktop e mobile em `.artifacts/portfolio-desktop.png` e `.artifacts/portfolio-mobile.png`; manter `.artifacts/` fora do commit.

- [ ] **Step 4: Fazer revisão de escopo**

```bash
git diff origin/main...HEAD --stat
git diff origin/main...HEAD -- index.html css js images/ff-mark.svg package.json tests scripts README.md
```

Expected: somente portfólio, testes, documentação e assets aprovados; nenhum currículo, framework, biblioteca 3D ou link falso.

- [ ] **Step 5: Commit de documentação**

```bash
git add README.md
git commit -m "docs: document portfolio development workflow"
```

- [ ] **Step 6: Revisão final e publicação**

Usar `superpowers:requesting-code-review`, corrigir findings importantes, executar `superpowers:verification-before-completion`, enviar `redesign/engineering-creative` e abrir Pull Request em modo draft contra `main` com resumo visual, testes e checklist mobile/acessibilidade.

## Final Acceptance Check

- [ ] Identidade genérica removida e sistema Engenharia Criativa consistente.
- [ ] Hero sem foto, Sobre com foto e dois CTAs corretos.
- [ ] Lexora e Talentos compartilham layout e status “Em desenvolvimento”.
- [ ] Competências, Processo e Contato completos.
- [ ] Sem formulário falso, currículo, métricas ou demos inventadas.
- [ ] Conteúdo principal funciona sem JavaScript.
- [ ] Menu, foco, movimento reduzido e Canvas atendem a especificação.
- [ ] `npm run validate` e `git diff --check` passam.
- [ ] QA desktop/mobile concluído sem overflow ou erro de console.
- [ ] Pull Request draft aberto contra `main`; nenhum merge automático.

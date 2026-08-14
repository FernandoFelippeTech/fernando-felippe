import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));

function readProjectFile(relativePath) {
  const filePath = resolve(projectRoot, relativePath);
  assert.ok(existsSync(filePath), `Expected redesign file ${relativePath} to exist`);
  return readFileSync(filePath, 'utf8');
}

function extractArticle(html, title) {
  const articles = html.match(/<article\b[\s\S]*?<\/article>/gi) ?? [];
  const article = articles.find((candidate) => candidate.includes(`>${title}<`));

  assert.ok(article, `Expected a project article for ${title}`);
  return article;
}

function createClassList(initial = []) {
  const values = new Set(initial);

  return {
    add(...tokens) {
      tokens.forEach((token) => values.add(token));
    },
    contains(token) {
      return values.has(token);
    },
    remove(...tokens) {
      tokens.forEach((token) => values.delete(token));
    },
    toggle(token, force) {
      const nextValue = force ?? !values.has(token);
      if (nextValue) values.add(token);
      else values.delete(token);
      return nextValue;
    },
  };
}

function createEventTarget(properties = {}) {
  const listeners = new Map();
  const target = {
    ...properties,
    addEventListener(type, listener) {
      const typeListeners = listeners.get(type) ?? new Set();
      typeListeners.add(listener);
      listeners.set(type, typeListeners);
    },
    emit(type, event = {}) {
      const emittedEvent = { target, ...event };
      for (const listener of listeners.get(type) ?? []) listener(emittedEvent);
      return emittedEvent;
    },
    listenerCount(type) {
      return listeners.get(type)?.size ?? 0;
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
  };

  return target;
}

function createElement(attributes = {}) {
  const attributeValues = new Map(Object.entries(attributes));
  const descendants = new Set();
  const element = createEventTarget({
    classList: createClassList(),
    focusCount: 0,
    getAttribute(name) {
      return attributeValues.get(name) ?? null;
    },
    setAttribute(name, value) {
      attributeValues.set(name, String(value));
    },
    contains(candidate) {
      return candidate === element || descendants.has(candidate);
    },
    focus() {
      element.focusCount += 1;
    },
  });

  return element;
}

function createCanvasFixture({
  devicePixelRatio = 2,
  finePointer = true,
  height = 800,
  reducedMotion = false,
  width = 1200,
} = {}) {
  const animationFrames = new Map();
  const timers = new Map();
  let nextAnimationFrameId = 0;
  let nextTimerId = 0;
  const context = {
    arcs: 0,
    fillStyles: [],
    strokeStyles: [],
    arc() {
      this.arcs += 1;
    },
    beginPath() {},
    clearRect() {},
    fill() {
      this.fillStyles.push(this.fillStyle);
    },
    lineTo() {},
    moveTo() {},
    setTransform(...values) {
      this.transform = values;
    },
    stroke() {
      this.strokeStyles.push(this.strokeStyle);
    },
  };
  const canvas = createElement();
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height });
  canvas.getContext = () => context;
  const documentRef = createEventTarget({
    hidden: false,
    getElementById(id) {
      return id === 'technical-canvas' ? canvas : null;
    },
  });
  const windowRef = createEventTarget({
    devicePixelRatio,
    innerHeight: height,
    innerWidth: width,
    cancelAnimationFrame(id) {
      animationFrames.delete(id);
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    matchMedia(query) {
      if (query.includes('prefers-reduced-motion')) return { matches: reducedMotion };
      return { matches: finePointer };
    },
    requestAnimationFrame(callback) {
      const id = ++nextAnimationFrameId;
      animationFrames.set(id, callback);
      return id;
    },
    setTimeout(callback, delay) {
      const id = ++nextTimerId;
      timers.set(id, { callback, delay });
      return id;
    },
  });

  return {
    animationFrames,
    canvas,
    context,
    documentRef,
    timers,
    windowRef,
    runAnimationFrame(time = 16) {
      const [id, callback] = animationFrames.entries().next().value;
      animationFrames.delete(id);
      callback(time);
    },
    runTimer() {
      const [id, timer] = timers.entries().next().value;
      timers.delete(id);
      timer.callback();
      return timer.delay;
    },
  };
}

test('portfolio exposes the approved semantic content and navigation', () => {
  const html = readProjectFile('index.html');

  assert.match(html, /<a[^>]+class="skip-link"[^>]+href="#main-content"/);
  assert.match(html, /<main id="main-content">/);
  assert.match(html, />Lexora/);
  assert.match(html, />Talentos Barbearia/);
  assert.equal((html.match(/Em desenvolvimento/g) ?? []).length, 2);
  assert.doesNotMatch(html, /Projeto 0[123]|Em breve, cases|gradient-text/);
  assert.match(html, /href="#projects"[^>]*>\s*Explorar projetos/);
  assert.match(html, /href="#contact"[^>]*>\s*Entrar em contato/);
  assert.match(html, /id="skills"/);
  assert.match(html, /id="process"/);
});

test('body keeps the progressive-enhancement document order and controls', () => {
  const html = readProjectFile('index.html');
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
  const orderedMarkers = [
    'class="skip-link"',
    'id="preloader"',
    'id="technical-canvas"',
    '<header',
    '<main id="main-content">',
    '<section id="hero"',
    '<section id="about"',
    '<section id="projects"',
    '<section id="skills"',
    '<section id="process"',
    '<section id="contact"',
    '</main>',
    '<footer',
    '<script type="module" src="js/main.js"></script>',
  ];

  let previousIndex = -1;
  for (const marker of orderedMarkers) {
    const markerIndex = body.indexOf(marker);
    assert.ok(markerIndex > previousIndex, `Expected ${marker} after the previous body landmark`);
    previousIndex = markerIndex;
  }

  assert.match(body, /<div\s+id="preloader"\s+aria-hidden="true"\s+hidden>/i);
  assert.match(body, /<canvas\s+id="technical-canvas"\s+aria-hidden="true"><\/canvas>/i);
  assert.match(body, /<button[^>]+class="menu-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="mobile-menu"[^>]+aria-label="Abrir menu"/i);
  assert.match(body, /<nav[^>]+id="mobile-menu"/i);
  assert.ok((body.match(/data-reveal/g) ?? []).length >= 6);
});

test('desktop and mobile navigation expose every portfolio section', () => {
  const html = readProjectFile('index.html');
  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] ?? '';
  const mobileMenu = html.match(/<nav\b[^>]*id="mobile-menu"[\s\S]*?<\/nav>/i)?.[0] ?? '';
  const expectedLinks = [
    ['hero', 'Início'],
    ['about', 'Sobre'],
    ['projects', 'Projetos'],
    ['skills', 'Competências'],
    ['process', 'Processo'],
    ['contact', 'Contato'],
  ];

  for (const [id, label] of expectedLinks) {
    const linkPattern = new RegExp(`href="#${id}"[^>]*>\\s*${label}\\s*<`, 'i');
    assert.match(header, linkPattern);
    assert.match(mobileMenu, linkPattern);
  }
});

test('hero and about use the approved copy and portrait metadata', () => {
  const html = readProjectFile('index.html');

  assert.match(html, />\s*ENGENHARIA CRIATIVA • FULL STACK\s*</);
  assert.match(html, /<h1[^>]*>\s*Fernando Felippe\s*<\/h1>/i);
  assert.match(html, />\s*Desenvolvedor Full Stack\s*</);
  assert.match(html, />\s*Transformo problemas em produtos digitais claros, robustos e memoráveis — da interface à arquitetura\.\s*</);
  assert.match(html, />\s*Código com intenção\. Experiências com estrutura\.\s*</);
  assert.match(html, />\s*Uno desenvolvimento e pensamento visual para construir aplicações que funcionam bem, comunicam com clareza e evoluem com segurança\.\s*</);
  assert.match(html, /<img\s+src="images\/Foto\.jpg"\s+width="768"\s+height="1376"\s+loading="lazy"\s+alt="Fernando Felippe, desenvolvedor full stack">/i);
});

test('project cases share the approved structure, content, and truthful status', () => {
  const html = readProjectFile('index.html');
  const lexora = extractArticle(html, 'Lexora');
  const talentos = extractArticle(html, 'Talentos Barbearia');

  for (const article of [lexora, talentos]) {
    assert.match(article, /<article\s+class="project-card"[^>]*>/i);
    for (const className of ['project-status', 'project-problem', 'project-features', 'project-stage', 'project-tags']) {
      assert.match(article, new RegExp(`class="${className}"`));
    }
    assert.match(article, /class="project-status"[^>]*>\s*Em desenvolvimento\s*</i);
    assert.doesNotMatch(article, /<a\b/i);
  }

  assert.match(lexora, /Tornar o estudo de idiomas mais estruturado, pessoal e consistente\./);
  assert.match(lexora, /vocabulário por contexto[\s\S]*revisão espaçada[\s\S]*progresso de aprendizagem/);
  assert.match(lexora, /Arquitetura e experiência principal em evolução\./);
  for (const technology of ['TypeScript', 'React', 'SQLite', 'Prisma']) {
    assert.match(lexora, new RegExp(`>${technology}<`));
  }

  assert.match(talentos, /Simplificar a descoberta de serviços e o agendamento pelo celular\./);
  assert.match(talentos, /seleção de serviços[\s\S]*calendário e horários[\s\S]*gestão de agendamentos/);
  assert.match(talentos, /Fluxo de agendamento e experiência mobile em refinamento\./);
  for (const technology of ['React', 'TypeScript', 'UX Mobile', 'Design Responsivo']) {
    assert.match(talentos, new RegExp(`>${technology}<`));
  }

  assert.equal((html.match(/Em desenvolvimento/g) ?? []).length, 2);
});

test('skills, process, and contact stay complete without fabricated actions', () => {
  const html = readProjectFile('index.html');
  const skills = html.match(/<section\s+id="skills"[\s\S]*?<\/section>/i)?.[0] ?? '';
  const process = html.match(/<section\s+id="process"[\s\S]*?<\/section>/i)?.[0] ?? '';
  const contact = html.match(/<section\s+id="contact"[\s\S]*?<\/section>/i)?.[0] ?? '';
  const skillGroups = {
    Interfaces: ['HTML', 'CSS', 'JavaScript', 'React'],
    Aplicações: ['TypeScript', 'Next.js', 'Node.js'],
    Dados: ['SQLite', 'Prisma', 'APIs'],
    Qualidade: ['Responsividade', 'Acessibilidade', 'Testes'],
  };

  for (const [group, items] of Object.entries(skillGroups)) {
    assert.match(skills, new RegExp(`>${group}<`));
    for (const item of items) assert.match(skills, new RegExp(`>${item}<`));
  }

  for (const [number, step] of [['01', 'Entender'], ['02', 'Estruturar'], ['03', 'Construir'], ['04', 'Validar']]) {
    assert.match(process, new RegExp(`>${number}<[\\s\\S]*>${step}<`));
  }

  for (const href of [
    'mailto:fernandofelippe2018@gmail.com',
    'https://www.linkedin.com/in/fernando-felippe',
    'https://github.com/FernandoFelippeTech',
    'https://wa.me/5517991993731',
  ]) {
    assert.match(contact, new RegExp(`href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  }

  assert.doesNotMatch(html, /<form\b|href="[^"]*(?:demo|curr[ií]culo|cv\.)/i);
});

test('new monogram is accessible, solid, angular, and gradient-free', () => {
  const mark = readProjectFile('images/ff-mark.svg');

  assert.match(mark, /<svg[^>]+viewBox="0 0 64 64"[^>]+role="img"[^>]+aria-labelledby="ff-mark-title"/i);
  assert.match(mark, /<title\s+id="ff-mark-title">Fernando Felippe<\/title>/i);
  assert.equal((mark.match(/<path\b[^>]+fill="currentColor"/gi) ?? []).length, 2);
  assert.match(mark, /<circle\b[^>]+fill="#f5a623"/i);
  assert.doesNotMatch(mark, /gradient|linearGradient|radialGradient|scale\(-1/i);
});

test('portfolio protects every external new-tab link', () => {
  const html = readProjectFile('index.html');
  const newTabLinks = html.match(/<a\b[^>]*\btarget\s*=\s*(["'])_blank\1[^>]*>/gi) ?? [];

  for (const link of newTabLinks) {
    assert.match(link, /\brel\s*=\s*(["'])noopener noreferrer\1/i);
  }
});

test('portfolio keeps one top-level page heading', () => {
  const html = readProjectFile('index.html');

  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test('portfolio loads the five-part engineering creative stylesheet in order', () => {
  const css = readProjectFile('css/style.css');

  assert.equal(css.trim(), [
    '@import url("./base.css");',
    '@import url("./components.css");',
    '@import url("./sections.css");',
    '@import url("./motion.css");',
    '@import url("./responsive.css");',
  ].join('\n'));
});

test('portfolio adopts the approved amber tokens without legacy colors', () => {
  const css = [
    'style.css',
    'base.css',
    'components.css',
    'sections.css',
    'motion.css',
    'responsive.css',
  ].map((name) => readProjectFile(`css/${name}`)).join('\n');

  assert.match(css, /--color-accent:\s*#f5a623/i);
  assert.match(css, /--font-display:\s*"Space Grotesk",\s*system-ui,\s*sans-serif/i);
  assert.doesNotMatch(css, /#00d4ff|#7b2ff7|#f472b6|#ffb53d|\b(?:cyan|purple|pink)\b/i);
});

test('responsive navigation is static without JS and collapsible only in JS mode', () => {
  const html = readProjectFile('index.html');
  const responsiveCss = readProjectFile('css/responsive.css');
  const hookIndex = html.indexOf('document.documentElement.classList.add("js")');
  const stylesheetIndex = html.indexOf('<link rel="stylesheet" href="css/style.css">');
  const staticMobileRule = responsiveCss.match(/(?<!\.js )\.mobile-menu\s*\{([^}]*)\}/)?.[1] ?? '';
  const enhancedMobileRule = responsiveCss.match(/\.js\s+\.mobile-menu\s*\{([^}]*)\}/)?.[1] ?? '';
  const openStateClass = responsiveCss.match(/\.js\s+\.mobile-menu\.([\w-]+)\s*\{[^}]*opacity:\s*1;[^}]*visibility:\s*visible;/s)?.[1] ?? '';

  assert.ok(hookIndex >= 0 && hookIndex < stylesheetIndex, 'Expected the JS root hook before the stylesheet');
  assert.match(staticMobileRule, /display:\s*grid/);
  assert.doesNotMatch(staticMobileRule, /opacity:\s*0|visibility:\s*hidden|position:\s*fixed/);
  assert.match(responsiveCss, /\.js\s+\.menu-toggle\s*\{[^}]*display:\s*block/);
  assert.match(enhancedMobileRule, /position:\s*fixed/);
  assert.match(enhancedMobileRule, /opacity:\s*0/);
  assert.match(enhancedMobileRule, /visibility:\s*hidden/);
  assert.match(responsiveCss, /\.js\s+\.mobile-menu\.is-open\s*\{[^}]*opacity:\s*1;[^}]*visibility:\s*visible;/s);
  assert.ok(openStateClass, 'Expected a visible CSS open-state class');
});

test('visual system covers the approved components and section compositions', () => {
  const componentsCss = readProjectFile('css/components.css');
  const sectionsCss = readProjectFile('css/sections.css');

  for (const selector of ['.site-header', '.menu-toggle', '.button', '.project-card', '.project-tags', '.contact-cta', '.site-footer']) {
    assert.match(componentsCss, new RegExp(selector.replace('.', '\\\.')));
  }
  assert.match(componentsCss, /--pointer-x/);
  assert.match(componentsCss, /--pointer-y/);
  assert.match(componentsCss, /\.button:focus-visible\s*\{[^}]*box-shadow:\s*inset/s);
  assert.match(componentsCss, /\.button-primary:hover\s*\{[^}]*background:\s*var\(--color-accent\)/s);

  for (const selector of ['.hero-grid', '.hero-construct', '.about-grid', '.projects-grid', '.skills-grid', '.process-list', '.contact-grid']) {
    assert.match(sectionsCss, new RegExp(selector.replace('.', '\\\.')));
  }
  assert.match(sectionsCss, /grid-template-columns:\s*minmax\(0,\s*7fr\)\s+minmax\(0,\s*5fr\)/);
});

test('project cards translate only for fine hover pointers after reveal completes', () => {
  const componentsCss = readProjectFile('css/components.css');
  const motionCss = readProjectFile('css/motion.css');
  const finePointerMedia = /@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{([\s\S]*?)\n\}/;
  const componentFinePointerRules = componentsCss.match(finePointerMedia)?.[1] ?? '';
  const motionFinePointerRules = motionCss.match(finePointerMedia)?.[1] ?? '';
  const rulesOutsideFinePointerMedia = [
    componentsCss.replace(finePointerMedia, ''),
    motionCss.replace(finePointerMedia, ''),
  ].join('\n');

  assert.match(componentFinePointerRules, /\.project-card:hover\s*\{[^}]*transform:\s*translateY\(-4px\)/s);
  assert.match(
    motionFinePointerRules,
    /\.reveal-enabled\s+\.project-card\[data-reveal\]\.is-visible:hover\s*\{[^}]*transform:\s*translateY\(-4px\)/s,
  );
  assert.doesNotMatch(rulesOutsideFinePointerMedia, /translateY\(-4px\)/);
});

test('portfolio supplies responsive and reduced-motion safeguards', () => {
  const motionCss = readProjectFile('css/motion.css');
  const responsiveCss = readProjectFile('css/responsive.css');

  assert.match(motionCss, /#preloader\[hidden\]/);
  assert.match(motionCss, /prefers-reduced-motion:\s*reduce/);
  assert.match(motionCss, /#technical-canvas\s*\{\s*display:\s*none;/);
  assert.match(motionCss, /\[data-reveal\]\s*\{[^}]*opacity:\s*1;[^}]*transform:\s*none;/s);
  assert.match(motionCss, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*\.reveal-enabled\s+\[data-reveal\],\s*\[data-reveal\]\s*\{[^}]*opacity:\s*1\s*!important;[^}]*transform:\s*none\s*!important;/);
  for (const breakpoint of ['960px', '720px', '480px']) {
    assert.match(responsiveCss, new RegExp(`max-width:\\s*${breakpoint}`));
  }
  assert.match(responsiveCss, /min-height:\s*44px/);
  assert.match(responsiveCss, /overflow-x:\s*(?:clip|hidden)/);
});

test('technical canvas profile caps pixel density and node count', async () => {
  const { getCanvasProfile } = await import('../js/technical-canvas.js');

  assert.deepEqual(getCanvasProfile(1440, 3), { nodeCount: 42, pixelRatio: 1.5 });
  assert.deepEqual(getCanvasProfile(480, 1), { nodeCount: 18, pixelRatio: 1 });
});

test('technical canvas exits before setup for reduced motion', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  let canvasLookupCount = 0;
  const documentRef = {
    getElementById() {
      canvasLookupCount += 1;
      throw new Error('Canvas lookup must not run for reduced motion');
    },
  };
  const windowRef = {
    matchMedia() {
      return { matches: true };
    },
  };

  assert.doesNotThrow(() => initTechnicalCanvas(documentRef, windowRef));
  assert.equal(canvasLookupCount, 0);
});

test('technical canvas draws a bounded graphite network and a few amber nodes', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const fixture = createCanvasFixture();

  const cleanup = initTechnicalCanvas(fixture.documentRef, fixture.windowRef, () => 0.5);
  fixture.runAnimationFrame();

  assert.equal(fixture.canvas.width, 1800);
  assert.equal(fixture.canvas.height, 1200);
  assert.deepEqual(fixture.context.transform, [1.5, 0, 0, 1.5, 0, 0]);
  assert.equal(fixture.context.arcs, 42);
  assert.ok(fixture.context.strokeStyles.length > 0);
  assert.ok(fixture.context.strokeStyles.every((color) => !color.includes('245, 166, 35')));
  assert.ok(fixture.context.fillStyles.filter((color) => color.includes('245, 166, 35')).length <= 3);
  cleanup();
});

test('technical canvas pauses, restarts, debounces resize, and cleans up', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const fixture = createCanvasFixture();
  const cleanup = initTechnicalCanvas(fixture.documentRef, fixture.windowRef, () => 0.5);

  assert.equal(fixture.animationFrames.size, 1);
  fixture.documentRef.hidden = true;
  fixture.documentRef.emit('visibilitychange');
  assert.equal(fixture.animationFrames.size, 0);
  fixture.documentRef.hidden = false;
  fixture.documentRef.emit('visibilitychange');
  assert.equal(fixture.animationFrames.size, 1);

  fixture.windowRef.innerWidth = 600;
  fixture.windowRef.emit('resize');
  fixture.windowRef.emit('resize');
  assert.equal(fixture.timers.size, 1);
  assert.equal(fixture.runTimer(), 140);
  assert.equal(fixture.canvas.width, 900);

  cleanup();
  assert.equal(fixture.animationFrames.size, 0);
  assert.equal(fixture.documentRef.listenerCount('visibilitychange'), 0);
  assert.equal(fixture.windowRef.listenerCount('resize'), 0);
});

test('technical canvas never registers pointer tracking on coarse devices', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const coarseFixture = createCanvasFixture({ finePointer: false });
  const fineFixture = createCanvasFixture({ finePointer: true });

  const cleanupCoarse = initTechnicalCanvas(coarseFixture.documentRef, coarseFixture.windowRef);
  const cleanupFine = initTechnicalCanvas(fineFixture.documentRef, fineFixture.windowRef);

  assert.equal(coarseFixture.windowRef.listenerCount('pointermove'), 0);
  assert.equal(fineFixture.windowRef.listenerCount('pointermove'), 1);
  cleanupCoarse();
  cleanupFine();
});

test('navigation initializes safely when its controls are absent', async () => {
  const { initNavigation } = await import('../js/navigation.js');
  const documentWithoutNavigation = {
    querySelector() {
      return null;
    },
  };

  assert.doesNotThrow(() => initNavigation(documentWithoutNavigation, {}));
});

test('navigation keeps menu state, label, and focus synchronized', async () => {
  const { initNavigation } = await import('../js/navigation.js');
  const toggle = createElement({ 'aria-expanded': 'false', 'aria-label': 'Abrir menu' });
  const menu = createElement();
  const link = createElement({ href: '#projects' });
  const outside = createElement();
  const documentWithNavigation = createEventTarget({
    querySelector(selector) {
      return selector === '.menu-toggle' ? toggle : menu;
    },
    querySelectorAll(selector) {
      if (selector === '.mobile-link') return [link];
      return [];
    },
  });

  initNavigation(documentWithNavigation, {});

  toggle.emit('click');
  assert.equal(menu.classList.contains('is-open'), true);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(toggle.getAttribute('aria-label'), 'Fechar menu');

  documentWithNavigation.emit('keydown', { key: 'Escape' });
  assert.equal(menu.classList.contains('is-open'), false);
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(toggle.getAttribute('aria-label'), 'Abrir menu');
  assert.equal(toggle.focusCount, 1);

  toggle.emit('click');
  documentWithNavigation.emit('click', { target: outside });
  assert.equal(menu.classList.contains('is-open'), false);
  assert.equal(toggle.focusCount, 2);

  toggle.emit('click');
  let preventDefaultCount = 0;
  link.emit('click', { preventDefault: () => { preventDefaultCount += 1; } });
  assert.equal(menu.classList.contains('is-open'), false);
  assert.equal(toggle.focusCount, 3);
  assert.equal(preventDefaultCount, 0);
});

test('navigation observer activates matching desktop and mobile links', async () => {
  const { initNavigation } = await import('../js/navigation.js');
  const toggle = createElement();
  const menu = createElement();
  const projectsSection = createElement();
  projectsSection.id = 'projects';
  const aboutSection = createElement();
  aboutSection.id = 'about';
  const desktopProjects = createElement({ href: '#projects' });
  const mobileProjects = createElement({ href: '#projects' });
  const aboutLink = createElement({ href: '#about' });
  let observerCallback;

  class FakeIntersectionObserver {
    constructor(callback) {
      observerCallback = callback;
    }

    disconnect() {}
    observe() {}
  }

  const documentWithNavigation = createEventTarget({
    querySelector(selector) {
      return selector === '.menu-toggle' ? toggle : menu;
    },
    querySelectorAll(selector) {
      if (selector === '.mobile-link') return [mobileProjects];
      if (selector === 'section[id]') return [aboutSection, projectsSection];
      if (selector === '.nav-link, .mobile-link') return [aboutLink, desktopProjects, mobileProjects];
      return [];
    },
  });

  initNavigation(documentWithNavigation, { IntersectionObserver: FakeIntersectionObserver });
  observerCallback([{ target: projectsSection, isIntersecting: true, intersectionRatio: 0.8 }]);

  assert.equal(aboutLink.classList.contains('is-active'), false);
  assert.equal(desktopProjects.classList.contains('is-active'), true);
  assert.equal(mobileProjects.classList.contains('is-active'), true);
});

test('reveal keeps content and preloader safe for reduced motion', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const root = createElement();
  const preloader = createElement();
  preloader.hidden = true;
  const revealTarget = createElement();
  let observerCount = 0;
  class UnexpectedObserver {
    constructor() {
      observerCount += 1;
    }
  }
  const documentWithReveal = {
    documentElement: root,
    readyState: 'loading',
    getElementById() {
      return preloader;
    },
    querySelectorAll() {
      return [revealTarget];
    },
  };
  const windowWithReducedMotion = createEventTarget({
    IntersectionObserver: UnexpectedObserver,
    matchMedia() {
      return { matches: true };
    },
  });

  initReveal(documentWithReveal, windowWithReducedMotion);

  assert.equal(revealTarget.classList.contains('is-visible'), true);
  assert.equal(preloader.hidden, true);
  assert.equal(observerCount, 0);
});

test('reveal fallback exposes content and bounds the enhanced preloader', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const root = createElement();
  const preloader = createElement();
  preloader.hidden = true;
  const revealTarget = createElement();
  const timers = [];
  const documentWithReveal = {
    documentElement: root,
    readyState: 'loading',
    getElementById() {
      return preloader;
    },
    querySelectorAll() {
      return [revealTarget];
    },
  };
  const windowWithoutObserver = createEventTarget({
    matchMedia() {
      return { matches: false };
    },
    setTimeout(callback, delay) {
      timers.push({ callback, delay });
      return timers.length;
    },
    clearTimeout() {},
  });

  initReveal(documentWithReveal, windowWithoutObserver);

  assert.equal(root.classList.contains('reveal-enabled'), true);
  assert.equal(revealTarget.classList.contains('is-visible'), true);
  assert.equal(preloader.hidden, false);
  const safetyTimer = timers.find(({ delay }) => delay === 900);
  assert.ok(safetyTimer, 'Expected a 900ms preloader safety bound');
  safetyTimer.callback();
  assert.equal(preloader.hidden, true);
});

test('reveal observes targets and hides a complete document preloader immediately', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const root = createElement();
  const preloader = createElement();
  preloader.hidden = true;
  const revealTarget = createElement();
  const timers = [];
  let observerCallback;
  let unobservedTarget;
  class FakeIntersectionObserver {
    constructor(callback) {
      observerCallback = callback;
    }

    disconnect() {}
    observe() {}
    unobserve(target) {
      unobservedTarget = target;
    }
  }
  const documentWithReveal = {
    documentElement: root,
    readyState: 'complete',
    getElementById() {
      return preloader;
    },
    querySelectorAll() {
      return [revealTarget];
    },
  };
  const windowWithObserver = createEventTarget({
    IntersectionObserver: FakeIntersectionObserver,
    matchMedia() {
      return { matches: false };
    },
    setTimeout(callback, delay) {
      timers.push({ callback, delay });
      return timers.length;
    },
    clearTimeout() {},
  });

  initReveal(documentWithReveal, windowWithObserver);

  assert.equal(preloader.classList.contains('is-exiting'), true);
  observerCallback([{ target: revealTarget, isIntersecting: true }]);
  assert.equal(revealTarget.classList.contains('is-visible'), true);
  assert.equal(unobservedTarget, revealTarget);
  timers.find(({ delay }) => delay === 220).callback();
  assert.equal(preloader.hidden, true);
});

test('card lighting registers only for fine pointers and uses local coordinates', async () => {
  const { initCardLighting } = await import('../js/main.js');
  const values = new Map();
  const card = createElement();
  card.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 100 });
  card.style = {
    setProperty(name, value) {
      values.set(name, value);
    },
  };
  const documentWithCard = {
    querySelectorAll(selector) {
      return selector === '.project-card' ? [card] : [];
    },
  };
  const coarseWindow = {
    matchMedia() {
      return { matches: false };
    },
  };
  const fineWindow = {
    matchMedia() {
      return { matches: true };
    },
  };

  initCardLighting(documentWithCard, coarseWindow);
  assert.equal(card.listenerCount('pointermove'), 0);

  const cleanup = initCardLighting(documentWithCard, fineWindow);
  assert.equal(card.listenerCount('pointermove'), 1);
  card.emit('pointermove', {
    clientX: 150,
    clientY: 75,
    currentTarget: card,
    pointerType: 'mouse',
    target: {},
  });
  assert.equal(values.get('--pointer-x'), '25.00%');
  assert.equal(values.get('--pointer-y'), '25.00%');

  card.emit('pointermove', { clientX: 300, clientY: 150, pointerType: 'touch' });
  assert.equal(values.get('--pointer-x'), '25.00%');
  assert.equal(values.get('--pointer-y'), '25.00%');
  cleanup();
  assert.equal(card.listenerCount('pointermove'), 0);
});

test('main module delegates startup without legacy navigation interception', () => {
  const mainJs = readProjectFile('js/main.js');
  const allJavaScript = ['main.js', 'navigation.js', 'reveal.js', 'technical-canvas.js']
    .map((file) => readProjectFile(`js/${file}`))
    .join('\n');

  for (const moduleName of ['navigation', 'reveal', 'technical-canvas']) {
    assert.match(mainJs, new RegExp(`from ['"]\\./${moduleName}\\.js['"]`));
  }
  for (const initializer of ['initNavigation', 'initReveal', 'initTechnicalCanvas', 'initCardLighting']) {
    assert.match(mainJs, new RegExp(`${initializer}\\(\\)`));
  }
  assert.doesNotMatch(allJavaScript, /#codeCanvas|preventDefault\s*\(/);
});

test('local-link validator reports broken files and missing anchors', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));

  try {
    await writeFile(resolve(fixtureRoot, 'existing.css'), '');
    const errors = validateLocalLinks(
      '<main id="main-content"></main><a href="#missing">Broken anchor</a><img src="images/missing.png"><link href="existing.css?cache=1#main-content">',
      fixtureRoot,
    );

    assert.deepEqual(errors, [
      'Missing anchor: #missing',
      'Missing local file: images/missing.png',
    ]);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('local-link validator accepts local references and ignored protocols', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));

  try {
    await writeFile(resolve(fixtureRoot, 'asset.js'), '');
    const errors = validateLocalLinks(
      '<main id="main-content"></main><a href="#main-content">Skip</a><script src="asset.js?build=1#main-content"></script><a href="https://example.com">Web</a><a href="mailto:test@example.com">Email</a><a href="tel:+5517991993731">Phone</a><a href="https://wa.me/5517991993731">WhatsApp</a>',
      fixtureRoot,
    );

    assert.deepEqual(errors, []);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('local-link validator accepts protocol-relative external references', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));

  try {
    const errors = validateLocalLinks(
      '<script src="//cdn.example.com/app.js"></script><a href="//example.com/profile">Profile</a>',
      fixtureRoot,
    );

    assert.deepEqual(errors, []);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('local-link validator validates fragments after query strings', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));

  try {
    await writeFile(resolve(fixtureRoot, 'asset.js'), '');
    const errors = validateLocalLinks(
      '<main id="main-content"></main><script src="asset.js?build=1#missing"></script>',
      fixtureRoot,
    );

    assert.deepEqual(errors, ['Missing anchor: #missing']);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('local-link validator supports unquoted ids and finds unquoted local sources', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));

  try {
    await writeFile(resolve(fixtureRoot, 'asset.js'), '');
    const errors = validateLocalLinks(
      '<main id=main-content></main><a href=#main-content>Skip</a><script src=asset.js?build=1#main-content></script><img src=images/missing.png>',
      fixtureRoot,
    );

    assert.deepEqual(errors, ['Missing local file: images/missing.png']);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

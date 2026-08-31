import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const read = (path) => readFileSync(resolve(projectRoot, path), 'utf8');

function classList() {
  const values = new Set();
  return { add: (...v) => v.forEach((x) => values.add(x)), remove: (...v) => v.forEach((x) => values.delete(x)), contains: (v) => values.has(v), toggle(v, force) { const next = force ?? !values.has(v); next ? values.add(v) : values.delete(v); } };
}

function eventTarget(properties = {}) {
  const listeners = new Map();
  return { ...properties, addEventListener(type, fn) { const set = listeners.get(type) ?? new Set(); set.add(fn); listeners.set(type, set); }, removeEventListener(type, fn) { listeners.get(type)?.delete(fn); }, emit(type, event = {}) { for (const fn of listeners.get(type) ?? []) fn({ target: this, ...event }); }, listenerCount: (type) => listeners.get(type)?.size ?? 0 };
}

function element(attributes = {}) {
  const attrs = new Map(Object.entries(attributes));
  const el = eventTarget({ classList: classList(), hidden: true, focusCount: 0, getAttribute: (name) => attrs.get(name) ?? null, setAttribute: (name, value) => attrs.set(name, String(value)), focus() { el.focusCount += 1; }, contains: (candidate) => candidate === el });
  return el;
}

function canvasFixture({ finePointer = true, width = 1200 } = {}) {
  const animationFrames = new Map();
  const timers = new Map();
  let frameId = 0;
  let timerId = 0;
  const context = { arcs: 0, fillStyles: [], strokeStyles: [], arc() { this.arcs += 1; }, beginPath() {}, clearRect() {}, fill() { this.fillStyles.push(this.fillStyle); }, lineTo() {}, moveTo() {}, setTransform(...values) { this.transform = values; }, stroke() { this.strokeStyles.push(this.strokeStyle); } };
  const canvas = element();
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width, height: 800 });
  canvas.getContext = () => context;
  const documentRef = eventTarget({ hidden: false, getElementById: (id) => id === 'technical-canvas' ? canvas : null });
  const windowRef = eventTarget({ devicePixelRatio: 2, innerHeight: 800, innerWidth: width, cancelAnimationFrame: (id) => animationFrames.delete(id), clearTimeout: (id) => timers.delete(id), matchMedia(query) { return { matches: query.includes('prefers-reduced-motion') ? false : finePointer }; }, requestAnimationFrame(callback) { const id = ++frameId; animationFrames.set(id, callback); return id; }, setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay }); return id; } });
  return { animationFrames, canvas, context, documentRef, timers, windowRef, runFrame(time = 16) { const [id, callback] = animationFrames.entries().next().value; animationFrames.delete(id); callback(time); }, runTimer() { const [id, timer] = timers.entries().next().value; timers.delete(id); timer.callback(); return timer.delay; } };
}

test('page presents the approved AI Engineer positioning', () => {
  const html = read('index.html');
  assert.match(html, /<title>Fernando Felippe \| AI Engineer<\/title>/);
  assert.match(html, /INTELIGÊNCIA ARTIFICIAL\s*•\s*ENGENHARIA DE SOFTWARE/);
  assert.match(html, /<h1[^>]*>\s*Fernando Felippe\s*<\/h1>/);
  assert.match(html, /Python\s*•\s*LLMs\s*•\s*RAG\s*•\s*Agentes de IA\s*•\s*APIs\s*•\s*SQL/);
  assert.match(html, /resolve problemas/);
  assert.match(html, /gera impacto/);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
});

test('navigation exposes five sections and a required relative CV', () => {
  const html = read('index.html');
  for (const id of ['hero', 'about', 'skills', 'projects', 'contact']) {
    assert.match(html, new RegExp(`<section id="${id}"`));
    assert.match(html, new RegExp(`href="#${id}"`));
  }
  assert.doesNotMatch(html, /href="#process"|<section id="process"/);
  assert.match(html, /href="docs\/Fernando-Felippe-CV\.pdf"[^>]*download/);
  assert.doesNotMatch(html, /Fernando-Felippe-CV\.pdf"[^>]*data-optional-file/);
  assert.doesNotMatch(html, /(?:href|src)="\/(?!\/)/);
});

test('about preserves the portrait and accurately frames specialization', () => {
  const html = read('index.html');
  assert.match(html, /src="images\/Foto\.jpg"[^>]+alt="Fernando Felippe, desenvolvedor de software"/);
  assert.match(html, /construindo minha especialização/);
  for (const pillar of ['INTELIGÊNCIA ARTIFICIAL', 'DESENVOLVIMENTO DE SOFTWARE', 'DADOS']) assert.match(html, new RegExp(pillar));
});

test('skills expose focus areas without proficiency claims', () => {
  const html = read('index.html');
  for (const group of ['AI ENGINEERING', 'BACKEND &amp; APIs', 'DADOS', 'SOFTWARE ENGINEERING']) assert.match(html, new RegExp(group));
  for (const skill of ['Python', 'LLMs', 'RAG', 'Agentes de IA', 'APIs', 'SQL', 'Git / GitHub', 'JavaScript', 'TypeScript', 'Node.js', 'HTML', 'CSS', 'React']) assert.match(html, new RegExp(`>${skill.replace('.', '\\.')}<`));
  assert.doesNotMatch(html, /\b(?:expert|avançado|90%)\b/i);
});

test('projects is a coming-soon state and paused content is absent', () => {
  const html = read('index.html');
  assert.match(html, /Construindo o que vem a seguir\./);
  assert.match(html, /novos projetos em breve/);
  assert.doesNotMatch(html, /Lexora|Talentos Barbearia|<section id="process"/);
});

test('verified contact channels and footer positioning remain', () => {
  const html = read('index.html');
  for (const href of ['mailto:fernandofelippe2018@gmail.com', 'https://www.linkedin.com/in/fernando-felippe', 'https://github.com/FernandoFelippeTech', 'https://wa.me/5517991993731']) assert.ok(html.includes(`href="${href}"`));
  assert.match(html, /Fernando Felippe[\s\S]*AI Engineer/);
});

test('progressive enhancement and accessibility hooks remain', () => {
  const html = read('index.html');
  assert.match(html, /class="skip-link"[^>]+href="#main-content"/);
  assert.match(html, /class="menu-toggle"[^>]+aria-expanded="false"[^>]+aria-controls="mobile-menu"/);
  assert.match(html, /id="technical-canvas"\s+aria-hidden="true"/);
  assert.ok((html.match(/data-reveal/g) ?? []).length >= 8);
  for (const link of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? []) assert.match(link, /rel="noopener noreferrer"/);
});

test('styles remain modular, responsive, and motion-safe', () => {
  assert.equal(read('css/style.css').replace(/\r\n/g, '\n').trim(), ['@import url("./base.css");', '@import url("./components.css");', '@import url("./sections.css");', '@import url("./motion.css");', '@import url("./responsive.css");'].join('\n'));
  const css = ['base.css', 'components.css', 'sections.css', 'motion.css', 'responsive.css'].map((file) => read(`css/${file}`)).join('\n');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  for (const bp of ['960px', '720px', '480px']) assert.match(css, new RegExp(`max-width:\\s*${bp}`));
  assert.match(css, /min-height:\s*(?:44|48)px/);
  assert.match(css, /overflow-x:\s*(?:clip|hidden)/);
});

test('navigation keeps mobile state, label, and focus synchronized', async () => {
  const { initNavigation } = await import('../js/navigation.js');
  const toggle = element({ 'aria-expanded': 'false' });
  const menu = element();
  const link = element({ href: '#projects' });
  const doc = eventTarget({ querySelector: (selector) => selector === '.menu-toggle' ? toggle : menu, querySelectorAll: (selector) => selector === '.mobile-link' ? [link] : [] });
  const cleanup = initNavigation(doc, {});
  toggle.emit('click');
  assert.equal(menu.classList.contains('is-open'), true);
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  doc.emit('keydown', { key: 'Escape' });
  assert.equal(menu.classList.contains('is-open'), false);
  assert.equal(toggle.getAttribute('aria-label'), 'Abrir menu');
  assert.equal(toggle.focusCount, 1);
  cleanup();
});

test('preloader exits immediately for a complete document', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const preloader = element();
  const timers = [];
  const doc = { readyState: 'complete', documentElement: element(), getElementById: () => preloader, querySelectorAll: () => [] };
  const win = eventTarget({ matchMedia: () => ({ matches: false }), setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; }, clearTimeout() {}, IntersectionObserver: class { disconnect() {} observe() {} } });
  initReveal(doc, win);
  assert.equal(preloader.classList.contains('is-exiting'), true);
  assert.ok(timers.some(({ delay }) => delay === 220));
});

test('preloader listens for load and uses a short fallback', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const preloader = element();
  const timers = [];
  const doc = { readyState: 'loading', documentElement: element(), getElementById: () => preloader, querySelectorAll: () => [] };
  const win = eventTarget({ matchMedia: () => ({ matches: false }), setTimeout(callback, delay) { timers.push({ callback, delay }); return timers.length; }, clearTimeout() {} });
  const cleanup = initReveal(doc, win);
  assert.equal(win.listenerCount('load'), 1);
  assert.ok(timers.some(({ delay }) => delay === 900));
  win.emit('load');
  assert.equal(preloader.classList.contains('is-exiting'), true);
  cleanup();
  assert.equal(win.listenerCount('load'), 0);
});

test('reveal and canvas avoid animation for reduced motion', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const target = element();
  const preloader = element();
  initReveal({ documentElement: element(), getElementById: () => preloader, querySelectorAll: () => [target] }, { matchMedia: () => ({ matches: true }) });
  assert.equal(target.classList.contains('is-visible'), true);
  assert.equal(preloader.hidden, true);
  let lookups = 0;
  initTechnicalCanvas({ getElementById() { lookups += 1; } }, { matchMedia: () => ({ matches: true }) });
  assert.equal(lookups, 0);
});

test('canvas profile remains bounded for desktop and mobile', async () => {
  const { getCanvasProfile } = await import('../js/technical-canvas.js');
  assert.deepEqual(getCanvasProfile(1440, 3), { nodeCount: 42, pixelRatio: 1.5 });
  assert.deepEqual(getCanvasProfile(480, 1), { nodeCount: 18, pixelRatio: 1 });
});

test('card lighting targets new system cards only on fine pointers', async () => {
  const { initCardLighting } = await import('../js/main.js');
  const card = element();
  const values = new Map();
  card.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 100 });
  card.style = { setProperty: (name, value) => values.set(name, value) };
  const cleanup = initCardLighting({ querySelectorAll: (selector) => selector === '.system-card' ? [card] : [] }, { matchMedia: () => ({ matches: true }) });
  card.emit('pointermove', { currentTarget: card, pointerType: 'mouse', clientX: 150, clientY: 75 });
  assert.equal(values.get('--pointer-x'), '25.00%');
  cleanup();
});

test('validator rejects an absent required CV', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-required-cv-'));
  try {
    assert.deepEqual(
      validateLocalLinks('<a href="docs/Fernando-Felippe-CV.pdf" download>CV</a>', fixtureRoot),
      ['Missing local file: docs/Fernando-Felippe-CV.pdf'],
    );
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

test('all current index references resolve', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  assert.deepEqual(validateLocalLinks(read('index.html'), projectRoot), []);
});

test('hero uses the approved abstract code panel without the rejected AI engine diagram', () => {
  const html = read('index.html');
  const hero = html.match(/<section id="hero"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(hero, /class="code-system"/);
  assert.match(hero, /class="code-window"/);
  assert.match(hero, /build_solutions/);
  assert.match(hero, /DataPipeline/);
  assert.match(html, /Transformando código em impacto real/);
  assert.doesNotMatch(hero, />AI<|>ENGINE<|INPUT \/ DATA|MODEL \/ 01|OUTPUT \/ API|system-orbit/);
});

test('about uses compact unnumbered summaries while preserving skills cards', () => {
  const html = read('index.html');
  const about = html.match(/<section id="about"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(about, /class="about-summary"/);
  assert.equal((about.match(/class="summary-item"/g) ?? []).length, 3);
  assert.doesNotMatch(about, /<article[^>]+class="pillar|<span>0[123]<\/span>/);
  for (const group of ['AI ENGINEERING', 'BACKEND &amp; APIs', 'DADOS', 'SOFTWARE ENGINEERING']) assert.match(html, new RegExp(group));
});

test('projects exposes one-shot typing hooks and a repository stack', () => {
  const html = read('index.html');
  assert.match(html, /class="repository-stack"/);
  assert.match(html, /data-terminal-text="\/\/ novos projetos em breve"/);
  assert.match(html, /data-terminal-output/);
  assert.match(html, /data-terminal-cursor/);
  assert.doesNotMatch(html, /construct-cube cube-one|construct-cube cube-two/);
});

test('contact and footer use accessible inline SVG social links without icon libraries', () => {
  const html = read('index.html');
  const contact = html.match(/<section id="contact"[\s\S]*?<\/section>/)?.[0] ?? '';
  for (const label of ['Enviar e-mail', 'LinkedIn', 'GitHub', 'WhatsApp']) {
    assert.match(contact, new RegExp(`aria-label="${label}"`));
  }
  assert.ok((contact.match(/<svg\b/g) ?? []).length >= 4);
  assert.ok((html.match(/<svg\b/g) ?? []).length >= 6);
  assert.doesNotMatch(html, /font-awesome|fontawesome|bootstrap-icons|cdnjs/i);
});

test('project terminal module is present as a separate responsibility', () => {
  assert.equal(existsSync(resolve(projectRoot, 'js/project-terminal.js')), true);
  assert.match(read('js/main.js'), /from ['"]\.\/project-terminal\.js['"]/);
});

test('project terminal types once after entering the viewport', async () => {
  const { initProjectTerminal } = await import('../js/project-terminal.js');
  const output = element();
  output.textContent = 'initial';
  const cursor = element();
  const terminal = element();
  terminal.getAttribute = (name) => name === 'data-terminal-text' ? '// novos projetos' : null;
  terminal.querySelector = (selector) => selector === '[data-terminal-output]' ? output : cursor;
  const timers = [];
  let observerCallback;
  let unobserveCount = 0;
  class Observer {
    constructor(callback) { observerCallback = callback; }
    observe() {}
    unobserve() { unobserveCount += 1; }
    disconnect() {}
  }
  const win = {
    IntersectionObserver: Observer,
    matchMedia: () => ({ matches: false }),
    setTimeout(callback) { timers.push(callback); return timers.length; },
    clearTimeout() {},
  };
  const cleanup = initProjectTerminal({ querySelector: () => terminal }, win, { stepMs: 1 });
  assert.equal(output.textContent, '');
  observerCallback([{ target: terminal, isIntersecting: true }]);
  while (timers.length) timers.shift()();
  assert.equal(output.textContent, '// novos projetos');
  assert.equal(cursor.hidden, false);
  assert.equal(unobserveCount, 1);
  observerCallback([{ target: terminal, isIntersecting: true }]);
  assert.equal(timers.length, 0);
  cleanup();
});

test('project terminal reveals immediately for reduced motion', async () => {
  const { initProjectTerminal } = await import('../js/project-terminal.js');
  const output = element();
  const cursor = element();
  const terminal = element();
  terminal.getAttribute = () => '// novos projetos em breve';
  terminal.querySelector = (selector) => selector === '[data-terminal-output]' ? output : cursor;
  let observerCount = 0;
  const win = {
    IntersectionObserver: class { constructor() { observerCount += 1; } },
    matchMedia: () => ({ matches: true }),
  };
  initProjectTerminal({ querySelector: () => terminal }, win);
  assert.equal(output.textContent, '// novos projetos em breve');
  assert.equal(cursor.hidden, false);
  assert.equal(observerCount, 0);
});

test('skills cards keep the exact approved content in compact technical compositions', () => {
  const html = read('index.html');
  const skills = html.match(/<section id="skills"[\s\S]*?<\/section>/)?.[0] ?? '';
  const expected = new Map([
    ['AI ENGINEERING', ['Python', 'LLMs', 'RAG', 'Agentes de IA']],
    ['BACKEND &amp; APIs', ['APIs', 'Python', 'Node.js', 'JavaScript']],
    ['DADOS', ['SQL', 'Modelagem de dados', 'Integração de dados']],
    ['SOFTWARE ENGINEERING', ['Git / GitHub', 'TypeScript', 'HTML', 'CSS', 'React']],
  ]);
  assert.equal((skills.match(/class="skill-group system-card/g) ?? []).length, 4);
  assert.equal((skills.match(/class="skill-icon"/g) ?? []).length, 4);
  assert.equal((skills.match(/class="skill-microgrid/g) ?? []).length, 4);
  assert.equal((skills.match(/<svg\b[^>]*aria-hidden="true"/g) ?? []).length, 4);
  for (const [category, items] of expected) {
    assert.match(skills, new RegExp(`>${category}<`));
    for (const item of items) assert.match(skills, new RegExp(`>${item.replace('.', '\\.')}<`));
  }
  const listedSkills = [...skills.matchAll(/<li>([^<]+)<\/li>/g)].map((match) => match[1]);
  assert.deepEqual(listedSkills, [...expected.values()].flat());
});

test('projects uses neutral coming-soon repository cards while preserving terminal behavior', () => {
  const html = read('index.html');
  const projects = html.match(/<section id="projects"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(projects, /class="repository-stack"[^>]+aria-hidden="true"/);
  assert.equal((projects.match(/class="project-repo-card/g) ?? []).length, 3);
  assert.match(projects, />PROJETO 01</);
  assert.match(projects, />PROJETO 02</);
  assert.match(projects, />PROJETO 03</);
  assert.equal((projects.match(/>EM BREVE</g) ?? []).length, 3);
  for (const area of ['AI', 'SOFTWARE', 'DATA']) assert.match(projects, new RegExp(`>${area}<`));
  assert.match(projects, /class="repo-connections"/);
  assert.doesNotMatch(projects, /class="isometric-scene"|class="isometric-grid"|class="iso-cube|class="iso-node/);
  assert.match(projects, /data-terminal-text="\/\/ novos projetos em breve"/);
  assert.match(projects, /data-terminal-output/);
  assert.match(projects, /data-terminal-cursor/);
  assert.match(read('js/main.js'), /initProjectTerminal\(\)/);
});

test('technical canvas draws, pauses, resizes, and cleans up safely', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const fixture = canvasFixture();
  const cleanup = initTechnicalCanvas(fixture.documentRef, fixture.windowRef, () => 0.5);
  fixture.runFrame();
  assert.equal(fixture.canvas.width, 1800);
  assert.equal(fixture.context.arcs, 42);
  assert.ok(fixture.context.strokeStyles.every((color) => !color.includes('245, 166, 35')));
  fixture.documentRef.hidden = true;
  fixture.documentRef.emit('visibilitychange');
  assert.equal(fixture.animationFrames.size, 0);
  fixture.documentRef.hidden = false;
  fixture.documentRef.emit('visibilitychange');
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

test('technical canvas tracks pointers only on fine devices', async () => {
  const { initTechnicalCanvas } = await import('../js/technical-canvas.js');
  const coarse = canvasFixture({ finePointer: false });
  const fine = canvasFixture({ finePointer: true });
  const cleanupCoarse = initTechnicalCanvas(coarse.documentRef, coarse.windowRef);
  const cleanupFine = initTechnicalCanvas(fine.documentRef, fine.windowRef);
  assert.equal(coarse.windowRef.listenerCount('pointermove'), 0);
  assert.equal(fine.windowRef.listenerCount('pointermove'), 1);
  cleanupCoarse();
  cleanupFine();
});

test('navigation initializes without controls and activates observed links', async () => {
  const { initNavigation } = await import('../js/navigation.js');
  assert.doesNotThrow(() => initNavigation({ querySelector: () => null }, {}));
  const toggle = element();
  const menu = element();
  const section = element(); section.id = 'projects';
  const desktop = element({ href: '#projects' });
  const mobile = element({ href: '#projects' });
  let observerCallback;
  class Observer { constructor(callback) { observerCallback = callback; } observe() {} disconnect() {} }
  const doc = eventTarget({ querySelector: (selector) => selector === '.menu-toggle' ? toggle : menu, querySelectorAll(selector) { if (selector === '.mobile-link') return [mobile]; if (selector === 'section[id]') return [section]; if (selector === '.nav-link, .mobile-link') return [desktop, mobile]; return []; } });
  initNavigation(doc, { IntersectionObserver: Observer });
  observerCallback([{ target: section, isIntersecting: true, intersectionRatio: 0.8 }]);
  assert.equal(desktop.classList.contains('is-active'), true);
  assert.equal(mobile.classList.contains('is-active'), true);
});

test('reveal fallback exposes content and observed content becomes visible', async () => {
  const { initReveal } = await import('../js/reveal.js');
  const fallbackTarget = element();
  const fallbackPreloader = element();
  const fallbackTimers = [];
  const fallbackDoc = { documentElement: element(), readyState: 'loading', getElementById: () => fallbackPreloader, querySelectorAll: () => [fallbackTarget] };
  initReveal(fallbackDoc, { matchMedia: () => ({ matches: false }), setTimeout(callback, delay) { fallbackTimers.push({ callback, delay }); return fallbackTimers.length; }, clearTimeout() {} });
  assert.equal(fallbackTarget.classList.contains('is-visible'), true);
  fallbackTimers.find(({ delay }) => delay === 900).callback();
  assert.equal(fallbackPreloader.classList.contains('is-exiting'), true);
  fallbackTimers.find(({ delay }) => delay === 220).callback();
  assert.equal(fallbackPreloader.hidden, true);
  const observedTarget = element();
  let observerCallback;
  let unobserved;
  class Observer { constructor(callback) { observerCallback = callback; } observe() {} disconnect() {} unobserve(target) { unobserved = target; } }
  initReveal({ documentElement: element(), readyState: 'complete', getElementById: () => element(), querySelectorAll: () => [observedTarget] }, { IntersectionObserver: Observer, matchMedia: () => ({ matches: false }), setTimeout: () => 1, clearTimeout() {} });
  observerCallback([{ target: observedTarget, isIntersecting: true }]);
  assert.equal(observedTarget.classList.contains('is-visible'), true);
  assert.equal(unobserved, observedTarget);
});

test('local-link validator reports broken references and handles valid URL forms', async () => {
  const { validateLocalLinks } = await import('../scripts/check-local-links.mjs');
  const fixtureRoot = await mkdtemp(resolve(tmpdir(), 'portfolio-links-'));
  try {
    await writeFile(resolve(fixtureRoot, 'asset.js'), '');
    assert.deepEqual(validateLocalLinks('<main id="main"></main><a href="#missing">X</a><img src="missing.png">', fixtureRoot), ['Missing anchor: #missing', 'Missing local file: missing.png']);
    assert.deepEqual(validateLocalLinks('<main id=main></main><a href=#main>X</a><script src=asset.js?build=1#main></script><a href="https://example.com">Web</a><script src="//cdn.example.com/a.js"></script>', fixtureRoot), []);
    assert.deepEqual(validateLocalLinks('<main id="main"></main><script src="asset.js?build=1#missing"></script>', fixtureRoot), ['Missing anchor: #missing']);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
});

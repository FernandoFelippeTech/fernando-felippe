import { initNavigation } from './navigation.js';
import { initReveal } from './reveal.js';
import { initTechnicalCanvas } from './technical-canvas.js';
import { initProjectTerminal } from './project-terminal.js';

export function initCardLighting(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
) {
  const finePointer = windowRef?.matchMedia?.('(hover: hover) and (pointer: fine)').matches === true;
  if (!finePointer || !documentRef?.querySelectorAll) return undefined;

  const cards = [...documentRef.querySelectorAll('.system-card')];
  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return;
    const card = event.currentTarget ?? event.target;
    const bounds = card.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100));

    card.style.setProperty('--pointer-x', `${x.toFixed(2)}%`);
    card.style.setProperty('--pointer-y', `${y.toFixed(2)}%`);
  };

  cards.forEach((card) => card.addEventListener('pointermove', handlePointerMove, { passive: true }));

  return () => {
    cards.forEach((card) => card.removeEventListener('pointermove', handlePointerMove));
  };
}

function initReadingProgress() {
  const root = document.documentElement;
  let frame;
  function update() {
    const distance = root.scrollHeight - root.clientHeight;
    const fraction = distance > 0 ? window.scrollY / distance : 0;
    root.style.setProperty('--reading-progress', String(Math.min(1, Math.max(0, fraction))));
    frame = undefined;
  }
  function schedule() {
    if (frame === undefined) frame = window.requestAnimationFrame(update);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  update();
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  initReadingProgress();
  initNavigation();
  initReveal();
  initTechnicalCanvas();
  initProjectTerminal();
  initCardLighting();
}

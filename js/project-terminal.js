export function initProjectTerminal(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  { stepMs = 42 } = {},
) {
  const terminal = documentRef?.querySelector?.('[data-terminal-text]');
  if (!terminal) return undefined;

  const output = terminal.querySelector?.('[data-terminal-output]');
  const cursor = terminal.querySelector?.('[data-terminal-cursor]');
  const text = terminal.getAttribute?.('data-terminal-text') ?? '';
  if (!output || !cursor) return undefined;

  const reducedMotion = windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const setTimer = windowRef?.setTimeout?.bind(windowRef) ?? globalThis.setTimeout;
  const clearTimer = windowRef?.clearTimeout?.bind(windowRef) ?? globalThis.clearTimeout;
  let observer;
  let timerId;
  let started = false;
  let index = 0;

  const revealComplete = () => {
    output.textContent = text;
    cursor.hidden = false;
  };

  const typeNext = () => {
    index += 1;
    output.textContent = text.slice(0, index);
    if (index >= text.length) {
      timerId = undefined;
      cursor.hidden = false;
      return;
    }
    timerId = setTimer(typeNext, stepMs);
  };

  const start = () => {
    if (started) return;
    started = true;
    observer?.unobserve?.(terminal);
    if (!text) {
      revealComplete();
      return;
    }
    timerId = setTimer(typeNext, stepMs);
  };

  if (reducedMotion || typeof windowRef?.IntersectionObserver !== 'function') {
    revealComplete();
    return () => revealComplete();
  }

  output.textContent = '';
  cursor.hidden = true;
  observer = new windowRef.IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) start();
  }, { threshold: 0.35 });
  observer.observe(terminal);

  return () => {
    observer?.disconnect();
    if (timerId !== undefined) clearTimer(timerId);
    revealComplete();
  };
}

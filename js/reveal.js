const PRELOADER_HOLD_MS = 850;
const PRELOADER_FALLBACK_MS = 2000;
const PRELOADER_EXIT_MS = 220;

export function initReveal(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
) {
  if (!documentRef?.querySelectorAll) return undefined;

  const root = documentRef.documentElement;
  const preloader = documentRef.getElementById?.('preloader');
  const targets = [...documentRef.querySelectorAll('[data-reveal]')];
  const reducedMotion = windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const setTimer = windowRef?.setTimeout?.bind(windowRef) ?? globalThis.setTimeout;
  const clearTimer = windowRef?.clearTimeout?.bind(windowRef) ?? globalThis.clearTimeout;
  let observer;
  let exitTimer;
  let fallbackTimer;
  let holdTimer;
  let paintFrame;

  const revealAll = () => targets.forEach((target) => target.classList.add('is-visible'));

  const finishPreloader = () => {
    if (!preloader) return;
    if (exitTimer !== undefined) clearTimer(exitTimer);
    if (fallbackTimer !== undefined) clearTimer(fallbackTimer);
    exitTimer = undefined;
    fallbackTimer = undefined;
    if (holdTimer !== undefined) clearTimer(holdTimer);
    if (paintFrame !== undefined) windowRef?.cancelAnimationFrame?.(paintFrame);
    preloader.hidden = true;
    preloader.classList.remove('is-exiting');
    preloader.classList.add('is-hidden');
  };

  const beginPreloaderExit = () => {
    if (!preloader || preloader.hidden || exitTimer !== undefined) return;
    preloader.classList.add('is-exiting');
    exitTimer = setTimer(finishPreloader, PRELOADER_EXIT_MS);
  };

  if (reducedMotion) {
    revealAll();
    finishPreloader();
    return () => revealAll();
  }

  root?.classList.add('reveal-enabled');

  if (preloader) {
    preloader.classList.remove('is-exiting', 'is-hidden');
    preloader.hidden = false;
    fallbackTimer = setTimer(beginPreloaderExit, PRELOADER_FALLBACK_MS);

    const startHold = () => {
      holdTimer = setTimer(beginPreloaderExit, PRELOADER_HOLD_MS);
    };
    // Count from the first visible frame, including on cached navigations.
    if (typeof windowRef?.requestAnimationFrame === 'function') {
      paintFrame = windowRef.requestAnimationFrame(() => {
        paintFrame = windowRef.requestAnimationFrame(startHold);
      });
    } else {
      startHold();
    }
  }

  if (typeof windowRef?.IntersectionObserver === 'function') {
    observer = new windowRef.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve?.(entry.target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    targets.forEach((target) => observer.observe(target));
  } else {
    revealAll();
  }

  return () => {
    observer?.disconnect();
    finishPreloader();
    revealAll();
  };
}

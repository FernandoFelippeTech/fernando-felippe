const PRELOADER_MAX_MS = 6000;
const PRELOADER_EXIT_MS = 220;
const PRELOADER_TYPE_MS = 600;

export function initReveal(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
) {
  if (!documentRef?.querySelectorAll) return undefined;

  const root = documentRef.documentElement;
  const preloader = documentRef.getElementById?.('preloader');
  const revealTargets = [...documentRef.querySelectorAll('[data-reveal]')];
  const reducedMotion = windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const setTimer = windowRef?.setTimeout?.bind(windowRef) ?? globalThis.setTimeout;
  const clearTimer = windowRef?.clearTimeout?.bind(windowRef) ?? globalThis.clearTimeout;
  let observer;
  let exitTimer;
  let safetyTimer;
  let loadListener;

  const revealAll = () => {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  };

  const finishPreloader = () => {
    if (!preloader) return;
    if (exitTimer !== undefined) clearTimer(exitTimer);
    if (safetyTimer !== undefined) clearTimer(safetyTimer);
    exitTimer = undefined;
    safetyTimer = undefined;
    preloader.hidden = true;
    preloader.classList.remove('is-exiting');
    preloader.classList.add('is-hidden');
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

    const beginPreloaderExit = () => {
      if (preloader.hidden || exitTimer !== undefined) return;
      preloader.classList.add('is-exiting');
      exitTimer = setTimer(finishPreloader, PRELOADER_EXIT_MS);
    };

    const scheduleExit = () => setTimer(beginPreloaderExit, PRELOADER_TYPE_MS);

    safetyTimer = setTimer(finishPreloader, PRELOADER_MAX_MS);
    if (documentRef.readyState === 'complete') {
      scheduleExit();
    } else if (windowRef?.addEventListener) {
      loadListener = scheduleExit;
      windowRef.addEventListener('load', loadListener, { once: true });
    }
  }

  if (typeof windowRef?.IntersectionObserver === 'function') {
    observer = new windowRef.IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12,
    });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealAll();
  }

  return () => {
    observer?.disconnect();
    if (loadListener) windowRef.removeEventListener('load', loadListener);
    finishPreloader();
    revealAll();
  };
}

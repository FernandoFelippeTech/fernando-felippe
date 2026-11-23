export function initReveal(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
) {
  if (!documentRef?.querySelectorAll) return undefined;

  const root = documentRef.documentElement;
  const targets = [...documentRef.querySelectorAll('[data-reveal]')];
  const reducedMotion = windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  let observer;
  const revealAll = () => targets.forEach((target) => target.classList.add('is-visible'));

  if (reducedMotion) {
    revealAll();
    return () => revealAll();
  }

  root?.classList.add('reveal-enabled');

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
    revealAll();
  };
}

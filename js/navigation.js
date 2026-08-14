const OPEN_CLASS = 'is-open';
const ACTIVE_CLASS = 'is-active';

export function initNavigation(
  documentRef = globalThis.document,
  windowRef = globalThis.window,
) {
  if (!documentRef?.querySelector) return undefined;

  const menuToggle = documentRef.querySelector('.menu-toggle');
  const mobileMenu = documentRef.querySelector('#mobile-menu');
  if (!menuToggle || !mobileMenu) return undefined;

  const mobileLinks = [...documentRef.querySelectorAll('.mobile-link')];
  const sectionLinks = [...documentRef.querySelectorAll('.nav-link, .mobile-link')];
  const sections = [...documentRef.querySelectorAll('section[id]')];
  let sectionObserver;

  const setMenuOpen = (isOpen, restoreFocus = false) => {
    mobileMenu.classList.toggle(OPEN_CLASS, isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    if (!isOpen && restoreFocus) menuToggle.focus();
  };

  const closeMenu = () => setMenuOpen(false, true);
  const handleToggle = () => {
    setMenuOpen(!mobileMenu.classList.contains(OPEN_CLASS));
  };
  const handleDocumentClick = (event) => {
    if (!mobileMenu.classList.contains(OPEN_CLASS)) return;
    if (menuToggle.contains(event.target) || mobileMenu.contains(event.target)) return;
    closeMenu();
  };
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains(OPEN_CLASS)) closeMenu();
  };

  setMenuOpen(false);
  menuToggle.addEventListener('click', handleToggle);
  documentRef.addEventListener('click', handleDocumentClick);
  documentRef.addEventListener('keydown', handleKeydown);
  mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

  if (typeof windowRef?.IntersectionObserver === 'function' && sections.length > 0) {
    const visibility = new Map(sections.map((section) => [section, 0]));

    sectionObserver = new windowRef.IntersectionObserver((entries) => {
      for (const entry of entries) {
        visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      }

      const activeSection = [...visibility.entries()]
        .filter(([, ratio]) => ratio > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      if (!activeSection) return;
      const activeHref = `#${activeSection.id}`;
      sectionLinks.forEach((link) => {
        link.classList.toggle(ACTIVE_CLASS, link.getAttribute('href') === activeHref);
      });
    }, {
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  return () => {
    setMenuOpen(false);
    menuToggle.removeEventListener('click', handleToggle);
    documentRef.removeEventListener('click', handleDocumentClick);
    documentRef.removeEventListener('keydown', handleKeydown);
    mobileLinks.forEach((link) => link.removeEventListener('click', closeMenu));
    sectionObserver?.disconnect();
  };
}

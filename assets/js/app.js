(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const navigation = document.querySelector('.site-navigation');

  const syncHeader = () => {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }
  };

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  if (toggle && navigation) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navigation.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('nav-open', !expanded);
    });

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    });
  }

  const revealTargets = document.querySelectorAll(
    '.feature-card, .workflow-section, .cta-section, .docs-index-card'
  );

  if (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    'IntersectionObserver' in window
  ) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => observer.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }
})();

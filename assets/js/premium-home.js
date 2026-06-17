(() => {
  'use strict';

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('topNav');
  const menu = document.querySelector('.p-menu');
  const navInner = document.querySelector('.p-nav__inner');

  menu?.addEventListener('click', () => {
    const open = navInner.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(open));
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

  const stories = [...document.querySelectorAll('[data-story]')];
  let ticking = false;

  function updateScrollScenes() {
    const y = window.scrollY;
    nav?.classList.toggle('is-scrolled', y > 20);

    stories.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const scrollable = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / scrollable);
      const stage = progress < 0.28 ? 0 : progress < 0.5 ? 1 : progress < 0.72 ? 2 : 3;
      section.style.setProperty('--story-progress', progress.toFixed(4));
      section.dataset.stage = String(stage);

      if (!reduceMotion) {
        const core = section.querySelector('.p-core');
        const donut = section.querySelector('.p-donut');
        const contractPhone = section.querySelector('.p-contract-phone');
        if (core) core.style.transform = `rotateX(${58 - progress * 8}deg) rotateZ(${-7 + progress * 10}deg) translateY(${(0.5 - progress) * 20}px)`;
        if (donut) donut.style.transform = `rotateX(${12 - progress * 8}deg) rotateZ(${progress * 14}deg) scale(${0.78 + progress * 0.22})`;
        if (contractPhone) contractPhone.style.transform = `rotateY(${18 - progress * 15}deg) rotateZ(${-7 + progress * 8}deg) scale(${0.86 + progress * 0.12})`;
      }
    });

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateScrollScenes);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateScrollScenes();

  if (!reduceMotion) {
    const tilt = document.querySelector('[data-tilt]');
    const hero = document.querySelector('.p-hero__visual');
    hero?.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tilt.style.transform = `rotateY(${-10 + x * 13}deg) rotateX(${-y * 8}deg) rotateZ(${4 + x * 2}deg) translateY(${y * 8}px)`;
    });
    hero?.addEventListener('pointerleave', () => {
      tilt.style.transform = 'rotateY(-10deg) rotateZ(4deg) translateY(6px)';
    });

    document.querySelectorAll('[data-float]').forEach((card, index) => {
      card.animate([
        { translate: '0 0' },
        { translate: `0 ${index % 2 ? -13 : 13}px` },
        { translate: '0 0' }
      ], { duration: 4200 + index * 800, iterations: Infinity, easing: 'ease-in-out' });
    });
  }
})();

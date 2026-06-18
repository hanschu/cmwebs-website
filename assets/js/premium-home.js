(() => {
  'use strict';
  const nav = document.getElementById('topNav');
  const menu = document.querySelector('.cinema-menu');
  const navLinks = document.querySelector('.cinema-nav__links');
  menu?.addEventListener('click', () => {
    const open = navLinks?.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });

  const scenes = [...document.querySelectorAll('[data-film-scene]')];
  let ticking = false;
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function updateFilm() {
    ticking = false;
    const viewport = window.innerHeight || 1;
    nav?.classList.toggle('is-scrolled', window.scrollY > 20);
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      const travel = Math.max(1, rect.height - viewport);
      const progress = clamp(-rect.top / travel, 0, 1);
      scene.style.setProperty('--scene-progress', progress.toFixed(4));
    }
  }

  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateFilm);
  }

  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  updateFilm();
})();

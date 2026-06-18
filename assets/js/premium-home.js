(() => {
  'use strict';
  const nav = document.getElementById('topNav');
  const menu = document.querySelector('.p-menu');
  const navInner = document.querySelector('.p-nav__inner');
  menu?.addEventListener('click', () => {
    const open = navInner?.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-active', entry.isIntersecting));
  }, { threshold: 0.34 });
  document.querySelectorAll('.scene').forEach((el) => sceneObserver.observe(el));

  let ticking = false;
  const updateNav = () => {
    ticking = false;
    nav?.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateNav);
    }
  }, { passive: true });
  updateNav();
})();

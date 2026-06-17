(() => {
  'use strict';

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const nav = document.getElementById('topNav');
  const menu = document.querySelector('.p-menu');
  const navInner = document.querySelector('.p-nav__inner');

  menu?.addEventListener('click', () => {
    const open = navInner?.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

  const scenes = [...document.querySelectorAll('[data-story]')].map((section) => ({
    section,
    core: section.querySelector('.p-core'),
    donut: section.querySelector('.p-donut'),
    contractPhone: section.querySelector('.p-contract-phone')
  }));

  let rafId = 0;
  let lastY = -1;

  function render() {
    rafId = 0;
    const y = window.scrollY;
    if (y === lastY) return;
    lastY = y;
    nav?.classList.toggle('is-scrolled', y > 20);

    const viewportH = window.innerHeight;
    for (const scene of scenes) {
      const rect = scene.section.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewportH + 120) continue;

      const scrollable = Math.max(1, scene.section.offsetHeight - viewportH);
      const progress = clamp(-rect.top / scrollable);
      const stage = progress < 0.28 ? 0 : progress < 0.5 ? 1 : progress < 0.72 ? 2 : 3;
      scene.section.dataset.stage = String(stage);

      if (!reducedMotion) {
        if (scene.core) {
          scene.core.style.transform = `rotateX(${56 - progress * 5}deg) rotateZ(${-5 + progress * 7}deg) translate3d(0,${(0.5 - progress) * 12}px,0)`;
        }
        if (scene.donut) {
          scene.donut.style.transform = `rotateX(${8 - progress * 4}deg) rotateZ(${progress * 8}deg) scale(${0.86 + progress * 0.14})`;
        }
        if (scene.contractPhone) {
          scene.contractPhone.style.transform = `rotateY(${9 - progress * 7}deg) rotateZ(${-3 + progress * 4}deg) scale(${0.92 + progress * 0.07})`;
        }
      }
    }
  }

  function scheduleRender() {
    if (!rafId) rafId = requestAnimationFrame(render);
  }

  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', () => {
    lastY = -1;
    scheduleRender();
  }, { passive: true });
  scheduleRender();

  if (!reducedMotion && !coarsePointer) {
    const tilt = document.querySelector('[data-tilt]');
    const hero = document.querySelector('.p-hero__visual');
    let tiltRaf = 0;
    let pointerX = 0;
    let pointerY = 0;

    const renderTilt = () => {
      tiltRaf = 0;
      if (!tilt) return;
      tilt.style.transform = `rotateY(${-5 + pointerX * 5}deg) rotateX(${-pointerY * 3}deg) rotateZ(${2 + pointerX}deg) translate3d(0,${pointerY * 4}px,0)`;
    };

    hero?.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(renderTilt);
    }, { passive: true });

    hero?.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      if (!tiltRaf) tiltRaf = requestAnimationFrame(renderTilt);
    });

    document.querySelectorAll('[data-float]').forEach((card, index) => {
      card.animate(
        [
          { transform: 'translate3d(0,0,0)' },
          { transform: `translate3d(0,${index % 2 ? -7 : 7}px,0)` },
          { transform: 'translate3d(0,0,0)' }
        ],
        { duration: 5200 + index * 700, iterations: Infinity, easing: 'ease-in-out' }
      );
    });
  }
})();

(() => {
  'use strict';
  const nav = document.getElementById('topNav');
  const menu = document.querySelector('.p-menu');
  const navInner = document.querySelector('.p-nav__inner');
  menu?.addEventListener('click', () => {
    const open = navInner?.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(Boolean(open)));
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const desktop = window.matchMedia('(min-width: 1001px)').matches;
  const hero = document.querySelector('.hero-scroll');
  const canvas = hero?.querySelector('.hero-canvas');
  const ctx = canvas?.getContext('2d', { alpha: false });
  const copy = hero?.querySelector('.hero-step--copy');
  const notice = hero?.querySelector('.hero-step--notification');
  const frameCount = Number(hero?.dataset.frameCount || 48);
  const frames = [];
  let heroTicking = false;
  let lastFrame = -1;

  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const range = (p, from, to) => clamp((p - from) / (to - from));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function drawCover(img) {
    if (!ctx || !canvas || !img?.complete) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / scale, sh = h / scale;
    const sx = Math.max(0, (img.naturalWidth - sw) * .62);
    const sy = Math.max(0, (img.naturalHeight - sh) * .5);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }

  function loadFrames() {
    if (!hero || !canvas || !ctx || reducedMotion || !desktop) return;
    let loaded = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = `/assets/images/hero-sequence/frame-${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        loaded++;
        if (i === 0) drawCover(img);
        if (loaded >= Math.min(8, frameCount)) hero.classList.add('is-ready');
      };
      frames.push(img);
    }
  }

  function updateHero() {
    heroTicking = false;
    if (!hero || !desktop || reducedMotion) return;
    const rect = hero.getBoundingClientRect();
    const travel = Math.max(1, hero.offsetHeight - window.innerHeight);
    const progress = clamp(-rect.top / travel);
    const fi = Math.min(frameCount - 1, Math.round(progress * (frameCount - 1)));
    if (fi !== lastFrame && frames[fi]?.complete) { drawCover(frames[fi]); lastFrame = fi; }

    const copyIn = ease(range(progress, .02, .20));
    const copyOut = 1 - ease(range(progress, .70, .88));
    const copyOpacity = copyIn * copyOut;
    if (copy) {
      copy.style.opacity = copyOpacity.toFixed(3);
      copy.style.transform = `translate3d(0,${(1-copyIn)*56 - (1-copyOut)*28}px,0)`;
    }
    const noticeIn = ease(range(progress, .30, .56));
    const noticeOut = 1 - ease(range(progress, .78, .96));
    const noticeOpacity = noticeIn * noticeOut;
    if (notice) {
      notice.style.opacity = noticeOpacity.toFixed(3);
      notice.style.transform = `translate3d(${(1-noticeIn)*70}px,${(1-noticeIn)*24 - (1-noticeOut)*18}px,0) scale(${.94 + noticeIn*.06})`;
    }
    hero.classList.toggle('is-past-intro', progress > .16);
  }

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
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        nav?.classList.toggle('is-scrolled', window.scrollY > 18);
      });
    }
    if (!heroTicking) { heroTicking = true; requestAnimationFrame(updateHero); }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { lastFrame = -1; updateHero(); }, { passive: true });
  loadFrames();
  onScroll();
})();

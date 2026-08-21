/* ═══════════════════════════════════════════════════════════════════════════
   BGS CORNER — motion
   Vanilla, no dependencies. Everything degrades cleanly and everything is
   switched off under prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════════ */
(() => {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  /* ── 1. ambient guilloché ────────────────────────────────────────────── */
  const Art = window.BGSArt;
  if (Art) {
    $$('[data-herobottle]').forEach(Art.heroBottle);
    $$('[data-kiosk]').forEach(Art.kiosk);
    if (!calm) $$('[data-guilloche]').forEach(c => Art.guilloche(c, { seed: +c.dataset.seed || 0 }));
  }

  /* ── 2. scroll reveals + plate wipes ──────────────────────────────────── */
  /* An artframe only lights once its photograph has actually decoded.
     Adding the class on intersection alone runs the transition against a
     frame that has nothing in it yet, so the picture appears at the end of
     the fade rather than through it — which reads as a pop. */
  function light(el) {
    const img = el.querySelector('img');
    if (!img) {
      // Drawn frames set their own dash lengths from JS. Adding the class in
      // the same frame means the browser never paints the undrawn state, so
      // the transition has nothing to run from and the outline just appears.
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('drawn')));
      return;
    }
    const go = () => el.classList.add('drawn');
    const ready = () => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(go);
    if (img.complete && img.naturalWidth) ready();
    else {
      img.addEventListener('load', ready, { once: true });
      img.addEventListener('error', go, { once: true });
    }
  }

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const t = e.target;
      if (t.classList.contains('reveal')) t.classList.add('in');
      if (t.classList.contains('artframe')) light(t);
      io.unobserve(t);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

  $$('.reveal, .artframe').forEach(el => io.observe(el));

  /* ── 3. header: condense + scroll progress + active link ──────────────── */
  const nav      = $('#nav');
  const progress = $('.nav__rule span');
  const links    = $$('.nav__links a');
  const targets  = links.map(a => $(a.getAttribute('href'))).filter(Boolean);

  function onScroll() {
    const y   = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    nav.classList.toggle('stuck', y > 40);
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);

    let current = -1;
    targets.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= innerHeight * 0.42) current = i; });
    links.forEach((a, i) => i === current ? a.setAttribute('aria-current', 'true')
                                          : a.removeAttribute('aria-current'));
  }

  /* ── 4. parallax plates ───────────────────────────────────────────────── */
  const drifters = $$('[data-parallax]').map(el => ({ el, k: parseFloat(el.dataset.parallax) }));

  function onFrame() {
    if (!calm) {
      const mid = innerHeight / 2;
      for (const d of drifters) {
        const r = d.el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) continue;
        d.el.style.transform = `translate3d(0, ${((r.top + r.height / 2 - mid) * -d.k).toFixed(2)}px, 0)`;
      }
    }
    ticking = false;
  }

  let ticking = false;
  addEventListener('scroll', () => {
    onScroll();
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }, { passive: true });
  onScroll();
  onFrame();

  /* ── 5. sticky concept readout ────────────────────────────────────────── */
  const steps  = $$('[data-step]');
  const rVal   = $('[data-readout-val]');
  const rUnit  = $('[data-readout-unit]');
  const readout = rVal?.closest('.readout');

  if (steps.length && readout) {
    let active = -1;
    const pick = () => {
      const mid = innerHeight * 0.48;
      let best = 0, dist = Infinity;
      steps.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < dist) { dist = d; best = i; }
      });
      steps.forEach((s, i) => s.classList.toggle('dim', i !== best));
      if (best === active) return;
      active = best;
      readout.classList.add('swap');
      setTimeout(() => {
        rVal.innerHTML  = steps[best].dataset.val;
        rUnit.innerHTML = steps[best].dataset.unit;
        readout.classList.remove('swap');
      }, 260);
    };
    addEventListener('scroll', pick, { passive: true });
    pick();
  }

  /* ── 6. mobile menu ───────────────────────────────────────────────────── */
  const toggle = $('#navToggle'), menu = $('#menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
      open ? menu.removeAttribute('inert') : menu.setAttribute('inert', '');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () =>
      setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => e.key === 'Escape' && setOpen(false));
  }

  /* ── 7. cursor + magnetic buttons ─────────────────────────────────────── */
  if (fine && !calm) {
    const cur = $('.cursor');
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;

    addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      cur.classList.add('on');
    }, { passive: true });

    (function follow() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cur.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(follow);
    })();

    $$('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('hot'));
      el.addEventListener('mouseleave', () => cur.classList.remove('hot'));
    });

    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform =
          `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.34}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ── 8. enquiry form ───────────────────────────────────────────────────
     Posts in the Netlify Forms shape. If the host is not handling forms
     (local preview, GitHub Pages), it falls back to opening a mail draft
     rather than silently dropping the enquiry. */
  const form = $('.form');
  if (form) {
    const note = $('[data-form-note]', form);
    const mail = $('a[href^="mailto:"]')?.getAttribute('href').replace('mailto:', '') || '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      note.textContent = 'Sending…';

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        note.textContent = 'Thank you — we will come back to you.';
      } catch {
        const body = [...data.entries()]
          .filter(([k]) => !['form-name', 'company-website'].includes(k))
          .map(([k, v]) => `${k}: ${v}`).join('\n');
        note.textContent = 'Opening your mail app…';
        location.href = `mailto:${mail}?subject=${encodeURIComponent('BGS Corner enquiry')}&body=${encodeURIComponent(body)}`;
      }
    });
  }

  /* ── 9. the kiosk film ─────────────────────────────────────────────────
     Plays once and holds on its last frame. Once it has ended it stays there:
     scrolling away and back must not start it over. */
  const film = $('.kioskvid');
  if (film) {
    new IntersectionObserver((es) => {
      for (const e of es) {
        if (film.ended) continue;
        e.isIntersecting ? film.play().catch(() => {}) : film.pause();
      }
    }, { threshold: 0.05 }).observe(film);
  }

  /* ── 10. odds and ends ────────────────────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  addEventListener('load', () => document.documentElement.classList.add('is-loaded'), { once: true });
  if (document.readyState === 'complete') document.documentElement.classList.add('is-loaded');
})();

/* ═══════════════════════════════════════════════════════════════════════════
   BGS CORNER — drawn graphics
   The engine-turned guilloché medallions — circles whose centres ride a
   circle, baked once per size and composited per frame. Exposed as
   window.BGSArt.
   ═══════════════════════════════════════════════════════════════════════════ */
window.BGSArt = (() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a = {}) => {
    const e = document.createElementNS(NS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };

  /* ── guilloché field ────────────────────────────────────────────────────
     Hypotrochoid rosettes in gold hairline — the geometry of the monogram and
     of the engraving cut into the crystal. */
  const RINGS = [
    { n: 68, r1: .50, r2: .56, spin:  0.000015, a: .40, w: .6 },
    { n: 46, r1: .34, r2: .42, spin: -0.000025, a: .32, w: .55 },
    { n: 34, r1: .26, r2: .32, spin:  0.000035, a: .26, w: .55 }
  ];

  function bake(cfg, w, h, hue) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const x = c.getContext('2d');
    const rad = Math.min(w, h) / 2 * .70;      // keep it inside the short side
    x.translate(w / 2, h / 2);
    x.strokeStyle = `rgba(${hue},${cfg.a})`;
    x.lineWidth = cfg.w;
    x.beginPath();
    for (let j = 0; j < cfg.n; j++) {
      const a = j / cfg.n * Math.PI * 2;
      x.moveTo(Math.cos(a) * rad * cfg.r1 + rad * cfg.r2, Math.sin(a) * rad * cfg.r1);
      x.arc(Math.cos(a) * rad * cfg.r1, Math.sin(a) * rad * cfg.r1, rad * cfg.r2, 0, Math.PI * 2);
    }
    x.stroke();
    x.strokeStyle = `rgba(${hue},${cfg.a * .5})`;
    x.lineWidth = .5;
    for (const f of [cfg.r1 - cfg.r2, cfg.r1 + cfg.r2]) {
      if (f <= 0) continue;
      x.beginPath(); x.arc(0, 0, rad * f, 0, 7); x.stroke();
    }
    return c;
  }

  function guilloche(canvas, { seed = 0, hue = '107,78,19', rings = RINGS } = {}) {
    const ctx = canvas.getContext('2d');
    // vary petal count per instance, but only across ratios that stay closed
    // and symmetric — mutating R freely produces spiky, unbalanced forms
    // petal count varies per instance so no two medallions repeat
    const set = rings.map((r, i) => ({ ...r, n: r.n + ((seed * 5 + i * 3) % 13) - 6 }));
    let layers = [], W = 0, H = 0;

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = Math.round(canvas.clientWidth * dpr);
      H = Math.round(canvas.clientHeight * dpr);
      if (!W || !H) return;
      canvas.width = W; canvas.height = H;
      layers = set.map(cfg => bake(cfg, W, H, hue));
    }
    function frame(now) {
      if (W && H) {
        ctx.clearRect(0, 0, W, H);
        const b = 1 + Math.sin(now * .00021 + seed) * .016;
        layers.forEach((l, i) => {
          ctx.save();
          ctx.translate(W / 2, H / 2);
          ctx.rotate(now * set[i].spin);
          ctx.scale(b, b);
          ctx.drawImage(l, -W / 2, -H / 2);
          ctx.restore();
        });
      }
      canvas._raf = requestAnimationFrame(frame);
    }
    resize();
    requestAnimationFrame(frame);
    addEventListener('resize', () => { clearTimeout(resize._t); resize._t = setTimeout(resize, 200); });
    return resize;
  }

  return { guilloche };
})();

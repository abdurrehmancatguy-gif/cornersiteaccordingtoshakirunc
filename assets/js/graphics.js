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


  /* ── hero bottle ────────────────────────────────────────────────────────
     One continuous silhouette so a single highlight can travel the whole
     contour without seams, plus a few interior lines for the collar, the
     stopper facets and the label. */
  // body and neck as one closed contour, so a single highlight can travel it
  const SILHOUETTE =
    'M137 96 L137 134 C137 158 100 176 88 224 C78 264 78 330 88 372 ' +
    'C95 402 112 420 137 424 L163 424 C188 420 205 402 212 372 ' +
    'C222 330 222 264 212 224 C200 176 163 158 163 134 L163 96 Z';

  const STOPPER = 'M150 25 A27 27 0 1 1 149.9 25 Z';

  const DETAIL = [
    'M132 80 L168 80 L168 96 L132 96 Z',            // collar
    'M141 80 L140 96 M150 80 L150 96 M159 80 L160 96',
    'M126 40 C136 32 164 32 174 40',                // stopper facets
    'M123 52 L177 52',
    'M150 25 L150 79',
    'M112 296 L188 296 L188 356 L112 356 Z',        // label
    'M122 312 L178 312 M122 340 L178 340',
    'M96 232 C120 218 180 218 204 232',             // shoulder
  ];

  function heroBottle(svg) {
    svg.setAttribute('viewBox', '0 0 300 460');
    svg.setAttribute('fill', 'none');
    svg.innerHTML = '';

    const g = el('g', { class: 'hb' });
    svg.appendChild(g);

    DETAIL.forEach(d => g.appendChild(el('path', { d, class: 'hb-detail' })));
    g.appendChild(el('path', { d: STOPPER, class: 'hb-base hb-cap' }));
    g.appendChild(el('path', { d: SILHOUETTE, class: 'hb-base hb-body' }));
    g.appendChild(el('path', { d: SILHOUETTE, class: 'hb-trace' }));
    g.appendChild(el('path', { d: STOPPER, class: 'hb-trace hb-trace--stopper' }));

    // Measure each stroke and stage it explicitly. Ordering by role rather
    // than DOM index means the silhouette forms first, the stopper lands on
    // top of it, and the interior lines fill in last.
    const stage = (sel, delay, dur, step = 0) =>
      [...svg.querySelectorAll(sel)].forEach((path, i) => {
        path.style.setProperty('--len', path.getTotalLength().toFixed(1));
        path.style.setProperty('--d', (delay + i * step).toFixed(2) + 's');
        path.style.setProperty('--dur', dur + 's');
      });

    stage('.hb-body',   0.15, 2.0);
    stage('.hb-cap',    1.05, 0.9);
    stage('.hb-detail', 1.55, 0.7, 0.09);
    [...svg.querySelectorAll('.hb-trace')].forEach(path =>
      path.style.setProperty('--len', path.getTotalLength().toFixed(1)));
    return svg;
  }

  /* ── guilloché field ────────────────────────────────────────────────────
     Hypotrochoid rosettes in gold hairline — the geometry of the monogram and
     of the engraving cut into the crystal. */
  // A circle of radius r2 centred at distance r1 never comes closer to the
  // middle than |r2 - r1|, so unequal values always leave a clear pinhole
  // there. The second family sets them equal: every curve passes exactly
  // through the centre and closes it.
  const RINGS = [
    { n: 68, r1: .50, r2: .56, spin:  0.000015, a: .30, w: .55 },
    { n: 46, r1: .38, r2: .38, spin: -0.000025, a: .22, w: .50 }
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

  return { guilloche, heroBottle };
})();

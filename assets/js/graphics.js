/* ═══════════════════════════════════════════════════════════════════════════
   BGS CORNER — drawn graphics
   Every product visual on this site is generated, not photographed: bottle
   silhouettes from profile data, guilloché fields from hypotrochoids, and a
   line-drawn kiosk. Exposed as window.BGSArt.
   ═══════════════════════════════════════════════════════════════════════════ */
window.BGSArt = (() => {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const el = (n, a = {}) => {
    const e = document.createElementNS(NS, n);
    for (const k in a) e.setAttribute(k, a[k]);
    return e;
  };

  /* ── bottle profiles ────────────────────────────────────────────────────
     [t, halfWidth] — t runs 0 (shoulder) → 1 (foot), halfWidth is a fraction
     of the widest point. One factory, six silhouettes. */
  const PROFILES = {
    // tall and upright, high narrow shoulder
    falcon:     [[0,.22],[.06,.44],[.14,.64],[.24,.76],[.38,.80],[.54,.78],[.70,.70],[.84,.58],[.93,.52],[1,.72]],
    // deep S — flowing withers into a drawn-in waist
    horse:      [[0,.26],[.08,.58],[.17,.86],[.28,.92],[.40,.80],[.52,.68],[.64,.72],[.78,.84],[.90,.70],[1,.80]],
    // two humps over a heavy base
    camel:      [[0,.24],[.06,.46],[.13,.74],[.20,.62],[.28,.86],[.38,.70],[.52,.88],[.68,1],[.86,.80],[1,.86]],
    // broad, squat and powerful
    lion:       [[0,.32],[.07,.68],[.15,.94],[.25,1],[.40,.98],[.56,.92],[.72,.84],[.86,.72],[.94,.68],[1,.90]],
    // stepped tower
    burj:       [[0,.10],[.10,.16],[.11,.24],[.24,.30],[.25,.40],[.42,.46],[.43,.58],[.60,.64],[.61,.76],[.78,.82],[.79,.92],[1,1]],
    // trunk flaring to a wide root
    'oud-tree': [[0,.28],[.10,.50],[.22,.62],[.36,.66],[.50,.68],[.64,.74],[.78,.84],[.90,.94],[1,1]]
  };

  /* Heraldic device carried on the shoulder, inside a vesica cartouche.
     Abstract rather than literal — at this scale a drawn animal reads as a
     cartoon, while a geometric device holds the engine-turned language. */
  const CARTOUCHE = 'M0 -30 C15 -30 24 -14 24 0 C24 14 15 30 0 30 ' +
                    'C-15 30 -24 14 -24 0 C-24 -14 -15 -30 0 -30 Z';
  const CRESTS = {
    // swept wings
    falcon:     'M-13 8 L0 -7 L13 8 M-13 -1 L0 -16 L13 -1',
    // paired sweeping curves
    horse:      'M-11 12 C-11 -5 9 -5 9 -15 M-5 14 C-5 0 11 -1 11 -9',
    // two dunes
    camel:      'M-15 9 C-11 -5 -3 -5 0 7 C3 -7 11 -7 15 9',
    // radiating mane
    lion:       'M0 -15 L0 -8 M10.6 -10.6 L5.7 -5.7 M15 0 L8 0 M10.6 10.6 L5.7 5.7 ' +
                'M0 15 L0 8 M-10.6 10.6 L-5.7 5.7 M-15 0 L-8 0 M-10.6 -10.6 L-5.7 -5.7 ' +
                'M0 -5 a5 5 0 1 0 .1 0',
    // ascending spire
    burj:       'M0 -17 L6 16 L-6 16 Z M-4 2 L4 2 M-5 9 L5 9',
    // branching
    'oud-tree': 'M0 17 L0 -3 M0 -3 C-8 -7 -13 -14 -12 -20 M0 -3 C8 -7 13 -14 12 -20 ' +
                'M0 4 C-6 1 -10 -5 -9 -10 M0 4 C6 1 10 -5 9 -10 M-7 17 L7 17'
  };

  /* Catmull-Rom → cubic bezier, so a handful of profile points read as glass. */
  function spline(pts, close = false) {
    const p = pts.map(q => [q[0], q[1]]);
    let d = `M${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0]-p0[0])/6).toFixed(2)} ${(p1[1] + (p2[1]-p0[1])/6).toFixed(2)}` +
           ` ${(p2[0] - (p3[0]-p1[0])/6).toFixed(2)} ${(p2[1] - (p3[1]-p1[1])/6).toFixed(2)}` +
           ` ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
    }
    return close ? d + ' Z' : d;
  }

  /* ── the bottle ─────────────────────────────────────────────────────────
     Drawn to the real object: faceted globe cap over a diamond seat, gold
     collar, cut-crystal body, and the plaque holding the 2.5 g bar. */
  function bottle(svg, name = 'oud-tree', opts = {}) {
    const W = 320, H = 620, CX = W / 2;
    const prof = PROFILES[name] || PROFILES['oud-tree'];
    const bodyTop = 210, bodyBot = 540, maxHalf = 104;
    const detail = opts.detail !== false;

    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('fill', 'none');
    svg.innerHTML = '';

    const g = el('g', { class: 'b' });
    svg.appendChild(g);

    const at = t => bodyTop + t * (bodyBot - bodyTop);
    const left  = prof.map(([t, w]) => [CX - w * maxHalf, at(t)]);
    const right = prof.map(([t, w]) => [CX + w * maxHalf, at(t)]).reverse();

    /* body */
    const bodyD = spline(left) + ' ' + spline(right).replace(/^M/, 'L') + ' Z';
    const body = el('path', { d: bodyD, class: 'b-body' });
    g.appendChild(body);

    /* cut-crystal hatching, clipped to the body */
    if (detail) {
      const cid = 'clip-' + Math.random().toString(36).slice(2, 8);
      const cp = el('clipPath', { id: cid });
      cp.appendChild(el('path', { d: bodyD }));
      svg.appendChild(cp);
      const hatch = el('g', { class: 'b-hatch', 'clip-path': `url(#${cid})` });
      for (let i = -20; i < 28; i++) {
        hatch.appendChild(el('path', { d: `M${i * 22 - 60} ${bodyTop - 40} L${i * 22 + 300} ${bodyBot + 40}` }));
        hatch.appendChild(el('path', { d: `M${i * 22 - 60} ${bodyBot + 40} L${i * 22 + 300} ${bodyTop - 40}` }));
      }
      g.appendChild(hatch);

      /* attar fill — rises to the one-tola mark */
      const fill = el('g', { class: 'b-fill', 'clip-path': `url(#${cid})` });
      fill.appendChild(el('rect', { x: 0, y: bodyBot - 190, width: W, height: 260 }));
      g.appendChild(fill);
    }

    /* neck into a single gold collar */
    g.appendChild(el('path', { d: `M${CX - 27} 212 L${CX - 21} 152 L${CX + 21} 152 L${CX + 27} 212`, class: 'b-body' }));
    g.appendChild(el('path', { d: `M${CX - 32} 124 L${CX + 32} 124 L${CX + 27} 156 L${CX - 27} 156 Z`, class: 'b-gold' }));
    for (let i = 1; i < 9; i++)
      g.appendChild(el('path', { d: `M${CX - 32 + i * 7.1} 124 L${CX - 27 + i * 6} 156`, class: 'b-hair' }));

    /* globe cap — lifts away on the diamond step */
    const cap = el('g', { class: 'b-cap' });
    cap.appendChild(el('circle', { cx: CX, cy: 84, r: 34, class: 'b-body' }));
    for (let i = 1; i < 6; i++)
      cap.appendChild(el('ellipse', { cx: CX, cy: 84, rx: 34 - i * 6.3, ry: 34, class: 'b-hair' }));
    cap.appendChild(el('path', { d: `M${CX - 34} 84 L${CX + 34} 84`, class: 'b-hair' }));
    cap.appendChild(el('rect', { x: CX - 36, y: 104, width: 72, height: 12, rx: 2, class: 'b-gold' }));
    cap.appendChild(el('circle', { cx: CX, cy: 46, r: 6, class: 'b-gold' }));
    g.appendChild(cap);

    /* the motif this piece is named for */
    if (CRESTS[name]) {
      const c = el('g', { class: 'b-crest', transform: `translate(${CX} ${detail ? 288 : 330})` });
      c.appendChild(el('path', { d: CARTOUCHE, class: 'b-crest-frame' }));
      c.appendChild(el('path', { d: CRESTS[name], class: 'b-crest-mark' }));
      g.appendChild(c);
    }

    /* a plain label band across the lower body */
    if (detail) {
      const ly = 396;
      const band = el('g', { class: 'b-label' });
      band.appendChild(el('rect', { x: CX - 52, y: ly, width: 104, height: 40, rx: 2, class: 'b-gold' }));
      band.appendChild(el('rect', { x: CX - 46, y: ly + 5, width: 92, height: 30, rx: 1, class: 'b-hair' }));
      band.appendChild(el('text', { x: CX, y: ly + 25, class: 'b-t b-t--lg' })).textContent = 'BGS';
      g.appendChild(band);
    }

    /* foot + tola label */
    g.appendChild(el('path', { d: `M${CX - 80} 538 L${CX + 80} 538 L${CX + 92} 566 L${CX - 92} 566 Z`, class: 'b-gold' }));
    if (detail) {
      g.appendChild(el('rect', { x: CX - 62, y: 578, width: 124, height: 24, rx: 2, class: 'b-hair' }));
      g.appendChild(el('text', { x: CX, y: 594, class: 'b-t b-t--wide' })).textContent = '12 ML | 1 TOLA';
    }
    return svg;
  }

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

  /* ── kiosk elevation ────────────────────────────────────────────────────
     Line drawing of the unit: canopy carrying the monogram, three lit
     vitrines, counter and plinth. */
  function kiosk(svg) {
    const W = 1000, H = 460;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('fill', 'none');
    svg.innerHTML = '';
    const g = el('g', { class: 'k' });
    svg.appendChild(g);

    g.appendChild(el('path', { d: 'M120 96 L880 96 L880 150 L120 150 Z', class: 'k-line' }));
    g.appendChild(el('path', { d: 'M150 96 C150 60 300 44 500 44 C700 44 850 60 850 96', class: 'k-line' }));
    for (let i = 0; i < 26; i++)
      g.appendChild(el('path', { d: `M${140 + i * 28.5} 100 L${140 + i * 28.5} 146`, class: 'k-hair' }));
    g.appendChild(el('circle', { cx: 500, cy: 123, r: 26, class: 'k-gold' }));
    g.appendChild(el('circle', { cx: 500, cy: 123, r: 18, class: 'k-hair' }));

    g.appendChild(el('path', { d: 'M172 150 L172 404 M828 150 L828 404', class: 'k-line' }));

    [230, 430, 630].forEach((x, i) => {
      const v = el('g', { class: 'k-vitrine', style: `--i:${i}` });
      v.appendChild(el('rect', { x, y: 176, width: 140, height: 190, rx: 2, class: 'k-line' }));
      v.appendChild(el('rect', { x: x + 8, y: 184, width: 124, height: 174, rx: 1, class: 'k-hair' }));
      v.appendChild(el('rect', { x: x + 30, y: 340, width: 80, height: 26, rx: 1, class: 'k-gold' }));
      v.appendChild(el('path', { d: `M${x + 70} 214 l16 0 -4 26 -8 0 z M${x + 62} 240 l32 0 6 84 -44 0 z`, class: 'k-gold' }));
      v.appendChild(el('circle', { cx: x + 70, cy: 202, r: 11, class: 'k-line' }));
      v.appendChild(el('rect', { x: x + 4, y: 180, width: 132, height: 182, class: 'k-glow' }));
      g.appendChild(v);
    });

    g.appendChild(el('path', { d: 'M150 366 L850 366 L850 404 L150 404 Z', class: 'k-line' }));
    g.appendChild(el('path', { d: 'M120 404 L880 404 L900 428 L100 428 Z', class: 'k-gold' }));
    for (let i = 0; i < 40; i++)
      g.appendChild(el('path', { d: `M${125 + i * 19} 370 L${125 + i * 19} 400`, class: 'k-hair' }));
    g.appendChild(el('path', { d: 'M60 440 L940 440', class: 'k-hair' }));
    return svg;
  }

  /* ── presentation case ──────────────────────────────────────────────────
     Lid open, monogram on the inside face, bottle and oud dish seated. */
  function presentationCase(svg) {
    const W = 620, H = 470;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('fill', 'none');
    svg.innerHTML = '';
    const g = el('g', { class: 'c' });
    svg.appendChild(g);

    // open lid, tilted back
    g.appendChild(el('path', { d: 'M120 210 L200 40 L560 40 L480 210 Z', class: 'c-line' }));
    g.appendChild(el('path', { d: 'M140 200 L212 52 L548 52 L476 200 Z', class: 'c-hair' }));
    g.appendChild(el('circle', { cx: 380, cy: 122, r: 34, class: 'c-gold' }));
    g.appendChild(el('circle', { cx: 380, cy: 122, r: 24, class: 'c-hair' }));

    // base
    g.appendChild(el('path', { d: 'M80 210 L480 210 L520 400 L120 400 Z', class: 'c-line' }));
    g.appendChild(el('path', { d: 'M96 224 L466 224 L502 386 L134 386 Z', class: 'c-hair' }));
    g.appendChild(el('path', { d: 'M120 400 L520 400 L512 430 L128 430 Z', class: 'c-gold' }));

    // seated bottle
    const bg = el('g', { class: 'c-bottle' });
    bg.appendChild(el('circle', { cx: 208, cy: 262, r: 22, class: 'c-line' }));
    bg.appendChild(el('path', { d: 'M198 284 L218 284 L226 300 L190 300 Z', class: 'c-gold' }));
    bg.appendChild(el('path', { d: 'M190 300 C176 322 174 348 186 368 L232 368 C244 348 242 322 228 300 Z', class: 'c-line' }));
    bg.appendChild(el('rect', { x: 196, y: 322, width: 26, height: 30, rx: 2, class: 'c-gold' }));
    g.appendChild(bg);

    // gilt dish of oud chips
    g.appendChild(el('ellipse', { cx: 350, cy: 300, rx: 54, ry: 24, class: 'c-gold' }));
    g.appendChild(el('ellipse', { cx: 350, cy: 300, rx: 42, ry: 17, class: 'c-hair' }));
    for (let i = 0; i < 7; i++) {
      const a = i * 1.1, rx = 350 + Math.cos(a) * 26, ry = 300 + Math.sin(a) * 9;
      g.appendChild(el('path', { d: `M${rx - 8} ${ry} l7 -4 9 3 -8 4 z`, class: 'c-chip' }));
    }

    // folder
    g.appendChild(el('path', { d: 'M400 268 L470 268 L486 372 L412 372 Z', class: 'c-line' }));
    g.appendChild(el('path', { d: 'M424 300 L462 300', class: 'c-hair' }));
    g.appendChild(el('circle', { cx: 443, cy: 322, r: 13, class: 'c-gold' }));
    return svg;
  }

  return { bottle, guilloche, kiosk, presentationCase, PROFILES };
})();

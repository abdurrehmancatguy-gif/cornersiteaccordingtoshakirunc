# BGS Corner

Website for **BGS Corner** — a general trading company in Dubai, currently focused on
oud, attar and fine perfume, plus retail kiosks.

Hand-written HTML / CSS / JS. No framework, no build step, no dependencies.
Open `index.html`, or serve the folder statically.

```bash
python3 -m http.server 4173
```

## Layout

```
index.html
assets/
  css/site.css      styling
  js/graphics.js    the drawn artwork — bottles, guilloche, kiosk, case
  js/site.js        motion, scroll behaviour, form
  brand/            logo masks (white ink + alpha, tinted via CSS mask-image)
tools/
  build-brand.py    regenerates brand/ from the source logo PDF
  shot.mjs          full-page screenshots via the Chrome DevTools Protocol
```

## Artwork

There is no photography on this site. Every product visual is generated at
runtime by `assets/js/graphics.js`:

- **Bottles** come from one factory. Each piece is a `[t, halfWidth]` profile
  run through a Catmull-Rom spline, plus an abstract heraldic device in a
  vesica cartouche. Add a piece by adding a profile and a crest.
- **Guilloche** fields are engine-turned rosettes — circles whose centres ride
  a circle — baked once per size, then composited per frame.
- **The kiosk**, the exploded cartridge and the presentation case are line
  drawings built from the same primitives.

Strokes measure themselves with `getTotalLength()` on first view and draw
themselves on. The four concept steps drive the demo bottle: the gold bar
slides out of its plaque, the globe cap lifts, the diamond appears.

## Before launch

Search the HTML for `PLACEHOLDER` — the business hours, phone, email, address
and the map's `q=` value all need the real details. The form posts in the
Netlify Forms shape and falls back to opening a mail draft if the host is not
handling forms.

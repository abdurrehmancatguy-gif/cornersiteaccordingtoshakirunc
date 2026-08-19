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
  js/graphics.js    the guilloche medallions
  js/site.js        motion, scroll behaviour, form
  brand/            logo masks (white ink + alpha, tinted via CSS mask-image)
  img/              photography + the damask wallpaper
tools/
  build-brand.py    regenerates brand/ from the source logo PDF
  build-assets.py    crops and compresses the photography
  build-wallpaper.py generates the damask tile
  build-legal.py     renders terms.html and privacy.html
  shot.mjs           full-page screenshots via the Chrome DevTools Protocol
```

## Artwork

- **Photography** is stock from Pexels — see `CREDITS.md`. It is placeholder
  imagery, not BGS Corner product.
- **The wallpaper** (`assets/img/damask.svg`) is a generated seamless damask;
  rebuild it with `tools/build-wallpaper.py`.
- **The guilloche medallions** are engine-turned rosettes drawn at runtime by
  `assets/js/graphics.js` — circles whose centres ride a circle, baked once per
  size then composited per frame.
- **The brand mark** is extracted from the supplied logo PDF by
  `tools/build-brand.py`, as a white-ink alpha mask so CSS can tint it. It is
  always placed on a dark plate so it reads.

## Legal pages

`terms.html` and `privacy.html` are generated from `tools/terms.txt` and
`tools/privacy.txt` by `tools/build-legal.py`. Edit the text files, re-run the
script — do not hand-edit the HTML.

## Before launch

Contact details, hours and the map carry the real values taken from
bgscorner.com. Two things still need a decision:

1. **Terms clause 7** still reads "within [7/14/30] days" — pick the number.
2. **The photography is stock.** Swap `assets/img/piece-*.jpg` for your own
   product shots before this goes to customers; the six pieces are named for
   forms the stock images do not show.

The form posts in the Netlify Forms shape and falls back to opening a mail
draft if the host is not handling forms.

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
  js/site.js        motion + scroll behaviour
  brand/            logo masks (white ink + alpha, tinted via CSS mask-image)
  img/              product photography, web-optimised
tools/
  build-brand.py    regenerates brand/ from the source logo PDF
  build-assets.py   regenerates img/ from the source photography
```

The two scripts in `tools/` read from local source folders outside the repo and are
only needed when the source artwork changes.

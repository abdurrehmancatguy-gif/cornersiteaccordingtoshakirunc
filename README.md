# BGS CORNER

A holding page for **BGS Corner** — a general trading company in Deira, Dubai.

Hand-written HTML and CSS. No framework, no build step, no dependencies.

```bash
python3 -m http.server 4173
```

## Layout

```
index.html            the holding page
assets/
  css/soon.css        its styling
  brand/              logo masks, tinted gold via CSS mask-image
  img/still.jpg       the still life, lifted from the campaign artwork
archive/              the full site, preserved and still working
```

## The holding page

Everything except the photograph is live text: the wordmark, the headline and
the contact bar are HTML, tinted with a gold gradient through
`background-clip`, so they stay crisp at any size and are selectable and
searchable. Only the decanter, flacon and burner are an image, cropped out of
the campaign artwork clear of its own type and contact pill, and feathered
with a CSS mask rather than a baked fade so the edges dissolve into the
spotlight behind rather than into a flat black that shows a seam.

The silk falls and the spotlight are CSS gradients, not photography.

## The archive

The previous site is intact under `archive/` and still runs — open
`archive/index.html`, or reach it at `/archive/` when served. Its own assets
and build scripts moved with it, so the relative paths still resolve and
nothing in it needs changing.

To put it back, move the contents of `archive/` up a level and restore the
holding page's `index.html` to a different name.

## Before launch

The returns clause in `archive/tools/terms.txt` still reads "the period
confirmed to you at the time of purchase". Set the actual figure and re-run
`archive/tools/build-legal.py`.

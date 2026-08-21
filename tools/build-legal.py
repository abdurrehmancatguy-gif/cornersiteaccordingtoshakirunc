#!/usr/bin/env python3
"""Render terms.html and privacy.html from the supplied legal copy.

The text is reproduced verbatim; only the markup around it is generated, so
the two pages stay in the site's shell without anyone retyping the clauses.
"""
import os, re, html

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SHELL = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | BGS Corner</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#EADFC6">
<meta name="robots" content="index, follow">
<link rel="icon" href="assets/brand/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
</head>
<body>

<div class="grain" aria-hidden="true"></div>
<div class="cursor" aria-hidden="true"><span class="cursor__ring"></span></div>
<a class="skip" href="#doc">Skip to content</a>

<header class="nav stuck" id="nav">
  <div class="nav__inner">
    <a class="closebtn" href="index.html" aria-label="Close and return to the main page">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6 L18 18 M18 6 L6 18"/>
      </svg>
    </a>
    <a class="nav__brand" href="index.html" aria-label="BGS Corner — home">
      <span class="markplate" aria-hidden="true"><span class="mark"></span></span>
      <span class="nav__wordmark">
        <span class="nav__name">BGS CORNER</span>
        <span class="nav__sub">General Trading</span>
      </span>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="index.html#who">Who We Are</a>
      <a href="index.html#what">What We Do</a>
      <a href="index.html#products">Our Products</a>
      <a href="index.html#contact">Contact</a>
      <a href="{other_href}">{other_label}</a>
    </nav>
    <a class="btn btn--ghost nav__cta" href="index.html#contact" data-magnetic>Enquire</a>
  </div>
  <div class="nav__rule" aria-hidden="true"><span></span></div>
</header>

<main class="legal section" id="doc">
  <div class="wrap legal__inner">
    <a class="legal__back" href="index.html">
      <span aria-hidden="true">&larr;</span> Back to BGS Corner
    </a>
    <p class="eyebrow reveal">Legal</p>
    <h1 class="legal__title reveal" data-delay="1">{title}</h1>
{body}
    <a class="legal__back legal__back--end" href="index.html">
      <span aria-hidden="true">&larr;</span> Back to BGS Corner
    </a>
  </div>
</main>

<footer class="foot">
  <div class="wrap foot__inner">
    <a class="lockplate" href="index.html" aria-label="BGS Corner"><span class="foot__lockup"></span></a>
    <nav class="foot__links" aria-label="Footer">
      <a href="index.html#who">Who We Are</a><a href="index.html#what">What We Do</a>
      <a href="index.html#products">Our Products</a><a href="index.html#contact">Contact</a>
      <a href="terms.html">Terms</a><a href="privacy.html">Privacy</a>
    </nav>
    <p class="foot__legal"><span id="year">2026</span> &copy; B G S Corner General Trading L.L.C. &middot; Dubai, U.A.E.</p>
  </div>
</footer>

<!-- floating WhatsApp — opens a chat with the number published on this page -->
<a class="wa" href="https://wa.me/971564891974?text=Hello%20BGS%20Corner%2C%20I%27d%20like%20to%20enquire%20about%20your%20products."
   target="_blank" rel="noopener" aria-label="Chat with BGS Corner on WhatsApp">
  <span class="wa__ring" aria-hidden="true"></span>
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.479-8.413"/></svg>
  <span class="wa__label">WhatsApp</span>
</a>

<script src="assets/js/graphics.js" defer></script>
<script src="assets/js/site.js" defer></script>
</body>
</html>
'''

def linkify(t):
    t = html.escape(t)
    t = t.replace('info@bgscorner.com', '<a href="mailto:info@bgscorner.com">info@bgscorner.com</a>')
    t = t.replace('+971 56 489 1974', '<a href="tel:+971564891974">+971 56 489 1974</a>')
    # bold the "Label:" that opens a bullet
    t = re.sub(r'^([A-Z][A-Za-z &/]{2,34}):\s', r'<b>\1:</b> ', t)
    return t

def render(raw):
    out, bullets = [], []
    def flush():
        if bullets:
            out.append('    <ul class="legal__list reveal">')
            out.extend('      <li>' + linkify(b) + '</li>' for b in bullets)
            out.append('    </ul>')
            bullets.clear()
    for line in [l.rstrip() for l in raw.strip().split('\n')]:
        if not line:
            continue
        if line.startswith('* '):
            bullets.append(line[2:].strip())
            continue
        flush()
        m = re.match(r'^(\d{1,2})\.\s+(.*)$', line)
        if m:
            out.append('    <h2 class="legal__h reveal"><span>%s</span>%s</h2>' % (m.group(1), linkify(m.group(2))))
        else:
            out.append('    <p class="reveal">' + linkify(line) + '</p>')
    flush()
    return '\n'.join(out)

for slug, title, desc, src, other_href, other_label in [
    ('terms',   'Terms &amp; Conditions',
     'Terms and conditions for B G S Corner General Trading L.L.C.', 'terms.txt',
     'privacy.html', 'Privacy'),
    ('privacy', 'Privacy Policy',
     'How B G S Corner General Trading L.L.C. collects, uses and safeguards personal data.', 'privacy.txt',
     'terms.html', 'Terms'),
]:
    raw = open(os.path.join(HERE, 'tools', src)).read()
    page = SHELL.format(title=title, desc=desc, body=render(raw),
                        other_href=other_href, other_label=other_label)
    open(os.path.join(HERE, slug + '.html'), 'w').write(page)
    print(slug + '.html', len(page) // 1024 + 1, 'KB')

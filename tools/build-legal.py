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
<title>{title} — BGS Corner</title>
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
    <a class="nav__brand" href="index.html" aria-label="BGS Corner — home">
      <span class="markplate" aria-hidden="true"><span class="mark"></span></span>
      <span class="nav__wordmark">
        <span class="nav__name">BGS Corner</span>
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

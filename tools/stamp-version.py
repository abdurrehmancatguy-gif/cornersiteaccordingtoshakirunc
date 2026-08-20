#!/usr/bin/env python3
"""Stamp ?v=<hash> onto the stylesheet and script links.

Without this the browser keeps a cached stylesheet against freshly changed
markup, which is how a six-cell grid ends up rendering in four columns with
two dark holes. Run it after editing anything in assets/.
"""
import hashlib, os, re, glob

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def digest(rel):
    with open(os.path.join(HERE, rel), 'rb') as f:
        return hashlib.sha1(f.read()).hexdigest()[:8]

versions = {rel: digest(rel) for rel in
            ('assets/css/site.css', 'assets/js/site.js', 'assets/js/graphics.js')}

for page in glob.glob(os.path.join(HERE, '*.html')):
    src = open(page).read()
    out = src
    for rel, ver in versions.items():
        out = re.sub(r'(["\'])' + re.escape(rel) + r'(?:\?v=[0-9a-f]+)?\1',
                     r'\g<1>' + rel + '?v=' + ver + r'\g<1>', out)
    if out != src:
        open(page, 'w').write(out)
        print(os.path.basename(page), 'stamped')

for rel, ver in versions.items():
    print(f'  {rel:24} v={ver}')

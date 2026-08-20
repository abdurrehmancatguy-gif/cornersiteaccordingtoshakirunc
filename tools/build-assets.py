#!/usr/bin/env python3
"""Crop and compress the Pexels photography into web-ready plates.

Shots carrying legible third-party brand names are deliberately excluded — a
competitor's mark on a BGS product card is both misleading and a trademark
problem.

Sources are listed in CREDITS.md. Everything is cropped to the aspect the
layout actually uses, so the browser never downloads pixels it will not show.
"""
from PIL import Image
import os

SRC = '/private/tmp/claude-501/-Users-ajoomama-github/6c30e950-77d8-4697-b637-d4b9d55edd80/scratchpad/px/'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/img/')
os.makedirs(OUT, exist_ok=True)

# (pexels id, output name, target aspect w/h, output width)
JOBS = [
    ('7702669',  'piece-1.jpg',     4/5,   760),
    ('7814730',  'piece-2.jpg',     4/5,   760),
    ('4041387',  'piece-3.jpg',     4/5,   760),
    ('34089129', 'piece-4.jpg',     4/5,   760),
    ('6915111',  'piece-5.jpg',     4/5,   760),
    ('8624586',  'piece-6.jpg',     4/5,   760),
    ('18708750', 'piece-7.jpg',     4/5,   760),
    ('34387954', 'piece-8.jpg',     4/5,   760),
    ('32630375', 'piece-9.jpg',     4/5,   760),
    ('264819',   'piece-10.jpg',    4/5,   760),
    ('8361545',  'piece-11.jpg',    4/5,   760),
    ('34470639', 'piece-12.jpg',    4/5,   760),
    ('8450240',  'kiosk.jpg',    16/7.2,  1700),
    ('17860048', 'oud.jpg',         4/5,  1000),
    ('4271691',  'case.jpg',        4/5,  1000),
]

def crop_to(im, aspect):
    w, h = im.size
    if w / h > aspect:                      # too wide -> trim the sides
        nw = round(h * aspect)
        return im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    nh = round(w / aspect)                  # too tall -> favour the upper half
    top = round((h - nh) * 0.38)
    return im.crop((0, top, w, top + nh))

for pid, name, aspect, width in JOBS:
    im = crop_to(Image.open(SRC + pid + '.jpg').convert('RGB'), aspect)
    if im.width > width:
        im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    im.save(OUT + name, 'JPEG', quality=82, optimize=True, progressive=True)
    print(f'{name:16} {im.size[0]}x{im.size[1]}  {os.path.getsize(OUT+name)//1024} KB  (pexels {pid})')

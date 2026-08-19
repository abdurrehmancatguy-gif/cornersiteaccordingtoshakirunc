#!/usr/bin/env python3
"""Optimise BGS source photography into web-ready plates."""
from PIL import Image
import os, numpy as np

BOT = '/Users/ajoomama/Desktop/bgs-bottle/'
PKG = '/Users/ajoomama/Desktop/packaged bottle/'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/img/')
os.makedirs(OUT, exist_ok=True)

JOBS = [
    # (source, output name, max width)
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42.jpeg',      'hero-oud-tree.jpg',   1500),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.41.jpeg',      'bottle-falcon.jpg',    900),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42 (1).jpeg',  'bottle-horse.jpg',     900),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42 (2).jpeg',  'bottle-camel.jpg',     900),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42 (3).jpeg',  'bottle-lion.jpg',      900),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42 (4).jpeg',  'bottle-burj.jpg',      900),
    (BOT + 'WhatsApp Image 2026-08-10 at 15.26.42.jpeg',      'bottle-oud-tree.jpg',  900),
    (PKG + 'all-three-bottles-open-and-closed-diamond-states.png', 'lineup.jpg',     1800),
    (PKG + 'bgs-luxury-bottle-kiosk-concept.png',             'kiosk.jpg',           1800),
    (PKG + 'clear-bgs-bottle-packaging-open.png',             'presentation-open.jpg',1300),
    (PKG + 'bottle-1-packaging-closed.png',                   'presentation-closed.jpg',1100),
    (PKG + 'bottle-2-packaging-open-black-v2.png',            'presentation-ittar.jpg', 1100),
]

for src, name, w in JOBS:
    im = Image.open(src).convert('RGB')
    if im.width > w:
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    im.save(OUT + name, 'JPEG', quality=84, optimize=True, progressive=True)
    print(f'{name:26} {im.size[0]}x{im.size[1]}  {os.path.getsize(OUT+name)//1024} KB')

#!/usr/bin/env python3
"""Extract the BGS logo from the supplied PDF into alpha masks.

The PDF is black artwork on white. We key luminance into the alpha channel so
the result can be tinted any colour with CSS `mask-image` — gold foil on ivory,
ink on gold, whatever the section needs — from a single asset.
"""
from PIL import Image, ImageChops, ImageFilter
import numpy as np, os, subprocess, tempfile

SRC = '/Users/ajoomama/Downloads/BGS LOGO.pdf'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/brand/')
os.makedirs(OUT, exist_ok=True)

tmp = tempfile.mkdtemp()
subprocess.run(['qlmanage', '-t', '-s', '2400', '-o', tmp, SRC],
               check=True, capture_output=True)
raster = os.path.join(tmp, os.path.basename(SRC) + '.png')

a = 255 - np.array(Image.open(raster).convert('L'))          # ink -> opaque
ys, xs = np.where(a > 12)
a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]

def save(arr, name):
    h, w = arr.shape
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., 0:3] = 255                                      # white ink, tinted via mask
    rgba[..., 3] = arr
    Image.fromarray(rgba).save(OUT + name, optimize=True)
    print(f'{name:20} {w}x{h}  {os.path.getsize(OUT+name)//1024} KB')

save(a, 'logo-lockup.png')                                    # monogram + BGS wordmark

mark = a[:, :860]                                             # monogram sits left of the 134px gap
ys, xs = np.where(mark > 12)
save(mark[ys.min():ys.max() + 1, xs.min():xs.max() + 1], 'logo-mark.png')

# Outline of the mark, as a mask. Vector tracing the glyph was tried and
# abandoned: marching squares kept joining contours across the saddle cells,
# leaving chords straight through the letterforms. Deriving the outline from
# the artwork itself, by subtracting an eroded copy from a dilated one, is
# exact by construction.
#
# Both masks are built on a padded square canvas. logo-mark.png is trimmed to
# the ink, so the glyph touches all four edges; dilating it there pushes the
# ring past the canvas and the outer circle comes back flattened on the sides.
# The padding also keeps the fill and the outline on identical geometry, so
# `contain` registers them exactly on top of each other.
RING, PAD = 7, 16
mark_a = Image.open(OUT + 'logo-mark.png').getchannel('A')
side = max(mark_a.size) + PAD * 2
square = Image.new('L', (side, side), 0)
square.paste(mark_a, ((side - mark_a.width) // 2, (side - mark_a.height) // 2))

def as_mask(alpha, name):
    img = Image.new('RGBA', alpha.size, (255, 255, 255, 0))
    img.putalpha(alpha)
    img.save(OUT + name, optimize=True)
    print(f'{name:24} {alpha.size[0]}x{alpha.size[1]}  '
          f'{os.path.getsize(OUT + name) // 1024} KB')

as_mask(square, 'logo-mark-pad.png')
as_mask(ImageChops.subtract(square.filter(ImageFilter.MaxFilter(RING)),
                            square.filter(ImageFilter.MinFilter(RING))),
        'logo-mark-outline.png')

# favicon: gold monogram on ink, 180px
mark_img = Image.open(OUT + 'logo-mark.png')
pad, size = 26, 180
inner = size - pad * 2
m = mark_img.resize((inner, inner), Image.LANCZOS).getchannel('A')
ico = Image.new('RGBA', (size, size), (14, 12, 10, 255))
gold = Image.new('RGBA', (inner, inner), (208, 170, 92, 255))
ico.paste(gold, (pad, pad), m)
ico.save(OUT + 'favicon.png', optimize=True)
print('favicon.png          180x180')

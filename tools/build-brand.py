#!/usr/bin/env python3
"""Extract the BGS logo from the supplied PDF into alpha masks.

The PDF is black artwork on white. We key luminance into the alpha channel so
the result can be tinted any colour with CSS `mask-image` — gold foil on ivory,
ink on gold, whatever the section needs — from a single asset.
"""
from PIL import Image
import numpy as np, os, subprocess, tempfile

SRC = '/Users/ajoomama/Downloads/BGS LOGO.pdf'
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets/brand/')
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

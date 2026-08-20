#!/usr/bin/env python3
"""Trace the monogram mask into SVG outlines so it can be drawn on.

A bitmap mask can be tinted but not stroked, and the brand mark needs to form
the way the hero bottle does. Moore-neighbour boundary tracing walks each
contour, Douglas-Peucker drops the redundant points, and holes are traced too
so the counters stay open under fill-rule evenodd.
"""
from PIL import Image
import numpy as np, os
from scipy import ndimage

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT  = os.path.join(HERE, 'assets/brand/')

# 8-neighbourhood, clockwise, as (dy, dx)
MOORE = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]

def trace(mask, start):
    """Walk one closed boundary clockwise from `start`, Jacob's stopping rule."""
    h, w = mask.shape
    def solid(p):
        y, x = p
        return 0 <= y < h and 0 <= x < w and mask[y, x]

    limit = 12 * (h + w)
    contour = [start]
    b = (start[0], start[1] - 1)          # we arrived from the left
    c = start
    first_b = b
    for _ in range(limit):
        idx = MOORE.index((b[0] - c[0], b[1] - c[1]))
        found = None
        for k in range(1, 9):             # sweep clockwise from the backtrack
            d = MOORE[(idx + k) % 8]
            p = (c[0] + d[0], c[1] + d[1])
            if solid(p):
                found, b = p, (c[0] + MOORE[(idx + k - 1) % 8][0],
                               c[1] + MOORE[(idx + k - 1) % 8][1])
                break
        if found is None:
            break
        c = found
        if c == start and b == first_b:
            break
        contour.append(c)
    return contour

def rdp(pts, eps):
    """Iterative Douglas-Peucker; recursion blows the stack on long contours."""
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        (x0, y0), (x1, y1) = pts[i], pts[j]
        dx, dy = x1 - x0, y1 - y0
        norm = (dx * dx + dy * dy) ** .5 or 1e-9
        dmax, idx = 0.0, i
        for k in range(i + 1, j):
            x, y = pts[k]
            d = abs(dy * x - dx * y + x1 * y0 - y1 * x0) / norm
            if d > dmax:
                dmax, idx = d, k
        if dmax > eps:
            keep[idx] = True
            stack += [(i, idx), (idx, j)]
    return [p for p, k in zip(pts, keep) if k]

# 320px is ample for an outline and keeps the pure-python walk quick; at the
# source 859px the trace takes minutes for no visible gain once stroked.
src = Image.open(OUT + 'logo-mark.png')
src = src.resize((320, 320), Image.LANCZOS)
mask = (np.array(src.getchannel('A')) > 110)
H, W = mask.shape

regions = []
lbl, n = ndimage.label(mask)
for i in range(1, n + 1):
    comp = lbl == i
    if comp.sum() < 60:
        continue
    regions.append(comp)
    holes = ndimage.binary_fill_holes(comp) & ~comp
    hl, hn = ndimage.label(holes)
    for j in range(1, hn + 1):
        hole = hl == j
        if hole.sum() >= 60:
            regions.append(hole)

paths = []
for comp in regions:
    ys, xs = np.nonzero(comp)
    start = (int(ys[0]), int(xs[np.nonzero(comp[ys[0]])[0][0]]))
    pts = trace(comp, start)
    pts = rdp([(x, y) for y, x in pts], 1.15)
    if len(pts) < 6:
        continue
    d = 'M' + ' L'.join(f'{x / W * 100:.2f} {y / H * 100:.2f}' for x, y in pts) + ' Z'
    paths.append((len(pts), d))

paths.sort(reverse=True)
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" '
       'fill-rule="evenodd">\n'
       + '\n'.join(f'  <path d="{d}"/>' for _, d in paths) + '\n</svg>\n')
open(OUT + 'mark.svg', 'w').write(svg)
print(f'{len(regions)} regions -> {len(paths)} paths, {len(svg)//1024 + 1} KB')

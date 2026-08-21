#!/usr/bin/env python3
"""Generate the seamless damask wallpaper the page sits on.

The motif is drawn at the tile centre and at all four corners; because it is
bilaterally symmetric, the corner quarters meet exactly across the seam, so
the tile repeats without a visible grid.
"""
import os

W, H = 300, 360
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets/img/damask.svg')

# palmette: crown, paired scrolls, pointed base — a classic damask silhouette
MOTIF = ('M0 -66 C20 -50 33 -24 24 -5 C37 -16 53 -20 62 -11 C49 -2 33 5 22 2 '
         'C33 18 29 44 0 66 C-29 44 -33 18 -22 2 C-33 5 -49 -2 -62 -11 '
         'C-53 -20 -37 -16 -24 -5 C-33 -24 -20 -50 0 -66 Z')
INNER = ('M0 -34 C11 -26 18 -12 13 -3 C20 -8 28 -10 33 -6 C26 -1 18 3 12 1 '
         'C18 9 15 23 0 34 C-15 23 -18 9 -12 1 C-18 3 -26 -1 -33 -6 '
         'C-28 -10 -20 -8 -13 -3 C-18 -12 -11 -26 0 -34 Z')

def place(d, x, y, scale=1.0, cls='m'):
    return (f'<path class="{cls}" transform="translate({x} {y}) scale({scale})" d="{d}"/>')

parts = []
# ogee lattice, drawn first so the motifs sit on top of it
for x in (0, W):
    parts.append(f'<path class="l" d="M{x} 0 C{x-58} {H*0.30} {x-58} {H*0.70} {x} {H} "/>')
    parts.append(f'<path class="l" d="M{x} 0 C{x+58} {H*0.30} {x+58} {H*0.70} {x} {H} "/>')
parts.append(f'<path class="l" d="M{W/2} 0 C{W/2-58} {H*0.30} {W/2-58} {H*0.70} {W/2} {H}"/>')
parts.append(f'<path class="l" d="M{W/2} 0 C{W/2+58} {H*0.30} {W/2+58} {H*0.70} {W/2} {H}"/>')

for (cx, cy) in [(W/2, H/2), (0, 0), (W, 0), (0, H), (W, H)]:
    parts.append(place(MOTIF, cx, cy))
    parts.append(place(INNER, cx, cy, 1.0, 'i'))

# small rosettes at the lattice crossings
for (cx, cy) in [(0, H/2), (W, H/2), (W/2, 0), (W/2, H)]:
    parts.append(f'<circle class="d" cx="{cx}" cy="{cy}" r="7"/>')
    parts.append(f'<circle class="d2" cx="{cx}" cy="{cy}" r="3"/>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<style>
 .m{{fill:none;stroke:#6B4E13;stroke-width:1.8;opacity:.20}}
 .i{{fill:#6B4E13;opacity:.06;stroke:#6B4E13;stroke-width:1;stroke-opacity:.16}}
 .l{{fill:none;stroke:#6B4E13;stroke-width:1.1;opacity:.12}}
 .d{{fill:none;stroke:#6B4E13;stroke-width:1.3;opacity:.18}}
 .d2{{fill:#6B4E13;opacity:.15}}
</style>
{chr(10).join(parts)}
</svg>
'''
open(OUT, 'w').write(svg)
print('damask.svg', W, 'x', H, len(svg) // 1024 + 1, 'KB')

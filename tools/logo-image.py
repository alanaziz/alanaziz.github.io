#!/usr/bin/env python3
"""Prepare a brand logo for the Brands collab strip.

    python3 tools/logo-image.py "SOURCE.png" slug-name

Writes assets/logos/<slug>.png — background removed, cropped to content and
capped at 240px on the long edge, colour kept as-is. The site places these
on a small white chip (.collab-logo-chip) rather than the dark page, so the
brand's own colours stay intact instead of being flattened to one tone.
The source is left alone.

These brand downloads hit the same trap gear photos do (see gear-image.py):
RGBA mode but a fully-opaque alpha channel over a baked-in white background.
Reuses that script's corner-flood removal rather than trying every pixel, so
a white highlight enclosed by the mark survives. tol is higher than the gear
script's default (46) because these are flat vector-style graphics, not
photos, and several sources carry a soft drop-shadow ring around an
off-white badge panel that a tight tolerance can't bridge — it gets trapped
as opaque "ink" and shows up as a grey ghost behind the mark.
"""
import os
import sys
from collections import deque

from PIL import Image

MAX_SIDE = 240
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "assets", "logos")


def flood_alpha(im, tol=90):
    """Border-connected pixels close to a corner colour become alpha 0."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    refs = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]

    def near(x, y):
        c = px[x, y]
        return any(all(abs(c[i] - r[i]) <= tol for i in range(3)) for r in refs)

    seen = [[False] * w for _ in range(h)]
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if near(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if near(x, y) and not seen[y][x]:
                seen[y][x] = True
                q.append((x, y))
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and near(nx, ny):
                seen[ny][nx] = True
                q.append((nx, ny))

    alpha = Image.new("L", (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        row = seen[y]
        for x in range(w):
            if row[x]:
                ap[x, y] = 0
    return alpha


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, slug = sys.argv[1], sys.argv[2]
    im = Image.open(src).convert("RGBA")

    alpha = flood_alpha(im)
    art = im.copy()
    art.putalpha(alpha)

    bbox = art.getbbox()
    if not bbox:
        sys.exit(f"{slug}: nothing survived the flood fill — check the source")
    art = art.crop(bbox)

    w, h = art.size
    s = MAX_SIDE / max(w, h)
    if s < 1:
        art = art.resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS)

    os.makedirs(OUT, exist_ok=True)
    dst = os.path.join(OUT, slug + ".png")
    art.save(dst, "PNG", optimize=True)
    print(f"{slug}  {art.size}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Prepare a gear photo for /gear/.

    python3 tools/gear-image.py "SOURCE.png" slug-name

Writes assets/gear/<slug>.jpg — 800x800, composited onto the panel colour so the
product sits in the dark page rather than on it. The source file is left alone.

Handles the two things that bite every time:

  * A PNG in RGBA mode is not necessarily transparent. Plenty of supplier images
    carry a fully-opaque alpha channel over a baked-in white background; testing
    im.mode passes them through and they land on the page as glowing white blocks.
    We test whether the alpha channel actually varies.
  * Image.thumbnail() refuses to enlarge, so a small source floats in the middle
    of the frame. We scale with an explicit factor instead.

Backgrounds are flood-filled inward from the border, never by testing every pixel,
so a white highlight enclosed by the product survives. Isolated strays far from the
product (a light stand, a stray caption) are dropped.
"""
import os
import sys
from collections import deque

from PIL import Image, ImageStat

PANEL = (19, 19, 20)          # --panel #131314
SIDE = 800
MARGIN = 0.08
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "assets", "gear")


def is_transparent(im):
    if im.mode not in ("RGBA", "LA"):
        return False
    lo, _ = im.getchannel("A").getextrema()
    return lo < 250


def flood_background(im, tol):
    """Transparent-out every border-connected pixel within tol of the corner colour."""
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    ref = px[0, 0]

    def near(x, y):
        c = px[x, y]
        return all(abs(c[i] - ref[i]) <= tol for i in range(3))

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

    out = rgb.convert("RGBA")
    op = out.load()
    for y in range(h):
        row = seen[y]
        for x in range(w):
            if row[x]:
                op[x, y] = (0, 0, 0, 0)
    return out


def drop_strays(im, keep=0.12):
    """Blank column runs holding under `keep` of the opaque pixels — a light stand
       or stray caption would otherwise stretch the bbox and shrink the product."""
    w, h = im.size
    a = im.getchannel("A").load()
    cols = [sum(1 for y in range(h) if a[x, y] > 8) for x in range(w)]
    total = sum(cols)
    if not total:
        return im
    runs, cur = [], None
    for x, c in enumerate(cols):
        if c and cur is None:
            cur = x
        elif not c and cur is not None:
            runs.append((cur, x - 1))
            cur = None
    if cur is not None:
        runs.append((cur, w - 1))
    if len(runs) < 2:
        return im
    biggest = max(sum(cols[a0:b0 + 1]) for a0, b0 in runs)
    op = im.load()
    for a0, b0 in runs:
        if sum(cols[a0:b0 + 1]) < keep * biggest:
            for x in range(a0, b0 + 1):
                for y in range(h):
                    op[x, y] = (0, 0, 0, 0)
    return im


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, slug = sys.argv[1], sys.argv[2]
    im = Image.open(src)
    im.thumbnail((1600, 1600), Image.LANCZOS)

    if is_transparent(im):
        art, how = im.convert("RGBA"), "alpha"
    else:
        art, how = flood_background(im, tol=46), "background removed"

    art = drop_strays(art)
    bbox = art.getbbox()
    if bbox:
        art = art.crop(bbox)

    canvas = Image.new("RGB", (SIDE, SIDE), PANEL)
    box = SIDE - 2 * int(SIDE * MARGIN)
    s = min(box / art.width, box / art.height)          # scales up as well as down
    art = art.resize((max(1, int(art.width * s)), max(1, int(art.height * s))),
                     Image.LANCZOS)
    canvas.paste(art, ((SIDE - art.width) // 2, (SIDE - art.height) // 2), art)

    dst = os.path.join(OUT, slug + ".jpg")
    canvas.save(dst, "JPEG", quality=88, optimize=True)
    mean = ImageStat.Stat(canvas.convert("L")).mean[0]
    warn = "   <-- CHECK: brighter than the others" if mean > 90 else ""
    print("%s  %s  mean=%.1f%s" % (slug, how, mean, warn))


if __name__ == "__main__":
    main()

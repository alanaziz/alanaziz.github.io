#!/usr/bin/env python3
"""Prepare a gear photo for /gear/.

    python3 tools/gear-image.py "SOURCE.png" slug-name

Writes assets/gear/<slug>.jpg — 800x800, the product cut out and composited onto
the off-white the cards use, scaled to fill the frame. The source is left alone.

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

BG = (239, 236, 227)          # --cream #EFECE3, the off-white the cards sit on
SIDE = 800
MARGIN = 0.03                 # small — the product is meant to fill the frame
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, "assets", "gear")


def is_transparent(im):
    """Palette PNGs carry transparency in info rather than an alpha channel.
    Missing that case is quietly destructive: convert("RGB") renders their
    transparent pixels black, so a flood seeded from the corners eats a black
    product from the outside in and leaves a ghost."""
    if im.mode == "P" and "transparency" in im.info:
        return True
    if im.mode not in ("RGBA", "LA"):
        return False
    lo, _ = im.getchannel("A").getextrema()
    return lo < 250


def flood_background(im, tol):
    """Transparent-out every border-connected pixel close to a border colour.

    Each of the four corners contributes its own reference, so a two-tone
    backdrop works — a photographed product on a coloured sweep above and a
    table below has a different colour top and bottom, and seeding from one
    corner alone would strip the sweep and leave the table behind.
    """
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

    out = rgb.convert("RGBA")
    op = out.load()
    for y in range(h):
        row = seen[y]
        for x in range(w):
            if row[x]:
                op[x, y] = (0, 0, 0, 0)
    return out


def _runs(counts):
    runs, cur = [], None
    for i, c in enumerate(counts):
        if c and cur is None:
            cur = i
        elif not c and cur is not None:
            runs.append((cur, i - 1))
            cur = None
    if cur is not None:
        runs.append((cur, len(counts) - 1))
    return runs


def drop_strays(im, keep=0.12):
    """Blank whole row/column bands holding under `keep` of the opaque pixels.

    Two things this catches: a light stand or stray caption sitting apart from
    the product, which would otherwise stretch the bbox and shrink it; and the
    thin seam a photographed backdrop leaves where its gradient meets the table,
    a blend colour matching neither corner reference so the flood steps over it.
    """
    w, h = im.size
    a = im.getchannel("A").load()
    op = im.load()

    for axis in ("x", "y"):
        if axis == "x":
            counts = [sum(1 for y in range(h) if a[x, y] > 8) for x in range(w)]
        else:
            counts = [sum(1 for x in range(w) if a[x, y] > 8) for y in range(h)]
        if not sum(counts):
            return im
        runs = _runs(counts)
        if len(runs) < 2:
            continue
        biggest = max(sum(counts[p:q + 1]) for p, q in runs)
        for p, q in runs:
            if sum(counts[p:q + 1]) < keep * biggest:
                for i in range(p, q + 1):
                    if axis == "x":
                        for y in range(h):
                            op[i, y] = (0, 0, 0, 0)
                    else:
                        for x in range(w):
                            op[x, i] = (0, 0, 0, 0)
    return im


def trim_ghost_edges(im, frac=0.10):
    """Trim sparse bands at the top and bottom of the frame.

    A pale accessory on a pale background — a tripod mount, a stand — loses its
    fill to the flood and leaves just its dark outline behind, a ghost. It stays
    attached to the product by a stem so drop_strays can't separate it, but it is
    far sparser than the product, so trim inward while density stays under `frac`
    of the busiest row.
    """
    w, h = im.size
    a = im.getchannel("A").load()
    rows = [sum(1 for x in range(w) if a[x, y] > 8) for y in range(h)]
    if not any(rows):
        return im
    cut = frac * max(rows)
    top = 0
    while top < h and rows[top] and rows[top] < cut:
        top += 1
    bottom = h - 1
    while bottom > top and rows[bottom] and rows[bottom] < cut:
        bottom -= 1
    if top == 0 and bottom == h - 1:
        return im
    op = im.load()
    for y in list(range(0, top)) + list(range(bottom + 1, h)):
        for x in range(w):
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
    art = trim_ghost_edges(art)
    bbox = art.getbbox()
    if bbox:
        art = art.crop(bbox)

    canvas = Image.new("RGB", (SIDE, SIDE), BG)
    box = SIDE - 2 * int(SIDE * MARGIN)
    s = min(box / art.width, box / art.height)          # scales up as well as down
    art = art.resize((max(1, int(art.width * s)), max(1, int(art.height * s))),
                     Image.LANCZOS)
    canvas.paste(art, ((SIDE - art.width) // 2, (SIDE - art.height) // 2), art)

    dst = os.path.join(OUT, slug + ".jpg")
    canvas.save(dst, "JPEG", quality=88, optimize=True)
    mean = ImageStat.Stat(canvas.convert("L")).mean[0]
    warn = "   <-- CHECK: darker than the others" if mean < 90 else ""
    print("%s  %s  mean=%.1f%s" % (slug, how, mean, warn))


if __name__ == "__main__":
    main()

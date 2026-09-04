# alanaziz.github.io

Personal site for Alan Aziz — gadget reviews. Served by GitHub Pages at
**https://alanaziz.com**.

## Structure

```
index.html       homepage — markup + highlight-reel script
gear/index.html  gear page — markup + grid/list toggle
style.css        all styles, shared by both pages
assets/logo/     logo source + derived marks, icons, OG image
assets/video/    highlight clips
assets/poster/   first-frame posters for those clips
assets/gear/     gear photos (see Gear page)
CNAME            custom domain (alanaziz.com) — do not delete
```

## External dependencies

Fonts load at runtime from Google Fonts (JetBrains Mono). No build step.

## Logo

`ALAN AZIZ LOGO-Black.jpeg` is the supplied source (white art on a black panel,
no alpha). Everything else in `assets/logo/` is derived from it — the black is
keyed out using the image's own luminance as the alpha channel, so edges stay
antialiased and nothing shows a box on the dark page.

| File | What it is |
|------|------------|
| `alan-aziz-mark.png` | A-mark only, white on transparent, 512px tall |
| `icon-32.png`, `icon-180.png` | favicon and apple-touch-icon |
| `og-image.jpg` | 1200x630 lockup on `#0A0A0B` for link previews |

`alan-aziz-mark.png` is used twice: in the header beside the text wordmark, and
in the hero beside the `ALAN AZIZ` headline. The hero lockup is sized in `em` off
`.hero-name`, so the mark and the gap scale with the headline — change
`.hero-name`'s `font-size` clamp and everything tracks. That clamp is set so the
name never wraps down to the 980px breakpoint; below 560px wrapping is allowed
again as a fallback.

Regenerate the derived files from the source with the crop boxes noted in git
history if the logo is ever replaced.

## Highlight reel

The hero panel plays clips as an Instagram-style highlight: segment bars,
click the left/right thirds to step, auto-advances and loops, muted by default
with a SOUND toggle. Files live in `assets/video/` with matching posters in
`assets/poster/`. The bars and JS both size themselves off however many
`.hl-video` elements are on the page, so adding or removing a slot is just
adding/removing a matching `<button class="hl-bar">` / `<video class="hl-video">`
pair and renumbering the `aria-label`s and `data-go` indices.

| Slot | File | Source | Trim |
|------|------|--------|------|
| 01 | `highlight-01.mp4` | `KTM 390 launching event.mp4` | first 12s |
| 02 | `highlight-02.mp4` | `HOTO_FINAL .mp4` | full clip |
| 03 | `highlight-03.mp4` | `moist.mp4` | full clip |
| 04 | `highlight-04.mp4` | `Alans WORBY - SD 480p.mov` | 20s–25s |

Encoded 1280px wide, H.264, no audio track, `+faststart`. To swap one, re-encode
to the same filename:

```
ffmpeg -i SOURCE -an -movflags +faststart -vf scale=1280:-2 \
  -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow assets/video/highlight-0N.mp4
ffmpeg -ss 1 -i assets/video/highlight-0N.mp4 -frames:v 1 -q:v 6 assets/poster/highlight-0N.jpg
```

The label under each clip is the `data-label` attribute on its `<video>`.

## Gear page

`gear/index.html` serves at **/gear/** — the kit list, grouped by category. It
shares `style.css` with the homepage, so every asset path in it is `../`-relative.

Items are grouped into `<section class="gear-group">` blocks, one per category —
CAMERA, LENSES, AUDIO and LIGHTING — each with a heading and a count. Everything is
on the page at once; the category links at the top are anchors that jump to a
section, not filters, so there is no ALL button and no filtering script.

Cards carry no index number and no category label: the section heading above them
already says which category they are in.

### Grid and list views

The GRID/LIST toggle sits opposite the category links. List view is the same cards
with `.is-list` on the grid — brackets off, thumbnail down to 60px, laid out as
`thumb / name`. Nothing is duplicated in the markup, so a new item gets both views
for free. The toggle applies the class to *every* `.gear-grid`, one per section.

The choice is kept in `localStorage` under `gear-view`. Every read and write is
wrapped in try/catch — storage throws outright in some private-browsing modes, and
an exception there would take the toggle down with it.

### Adding an item

Drop the `<article>` into the `.gear-grid` of the section it belongs to. It needs
only an image and a name:

```
<article class="gear-item">
  <img class="gear-media" src="../assets/gear/<slug>.jpg" alt=""
       width="800" height="800" loading="lazy" decoding="async">
  <h3 class="gear-name">SONY ZVE10 MARK 2</h3>
</article>
```

Bump the `<span class="group-count">` on that section's heading to match.

A new category needs a new `<section class="gear-group" id="...">` with its own
heading and grid, plus a matching `<a href="#...">` in `.filters`.

The image comes first and the name sits under it, so images align across a row on
their own — no auto-margin trick needed however many lines a name wraps to.

### Adding the photo

Gear photos are **square**, `800x800`, and live in `assets/gear/`. The product is cut
out and composited onto the off-white `#EFECE3` (`--cream`), scaled to fill the frame
with only a 3% margin — the cards read as bright tiles against the dark page. Mean
luminance lands around 130–230; anything much darker means the cut-out failed and the
old dark background came through.

Run `tools/gear-image.py` rather than doing this by hand — see below.

All 21 items carry a photo. Shoot or crop square — a non-square file still fills the
box, but `object-fit:cover` crops the long edge.

Source files (the unprocessed `.png`/`.jpeg` drops) are gitignored in this folder;
only the processed square JPGs are served.

### tools/gear-image.py

```
python3 tools/gear-image.py "assets/gear/SOURCE.png" slug-name
```

Writes `assets/gear/<slug>.jpg` and leaves the source alone. Sources are gitignored.

It exists because every batch hit the same traps, each of which is quietly
destructive rather than loud:

- *An RGBA-mode PNG is not necessarily transparent.* Many supplier images carry a
  fully-opaque alpha over a baked-in white background. Testing `im.mode` passes them
  through and they land as glowing white blocks. Test whether the alpha actually
  varies — `im.getchannel("A").getextrema()`.
- *Palette PNGs keep transparency in `info`, not an alpha channel.* Miss that and
  `convert("RGB")` renders their transparent pixels **black**, so a flood seeded from
  the corners eats a black product from the outside in and leaves a ghost. Every RØDE
  image is mode `P`.
- *`Image.thumbnail()` refuses to enlarge*, so a small source floats in the middle of
  the frame. Scale with an explicit factor.

Backgrounds are flooded inward from the border, never by testing every pixel, so a
white highlight enclosed by the product survives; each corner contributes its own
reference so a two-tone backdrop works. Isolated strays are dropped (a light stand
in one Amaran shot survived as a hairline down the card), as are sparse ghost bands
where a pale accessory lost its fill and left only its outline.

For a source that is already a clean square on white, skip the tool and place it
as-is — Amaran 60D is done that way.

**Keep the source files.** Re-deriving a cut-out from an already-composited JPG
degrades it, and a product with near-background blacks cannot be recovered at all.


## Cache busting

GitHub Pages serves assets with `cache-control: max-age=600`, so a deploy that
changes `index.html` and `style.css` together can leave visitors on new markup
with ten-minute-old CSS — which renders badly, not just unstyled. The stylesheet
link therefore carries a content hash (the value below is only an example — read the
current one out of `index.html`):

```
<link rel="stylesheet" href="style.css?v=ef6a43e6">
```

**Re-hash it whenever `style.css` changes**, before committing. Both pages reference
the stylesheet, and both must move in the same commit or `/gear/` renders against
stale CSS:

```
V=$(md5 -q style.css | cut -c1-8)
sed -i '' "s|href=\"style.css[^\"]*\"|href=\"style.css?v=$V\"|" index.html
sed -i '' "s|href=\"../style.css[^\"]*\"|href=\"../style.css?v=$V\"|" gear/index.html
```

Old HTML then keeps requesting old CSS and new HTML requests new CSS, so the two
are never mismatched.

## Local preview

```
python3 -m http.server 8000
```

Then visit http://localhost:8000 and http://localhost:8000/gear/

## Deploying

Pages publishes from `main`. Push to `main` and the live site updates within
a minute or two.

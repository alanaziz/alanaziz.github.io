# alanaziz.github.io

Personal site for Alan Aziz — gadget reviews. Served by GitHub Pages at
**https://alanaziz.com**.

## Structure

```
index.html       homepage — markup + highlight-reel script
gear/index.html  gear page — markup + category filter script
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

The hero panel plays three clips as an Instagram-style highlight: segment bars,
click the left/right thirds to step, auto-advances and loops, muted by default
with a SOUND toggle. Files live in `assets/video/` with matching posters in
`assets/poster/`.

| Slot | File | Source |
|------|------|--------|
| 01 | `highlight-01.mp4` | `no battery4.mp4` |
| 02 | `highlight-02.mp4` | `HOTO_FINAL .mp4` |
| 03 | `highlight-03.mp4` | `moist.mp4` |

Encoded 1280px wide, H.264, no audio track, `+faststart`. To swap one, re-encode
to the same filename:

```
ffmpeg -i SOURCE -an -movflags +faststart -vf scale=1280:-2 \
  -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow assets/video/highlight-0N.mp4
ffmpeg -ss 1 -i assets/video/highlight-0N.mp4 -frames:v 1 -q:v 6 assets/poster/highlight-0N.jpg
```

The label under each clip is the `data-label` attribute on its `<video>`.

## Gear page

`gear/index.html` serves at **/gear/** — the kit list, filterable by category. It
shares `style.css` with the homepage, so every asset path in it is `../`-relative.

Categories are CAMERA, LENSES, AUDIO and LIGHTING. There is no COMPUTING tab: an
empty category renders as the "nothing here yet" message, so a tab only earns its
place once something sits in it.

### Grid and list views

The GRID/LIST toggle sits opposite the filters. List view is the same cards with
`.is-list` on the grid — brackets off, thumbnail down to 60px, and the children
re-ordered with the CSS `order` property into `index / thumb / name / category`.
Nothing is duplicated in the markup, so a new item gets both views for free.

The choice is kept in `localStorage` under `gear-view`. Every read and write is
wrapped in try/catch — storage throws outright in some private-browsing modes, and
an exception there would take the filters down with it.

### Adding an item

A card carries a category and a name, nothing else. Duplicate one
`<article class="gear-item">` block and set three things:

| Field | Where |
|-------|-------|
| Category | `data-cat` on the `<article>` — must match a filter button's `data-filter` |
| Name | `.gear-name` |
| Category label | `.gear-cat`, the visible `[ CAMERA ]` line |

`data-cat` drives the filtering and `.gear-cat` is what people read — they are written
out separately, so change both together or an item will filter into the wrong tab.

Index numbers (`01`, `02`) are stable identity, not position. They deliberately do
**not** renumber when a filter is applied, so an item keeps the same number for good.

A new category needs a matching button in `.filters`:

```
<button type="button" data-filter="lighting" aria-pressed="false">LIGHTING</button>
```

Filtering is `hidden` toggling in the inline script at the foot of the page. When a
category has no items the `.gear-empty` message shows instead — that is the expected
state for a category you have not filled yet, not a bug.

### Adding the photo

Gear photos are **square and small** — `800x800` is plenty, since the largest the box
ever renders is about 290px. They live in `assets/gear/` and are composited onto the
panel colour `#131314` so they sit *in* the dark page rather than on it. A photo that
arrives on a white studio background reads as a glowing rectangle and needs its
background knocked out first — measure with mean luminance, which should land in the
20–45 band the existing files occupy, not up at 110+.

11 of the 21 are in. Each card ships with an upload placeholder (`.slot`) until it
has one; to put a photo in, drop the file at `assets/gear/<slug>.jpg` and replace the
whole `<div class="slot">…</div>` with:

```
<img class="gear-media" src="../assets/gear/<slug>.jpg" alt="" width="800" height="800">
```

`.gear-media` and `.gear-item .slot` share the 1:1 ratio and radius, so the swap does
not move anything else on the card. Shoot or crop square — a non-square file still
fills the box, but `object-fit:cover` will crop the long edge.

The cards are flex columns with `margin-bottom:auto` on `.gear-cat`, which pins every
square to the bottom of its card. Squares therefore stay on one baseline across a row
however many lines a name wraps to — worth keeping if you restyle the card.

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

# alanaziz.github.io

Personal site for Alan Aziz — gadget reviews. Served by GitHub Pages at
**https://alanaziz.com**.

## Structure

```
index.html      markup + highlight-reel script
style.css       all styles
assets/logo/    logo source + derived marks, icons, OG image
assets/video/   highlight clips
assets/poster/  first-frame posters for those clips
CNAME           custom domain (alanaziz.com) — do not delete
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
| `alan-aziz-lockup.png` | mark + ALAN AZIZ wordmark, 900px wide |
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

## Cache busting

GitHub Pages serves assets with `cache-control: max-age=600`, so a deploy that
changes `index.html` and `style.css` together can leave visitors on new markup
with ten-minute-old CSS — which renders badly, not just unstyled. The stylesheet
link therefore carries a content hash:

```
<link rel="stylesheet" href="style.css?v=ef6a43e6">
```

**Re-hash it whenever `style.css` changes**, before committing:

```
V=$(md5 -q style.css | cut -c1-8)
sed -i '' "s|href="style.css[^"]*"|href="style.css?v=$V"|" index.html
```

Old HTML then keeps requesting old CSS and new HTML requests new CSS, so the two
are never mismatched.

## Local preview

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploying

Pages publishes from `main`. Push to `main` and the live site updates within
a minute or two.

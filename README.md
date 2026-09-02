# alanaziz.github.io

Personal site for Alan Aziz — gadget reviews. Served by GitHub Pages at
**https://alanaziz.com**.

## Structure

```
index.html      markup + highlight-reel script
style.css       all styles
assets/video/   highlight clips
assets/poster/  first-frame posters for those clips
CNAME           custom domain (alanaziz.com) — do not delete
```

## External dependencies

Fonts load at runtime from Google Fonts (JetBrains Mono). No build step.

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

## Local preview

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploying

Pages publishes from `main`. Push to `main` and the live site updates within
a minute or two.

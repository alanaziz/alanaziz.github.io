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

The header (all pages) and the hero no longer use the static mark — they play
the logo sting from `~/Documents/alanaziz-logo-motion/out/alanaziz-logo-sting-transparent.mov`
(ProRes 4444, 1080x1920). The full 5.9s clip loops (spin-in, hold, spin-out); for
the web it's cropped 1068x830 at 29,477 after a 10px side pad, with the
ALANAZIZREVIEW wordmark masked out below y=1290 from frame 28, then scaled to 402x312:

| File | What it is |
|------|------------|
| `logo-sting.mov` | HEVC with alpha (`hevc_videotoolbox`, tag `hvc1`) — Safari |
| `logo-sting.webm` | VP9 with alpha — Chrome, Firefox |
| `logo-sting-end.webp` | frame 66 still (resting logo) — reduced motion, blocked autoplay, load error |

`assets/logo-sting.js` starts the loop and swaps in the still when motion isn't
wanted or the video can't play. The mark sits 23.53% inside the clip on every
side (so spinning layers aren't clipped); `.logo-sting` keeps the old 659:512
footprint and the video bleeds out past it. The sting's A is solid — the stencil
cut in the static mark was filled in the motion project on purpose.

The static mark was used the same way: in the header beside the text wordmark, and
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
| 01 | `highlight-01.mp4` | `HOTO_FINAL .mp4` | full clip |
| 02 | `highlight-02.mp4` | `art of phyro 5.mp4` | full clip |
| 03 | `highlight-03.mp4` | `Alans WORBY - SD 480p.mov` | 20s–25s |
| 04 | `highlight-04.mp4` | `KTM 390 launching event.mp4` | first 5s |
| 05 | `highlight-05.mp4` | `The Campus.mp4` | 4s–9s |

Encoded 1280px wide, H.264, no audio track, `+faststart`. To swap one, re-encode
to the same filename:

```
ffmpeg -i SOURCE -an -movflags +faststart -vf scale=1280:-2 \
  -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow assets/video/highlight-0N.mp4
ffmpeg -ss 1 -i assets/video/highlight-0N.mp4 -frames:v 1 -q:v 6 assets/poster/highlight-0N.jpg
```

The label under each clip is the `data-label` attribute on its `<video>`.

## Click sound

`assets/click-sfx.js` plays `assets/sfx/click.mp3` on any real button — the
`.btn` component, the highlight-reel controls, and the gear page's grid/list
toggle — via one delegated click listener matching `.btn, .hl-bar, .hl-zone,
[data-view]`. Plain nav and text links are left alone. Included with an
absolute `/assets/...` path on both pages so the one file works from `/gear/`
too. The audio element is cloned per click so a fast double-click doesn't cut
the sound off mid-play.

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


## Motion

`assets/motion.js` is the site's one choreography file, loaded on every page.
No library, no build step.

**The gate.** Each page's `<head>` carries a tiny inline script that adds
`html.motion` unless the visitor prefers reduced motion. CSS only hides reveal
targets under `.motion`, and the script takes the class back off after 3s if
`motion.js` never marked `html.motion-live` — so no-JS, blocked-script and
reduced-motion visitors always get the finished page. Calm visitors also get
the showreel with controls instead of autoplay, the gear wall as a plain
swipeable row and the sign-off already filled.

**Homepage sequence**

| Piece | What it does |
|------|------|
| Boot intro (`.boot`) | Once per session (`sessionStorage` key `boot-seen`): timecode rolls, REC blinks, brackets fly in, logo sting plays, then a shutter closes onto the page. Click or any key skips. |
| Hero | Name splits into letters rising out of word masks, tagline is "written" with a clip-path, copy and buttons fade up, the reel opens like a shutter and tilts toward the cursor. |
| Viewfinder (`.vf`) | Camera-monitor overlay on the highlight reel: timecode off the playing clip, label retyped per clip, focus box that hunts and re-locks, rule-of-thirds grid and a live luma histogram. The histogram starts 2.5s after load, samples ~6×/s and turns itself off on any device where one sample takes over 24ms — pixel readback from video is slow on some machines. |
| Showreel (`[data-reel]`) | Pinned section; `--p` (0→1) scales the frame from an inset card to full size. Plays only while on screen. |
| Gear wall (`[data-wall]`) | Pinned; vertical scroll drives the track sideways (~1.5px per px), with per-card parallax and a progress hairline. Links to `/gear/`. |
| Brand marquee | Same CSS loop, but its playback rate and skew follow scroll velocity. |
| Sign-off (`[data-cta]`) | Outline type that fills left to right as it scrolls in (`--f`), fully on hover. |

**Every page:** headings with `data-reveal="wipe"` get a film-strip wipe; gear
cards, media-kit panels and stats rise in, staggered (`motion.js` tags them —
no markup needed). Same-origin navigation uses cross-document View Transitions
(`@view-transition` in `style.css`): the header stays, the page wipes in.
Browsers without support just navigate.

### Showreel video

Rendered in Remotion from `~/Documents/alanaziz-logo-motion`, composition
`Showreel` (`src/Showreel.tsx`, 1920×1080, 30fps, 17.6s). It cuts 4K gear B-roll
from the booth sessions (`~/Desktop/ds3_2`, `~/Desktop/untitled folder`, trimmed
to 1080p segments), the highlight clips, kinetic type, a camera HUD and the logo
end card. All sources live in that project's `public/clips/`. To re-render and re-encode:

```
cd ~/Documents/alanaziz-logo-motion
npx remotion render Showreel out/showreel.mp4 --codec=h264 --crf=16 --pixel-format=yuv420p
ffmpeg -i out/showreel.mp4 -an -vf scale=1280:-2 -c:v libx264 -pix_fmt yuv420p -crf 26 \
  -preset slow -movflags +faststart assets/video/showreel.mp4
ffmpeg -i out/showreel.mp4 -an -vf scale=1280:-2 -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 \
  assets/video/showreel.webm
```

(Run the two `ffmpeg` lines from this repo, pointing `-i` at the Remotion output.
They keep the audio: AAC 128k in the MP4, Opus 96k in the WebM — add
`-c:a aac -b:a 128k` / `-c:a libopus -b:a 96k` if your ffmpeg defaults differ.)

**Sound.** The reel is cut to a 150 BPM grid — one beat is exactly 12 frames —
and every scene change lands on a beat. `tools/score.py` in the Remotion project
synthesises the original score (numpy only: drums, bass and pads ducked under the
kick, a build under the brand roll, a final chord that is silent by the loop
point) and lays SFX from Alan's library (`~/Movies/Alan's_Projects/Quick Edits/The
Common Use`) on the cuts: shutter on the GEAR slit, whoosh on the TECH wipe, focus
beep on the CREATOR iris, a glitch or shutter on each montage cut, a tick for
every brand name that rolls past, a digital hit on the logo. Both mixes are
normalised to -14 LUFS. It also writes `showreel-audio-alt.wav` — the same SFX
over "Tweet and Delete (Dylan Sitts Remix)"; point `AUDIO` in `Showreel.tsx` at it
to render that version instead. Run `python3 tools/score.py` before rendering.

On the page the reel still autoplays **muted** — browsers block sound without a
user gesture — and the SOUND OFF/ON pill on the frame unmutes it and restarts the
score from its first beat.
The poster `assets/poster/showreel.webp` is the frame at 2.3s (GEAR. over the RØDE arm).

## Cache busting

GitHub Pages serves assets with `cache-control: max-age=600`, so a deploy that
changes `index.html` and `style.css` together can leave visitors on new markup
with ten-minute-old CSS — which renders badly, not just unstyled. The stylesheet
link therefore carries a content hash (the value below is only an example — read the
current one out of `index.html`):

```
<link rel="stylesheet" href="style.css?v=ef6a43e6">
```

**Re-hash it whenever `style.css` changes**, before committing. Every page references
the stylesheet, and all of them must move in the same commit or an inner page renders
against stale CSS:

```
V=$(md5 -q style.css | cut -c1-8)
sed -i '' "s|href=\"style.css[^\"]*\"|href=\"style.css?v=$V\"|" index.html
for f in gear media-kit tools; do
  sed -i '' "s|href=\"../style.css[^\"]*\"|href=\"../style.css?v=$V\"|" $f/index.html
done
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

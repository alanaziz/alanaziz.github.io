# alanaziz.github.io

Personal site for Alan Aziz — gadget reviews. Served by GitHub Pages at
**https://alanaziz.com**.

## Structure

```
index.html      markup
style.css       all styles
assets/         images, icons, downloads
CNAME           custom domain (alanaziz.com) — do not delete
```

## External dependencies

Fonts load at runtime from Google Fonts (JetBrains Mono). No build step.

## Media slots

The `.slot` blocks (hero panel and each review thumbnail) are visual placeholders
marking where artwork goes — they are not upload widgets, since Pages is static.
To fill one, drop the file in `assets/` and replace the `<div class="slot">…</div>`
with an `<img>` or `<video>`.

## Local preview

```
python3 -m http.server 8000
```

Then visit http://localhost:8000

## Deploying

Pages publishes from `main`. Push to `main` and the live site updates within
a minute or two.

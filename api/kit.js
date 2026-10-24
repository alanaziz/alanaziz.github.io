// GET /media-kit/full/?t=TOKEN (rewritten here by vercel.json).
// The full kit, rate card included, rendered only for a valid signed link.
// Rates live in this file, not in any static page, so there's no URL to
// guess. Update RATES and STATS here when they change.

const { verifyToken, esc, fmtDate } = require('./_lib/shared');

const STATS_AS_OF = '25 Oct 2026';
const STATS = [
  ['39.8K', 'Followers · Instagram & TikTok'],
  ['552.5K', 'TikTok likes'],
  ['20', 'Brands reviewed'],
];
const RATE = { label: 'One video · Instagram & TikTok', amount: 'RM500', extra: '+ review unit' };
const INCLUDES = [
  'One dedicated video, posted on Instagram & TikTok, 60–90 seconds, vertical 9:16',
  'Unboxing, setup and real use on camera, filmed in my studio',
  'Your key features and specs covered',
  'Brand tag and paid-partnership label',
];
const ADD_ONS = 'Raw footage and usage rights are quoted per brief.';
const BRANDS = ['RØDE', 'DJI', 'Insta360', 'Hollyland', 'Saramonic', 'Comica', 'Maono', 'Amaran', 'Colbor', 'Ulanzi', 'Ugreen',
  'Xiaomi', 'Redmi', 'Vivo', 'Realme', 'Infinix', 'Trapo', 'MR★K.A.R', 'Homan', 'Pixel Distribution'];

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<link rel="icon" href="/assets/logo/icon-32.png" sizes="32x32">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{--bg:#222;--ink-hi:#F7F7F7;--ink:#E5E7EB;--muted:rgba(224,224,224,.62);--line:rgba(255,255,255,.16);--line-soft:rgba(255,255,255,.09);--rec:#FF3B30;
  --mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.7 var(--mono);-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:880px;margin:0 auto;padding:40px max(24px,env(safe-area-inset-left)) 64px max(24px,env(safe-area-inset-right));display:grid;gap:44px}
.top{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-bottom:14px;border-bottom:1px solid var(--line-soft);font-size:12px;letter-spacing:.16em}
.top a{text-decoration:none;color:var(--ink-hi)}
.rec{display:inline-flex;align-items:center;gap:8px}
.rec::before{content:"";width:8px;height:8px;border-radius:50%;background:var(--rec)}
h1{margin:0;font-size:clamp(28px,6vw,44px);font-weight:700;letter-spacing:.02em;color:var(--ink-hi);line-height:1.1}
h2{margin:0 0 18px;font-size:13px;font-weight:500;letter-spacing:.22em;color:var(--ink-hi);padding-bottom:14px;border-bottom:1px solid var(--line-soft)}
.label{font-size:11.5px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase}
.for{margin-top:10px}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.stats div{border:1px solid var(--line-soft);border-radius:14px;padding:18px;display:grid;gap:4px;min-width:0}
.stats b{font-size:clamp(22px,4vw,30px);color:var(--ink-hi);font-variant-numeric:tabular-nums}
.rate{border:1px solid var(--line);border-radius:14px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr)}
.rate .price{padding:24px;border-right:1px solid var(--line-soft);display:grid;gap:6px;align-content:start}
.rate .amount{font-size:clamp(34px,7vw,48px);font-weight:700;color:var(--ink-hi);line-height:1}
.rate .amount small{font-size:13px;font-weight:400;color:var(--muted)}
.rate ul{margin:0;padding:24px 24px 24px 42px;display:grid;gap:8px}
.rate li::marker{color:var(--rec)}
p{margin:0;max-width:64ch}
.note{margin-top:14px;color:var(--muted)}
.brands{display:flex;flex-wrap:wrap;gap:8px 22px;color:var(--ink-hi)}
.mail{font-size:15px;color:var(--ink-hi);user-select:all}
.foot{padding-top:14px;border-top:1px solid var(--line-soft);font-size:11.5px;letter-spacing:.14em;color:var(--muted)}
@media (max-width:620px){.stats{grid-template-columns:1fr 1fr}.rate{grid-template-columns:1fr}.rate .price{border-right:0;border-bottom:1px solid var(--line-soft)}}
</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

function fullKit(email, expires) {
  return page('FULL MEDIA KIT — Alan Aziz Review', `
<div class="top"><a href="/">[ ALAN AZIZ REVIEW ]</a><span class="rec">FULL MEDIA KIT</span></div>
<header>
  <h1>ALAN AZIZ</h1>
  <p class="label for">Prepared for ${esc(email)} · link valid until ${fmtDate(expires)}</p>
</header>
<section>
  <h2>NUMBERS</h2>
  <div class="stats">${STATS.map(([v, l]) => `<div><b>${v}</b><span class="label">${l}</span></div>`).join('')}</div>
  <p class="note">As of ${STATS_AS_OF}: Instagram about 2.7K and TikTok 37.1K followers, both @alanazizreview. Current Instagram &amp; TikTok Insights screenshots on request.</p>
</section>
<section>
  <h2>RATE CARD</h2>
  <div class="rate">
    <div class="price"><span class="label">${RATE.label}</span><div class="amount">${RATE.amount} <small>${RATE.extra}</small></div></div>
    <ul>${INCLUDES.map((i) => `<li>${i}</li>`).join('')}</ul>
  </div>
  <p class="note">${ADD_ONS}</p>
</section>
<section>
  <h2>INDEPENDENCE</h2>
  <p>Every opinion comes from my own hands-on use. Brands can check the facts and specs before a video goes live, but no brand, company or outside party shapes the verdict.</p>
</section>
<section>
  <h2>BRANDS I'VE REVIEWED</h2>
  <div class="brands">${BRANDS.map((b) => `<span>${b}</span>`).join('')}</div>
</section>
<section>
  <h2>BOOK A VIDEO</h2>
  <p>Reply to the email that brought you here, or write to</p>
  <p class="mail" style="margin-top:6px">inquiry@alanaziz.com</p>
</section>
<div class="foot">© 2026 ALAN AZIZ · KUALA LUMPUR</div>`);
}

function noKit(heading, text) {
  return page('MEDIA KIT — Alan Aziz Review', `
<div class="top"><a href="/">[ ALAN AZIZ REVIEW ]</a><span class="rec">FULL MEDIA KIT</span></div>
<header><h1>${heading}</h1></header>
<p>${text}</p>
<p><a href="/media-kit/#contact">Request a fresh link on alanaziz.com/media-kit →</a></p>`);
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');

  const v = verifyToken(req.query.t);
  if (!v) return res.status(404).send(noKit('LINK NOT FOUND', 'This media kit link isn’t valid. It may have been copied incompletely.'));
  if (v.expired) return res.status(410).send(noKit('LINK EXPIRED', `This link expired on ${fmtDate(v.expires)}. Fill in the form again and a new one will be emailed to you.`));
  return res.status(200).send(fullKit(v.email, v.expires));
};

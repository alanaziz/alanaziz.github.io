// GET /media-kit/full/?t=TOKEN (rewritten here by vercel.json).
// A valid signed link downloads the PDF kit (rate card included); add &view=1
// to see the HTML page the PDF is rendered from. Re-export the PDF to
// api/_lib/ whenever the rates or stats below change.
// Rates live in this file, not in any static page, so there's no URL to
// guess. Update PACKAGES, ADD_ONS and SOCIALS here when they change.

const fs = require('fs');
const path = require('path');
const { verifyToken, esc, fmtDate } = require('./_lib/shared');

const PDF = path.join(__dirname, '_lib', 'alanaziz-media-kit.pdf');

const STATS_AS_OF = '25 Oct 2026';
// Cards follow the homepage proof cards, Instagram first; keep the figures in step with index.html.
const SOCIALS = [
  { icon: 'ig', fig: '2.7K', label: 'Instagram followers', go: '@ALANAZIZREVIEW', href: 'https://www.instagram.com/alanazizreview/' },
  { icon: 'tt', fig: '37.1K', label: 'TikTok followers · 552.5K likes', go: '@ALANAZIZREVIEW', href: 'https://www.tiktok.com/@alanazizreview' },
  { icon: 'hub', fig: '20', label: 'Brands collaborated', go: 'SEE THE BRANDS', href: '#brands' },
];
// Rates are in RM, nett: Alan isn't SST-registered, so no SST is added.
const PACKAGES = [
  {
    label: 'One video · Instagram & TikTok', amount: 'RM500', extra: '+ review unit',
    includes: [
      'One dedicated video, posted on Instagram & TikTok, 60–90 seconds, vertical 9:16',
      'Your key features and specs covered',
      'Brand tag and paid-partnership label',
    ],
  },
];
const ADD_ONS = [
  ['Usage rights: ads code, 30 days', 'RM300'],
];
const TERMS = 'All rates in RM. No SST is charged. 50% to confirm the booking, the balance on posting day.';
const FORMATS = [
  ['GEAR FIRST LOOK', 'Unboxing and first impressions of new launches, out while people are still searching for it.'],
  ['STUDIO TEST', 'Mics, lights and cameras tested side by side in my studio, same setup every time.'],
  ['BRAND COLLAB', 'A dedicated video for your product, clearly labelled, filmed with the same care as my own reviews.'],
];
const STEPS = [
  ['DISCOVERY', 'Send me your brief: the product, the points that matter to you, deliverables and a posting date.'],
  ['CAPTURE & REVIEW', 'I hand over the script, captions, brand tags and hashtags.'],
  ['SHARE & REPORT', 'The video goes live on Instagram & TikTok on the agreed date. Two weeks later you get a report on the video I made.'],
];
const CONTACT = {
  email: 'inquiry@alanaziz.com',
  whatsapp: '60126472905',
  whatsappLabel: '+60126472905',
};
// [name, logo file in /assets/brand-logo/], same order as the homepage strip
const BRANDS = [
  ['RØDE', 'rode'], ['DJI', 'dji'], ['Insta360', 'insta360'], ['Hollyland', 'hollyland'], ['Saramonic', 'saramonic'],
  ['Comica', 'comica'], ['Maono', 'maono'], ['Amaran', 'amaran'], ['Colbor', 'colbor'], ['Ulanzi', 'ulanzi'],
  ['Ugreen', 'ugreen'], ['Xiaomi', 'xiaomi'], ['Redmi', 'redmi'], ['Vivo', 'vivo'], ['Realme', 'realme'],
  ['Infinix', 'infinix'], ['Trapo', 'trapo'], ['MR★K.A.R', 'mr-kar'], ['Homan', 'homan'], ['Pixel Distribution', 'pixel-distribution'],
];
const LOGO = '/assets/logo/alan-aziz-mark.webp';

// Brand icons from the homepage sprite (Instagram, TikTok) and Simple Icons (WhatsApp)
const ICONS = {
  ig: '<path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
  tt: '<path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  wa: '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>',
  hub: '<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.6"/><circle cx="4.5" cy="5" r="1.8"/><circle cx="19.5" cy="5" r="1.8"/><circle cx="4.5" cy="19" r="1.8"/><circle cx="19.5" cy="19" r="1.8"/><path d="M6 6.4 10 10.2M18 6.4 14 10.2M6 17.6l4-3.8M18 17.6l-4-3.8"/></g>',
  mail: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></g>',
};
const icon = (name, size, cls = '') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]}</svg>`;

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
.top .brand{display:inline-flex;align-items:center;gap:10px}
.top .brand img{height:22px;width:auto}
.hero{display:flex;align-items:center;gap:22px}
.hero img{height:72px;width:auto;flex:none}
.stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.stat{position:relative;overflow:hidden;min-height:150px;padding:20px;border:1px solid var(--line);border-radius:18px;text-decoration:none;
  background:radial-gradient(ellipse 60% 95% at 85% 50%,#2c3142 0%,#202022 60%,#1b1b1b 100%);display:flex;flex-direction:column;gap:6px;min-width:0}
.stat > *{position:relative;z-index:1}
.stat b{font-size:clamp(26px,4.5vw,36px);font-weight:700;line-height:1;color:var(--ink-hi);font-variant-numeric:tabular-nums}
.stat .go{margin-top:auto;padding-top:10px;font-size:10.5px;letter-spacing:.14em;color:var(--muted)}
/* the platform icon sits inside the card's right edge, fading in from the left like the newsroom thumbnails */
.stat .label{max-width:60%}
.stat .bg{position:absolute;z-index:0;right:-10px;top:50%;transform:translateY(-50%);color:var(--ink-hi);opacity:.55;
  -webkit-mask-image:linear-gradient(to right,transparent 0,#000 75%);mask-image:linear-gradient(to right,transparent 0,#000 75%)}
.logos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.logos span{display:flex;align-items:center;justify-content:center;height:46px;padding:0 12px;background:#E5E7EB;border-radius:10px}
.logos img{display:block;max-width:84px;max-height:30px;width:auto;height:auto}
.pkgs{display:grid;gap:16px}
.pkg{border:1px solid var(--line);border-radius:14px;padding:22px;display:grid;gap:6px;align-content:start;min-width:0}
.pkg .amount{font-size:clamp(30px,6vw,42px);font-weight:700;color:var(--ink-hi);line-height:1.1}
.pkg .amount small{font-size:13px;font-weight:400;color:var(--muted)}
.pkg ul{margin:10px 0 0;padding-left:18px;display:grid;gap:6px}
.pkg li::marker{color:var(--rec)}
.addons{width:100%;border-collapse:collapse;margin-top:22px}
.addons caption{text-align:left;padding-bottom:8px}
.addons td{padding:10px 0;border-top:1px solid var(--line-soft);vertical-align:top}
.addons td:last-child{text-align:right;color:var(--ink-hi);white-space:nowrap;padding-left:16px;font-variant-numeric:tabular-nums}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0;padding:0;list-style:none}
.cards li{border:1px solid var(--line-soft);border-radius:14px;padding:18px;display:grid;gap:8px;align-content:start;min-width:0}
.cards b{color:var(--ink-hi);font-weight:500;letter-spacing:.12em;font-size:12.5px}
.cards .n{color:var(--rec);font-size:11.5px;letter-spacing:.14em}
.contact{display:flex;flex-wrap:wrap;gap:14px 40px}
.terms{font-style:italic;font-size:12px}
.contact a{display:inline-flex;align-items:center;gap:12px;color:var(--ink-hi);font-size:15px;text-decoration:none}
.contact a svg{flex:none;padding:9px;border:1px solid var(--line);border-radius:12px;box-sizing:content-box}
p{margin:0;max-width:64ch}
.note{margin-top:14px;color:var(--muted)}
.foot{display:flex;justify-content:space-between;gap:8px 24px;flex-wrap:wrap;padding-top:14px;border-top:1px solid var(--line-soft);font-size:11.5px;letter-spacing:.14em;color:var(--muted)}
@media (max-width:620px){.stats,.cards{grid-template-columns:1fr}.logos{grid-template-columns:repeat(3,minmax(0,1fr))}.hero img{height:52px}}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}h2{break-after:avoid}.pkg,.cards li,.stat,.addons tr{break-inside:avoid}}
@page{margin:0;background:#222}
</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>`;
}

// email is empty for the PDF copy, which isn't tied to one inbox
function fullKit(email, expires) {
  const sub = email
    ? `Prepared for ${esc(email)} · link valid until ${fmtDate(expires)}`
    : `Gadgets &amp; tech creator · Kuala Lumpur · ${STATS_AS_OF}`;
  return page('FULL MEDIA KIT — Alan Aziz Review', `
<div class="top"><a class="brand" href="https://alanaziz.com/"><img src="${LOGO}" alt="">[ ALAN AZIZ REVIEW ]</a><span class="rec">FULL MEDIA KIT</span></div>
<header class="hero">
  <img src="${LOGO}" alt="Alan Aziz logo" width="93" height="72">
  <div><h1>ALAN AZIZ</h1><p class="label for">${sub}</p></div>
</header>
<section>
  <h2>ABOUT ME</h2>
  <p>Hi, I'm Alan. I make tests and reviews of creator gear and tech: mics, lights, cameras and phones, filmed in my studio in Kuala Lumpur.</p>
  <p style="margin-top:12px">I didn't set out to become an influencer. I started because I had opinions and needed somewhere to put them. I don't review for myself. I review for the person doing their research before they buy.</p>
</section>
<section>
  <h2>SOCIALS</h2>
  <div class="stats">${SOCIALS.map((c) => `<a class="stat" href="${c.href}"${c.href[0] === '#' ? '' : ' target="_blank" rel="noopener"'}>
    <b>${c.fig}</b><span class="label">${c.label}</span><span class="go">${c.go} ${c.href[0] === '#' ? '↓' : '↗'}</span>
    ${icon(c.icon, 100, 'bg')}</a>`).join('')}</div>
</section>
<section id="brands">
  <h2>BRANDS I'VE WORKED WITH</h2>
  <div class="logos">${BRANDS.map(([n, f]) => `<span><img src="/assets/brand-logo/${f}.webp" alt="${n}" loading="lazy"></span>`).join('')}</div>
</section>
<section>
  <h2>WHAT I MAKE</h2>
  <ul class="cards">${FORMATS.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ul>
</section>
<section>
  <h2>RATE CARD</h2>
  <div class="pkgs">${PACKAGES.map((p) => `
    <div class="pkg"><span class="label">${p.label}</span><div class="amount">${p.amount} <small>${p.extra}</small></div>
      <ul>${p.includes.map((i) => `<li>${i}</li>`).join('')}</ul></div>`).join('')}
  </div>
  <table class="addons"><caption class="label">Add-ons</caption>
    ${ADD_ONS.map(([n, a]) => `<tr><td>${n}</td><td>${a}</td></tr>`).join('')}
  </table>
  <p class="note terms">${TERMS}</p>
</section>
<section>
  <h2>WHAT'S NEXT</h2>
  <ol class="cards">${STEPS.map(([t, d], i) => `<li><span class="n">0${i + 1}</span><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
</section>
<section>
  <h2>CONTACT ME</h2>
  <div class="contact">
    <a href="mailto:${CONTACT.email}">${icon('mail', 20)}${CONTACT.email}</a>
    <a href="https://wa.me/${CONTACT.whatsapp}">${icon('wa', 20)}${CONTACT.whatsappLabel}</a>
  </div>
</section>
<div class="foot"><span>© 2026 ALAN AZIZ · KUALA LUMPUR · INSTAGRAM &amp; TIKTOK @ALANAZIZREVIEW</span><span>CONFIDENTIAL</span></div>`);
}

function noKit(heading, text) {
  return page('MEDIA KIT — Alan Aziz Review', `
<div class="top"><a href="/">[ ALAN AZIZ REVIEW ]</a><span class="rec">FULL MEDIA KIT</span></div>
<header><h1>${heading}</h1></header>
<p>${text}</p>
<p><a href="/#contact">Request a fresh link on alanaziz.com →</a></p>`);
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');

  const v = verifyToken(req.query.t);
  if (!v) return res.status(404).send(noKit('LINK NOT FOUND', 'This media kit link isn’t valid. It may have been copied incompletely.'));
  if (v.expired) return res.status(410).send(noKit('LINK EXPIRED', `This link expired on ${fmtDate(v.expires)}. Fill in the form again and a new one will be emailed to you.`));
  if (req.query.view) return res.status(200).send(fullKit(v.email, v.expires));
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="alanaziz-media-kit.pdf"');
  return res.status(200).send(fs.readFileSync(PDF));
};

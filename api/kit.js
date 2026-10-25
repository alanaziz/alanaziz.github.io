// GET /media-kit/full/?t=TOKEN (rewritten here by vercel.json).
// The full kit, rate card included, rendered only for a valid signed link.
// Rates live in this file, not in any static page, so there's no URL to
// guess. Update PACKAGES, ADD_ONS and SOCIALS here when they change.
//
// Design: six 16:9 slides in the Open Residency playbook style, the same as the
// PDF kit. Two faces only (SF Pro Display Regular, Playfair Display Bold Italic),
// sizes on one × body scale, spacing on an 8px grid with 4px half-steps.

const { verifyToken, esc, fmtDate } = require('./_lib/shared');

const STATS_AS_OF = '25 Oct 2026';
const STATS_MONTH = 'Oct 2026';
// Instagram first; keep the figures in step with the homepage proof cards in index.html.
const SOCIALS = [
  { name: 'Instagram', handle: '@alanazizreview', href: 'https://www.instagram.com/alanazizreview/', audience: '2.7K followers' },
  { name: 'TikTok', handle: '@alanazizreview', href: 'https://www.tiktok.com/@alanazizreview', audience: '37.1K followers · 552.5K likes' },
];
// Rates are in RM, nett: Alan isn't SST-registered, so no SST is added.
const PACKAGES = [
  {
    label: 'One video · Instagram & TikTok', amount: 'RM500', extra: '+ review unit',
    includes: [
      'One dedicated video, 60–90 seconds, vertical 9:16',
      'Your key features and specs covered',
      'Brand tag and paid-partnership label',
    ],
  },
];
const ADD_ONS = [
  ['Add-on: usage rights', 'Ads code, 30 days', 'RM300'],
];
const TERMS = ['50% to confirm the booking', 'The balance on posting day', 'All rates in RM. No SST is charged.'];
const NICHE = [
  ['Mics', 'RØDE Wireless Micro, Saramonic Blinkme B2, Comica VM40'],
  ['Lights', 'Amaran Verge Max'],
  ['Cameras', 'DJI Mini 4 Pro, Insta360 GO 3'],
  ['Phones', 'Xiaomi, Redmi, Vivo, Realme, Infinix'],
];
const FORMATS = [
  ['Gear First Look', 'Unboxing and first impressions of new launches, out while people are still searching for it.'],
  ['Studio Test', 'Mics, lights and cameras tested side by side in my studio, same setup every time.'],
  ['Brand Collab', 'A dedicated video for your product, clearly labelled, filmed with the same care as my own reviews.'],
];
const HOW_I_REVIEW = [
  'Real demos and product tests, shot in my studio',
  'You can check facts and specs before posting',
  '<b>The verdict stays mine:</b> the good parts and the drawbacks',
];
// The roadmap on the last slide: [who, when, stop, what happens]
const STEPS = [
  ['You', 'Start', 'Send your brief', 'The product, the points that matter to you, deliverables and a posting date.'],
  ['You', 'Booking', 'Confirm', 'Pay the 50% deposit to lock in the date, and send the review unit to my studio.'],
  ['Me', 'Before posting', 'Film & check', 'I film in my studio, then hand over the script, captions, brand tags and hashtags for you to check facts and specs.'],
  ['Me', 'Agreed date', 'Go live', 'The video goes up on Instagram & TikTok. The balance is due on posting day.'],
  ['Me', '+2 weeks', 'Report', 'You get a report on the video I made.'],
];
const CONTACT = {
  email: 'inquiry@alanaziz.com',
  whatsapp: '60126472905',
  whatsappLabel: '+60126472905',
  site: 'alanaziz.com',
};
// [name, logo file in /assets/brand-logo/, tall], same order as the homepage strip.
// The kit shows every logo as a white mark, so MR★K.A.R uses a cut-out without its red box.
const BRANDS = [
  ['RØDE', 'rode.webp'], ['DJI', 'dji.webp', 1], ['Insta360', 'insta360.webp'], ['Hollyland', 'hollyland.webp'], ['Saramonic', 'saramonic.webp'],
  ['Comica', 'comica.webp'], ['Maono', 'maono.webp', 1], ['Amaran', 'amaran.webp'], ['Colbor', 'colbor.webp'], ['Ulanzi', 'ulanzi.webp', 1],
  ['Ugreen', 'ugreen.webp'], ['Xiaomi', 'xiaomi.webp', 1], ['Redmi', 'redmi.webp'], ['Vivo', 'vivo.webp'], ['Realme', 'realme.webp'],
  ['Infinix', 'infinix.webp'], ['Trapo', 'trapo.webp'], ['MR★K.A.R', 'mr-kar-mono.webp'], ['Homan', 'homan.webp'], ['Pixel Distribution', 'pixel-distribution.webp', 1],
];
const LOGO = '/assets/logo/alan-aziz-mark.webp';

// Brand icons from the homepage sprite (Instagram, TikTok), Simple Icons (WhatsApp) and line icons (mail, web)
const ICONS = {
  ig: '<path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>',
  tt: '<path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>',
  wa: '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>',
  mail: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></g>',
  web: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.6 2.7 3.9 5.9 3.9 9.5s-1.3 6.8-3.9 9.5c-2.6-2.7-3.9-5.9-3.9-9.5S9.4 5.2 12 2.5Z"/></g>',
};

const icon = (name, label) => `<svg class="ico" viewBox="0 0 24 24" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${ICONS[name]}</svg>`;

const CSS = `
:root{
  --page:#101214;--ink:#F5F5F4;--soft:rgba(245,245,244,.74);--rule:rgba(245,245,244,.88);--hair:rgba(245,245,244,.22);
  --red:#FF3B30;--lit:#767C80;--mid:#3D4348;--deep:#1A1E21;
  --sans:"SF Pro Display",-apple-system,BlinkMacSystemFont,system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  --serif:"Playfair Display",Georgia,"Times New Roman",serif;
  /* type scale, × body (body = 20px on a 1600px slide) */
  --x08:.8em;--x1:1em;--x125:1.25em;--x15:1.5em;--x2:2em;--x25:2.5em;--x4:4em;--x5:5em;
  color-scheme:dark;
}
*{box-sizing:border-box}
body{margin:0;background:var(--page);color:var(--ink);font-family:var(--sans);font-weight:400;-webkit-font-smoothing:antialiased;
  padding-block:24px 48px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
b,strong,th,h1,h2,h3,h4{font-weight:400}
a{color:inherit}
.deck{container-type:inline-size;max-width:1280px;margin:0 auto;display:grid;gap:24px}
/* --u is 8px on a 1600px slide and scales with it; every gap is a multiple of --u or half of it */
.slide{
  --u:.5cqw;--s05:calc(var(--u)*.5);--s1:var(--u);--s15:calc(var(--u)*1.5);--s2:calc(var(--u)*2);--s3:calc(var(--u)*3);
  --s4:calc(var(--u)*4);--s5:calc(var(--u)*5);--s6:calc(var(--u)*6);--s10:calc(var(--u)*10);--s12:calc(var(--u)*12);
  --px:var(--s10);--lx:50%;--ly:70%;
  position:relative;overflow:hidden;aspect-ratio:16/9;font-size:clamp(11px,1.25cqw,20px);line-height:1.4;
  padding:var(--s10) var(--px) var(--s12);display:flex;flex-direction:column;gap:var(--s5);
  background:radial-gradient(ellipse 72% 62% at var(--lx) var(--ly),var(--lit) 0%,var(--mid) 46%,var(--deep) 100%);
  border-radius:4px;box-shadow:0 16px 48px rgba(0,0,0,.45)}
/* film grain, like the photo backgrounds in the reference playbook */
.slide::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.22;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.slide > *{position:relative;z-index:1}
/* Playfair Display Bold Italic: accent words only, the size of the text around it */
.quote em,.serif{font-family:var(--serif);font-style:italic;font-weight:700;font-size:1em;letter-spacing:0}
/* heading order: H1 ×4 > H2 ×2.5 > H3 ×1.25 caps > H4 ×1.25 sentence case */
.tbar{align-self:flex-start;margin:0 0 0 calc(-1*var(--px));padding:var(--s05) var(--s2) var(--s05) var(--px);background:var(--red);
  font-size:var(--x25);letter-spacing:-.025em;line-height:1.2;color:#fff}
.head{display:flex;justify-content:space-between;align-items:flex-start;gap:var(--s4)}
.quote{margin:var(--s5) 0 0;max-width:26em;text-align:right;font-size:var(--x125);line-height:1.3}
.cols{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:var(--s4) var(--s6);align-items:start}
.stack{display:grid;gap:var(--s4);min-width:0}
.label{margin:0 0 var(--s2);font-size:var(--x125);line-height:1.2;letter-spacing:.14em;text-transform:uppercase}
p{margin:0;max-width:44em}
p + p{margin-top:var(--s15)}
.arrows{margin:0;padding:0;list-style:none;display:grid;gap:var(--s05);color:var(--soft)}
.arrows li::before{content:"→ ";color:var(--ink)}
.arrows b{color:var(--ink)}
.tbl{overflow-x:auto}
table{border-collapse:collapse;width:100%}
th,td{border:1px solid var(--rule);padding:var(--s1) var(--s15);text-align:left;vertical-align:top}
th{font-size:var(--x125);line-height:1.2;letter-spacing:-.01em}
td a{text-decoration-color:var(--hair);text-underline-offset:.2em}
/* first columns hold short names: wide enough that they never wrap mid-name */
.t-formats th:first-child{width:28%}
.t-rate td:first-child{white-space:nowrap}
.rate .cols{grid-template-columns:minmax(0,1.5fr) minmax(0,.5fr)}
.amt{white-space:nowrap;font-variant-numeric:tabular-nums}
.foot{position:absolute;left:var(--px);right:var(--px);bottom:var(--s4);display:flex;justify-content:space-between;align-items:center;gap:var(--s2);font-size:var(--x08);line-height:1}
.conf{display:inline-flex;align-items:center;gap:var(--s5);text-transform:uppercase;letter-spacing:.14em}
.pg{letter-spacing:0;font-variant-numeric:tabular-nums}
.ico{width:1em;height:1em;flex:none}

/* cover */
.cover{--lx:50%;--ly:52%;padding:0}
.frame{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
.cover .in{position:absolute;left:calc(var(--u)*15);top:calc(var(--u)*15);right:calc(var(--u)*16)}
.brandline{display:flex;align-items:baseline;gap:var(--s2);flex-wrap:wrap;margin:0;font-size:var(--x4);letter-spacing:-.035em;line-height:1}
/* subtitle: label · 16px · icons 8px apart · 8px · handle */
.sub{margin-top:var(--s2);display:flex;align-items:center;flex-wrap:wrap;gap:var(--s2);font-size:var(--x15);letter-spacing:-.015em;line-height:1.2}
.soc{display:inline-flex;align-items:center;gap:var(--s1)}
.soc a{display:inline-flex;text-decoration:none}
/* contents: rows run down 1–5 · number, section, page · ×1.25, 48px rows (hairline included) */
.toc{margin-top:var(--s10);max-width:calc(var(--u)*48)} /* 384px: ends before the faded logo starts */
.toc h2{margin:0 0 var(--s2)}
.toc ol{margin:0;padding:0;list-style:none;border-top:1px solid var(--hair)}
.toc a{display:grid;grid-template-columns:var(--s4) minmax(0,1fr) auto;align-items:center;gap:var(--s2);min-height:var(--s6);padding:var(--s1) 0;border-bottom:1px solid var(--hair);text-decoration:none;font-size:var(--x125);line-height:1.2}
.toc .n,.toc .p{color:var(--soft);font-variant-numeric:tabular-nums}
.toc a:hover .t{text-decoration:underline;text-underline-offset:.2em}
.for{position:absolute;left:calc(var(--u)*15);right:calc(var(--u)*16);bottom:calc(var(--u)*16);z-index:2;margin:0;font-size:var(--x08);letter-spacing:.14em;text-transform:uppercase;color:var(--soft)}
.tag{position:absolute;right:0;top:calc(var(--u)*33);z-index:2;background:var(--red);color:#fff;font-size:var(--x15);letter-spacing:-.015em;line-height:1.2;padding:var(--s1) var(--s3) var(--s1) var(--s2)}
/* the logo sits dead centre in the spotlight, on the back layer */
.cover .subject{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:34%;max-width:100%;z-index:0;opacity:.2;
  filter:grayscale(1) drop-shadow(0 var(--s6) var(--s4) rgba(0,0,0,.55))}
.cover .in,.cover .tag,.cover .foot{z-index:2}
.cover .foot{left:var(--s10);right:var(--s10)}

/* brands: every logo as a white mark in a thin-line grid */
.logos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));border-top:1px solid var(--rule);border-left:1px solid var(--rule)}
.logos span{display:flex;align-items:center;justify-content:center;height:var(--s12);padding:var(--s2) var(--s3);border-right:1px solid var(--rule);border-bottom:1px solid var(--rule)}
.logos img{display:block;max-width:100%;max-height:var(--s5);width:auto;height:auto;filter:brightness(0) invert(1);opacity:.92}
.logos img.tall{max-height:calc(var(--u)*7)}

/* rate card */
.price{display:grid;gap:var(--s1);justify-items:end;text-align:right}
.price .big{font-size:var(--x5);letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums}
.price .serif{font-size:var(--x2);line-height:1.2}
.price .small{font-size:var(--x08);letter-spacing:.14em;text-transform:uppercase;color:var(--soft)}

/* roadmap */
.road{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0 var(--s4)}
.road li{position:relative;display:grid;align-content:start;gap:var(--s1);min-width:0}
.road li:not(:last-child)::after{content:"";position:absolute;top:var(--s3);left:calc(var(--s6) + var(--s1));right:calc(var(--s3)*-1);height:1px;background:var(--rule)}
.road li:not(:last-child)::before{content:"";position:absolute;top:calc(var(--s3) - var(--s05));right:calc(var(--s3)*-1);width:var(--s1);height:var(--s1);border-top:1px solid var(--rule);border-right:1px solid var(--rule);transform:rotate(45deg)}
.node{display:grid;place-items:center;width:var(--s6);height:var(--s6);border:1px solid var(--rule);border-radius:50%;font-size:var(--x125);line-height:1;font-variant-numeric:tabular-nums;background:var(--deep)}
.road li:first-child .node{background:var(--red);border-color:var(--red)}
.when{margin-top:var(--s1);font-size:var(--x08);line-height:1.2;letter-spacing:.14em;text-transform:uppercase;color:var(--soft)}
.when b{color:var(--red)}
.road h4{margin:0;font-size:var(--x125);letter-spacing:-.01em;line-height:1.2}
.road p{color:var(--soft)}
.reach{margin-top:var(--s6)}
.contact{display:flex;flex-wrap:wrap;gap:var(--s1) var(--s5);font-size:var(--x125)}
.contact a{display:inline-flex;align-items:center;gap:var(--s15);text-decoration:none}
.contact .ico{width:var(--s3);height:var(--s3);padding:var(--s1);box-sizing:content-box;border:1px solid var(--rule);border-radius:var(--s1)}
a:focus-visible{outline:2px solid var(--red);outline-offset:4px}

/* the block under each title sits centred between the title and the footer.
   CSS centres it; the script below rounds the offset down to the 8px grid. */
.body{flex:1;display:grid;align-content:center;gap:var(--s5);min-height:0;scroll-padding-top:var(--u)}
.body.snapped{align-content:start}

/* link problems: one slide */
.msg{gap:var(--s3)}
.msg .go{margin-top:var(--s2)}

@container (max-width:760px){
  .slide{--u:4px;aspect-ratio:auto;font-size:13px;--px:var(--s2);padding:var(--s4) var(--px) var(--s10);gap:var(--s3)}
  .head{flex-direction:column;gap:var(--s15)}
  .quote{margin:0;text-align:left}
  .cols,.rate .cols{grid-template-columns:minmax(0,1fr)}
  .t-rate td:first-child{white-space:normal}
  .logos{grid-template-columns:repeat(3,minmax(0,1fr))}
  .price{justify-items:start;text-align:left}
  .frame,.subject{display:none}
  .cover{padding:var(--s4) var(--px) var(--s10);min-height:520px}
  .cover .in{position:static}
  .brandline{font-size:var(--x25)}
  .toc{margin-top:var(--s4);max-width:none}
  .for{position:static;margin-top:var(--s4)}
  .tag{top:auto;bottom:var(--s10)}
  .conf{gap:var(--s2)}
  .road{grid-template-columns:minmax(0,1fr);gap:var(--s3)}
  .road li{padding-left:calc(var(--s6) + var(--s2))}
  .road .node{position:absolute;left:0;top:0}
  .road .when{margin-top:var(--s05)}
  .road li:not(:last-child)::after{top:calc(var(--s6) + var(--s1));bottom:calc(var(--s3)*-1 + var(--s1));left:var(--s3);right:auto;width:1px;height:auto}
  .road li:not(:last-child)::before{display:none}
}
@media print{
  body{padding:0;background:var(--deep);-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .deck{max-width:none;width:1600px;gap:0}
  .slide{border-radius:0;box-shadow:none;break-after:page;height:900px}
}
@page{size:1600px 900px;margin:0}
`;

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
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700&display=swap" rel="stylesheet">
<style>${CSS}</style>
</head>
<body><main class="deck">${body}</main>
<script>
// Centre each slide's .body on the 8px grid: half the free space, rounded to the nearest whole --u step.
// scroll-padding-top carries --u resolved to px. Re-runs on resize and before printing.
(function () {
  function snap() {
    document.querySelectorAll('.slide .body').forEach(function (b) {
      b.classList.remove('snapped'); b.style.paddingTop = '';
      var kids = b.children; if (!kids.length) return;
      var u = parseFloat(getComputedStyle(b).scrollPaddingTop) || 8;
      var used = kids[kids.length - 1].getBoundingClientRect().bottom - kids[0].getBoundingClientRect().top;
      var free = b.clientHeight - used;
      if (free < 2 * u) return;
      // in grid units, not px, so the offset scales with the slide (screen, phone, 1600px print)
      b.style.paddingTop = 'calc(var(--u) * ' + Math.round(free / 2 / u) + ')'; b.classList.add('snapped');
    });
  }
  snap();
  if (document.fonts) document.fonts.ready.then(snap);
  addEventListener('load', snap); addEventListener('resize', snap); addEventListener('beforeprint', snap);
  if (matchMedia) matchMedia('print').addListener(snap);
})();
</script>
</body>
</html>`;
}

const foot = (name, n) => `<div class="foot"><span>${name}</span><span class="conf">Media Kit · Confidential<span class="pg">${String(n).padStart(2, '0')}</span></span></div>`;

// email is empty for the PDF copy, which isn't tied to one inbox
function fullKit(email, expires) {
  const forLine = email
    ? `Prepared for ${esc(email)} · Link valid until ${fmtDate(expires)}`
    : `Kuala Lumpur · ${STATS_AS_OF}`;
  const [pkg] = PACKAGES;
  return page('FULL MEDIA KIT — Alan Aziz Review', `
<section class="slide cover" aria-label="Cover">
  <svg class="frame" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
    <path d="M80 112Q80 80 112 80H1008Q1040 80 1056 104L1112 168Q1136 192 1168 192H1488Q1520 192 1520 224V788Q1520 820 1488 820H112Q80 820 80 788Z" fill="none" stroke="#F5F5F4" stroke-opacity=".8" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
    <path d="M1040 80H1488Q1520 80 1520 112V400" fill="none" stroke="#F5F5F4" stroke-opacity=".35" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
  </svg>
  <img class="subject" src="${LOGO}" alt="">
  <div class="in">
    <h1 class="brandline">ALAN AZIZ <span class="serif">media kit</span></h1>
    <p class="sub"><span>Gadgets &amp; tech creator</span><span class="soc">${SOCIALS.map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${icon(s.name === 'Instagram' ? 'ig' : 'tt', s.name)}</a>`).join('')}<span>@alanazizreview</span></span></p>
    <nav class="toc" aria-label="Contents">
      <h2 class="label">Contents</h2>
      <ol>
        <li><a href="#about"><span class="n">1</span><span class="t">About &amp; socials</span><span class="p">02</span></a></li>
        <li><a href="#brands"><span class="n">2</span><span class="t">Brands I’ve worked with</span><span class="p">03</span></a></li>
        <li><a href="#make"><span class="n">3</span><span class="t">What I make</span><span class="p">04</span></a></li>
        <li><a href="#rates"><span class="n">4</span><span class="t">Rate card</span><span class="p">05</span></a></li>
        <li><a href="#together"><span class="n">5</span><span class="t">Working together</span><span class="p">06</span></a></li>
      </ol>
    </nav>
  </div>
  <p class="for">${forLine}</p>
  <span class="tag">${STATS_MONTH}</span>
  ${foot('Cover', 1)}
</section>

<section class="slide" id="about" style="--lx:78%;--ly:40%" aria-label="About and socials">
  <div class="head">
    <h2 class="tbar">About Alan</h2>
    <p class="quote">“I don’t review for myself. I review for the person doing their <em>research</em> before they buy.”</p>
  </div>
  <div class="body">
  <div class="cols">
    <div class="stack">
      <div>
        <h3 class="label">Who I am</h3>
        <p>I make tests and reviews of creator gear and tech: mics, lights, cameras and phones, filmed in my studio in Kuala Lumpur.</p>
        <p>I didn’t set out to become an influencer. I started because I had opinions and needed somewhere to put them.</p>
      </div>
      <div>
        <h3 class="label">Socials · ${STATS_AS_OF}</h3>
        <div class="tbl"><table>
          <tr><th>Platform</th><th>Handle</th><th>Audience</th></tr>
          ${SOCIALS.map((s) => `<tr><td>${s.name}</td><td><a href="${s.href}" target="_blank" rel="noopener">${s.handle}</a></td><td>${esc(s.audience)}</td></tr>`).join('')}
        </table></div>
      </div>
    </div>
    <div>
      <h3 class="label">My niche</h3>
      <ul class="arrows">${NICHE.map(([k, v]) => `<li><b>${k}:</b> ${esc(v)}</li>`).join('')}</ul>
    </div>
  </div>
  </div>
  ${foot('About &amp; socials', 2)}
</section>

<section class="slide" id="brands" style="--lx:20%;--ly:85%" aria-label="Brands">
  <div class="head">
    <h2 class="tbar">Brands I’ve Worked With</h2>
    <p class="quote">“Every product here was sent by the brand. Every <em>verdict</em> in the video is mine.”</p>
  </div>
  <div class="body">
  <div>
    <h3 class="label">${BRANDS.length} brands · real products</h3>
    <div class="logos">${BRANDS.map(([n, f, tall]) => `<span><img${tall ? ' class="tall"' : ''} src="/assets/brand-logo/${f}" alt="${esc(n)}" loading="lazy"></span>`).join('')}</div>
  </div>
  </div>
  ${foot('Brands', 3)}
</section>

<section class="slide" id="make" style="--lx:82%;--ly:60%" aria-label="What I make">
  <div class="head">
    <h2 class="tbar">What I Make</h2>
    <p class="quote">“Mics, lights and cameras tested side by side, same <em>setup</em> every time.”</p>
  </div>
  <div class="body">
  <div class="cols">
    <div class="tbl"><table class="t-formats">
      <tr><th>Format</th><th>What it is</th></tr>
      ${FORMATS.map(([t, d]) => `<tr><td>${t}</td><td>${esc(d)}</td></tr>`).join('')}
    </table></div>
    <div>
      <h3 class="label">How I review</h3>
      <ul class="arrows">${HOW_I_REVIEW.map((t) => `<li>${t}</li>`).join('')}</ul>
    </div>
  </div>
  </div>
  ${foot('What I make', 4)}
</section>

<section class="slide rate" id="rates" style="--lx:30%;--ly:30%" aria-label="Rate card">
  <div class="head">
    <h2 class="tbar">Rate Card</h2>
  </div>
  <div class="body">
  <div class="cols">
    <div class="stack">
      <div class="tbl"><table class="t-rate">
        <tr><th>Package</th><th>What’s included</th><th>Rate</th></tr>
        ${PACKAGES.map((p) => `<tr><td>${esc(p.label)}</td><td>${p.includes.map(esc).join(' · ')}</td><td class="amt">${p.amount} ${esc(p.extra)}</td></tr>`).join('')}
        ${ADD_ONS.map(([n, w, a]) => `<tr><td>${esc(n)}</td><td>${esc(w)}</td><td class="amt">${a}</td></tr>`).join('')}
      </table></div>
      <div>
        <h3 class="label">Terms</h3>
        <ul class="arrows">${TERMS.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
    </div>
    <div class="price">
      <span class="small">One video, both platforms</span>
      <span class="big">${pkg.amount}</span>
      <span class="serif">${esc(pkg.extra)}</span>
    </div>
  </div>
  </div>
  ${foot('Rate card', 5)}
</section>

<section class="slide" id="together" style="--lx:50%;--ly:62%" aria-label="Working together">
  <div class="head">
    <h2 class="tbar">Working Together</h2>
  </div>
  <div class="body">
  <div>
    <h3 class="label">The roadmap · from brief to report</h3>
    <ol class="road">${STEPS.map(([who, when, t, d], i) => `
      <li><span class="node">${i + 1}</span><span class="when"><b>${who}</b> · ${esc(when)}</span><h4>${esc(t)}</h4><p>${esc(d)}</p></li>`).join('')}
    </ol>
  </div>
  <div class="reach">
    <h3 class="label">Start here</h3>
    <div class="contact">
      <a href="mailto:${CONTACT.email}">${icon('mail', 'Email')}${CONTACT.email}</a>
      <a href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener">${icon('wa', 'WhatsApp')}${CONTACT.whatsappLabel}</a>
      <a href="https://${CONTACT.site}/" target="_blank" rel="noopener">${icon('web', 'Website')}${CONTACT.site}</a>
    </div>
  </div>
  </div>
  ${foot('Working together', 6)}
</section>`);
}

function noKit(heading, text) {
  return page('MEDIA KIT — Alan Aziz Review', `
<section class="slide msg" aria-label="${heading}">
  <h1 class="tbar">${heading}</h1>
  <p>${text}</p>
  <p class="go"><a href="/#contact">Request a fresh link on alanaziz.com →</a></p>
  ${foot('Media kit', 1)}
</section>`);
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');

  const v = verifyToken(req.query.t);
  if (!v) return res.status(404).send(noKit('Link not found', 'This media kit link isn’t valid. It may have been copied incompletely.'));
  if (v.expired) return res.status(410).send(noKit('Link expired', `This link expired on ${fmtDate(v.expires)}. Fill in the form again and a new one will be emailed to you.`));
  return res.status(200).send(fullKit(v.email, v.expires));
};

// The PDF kit (~/Documents/Claude/media-kit) is generated from this same template.
module.exports.fullKit = fullKit;

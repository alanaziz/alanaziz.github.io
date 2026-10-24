// Shared by api/kit-request.js and api/kit.js. Files under api/_lib are
// bundled into the functions that require them but never served or run
// as functions themselves.

const crypto = require('crypto');

const KIT_DAYS = 14;

// Free mailboxes still get the kit; they're only tagged in Alan's copy
// so he can check who's behind them before replying.
const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.com.my', 'ymail.com',
  'hotmail.com', 'hotmail.my', 'outlook.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com', 'aol.com', 'proton.me', 'protonmail.com',
  'gmx.com', 'mail.com', 'yandex.com', 'zoho.com',
]);

function secret() {
  const s = process.env.KIT_SECRET;
  if (!s || s.length < 32) throw new Error('KIT_SECRET is missing or shorter than 32 characters');
  return s;
}

const b64url = (buf) => Buffer.from(buf).toString('base64url');

function hmac(data) {
  return crypto.createHmac('sha256', secret()).update(data).digest('base64url');
}

// token = base64url({e: email, x: expiry ms}) + "." + HMAC of that part
function signToken(email, now = Date.now()) {
  const body = b64url(JSON.stringify({ e: email, x: now + KIT_DAYS * 864e5 }));
  return `${body}.${hmac(body)}`;
}

// Returns {email, expires} for a good token, null for anything else.
function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const want = Buffer.from(hmac(body));
  const got = Buffer.from(sig || '');
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
  if (!data || typeof data.e !== 'string' || typeof data.x !== 'number') return null;
  if (Date.now() > data.x) return { email: data.e, expires: data.x, expired: true };
  return { email: data.e, expires: data.x, expired: false };
}

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

function fmtDate(ms) {
  return new Date(ms).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur',
  });
}

// Resend's REST API directly: one call, no SDK, keeps the repo build-free.
async function sendEmail(msg) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: process.env.KIT_FROM || 'Alan Aziz <kit@alanaziz.com>', ...msg }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = { KIT_DAYS, FREE_DOMAINS, signToken, verifyToken, esc, fmtDate, sendEmail };

// POST /api/kit-request — the "Let's work together" form on the homepage.
// Forwards the message to Alan, then emails the sender a "got it" reply
// carrying a signed link to the full kit (rate card included). Only the
// owner of the inbox can open that link, which is the whole verification.

const { FREE_DOMAINS, KIT_DAYS, signToken, esc, fmtDate, sendEmail } = require('./_lib/shared');

const TOPICS = { partnership: 'Partnership', inquiry: 'Inquiry' };
const EMAIL_RE = /^[^\s@<>"]+@[^\s@<>"]+\.[a-z]{2,}$/i;
const MIN_FILL_MS = 3000; // faster than this is a bot, not a person typing

function clean(v, max) {
  return typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }

  const b = req.body || {};

  // Bots: the honeypot is a field people never see; the timer is when the
  // page loaded. Either one tripping gets a fake success, so a bot learns nothing.
  if (b.website || !Number(b.t) || Date.now() - Number(b.t) < MIN_FILL_MS) {
    return res.status(200).json({ ok: true });
  }

  const topic = TOPICS[b.topic] ? b.topic : 'partnership';
  const name = clean(b.name, 80);
  const email = clean(b.email, 200).toLowerCase();
  const subject = clean(b.subject, 150);
  // the homepage form says so; anything else came from the media kit
  const page = b.source === 'home' ? 'alanaziz.com' : 'alanaziz.com/media-kit';
  const message = typeof b.message === 'string' ? b.message.trim().slice(0, 4000) : '';

  if (!name) return res.status(400).json({ error: 'Add your name.', field: 'name' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'That email address doesn’t look right.', field: 'email' });
  if (message.length < 10) return res.status(400).json({ error: 'Tell me a little about your brand and what you’re looking to do.', field: 'message' });

  const domain = email.split('@')[1];
  const free = FREE_DOMAINS.has(domain);
  // previews link back to their own deployment, so a test runs end to end
  const origin = process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_URL
    ? 'https://alanaziz.com'
    : `https://${process.env.VERCEL_URL}`;
  const link = `${origin}/media-kit/full/?t=${signToken(email)}`;
  const expires = fmtDate(Date.now() + KIT_DAYS * 864e5);
  const notify = process.env.KIT_NOTIFY || 'inquiry@alanaziz.com';

  try {
    // Alan's copy first: if only one email gets out, it should be this one.
    await sendEmail({
      to: notify,
      reply_to: email,
      subject: `[${TOPICS[topic]}]${free ? ' [free email]' : ''} ${name}${subject ? ` — ${subject}` : ''}`,
      text: [
        `${TOPICS[topic]} enquiry from ${page}`,
        '',
        `Name:    ${name}`,
        `Email:   ${email}${free ? '  (free mailbox — check who this is)' : `  (company domain: ${domain})`}`,
        `Subject: ${subject || '—'}`,
        '',
        message,
        '',
        `They were sent the full media kit; the link expires ${expires}.`,
        'Hit reply to answer them directly.',
      ].join('\n'),
    });

    // Their reply never echoes the message back, so the form can't be
    // used to send arbitrary text to someone else's inbox.
    await sendEmail({
      to: email,
      reply_to: notify,
      subject: 'Creator’s Media Kit - @alanazizreview',
      html: `<div style="font-family:Menlo,Consolas,monospace;font-size:14px;line-height:1.7;color:#222">
<p>Hi ${esc(name)},</p>
<p>Thanks for reaching out. Here’s my media kit:</p>
<p><a href="${link}" style="color:#000;font-weight:bold">Open the full media kit →</a></p>
<p style="color:#666;font-size:12px">This link is for you and works until ${expires}.</p>
<p>Alan Aziz<br>alanaziz.com · @alanazizreview</p>
</div>`,
      text: `Hi ${name},\n\nThanks for reaching out. Here's my media kit:\n${link}\n\nThis link is for you and works until ${expires}.\n\nAlan Aziz\nalanaziz.com · @alanazizreview`,
    });
  } catch (err) {
    console.error('kit-request failed', err);
    return res.status(502).json({ error: 'Your message didn’t go through. Please email inquiry@alanaziz.com instead.' });
  }

  return res.status(200).json({ ok: true });
};

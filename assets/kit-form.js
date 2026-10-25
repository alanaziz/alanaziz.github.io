// Media-kit form: posts to /api/kit-request without leaving the page.
// Without JS the form still posts, but t stays empty, so the function
// takes it for a bot and drops it.
(function () {
  var form = document.getElementById('kit-form');
  if (!form) return;

  var status = document.getElementById('kf-status');
  var send = form.querySelector('.kf-send');
  // when the form opened; t sends the time since, measured on this device's
  // clock alone, and the function treats a sub-3s fill as a bot
  var started = Date.now();

  function say(text, kind) {
    status.textContent = text;
    status.dataset.kind = kind || '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });

    // the browser's own checks first, with my wording instead of its popups
    var bad = ['name', 'email', 'message'].filter(function (n) { return !form.elements[n].checkValidity(); })[0];
    if (bad) {
      form.elements[bad].setAttribute('aria-invalid', 'true');
      form.elements[bad].focus();
      return say(bad === 'email' ? 'Add a valid work email.' : bad === 'name' ? 'Add your name.' : 'Tell me a little about your brand and what you’re looking to do.', 'error');
    }

    form.elements.t.value = String(Date.now() - started);
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    send.disabled = true;
    say('Sending…');
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      // a crashed or timed-out function answers with an HTML/text page, not JSON
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (r) {
        if (!r.ok) {
          if (r.body.field && form.elements[r.body.field]) {
            form.elements[r.body.field].setAttribute('aria-invalid', 'true');
            form.elements[r.body.field].focus();
          }
          // the firewall's 429 sends error as an object, not a sentence
          throw new Error(typeof r.body.error === 'string' ? r.body.error : 'Your message didn’t go through. Please email inquiry@alanaziz.com instead.');
        }
        form.reset();
        started = Date.now();
        say('Got it! My full media kit is on its way to your inbox. No fluff and talk soon, ya.', 'ok');
      })
      .catch(function (err) {
        say(err.message && err.message !== 'Failed to fetch' ? err.message : 'Couldn’t reach the server. Please email inquiry@alanaziz.com instead.', 'error');
      })
      .then(function () { send.disabled = false; });
  });
})();

// Media-kit form: posts to /api/kit-request without leaving the page.
// Without JS the form still posts (the function answers with JSON), so
// nothing is lost — it just isn't pretty.
(function () {
  var form = document.getElementById('kit-form');
  if (!form) return;

  var status = document.getElementById('kf-status');
  var send = form.querySelector('.kf-send');
  // when the page loaded; the function treats a sub-3s fill as a bot
  form.elements.t.value = String(Date.now());

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

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    send.disabled = true;
    say('Sending…');
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (r) { return r.json().then(function (body) { return { ok: r.ok, body: body }; }); })
      .then(function (r) {
        if (!r.ok) {
          if (r.body.field && form.elements[r.body.field]) {
            form.elements[r.body.field].setAttribute('aria-invalid', 'true');
            form.elements[r.body.field].focus();
          }
          throw new Error(r.body.error || 'Your message didn’t go through.');
        }
        form.reset();
        form.elements.t.value = String(Date.now());
        say('Sent. Check your inbox for my full media kit — it can take a minute to arrive.', 'ok');
      })
      .catch(function (err) {
        say(err.message && err.message !== 'Failed to fetch' ? err.message : 'Couldn’t reach the server. Please email inquiry@alanaziz.com instead.', 'error');
      })
      .then(function () { send.disabled = false; });
  });
})();

/* UI click sound — plays on any real button or card: the .btn
   component, the highlight-reel controls, the gear page's grid/list
   toggle, the gear product cards, and the brand-logo chips. Plain
   nav and text links are left alone. A fresh Audio() per click
   rather than cloneNode() — cloned <audio> elements don't reliably
   inherit load state in every browser, and can fail to play silently.

   A same-tab link (MY GEAR) unloads the page almost instantly on
   click, which kills the freshly-created Audio before it's audible —
   so those get a short delay before navigating, just long enough for
   the click to be heard. External links (target=_blank) and mailto:
   don't unload the current tab, so they're left to navigate at once. */
(function () {
  var SELECTOR = '.btn, .term-submit, .hl-bar, .hl-zone, [data-view], .gear-item, .collab-logo';
  var src = '/assets/sfx/click.mp3';
  var NAV_DELAY = 150;

  document.addEventListener('click', function (e) {
    var el = e.target.closest(SELECTOR);
    if (!el) return;

    var sfx = new Audio(src);
    sfx.volume = 0.45;
    var p = sfx.play();
    if (p && p.catch) p.catch(function () {});

    var samePageNav = el.tagName === 'A' && el.target !== '_blank' &&
      el.origin === location.origin;
    if (samePageNav) {
      e.preventDefault();
      setTimeout(function () { window.location.href = el.href; }, NAV_DELAY);
    }
  });
})();

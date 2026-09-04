/* UI click sound — plays on any real button: the .btn component,
   the highlight-reel controls, and the gear page's grid/list toggle.
   Plain nav and text links are left alone; only cloned per click so
   a fast double-click doesn't cut the sound off mid-play. */
(function () {
  var SELECTOR = '.btn, .hl-bar, .hl-zone, [data-view]';
  var src = '/assets/sfx/click.mp3';
  var base;

  document.addEventListener('click', function (e) {
    if (!e.target.closest(SELECTOR)) return;
    if (!base) base = new Audio(src);
    var sfx = base.cloneNode();
    sfx.volume = 0.45;
    sfx.play().catch(function () {});
  });
})();

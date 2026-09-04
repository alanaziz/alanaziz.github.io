/* UI click sound — plays on any real button: the .btn component,
   the highlight-reel controls, and the gear page's grid/list toggle.
   Plain nav and text links are left alone. A fresh Audio() per click
   rather than cloneNode() — cloned <audio> elements don't reliably
   inherit load state in every browser, and can fail to play silently. */
(function () {
  var SELECTOR = '.btn, .hl-bar, .hl-zone, [data-view]';
  var src = '/assets/sfx/click.mp3';

  document.addEventListener('click', function (e) {
    if (!e.target.closest(SELECTOR)) return;
    var sfx = new Audio(src);
    sfx.volume = 0.45;
    var p = sfx.play();
    if (p && p.catch) p.catch(function () {});
  });
})();

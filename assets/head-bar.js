/* Frozen header — keeps --head-h in step with the sticky bar's real height
   (one row on desktop, two or three when the nav wraps on smaller screens),
   so in-page jumps via scroll-padding-top land below the bar, not behind it. */
(function () {
  var bar = document.querySelector('.head-bar');
  if (!bar) return;
  var root = document.documentElement;

  function sync() {
    root.style.setProperty('--head-h', bar.offsetHeight + 'px');
  }

  sync();
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(bar);
  else window.addEventListener('resize', sync);
})();

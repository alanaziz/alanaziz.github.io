/* Frozen header — keeps --head-h in step with the sticky bar's real height
   (one row on desktop, two or three when the nav wraps on smaller screens),
   so in-page jumps via scroll-padding-top land below the bar, not behind it. */
(function () {
  var bar = document.querySelector('.head-bar');
  if (!bar) return;
  var root = document.documentElement;

  // 0 while the bar scrolls with the page (phones), so the pinned sections
  // and scroll-padding don't leave room for a header that isn't there
  function sync() {
    var pinned = getComputedStyle(bar).position === 'sticky';
    root.style.setProperty('--head-h', (pinned ? bar.offsetHeight : 0) + 'px');
  }

  sync();
  // the bar's size doesn't always change when it stops being sticky
  window.addEventListener('resize', sync);

  // iOS Safari only applies :active on tap when a touch listener exists,
  // which the white pressed state on buttons depends on
  document.addEventListener('touchstart', function () {}, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(sync).observe(bar);
  else window.addEventListener('resize', sync);
})();

/* Media kit photo stack — every few seconds the top card flicks off to
   the left, the fan shuffles forward, and the card rejoins at the back,
   so the eleven photos loop forever. A click (or tap) flicks the next one
   early and restarts the timer. Reduced motion leaves a still fan. */
(function () {
  var stack = document.querySelector('.kit-stack');
  if (!stack) return;

  var cards = [].slice.call(stack.querySelectorAll('.kit-card'));
  var order = cards.map(function (_, i) { return i; });   // order[0] is on top
  var calm  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EVERY = 2800, FLICK = 750;
  var busy = false, timer = 0;

  function paint() {
    order.forEach(function (c, p) { cards[c].dataset.pos = p < 3 ? p : 'back'; });
  }

  function next() {
    if (busy) return;
    busy = true;
    var top = order.shift();
    cards[top].dataset.pos = 'out';
    paint();
    setTimeout(function () {
      order.push(top);
      cards[top].dataset.pos = 'back';
      busy = false;
    }, FLICK);
  }

  paint();
  if (calm || cards.length < 2) return;

  timer = setInterval(next, EVERY);
  stack.addEventListener('click', function () {
    clearInterval(timer);
    next();
    timer = setInterval(next, EVERY);
  });
})();

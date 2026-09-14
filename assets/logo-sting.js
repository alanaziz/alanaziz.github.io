/* Logo sting — the spinning mark in the header (and the homepage hero)
   plays once on load and stops on its last frame, which is the resting
   logo. Safari takes the HEVC-with-alpha .mov; Chrome and Firefox don't
   claim video/quicktime, so they fall through to the VP9-alpha .webm.
   Reduced motion, a refused autoplay (iOS Low Power Mode) or a failed
   load all swap in the still frame, so the logo is never left blank. */
(function () {
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  [].forEach.call(document.querySelectorAll('.logo-sting'), function (box) {
    var v = box.querySelector('video');
    var still = box.querySelector('img');

    function rest() {
      v.pause();
      v.hidden = true;
      still.hidden = false;
    }

    if (calm) return rest();
    v.querySelector('source:last-of-type').addEventListener('error', rest);
    var p = v.play();
    if (p) p.catch(rest);
  });
})();

/* "Selected Work" tiles (media kit and homepage) — each tile is a review
   video. Without JS it's a plain <video controls>.

   Media kit: the native controls hide behind a play disc and label until the
   first tap. Homepage (.kit-work[data-autoplay]): every tile plays muted on a
   loop while it's on screen, and a tap turns that one's sound on (and every
   other tile's off). Either way, only one video ever talks at a time. */
(function () {
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clips = [].slice.call(document.querySelectorAll('.kit-work-clip'));
  var videos = [];

  var SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="';
  var SPEAKER = '<path d="M11 5 6 9H3v6h3l5 4z"/>';
  var ICONS =
    SVG + 'off">' + SPEAKER + '<path d="m22 9-6 6m0-6 6 6"/></svg>' +
    SVG + 'on">' + SPEAKER + '<path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>';

  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  clips.forEach(function (clip) {
    var video = clip.querySelector('video');
    var btn   = clip.querySelector('.kit-work-play');
    if (!video || !btn) return;
    videos.push(video);

    video.controls = false;
    btn.hidden = false;

    // calm visitors get the media kit behaviour: nothing moves until tapped
    if (clip.closest('[data-autoplay]') && !calm) {
      clip.classList.add('is-auto');
      var chip = document.createElement('span');
      chip.className = 'kit-sound';
      chip.innerHTML = ICONS;
      btn.appendChild(chip);
      btn.setAttribute('aria-pressed', 'false');

      btn.addEventListener('click', function () {
        var on = video.muted;
        clips.forEach(function (c) {
          var v = c.querySelector('video');
          if (v && v !== video) { v.muted = true; c.classList.remove('is-unmuted'); }
        });
        video.muted = !on;
        clip.classList.toggle('is-unmuted', on);
        btn.setAttribute('aria-pressed', String(on));
        if (on) { video.currentTime = 0; play(video); } // sound starts from the top
      });

      // only the tiles on screen play, so six videos don't all load at once
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) { video.preload = 'auto'; play(video); }
          else video.pause();
        }, { threshold: .25 }).observe(clip);
      } else play(video);
      return;
    }

    btn.addEventListener('click', function () {
      clip.classList.add('is-playing');
      video.controls = true;
      video.muted = false;
      play(video);
    });

    video.addEventListener('play', function () {
      videos.forEach(function (v) { if (v !== video) v.pause(); });
    });
  });
})();

/* Motion — the site's one choreography file, loaded on every page.
   Homepage: boot intro → hero entrance, the viewfinder overlay on the
   highlight reel, the pinned showreel, the pinned gear wall, the
   velocity-reactive brand marquee and the kinetic sign-off.
   Every page: headings wipe in, cards and panels rise in as they enter.

   The inline gate in each page's <head> adds html.motion only when reduced
   motion is off; the CSS hides reveal targets only under that class. This
   file marks html.motion-live so the gate knows it arrived. Scroll-driven
   pieces share one rAF-throttled scroll handler. */
(function () {
  var d = document.documentElement;
  var calm = !d.classList.contains('motion');
  var fine = matchMedia('(pointer: fine)').matches;
  d.classList.add('motion-live');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function easeIO(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  // camera timecode at 25 fps — HH:MM:SS:FF
  function tc(sec) {
    return '00:' + pad(Math.floor(sec / 60) % 60) + ':' + pad(Math.floor(sec) % 60) + ':' + pad(Math.floor(sec * 25) % 25);
  }
  function play(v) { var p = v.play(); if (p) p.catch(function () {}); }

  /* ---------- shared scroll loop ---------- */

  var scrollers = [];
  var headH = 0;
  var ticking = false;
  function measureHead() { headH = parseFloat(getComputedStyle(d).getPropertyValue('--head-h')) || 0; }
  function frame() {
    ticking = false;
    for (var i = 0; i < scrollers.length; i++) scrollers[i]();
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', function () { measureHead(); onScroll(); });
  measureHead();

  // 0 when a pinned section's top reaches the bottom of the header,
  // 1 when its bottom reaches the bottom of the viewport
  function pinProgress(el) {
    var r = el.getBoundingClientRect();
    var span = r.height - (innerHeight - headH);
    return span > 0 ? clamp((headH - r.top) / span, 0, 1) : 0;
  }

  /* ---------- reveals (every page) ---------- */

  // cards and panels on the inner pages rise in, staggered along each row
  $$('.gear-item, .kit-pillar, .stat-card, .kit-work-clip, .page-head, .collab-marquee, .cta .collab-ctas').forEach(function (el) {
    if (el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', 'up');
    el.style.setProperty('--i', [].indexOf.call(el.parentNode.children, el) % 8);
  });
  $$('[data-reveal="wipe"]').forEach(function (h) {
    h.innerHTML = '<span class="wipe-in">' + h.innerHTML + '</span>';
  });

  function reveal(el) {
    el.classList.add('is-in');
    // hand transitions back to the element's own CSS (the gear cards' hover
    // lift has its own timing) once the entrance has played
    if (el.getAttribute('data-reveal') === 'up') {
      setTimeout(function () {
        el.removeAttribute('data-reveal');
        el.style.removeProperty('--i');
      }, 1500);
    }
  }
  var revealIO = !calm && 'IntersectionObserver' in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { reveal(e.target); revealIO.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;
  $$('[data-reveal]').forEach(function (el) { revealIO ? revealIO.observe(el) : reveal(el); });

  /* ---------- hero ---------- */

  var hero = $('[data-hero]');
  var hl = $('#highlight');

  if (hero) {
    // split the name into word masks and letters; the heading keeps its text for AT
    var h1 = $('h1', hero);
    var n = 0;
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.innerHTML = h1.textContent.trim().split(' ').map(function (w) {
      return '<span class="w" aria-hidden="true">' + w.split('').map(function (c) {
        return '<span class="ch" style="--i:' + (n++) + '">' + c + '</span>';
      }).join('') + '</span>';
    }).join(' ');

    // the reel leans a few degrees toward the cursor
    if (fine && hl && !calm) {
      hero.addEventListener('pointermove', function (e) {
        var r = hl.getBoundingClientRect();
        var x = clamp((e.clientX - r.left) / r.width - .5, -.6, .6);
        var y = clamp((e.clientY - r.top) / r.height - .5, -.6, .6);
        hl.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
        hl.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
      });
      hero.addEventListener('pointerleave', function () {
        hl.style.setProperty('--ry', '0deg');
        hl.style.setProperty('--rx', '0deg');
      });
    }
  }

  function startHero() {
    if (!hero) return;
    // two frames so the hidden state is painted before the transition starts
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-in'); });
    });
  }

  /* ---------- boot intro ---------- */

  function runBoot(done) {
    var boot = $('.boot');
    if (!boot || !d.classList.contains('boot-on')) return done();
    try { sessionStorage.setItem('boot-seen', '1'); } catch (e) {}

    var tcEl = $('.boot-tc', boot);
    var v = $('video', boot);
    var t0 = performance.now();
    var raf = 0;
    var over = false;

    if (v) { v.currentTime = 0; play(v); }
    (function tick(now) {
      tcEl.textContent = tc(Math.max(0, now - t0) / 1000);
      raf = requestAnimationFrame(tick);
    })(t0);

    function end() {
      if (over) return;
      over = true;
      boot.classList.add('is-out');
      done();
      setTimeout(function () {
        cancelAnimationFrame(raf);
        if (v) v.pause();
        boot.remove();
        d.classList.remove('boot-on');
        measureHead();
        onScroll();
      }, 720);
    }
    setTimeout(end, 2300);
    boot.addEventListener('click', end);
    addEventListener('keydown', end, { once: true });
  }

  /* ---------- viewfinder overlay ---------- */

  var vf = $('.vf');
  if (vf && hl) {
    var vtc = $('.vf-tc', vf);
    var vlabel = $('.vf-label', vf);
    var focus = $('.vf-focus', vf);
    var histo = $('.vf-histo', vf);
    var hctx = histo.getContext('2d');
    var sample = document.createElement('canvas');
    sample.width = 48; sample.height = 27;
    var sctx = sample.getContext('2d', { willReadFrequently: true });
    var BINS = 40;
    var lastClip = null;
    var typer = 0;
    // the histogram reads video pixels back to the CPU, which is cheap on most
    // machines and very slow on a few: it starts once the page has settled,
    // samples ~6×/s, and switches itself off for good on a device where one
    // sample takes longer than 24ms
    var histoOn = false;
    var histoAt = 0;
    var inView = true;
    var looping = false;

    var retype = function (text) {
      clearInterval(typer);
      var k = 0;
      vlabel.textContent = '';
      typer = setInterval(function () {
        vlabel.textContent = text.slice(0, ++k);
        if (k >= text.length) clearInterval(typer);
      }, 45);
    };
    var relock = function () {
      var w = hl.clientWidth, h = hl.clientHeight;
      focus.style.setProperty('--fx', ((Math.random() - .5) * w * .3).toFixed(0) + 'px');
      focus.style.setProperty('--fy', ((Math.random() - .5) * h * .25).toFixed(0) + 'px');
      focus.classList.remove('is-hunting');
      void focus.offsetWidth; // restart the animation
      focus.classList.add('is-hunting');
    };
    // luma histogram off a 48×27 downsample of the playing frame
    var histogram = function (v) {
      var t0 = performance.now();
      try {
        sctx.drawImage(v, 0, 0, 48, 27);
        var px = sctx.getImageData(0, 0, 48, 27).data;
        var bins = [];
        for (var b = 0; b < BINS; b++) bins[b] = 0;
        for (var i = 0; i < px.length; i += 4) {
          var l = (.2126 * px[i] + .7152 * px[i + 1] + .0722 * px[i + 2]) / 256;
          bins[Math.floor(l * BINS)]++;
        }
        var max = Math.max.apply(null, bins) || 1;
        var W = histo.width, H = histo.height, bw = W / BINS;
        hctx.clearRect(0, 0, W, H);
        hctx.fillStyle = 'rgba(255,255,255,.85)';
        for (b = 0; b < BINS; b++) {
          var bh = bins[b] / max * (H - 6);
          hctx.fillRect(b * bw, H - 3 - bh, bw - 1, bh);
        }
      } catch (e) { histoOn = false; }
      if (performance.now() - t0 > 24) histoOn = false;
    };
    var draw = function () {
      var v = $('.hl-video.is-active', hl);
      if (v) {
        vtc.textContent = tc(v.currentTime || 0);
        if (v !== lastClip) { lastClip = v; retype(v.getAttribute('data-label') || ''); if (!calm) relock(); }
        var now = performance.now();
        if (histoOn && now - histoAt > 160 && v.readyState >= 2) { histoAt = now; histogram(v); }
      }
      if (inView) requestAnimationFrame(draw); else looping = false;
    };
    var startVF = function () { if (!looping) { looping = true; requestAnimationFrame(draw); } };

    if (!calm) {
      var armHisto = function () { setTimeout(function () { histoOn = true; }, 2500); };
      if (document.readyState === 'complete') armHisto(); else addEventListener('load', armHisto);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting;
        if (inView) startVF();
      }).observe(hl);
    } else startVF();
  }

  /* ---------- showreel ---------- */

  var reel = $('[data-reel]');
  if (reel) {
    var rv = $('video', reel);
    var soundBtn = $('.reel-sound', reel);
    if (calm) {
      // no autoplay for calm visitors: it's there, with controls (and their
      // own volume), when they want it
      rv.controls = true;
      rv.preload = 'metadata';
      if (soundBtn) soundBtn.hidden = true;
    } else {
      if (soundBtn) {
        var soundLabel = $('.reel-sound-label', soundBtn);
        soundBtn.addEventListener('click', function () {
          rv.muted = !rv.muted;
          if (!rv.muted) { rv.currentTime = 0; play(rv); } // start the score from its first beat
          soundBtn.setAttribute('aria-pressed', String(!rv.muted));
          soundLabel.textContent = rv.muted ? 'SOUND OFF' : 'SOUND ON';
        });
      }
      // the frame reaches full-bleed 55% of the way through the pin, then holds
      scrollers.push(function () {
        reel.style.setProperty('--p', easeIO(clamp(pinProgress(reel) / .55, 0, 1)).toFixed(4));
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) { rv.preload = 'auto'; play(rv); } else rv.pause();
        }, { threshold: .2 }).observe(rv);
      }
    }
  }

  /* ---------- gear wall ---------- */

  var wall = $('[data-wall]');
  if (wall && !calm) {
    var track = $('.wall-track', wall);
    var cards = $$('.wall-card', wall);
    var bar = $('.wall-progress i', wall);
    var dist = 0;
    var centres = [];

    wall.classList.add('is-pinned');
    var measureWall = function () {
      dist = Math.max(0, track.scrollWidth - innerWidth);
      // a pixel scrolled moves the track ~1.5px, so 22 cards don't take forever
      wall.style.height = (dist * .65 + innerHeight) + 'px';
      centres = cards.map(function (c) { return c.offsetLeft + c.offsetWidth / 2; });
    };
    scrollers.push(function () {
      var p = pinProgress(wall);
      var x = p * dist;
      track.style.transform = 'translate3d(' + (-x).toFixed(1) + 'px,0,0)';
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      for (var i = 0; i < cards.length; i++) {
        var off = (centres[i] - x - innerWidth / 2) / innerWidth;
        if (off > -1.2 && off < 1.2) cards[i].style.setProperty('--px', (off * -26).toFixed(1) + 'px');
      }
    });
    measureWall();
    addEventListener('resize', measureWall);
    addEventListener('load', function () { measureWall(); onScroll(); });
  }

  /* ---------- brand marquee: speeds up and skews with scroll velocity ---------- */

  var mq = $('.collab-marquee');
  var mqTrack = mq && mq.firstElementChild;
  if (mqTrack && !calm && mqTrack.getAnimations) {
    var lastY = scrollY;
    var vel = 0;
    var mqOn = false;
    var mqLoop = function () {
      var y = scrollY;
      vel += ((y - lastY) - vel) * .12;
      lastY = y;
      var anim = mqTrack.getAnimations()[0];
      if (anim) anim.playbackRate = 1 + Math.min(Math.abs(vel) / 5, 6);
      mq.style.setProperty('--skew', clamp(-vel * .3, -12, 12).toFixed(2) + 'deg');
      if (mqOn) requestAnimationFrame(mqLoop);
    };
    new IntersectionObserver(function (es) {
      var was = mqOn;
      mqOn = es[0].isIntersecting;
      if (mqOn && !was) { lastY = scrollY; requestAnimationFrame(mqLoop); }
    }).observe(mq);
  }

  /* ---------- kinetic sign-off ---------- */

  var cta = $('[data-cta]');
  if (cta && !calm) {
    scrollers.push(function () {
      var r = cta.getBoundingClientRect();
      cta.style.setProperty('--f', clamp((innerHeight - r.top) / (innerHeight * .75), 0, 1).toFixed(3));
    });
  }

  /* ---------- go ---------- */

  if (calm) { if (hero) hero.classList.add('is-in'); }
  else runBoot(startHero);
  onScroll();
})();

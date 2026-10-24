/* Media kit "Selected Work" — each tile is a review video. Without JS it's a
   plain <video controls>. With JS the native controls hide behind a play
   disc and label until the first tap, and starting one video pauses the
   others so two never talk over each other. */
(function () {
  var clips = [].slice.call(document.querySelectorAll('.kit-work-clip'));
  var videos = [];

  clips.forEach(function (clip) {
    var video = clip.querySelector('video');
    var play  = clip.querySelector('.kit-work-play');
    if (!video || !play) return;
    videos.push(video);

    video.controls = false;
    play.hidden = false;

    play.addEventListener('click', function () {
      clip.classList.add('is-playing');
      video.controls = true;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });

    video.addEventListener('play', function () {
      videos.forEach(function (v) { if (v !== video) v.pause(); });
    });
  });
})();

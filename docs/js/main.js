/* ==========================================================
   main.js —— 首页轮播图交互
   功能：自动播放、左右切换、指示点、悬停暂停、键盘方向键
   ========================================================== */
(function () {
  'use strict';

  var banner = document.querySelector('.banner');
  if (!banner) return; // 非首页没有轮播，直接退出

  var slides = banner.querySelectorAll('.slide');
  var dots = banner.querySelectorAll('.banner-dots button');
  var prevBtn = banner.querySelector('.banner-prev');
  var nextBtn = banner.querySelector('.banner-next');
  if (slides.length < 2) return;

  var current = 0;
  var timer = null;
  var INTERVAL = 5000; // 自动切换间隔（毫秒）

  /* 切换到指定索引的幻灯片，并同步指示点状态 */
  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function play() {
    stop();
    timer = window.setInterval(next, INTERVAL);
  }

  function stop() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  /* 用户手动操作后重新计时，避免刚点完就被自动切走 */
  function reset() {
    stop();
    play();
  }

  // 绑定左右箭头
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); reset(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { next(); reset(); });

  // 绑定指示点
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); reset(); });
  });

  // 鼠标悬停暂停，移出恢复
  banner.addEventListener('mouseenter', stop);
  banner.addEventListener('mouseleave', play);

  // 键盘左右方向键切换
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prev(); reset(); }
    if (e.key === 'ArrowRight') { next(); reset(); }
  });

  // 页面切到后台时暂停，回来再继续，节省资源
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { play(); }
  });

  // 初始化
  goTo(0);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    play();
  }
})();


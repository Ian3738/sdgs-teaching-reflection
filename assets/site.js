/* 全站共用行為：行動版選單、進場、圖庫燈箱 */
(function () {
  document.documentElement.className += ' js';

  document.addEventListener('DOMContentLoaded', function () {
    // 行動版選單
    var b = document.querySelector('.burger'), n = document.querySelector('.nav');
    if (b && n) b.addEventListener('click', function () { n.classList.toggle('open'); });

    // 進場
    var els = document.querySelectorAll('.rv');
    if ('IntersectionObserver' in window && els.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e, i) {
          if (!e.isIntersecting) return;
          setTimeout(function () { e.target.classList.add('in'); }, i * 60);
          io.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
      els.forEach(function (el) { io.observe(el); });
      // 保險：2 秒後一律顯示
      setTimeout(function () {
        document.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
      }, 2000);
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }

    buildGallery();
  });

  function buildGallery() {
    var g = document.getElementById('gal');
    if (!g || !window.MEDIA) return;
    var SIZES = ['w', '', '', 't', '', 'w', '', '', '', 't', '', ''];
    var items = [];
    (MEDIA.photos || []).forEach(function (p) {
      items.push({ type: 'img', src: 'assets/photos/' + p.file, cap: p.cap });
    });
    (MEDIA.videos || []).forEach(function (v) {
      items.push({ type: 'video', src: 'assets/video/' + v.file, poster: 'assets/video/' + v.poster, cap: v.cap });
    });
    items.forEach(function (it, i) {
      var d = document.createElement('div');
      d.className = 'g ' + SIZES[i % SIZES.length];
      var im = document.createElement('img');
      im.src = it.type === 'video' ? it.poster : it.src;
      im.alt = it.cap || ''; im.loading = 'lazy';
      d.appendChild(im);
      if (it.type === 'video') {
        var s = document.createElement('span'); s.className = 'pl'; s.textContent = '影片'; d.appendChild(s);
      }
      d.addEventListener('click', function () { open(i); });
      g.appendChild(d);
    });

    var lb = document.getElementById('lb'), body = document.getElementById('lbBody'), cap = document.getElementById('lbCap');
    function open(i) {
      var it = items[i]; body.innerHTML = '';
      if (it.type === 'video') {
        var v = document.createElement('video');
        v.src = it.src; v.controls = true; v.autoplay = true; v.playsInline = true;
        body.appendChild(v);
      } else {
        var im = document.createElement('img'); im.src = it.src; im.alt = it.cap || ''; body.appendChild(im);
      }
      cap.textContent = it.cap || ''; lb.classList.add('on');
    }
    function close() { lb.classList.remove('on'); body.innerHTML = ''; }
    document.getElementById('lbx').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }
})();

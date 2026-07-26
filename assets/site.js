/* 全站共用行為：行動版選單、進場、燈箱（圖庫與圖表共用） */
(function () {
  document.documentElement.className += ' js';

  var lb, lbBody, lbCap, items = [];

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initReveal();
    initLightbox();
    buildGallery();
    initPlates();
  });

  /* ---------- 行動版選單 ---------- */
  function initNav() {
    var b = document.querySelector('.burger'), n = document.querySelector('.nav');
    if (!b || !n) return;
    b.addEventListener('click', function () {
      n.classList.toggle('open');
      b.setAttribute('aria-expanded', n.classList.contains('open') ? 'true' : 'false');
    });
    // 點選項目後關閉，避免換頁前選單仍蓋著內容
    n.addEventListener('click', function (e) {
      if (e.target.closest('a')) n.classList.remove('open');
    });
    // 轉回桌機寬度時重置，避免殘留展開狀態
    var mq = window.matchMedia('(min-width:901px)');
    (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function () {
      n.classList.remove('open');
    });
    addEventListener('keydown', function (e) {
      if (e.key === 'Escape') n.classList.remove('open');
    });
  }

  /* ---------- 進場 ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        setTimeout(function () { e.target.classList.add('in'); }, i * 60);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      document.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
    }, 2000);
  }

  /* ---------- 燈箱 ---------- */
  function initLightbox() {
    lb = document.getElementById('lb');
    if (!lb) return;
    lbBody = document.getElementById('lbBody');
    lbCap = document.getElementById('lbCap');
    document.getElementById('lbx').addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function open(it) {
    if (!lb) return;
    lbBody.innerHTML = '';
    if (it.type === 'video') {
      var v = document.createElement('video');
      v.src = it.src; v.controls = true; v.autoplay = true; v.playsInline = true;
      lbBody.appendChild(v);
    } else {
      var im = document.createElement('img');
      im.src = it.src; im.alt = it.cap || '';
      lbBody.appendChild(im);
    }
    lbCap.textContent = it.cap || '';
    lb.classList.add('on');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    if (!lb) return;
    lb.classList.remove('on');
    lbBody.innerHTML = '';
    document.body.style.overflow = '';
  }

  /* ---------- 圖庫 ---------- */
  function buildGallery() {
    var g = document.getElementById('gal');
    if (!g || !window.MEDIA) return;
    var SIZES = ['w', '', '', 't', '', 'w', '', '', '', 't', '', ''];
    (MEDIA.photos || []).forEach(function (p) {
      items.push({ type: 'img', src: 'assets/photos/' + p.file, cap: p.cap });
    });
    (MEDIA.videos || []).forEach(function (v) {
      items.push({ type: 'video', src: 'assets/video/' + v.file, poster: 'assets/video/' + v.poster, cap: v.cap });
    });
    items.forEach(function (it, i) {
      var d = document.createElement('div');
      d.className = 'g ' + SIZES[i % SIZES.length];
      d.setAttribute('role', 'button');
      d.setAttribute('tabindex', '0');
      var im = document.createElement('img');
      im.src = it.type === 'video' ? it.poster : it.src;
      im.alt = it.cap || ''; im.loading = 'lazy';
      d.appendChild(im);
      if (it.type === 'video') {
        var s = document.createElement('span'); s.className = 'pl'; s.textContent = '影片'; d.appendChild(s);
      }
      d.addEventListener('click', function () { open(it); });
      d.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); }
      });
      g.appendChild(d);
    });
  }

  /* ---------- 圖表：小螢幕縮到不可讀，點擊開啟原尺寸 ---------- */
  function initPlates() {
    document.querySelectorAll('figure.plate').forEach(function (fig) {
      var im = fig.querySelector('img');
      if (!im) return;
      var cap = fig.querySelector('figcaption');
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      var it = { type: 'img', src: im.getAttribute('src'), cap: cap ? cap.textContent.trim() : '' };
      fig.addEventListener('click', function () { open(it); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(it); }
      });
    });
  }
})();

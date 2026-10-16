(function () {
    var root = document.documentElement;
    try {
      var saved = localStorage.getItem('gvr-theme');
      if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
    } catch (e) {}

    document.getElementById('themeBtn').addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      if (!current) {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('gvr-theme', next); } catch (e) {}
    });

    // Design gallery filters
    (function () {
      var grid = document.getElementById('dgrid');
      if (!grid) return;
      var buttons = document.querySelectorAll('.dfilter');
      buttons.forEach(function (b) {
        b.addEventListener('click', function () {
          var want = b.dataset.filter;
          buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
          grid.querySelectorAll('.dtile').forEach(function (t) {
            t.hidden = !(want === 'all' || t.dataset.cat === want);
          });
        });
      });
    })();


    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightboxImg');
    function closeLightbox() { lb.removeAttribute('data-open'); lbImg.src = ''; }
    document.querySelectorAll('.certcard .cover, .dtile .dshot').forEach(function (cover) {
      cover.addEventListener('click', function () {
        var img = cover.querySelector('img');
        if (!img) return;
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lb.setAttribute('data-open', '1');
      });
    });
    lb.addEventListener('click', closeLightbox);
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });

  })();

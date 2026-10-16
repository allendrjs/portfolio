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

    // Featured artwork: concentric contour field, drawn once.
    [['art', 1], ['art2', 1.7], ['art3', 2.4]].forEach(function (spec) {
    var c = document.getElementById(spec[0]);
    if (c && c.getContext) {
      var ctx = c.getContext('2d');
      var W = c.width, H = c.height;
      ctx.fillStyle = '#0d0d0f';
      ctx.fillRect(0, 0, W, H);
      var cx = W * 0.52, cy = H * 0.5;
      for (var r = 14; r < 340; r += 6) {
        ctx.beginPath();
        for (var a = 0; a <= Math.PI * 2 + 0.05; a += 0.05) {
          var warp = Math.sin(a * 3 * spec[1] + r * 0.02) * (r * 0.11)
                   + Math.sin(a * 5 * spec[1] - r * 0.035) * (r * 0.05);
          var rad = r + warp;
          var x = cx + Math.cos(a) * rad * 1.05;
          var y = cy + Math.sin(a) * rad * 0.82;
          if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(242,242,239,' + (0.30 - r / 1500).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    });
  })();

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

    // Visitor count. Deliberately hidden until a real number exists:
    // set VISITOR_ENDPOINT to a counter API returning {count:<n>} when self-hosting.
    // Left empty here, so the page shows nothing rather than an invented figure.
    var VISITOR_ENDPOINT = '';
    if (VISITOR_ENDPOINT) {
      fetch(VISITOR_ENDPOINT)
        .then(function (r) { return r.json(); })
        .then(function (d) {
          var n = d && (d.count != null ? d.count : d.value);
          if (typeof n !== 'number') return;
          document.getElementById('visitsCount').textContent = n.toLocaleString();
          document.getElementById('visits').hidden = false;
        })
        .catch(function () { /* stay hidden */ });
    }

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

    // Photo carousel: arrows, dots, keyboard, and drag/swipe.
    (function () {
      var root = document.getElementById('carousel');
      if (!root) return;
      var track = document.getElementById('ctrack');
      var slides = track.children;
      var dots = document.getElementById('cdots');
      var i = 0, startX = null, dx = 0;

      for (var n = 0; n < slides.length; n++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', 'Photo ' + (n + 1));
        (function (k) { d.addEventListener('click', function () { go(k); }); })(n);
        dots.appendChild(d);
      }

      function render() {
        track.style.transform = 'translateX(' + (-i * 100) + '%)';
        for (var n = 0; n < dots.children.length; n++) {
          dots.children[n].setAttribute('aria-current', n === i ? 'true' : 'false');
        }
      }
      function go(k) {
        i = Math.max(0, Math.min(slides.length - 1, k));
        render();
      }

      document.getElementById('cprev').addEventListener('click', function () { go(i - 1); });
      document.getElementById('cnext').addEventListener('click', function () { go(i + 1); });
      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { go(i - 1); e.preventDefault(); }
        if (e.key === 'ArrowRight') { go(i + 1); e.preventDefault(); }
      });

      track.addEventListener('pointerdown', function (e) {
        startX = e.clientX; dx = 0;
        track.classList.add('dragging');
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', function (e) {
        if (startX === null) return;
        dx = e.clientX - startX;
        track.style.transform = 'translateX(calc(' + (-i * 100) + '% + ' + dx + 'px))';
      });
      function endDrag() {
        if (startX === null) return;
        track.classList.remove('dragging');
        var threshold = Math.min(90, root.offsetWidth * 0.15);
        if (dx < -threshold) go(i + 1);
        else if (dx > threshold) go(i - 1);
        else render();
        startX = null; dx = 0;
      }
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);

      render();
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

    var notice = document.getElementById('notice');
    document.getElementById('dismiss').addEventListener('click', function () {
      notice.hidden = true;
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
  // Chatbot. Answers strictly from this page's own text, via the artifact's
  // built-in Claude access. Hidden entirely when that is unavailable.
  (function () {
    var launch = document.getElementById('chatLaunch');
    var panel  = document.getElementById('chatPanel');
    if (!launch || !panel) return;

    var log = document.getElementById('chatLog');
    var form = document.getElementById('chatForm');
    var input = document.getElementById('chatInput');
    var send = document.getElementById('chatSend');
    var chips = document.getElementById('chatChips');
    var ask = null, busy = false, history = [];

    panel.hidden = true;

    if (!window.claude || !window.claude.use) { launch.hidden = true; return; }
    claude.use('sample').then(function (s) {
      if (!s) { launch.hidden = true; return; }
      ask = s;
    }).catch(function () { launch.hidden = true; });

    function pageFacts() {
      var ids = ['stack', 'work', 'design', 'experience', 'certificates', 'about'];
      var parts = [document.querySelector('header .wrap').innerText];
      ids.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) parts.push(el.innerText);
      });
      return parts.join('\n\n').replace(/\n{3,}/g, '\n\n').slice(0, 9000);
    }

    function bubble(who, text) {
      var d = document.createElement('div');
      d.className = 'msg ' + who;
      var p = document.createElement('p');
      p.textContent = text;
      d.appendChild(p);
      log.appendChild(d);
      log.scrollTop = log.scrollHeight;
      return p;
    }

    function open(yes) {
      panel.hidden = !yes;
      launch.hidden = yes;
      launch.setAttribute('aria-expanded', yes ? 'true' : 'false');
      if (yes) input.focus();
    }
    launch.addEventListener('click', function () { open(true); });
    document.getElementById('chatClose').addEventListener('click', function () { open(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !panel.hidden) open(false);
    });

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) submit(b.dataset.q);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submit(input.value.trim());
    });

    function submit(text) {
      if (!text || busy || !ask) return;
      busy = true; send.disabled = true; chips.hidden = true;
      input.value = '';
      bubble('me', text);

      var thinking = bubble('bot', 'Thinking…');
      thinking.parentNode.classList.add('thinking');

      var prompt =
        'You answer visitor questions on the portfolio site of Geoffrey Allen De Rojas ' +
        '(he goes by Geo). Use ONLY the page content below. If the page does not cover ' +
        'the question, say so plainly and suggest emailing him — never guess or invent ' +
        'anything about him. Refer to him in the third person; you are not Geo and must ' +
        'not speak as him. Keep answers to two or three sentences, plain text, no markdown.\n\n' +
        '=== PAGE CONTENT ===\n' + pageFacts() + '\n=== END ===\n\n' +
        (history.length ? 'Earlier in this chat:\n' + history.slice(-4).join('\n') + '\n\n' : '') +
        'Visitor question: ' + text;

      ask(prompt, {
        modelTier: 'quick',
        onText: function (e) {
          thinking.parentNode.classList.remove('thinking');
          thinking.textContent = e.text;
          log.scrollTop = log.scrollHeight;
        }
      }).then(function (r) {
        thinking.parentNode.classList.remove('thinking');
        thinking.textContent = r.text;
        history.push('Q: ' + text, 'A: ' + r.text);
        log.scrollTop = log.scrollHeight;
      }).catch(function (err) {
        thinking.parentNode.classList.remove('thinking');
        var code = err && err.code;
        thinking.textContent =
          code === 'rate_limited' ? 'Too many questions at once — give it a minute.' :
          code === 'not_granted'  ? 'Chat is unavailable in this view.' :
          'Something went wrong. You can email Geo instead.';
      }).then(function () {
        busy = false; send.disabled = false; input.focus();
      });
    }
  })();

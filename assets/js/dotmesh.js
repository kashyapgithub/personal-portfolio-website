/* ============================================================
   Hero Dot Mesh — interactive bioluminescent dot sea.
   Dots near the cursor bloom teal-green at the core fading to
   deep blue at the edge, with a traveling ripple ring.
   Vanilla canvas 2D, zero dependencies. Pauses off-screen.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("dotmesh-canvas");
  if (!canvas) return;
  var hero = canvas.closest(".hero") || canvas.parentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0, H = 0, GAP = 26, RADIUS = 170;
  var dots = [];
  var mx = -9999, my = -9999, sx = -9999, sy = -9999;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth || window.innerWidth;
    H = hero.clientHeight || 480;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    for (var y = GAP / 2; y < H; y += GAP) {
      for (var x = GAP / 2; x < W; x += GAP) {
        dots.push({ x: x, y: y, ph: Math.random() * 6.2832 });
      }
    }
  }

  function track(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    mx = clientX - r.left;
    my = clientY - r.top;
  }

  hero.addEventListener("mousemove", function (e) { track(e.clientX, e.clientY); });
  hero.addEventListener("mouseleave", function () { mx = my = -9999; });
  hero.addEventListener("touchmove", function (e) {
    if (e.touches.length) track(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  hero.addEventListener("touchend", function () { mx = my = -9999; });

  /* Core teal-green -> edge deep blue */
  function glowColor(d01) {
    var r, g, b, t;
    if (d01 < 0.5) {
      t = d01 / 0.5;
      r = 0 + (16 - 0) * t;
      g = 212 + (185 - 212) * t;
      b = 200 + (129 - 200) * t;
    } else {
      t = (d01 - 0.5) / 0.5;
      r = 16 + (47 - 16) * t;
      g = 185 + (123 - 185) * t;
      b = 129 + (255 - 129) * t;
    }
    return [r | 0, g | 0, b | 0];
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    sx += (mx - sx) * 0.12;
    sy += (my - sy) * 0.12;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      var dx = d.x - sx, dy = d.y - sy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var base = 0.10 + 0.05 * Math.sin(t * 0.8 + d.ph);
      var a = base, rad = 1.4, cr = 148, cg = 163, cb = 184;
      if (dist < RADIUS) {
        var k = 1 - dist / RADIUS;
        k = k * k;
        var ring = 0.5 + 0.5 * Math.sin(dist * 0.06 - t * 4.0);
        var inten = Math.min(1, k * 1.15) * (0.65 + 0.35 * ring);
        var c = glowColor(1 - k);
        cr = c[0]; cg = c[1]; cb = c[2];
        a = base + (0.95 - base) * inten;
        rad = 1.4 + 2.0 * inten;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, rad, 0, 6.2832);
      ctx.fillStyle = "rgba(" + cr + "," + cg + "," + cb + "," + a.toFixed(3) + ")";
      ctx.fill();
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (reduceMotion) {
    draw(1.0);
    return;
  }

  var running = true, inView = true;

  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView = entry.isIntersecting; });
    }, { threshold: 0 }).observe(hero);
  }

  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
  });

  var start = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!running || !inView || document.hidden) return;
    draw(((now || performance.now()) - start) / 1000);
  })();
})();

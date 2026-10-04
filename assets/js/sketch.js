/* ============================================================
   Hero Sketch — pencil-sketch vignette on canvas (vanilla, zero deps).
   A sketched man walks in, opens a door, warm light spills out,
   and he presents 4 art boards. Loops ~16s. ?sketch=<t> freezes
   a frame (for screenshots). Pauses off-screen / hidden.
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("sketch-canvas");
  if (!canvas) return;
  var hero = canvas.closest(".hero") || canvas.parentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var W = 0, H = 0, S = 1, G = 0;
  var T_LOOP = 16;

  var freezeT = null;
  try {
    var q = new URLSearchParams(window.location.search).get("sketch");
    if (q !== null && q !== "") freezeT = parseFloat(q);
  } catch (err) { /* ignore */ }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth || window.innerWidth;
    H = hero.clientHeight || 480;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Math.max(0.55, Math.min(W, H) / 620);
    G = H * 0.80;
  }

  /* ---------- pencil primitives (jittered double strokes) ---------- */
  function j() { return (Math.random() * 2 - 1); }

  function sline(x1, y1, x2, y2, alpha, w) {
    alpha = alpha === undefined ? 0.85 : alpha;
    w = w === undefined ? 1.6 : w;
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(232,230,224," + (alpha * (p ? 0.45 : 1)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(x1 + j() * 0.9, y1 + j() * 0.9);
      ctx.lineTo(x2 + j() * 0.9, y2 + j() * 0.9);
      ctx.stroke();
    }
  }

  function scircle(x, y, r, alpha) {
    alpha = alpha === undefined ? 0.85 : alpha;
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(232,230,224," + (alpha * (p ? 0.4 : 1)).toFixed(3) + ")";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + j() * 0.8, y + j() * 0.8, r + j() * 0.8, 0, 6.2832);
      ctx.stroke();
    }
  }

  function srect(x, y, w, h, alpha, lw) {
    var o = 3; /* hand overshoot at corners */
    sline(x - o, y, x + w + o, y, alpha, lw);
    sline(x + w, y - o, x + w, y + h + o, alpha, lw);
    sline(x + w + o, y + h, x - o, y + h, alpha, lw);
    sline(x, y + h + o, x, y - o, alpha, lw);
  }

  /* faint dot grid backdrop (keeps the old texture) */
  function dots() {
    ctx.fillStyle = "rgba(148,163,184,0.13)";
    var gap = 26 * S;
    for (var y = gap / 2; y < H; y += gap) {
      for (var x = gap / 2; x < W; x += gap) {
        ctx.beginPath();
        ctx.arc(x, y, 1.3, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  /* ---------- walking man (side view, facing +x) ---------- */
  function limb(x, y, a1, l1, a2, l2, alpha) {
    var kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1;
    var fx = kx + Math.sin(a2) * l2, fy = ky + Math.cos(a2) * l2;
    sline(x, y, kx, ky, alpha, 2.2);
    sline(kx, ky, fx, fy, alpha, 2.0);
    return [fx, fy];
  }

  function drawMan(x, walkPhase, armMode, lean) {
    /* walkPhase: number while walking, null when standing */
    var bob = walkPhase !== null ? Math.abs(Math.sin(walkPhase)) * 3 * S : Math.sin(performance.now() / 900) * 1.2 * S;
    var hipX = x, hipY = G - 62 * S + bob;
    var shX = x + (6 + lean * 6) * S, shY = hipY - 52 * S;
    var L = S;

    /* far limbs (dimmer) */
    var sw = walkPhase !== null ? Math.sin(walkPhase + Math.PI) : 0;
    limb(hipX, hipY, sw * 0.55, 30 * L, sw * 0.3 + Math.max(0, -Math.cos(walkPhase || 0)) * 0.9, 32 * L, 0.4);
    var armSw = walkPhase !== null ? Math.sin(walkPhase + Math.PI) : 0;
    limb(shX, shY, 0.12 + armSw * 0.4, 26 * L, 0.25 + armSw * 0.3, 24 * L, 0.4);

    /* torso */
    sline(hipX, hipY, shX, shY, 0.9, 2.6);

    /* near legs */
    var sw2 = walkPhase !== null ? Math.sin(walkPhase) : 0;
    var bend = walkPhase !== null ? Math.max(0, -Math.cos(walkPhase)) * 0.9 : 0.08;
    var foot = limb(hipX, hipY, sw2 * 0.55, 30 * L, sw2 * 0.3 + bend, 32 * L, 0.9);
    sline(foot[0] - 7 * L, foot[1], foot[0] + 5 * L, foot[1], 0.9, 2.2); /* shoe */

    /* near arm */
    var aA = 0.15, aB = 0.3;
    if (walkPhase !== null) { var s3 = Math.sin(walkPhase); aA = 0.15 + s3 * 0.45; aB = 0.3 + s3 * 0.3; }
    if (armMode === "reach") { aA = 1.25; aB = 1.45; }
    if (armMode === "present") { aA = 1.35; aB = 1.5; }
    var hand = limb(shX, shY, aA, 26 * L, aB, 24 * L, 0.9);
    scircle(hand[0], hand[1], 3.4 * L, 0.9);

    /* head */
    var hx = shX + 9 * L, hy = shY - 21 * L;
    scircle(hx, hy, 13 * L, 0.9);
    /* hair scribble */
    ctx.strokeStyle = "rgba(232,230,224,0.5)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(hx, hy - 1, 13 * L, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    /* eye dot (profile) */
    ctx.fillStyle = "rgba(232,230,224,0.9)";
    ctx.beginPath();
    ctx.arc(hx + 6 * L, hy - 1, 1.4 * L, 0, 6.2832);
    ctx.fill();
  }

  /* ---------- door + light ---------- */
  function drawDoor(doorX, open) {
    var dw = 92 * S, dh = 172 * S;
    var top = G - dh;

    /* doorway dark */
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(doorX, top, dw, dh);

    /* spilling light */
    if (open > 0.01) {
      var flick = 0.94 + 0.06 * Math.sin(performance.now() / 130);
      var li = open * flick;
      var g = ctx.createRadialGradient(doorX + dw / 2, top + dh / 2, 10, doorX + dw / 2, top + dh / 2, dw * 2.4);
      g.addColorStop(0, "rgba(255,196,110," + (0.55 * li).toFixed(3) + ")");
      g.addColorStop(1, "rgba(255,150,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(doorX - dw * 2, top - dh, dw * 5, dh * 3.4);
      /* floor wash */
      var fg = ctx.createLinearGradient(doorX, G, doorX + dw * 4.2, G);
      fg.addColorStop(0, "rgba(255,190,100," + (0.30 * li).toFixed(3) + ")");
      fg.addColorStop(1, "rgba(255,150,60,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(doorX, G);
      ctx.lineTo(doorX + dw, G);
      ctx.lineTo(doorX + dw * 4.2, G + 26 * S);
      ctx.lineTo(doorX - dw * 0.4, G + 26 * S);
      ctx.closePath();
      ctx.fill();
      /* rays */
      ctx.save();
      ctx.globalAlpha = 0.10 * li;
      ctx.strokeStyle = "rgba(255,200,120,1)";
      ctx.lineWidth = 1.2;
      for (var r = 0; r < 4; r++) {
        var ry = top + dh * (0.25 + r * 0.22);
        ctx.beginPath();
        ctx.moveTo(doorX + dw * 0.9, ry);
        ctx.lineTo(doorX + dw * (3.4 + r * 0.3), ry + 60 * S + r * 14 * S);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* frame */
    sline(doorX - 6 * S, top - 6 * S, doorX - 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX + dw + 6 * S, top - 6 * S, doorX + dw + 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX - 10 * S, top - 6 * S, doorX + dw + 10 * S, top - 6 * S, 0.9, 3);

    /* swinging panel (hinged left, fake perspective) */
    var wdt = dw * Math.cos(open * 1.75);
    if (wdt > 2) {
      ctx.fillStyle = "rgba(20,22,30,0.9)";
      ctx.fillRect(doorX, top, wdt, dh);
      srect(doorX, top, wdt, dh, 0.9, 2);
      sline(doorX + 6 * S, top + 10 * S, doorX + 6 * S, top + dh - 10 * S, 0.35, 1.2);
      ctx.fillStyle = "rgba(232,230,224,0.9)";
      ctx.beginPath();
      ctx.arc(doorX + Math.max(10 * S, wdt - 12 * S), top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
    }
  }

  /* dust motes in the light */
  var motes = [];
  for (var m = 0; m < 42; m++) {
    motes.push({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random() * 1.6, p: Math.random() * 6.2832 });
  }
  function drawMotes(doorX, open, t) {
    if (open < 0.05) return;
    var dw = 92 * S;
    for (var i = 0; i < motes.length; i++) {
      var mo = motes[i];
      var x = doorX + mo.x * dw * 3.6 + Math.sin(t * 0.7 + mo.p) * 8;
      var y = G - 170 * S + mo.y * 180 * S + Math.cos(t * 0.5 + mo.p) * 7;
      var a = (0.25 + 0.55 * Math.abs(Math.sin(t * 1.3 + mo.p))) * open;
      ctx.fillStyle = "rgba(255,220,160," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, mo.s * S, 0, 6.2832);
      ctx.fill();
    }
  }

  /* ---------- 4 art boards (2x2) ---------- */
  function miniSketch(i, x, y, w, h, a) {
    ctx.save();
    ctx.globalAlpha = a;
    if (i === 0) { /* growth chart */
      sline(x + 8 * S, y + h - 8 * S, x + 8 * S, y + 8 * S, 0.8, 1.4);
      sline(x + 8 * S, y + h - 8 * S, x + w - 6 * S, y + h - 8 * S, 0.8, 1.4);
      ctx.strokeStyle = "rgba(0,212,200,0.85)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      var px = x + 12 * S, py = y + h - 16 * S;
      ctx.moveTo(px, py);
      ctx.lineTo(px + w * 0.25, py - h * 0.15);
      ctx.lineTo(px + w * 0.5, py - h * 0.1);
      ctx.lineTo(px + w * 0.72, py - h * 0.45);
      ctx.stroke();
    } else if (i === 1) { /* portrait */
      scircle(x + w / 2, y + h * 0.34, h * 0.16, 0.85);
      ctx.strokeStyle = "rgba(232,230,224,0.8)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.95, h * 0.30, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (i === 2) { /* phone UI */
      var pw = w * 0.42, ph = h * 0.72, px2 = x + (w - pw) / 2, py2 = y + (h - ph) / 2;
      srect(px2, py2, pw, ph, 0.9, 1.6);
      sline(px2 + 5 * S, py2 + 10 * S, px2 + pw - 5 * S, py2 + 10 * S, 0.7, 1.4);
      for (var L2 = 0; L2 < 3; L2++) {
        sline(px2 + 5 * S, py2 + (20 + L2 * 10) * S, px2 + pw - (8 + L2 * 6) * S, py2 + (20 + L2 * 10) * S, 0.55, 1.3);
      }
      scircle(px2 + pw / 2, py2 + ph - 8 * S, 2.4 * S, 0.7);
    } else { /* mountains */
      sline(x + 6 * S, y + h - 8 * S, x + w * 0.42, y + h * 0.30, 0.85, 1.6);
      sline(x + w * 0.42, y + h * 0.30, x + w * 0.68, y + h - 8 * S, 0.85, 1.6);
      sline(x + w * 0.34, y + h - 8 * S, x + w * 0.62, y + h * 0.48, 0.7, 1.5);
      sline(x + w * 0.62, y + h * 0.48, x + w * 0.86, y + h - 8 * S, 0.7, 1.5);
      scircle(x + w * 0.72, y + h * 0.26, 5 * S, 0.85);
    }
    ctx.restore();
  }

  function drawBoards(bx, by, appear) {
    var bw = 96 * S, bh = 122 * S, gap = 24 * S;
    for (var i = 0; i < 4; i++) {
      var p = Math.max(0, Math.min(1, appear * 4 - i * 0.55));
      if (p <= 0) continue;
      var cx = bx + (i % 2) * (bw + gap), cy = by + Math.floor(i / 2) * (bh + gap) + (1 - p) * 34;
      ctx.save();
      ctx.globalAlpha = p;
      /* easel legs */
      sline(cx + bw * 0.2, cy + bh, cx + bw * 0.1, cy + bh + 44 * S, 0.7, 2);
      sline(cx + bw * 0.8, cy + bh, cx + bw * 0.9, cy + bh + 44 * S, 0.7, 2);
      /* frame */
      ctx.fillStyle = "rgba(16,18,26,0.92)";
      ctx.fillRect(cx, cy, bw, bh);
      srect(cx, cy, bw, bh, 0.95, 2.4);
      srect(cx + 7 * S, cy + 7 * S, bw - 14 * S, bh - 14 * S, 0.4, 1.2);
      miniSketch(i, cx + 10 * S, cy + 10 * S, bw - 20 * S, bh - 20 * S, 0.95);
      ctx.restore();
    }
  }

  /* ---------- timeline ---------- */
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

  function scene(t) {
    ctx.clearRect(0, 0, W, H);
    dots();

    /* ground */
    sline(20, G + 46 * S, W - 20, G + 46 * S, 0.5, 1.6);
    sline(40, G + 54 * S, W - 60, G + 54 * S, 0.25, 1.2);

    var doorX = W < 760 ? W * 0.10 : W * 0.30;
    var walkEnd = doorX - 46 * S;

    var manX, walking = false, phase = 0, arm = "down", lean = 0.06, door = 0, appear = 0;

    if (t < 4) { /* walk in */
      var wp = ease(t / 4);
      manX = -70 + (walkEnd + 70) * wp;
      walking = true; phase = t * 7.5;
    } else if (t < 5) { /* arrive + reach */
      manX = walkEnd; arm = "reach"; lean = 0.12;
    } else if (t < 6.5) { /* door swings */
      manX = walkEnd; arm = "reach"; lean = 0.12;
      door = ease((t - 5) / 1.5);
    } else if (t < 8) { /* turn to boards */
      manX = walkEnd; arm = "present"; lean = 0.10; door = 1;
      appear = ease((t - 6.5) / 1.5) * 1.4;
    } else { /* hold */
      manX = walkEnd; arm = "present"; lean = 0.10; door = 1;
      appear = Math.min(2.2, 1.4 + (t - 8) * 0.2);
    }

    drawDoor(doorX, door);

    /* boards on the right, standing on the ground line */
    var bw = 96 * S, gap = 24 * S;
    var bx = Math.min(W - (bw * 2 + gap) - 24, doorX + 200 * S);
    if (W < 760) bx = Math.max(doorX + 150 * S, 24);
    var by = G + 46 * S - (2 * 122 * S + gap + 44 * S);
    drawBoards(bx, by, appear);

    drawMan(manX, walking ? phase : null, arm, lean);
    drawMotes(doorX, door, t);

    /* loop fade envelope */
    var a = 1;
    if (t < 0.7) a = t / 0.7;
    if (t > 13.6) a = Math.max(0, 1 - (t - 13.6) / 1.8);
    if (a < 1) {
      ctx.fillStyle = "rgba(9,10,15," + (1 - a).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (freezeT !== null && !isNaN(freezeT)) { scene(freezeT % T_LOOP); return; }
  if (reduceMotion) { scene(11.5); return; }

  var running = true, inView = true;
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView = entry.isIntersecting; });
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });

  var start = performance.now();
  (function loop(now) {
    requestAnimationFrame(loop);
    if (!running || !inView || document.hidden) return;
    var t = (((now || performance.now()) - start) / 1000) % T_LOOP;
    scene(t);
  })();
})();

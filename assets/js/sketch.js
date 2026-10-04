/* ============================================================
   Hero Sketch — pencil-sketch vignette on canvas (vanilla, zero deps).
   A man emerges from a lit room through double doors and presents
   4 wooden art boards. Loops ~18s. ?sketch=<t> freezes a frame
   (for screenshots). Pauses off-screen / hidden.
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
  var T_LOOP = 18;

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

  function sline(x1, y1, x2, y2, alpha, w, tone) {
    alpha = alpha === undefined ? 0.85 : alpha;
    w = w === undefined ? 1.6 : w;
    tone = tone || "232,230,224";
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(" + tone + "," + (alpha * (p ? 0.45 : 1)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(x1 + j() * 0.9, y1 + j() * 0.9);
      ctx.lineTo(x2 + j() * 0.9, y2 + j() * 0.9);
      ctx.stroke();
    }
  }

  function scircle(x, y, r, alpha, tone) {
    alpha = alpha === undefined ? 0.85 : alpha;
    tone = tone || "232,230,224";
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(" + tone + "," + (alpha * (p ? 0.4 : 1)).toFixed(3) + ")";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + j() * 0.8, y + j() * 0.8, r + j() * 0.8, 0, 6.2832);
      ctx.stroke();
    }
  }

  function srect(x, y, w, h, alpha, lw, tone) {
    var o = 3; /* hand overshoot at corners */
    sline(x - o, y, x + w + o, y, alpha, lw, tone);
    sline(x + w, y - o, x + w, y + h + o, alpha, lw, tone);
    sline(x + w + o, y + h, x - o, y + h, alpha, lw, tone);
    sline(x, y + h + o, x, y - o, alpha, lw, tone);
  }

  /* ---------- wood helpers (warm brown + grain) ---------- */
  var WOOD = "122,79,40", WOOD_DK = "62,38,20", WOOD_LT = "205,155,95";

  function woodFill(x, y, w, h) {
    var g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, "rgba(74,47,24,0.95)");
    g.addColorStop(0.5, "rgba(96,62,32,0.95)");
    g.addColorStop(1, "rgba(66,41,22,0.95)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  /* long grain streaks along a rail */
  function woodGrain(x, y, w, h, vertical) {
    var n = Math.max(2, Math.floor((vertical ? w : h) / 7));
    for (var i = 0; i < n; i++) {
      var off = (i + 0.7) / (n + 0.4);
      ctx.strokeStyle = i % 2
        ? "rgba(" + WOOD_LT + ",0.35)"
        : "rgba(" + WOOD_DK + ",0.55)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (vertical) {
        var gx = x + w * off;
        ctx.moveTo(gx, y + 2);
        ctx.bezierCurveTo(gx + j() * 3, y + h * 0.33, gx + j() * 3, y + h * 0.66, gx + j() * 2, y + h - 2);
      } else {
        var gy = y + h * off;
        ctx.moveTo(x + 2, gy);
        ctx.bezierCurveTo(x + w * 0.33, gy + j() * 3, x + w * 0.66, gy + j() * 3, x + w - 2, gy + j() * 2);
      }
      ctx.stroke();
    }
  }

  function woodPanel(x, y, w, h) {
    if (w < 3) return;
    woodFill(x, y, w, h);
    woodGrain(x, y, w, h, h > w);
    srect(x, y, w, h, 0.9, 2.2, "235,200,150");
    /* inset panel mould */
    if (w > 26 && h > 60) {
      srect(x + 7 * S, y + h * 0.12, w - 14 * S, h * 0.32, 0.5, 1.4, "235,200,150");
      srect(x + 7 * S, y + h * 0.56, w - 14 * S, h * 0.32, 0.5, 1.4, "235,200,150");
    }
  }

  /* faint dot grid backdrop */
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
  function limb(x, y, a1, l1, a2, l2, alpha, tone) {
    var kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1;
    var fx = kx + Math.sin(a2) * l2, fy = ky + Math.cos(a2) * l2;
    sline(x, y, kx, ky, alpha, 2.2, tone);
    sline(kx, ky, fx, fy, alpha, 2.0, tone);
    return [fx, fy];
  }

  function drawMan(x, walkPhase, armMode, lean, sc, alpha) {
    sc = sc || 1; alpha = alpha === undefined ? 1 : alpha;
    var L = S * sc;
    ctx.save();
    ctx.globalAlpha = alpha;
    var bob = walkPhase !== null ? Math.abs(Math.sin(walkPhase)) * 3 * L : Math.sin(performance.now() / 900) * 1.2 * L;
    var hipX = x, hipY = G - 62 * L + bob;
    var shX = x + (6 + lean * 6) * L, shY = hipY - 52 * L;

    var sw = walkPhase !== null ? Math.sin(walkPhase + Math.PI) : 0;
    limb(hipX, hipY, sw * 0.55, 30 * L, sw * 0.3 + Math.max(0, -Math.cos(walkPhase || 0)) * 0.9, 32 * L, 0.4);
    var armSw = walkPhase !== null ? Math.sin(walkPhase + Math.PI) : 0;
    limb(shX, shY, 0.12 + armSw * 0.4, 26 * L, 0.25 + armSw * 0.3, 24 * L, 0.4);

    sline(hipX, hipY, shX, shY, 0.9, 2.6);

    var sw2 = walkPhase !== null ? Math.sin(walkPhase) : 0;
    var bend = walkPhase !== null ? Math.max(0, -Math.cos(walkPhase)) * 0.9 : 0.08;
    var foot = limb(hipX, hipY, sw2 * 0.55, 30 * L, sw2 * 0.3 + bend, 32 * L, 0.9);
    sline(foot[0] - 7 * L, foot[1], foot[0] + 5 * L, foot[1], 0.9, 2.2);

    var aA = 0.15, aB = 0.3;
    if (walkPhase !== null) { var s3 = Math.sin(walkPhase); aA = 0.15 + s3 * 0.45; aB = 0.3 + s3 * 0.3; }
    if (armMode === "push") { aA = 1.2; aB = 1.35; }
    if (armMode === "present") { aA = 1.35; aB = 1.5; }
    var hand = limb(shX, shY, aA, 26 * L, aB, 24 * L, 0.9);
    scircle(hand[0], hand[1], 3.4 * L, 0.9);

    var hx = shX + 9 * L, hy = shY - 21 * L;
    scircle(hx, hy, 13 * L, 0.9);
    ctx.strokeStyle = "rgba(232,230,224,0.5)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(hx, hy - 1, 13 * L, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.fillStyle = "rgba(232,230,224,0.9)";
    ctx.beginPath();
    ctx.arc(hx + 6 * L, hy - 1, 1.4 * L, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- double doors + interior light ---------- */
  function drawDoors(doorX, open, seam) {
    var dw = 150 * S, dh = 182 * S;
    var top = G - dh;

    /* dark room behind */
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(doorX, top, dw, dh);

    /* anticipation seam before opening */
    if (open < 0.02 && seam > 0) {
      var sg = ctx.createLinearGradient(doorX + dw / 2, top, doorX + dw / 2, top + dh);
      sg.addColorStop(0, "rgba(255,190,100,0)");
      sg.addColorStop(0.5, "rgba(255,190,100," + (0.5 * seam).toFixed(3) + ")");
      sg.addColorStop(1, "rgba(255,190,100,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(doorX + dw / 2 - 2, top, 4, dh);
    }

    if (open > 0.01) {
      var flick = 0.94 + 0.06 * Math.sin(performance.now() / 130);
      var li = open * flick;
      var g = ctx.createRadialGradient(doorX + dw / 2, top + dh / 2, 10, doorX + dw / 2, top + dh / 2, dw * 2.2);
      g.addColorStop(0, "rgba(255,196,110," + (0.6 * li).toFixed(3) + ")");
      g.addColorStop(1, "rgba(255,150,60,0)");
      ctx.fillStyle = g;
      ctx.fillRect(doorX - dw * 1.6, top - dh * 0.8, dw * 4.4, dh * 3);
      var fg = ctx.createLinearGradient(doorX, G, doorX + dw * 4.4, G);
      fg.addColorStop(0, "rgba(255,190,100," + (0.32 * li).toFixed(3) + ")");
      fg.addColorStop(1, "rgba(255,150,60,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(doorX, G);
      ctx.lineTo(doorX + dw, G);
      ctx.lineTo(doorX + dw * 4.4, G + 26 * S);
      ctx.lineTo(doorX - dw * 0.4, G + 26 * S);
      ctx.closePath();
      ctx.fill();
      ctx.save();
      ctx.globalAlpha = 0.10 * li;
      ctx.strokeStyle = "rgba(255,200,120,1)";
      ctx.lineWidth = 1.2;
      for (var r = 0; r < 4; r++) {
        var ry = top + dh * (0.25 + r * 0.22);
        ctx.beginPath();
        ctx.moveTo(doorX + dw / 2, ry);
        ctx.lineTo(doorX + dw * (2.6 + r * 0.35), ry + 60 * S + r * 14 * S);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* frame */
    sline(doorX - 6 * S, top - 6 * S, doorX - 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX + dw + 6 * S, top - 6 * S, doorX + dw + 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX - 10 * S, top - 6 * S, doorX + dw + 10 * S, top - 6 * S, 0.9, 3);

    /* two wooden panels, hinged outer, parting in the middle */
    var half = (dw / 2) * Math.cos(open * 1.65);
    if (half > 2) {
      woodPanel(doorX, top, half, dh);
      woodPanel(doorX + dw - half, top, half, dh);
      ctx.fillStyle = "rgba(235,200,150,0.95)";
      ctx.beginPath();
      ctx.arc(doorX + half - 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(doorX + dw - half + 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
    } else if (open < 0.02) {
      /* fully closed: full wooden double door */
      woodPanel(doorX, top, dw / 2, dh);
      woodPanel(doorX + dw / 2, top, dw / 2, dh);
      sline(doorX + dw / 2, top, doorX + dw / 2, top + dh, 0.8, 2, "235,200,150");
    }
  }

  var motes = [];
  for (var m = 0; m < 46; m++) {
    motes.push({ x: Math.random(), y: Math.random(), s: 0.5 + Math.random() * 1.6, p: Math.random() * 6.2832 });
  }
  function drawMotes(doorX, open, t) {
    if (open < 0.05) return;
    var dw = 150 * S;
    for (var i = 0; i < motes.length; i++) {
      var mo = motes[i];
      var x = doorX + mo.x * dw * 3.4 + Math.sin(t * 0.7 + mo.p) * 8;
      var y = G - 180 * S + mo.y * 190 * S + Math.cos(t * 0.5 + mo.p) * 7;
      var a = (0.25 + 0.55 * Math.abs(Math.sin(t * 1.3 + mo.p))) * open;
      ctx.fillStyle = "rgba(255,220,160," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, mo.s * S, 0, 6.2832);
      ctx.fill();
    }
  }

  /* ---------- 4 wooden art boards (2x2) ---------- */
  function miniSketch(i, x, y, w, h, a) {
    ctx.save();
    ctx.globalAlpha = a;
    if (i === 0) {
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
    } else if (i === 1) {
      scircle(x + w / 2, y + h * 0.34, h * 0.16, 0.85);
      ctx.strokeStyle = "rgba(232,230,224,0.8)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.95, h * 0.30, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else if (i === 2) {
      var pw = w * 0.42, ph = h * 0.72, px2 = x + (w - pw) / 2, py2 = y + (h - ph) / 2;
      srect(px2, py2, pw, ph, 0.9, 1.6);
      sline(px2 + 5 * S, py2 + 10 * S, px2 + pw - 5 * S, py2 + 10 * S, 0.7, 1.4);
      for (var L2 = 0; L2 < 3; L2++) {
        sline(px2 + 5 * S, py2 + (20 + L2 * 10) * S, px2 + pw - (8 + L2 * 6) * S, py2 + (20 + L2 * 10) * S, 0.55, 1.3);
      }
      scircle(px2 + pw / 2, py2 + ph - 8 * S, 2.4 * S, 0.7);
    } else {
      sline(x + 6 * S, y + h - 8 * S, x + w * 0.42, y + h * 0.30, 0.85, 1.6);
      sline(x + w * 0.42, y + h * 0.30, x + w * 0.68, y + h - 8 * S, 0.85, 1.6);
      sline(x + w * 0.34, y + h - 8 * S, x + w * 0.62, y + h * 0.48, 0.7, 1.5);
      sline(x + w * 0.62, y + h * 0.48, x + w * 0.86, y + h - 8 * S, 0.7, 1.5);
      scircle(x + w * 0.72, y + h * 0.26, 5 * S, 0.85);
    }
    ctx.restore();
  }

  function woodFrame(x, y, w, h) {
    woodFill(x, y, w, h);
    woodGrain(x, y, w, h, false);
    woodGrain(x, y, w, h, true);
    srect(x, y, w, h, 0.95, 2.4, "235,200,150");
  }

  function drawBoards(bx, by, appear) {
    var bw = 96 * S, bh = 122 * S, gap = 24 * S, rail = 9 * S;
    for (var i = 0; i < 4; i++) {
      var p = Math.max(0, Math.min(1, appear * 4 - i * 0.55));
      if (p <= 0) continue;
      var cx = bx + (i % 2) * (bw + gap), cy = by + Math.floor(i / 2) * (bh + gap) + (1 - p) * 34;
      ctx.save();
      ctx.globalAlpha = p;
      /* wooden easel legs */
      ctx.strokeStyle = "rgba(96,62,32,0.95)";
      ctx.lineWidth = 4 * S;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx + bw * 0.2, cy + bh - 4); ctx.lineTo(cx + bw * 0.08, cy + bh + 44 * S);
      ctx.moveTo(cx + bw * 0.8, cy + bh - 4); ctx.lineTo(cx + bw * 0.92, cy + bh + 44 * S);
      ctx.stroke();
      sline(cx + bw * 0.2, cy + bh - 4, cx + bw * 0.08, cy + bh + 44 * S, 0.5, 1.2, "235,200,150");
      /* wooden frame */
      woodFrame(cx, cy, bw, rail);
      woodFrame(cx, cy + bh - rail, bw, rail);
      woodFrame(cx, cy, rail, bh);
      woodFrame(cx + bw - rail, cy, rail, bh);
      /* dark canvas + art */
      ctx.fillStyle = "rgba(13,15,22,0.96)";
      ctx.fillRect(cx + rail, cy + rail, bw - rail * 2, bh - rail * 2);
      miniSketch(i, cx + rail + 4 * S, cy + rail + 4 * S, bw - rail * 2 - 8 * S, bh - rail * 2 - 8 * S, 0.95);
      ctx.restore();
    }
  }

  /* ---------- timeline ---------- */
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

  function scene(t) {
    ctx.clearRect(0, 0, W, H);
    dots();

    sline(20, G + 46 * S, W - 20, G + 46 * S, 0.5, 1.6);
    sline(40, G + 54 * S, W - 60, G + 54 * S, 0.25, 1.2);

    var doorX = W < 760 ? W * 0.08 : W * 0.26;
    var dw = 150 * S;
    var door = 0, seam = 0;
    var manX = 0, walking = false, phase = 0, arm = "down", lean = 0.06, msc = 1, malpha = 1;
    var showMan = false, appear = 0;

    var bx = Math.min(W - (96 * S * 2 + 24 * S) - 24, doorX + dw + 90 * S);
    if (W < 760) bx = Math.max(doorX + dw + 40 * S, 24);
    var presentX = bx - 80 * S;

    if (t < 2) { /* closed doors, breathing seam */
      seam = 0.4 + 0.3 * Math.sin(t * 2.2);
    } else if (t < 4) { /* double doors part */
      door = ease((t - 2) / 2);
    } else if (t < 7.5) { /* man walks out of the lit room */
      door = 1;
      var wp = ease((t - 3.6) / 3.4);
      showMan = true; walking = true;
      phase = (t - 3.6) * 7.5;
      manX = (doorX + dw / 2) + (presentX - (doorX + dw / 2)) * wp;
      msc = 0.78 + 0.22 * wp;
      malpha = 0.7 + 0.3 * wp;
      if (t < 4.6) arm = "push";
    } else if (t < 8.6) { /* settle into presenting */
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      appear = ease((t - 7.5) / 1.1) * 1.4;
    } else { /* hold */
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      appear = Math.min(2.2, 1.4 + (t - 8.6) * 0.2);
    }

    drawDoors(doorX, door, seam);

    var by = G + 46 * S - (2 * 122 * S + 24 * S + 44 * S);
    drawBoards(bx, by, appear);

    if (showMan) drawMan(manX, walking ? phase : null, arm, lean, msc, malpha);
    drawMotes(doorX, door, t);

    var a = 1;
    if (t < 0.7) a = t / 0.7;
    if (t > 15.4) a = Math.max(0, 1 - (t - 15.4) / 1.9);
    if (a < 1) {
      ctx.fillStyle = "rgba(9,10,15," + (1 - a).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  if (freezeT !== null && !isNaN(freezeT)) { scene(freezeT % T_LOOP); return; }
  if (reduceMotion) { scene(12.5); return; }

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

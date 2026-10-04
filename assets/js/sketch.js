/* ============================================================
   Hero Sketch — pencil-sketch vignette on canvas (vanilla, zero deps).
   A man emerges from a lit room through wooden double doors,
   presents 4 wooden art boards, then bows in namaste.
   Loops ~18s. ?sketch=<t> freezes a frame (for screenshots).
   Pauses off-screen / hidden.
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
  var T_LOOP = 22;

  var freezeT = null;
  try {
    var q = new URLSearchParams(window.location.search).get("sketch");
    if (q !== null && q !== "") freezeT = parseFloat(q);
  } catch (err) { /* ignore */ }

  var grain = [];
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth || window.innerWidth;
    H = hero.clientHeight || 480;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S = Math.max(0.55, Math.min(W, H) / 620);
    G = H * 0.80;
    grain = [];
    for (var i = 0; i < 220; i++) {
      grain.push({ x: Math.random() * W, y: Math.random() * H, a: 0.02 + Math.random() * 0.05 });
    }
  }

  /* ---------- pencil primitives (stable single-pass strokes; no boil) ---------- */
  function j() { return 0; }

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
    var o = 3;
    sline(x - o, y, x + w + o, y, alpha, lw, tone);
    sline(x + w, y - o, x + w, y + h + o, alpha, lw, tone);
    sline(x + w + o, y + h, x - o, y + h, alpha, lw, tone);
    sline(x, y + h + o, x, y - o, alpha, lw, tone);
  }

  /* ---------- wood ---------- */
  var WOOD_DK = "62,38,20", WOOD_LT = "205,155,95";

  function woodFill(x, y, w, h, toneShift) {
    toneShift = toneShift || 0;
    var g = ctx.createLinearGradient(x, y, x + w, y);
    g.addColorStop(0, "rgba(" + (74 + toneShift) + "," + (47 + toneShift * 0.6) + ",24,0.95)");
    g.addColorStop(0.5, "rgba(" + (96 + toneShift) + "," + (62 + toneShift * 0.6) + ",32,0.95)");
    g.addColorStop(1, "rgba(" + (66 + toneShift) + "," + (41 + toneShift * 0.6) + ",22,0.95)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  }

  function woodGrain(x, y, w, h, vertical) {
    var n = Math.max(2, Math.floor((vertical ? w : h) / 7));
    for (var i = 0; i < n; i++) {
      var off = (i + 0.7) / (n + 0.4);
      ctx.strokeStyle = i % 2 ? "rgba(" + WOOD_LT + ",0.32)" : "rgba(" + WOOD_DK + ",0.55)";
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

  function woodPanel(x, y, w, h, toneShift) {
    if (w < 3) return;
    woodFill(x, y, w, h, toneShift);
    woodGrain(x, y, w, h, h > w);
    srect(x, y, w, h, 0.9, 2.2, "235,200,150");
    if (w > 26 && h > 60) {
      srect(x + 7 * S, y + h * 0.12, w - 14 * S, h * 0.32, 0.5, 1.4, "235,200,150");
      srect(x + 7 * S, y + h * 0.56, w - 14 * S, h * 0.32, 0.5, 1.4, "235,200,150");
    }
  }

  /* ---------- backdrop: grain always; dots only when revealed ---------- */
  function backdrop(dotsA) {
    if (dotsA > 0.01) {
      ctx.fillStyle = "rgba(148,163,184,0.13)";
      ctx.save();
      ctx.globalAlpha = dotsA;
      var gap = 26 * S;
      for (var y = gap / 2; y < H; y += gap) {
        for (var x = gap / 2; x < W; x += gap) {
          ctx.beginPath();
          ctx.arc(x, y, 1.3, 0, 6.2832);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    ctx.fillStyle = "rgba(200,200,200,1)";
    for (var i = 0; i < grain.length; i++) {
      var g = grain[i];
      ctx.globalAlpha = g.a;
      ctx.fillRect(g.x, g.y, 1, 1);
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- man ---------- */
  function limb(x, y, a1, l1, a2, l2, alpha, tone) {
    var kx = x + Math.sin(a1) * l1, ky = y + Math.cos(a1) * l1;
    var fx = kx + Math.sin(a2) * l2, fy = ky + Math.cos(a2) * l2;
    sline(x, y, kx, ky, alpha, 2.2, tone);
    sline(kx, ky, fx, fy, alpha, 2.0, tone);
    return [fx, fy, kx, ky];
  }

  /* o: {walk, arm, blend, lean, sc, alpha, bow}
     walk: phase number or null. arm: down/push/present/namaste.
     blend: present->namaste crossfade 0..1. bow: 0..1 bow depth. */
  function drawMan(x, o) {
    var L = S * (o.sc || 1);
    var alpha = o.alpha === undefined ? 1 : o.alpha;
    var bow = o.bow || 0, blend = o.blend || 0;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, 0);
    ctx.scale((o.face || 1) * (o.sx || 1), 1);
    ctx.translate(-x, 0);

    var bob = o.walk !== null && o.walk !== undefined
      ? Math.abs(Math.sin(o.walk)) * 3 * L
      : Math.sin(performance.now() / 1100) * 1.4 * L; /* breath */
    var lean = (o.lean || 0.06) + bow * 0.30;
    var hipX = x, hipY = G - 62 * L + bob;
    var shX = x + (6 + lean * 40) * L, shY = hipY - 52 * L + bow * 5 * L;

    var w = o.walk;
    var swF = (w !== null && w !== undefined) ? Math.sin(w + Math.PI) : 0;
    var swN = (w !== null && w !== undefined) ? Math.sin(w) : 0;
    var bendF = (w !== null && w !== undefined) ? Math.max(0, -Math.cos(w + Math.PI)) * 0.9 : 0.08;
    var bendN = (w !== null && w !== undefined) ? Math.max(0, -Math.cos(w)) * 0.9 : 0.08;

    /* far leg (dim) */
    limb(hipX, hipY, swF * 0.55, 30 * L, swF * 0.3 + bendF, 32 * L, 0.4);
    /* far arm (dim) — hidden once namaste folds */
    if (o.arm !== "namaste") {
      var asw = (w !== null && w !== undefined) ? Math.sin(w + Math.PI) : 0;
      limb(shX, shY, 0.12 + asw * 0.4, 26 * L, 0.25 + asw * 0.3, 24 * L, 0.4);
    }

    /* torso with a back line for form */
    sline(hipX, hipY, shX, shY, 0.9, 2.6);
    sline(hipX - 3 * L, hipY - 2 * L, shX - 5 * L, shY + 2 * L, 0.3, 1.4);

    /* near leg + shoe */
    var foot = limb(hipX, hipY, swN * 0.55, 30 * L, swN * 0.3 + bendN, 32 * L, 0.9);
    sline(foot[0] - 7 * L, foot[1], foot[0] + 5 * L, foot[1], 0.9, 2.2);

    /* near arm */
    if (o.arm === "present" || o.arm === "namaste") {
      var pa = 0.9 * (o.arm === "namaste" ? (1 - blend) : 1);
      if (pa > 0.02) {
        var hand = limb(shX, shY, 1.35, 26 * L, 1.5, 24 * L, pa);
        scircle(hand[0], hand[1], 3.4 * L, pa);
      }
    } else {
      var aA = 0.15, aB = 0.3;
      if (w !== null && w !== undefined) { aA = 0.15 + swN * 0.45; aB = 0.3 + swN * 0.3; }
      if (o.arm === "push") { aA = 1.2; aB = 1.35; }
      limb(shX, shY, aA, 26 * L, aB, 24 * L, 0.9);
    }

    /* namaste fold: both forearms meet at the chest */
    if (o.arm === "namaste" && blend > 0.02) {
      var na = alpha * blend;
      var P = [shX + 23 * L, shY + 21 * L];
      var E1 = [shX + 7 * L, shY + 18 * L];
      var E2 = [shX + 4 * L, shY + 14 * L];
      sline(shX, shY, E1[0], E1[1], na, 2.4);
      sline(E1[0], E1[1], P[0], P[1], na, 2.2);
      sline(shX - 2 * L, shY - 1 * L, E2[0], E2[1], na * 0.55, 2.2);
      sline(E2[0], E2[1], P[0], P[1] - 3 * L, na * 0.55, 2.0);
      /* palms together */
      sline(P[0] - 5 * L, P[1] - 11 * L, P[0] + 1 * L, P[1] + 7 * L, na, 2.4);
      sline(P[0] - 1 * L, P[1] - 11 * L, P[0] + 5 * L, P[1] + 7 * L, na, 2.2);
    }

    /* head (bows with bow) */
    var hx = shX + 9 * L + bow * 11 * L, hy = shY - 21 * L + bow * 14 * L;
    scircle(hx, hy, 13 * L, 0.9);
    ctx.strokeStyle = "rgba(232,230,224,0.5)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(hx, hy - 1, 13 * L, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
    ctx.fillStyle = "rgba(232,230,224," + (0.9 * (1 - bow * 0.7)).toFixed(3) + ")";
    ctx.beginPath();
    ctx.arc(hx + 6 * L, hy - 1 + bow * 2 * L, 1.4 * L, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  }

  /* soft contact shadow grounding an object */
  function contactShadow(x, y, w, alpha) {
    alpha = alpha === undefined ? 0.4 : alpha;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, 0.22);
    var g = ctx.createRadialGradient(0, 0, 1, 0, 0, w / 2);
    g.addColorStop(0, "rgba(0,0,0," + alpha.toFixed(3) + ")");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, w / 2, 0, 6.2832);
    ctx.fill();
    ctx.restore();
  }

  /* ---------- room: double doors + light ---------- */
  function drawDoors(doorX, open, seam) {
    var dw = 150 * S, dh = 182 * S;
    var top = G - dh;

    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(doorX, top, dw, dh);

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
      /* tight glow hugging the doorway (no big halo) */
      /* floor wash + plank seams catching light */
      var fg = ctx.createLinearGradient(doorX, G, doorX + dw * 4.4, G);
      fg.addColorStop(0, "rgba(255,190,100," + (0.22 * li).toFixed(3) + ")");
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
      ctx.globalAlpha = 0.5 * li;
      ctx.strokeStyle = "rgba(120,70,30,1)";
      ctx.lineWidth = 1;
      for (var pi = 0; pi < 3; pi++) {
        var px = doorX + dw * (0.6 + pi * 1.1);
        ctx.beginPath();
        ctx.moveTo(px, G + 2);
        ctx.lineTo(px + dw * 0.9, G + 25 * S);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* frame */
    sline(doorX - 6 * S, top - 6 * S, doorX - 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX + dw + 6 * S, top - 6 * S, doorX + dw + 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX - 10 * S, top - 6 * S, doorX + dw + 10 * S, top - 6 * S, 0.9, 3);
    /* threshold step + its soft shadow */
    sline(doorX - 8 * S, G + 8 * S, doorX + dw + 8 * S, G + 8 * S, 0.6, 2.4, "235,200,150");
    contactShadow(doorX + dw / 2, G + 12 * S, dw * 1.5, 0.45);

    var half = (dw / 2) * Math.cos(open * 1.65);
    if (half > 2) {
      woodPanel(doorX, top, half, dh, 0);
      woodPanel(doorX + dw - half, top, half, dh, 6);
      ctx.fillStyle = "rgba(235,200,150,0.95)";
      ctx.beginPath();
      ctx.arc(doorX + half - 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(doorX + dw - half + 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
    } else if (open < 0.02) {
      woodPanel(doorX, top, dw / 2, dh, 0);
      woodPanel(doorX + dw / 2, top, dw / 2, dh, 6);
      sline(doorX + dw / 2, top, doorX + dw / 2, top + dh, 0.8, 2, "235,200,150");
      ctx.fillStyle = "rgba(235,200,150,0.95)";
      ctx.beginPath();
      ctx.arc(doorX + dw / 2 - 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(doorX + dw / 2 + 11 * S, top + dh * 0.52, 2.6 * S, 0, 6.2832);
      ctx.fill();
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

  /* ---------- boards ---------- */
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
      /* arrowhead */
      var ax = px + w * 0.72, ay = py - h * 0.45;
      sline(ax, ay, ax - 7 * S, ay + 2 * S, 0.85, 1.8, "0,212,200");
      sline(ax, ay, ax - 3 * S, ay + 7 * S, 0.85, 1.8, "0,212,200");
    } else if (i === 1) {
      scircle(x + w / 2, y + h * 0.32, h * 0.15, 0.85);
      ctx.strokeStyle = "rgba(232,230,224,0.8)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.95, h * 0.30, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      /* hair + collar hints */
      ctx.strokeStyle = "rgba(232,230,224,0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h * 0.30, h * 0.19, Math.PI * 1.05, Math.PI * 1.95);
      ctx.stroke();
      sline(x + w * 0.32, y + h * 0.78, x + w * 0.42, y + h * 0.88, 0.5, 1.2);
      sline(x + w * 0.68, y + h * 0.78, x + w * 0.58, y + h * 0.88, 0.5, 1.2);
    } else if (i === 2) {
      var pw = w * 0.42, ph = h * 0.72, px2 = x + (w - pw) / 2, py2 = y + (h - ph) / 2;
      srect(px2, py2, pw, ph, 0.9, 1.6);
      sline(px2 + 5 * S, py2 + 10 * S, px2 + pw - 5 * S, py2 + 10 * S, 0.7, 1.4);
      for (var L2 = 0; L2 < 3; L2++) {
        sline(px2 + 5 * S, py2 + (20 + L2 * 10) * S, px2 + pw - (8 + L2 * 6) * S, py2 + (20 + L2 * 10) * S, 0.55, 1.3);
      }
      scircle(px2 + pw / 2, py2 + ph - 8 * S, 2.4 * S, 0.7);
      /* signal bars */
      for (var sb = 0; sb < 3; sb++) {
        sline(px2 + pw - (10 + sb * 5) * S, py2 + 10 * S, px2 + pw - (10 + sb * 5) * S, py2 + (10 - sb * 2.5) * S, 0.7, 1.4);
      }
    } else {
      sline(x + 6 * S, y + h - 8 * S, x + w * 0.42, y + h * 0.30, 0.85, 1.6);
      sline(x + w * 0.42, y + h * 0.30, x + w * 0.68, y + h - 8 * S, 0.85, 1.6);
      sline(x + w * 0.34, y + h - 8 * S, x + w * 0.62, y + h * 0.48, 0.7, 1.5);
      sline(x + w * 0.62, y + h * 0.48, x + w * 0.86, y + h - 8 * S, 0.7, 1.5);
      scircle(x + w * 0.72, y + h * 0.26, 5 * S, 0.85);
      /* birds */
      ctx.strokeStyle = "rgba(232,230,224,0.6)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x + w * 0.24, y + h * 0.24, 4 * S, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x + w * 0.24 + 8 * S, y + h * 0.24, 4 * S, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
    ctx.restore();
  }

  function woodFrame(x, y, w, h, toneShift) {
    woodFill(x, y, w, h, toneShift);
    woodGrain(x, y, w, h, false);
    woodGrain(x, y, w, h, true);
    srect(x, y, w, h, 0.95, 2.4, "235,200,150");
  }

  function drawBoards(bx, by, appear, fade) {
    fade = fade === undefined ? 1 : fade;
    var bw = 96 * S, bh = 122 * S, gap = 24 * S, rail = 9 * S;
    var tones = [0, 10, -8, 4];
    for (var i = 0; i < 4; i++) {
      var p = Math.max(0, Math.min(1, appear * 4 - i * 0.55)) * fade;
      if (p <= 0.01) continue;
      var cx = bx + (i % 2) * (bw + gap), cy = by + Math.floor(i / 2) * (bh + gap) + (1 - p) * 34;
      ctx.save();
      ctx.globalAlpha = p;
      /* easel: legs + crossbar + tray */
      ctx.strokeStyle = "rgba(96,62,32,0.95)";
      ctx.lineWidth = 4 * S;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx + bw * 0.2, cy + bh - 4); ctx.lineTo(cx + bw * 0.08, cy + bh + 44 * S);
      ctx.moveTo(cx + bw * 0.8, cy + bh - 4); ctx.lineTo(cx + bw * 0.92, cy + bh + 44 * S);
      ctx.stroke();
      sline(cx + bw * 0.2, cy + bh - 4, cx + bw * 0.08, cy + bh + 44 * S, 0.5, 1.2, "235,200,150");
      sline(cx + bw * 0.14, cy + bh + 22 * S, cx + bw * 0.86, cy + bh + 22 * S, 0.6, 2.4, "150,100,55");
      /* frame rails with per-board tone */
      woodFrame(cx, cy, bw, rail, tones[i]);
      woodFrame(cx, cy + bh - rail, bw, rail, tones[i]);
      woodFrame(cx, cy, rail, bh, tones[i]);
      woodFrame(cx + bw - rail, cy, rail, bh, tones[i]);
      /* corner pegs */
      ctx.fillStyle = "rgba(235,200,150,0.9)";
      var pegs = [[cx + rail / 2, cy + rail / 2], [cx + bw - rail / 2, cy + rail / 2],
                  [cx + rail / 2, cy + bh - rail / 2], [cx + bw - rail / 2, cy + bh - rail / 2]];
      for (var pg = 0; pg < 4; pg++) {
        ctx.beginPath();
        ctx.arc(pegs[pg][0], pegs[pg][1], 1.6 * S, 0, 6.2832);
        ctx.fill();
      }
      /* canvas + art */
      ctx.fillStyle = "rgba(13,15,22,0.96)";
      ctx.fillRect(cx + rail, cy + rail, bw - rail * 2, bh - rail * 2);
      miniSketch(i, cx + rail + 4 * S, cy + rail + 4 * S, bw - rail * 2 - 8 * S, bh - rail * 2 - 8 * S, 0.95);
      ctx.restore();
      contactShadow(cx + bw / 2, cy + bh + 44 * S + 5 * S, bw * 1.35, 0.38 * p);
    }
  }

  /* ---------- front-facing detailed figure in namaste (faces viewer) ---------- */
  function drawFront(cx, bow, alpha, sx) {
    var L = S;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, 0);
    ctx.scale(sx || 1, 1);
    ctx.translate(-cx, 0);
    var breath = Math.sin(performance.now() / 1100) * 1.1 * L;
    var hipY = G - 62 * L;
    var shY = hipY - 54 * L + bow * 8 * L + breath * 0.4;

    /* shoes */
    ctx.fillStyle = "rgba(30,28,26,0.95)";
    for (var sdi = -1; sdi <= 1; sdi += 2) {
      ctx.beginPath();
      ctx.ellipse(cx + sdi * 9 * L, G - 2.5 * L, 9 * L, 3.4 * L, 0, 0, 6.2832);
      ctx.fill();
      sline(cx + sdi * 9 * L - 8 * L, G - 3 * L, cx + sdi * 9 * L + 8 * L, G - 3 * L, 0.5, 1.2, "235,200,150");
    }

    /* trousers: outer + inner seams, knees, waistband */
    for (var sd = -1; sd <= 1; sd += 2) {
      sline(cx + sd * 11 * L, hipY, cx + sd * 10 * L, G - 6 * L, 0.9, 2.4);
      sline(cx + sd * 3 * L, hipY + 8 * L, cx + sd * 4 * L, G - 6 * L, 0.7, 1.8);
      sline(cx + sd * 10 * L - 3 * L, G - 30 * L, cx + sd * 10 * L + 3 * L, G - 30 * L, 0.45, 1.2);
    }
    sline(cx - 11 * L, hipY, cx + 11 * L, hipY, 0.8, 2.2);
    scircle(cx, hipY, 1.8 * L, 0.8);

    /* kurta torso: shoulders -> waist, hem, collar, buttons, folds */
    sline(cx - 17 * L, shY, cx - 12 * L, hipY + 2 * L, 0.9, 2.4);
    sline(cx + 17 * L, shY, cx + 12 * L, hipY + 2 * L, 0.9, 2.4);
    sline(cx - 12 * L, hipY + 2 * L, cx + 12 * L, hipY + 2 * L, 0.7, 1.8);
    sline(cx - 17 * L, shY, cx + 17 * L, shY, 0.6, 1.8);
    /* collar V + placket */
    sline(cx - 7 * L, shY + 2 * L, cx, shY + 14 * L, 0.85, 1.8);
    sline(cx + 7 * L, shY + 2 * L, cx, shY + 14 * L, 0.85, 1.8);
    sline(cx, shY + 14 * L, cx, hipY - 2 * L, 0.5, 1.4);
    for (var b = 0; b < 3; b++) {
      scircle(cx, shY + (20 + b * 11) * L, 1.5 * L, 0.8);
    }
    /* fabric folds */
    sline(cx - 8 * L, hipY - 12 * L, cx - 6 * L, hipY - 2 * L, 0.35, 1.2);
    sline(cx + 8 * L, hipY - 12 * L, cx + 6 * L, hipY - 2 * L, 0.35, 1.2);

    /* arms: shoulders -> elbows -> prayer point at chest */
    var P = [cx, shY + 32 * L];
    for (var sa = -1; sa <= 1; sa += 2) {
      var shx = cx + sa * 17 * L;
      var E = [cx + sa * 24 * L, shY + 24 * L];
      sline(shx, shY + 1 * L, E[0], E[1], 0.9, 2.4);
      sline(shx + sa * 2 * L, shY + 3 * L, E[0] + sa * 2 * L, E[1], 0.35, 1.3);
      sline(E[0], E[1], P[0] + sa * 2 * L, P[1], 0.9, 2.2);
      /* cuff */
      sline(E[0] - 4 * L, E[1] - 2 * L, E[0] + 4 * L, E[1] + 2 * L, 0.6, 1.6);
    }

    /* joined palms: two hands + finger separations + thumbs */
    sline(P[0] - 5 * L, P[1] - 12 * L, P[0] - 4 * L, P[1] + 8 * L, 0.95, 2.4);
    sline(P[0] + 5 * L, P[1] - 12 * L, P[0] + 4 * L, P[1] + 8 * L, 0.95, 2.4);
    sline(P[0] - 5 * L, P[1] + 8 * L, P[0] + 5 * L, P[1] + 8 * L, 0.8, 2.0);
    for (var f = -1; f <= 1; f++) {
      sline(P[0] + f * 3 * L - 1 * L, P[1] - 11 * L, P[0] + f * 3 * L - 1 * L, P[1] - 1 * L, 0.55, 1.1);
    }
    ctx.strokeStyle = "rgba(232,230,224,0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(P[0] - 6 * L, P[1] - 2 * L, 4 * L, Math.PI * 0.4, Math.PI * 1.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(P[0] + 6 * L, P[1] - 2 * L, 4 * L, Math.PI * 1.9, Math.PI * 2.6);
    ctx.stroke();

    /* neck + head */
    sline(cx - 4 * L, shY - 1 * L, cx - 4 * L, shY - 9 * L, 0.8, 2.0);
    sline(cx + 4 * L, shY - 1 * L, cx + 4 * L, shY - 9 * L, 0.8, 2.0);
    var hcy = shY - 24 * L + bow * 24 * L;
    var featDrop = bow * 5 * L;
    scircle(cx, hcy, 13 * L, 0.95);
    /* hair cap + sideburns */
    ctx.strokeStyle = "rgba(232,230,224,0.75)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, hcy - 2 * L, 13 * L, Math.PI * 1.02, Math.PI * 1.98);
    ctx.stroke();
    sline(cx - 13 * L, hcy - 2 * L, cx - 13 * L, hcy + 6 * L, 0.6, 1.6);
    sline(cx + 13 * L, hcy - 2 * L, cx + 13 * L, hcy + 6 * L, 0.6, 1.6);
    /* ears */
    ctx.strokeStyle = "rgba(232,230,224,0.6)";
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(cx - 13 * L, hcy + 1 * L, 2.6 * L, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 13 * L, hcy + 1 * L, 2.6 * L, Math.PI * 1.5, Math.PI * 2.5); ctx.stroke();
    /* serene closed eyes, brows, nose, gentle smile */
    ctx.strokeStyle = "rgba(232,230,224,0.9)";
    ctx.lineWidth = 1.5;
    for (var e = -1; e <= 1; e += 2) {
      ctx.beginPath();
      ctx.arc(cx + e * 5.5 * L, hcy - 0.5 * L + featDrop, 2.6 * L, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + e * 8.5 * L, hcy - 5.5 * L + featDrop);
      ctx.lineTo(cx + e * 3 * L, hcy - 6.5 * L + featDrop);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(232,230,224,0.7)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx + 1 * L, hcy + 2 * L + featDrop);
    ctx.lineTo(cx - 1 * L, hcy + 6 * L + featDrop);
    ctx.lineTo(cx + 1.5 * L, hcy + 6 * L + featDrop);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, hcy + 7 * L + featDrop, 4 * L, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
    ctx.restore();
  }

  /* ---------- timeline ---------- */
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

  function scene(t) {
    ctx.clearRect(0, 0, W, H);

    var doorX = W < 760 ? W * 0.08 : W * 0.26;
    var dw = 150 * S;
    var door = 0, seam = 0, dotsA = 0, doorA = 1;
    var manX = 0, walking = false, phase = 0, arm = "down", lean = 0.06;
    var msc = 1, malpha = 1, blend = 0, bow = 0;
    var showMan = false, showFront = false, frontA = 0, appear = 0, boardFade = 1;
    var frontSX = 1, sideSX = 1, sideFace = 1;

    var bx = Math.min(W - (96 * S * 2 + 24 * S) - 24, doorX + dw + 90 * S);
    if (W < 760) bx = Math.max(doorX + dw + 40 * S, 24);
    var presentX = bx - 62 * S;

    if (t < 2) {
      seam = 0.4 + 0.3 * Math.sin(t * 2.2);
    } else if (t < 4) {
      door = ease((t - 2) / 2);
      arm = "push";
    } else if (t < 7.5) {
      door = 1;
      var wp = ease((t - 3.6) / 3.4);
      showMan = true; walking = true;
      phase = (t - 3.6) * 7.5;
      manX = (doorX + dw / 2) + (presentX - (doorX + dw / 2)) * wp;
      msc = 0.78 + 0.22 * wp;
      malpha = 0.7 + 0.3 * wp;
      if (t < 4.6) arm = "push";
    } else if (t < 8.8) {
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      appear = ease((t - 7.5) / 1.3) * 1.4;
    } else if (t < 11) {
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      appear = Math.min(2.2, 1.4 + (t - 8.8) * 0.25);
    } else if (t < 11.7) {
      /* turn to face the viewer */
      door = 1; showMan = true; showFront = true;
      manX = presentX; arm = "present";
      var k = ease((t - 11) / 0.7);
      frontA = k; malpha = 1 - k;
      appear = 2.2;
    } else if (t < 15) {
      /* front namaste to the viewer; dots revealed */
      door = 1; showFront = true;
      manX = presentX; frontA = 1;
      var n = ease((t - 11.7) / 1.3);
      bow = n; dotsA = ease((t - 11.7) / 1.8);
      appear = 2.2;
    } else if (t < 16.4) {
      /* smooth turn-around: rise from bow, rotate edge-on, open facing door */
      door = 1; dotsA = 1; appear = 2.2;
      var tu = ease((t - 15) / 1.4);
      manX = presentX;
      if (tu < 0.5) {
        var f = ease(tu * 2);
        showFront = true; frontA = 1;
        frontSX = 1 - 0.85 * f; bow = 1 - f;
      } else {
        var s2 = ease((tu - 0.5) * 2);
        showMan = true; malpha = 1;
        arm = "down"; sideSX = 0.15 + 0.85 * s2; sideFace = -1;
      }
    } else if (t < 19.2) {
      /* walk back inside, facing the door */
      door = 1; showMan = true;
      var wp2 = ease((t - 16.4) / 2.8);
      walking = true; phase = (t - 16.4) * 7.5;
      manX = presentX + ((doorX + dw / 2) - presentX) * wp2;
      msc = 1 - 0.22 * wp2; malpha = 1 - 0.5 * wp2;
      arm = "down"; sideFace = -1; dotsA = 1; appear = 2.2;
    } else if (t < 20.6) {
      /* doors close behind him; boards stay on display */
      var cp = (t - 19.2) / 1.4;
      door = 1 - ease(cp);
      showMan = true; walking = false;
      manX = doorX + dw / 2; msc = 0.78;
      malpha = Math.max(0, 0.5 * (1 - cp));
      arm = "down"; sideFace = -1; dotsA = 1; appear = 2.2; boardFade = 1;
    } else if (t < 21.8) {
      /* door itself fades away once he is inside */
      door = 0; doorA = Math.max(0, 1 - (t - 20.2) / 1.2);
      dotsA = 1; appear = 2.2; boardFade = 1;
    } else {
      /* final held frame: boards stay on display */
      door = 0; doorA = 0; dotsA = 1; appear = 2.2; boardFade = 1;
    }

    backdrop(dotsA);

    sline(20, G + 46 * S, W - 20, G + 46 * S, 0.5, 1.6);
    sline(40, G + 54 * S, W - 60, G + 54 * S, 0.25, 1.2);

    ctx.save();
    ctx.globalAlpha = doorA;
    drawDoors(doorX, door, seam);
    ctx.restore();

    var by = G + 46 * S - (2 * 122 * S + 24 * S + 44 * S);
    drawBoards(bx, by, appear, boardFade);

    if (showMan) drawMan(manX, { walk: walking ? phase : null, arm: arm, blend: blend, lean: lean, sc: msc, alpha: malpha, bow: 0, sx: sideSX, face: sideFace });
    if (showMan && malpha > 0.05) contactShadow(manX, G + 5 * S, 52 * S * msc, 0.42 * malpha);
    if (showFront) drawFront(manX, bow, frontA, frontSX);
    if (showFront && frontA > 0.05) contactShadow(manX, G + 5 * S, 58 * S, 0.42 * frontA);
    drawMotes(doorX, door, t);

    /* gentle fade-in only; the ending holds, no loop restart */
    if (t < 0.7) {
      ctx.fillStyle = "rgba(9,10,15," + (1 - t / 0.7).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  resize();
  window.addEventListener("resize", resize);

  var T_END = 22; /* story ends here and holds */

  if (freezeT !== null && !isNaN(freezeT)) { scene(Math.min(freezeT, T_END)); return; }
  if (reduceMotion) { scene(T_END); return; }

  var running = true, inView = true, finished = false;
  if ("IntersectionObserver" in window && hero) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { inView = entry.isIntersecting; });
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  window.addEventListener("resize", function () { if (finished) scene(T_END); });

  var start = performance.now();
  (function loop(now) {
    if (!running || !inView || document.hidden) { requestAnimationFrame(loop); return; }
    var t = ((now || performance.now()) - start) / 1000;
    if (t >= T_END) { scene(T_END); finished = true; return; }
    scene(t);
    requestAnimationFrame(loop);
  })();
})();

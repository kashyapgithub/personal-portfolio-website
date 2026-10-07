/* ============================================================
   Hero Sketch — Master Architectural Pencil Sketch on Canvas.
   A man emerges from a warm lit room through wooden double doors,
   presents 4 wooden art boards with an expressive gesture,
   turns with continuous 3D volumetric kinematics, and greets the visitor
   in a sacred, dignified Indian Namaste bow.
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

  /* ---------- Master Pencil Primitives ---------- */
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

  function scurve(x1, y1, cx, cy, x2, y2, alpha, w, tone) {
    alpha = alpha === undefined ? 0.85 : alpha;
    w = w === undefined ? 1.6 : w;
    tone = tone || "232,230,224";
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(" + tone + "," + (alpha * (p ? 0.45 : 1)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(x1 + j() * 0.9, y1 + j() * 0.9);
      ctx.quadraticCurveTo(cx + j() * 0.9, cy + j() * 0.9, x2 + j() * 0.9, y2 + j() * 0.9);
      ctx.stroke();
    }
  }

  function sbezier(x1, y1, c1x, c1y, c2x, c2y, x2, y2, alpha, w, tone) {
    alpha = alpha === undefined ? 0.85 : alpha;
    w = w === undefined ? 1.6 : w;
    tone = tone || "232,230,224";
    ctx.lineWidth = w;
    ctx.lineCap = "round";
    for (var p = 0; p < 2; p++) {
      ctx.strokeStyle = "rgba(" + tone + "," + (alpha * (p ? 0.45 : 1)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(x1 + j() * 0.9, y1 + j() * 0.9);
      ctx.bezierCurveTo(c1x + j() * 0.9, c1y + j() * 0.9, c2x + j() * 0.9, c2y + j() * 0.9, x2 + j() * 0.9, y2 + j() * 0.9);
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

  /* ---------- Wood Elements ---------- */
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

  /* ---------- Backdrop ---------- */
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

  /* Soft contact shadow grounding an object */
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

  /* ============================================================
     Master-Sketch Anatomical Human Character Rendering Engine
     ============================================================ */

  /* 1. Biomechanical Gait Kinematics (4-phase human walk cycle) */
  function computeGait(phase, L) {
    var sinT = Math.sin(phase);
    var cosT = Math.cos(phase);
    var hipBob = -Math.cos(phase * 2) * 2.8 * L;

    function legK(theta) {
      var s = Math.sin(theta);
      var c = Math.cos(theta);
      var thighA = s * 0.48; // Thigh pendulum swing

      // Knee flexion: deep bend during swing to clear floor, shock-absorption during stance
      var kneeA;
      if (s < 0) {
        kneeA = Math.sin(-s * Math.PI) * 1.15 + 0.08;
      } else {
        kneeA = Math.max(0.06, Math.sin(theta) * 0.22);
      }

      // Ankle & foot rotation (heel-strike, roll, push-off, swing)
      var footA;
      if (s > 0.35 && c > 0) {
        footA = 0.32; // Heel-strike tilted up
      } else if (s > 0.2 && c <= 0) {
        footA = -0.52; // Toe push-off
      } else if (s < 0) {
        footA = -0.10; // Relaxed swing
      } else {
        footA = 0.0; // Flat stance
      }
      return { thighA: thighA, kneeA: kneeA, footA: footA };
    }

    return {
      hipBob: hipBob,
      near: legK(phase),
      far: legK(phase + Math.PI)
    };
  }

  /* 2. Anatomical Leg with Quadriceps, Hamstring, Knee, Calf & Shoe Roll */
  function drawAnatomicalLeg(hipX, hipY, thighA, kneeA, footA, L, isFar, alpha, tone, face) {
    face = face || 1;
    var thighLen = 32 * L, calfLen = 31 * L;
    var kneeX = hipX + Math.sin(thighA) * thighLen * face;
    var kneeY = hipY + Math.cos(thighA) * thighLen;

    var calfA = thighA - kneeA * 0.95;
    var ankleX = kneeX + Math.sin(calfA) * calfLen * face;
    var ankleY = kneeY + Math.cos(calfA) * calfLen;
    if (ankleY > G - 3.5 * L) ankleY = G - 3.5 * L;

    var wMul = isFar ? 0.78 : 1.0;
    var a = alpha * (isFar ? 0.42 : 0.92);

    // Thigh Contours (Quadriceps front, Hamstrings back)
    var tThick = 5.2 * L * wMul;
    var normTX = Math.cos(thighA) * face, normTY = -Math.sin(thighA);

    // Front quadriceps curve
    scurve(
      hipX + normTX * tThick * 1.2, hipY + normTY * tThick * 1.2,
      hipX + (kneeX - hipX) * 0.45 + normTX * (tThick * 1.4), hipY + (kneeY - hipY) * 0.45 + normTY * (tThick * 1.4),
      kneeX + normTX * (tThick * 0.7), kneeY + normTY * (tThick * 0.7),
      a, 1.8 * wMul, tone
    );
    // Back hamstring curve
    scurve(
      hipX - normTX * tThick, hipY - normTY * tThick,
      hipX + (kneeX - hipX) * 0.5 - normTX * (tThick * 0.9), hipY + (kneeY - hipY) * 0.5 - normTY * (tThick * 0.9),
      kneeX - normTX * (tThick * 0.6), kneeY - normTY * (tThick * 0.6),
      a * 0.85, 1.6 * wMul, tone
    );
    // Central trouser crease
    sline(hipX, hipY, kneeX, kneeY, a * 0.35, 1.2 * wMul, tone);

    // Patella joint definition
    scircle(kneeX, kneeY, 2.6 * L * wMul, a * 0.6, tone);

    // Calf & Lower Leg Contours (Gastrocnemius bulge tapering to ankle)
    var normCX = Math.cos(calfA) * face, normCY = -Math.sin(calfA);
    var cThick = 4.6 * L * wMul;

    // Shin contour
    scurve(
      kneeX + normCX * (tThick * 0.6), kneeY + normCY * (tThick * 0.6),
      kneeX + (ankleX - kneeX) * 0.4 + normCX * (cThick * 0.7), kneeY + (ankleY - kneeY) * 0.4 + normCY * (cThick * 0.7),
      ankleX + normCX * (cThick * 0.45), ankleY + normCY * (cThick * 0.45),
      a, 1.8 * wMul, tone
    );
    // Calf muscular contour
    scurve(
      kneeX - normCX * (tThick * 0.5), kneeY - normCY * (tThick * 0.5),
      kneeX + (ankleX - kneeX) * 0.35 - normCX * (cThick * 1.15), kneeY + (ankleY - kneeY) * 0.35 - normCY * (cThick * 1.15),
      ankleX - normCX * (cThick * 0.45), ankleY - normCY * (cThick * 0.45),
      a * 0.85, 1.6 * wMul, tone
    );

    // Trouser gather folds at ankle
    sline(ankleX - normCX * 3.2 * L, ankleY - 2 * L, ankleX + normCX * 3.2 * L, ankleY - 2 * L, a * 0.45, 1.1 * wMul, tone);

    // Articulated Leather Shoe (heel, sole, toe roll)
    var totFootA = calfA + footA * 0.8;
    var fDirX = Math.cos(totFootA) * face, fDirY = Math.sin(totFootA);
    var fUpX = -fDirY * face, fUpY = fDirX;

    var heelX = ankleX - fDirX * 5 * L - fUpX * 3.5 * L;
    var heelY = ankleY - fDirY * 5 * L - fUpY * 3.5 * L;
    var toeX = ankleX + fDirX * 13 * L - fUpX * 3.5 * L;
    var toeY = ankleY + fDirY * 13 * L - fUpY * 3.5 * L;
    var toeTipX = ankleX + fDirX * 16.5 * L - fUpX * 2 * L;
    var toeTipY = ankleY + fDirY * 16.5 * L - fUpX * 2 * L;
    var instepX = ankleX + fDirX * 5 * L + fUpX * 3 * L;
    var instepY = ankleY + fDirY * 5 * L + fUpY * 3 * L;

    // Structured sole
    sline(heelX, heelY, toeX, toeY, a, 2.2 * wMul, tone);
    sline(toeX, toeY, toeTipX, toeTipY, a, 2.0 * wMul, tone);
    // Upper leather contour
    scurve(heelX, heelY, ankleX - fDirX * 4 * L, ankleY + 1 * L, ankleX, ankleY + 1 * L, a * 0.8, 1.4 * wMul, tone);
    scurve(ankleX, ankleY + 1 * L, instepX, instepY, toeTipX, toeTipY, a * 0.9, 1.7 * wMul, tone);
    // Heel block
    sline(heelX, heelY, heelX + fDirX * 4 * L, heelY + fDirY * 4 * L, a * 0.6, 2.2 * wMul, tone);

    return [ankleX, ankleY, toeTipX, toeTipY];
  }

  /* 3. Anatomical Torso with Nehru Kurta, Mandarin Collar, Placket & Fabric Folds */
  function drawAnatomicalTorso(hipX, hipY, shX, shY, bow, breath, L, alpha, tone, face) {
    face = face || 1;
    var a = alpha * 0.95;
    var waistY = hipY - 14 * L;
    var hemY = hipY + 12 * L;

    // Back contour (scapula curve, lumbar lordosis, gluteal curve)
    var backShX = shX - 9 * L * face, backShY = shY + 2 * L;
    var backLumbarX = hipX - 7 * L * face, backLumbarY = waistY;
    var backHipX = hipX - 8.5 * L * face, backHipY = hipY + 4 * L;
    var backHemX = hipX - 9 * L * face, backHemY = hemY;

    sbezier(
      backShX, backShY,
      backShX - 2 * L * face, backShY + 18 * L,
      backLumbarX - 1 * L * face, backLumbarY - 8 * L,
      backLumbarX, backLumbarY,
      a, 2.2, tone
    );
    sbezier(
      backLumbarX, backLumbarY,
      backHipX - 1 * L * face, backHipY - 6 * L,
      backHipX, backHipY,
      backHemX, backHemY,
      a, 2.0, tone
    );

    // Front Chest contour (volumetric pectoral curve, tailored waist, flared hem)
    var frontShX = shX + 8.5 * L * face, frontShY = shY + 3 * L;
    var frontChestX = shX + 11.5 * L * face + breath * 0.8 * L * face, frontChestY = shY + 20 * L;
    var frontWaistX = hipX + 8.5 * L * face, frontWaistY = waistY;
    var frontHemX = hipX + 10 * L * face, frontHemY = hemY;

    scurve(frontShX, frontShY, frontChestX, frontChestY * 0.7 + frontShY * 0.3, frontChestX, frontChestY, a, 2.2, tone);
    sbezier(
      frontChestX, frontChestY,
      frontChestX - 1 * L * face, frontChestY + 12 * L,
      frontWaistX + 1 * L * face, frontWaistY - 6 * L,
      frontWaistX, frontWaistY,
      a, 2.0, tone
    );
    scurve(frontWaistX, frontWaistY, frontWaistX + 0.5 * L * face, frontWaistY + 10 * L, frontHemX, frontHemY, a, 2.0, tone);

    // Jacket bottom hemline
    sline(backHemX, backHemY, frontHemX, frontHemY, a * 0.85, 1.8, tone);

    // Mandarin / Nehru Collar
    var colBackX = shX - 4 * L * face, colBackY = shY - 5 * L;
    var colFrontX = shX + 5 * L * face, colFrontY = shY - 3 * L;
    sline(colBackX, colBackY, colFrontX, colFrontY, a, 2.2, tone);
    sline(colBackX, colBackY - 3.5 * L, colFrontX, colFrontY - 3.5 * L, a * 0.85, 1.8, tone);
    sline(colFrontX, colFrontY - 3.5 * L, colFrontX, colFrontY, a * 0.7, 1.4, tone);

    // Center front placket & buttons
    var plackTopX = colFrontX - 1 * L * face, plackTopY = colFrontY;
    var plackBotX = frontHemX - 2 * L * face, plackBotY = frontHemY;
    sline(plackTopX, plackTopY, plackBotX, plackBotY, a * 0.65, 1.5, tone);

    for (var b = 0; b < 4; b++) {
      var bp = 0.22 + b * 0.18;
      var bx = plackTopX + (plackBotX - plackTopX) * bp;
      var by = plackTopY + (plackBotY - plackTopY) * bp;
      scircle(bx, by, 1.2 * L, a * 0.75, tone);
    }

    // Fabric tension drape creases
    scurve(shX, shY + 14 * L, shX + 4 * L * face, shY + 26 * L, hipX + 1 * L * face, waistY + 4 * L, a * 0.35, 1.1, tone);
    scurve(shX - 3 * L * face, shY + 18 * L, shX + 2 * L * face, shY + 30 * L, hipX - 1 * L * face, waistY + 8 * L, a * 0.25, 1.0, tone);
  }

  /* 4. Articulated Arm & Hand with Deltoid, Biceps, Forearm & Fingers */
  function drawAnatomicalArm(shX, shY, upperA, lowerA, handA, mode, L, isFar, alpha, tone, face) {
    face = face || 1;
    var wMul = isFar ? 0.8 : 1.0;
    var a = alpha * (isFar ? 0.45 : 0.95);

    var upLen = 26 * L, lowLen = 24 * L;
    var elX = shX + Math.sin(upperA) * upLen * face;
    var elY = shY + Math.cos(upperA) * upLen;

    var wrX = elX + Math.sin(upperA + lowerA) * lowLen * face;
    var wrY = elY + Math.cos(upperA + lowerA) * lowLen;

    // Deltoid cap
    scircle(shX, shY, 3.2 * L * wMul, a * 0.6, tone);

    // Upper arm contours
    var normUAX = Math.cos(upperA) * face, normUAY = -Math.sin(upperA);
    var uThick = 3.6 * L * wMul;
    sline(shX + normUAX * uThick, shY + normUAY * uThick, elX + normUAX * (uThick * 0.8), elY + normUAY * (uThick * 0.8), a, 1.6 * wMul, tone);
    sline(shX - normUAX * uThick, shY - normUAY * uThick, elX - normUAX * (uThick * 0.8), elY - normUAY * (uThick * 0.8), a * 0.8, 1.4 * wMul, tone);

    // Elbow olecranon
    scircle(elX, elY, 2.2 * L * wMul, a * 0.5, tone);

    // Forearm contours
    var totForeA = upperA + lowerA;
    var normFAX = Math.cos(totForeA) * face, normFAY = -Math.sin(totForeA);
    var fThick = 3.2 * L * wMul;
    sline(elX + normFAX * fThick, elY + normFAY * fThick, wrX + normFAX * (fThick * 0.6), wrY + normFAY * (fThick * 0.6), a, 1.6 * wMul, tone);
    sline(elX - normFAX * fThick, elY - normFAY * fThick, wrX - normFAX * (fThick * 0.6), wrY - normFAY * (fThick * 0.6), a * 0.8, 1.4 * wMul, tone);

    // Sleeve cuff
    sline(wrX - normFAX * 2.5 * L, wrY - normFAY * 2.5 * L, wrX + normFAX * 2.5 * L, wrY + normFAY * 2.5 * L, a * 0.75, 1.4 * wMul, tone);

    // Expressive Hand Anatomy
    if (mode === "present") {
      var totHandA = totForeA + (handA || 0.15);
      var hDirX = Math.sin(totHandA) * face, hDirY = Math.cos(totHandA);
      var hUpX = -hDirY * face, hUpY = hDirX;
      var palmX = wrX + hDirX * 5 * L, palmY = wrY + hDirY * 5 * L;

      scurve(wrX, wrY, palmX, palmY, palmX + hDirX * 3 * L, palmY + hDirY * 3 * L, a, 1.6 * wMul, tone);

      // Opposing thumb
      var thumbTipX = wrX + hDirX * 4 * L + hUpX * 3.5 * L, thumbTipY = wrY + hDirY * 4 * L + hUpY * 3.5 * L;
      scurve(wrX + hUpX * 1.5 * L, wrY + hUpY * 1.5 * L, thumbTipX - hDirX * 1 * L, thumbTipY - hDirY * 1 * L, thumbTipX, thumbTipY, a * 0.9, 1.4 * wMul, tone);

      // 4 Fanned fingers (index, middle, ring, pinky)
      for (var f = 0; f < 4; f++) {
        var fOffset = (f - 1.5) * 1.4 * L;
        var fLen = (8.5 - Math.abs(f - 1) * 1.1) * L;
        var fStartX = palmX + hUpX * fOffset, fStartY = palmY + hUpY * fOffset;
        var fEndX = fStartX + hDirX * fLen - hUpX * (f * 0.4 * L), fEndY = fStartY + hDirY * fLen - hUpY * (f * 0.4 * L);
        sline(fStartX, fStartY, fEndX, fEndY, a * (0.85 - f * 0.08), 1.2 * wMul, tone);
      }
    } else if (mode === "push") {
      var pX = wrX + 6 * L * face, pY = wrY;
      sline(wrX, wrY - 4 * L, pX, pY - 5 * L, a, 1.6 * wMul, tone);
      sline(wrX, wrY + 4 * L, pX, pY + 3 * L, a, 1.6 * wMul, tone);
      sline(pX, pY - 5 * L, pX, pY + 3 * L, a, 2.0 * wMul, tone);
    } else {
      var rX = wrX + Math.sin(totForeA) * 6 * L * face, rY = wrY + Math.cos(totForeA) * 6 * L;
      scurve(wrX, wrY, (wrX + rX) / 2 + 1.5 * L * face, (wrY + rY) / 2, rX, rY, a * 0.85, 1.5 * wMul, tone);
      scurve(wrX, wrY, (wrX + rX) / 2 - 1.5 * L * face, (wrY + rY) / 2, rX, rY, a * 0.7, 1.2 * wMul, tone);
    }

    return [wrX, wrY];
  }

  /* 5. Refined Anatomical Head with Sculpted Features & Hair Silhouette */
  function drawAnatomicalHead(shX, shY, bow, L, alpha, tone, face) {
    face = face || 1;
    var a = alpha * 0.95;

    var neckBaseX = shX, neckBaseY = shY - 4 * L;
    var hx = shX + (8 + bow * 10) * L * face;
    var hy = shY - 24 * L + bow * 14 * L;

    // Neck with anatomical slope & sternocleidomastoid
    sline(neckBaseX - 3.5 * L * face, neckBaseY, hx - 5 * L * face, hy + 9 * L, a * 0.8, 1.8, tone);
    sline(neckBaseX + 3.5 * L * face, neckBaseY, hx + 4 * L * face, hy + 8 * L, a * 0.85, 1.8, tone);
    sline(hx - 1 * L * face, hy + 7 * L, neckBaseX + 2 * L * face, neckBaseY, a * 0.35, 1.1, tone);

    // Cranium volume
    scircle(hx, hy, 12.5 * L, a * 0.9, tone);

    // Styled modern haircut & sideburns
    ctx.save();
    ctx.strokeStyle = "rgba(" + tone + "," + (a * 0.8).toFixed(3) + ")";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(hx, hy - 1.5 * L, 13 * L, Math.PI * 0.92, Math.PI * 2.05);
    ctx.stroke();
    sbezier(hx - 10 * L * face, hy - 4 * L, hx - 4 * L * face, hy - 13 * L, hx + 5 * L * face, hy - 13 * L, hx + 11 * L * face, hy - 5 * L, a * 0.65, 1.4, tone);
    sline(hx - 12 * L * face, hy - 2 * L, hx - 11 * L * face, hy + 5 * L, a * 0.6, 1.6, tone);
    ctx.restore();

    // Ear with anatomical helix & lobe
    var earX = hx - 4.5 * L * face, earY = hy + 1 * L;
    scurve(earX, earY - 3.5 * L, earX - 2.8 * L * face, earY, earX, earY + 3.5 * L, a * 0.75, 1.4, tone);
    scurve(earX - 1 * L * face, earY - 1.8 * L, earX - 2 * L * face, earY, earX - 0.5 * L * face, earY + 1.8 * L, a * 0.45, 1.1, tone);

    // Jawline & Chin
    var chinX = hx + 10 * L * face, chinY = hy + 10 * L;
    scurve(earX + 1 * L * face, earY + 3.5 * L, hx + 2 * L * face, hy + 10 * L, chinX, chinY, a * 0.85, 1.8, tone);

    // Facial Profile: Brow -> Nose Bridge -> Tip -> Philtrum -> Lips -> Chin
    var browX = hx + 10.5 * L * face, browY = hy - 2 * L;
    var noseBridgeX = hx + 11.5 * L * face, noseBridgeY = hy + 1 * L;
    var noseTipX = hx + 14.5 * L * face, noseTipY = hy + 3.5 * L;
    var nostrilX = hx + 11 * L * face, nostrilY = hy + 5 * L;
    var upperLipX = hx + 11 * L * face, upperLipY = hy + 6.8 * L;
    var lowerLipX = hx + 10.5 * L * face, lowerLipY = hy + 8.2 * L;

    scurve(hx + 8 * L * face, hy - 7 * L, browX, browY - 1 * L, noseBridgeX, noseBridgeY, a * 0.9, 1.6, tone);
    sline(noseBridgeX, noseBridgeY, noseTipX, noseTipY, a * 0.9, 1.6, tone);
    sline(noseTipX, noseTipY, nostrilX, nostrilY, a * 0.85, 1.5, tone);
    scurve(nostrilX, nostrilY, upperLipX + 0.8 * L * face, upperLipY, upperLipX, upperLipY, a * 0.75, 1.3, tone);
    scurve(upperLipX, upperLipY + 0.5 * L, lowerLipX + 0.8 * L * face, lowerLipY, chinX, chinY, a * 0.8, 1.5, tone);

    // Almond Eye & Eyebrow Arch
    var eyeX = hx + 6 * L * face, eyeY = hy - 0.5 * L;
    scurve(eyeX - 2.5 * L * face, eyeY, eyeX, eyeY - 1.8 * L, eyeX + 2.5 * L * face, eyeY, a * 0.85, 1.4, tone);
    scurve(eyeX - 2.5 * L * face, eyeY, eyeX, eyeY + 1.2 * L, eyeX + 2.5 * L * face, eyeY, a * 0.6, 1.2, tone);
    scircle(eyeX + 0.5 * L * face, eyeY - 0.2 * L, 1.1 * L, a * 0.85, tone);
    scurve(eyeX - 3.5 * L * face, eyeY - 4 * L, eyeX, eyeY - 5.5 * L, eyeX + 3.5 * L * face, eyeY - 3.5 * L, a * 0.8, 1.6, tone);
  }

  /* 6. Front-Facing Dignified Namaste Figure */
  function drawFrontNamasteFigure(cx, bow, alpha, sx, breath) {
    var L = S;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, 0);
    ctx.scale(sx || 1, 1);
    ctx.translate(-cx, 0);

    var hipY = G - 62 * L;
    var shY = hipY - 54 * L + bow * 8 * L + breath * 0.4 * L;

    // Structured Leather Shoes with heels and soles
    ctx.fillStyle = "rgba(30,28,26,0.95)";
    for (var sdi = -1; sdi <= 1; sdi += 2) {
      ctx.beginPath();
      ctx.ellipse(cx + sdi * 9.5 * L, G - 2.5 * L, 9.5 * L, 3.6 * L, 0, 0, 6.2832);
      ctx.fill();
      sline(cx + sdi * 9.5 * L - 8 * L, G - 3 * L, cx + sdi * 9.5 * L + 8 * L, G - 3 * L, 0.55, 1.2, "235,200,150");
    }

    // Trousers: outer contour, inner seam, knee joints & ankle gathers
    for (var sd = -1; sd <= 1; sd += 2) {
      scurve(cx + sd * 11.5 * L, hipY, cx + sd * 13 * L, hipY + 30 * L, cx + sd * 10.5 * L, G - 6 * L, 0.9, 2.4);
      scurve(cx + sd * 3 * L, hipY + 8 * L, cx + sd * 5 * L, hipY + 30 * L, cx + sd * 4.5 * L, G - 6 * L, 0.7, 1.8);
      sline(cx + sd * 10.5 * L - 3 * L, G - 30 * L, cx + sd * 10.5 * L + 3 * L, G - 30 * L, 0.45, 1.2);
    }
    sline(cx - 11.5 * L, hipY, cx + 11.5 * L, hipY, 0.8, 2.2);

    // Nehru Kurta Torso: Tailored silhouette, Mandarin collar & placket
    scurve(cx - 17.5 * L, shY, cx - 14 * L, hipY - 10 * L, cx - 13 * L, hipY + 4 * L, 0.9, 2.4);
    scurve(cx + 17.5 * L, shY, cx + 14 * L, hipY - 10 * L, cx + 13 * L, hipY + 4 * L, 0.9, 2.4);
    sline(cx - 13 * L, hipY + 4 * L, cx + 13 * L, hipY + 4 * L, 0.75, 1.8);
    sline(cx - 17.5 * L, shY, cx + 17.5 * L, shY, 0.65, 1.8);

    // Collar V & Placket
    sline(cx - 7 * L, shY + 2 * L, cx, shY + 14 * L, 0.85, 1.8);
    sline(cx + 7 * L, shY + 2 * L, cx, shY + 14 * L, 0.85, 1.8);
    sline(cx, shY + 14 * L, cx, hipY - 2 * L, 0.55, 1.4);
    for (var b = 0; b < 3; b++) {
      scircle(cx, shY + (20 + b * 11) * L, 1.5 * L, 0.85);
    }

    // Sacred Namaste Prayer Arms & Hands
    var P = [cx, shY + 31 * L];
    for (var sa = -1; sa <= 1; sa += 2) {
      var shx = cx + sa * 17.5 * L;
      var E = [cx + sa * 23.5 * L, shY + 24 * L];
      sline(shx, shY + 1 * L, E[0], E[1], 0.9, 2.4);
      sline(shx + sa * 2 * L, shY + 3 * L, E[0] + sa * 2 * L, E[1], 0.35, 1.3);
      sline(E[0], E[1], P[0] + sa * 2 * L, P[1], 0.9, 2.2);
      sline(E[0] - 4 * L, E[1] - 2 * L, E[0] + 4 * L, E[1] + 2 * L, 0.6, 1.6);
    }

    // Anatomical prayer hands pressed at heart center
    sline(P[0] - 5 * L, P[1] - 13 * L, P[0] - 4 * L, P[1] + 8 * L, 0.95, 2.4);
    sline(P[0] + 5 * L, P[1] - 13 * L, P[0] + 4 * L, P[1] + 8 * L, 0.95, 2.4);
    sline(P[0] - 5 * L, P[1] + 8 * L, P[0] + 5 * L, P[1] + 8 * L, 0.8, 2.0);
    for (var f = -1; f <= 1; f++) {
      sline(P[0] + f * 3 * L - 1 * L, P[1] - 12 * L, P[0] + f * 3 * L - 1 * L, P[1] - 1 * L, 0.55, 1.1);
    }
    ctx.strokeStyle = "rgba(232,230,224,0.7)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(P[0] - 6 * L, P[1] - 2 * L, 4 * L, Math.PI * 0.4, Math.PI * 1.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(P[0] + 6 * L, P[1] - 2 * L, 4 * L, Math.PI * 1.9, Math.PI * 2.6);
    ctx.stroke();

    // Neck & Head with respectful bow
    sline(cx - 4.2 * L, shY - 1 * L, cx - 4.2 * L, shY - 9 * L, 0.8, 2.0);
    sline(cx + 4.2 * L, shY - 1 * L, cx + 4.2 * L, shY - 9 * L, 0.8, 2.0);
    var hcy = shY - 24 * L + bow * 22 * L;
    var featDrop = bow * 4.5 * L;
    scircle(cx, hcy, 13 * L, 0.95);

    // Hair cap & sideburns
    ctx.strokeStyle = "rgba(232,230,224,0.8)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, hcy - 2 * L, 13 * L, Math.PI * 1.02, Math.PI * 1.98);
    ctx.stroke();
    sline(cx - 13 * L, hcy - 2 * L, cx - 13 * L, hcy + 6 * L, 0.6, 1.6);
    sline(cx + 13 * L, hcy - 2 * L, cx + 13 * L, hcy + 6 * L, 0.6, 1.6);
    // Ears
    ctx.strokeStyle = "rgba(232,230,224,0.65)";
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(cx - 13 * L, hcy + 1 * L, 2.6 * L, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 13 * L, hcy + 1 * L, 2.6 * L, Math.PI * 1.5, Math.PI * 2.5); ctx.stroke();

    // Serene closed eyes with eyelashes, serene brow, gentle smile
    ctx.strokeStyle = "rgba(232,230,224,0.92)";
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
    // Nose bridge & soft smile
    ctx.strokeStyle = "rgba(232,230,224,0.75)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx + 1 * L, hcy + 2 * L + featDrop);
    ctx.lineTo(cx - 1 * L, hcy + 6 * L + featDrop);
    ctx.lineTo(cx + 1.5 * L, hcy + 6 * L + featDrop);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, hcy + 7.5 * L + featDrop, 4 * L, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();

    ctx.restore();
  }

  /* 7. Master Character Assembly */
  function drawMan(x, o) {
    var L = S * (o.sc || 1);
    var alpha = o.alpha === undefined ? 1 : o.alpha;
    var bow = o.bow || 0;
    var face = o.face || 1;
    var sx = o.sx !== undefined ? o.sx : 1;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, 0);
    ctx.scale(face * sx, 1);
    ctx.translate(-x, 0);

    var breath = Math.sin(performance.now() / 1100) * 1.2;

    // Kinematics calculations
    var gait = o.walk !== null && o.walk !== undefined
      ? computeGait(o.walk, L)
      : { hipBob: breath * 0.6 * L, near: { thighA: 0.05, kneeA: 0.08, footA: 0 }, far: { thighA: -0.05, kneeA: 0.08, footA: 0 } };

    var hipX = x;
    var hipY = G - 62 * L + gait.hipBob;
    var lean = (o.lean || 0.06) + bow * 0.24;
    var shX = x + (6 + lean * 36) * L;
    var shY = hipY - 53 * L + bow * 6 * L;

    // A. Far Leg (rendered in background shadow)
    drawAnatomicalLeg(hipX, hipY, gait.far.thighA, gait.far.kneeA, gait.far.footA, L, true, alpha, "232,230,224", 1);

    // B. Far Arm (rendered behind torso)
    if (o.arm !== "namaste") {
      var farArmA = (o.walk !== null && o.walk !== undefined) ? Math.sin(o.walk) * 0.42 : 0.12;
      var farElbowA = (o.walk !== null && o.walk !== undefined) ? Math.max(0.18, Math.sin(o.walk) * 0.32 + 0.25) : 0.25;
      drawAnatomicalArm(shX, shY, farArmA, farElbowA, 0, "walk", L, true, alpha, "232,230,224", 1);
    }

    // C. Sculpted Torso
    drawAnatomicalTorso(hipX, hipY, shX, shY, bow, breath, L, alpha, "232,230,224", 1);

    // D. Near Leg (foreground)
    drawAnatomicalLeg(hipX, hipY, gait.near.thighA, gait.near.kneeA, gait.near.footA, L, false, alpha, "232,230,224", 1);

    // E. Near Arm (foreground)
    if (o.arm === "present") {
      var pProg = o.presentProg !== undefined ? o.presentProg : 1;
      var uA = 0.25 + 1.10 * pProg; // Unfolds gracefully upwards
      var lA = 0.35 + 1.15 * pProg;
      drawAnatomicalArm(shX, shY, uA, lA, 0.18, "present", L, false, alpha, "232,230,224", 1);
    } else if (o.arm === "push") {
      drawAnatomicalArm(shX, shY, 1.18, 0.35, 0, "push", L, false, alpha, "232,230,224", 1);
    } else {
      var nearArmA = (o.walk !== null && o.walk !== undefined) ? -Math.sin(o.walk) * 0.44 : 0.14;
      var nearElbowA = (o.walk !== null && o.walk !== undefined) ? Math.max(0.18, -Math.sin(o.walk) * 0.32 + 0.25) : 0.28;
      drawAnatomicalArm(shX, shY, nearArmA, nearElbowA, 0, "walk", L, false, alpha, "232,230,224", 1);
    }

    // F. Refined Head
    drawAnatomicalHead(shX, shY, bow, L, alpha, "232,230,224", 1);

    ctx.restore();
  }

  /* ============================================================
     Doors, Easels, Dust Motes & Scene Choreography
     ============================================================ */

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

    // Door Frame
    sline(doorX - 6 * S, top - 6 * S, doorX - 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX + dw + 6 * S, top - 6 * S, doorX + dw + 6 * S, G + 4 * S, 0.9, 3);
    sline(doorX - 10 * S, top - 6 * S, doorX + dw + 10 * S, top - 6 * S, 0.9, 3);
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

  /* Portfolio Artworks on Easel Boards */
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
      for (var sb = 0; sb < 3; sb++) {
        sline(px2 + pw - (10 + sb * 5) * S, py2 + 10 * S, px2 + pw - (10 + sb * 5) * S, py2 + (10 - sb * 2.5) * S, 0.7, 1.4);
      }
    } else {
      sline(x + 6 * S, y + h - 8 * S, x + w * 0.42, y + h * 0.30, 0.85, 1.6);
      sline(x + w * 0.42, y + h * 0.30, x + w * 0.68, y + h - 8 * S, 0.85, 1.6);
      sline(x + w * 0.34, y + h - 8 * S, x + w * 0.62, y + h * 0.48, 0.7, 1.5);
      sline(x + w * 0.62, y + h * 0.48, x + w * 0.86, y + h - 8 * S, 0.7, 1.5);
      scircle(x + w * 0.72, y + h * 0.26, 5 * S, 0.85);
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
      ctx.strokeStyle = "rgba(96,62,32,0.95)";
      ctx.lineWidth = 4 * S;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx + bw * 0.2, cy + bh - 4); ctx.lineTo(cx + bw * 0.08, cy + bh + 44 * S);
      ctx.moveTo(cx + bw * 0.8, cy + bh - 4); ctx.lineTo(cx + bw * 0.92, cy + bh + 44 * S);
      ctx.stroke();
      sline(cx + bw * 0.2, cy + bh - 4, cx + bw * 0.08, cy + bh + 44 * S, 0.5, 1.2, "235,200,150");
      sline(cx + bw * 0.14, cy + bh + 22 * S, cx + bw * 0.86, cy + bh + 22 * S, 0.6, 2.4, "150,100,55");
      woodFrame(cx, cy, bw, rail, tones[i]);
      woodFrame(cx, cy + bh - rail, bw, rail, tones[i]);
      woodFrame(cx, cy, rail, bh, tones[i]);
      woodFrame(cx + bw - rail, cy, rail, bh, tones[i]);
      ctx.fillStyle = "rgba(235,200,150,0.9)";
      var pegs = [[cx + rail / 2, cy + rail / 2], [cx + bw - rail / 2, cy + rail / 2],
                  [cx + rail / 2, cy + bh - rail / 2], [cx + bw - rail / 2, cy + bh - rail / 2]];
      for (var pg = 0; pg < 4; pg++) {
        ctx.beginPath();
        ctx.arc(pegs[pg][0], pegs[pg][1], 1.6 * S, 0, 6.2832);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(13,15,22,0.96)";
      ctx.fillRect(cx + rail, cy + rail, bw - rail * 2, bh - rail * 2);
      miniSketch(i, cx + rail + 4 * S, cy + rail + 4 * S, bw - rail * 2 - 8 * S, bh - rail * 2 - 8 * S, 0.95);
      ctx.restore();
      contactShadow(cx + bw / 2, cy + bh + 44 * S + 5 * S, bw * 1.35, 0.38 * p);
    }
  }

  /* ---------- Timeline Easing & Choreography ---------- */
  function ease(u) { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); }

  function scene(t) {
    ctx.clearRect(0, 0, W, H);

    var doorX = W < 760 ? W * 0.08 : W * 0.26;
    var dw = 150 * S;
    var door = 0, seam = 0, dotsA = 0, doorA = 1;
    var manX = 0, walking = false, phase = 0, arm = "down", lean = 0.06;
    var msc = 1, malpha = 1, bow = 0, presentProg = 0;
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
      // Emergence & purposeful walking forward
      door = 1;
      var wp = ease((t - 3.6) / 3.4);
      showMan = true; walking = true;
      phase = (t - 3.6) * 7.5;
      manX = (doorX + dw / 2) + (presentX - (doorX + dw / 2)) * wp;
      msc = 0.78 + 0.22 * wp;
      malpha = 0.7 + 0.3 * wp;
      arm = (t < 4.8) ? "push" : "walk";
    } else if (t < 8.8) {
      // Arrival at easels, contrapposto settle, graceful arm sweep
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      presentProg = ease((t - 7.5) / 1.3);
      appear = presentProg * 1.4;
    } else if (t < 11) {
      // Presentation hold, calm breathing, artwork fully visible
      door = 1; showMan = true;
      manX = presentX; arm = "present"; lean = 0.10;
      presentProg = 1;
      appear = Math.min(2.2, 1.4 + (t - 8.8) * 0.25);
    } else if (t < 12.0) {
      // Continuous 3D Yaw Rotation from profile to front
      door = 1;
      manX = presentX;
      appear = 2.2;
      var turnP = ease((t - 11) / 1.0);
      if (turnP < 0.5) {
        showMan = true;
        arm = "present";
        presentProg = 1 - turnP;
        sideSX = Math.max(0.18, Math.cos(turnP * Math.PI));
        malpha = 1;
      } else {
        showFront = true;
        frontA = 1;
        frontSX = Math.max(0.18, Math.sin((turnP - 0.5) * Math.PI));
        dotsA = (turnP - 0.5) * 2;
      }
    } else if (t < 15.0) {
      // Front Namaste & Dignified Bow
      door = 1; showFront = true;
      manX = presentX; frontA = 1; frontSX = 1;
      dotsA = 1; appear = 2.2;

      // True dignified bow curve (tilt forward, hold reverent stillness, rise smoothly)
      if (t < 13.3) {
        bow = ease((t - 12.0) / 1.3);
      } else if (t < 14.1) {
        bow = 1.0; // Hold peak bow in quiet respect
      } else {
        bow = 1.0 - ease((t - 14.1) / 0.9); // Rise gracefully
      }
    } else if (t < 16.4) {
      // Turn around: rise from bow, smoothly pivot toward doorway
      door = 1; dotsA = 1; appear = 2.2;
      var tu = ease((t - 15) / 1.4);
      manX = presentX;
      if (tu < 0.5) {
        var f = ease(tu * 2);
        showFront = true; frontA = 1;
        frontSX = Math.max(0.15, 1 - f);
        bow = Math.max(0, (1 - f) * 0.2);
      } else {
        var s2 = ease((tu - 0.5) * 2);
        showMan = true; malpha = 1;
        arm = "walk"; sideSX = Math.max(0.15, s2); sideFace = -1;
      }
    } else if (t < 19.4) {
      // Return walk back to open doors
      door = 1; showMan = true;
      var wp2 = ease((t - 16.4) / 3.0);
      walking = true; phase = (t - 16.4) * 7.5;
      manX = presentX + ((doorX + dw / 2) - presentX) * wp2;
      msc = 1 - 0.22 * wp2; malpha = 1 - 0.55 * wp2;
      arm = "walk"; sideFace = -1; dotsA = 1; appear = 2.2;
    } else if (t < 20.8) {
      // Steps through doorway, silhouette dissolves softly in warm light
      var cp = (t - 19.4) / 1.4;
      door = 1 - ease(cp);
      showMan = true; walking = false;
      manX = doorX + dw / 2; msc = 0.78;
      malpha = Math.max(0, 0.45 * (1 - cp));
      arm = "down"; sideFace = -1; dotsA = 1; appear = 2.2; boardFade = 1;
    } else if (t < 21.8) {
      door = 0; doorA = Math.max(0, 1 - (t - 20.4) / 1.4);
      dotsA = 1; appear = 2.2; boardFade = 1;
    } else {
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

    if (showMan) {
      drawMan(manX, {
        walk: walking ? phase : null,
        arm: arm,
        lean: lean,
        sc: msc,
        alpha: malpha,
        bow: 0,
        sx: sideSX,
        face: sideFace,
        presentProg: presentProg
      });
      if (malpha > 0.05) contactShadow(manX, G + 5 * S, 54 * S * msc, 0.42 * malpha);
    }

    if (showFront) {
      var breath = Math.sin(performance.now() / 1100) * 1.2;
      drawFrontNamasteFigure(manX, bow, frontA, frontSX, breath);
      if (frontA > 0.05) contactShadow(manX, G + 5 * S, 60 * S, 0.42 * frontA);
    }

    drawMotes(doorX, door, t);

    // Initial soft fade in
    if (t < 0.7) {
      ctx.fillStyle = "rgba(9,10,15," + (1 - t / 0.7).toFixed(3) + ")";
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ============================================================
     Forced Smooth Scroll to The Systems & Product Bookshelf
     - Triggers automatically when the human goes inside (t >= 20.8s)
     - Cinematic 1400ms cubic-bezier smooth transition
     - FORCED: captures and prevents wheel, touchmove, touchstart,
       and navigation keys so interruption is impossible ("at any cost").
     - Enforces position on every rAF frame and scroll event.
     - Strictly runs ONE TIME ("scroll one time at any cost").
     ============================================================ */
  var hasTriggeredBookshelfScroll = false;
  var isForcedScrolling = false;

  function triggerForcedBookshelfScroll() {
    if (hasTriggeredBookshelfScroll || isForcedScrolling) return;

    var targetEl = document.getElementById("work") || document.querySelector(".bookshelf-section");
    if (!targetEl) return;

    var headerHeight = 60;
    var startY = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || (document.body ? document.body.scrollTop : 0) || 0;
    var targetRect = targetEl.getBoundingClientRect();
    var targetY = Math.max(0, Math.round(targetRect.top + startY - headerHeight));

    // If already at or past the bookshelf section, mark completed and return
    if (startY >= targetY - 30) {
      hasTriggeredBookshelfScroll = true;
      return;
    }

    hasTriggeredBookshelfScroll = true;
    isForcedScrolling = true;

    var duration = 1400; // ms
    var startTime = null;
    var expectedY = startY;

    // 1. Intercept user attempts to stop or interrupt the scroll
    function blockInterruption(e) {
      if (!isForcedScrolling) return;
      if (e.cancelable) {
        e.preventDefault();
      }
      e.stopImmediatePropagation();
    }

    function blockKeyScroll(e) {
      if (!isForcedScrolling) return;
      var scrollKeys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"];
      if (scrollKeys.indexOf(e.key) !== -1 || e.keyCode === 32 || (e.keyCode >= 33 && e.keyCode <= 40)) {
        if (e.cancelable) {
          e.preventDefault();
        }
        e.stopImmediatePropagation();
      }
    }

    function enforceScrollPosition() {
      if (!isForcedScrolling) return;
      var currentY = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || (document.body ? document.body.scrollTop : 0) || 0;
      if (Math.abs(currentY - expectedY) > 2) {
        window.scrollTo(0, expectedY);
        if (document.documentElement) document.documentElement.scrollTop = expectedY;
        if (document.body) document.body.scrollTop = expectedY;
      }
    }

    // Capture listeners with non-passive flag
    window.addEventListener("wheel", blockInterruption, { passive: false, capture: true });
    window.addEventListener("touchmove", blockInterruption, { passive: false, capture: true });
    window.addEventListener("touchstart", blockInterruption, { passive: false, capture: true });
    window.addEventListener("keydown", blockKeyScroll, { capture: true });
    window.addEventListener("scroll", enforceScrollPosition, { passive: false, capture: true });

    // Temporarily ensure html/body doesn't fight rAF interpolation
    var docEl = document.documentElement;
    var origScrollBehavior = docEl ? docEl.style.scrollBehavior : "";
    if (docEl) docEl.style.scrollBehavior = "auto";

    // Cubic bezier easing (easeInOutCubic)
    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function cleanup() {
      isForcedScrolling = false;
      window.removeEventListener("wheel", blockInterruption, { capture: true });
      window.removeEventListener("touchmove", blockInterruption, { capture: true });
      window.removeEventListener("touchstart", blockInterruption, { capture: true });
      window.removeEventListener("keydown", blockKeyScroll, { capture: true });
      window.removeEventListener("scroll", enforceScrollPosition, { capture: true });
      if (docEl) docEl.style.scrollBehavior = origScrollBehavior;

      // Final precise alignment
      var finalRect = targetEl.getBoundingClientRect();
      var curY = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || (document.body ? document.body.scrollTop : 0) || 0;
      var finalY = Math.max(0, Math.round(finalRect.top + curY - headerHeight));
      window.scrollTo(0, finalY);
    }

    function step(now) {
      if (!startTime) startTime = now;
      var elapsed = now - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = easeInOutCubic(progress);

      // Re-evaluate targetY in case of responsive layout shifts
      var currentScroll = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || (document.body ? document.body.scrollTop : 0) || 0;
      var currentRect = targetEl.getBoundingClientRect();
      var dynamicTargetY = Math.max(0, Math.round(currentRect.top + currentScroll - headerHeight));

      expectedY = Math.round(startY + (dynamicTargetY - startY) * eased);
      window.scrollTo(0, expectedY);
      if (document.documentElement) document.documentElement.scrollTop = expectedY;
      if (document.body) document.body.scrollTop = expectedY;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        cleanup();
      }
    }

    requestAnimationFrame(step);
  }

  // Expose globally for testing and manual triggers
  window.forceScrollToBookshelf = triggerForcedBookshelfScroll;

  resize();
  window.addEventListener("resize", resize);

  var T_END = 22;

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
    if (t >= 20.8 && !hasTriggeredBookshelfScroll) {
      triggerForcedBookshelfScroll();
    }
    if (t >= T_END) {
      scene(T_END);
      finished = true;
      if (!hasTriggeredBookshelfScroll) {
        triggerForcedBookshelfScroll();
      }
      return;
    }
    scene(t);
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   Grok-Inspired 3D Sphere Bot — Interactive Hero Engine
   - 1:1 circular aspect ratio with high-DPI Retina support
   - Sleeping Grok bot: resting in ambient dusk with floating Zzz (0.00s - 1.40s)
   - Overhead follow-spot arrives: sweeps in, strikes on & bot wakes up (1.40s - 2.15s)
   - Dramatic 3D spin: anticipation coil, explosive 3D whirl & physical settle (2.15s - 3.80s)
   - "Visitor detected" thinking effect: neural ripple waves + thought bubble (3.80s - 5.10s)
   - Delighted recognition & speech: hops, smiles, dialogue card emerges from mouth (5.10s+)
   - Real-time mouth lip-sync articulation while speaking
   - Web Speech Synthesis: muted by default with a speaker toggle below
   - Tap bubble to swallow back into mouth; click sphere to hop and speak
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("grok-bot-canvas");
  if (!canvas) return;

  var hero = canvas.closest(".hero") || canvas.parentElement;
  var bubbleEl = document.getElementById("bot-mouth-bubble");
  var bubbleInner = document.getElementById("bubble-inner");
  var soundBtn = document.getElementById("bot-sound-btn");
  var soundLabel = document.getElementById("sound-label");
  var scrollTimerBtn = document.getElementById("hero-scroll-timer");
  var scrollTimerCount = document.getElementById("scroll-timer-count");
  var scrollTimerArc = document.getElementById("scroll-timer-arc");
  var scrollTimerTitle = document.getElementById("scroll-timer-title");

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Screen & Dimensions
  var W = 0, H = 0, DPR = 1;
  var R = 115; // Sphere radius in CSS px
  var cx = 0, targetCy = 0;

  // Cinematic overhead spotlight rig (volumetric beam + hot pool).
  // The lamp itself stays out of frame: animated-film spots emerge
  // from darkness, so only shaft + landing read on screen.
  var beamSprite = null;   // baked volumetric shaft, drawn stretched
  var hotPoolSprite = null;// baked tungsten pool on the floor
  // Spot WATTAGE. One knob for the whole rig: pool brightness and pool
  // spread scale off this, so the light reads as one source instead of
  // tuned-in-isolation layers. Raise it to overdrive the spot; the beam
  // alpha is capped separately at spotBreath so the shaft can't blow out.
  var SPOT_WATTS = 1.6;
  var topKissSprite = null;// baked top-light wash, clipped to the disc
  var reduceSpotMotion = false;
  try {
    reduceSpotMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) { /* ignore */ }

  // ---------------------------------------------------------------
  // PIXAR-LEVEL PRE-RENDERED SPRITES (baked once per resize, zero
  // per-frame gradient allocation — this is the core anti-lag fix:
  // previously 7x createRadialGradient + 5x ellipse fills ran every
  // frame at 60fps, churning GC and CPU raster time)
  // ---------------------------------------------------------------
  var sphereSprite = null;   // porcelain bot body, supersampled 2x
  var poolSprite = null;     // (retired) second floor light — see buildShadowSprites
  var contactSprite = null;  // layered AO contact shadow (the Pixar look)
  var bounceSprite = null;   // warm bounce glow under sphere
  var smoothContact = 1.0;   // temporally smoothed grounding (no popping)
  var sleepProgress = 1.0;   // 1.0 = sleeping in dim light, 0.0 = fully awake in spotlight
  var lastFrameNow = -1;

  function makeCanvas(w, h) {
    var c = document.createElement("canvas");
    c.width = Math.max(2, Math.round(w));
    c.height = Math.max(2, Math.round(h));
    return c;
  }

  // True elliptical radial falloff: scale context so a circular gradient
  // maps to an ellipse — avoids the stretched-gradient banding you get
  // from filling ctx.ellipse() with a circular gradient.
  function paintEllipticalGlow(target, cxp, cyp, radius, aspect, stops) {
    var tctx = target.getContext("2d");
    tctx.save();
    tctx.translate(cxp, cyp);
    tctx.scale(1, aspect);
    var g = tctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    for (var i = 0; i < stops.length; i++) {
      g.addColorStop(stops[i][0], stops[i][1]);
    }
    tctx.fillStyle = g;
    tctx.beginPath();
    tctx.arc(0, 0, radius, 0, Math.PI * 2);
    tctx.fill();
    tctx.restore();
  }

  function ditherSprite(target, count, maxAlpha) {
    try {
      var tctx = target.getContext("2d");
      for (var i = 0; i < count; i++) {
        var x = Math.random() * target.width;
        var y = Math.random() * target.height;
        var a = (Math.random() * maxAlpha).toFixed(3);
        tctx.fillStyle = Math.random() > 0.5
          ? "rgba(255,255,255," + a + ")"
          : "rgba(0,0,0," + a + ")";
        tctx.fillRect(x, y, 1, 1);
      }
    } catch (e) { /* ignore */ }
  }

  function buildShadowSprites() {
    // NOTE: no cool "poolSprite" any more. There is exactly ONE light on
    // this floor: the tungsten spot pool. The old cool ambient pool was a
    // second, competing light that washed the contact shadow out. Removing
    // it means buildShadowSprites() must not run its floor-pool branch —
    // see the draw call in render(): the hot pool paints first, then the
    // bounce, then the contact shadow last.

    // ---- Contact shadow: 4 baked layers, cool blue-black (never pure
    // black, so it reads as a shadow, not a hole), smoothstep falloffs --
    // Dense at the core: under a real spot the occlusion is several
    // stops below the lit floor. The old airy values left the core
    // LIGHTER than the warm pool around it, so the shadow inverted
    // into a grey smudge -- the "whitish shadow" read.
    contactSprite = makeCanvas(512, 160);
    // Layer 1: ultra-wide ambient wash
    paintEllipticalGlow(contactSprite, 256, 80, 250, 0.3125, [
      [0.00, "rgba(10,15,30,0.30)"],
      [0.35, "rgba(10,15,30,0.20)"],
      [0.60, "rgba(10,15,30,0.10)"],
      [0.82, "rgba(10,15,30,0.028)"],
      [1.00, "rgba(10,15,30,0)"]
    ]);
    // Layer 2: symmetric penumbra — overhead key, no directional offset
    paintEllipticalGlow(contactSprite, 256, 80, 172, 0.3125, [
      [0.00, "rgba(7,11,24,0.58)"],
      [0.40, "rgba(7,11,24,0.42)"],
      [0.65, "rgba(7,11,24,0.22)"],
      [0.85, "rgba(7,11,24,0.06)"],
      [1.00, "rgba(7,11,24,0)"]
    ]);
    // Layer 3: tight contact mass
    paintEllipticalGlow(contactSprite, 264, 80, 108, 0.30, [
      [0.00, "rgba(4,7,18,0.85)"],
      [0.45, "rgba(4,7,18,0.68)"],
      [0.70, "rgba(4,7,18,0.38)"],
      [0.88, "rgba(4,7,18,0.10)"],
      [1.00, "rgba(4,7,18,0)"]
    ]);
    // Layer 4: razor AO core (sharp power-curve falloff)
    paintEllipticalGlow(contactSprite, 262, 80, 62, 0.29, [
      [0.00, "rgba(2,4,10,0.96)"],
      [0.55, "rgba(2,4,10,0.82)"],
      [0.78, "rgba(2,4,10,0.42)"],
      [0.92, "rgba(2,4,10,0.10)"],
      [1.00, "rgba(2,4,10,0)"]
    ]);
    // Layer 5: ambient life — an extremely faint cool lift so the core
    // reads as shadowed floor rather than a punched hole. Was 0.10 of
    // near-white at the very center, which is exactly what made the
    // shadow look grey/milky under the pool; 0.028 keeps it alive
    // without competing with the lit floor.
    paintEllipticalGlow(contactSprite, 262, 80, 30, 0.28, [
      [0.00, "rgba(203,213,235,0.028)"],
      [0.60, "rgba(203,213,235,0.012)"],
      [1.00, "rgba(203,213,235,0)"]
    ]);
    ditherSprite(contactSprite, 1400, 0.020);

    // Bounce glow: porcelain light spilling onto the floor. Kept dim —
    // this sits under the sphere on top of the lit floor and used to
    // add a pale wash right where the occlusion should be darkest.
    bounceSprite = makeCanvas(256, 64);
    paintEllipticalGlow(bounceSprite, 128, 32, 124, 0.25, [
      [0.00, "rgba(240,244,255,0.07)"],
      [0.50, "rgba(224,231,255,0.028)"],
      [0.80, "rgba(224,231,255,0.008)"],
      [1.00, "rgba(224,231,255,0)"]
    ]);
  }

  // ---------------------------------------------------------------
  // PROCEDURAL TEXTURE
  // Tileable value-noise fBm. Used to break up the mathematically
  // perfect gradient falloff: real ceramic is never that clean, and
  // the flat banding is most of what makes a CG sphere read as 2D.
  // Everything here runs once per bake, never per frame.
  // ---------------------------------------------------------------
  function hash2(x, y, seed) {
    // Math.imul + >>> throughout: the signed >> in the obvious version
    // leaves the output in [0, 0.5] with a mean of 0.25, and a dark-biased
    // noise under soft-light/overlay visibly darkens the sphere instead of
    // just breaking up its gradient.
    var n = Math.imul(x | 0, 374761393) +
            Math.imul(y | 0, 668265263) +
            Math.imul(seed | 0, 1274126177);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
  }

  function smoothstep01(t) { return t * t * (3 - 2 * t); }

  // Periodic value noise so the tile wraps seamlessly.
  function valueNoise2(x, y, period, seed) {
    var xi = Math.floor(x), yi = Math.floor(y);
    var xf = x - xi, yf = y - yi;
    var wrap = function (v) { return ((v % period) + period) % period; };
    var x0 = wrap(xi), x1 = wrap(xi + 1), y0 = wrap(yi), y1 = wrap(yi + 1);
    var v00 = hash2(x0, y0, seed), v10 = hash2(x1, y0, seed);
    var v01 = hash2(x0, y1, seed), v11 = hash2(x1, y1, seed);
    var u = smoothstep01(xf), v = smoothstep01(yf);
    return (v00 * (1 - u) + v10 * u) * (1 - v) + (v01 * (1 - u) + v11 * u) * v;
  }

  function fbm2(x, y, octaves, period, seed) {
    var sum = 0, amp = 0.5, freq = 1, norm = 0;
    for (var o = 0; o < octaves; o++) {
      sum += amp * valueNoise2(x * freq, y * freq, period, seed + o * 131);
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  }

  // Grayscale noise tile. `lo`/`hi` remap to [0,255].
  function makeNoiseTile(size, octaves, cells, seed, lo, hi) {
    var c = makeCanvas(size, size);
    var cctx = c.getContext("2d");
    var img;
    try { img = cctx.createImageData(size, size); } catch (e) { return null; }
    var d = img.data;
    var span = hi - lo;
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var n = fbm2((x / size) * cells, (y / size) * cells, octaves, cells, seed);
        var g = lo + n * span;
        var i = (y * size + x) * 4;
        d[i] = g; d[i + 1] = g; d[i + 2] = g; d[i + 3] = 255;
      }
    }
    cctx.putImageData(img, 0, 0);
    return c;
  }

  // Directional Fresnel rim: a full bright ring, faded out on the side
  // the key light comes FROM, so the rim survives only opposite the key.
  // This is the single biggest 3D read on a shaded sphere -- without it
  // a lit ball looks like a disc with a gradient on it.
  function paintDirectionalRim(sctx, S, r, kx, ky) {
    var rim = makeCanvas(S, S);
    var rctx = rim.getContext("2d");
    var g = rctx.createRadialGradient(r, r, r * 0.58, r, r, r * 1.02);
    g.addColorStop(0.00, "rgba(255,255,255,0)");
    g.addColorStop(0.52, "rgba(198,220,255,0.08)");
    g.addColorStop(0.84, "rgba(214,232,255,0.30)");
    g.addColorStop(0.95, "rgba(240,248,255,0.58)");
    g.addColorStop(1.00, "rgba(255,255,255,0.10)");
    rctx.fillStyle = g;
    rctx.fillRect(0, 0, S, S);

    // keep only the hemisphere away from the key
    rctx.globalCompositeOperation = "destination-in";
    var dx = (kx - r) / r, dy = (ky - r) / r;   // unit vector TOWARD the key
    var mx = r - dx * r, my = r - dy * r;      // so "toward far side" is -
    var mg = rctx.createLinearGradient(mx, my, mx + dx * r, my + dy * r);
    mg.addColorStop(0.00, "rgba(0,0,0,1)");
    mg.addColorStop(0.55, "rgba(0,0,0,0.45)");
    mg.addColorStop(1.00, "rgba(0,0,0,0)");
    rctx.fillStyle = mg;
    rctx.fillRect(0, 0, S, S);

    sctx.drawImage(rim, 0, 0);
  }

  function buildSphereSprite() {
    var SS = 2; // supersample for crisp limb edge
    var S = Math.ceil(R * 2 * SS);
    sphereSprite = makeCanvas(S, S);
    var sctx = sphereSprite.getContext("2d");
    var r = S / 2;
    var kkx = r * 1.0, kky = r * 0.52; // overhead spot: key straight from the top

    // Pixar-style base: hero props stay bright. Limb falls to a light
    // cool gray, never to dark slate -- dark limbs are what made the old
    // ball read as a dirty gray disc instead of a lit white sphere.
    var base = sctx.createRadialGradient(kkx, kky, r * 0.02, r, r, r * 1.02);
    base.addColorStop(0.00, "#ffffff");
    base.addColorStop(0.18, "#fefaf4");
    base.addColorStop(0.36, "#f4eee6");
    base.addColorStop(0.52, "#e2e8f1");
    base.addColorStop(0.66, "#b9c4d6");
    base.addColorStop(0.78, "#93a1b8");
    base.addColorStop(0.88, "#7d8aa0");
    base.addColorStop(0.95, "#6e7b90");
    base.addColorStop(1.00, "#626e82");
    sctx.fillStyle = base;
    sctx.beginPath();
    sctx.arc(r, r, r - 0.5, 0, Math.PI * 2);
    sctx.fill();

    // Clip everything else to the disc
    sctx.save();
    sctx.beginPath();
    sctx.arc(r, r, r - 0.5, 0, Math.PI * 2);
    sctx.clip();

    // --- PIXAR MICRO-SURFACE: one ultra-subtle pass ------------------
    // Pixar hero spheres are clean. Detail lives in the light response
    // (normal variation), not in dark albedo blotches. A single fine
    // grain at 0.08 alpha breaks the CG-perfect gradient just enough to
    // kill banding, without reading as sand, dirt, or scratches.
    var grain = makeNoiseTile(192, 2, 64, 4711, 96, 160);
    if (grain) {
      sctx.save();
      sctx.globalCompositeOperation = "overlay";
      sctx.globalAlpha = 0.08;
      var pat = sctx.createPattern(grain, "repeat");
      if (pat) {
        sctx.fillStyle = pat;
        sctx.fillRect(0, 0, S, S);
      }
      sctx.restore();
    }

    // Soft key specular: large softbox, slightly elliptical (wider than
    // tall, like a studio window). Pixar highlights are shaped area
    // lights, not circular blobs.
    sctx.save();
    sctx.translate(r * 1.0, r * 0.55);
    sctx.scale(1.25, 0.9);
    var spec = sctx.createRadialGradient(0, 0, 0, 0, 0, r * 0.30);
    spec.addColorStop(0.00, "rgba(255,255,255,0.9)");
    spec.addColorStop(0.45, "rgba(255,255,255,0.28)");
    spec.addColorStop(1.00, "rgba(255,255,255,0)");
    sctx.fillStyle = spec;
    sctx.beginPath();
    sctx.arc(0, 0, r * 0.30, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();

    // Tight specular core — the second lobe. A single lobe reads as a
    // painted highlight; two (broad + tight) is what a real curved
    // surface does, and it is what sells the curvature.
    var spec2 = sctx.createRadialGradient(r * 1.0, r * 0.55, 0, r * 1.0, r * 0.55, r * 0.115);
    spec2.addColorStop(0.00, "rgba(255,255,255,0.95)");
    spec2.addColorStop(0.40, "rgba(255,255,255,0.40)");
    spec2.addColorStop(1.00, "rgba(255,255,255,0)");
    sctx.fillStyle = spec2;
    sctx.fillRect(0, 0, S, S);

    // Faint cool bounce off the dark stage floor
    var fill = sctx.createRadialGradient(r * 1.0, r * 1.55, 0, r * 1.0, r * 1.55, r * 1.10);
    fill.addColorStop(0.00, "rgba(165,180,252,0.12)");
    fill.addColorStop(1.00, "rgba(165,180,252,0)");
    sctx.fillStyle = fill;
    sctx.fillRect(0, 0, S, S);

    // Directional Fresnel rim (see paintDirectionalRim) — drawn after
    // the fill so the dark side gets a lit edge instead of dying flat.
    paintDirectionalRim(sctx, S, r, kkx, kky);

    // Subsurface terminator band: warm peach ring where light turns
    // the corner, before the shadow. This is the Pixar porcelain cue --
    // light scattering through the material, not a dark gray gradient.
    var sssBand = sctx.createRadialGradient(kkx, kky, r * 0.42, r, r, r * 0.98);
    sssBand.addColorStop(0.00, "rgba(255,205,175,0)");
    sssBand.addColorStop(0.55, "rgba(255,199,168,0.20)");
    sssBand.addColorStop(0.80, "rgba(244,186,158,0.26)");
    sssBand.addColorStop(1.00, "rgba(244,186,158,0)");
    sctx.fillStyle = sssBand;
    sctx.fillRect(0, 0, S, S);

    // Grounded bottom AO crescent, kept light. Pixar grounds with a soft
    // contact shadow on the floor (already a separate sprite), not by
    // crushing the sphere's own belly to dark gray.
    var ao = sctx.createLinearGradient(0, r * 1.30, 0, r * 2.0);
    ao.addColorStop(0.00, "rgba(30,41,59,0)");
    ao.addColorStop(0.60, "rgba(30,41,59,0.14)");
    ao.addColorStop(1.00, "rgba(30,41,59,0.30)");
    sctx.fillStyle = ao;
    sctx.fillRect(0, 0, S, S);

    // Faint warm floor bounce kissing the bottom edge
    var wb = sctx.createRadialGradient(r, r * 2.02, 0, r, r * 2.02, r * 0.85);
    wb.addColorStop(0.00, "rgba(226,232,240,0.20)");
    wb.addColorStop(1.00, "rgba(226,232,240,0)");
    sctx.fillStyle = wb;
    sctx.fillRect(0, 0, S, S);

    sctx.restore();

    // Fresnel limb: soft inner sheen, seamless full-circle base plus a
    // brighter top-left key catchlight. Arcs deliberately overlap so no
    // seam step shows at the joints (the old 1px sticker outline bug).
    sctx.save();
    sctx.beginPath();
    sctx.arc(r, r, r - 1.5, 0, Math.PI * 2);
    sctx.strokeStyle = "rgba(226,232,240,0.16)";
    sctx.lineWidth = Math.max(1.5, r * 0.014);
    sctx.stroke();
    sctx.beginPath();
    sctx.arc(r, r, r - 1.5, -Math.PI * 1.02, Math.PI * 0.52);
    sctx.strokeStyle = "rgba(255,255,255,0.38)";
    sctx.lineWidth = Math.max(1, r * 0.009);
    sctx.lineCap = "round";
    sctx.stroke();
    sctx.beginPath();
    sctx.arc(r, r, r - 1.5, Math.PI * 0.42, Math.PI * 0.92);
    sctx.strokeStyle = "rgba(148,163,184,0.22)";
    sctx.lineWidth = Math.max(1, r * 0.008);
    sctx.lineCap = "round";
    sctx.stroke();
    sctx.restore();
  }

  // ===============================================================
  // FLOATING "Zzz" SLEEP SNOOZE PARTICLES
  // Gentle stylized snoozes drifting up while the Grok bot sleeps.
  // Dissolves seamlessly as the spotlight strikes and he wakes up.
  // ===============================================================
  function renderZzz(cx, currentCy, elapsedSec, sleepProg) {
    if (sleepProg <= 0.01) return;

    var startX = cx + R * 0.44;
    var startY = currentCy - R * 0.55;

    for (var i = 0; i < 3; i++) {
      var zPeriod = 2.2;
      var zTime = (elapsedSec + i * 0.72) % zPeriod;
      var p = zTime / zPeriod; // 0 to 1 lifetime

      var driftY = startY - p * (R * 0.85) - (i * 10);
      var driftX = startX + Math.sin(p * Math.PI * 2.2 + i * 1.5) * (R * 0.14) + p * (R * 0.38);

      var lifeAlpha = Math.sin(p * Math.PI);
      var alpha = lifeAlpha * sleepProg * 0.88;
      if (alpha <= 0.01) continue;

      var zSize = Math.round(R * (0.13 + i * 0.045));

      ctx.save();
      ctx.font = "bold " + zSize + "px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.shadowColor = "rgba(165, 180, 252, " + (alpha * 0.80).toFixed(3) + ")";
      ctx.shadowBlur = 8;

      ctx.fillStyle = "rgba(224, 231, 255, " + alpha.toFixed(3) + ")";
      ctx.fillText(i === 2 ? "Z" : "z", driftX, driftY);
      ctx.restore();
    }
  }

  // Baked once per resize: narrow shaft with bright core + fast falloff,
  // plus the tungsten floor pool. Per-frame cost = 2 drawImages.
  function buildSpotSprites() {
    // ---- Beam shaft: trapezoid, hot at the lamp, breathing out toward
    // the floor. Side edges feathered via destination-in. ----
    var BW = 512, BH = 1024;
    beamSprite = makeCanvas(BW, BH);
    var bctx = beamSprite.getContext("2d");
    if (bctx) {
      var topW = 64, botW = 300;
      bctx.beginPath();
      bctx.moveTo(BW / 2 - topW / 2, 0);
      bctx.lineTo(BW / 2 + topW / 2, 0);
      bctx.lineTo(BW / 2 + botW / 2, BH);
      bctx.lineTo(BW / 2 - botW / 2, BH);
      bctx.closePath();
      var shaft = bctx.createLinearGradient(0, 0, 0, BH);
      shaft.addColorStop(0.00, "rgba(255,242,218,0.92)");
      shaft.addColorStop(0.30, "rgba(255,234,196,0.46)");
      shaft.addColorStop(0.65, "rgba(255,226,180,0.17)");
      shaft.addColorStop(1.00, "rgba(255,220,172,0.05)");
      bctx.fillStyle = shaft;
      bctx.fill();
      // Hot core: narrower, brighter spine of the shaft
      bctx.save();
      bctx.globalCompositeOperation = "lighter";
      bctx.beginPath();
      bctx.moveTo(BW / 2 - topW * 0.28, 0);
      bctx.lineTo(BW / 2 + topW * 0.28, 0);
      bctx.lineTo(BW / 2 + botW * 0.30, BH);
      bctx.lineTo(BW / 2 - botW * 0.30, BH);
      bctx.closePath();
      var core = bctx.createLinearGradient(0, 0, 0, BH);
      core.addColorStop(0.00, "rgba(255,248,228,0.60)");
      core.addColorStop(0.55, "rgba(255,240,204,0.15)");
      core.addColorStop(1.00, "rgba(255,240,204,0)");
      bctx.fillStyle = core;
      bctx.fill();
      bctx.restore();
      // Feather the side edges
      bctx.save();
      bctx.globalCompositeOperation = "destination-in";
      var edge = bctx.createLinearGradient(0, 0, BW, 0);
      edge.addColorStop(0.00, "rgba(0,0,0,0)");
      edge.addColorStop(0.28, "rgba(0,0,0,1)");
      edge.addColorStop(0.72, "rgba(0,0,0,1)");
      edge.addColorStop(1.00, "rgba(0,0,0,0)");
      bctx.fillStyle = edge;
      bctx.fillRect(0, 0, BW, BH);
      bctx.restore();
    }
    // ---- Hot tungsten pool for the floor: the ONE light source down
    // here. Small and bright so it reads as the spot's landing, with the
    // contact shadow visibly darker than the lit floor around it. The
    // previous version was wide and faint, so the shadow had nothing to
    // read against and picked up its colour from it instead. ----
    hotPoolSprite = makeCanvas(512, 128);
    paintEllipticalGlow(hotPoolSprite, 256, 64, 250, 0.25, [
      [0.00, "rgba(255,214,158,0.92)"],
      [0.25, "rgba(255,206,146,0.62)"],
      [0.45, "rgba(255,198,136,0.30)"],
      [0.65, "rgba(255,190,128,0.10)"],
      [0.82, "rgba(255,186,124,0.028)"],
      [1.00, "rgba(255,186,124,0)"]
    ]);
    // ---- Top-light kiss: soft overhead wash, clipped to the disc at
    // draw time so the face (painted after) stays clean ----
    topKissSprite = makeCanvas(256, 256);
    var kctx = topKissSprite.getContext("2d");
    if (kctx) {
      var kiss = kctx.createRadialGradient(128, 84, 8, 128, 128, 150);
      kiss.addColorStop(0.00, "rgba(255,246,226,0.92)");
      kiss.addColorStop(0.45, "rgba(255,238,208,0.38)");
      kiss.addColorStop(1.00, "rgba(255,236,204,0)");
      kctx.fillStyle = kiss;
      kctx.fillRect(0, 0, 256, 256);
    }
  }

  // Debounced sprite re-bake. resize() itself must stay synchronous (the
  // canvas backing store and R have to track the viewport immediately,
  // or the sphere draws at a stale size), but the expensive part -- the
  // noise tiles and the gradient stack -- is deferred until the drag
  // settles. The sprite is square and drawn to R*2, so a brief size
  // mismatch just scales it; nothing visibly pops.
  var rebakeTimer = 0;
  var bakedR = 0;
  function scheduleRebake() {
    resize();
    if (bakedR === R) return;
    if (rebakeTimer) clearTimeout(rebakeTimer);
    rebakeTimer = setTimeout(function () {
      rebakeTimer = 0;
      bakedR = R;
      buildShadowSprites();
      buildSphereSprite();
      buildSpotSprites();
    }, 140);
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = hero ? hero.clientWidth : window.innerWidth;
    H = hero ? hero.clientHeight : (window.innerHeight - 70);

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Responsive sphere radius
    if (W < 640) {
      R = Math.max(68, Math.min(84, W * 0.21));
    } else if (W < 1024) {
      R = Math.max(95, Math.min(115, W * 0.16));
    } else {
      R = Math.max(110, Math.min(130, W * 0.12));
    }

    cx = Math.round(W * 0.5);

    // Vertical positioning with ample space for mouth bubble
    var headerH = W < 640 ? 56 : 70;
    var dockH = 65;
    var availableH = Math.max(260, H - headerH - dockH);
    targetCy = Math.round(headerH + availableH * 0.38);
    if (curY === 0 || curY === -180) {
      curY = targetCy;
    }

    // Re-bake supersampled sprites for the new radius.
    // Deferred by scheduleRebake() -- see the note there. During a drag
    // the previous sprite is reused; it is square and drawn at R*2, so a
    // radius change just scales it until the timer lands.
    smoothContact = 1.0;
    lastFrameNow = -1;
  }

  // Check for test/debug timestamp override
  var debugTime = null;
  try {
    var q = new URLSearchParams(window.location.search).get("botTime");
    if (q !== null && q !== "") debugTime = parseFloat(q);
  } catch (err) { /* ignore */ }

  // 3D Orientation & States
  var yaw = 0;
  var pitch = 0;
  var roll = 0;

  var targetYaw = 0;
  var targetPitch = 0;

  var curY = 0;
  var scaleX = 1;
  var scaleY = 1;

  var blink = 0;
  var eyeWiden = 1.0;
  var smileProgress = 0;
  var hopY = 0;

  var phase = "entrance"; // entrance -> spotlight -> spinning -> thinking -> smile -> active
  var lastBlinkTime = 0;
  var nextBlinkInterval = 4.2;

  // Mouth coordinates in screen pixels
  var screenMouthX = 0;
  var screenMouthY = 0;

  // Speech Bubble State Machine & Auto-Scroll Flow State
  var bubbleState = "hidden"; // 'hidden' | 'thinking' | 'closing_thinking' | 'speaking' | 'closing_dialogue'
  var speechFlowState = "idle"; // 'idle' | 'speaking' | 'holding' | 'closed'
  var holdTimer = null;
  var isMuted = true; // By default kept in mute per user instructions
  var botAudio = null;
  var speechUtterance = null;
  var availableVoice = null;
  var speechTriggered = false;

  // =============================================================
  // CUTE HIGH-DEFINITION MALE VOICE SYNTHESIS & ACOUSTIC ENGINE
  // =============================================================
  function pickCuteMaleVoice() {
    if (!("speechSynthesis" in window)) return null;
    var voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;

    var english = voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().startsWith("en");
    });
    if (!english.length) english = voices;

    var maleNames = [
      "guy", "ryan", "daniel", "arthur", "oliver", "george",
      "andrew", "brian", "alex", "david", "mark", "male", "james", "aaron", "fred"
    ];
    var femaleFilter = ["female", "zira", "susan", "samantha", "victoria", "karen", "catherine", "hazel", "jenny", "aria", "ava", "emma", "sonia", "lisa"];

    // 1. Prioritize High-Definition / Natural / Online Male voices
    var cuteMale = english.find(function (v) {
      var n = v.name.toLowerCase();
      var hasMale = maleNames.some(function (k) { return n.includes(k); });
      var isFemale = femaleFilter.some(function (f) { return n.includes(f); });
      return hasMale && !isFemale && (n.includes("natural") || n.includes("online") || n.includes("google") || n.includes("premium") || n.includes("daniel"));
    });

    // 2. Any English male voice
    if (!cuteMale) {
      cuteMale = english.find(function (v) {
        var n = v.name.toLowerCase();
        var hasMale = maleNames.some(function (k) { return n.includes(k); });
        var isFemale = femaleFilter.some(function (f) { return n.includes(f); });
        return hasMale && !isFemale;
      });
    }

    // 3. Fallback to any voice that is not explicitly female
    if (!cuteMale) {
      cuteMale = english.find(function (v) {
        var n = v.name.toLowerCase();
        return !femaleFilter.some(function (f) { return n.includes(f); });
      });
    }

    return cuteMale || english[0];
  }

  function playCuteChirp() {
    if (isMuted) return;
    try {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      var actx = new AudioCtx();
      var osc = actx.createOscillator();
      var gain = actx.createGain();
      osc.type = "sine";
      var now = actx.currentTime;
      // High-definition cute 2-tone harmonic chime (D5 -> A5)
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(now);
      osc.stop(now + 0.30);
    } catch (e) { /* ignore */ }
  }

  function initSpeech() {
    if (!("speechSynthesis" in window)) return;
    function updateVoices() {
      availableVoice = pickCuteMaleVoice();
    }
    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  function speakGreeting() {
    if (isMuted) return;
    try {
      playCuteChirp();

      if (botAudio) {
        botAudio.pause();
        botAudio = null;
      }

      var audio = new Audio("assets/audio/bot-greeting.mp3");
      audio.volume = 1.0;
      botAudio = audio;

      audio.onended = function () {
        botAudio = null;
        markFinishedSaying();
      };
      audio.onerror = function () {
        fallbackSpeechSynthesis();
      };

      var p = audio.play();
      if (p !== undefined) {
        p.catch(function () {
          fallbackSpeechSynthesis();
        });
      }
    } catch (e) {
      fallbackSpeechSynthesis();
    }
  }

  function fallbackSpeechSynthesis() {
    if (isMuted || !("speechSynthesis" in window)) {
      markFinishedSaying();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      var text = "In a world that never stops rushing, thank you for taking a moment to pause here.";
      speechUtterance = new SpeechSynthesisUtterance(text);
      if (!availableVoice) availableVoice = pickCuteMaleVoice();
      if (availableVoice) speechUtterance.voice = availableVoice;

      speechUtterance.pitch = 1.12;
      speechUtterance.rate = 1.0;
      speechUtterance.volume = 1.0;

      speechUtterance.onend = function () {
        markFinishedSaying();
      };
      speechUtterance.onerror = function () {
        markFinishedSaying();
      };

      window.speechSynthesis.speak(speechUtterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
      markFinishedSaying();
    }
  }

  initSpeech();

  // Speaker button listener
  if (soundBtn) {
    var iconMuted = soundBtn.querySelector(".icon-speaker-muted");
    var iconOn = soundBtn.querySelector(".icon-speaker-on");

    soundBtn.addEventListener("click", function () {
      isMuted = !isMuted;
      if (isMuted) {
        soundBtn.classList.remove("is-active");
        soundBtn.setAttribute("aria-label", "Enable bot voice (currently muted)");
        soundBtn.setAttribute("title", "Enable bot voice");
        if (iconMuted) iconMuted.style.display = "block";
        if (iconOn) iconOn.style.display = "none";
        if (soundLabel) soundLabel.textContent = "Unmute Voice";
        if (botAudio) {
          botAudio.pause();
          botAudio.currentTime = 0;
          botAudio = null;
        }
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      } else {
        soundBtn.classList.add("is-active");
        soundBtn.setAttribute("aria-label", "Mute bot voice");
        soundBtn.setAttribute("title", "Mute bot voice");
        if (iconMuted) iconMuted.style.display = "none";
        if (iconOn) iconOn.style.display = "block";
        if (soundLabel) soundLabel.textContent = "Mute Voice";

        if (holdTimer) clearTimeout(holdTimer);
        speechFlowState = "speaking";
        scrollDeadline = -2; // audio length unknown until it ends
        lastShownSec = -1;
        openSpeechBubble();
        speakGreeting();
      }
    });
  }

  // =============================================================
  // SPEECH & THOUGHT BUBBLE CONTROLS
  // =============================================================
  function showThinkingBubble() {
    if (!bubbleEl || bubbleState === "thinking") return;
    bubbleState = "thinking";
    bubbleEl.className = "bot-mouth-bubble is-open is-thinking";
    if (bubbleInner) {
      bubbleInner.innerHTML =
        '<div class="thinking-text">' +
        '<span>Visitor detected</span>' +
        '</div>';
    }
  }

  function retractThinkingBubble() {
    if (!bubbleEl || bubbleState !== "thinking") return;
    bubbleState = "closing_thinking";
    bubbleEl.className = "bot-mouth-bubble is-closing is-thinking";
  }

  function openSpeechBubble() {
    if (!bubbleEl) return;
    bubbleState = "speaking";
    speechFlowState = "speaking";
    bubbleEl.className = "bot-mouth-bubble is-open is-speaking";
    if (bubbleInner) {
      // Texts appear at once with warm typography
      bubbleInner.innerHTML =
        '<p class="bubble-speech-text"><span class="bubble-speech-quote">&ldquo;</span>In a world that never stops rushing, thank you for taking a moment to pause here.<span class="bubble-speech-quote">&rdquo;</span></p>';
    }
  }

  function retractSpeechBubble() {
    if (!bubbleEl) return;
    bubbleState = "closing_dialogue";
    bubbleEl.className = "bot-mouth-bubble is-closing";
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  function markFinishedSaying() {
    if (speechFlowState !== "speaking") return;
    speechFlowState = "holding";

    // Pin the timer to the exact moment the forced scroll will fire
    // (2000ms hold + 240ms bubble-retract).
    scrollDeadline = performance.now() + 2240;

    // "after it is finished saying it stays there for 2 seconds then the auto scroll"
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = setTimeout(function () {
      if (speechFlowState === "holding") {
        speechFlowState = "closed";
        retractSpeechBubble();
        // Allow 240ms for the dialogue card to retract into the mouth before the forced scroll begins
        setTimeout(function () {
          triggerForcedBookshelfScroll();
        }, 240);
      }
    }, 2000);
  }

  // =============================================================
  // HERO AUTO-SCROLL COUNTDOWN CHIP (bottom corner, hero-pinned)
  // Driven by the REAL scroll schedule, not a fake timer:
  //  - muted path: speech opens ~5.18s, fallback resolves at 9.4s,
  //    scroll fires ~11.64s after load (estimate until corrected)
  //  - corrected to exact fire time inside markFinishedSaying()
  //  - unmuted audio: indeterminate ("playing") until audio ends
  // Updates are throttled (text ~4Hz, ring ~10Hz) so the chip adds
  // zero measurable cost to the 60fps bot loop.
  // =============================================================
  var SCROLL_TOTAL_MS = 11640;
  var RING_CIRC = 72.26;
  var scrollDeadline = -1; // performance.now() ms of scroll fire; -2 = indeterminate
  var lastShownSec = -1;
  var lastRingUpdate = 0;
  var timerHidden = false;

  function setTimerHidden(hidden) {
    if (timerHidden === hidden) return;
    timerHidden = hidden;
    if (scrollTimerBtn) {
      scrollTimerBtn.classList.toggle("is-hidden", hidden);
    }
  }

  function updateScrollTimer(nowMs) {
    if (!scrollTimerBtn) return;
    // Frozen-time test mode: the choreography never advances, so hide.
    if (debugTime !== null) { setTimerHidden(true); return; }
    if (hasTriggeredBookshelfScroll || isForcedScrolling) { setTimerHidden(true); return; }
    if (scrollDeadline === -2) {
      // Unmuted audio playing, length unknown: show breathing state.
      if (lastShownSec !== -2) {
        lastShownSec = -2;
        if (scrollTimerCount) scrollTimerCount.textContent = "♪";
        if (scrollTimerTitle) scrollTimerTitle.textContent = "Playing…";
        if (scrollTimerArc) scrollTimerArc.style.strokeDashoffset = "0";
        scrollTimerBtn.setAttribute("aria-label", "Greeting is playing. Activate to scroll to works now.");
      }
      setTimerHidden(false);
      return;
    }
    if (scrollDeadline < 0) {
      // Initial estimate anchored to the render-loop clock.
      scrollDeadline = (typeof startTime === "number" ? startTime : performance.now()) + SCROLL_TOTAL_MS;
    }
    var remaining = Math.max(0, scrollDeadline - nowMs);
    var secs = Math.ceil(remaining / 1000);
    if (secs !== lastShownSec) {
      lastShownSec = secs;
      if (scrollTimerCount) scrollTimerCount.textContent = String(secs);
      if (scrollTimerTitle) scrollTimerTitle.textContent = secs <= 3 ? "Scrolling…" : "Auto-scroll";
      scrollTimerBtn.setAttribute("aria-label", "Auto-scrolling to works in " + secs + " seconds. Activate to scroll now.");
    }
    if (nowMs - lastRingUpdate > 100) {
      lastRingUpdate = nowMs;
      if (scrollTimerArc) {
        var frac = Math.min(1, Math.max(0, remaining / SCROLL_TOTAL_MS));
        scrollTimerArc.style.strokeDashoffset = (RING_CIRC * (1 - frac)).toFixed(2);
      }
    }
    setTimerHidden(false);
  }

  function scrollNowFromTimer() {
    if (hasTriggeredBookshelfScroll || isForcedScrolling) return;
    if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
    if (speechFlowState === "speaking" || speechFlowState === "holding") {
      speechFlowState = "closed";
      retractSpeechBubble();
      setTimerHidden(true);
      setTimeout(triggerForcedBookshelfScroll, 240);
    } else {
      setTimerHidden(true);
      triggerForcedBookshelfScroll();
    }
  }

  if (scrollTimerBtn) {
    scrollTimerBtn.addEventListener("click", scrollNowFromTimer);
  }

  // Keep the chip strictly a hero resident: fade it once the hero
  // scrolls out of view, restore it if the user returns to the top
  // (unless the one-time auto-scroll already fired).
  function syncTimerWithHeroVisibility() {
    if (hasTriggeredBookshelfScroll || (debugTime !== null)) { setTimerHidden(true); return; }
    var heroH = hero ? hero.clientHeight : window.innerHeight;
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    setTimerHidden(y > heroH * 0.55);
  }
  if (hero && ("IntersectionObserver" in window)) {
    new IntersectionObserver(function (entries) {
      for (var oi = 0; oi < entries.length; oi++) {
        var r = entries[oi].boundingClientRect;
        var yNow = window.pageYOffset || document.documentElement.scrollTop || 0;
        var heroHNow = hero ? hero.clientHeight : window.innerHeight;
        if (entries[oi].isIntersecting && entries[oi].intersectionRatio >= 0.35) {
          if (!hasTriggeredBookshelfScroll && yNow <= heroHNow * 0.55) setTimerHidden(false);
        } else if (r.top < 0) {
          setTimerHidden(true);
        }
      }
    }, { threshold: [0, 0.35, 1] }).observe(hero);
  }
  window.addEventListener("scroll", syncTimerWithHeroVisibility, { passive: true });

  /* ============================================================
     Forced Smooth Scroll to The Systems & Product Bookshelf
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

    var headerHeight = 46;
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

  // Mouse / Pointer Eye Contact Tracking
  function onPointerMove(clientX, clientY) {
    if (phase !== "active") return;
    var rect = canvas.getBoundingClientRect();
    var mouseX = clientX - rect.left;
    var mouseY = clientY - rect.top;

    var dx = (mouseX - cx) / (W * 0.5);
    var dy = (mouseY - targetCy) / (H * 0.5);

    targetYaw = Math.max(-0.48, Math.min(0.48, dx * 0.44));
    targetPitch = Math.max(-0.32, Math.min(0.32, dy * 0.28));
  }

  window.addEventListener("mousemove", function (e) {
    onPointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches[0]) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Click Interaction: Playful bounce & speak
  canvas.addEventListener("click", function () {
    if (phase !== "active") return;
    triggerPlayfulHop();
    if (bubbleState === "swallowed" || !bubbleEl.classList.contains("is-open")) {
      openSpeechBubble();
    }
    if (!isMuted) {
      speakGreeting();
    }
  });

  function triggerPlayfulHop() {
    var hopStart = performance.now();
    var duration = 460;
    function animHop(now) {
      var p = (now - hopStart) / duration;
      if (p < 1) {
        hopY = -Math.sin(p * Math.PI) * 12;
        blink = Math.sin(p * Math.PI * 2) > 0.3 ? 0.95 : 0;
        requestAnimationFrame(animHop);
      } else {
        hopY = 0;
        blink = 0;
      }
    }
    requestAnimationFrame(animHop);
  }

  // Feature 3D unit coordinates on sphere
  var EYE_LEFT = { phi: -0.27, theta: 0.035 };
  var EYE_RIGHT = { phi: 0.27, theta: 0.035 };
  var MOUTH_CENTER = { phi: 0.0, theta: -0.22 };

  function sphericalTo3D(phi, theta) {
    var cosT = Math.cos(theta);
    return {
      x: cosT * Math.sin(phi),
      y: -Math.sin(theta),
      z: cosT * Math.cos(phi)
    };
  }

  function rotate3D(p, curYaw, curPitch, curRoll) {
    // 1. Pitch around X
    var cosP = Math.cos(curPitch), sinP = Math.sin(curPitch);
    var y1 = p.y * cosP - p.z * sinP;
    var z1 = p.y * sinP + p.z * cosP;
    var x1 = p.x;

    // 2. Yaw around Y
    var cosY = Math.cos(curYaw), sinY = Math.sin(curYaw);
    var x2 = x1 * cosY + z1 * sinY;
    var z2 = -x1 * sinY + z1 * cosY;
    var y2 = y1;

    // 3. Roll around Z
    var cosR = Math.cos(curRoll), sinR = Math.sin(curRoll);
    var x3 = x2 * cosR - y2 * sinR;
    var y3 = x2 * sinR + y2 * cosR;
    var z3 = z2;

    return { x: x3, y: y3, z: z3 };
  }

  // =============================================================
  // MAIN RENDER LOOP & TIMELINE
  // =============================================================
  var startTime = performance.now();

  function render(now) {
    var nowMs = (typeof now === "number") ? now : performance.now();
    var elapsedSec = (debugTime !== null) ? debugTime : (nowMs - startTime) / 1000;

    // -------------------------------------------------------------
    // 1. TIMELINE & CHOREOGRAPHY
    // -------------------------------------------------------------

    // --- PHASE 1: CUTE GROK BOT SLEEPING WITH ZZZ (0.00s - 1.40s) ---
    // Peaceful atmospheric rest in ambient dusk with floating Zzz before spotlight arrives
    if (elapsedSec < 1.40) {
      phase = "sleeping";
      curY = targetCy;
      sleepProgress = 1.0;

      // Gentle rhythmic sleeping breathing motion
      var sleepBreath = Math.sin(elapsedSec * 2.8);
      hopY = sleepBreath * 2.2;
      scaleY = 1.0 + sleepBreath * 0.024;
      scaleX = 1.0 - sleepBreath * 0.020;

      // Peaceful cute sleeping head tilt & forward nod
      roll = 0.075 + Math.sin(elapsedSec * 1.4) * 0.015;
      pitch = 0.050 + sleepBreath * 0.018;
      yaw = 0.020;

      // Eyelids peacefully closed
      blink = 1.0;
      eyeWiden = 1.0;
      smileProgress = 0;
    }
    // --- PHASE 2: SPOTLIGHT ARRIVES & GROK BOT WAKES UP (1.40s - 2.15s) ---
    // Overhead spotlight sweeps in, strikes lamp, and warms bot awake as Zzz dissolves
    else if (elapsedSec < 2.15) {
      phase = "awakening";
      curY = targetCy;

      var tWake = elapsedSec - 1.40; // 0 to 0.75s
      var wakeProg = Math.min(1, tWake / 0.75);

      // Floating Zzz snoozes dissolve smoothly as overhead beam strikes him
      sleepProgress = Math.max(0, 1.0 - (tWake / 0.35));

      // Cute startle / nudge awake as the overhead beam warms him
      if (tWake < 0.25) {
        var pNudge = tWake / 0.25;
        var nudgeHop = Math.sin(pNudge * Math.PI);
        hopY = -nudgeHop * 7.5;
        scaleY = 1.0 + nudgeHop * 0.06;
        scaleX = 1.0 - nudgeHop * 0.04;
      } else {
        hopY = 0;
        scaleY = 1.0;
        scaleX = 1.0;
      }

      // Head rights itself upright from the sleepy tilt
      roll = 0.075 * (1.0 - wakeProg);
      pitch = 0.050 * (1.0 - wakeProg);
      yaw = 0.020 * (1.0 - wakeProg);

      // Adorable eye flutter and waking surprise/wonder
      if (tWake < 0.15) {
        // Sleepy eyes crack open
        blink = Math.max(0, 1.0 - (tWake / 0.15));
        eyeWiden = 1.0;
      } else if (tWake < 0.38) {
        // Quick surprised flutter blink
        var pFlutter = (tWake - 0.15) / 0.23;
        blink = Math.sin(pFlutter * Math.PI);
        eyeWiden = 1.0 + 0.10 * (1.0 - blink);
      } else {
        // Eyes pop wide open in wonder and delight as bot sees the audience
        blink = 0;
        var pOpen = Math.min(1, (tWake - 0.38) / 0.37);
        eyeWiden = 1.0 + 0.24 * Math.sin(pOpen * Math.PI * 0.5);
      }

      smileProgress = 0;
    }
    // --- PHASE 3: DRAMATIC 3D SPIN (2.15s - 3.80s) ---
    else if (elapsedSec < 3.80) {
      phase = "spinning";
      curY = targetCy;
      sleepProgress = 0;
      smileProgress = 0;
      blink = 0;

      var tSpinTotal = elapsedSec - 2.15; // 0 to 1.65s

      // 3A. Anticipation wind-up coil (2.15s - 2.38s, 0.23s)
      if (tSpinTotal < 0.23) {
        var pCoil = tSpinTotal / 0.23;
        var sinCoil = Math.sin(pCoil * Math.PI * 0.5);
        // Micro-crouch into floor
        hopY = sinCoil * 3.5;
        scaleY = 1.0 - sinCoil * 0.07;
        scaleX = 1.0 + sinCoil * 0.05;
        // Counter-rotation wind-up (+18 degrees)
        yaw = sinCoil * (Math.PI * 0.10);
        pitch = -sinCoil * 0.05;
        roll = 0;
        eyeWiden = 1.0 - sinCoil * 0.12;
      }
      // 3B. Explosive multi-turn 3D whirl (2.38s - 3.48s, 1.10s)
      else if (tSpinTotal < 1.33) {
        var pSpin = (tSpinTotal - 0.23) / 1.10; // 0 to 1
        var spinEased = 1 - Math.pow(1 - pSpin, 2.7);
        // 3 full 360-deg revolutions (-1080 deg / -6*PI rad) starting from wind-up angle
        var coilAngle = Math.PI * 0.10;
        yaw = coilAngle * (1 - pSpin) - (Math.PI * 6.0) * spinEased;

        // Upward float into beam core
        var liftArc = Math.sin(pSpin * Math.PI);
        hopY = -liftArc * 18.0;

        // Centrifugal elongation
        scaleY = 1.0 + liftArc * 0.07;
        scaleX = 1.0 - liftArc * 0.05;

        // Gyroscopic 3D banking (tilt on pitch & roll)
        var gyroDamp = Math.sin(pSpin * Math.PI);
        roll = Math.sin(pSpin * Math.PI * 6.0) * 0.16 * gyroDamp;
        pitch = Math.cos(pSpin * Math.PI * 5.0) * 0.09 * gyroDamp;

        eyeWiden = 1.0 + liftArc * 0.18;
      }
      // 3C. Deceleration, overshoot & physical inertia settle (3.48s - 3.80s, 0.32s)
      else {
        var pSettle = (tSpinTotal - 1.33) / 0.32; // 0 to 1
        // Inertial overshoot past 0 with elastic snap to 0
        yaw = Math.sin(pSettle * Math.PI) * 0.06 * (1 - pSettle);
        roll += (0 - roll) * 0.22;
        pitch += (0 - pitch) * 0.22;

        // Touchdown landing bounce
        hopY = Math.sin(pSettle * Math.PI) * 2.5 * (1 - pSettle);
        scaleY = 1.0 - Math.sin(pSettle * Math.PI) * 0.04;
        scaleX = 1.0 + Math.sin(pSettle * Math.PI) * 0.04;

        eyeWiden += (1.0 - eyeWiden) * 0.16;
      }
    }
    // --- PHASE 4: THINKING EFFECT / VISITOR DETECTED (3.80s - 5.10s) ---
    else if (elapsedSec < 5.10) {
      phase = "thinking";
      curY = targetCy;
      scaleX = 1; scaleY = 1;
      sleepProgress = 0;

      var tThink = elapsedSec - 3.80; // 0 to 1.30s
      var pThink = Math.min(1, tThink / 0.45);

      // Cocks head inquisitively (+9 deg roll, looking slightly up at visitor)
      roll = Math.sin(pThink * Math.PI * 0.5) * 0.15;
      pitch = -0.06 * Math.sin(pThink * Math.PI * 0.5);
      yaw = -0.04 * Math.sin(pThink * Math.PI * 0.5);

      // Wide inquisitive eyes
      eyeWiden = 1.0 + Math.sin(pThink * Math.PI * 0.5) * 0.28;

      // Thinking blink
      if (tThink > 0.15 && tThink < 0.38) {
        var bP = (tThink - 0.15) / 0.23;
        blink = Math.sin(bP * Math.PI);
      } else {
        blink = 0;
      }

      smileProgress = 0;

      // "Visitor detected" thought bubble is clearly displayed before speaking
      if (tThink < 1.15) {
        showThinkingBubble();
      } else {
        retractThinkingBubble();
      }
    }
    // --- PHASE 5: DELIGHTED RECOGNITION & SMILE (5.10s - 5.60s) ---
    else if (elapsedSec < 5.60) {
      phase = "smile";
      curY = targetCy;
      sleepProgress = 0;
      var tSm = elapsedSec - 5.10; // 0 to 0.50s

      roll += (0 - roll) * 0.12;
      pitch += (0.02 - pitch) * 0.12;
      eyeWiden += (1.0 - eyeWiden) * 0.10;

      smileProgress = Math.min(1, tSm / 0.30);

      // Happy recognition hop
      if (tSm < 0.36) {
        hopY = -Math.sin((tSm / 0.36) * Math.PI) * 9.5;
      } else {
        hopY = 0;
      }

      // Speech bubble opens after Visitor Detected scan completes
      if (elapsedSec >= 5.18 && bubbleState !== "speaking" && speechFlowState === "idle") {
        openSpeechBubble();
        if (!speechTriggered && !isMuted) {
          speechTriggered = true;
          speakGreeting();
        }
      }
    }
    // --- PHASE 6: LIVING INTERACTIVE EYE CONTACT (5.60s+) ---
    else {
      phase = "active";
      curY = targetCy;
      smileProgress = 1;
      eyeWiden = 1.0;

      if (bubbleState !== "speaking" && speechFlowState === "idle") {
        openSpeechBubble();
      }

      // Check if finished saying when muted (or as speech timeout fallback)
      if (speechFlowState === "speaking" && elapsedSec >= 9.4) {
        var isActivelySpeaking = ("speechSynthesis" in window) && window.speechSynthesis.speaking;
        if (!isActivelySpeaking) {
          markFinishedSaying();
        }
      }

      yaw += (targetYaw - yaw) * 0.08;
      pitch += (targetPitch - pitch) * 0.08;
      roll += (0 - roll) * 0.08;

      if (elapsedSec - lastBlinkTime > nextBlinkInterval) {
        lastBlinkTime = elapsedSec;
        nextBlinkInterval = 3.6 + Math.random() * 2.4;
      }
      var dtB = elapsedSec - lastBlinkTime;
      if (dtB < 0.20) {
        blink = Math.sin((dtB / 0.20) * Math.PI);
      } else {
        blink = 0;
      }
    }

    var floatY = (elapsedSec >= 3.80) ? Math.sin((elapsedSec - 3.80) * 1.8) * 5.5 : 0;
    var currentCy = curY + floatY + hopY;

    // -------------------------------------------------------------
    // DYNAMIC MOUTH COORDINATE TRACKING
    // -------------------------------------------------------------
    var pMouth0 = sphericalTo3D(MOUTH_CENTER.phi, MOUTH_CENTER.theta);
    var pMouthRot = rotate3D(pMouth0, yaw, pitch, roll);
    screenMouthX = cx + R * pMouthRot.x;
    screenMouthY = currentCy + R * pMouthRot.y;

    if (bubbleEl) {
      var bubbleTop = currentCy + R + 18;
      var thinkX = cx + R * 0.75;
      var thinkY = currentCy - R * 0.70;
      bubbleEl.style.setProperty("--mouth-x", screenMouthX.toFixed(1) + "px");
      bubbleEl.style.setProperty("--mouth-y", screenMouthY.toFixed(1) + "px");
      bubbleEl.style.setProperty("--bubble-y", bubbleTop.toFixed(1) + "px");
      bubbleEl.style.setProperty("--think-x", thinkX.toFixed(1) + "px");
      bubbleEl.style.setProperty("--think-y", thinkY.toFixed(1) + "px");
    }

    // Hero auto-scroll countdown chip (throttled internally, ~zero cost).
    updateScrollTimer(now);

    // -------------------------------------------------------------
    // 2. CLEAR CANVAS & CINEMATIC OVERHEAD SPOTLIGHT
    // -------------------------------------------------------------
    ctx.clearRect(0, 0, W, H);

    // Spotlight arrival & intensity choreography:
    var spotX = cx;
    var spotFade = 0;
    var spotIllumination = 0; // 0 = dark ambient silhouette, 1 = fully illuminated in spotlight

    if (elapsedSec < 1.40) {
      // Phase 1: Grok bot sleeps peacefully in soft ambient room lighting (no spotlight)
      spotFade = 0;
      spotIllumination = 0;
      spotX = cx;
    } else if (elapsedSec < 2.15) {
      // Phase 2: Overhead spotlight sweeps in, strikes lamp, illuminates bot as he wakes up
      var tSpot = elapsedSec - 1.40; // 0 to 0.75s
      var sweepProg = Math.min(1, tSpot / 0.65);
      var easedSweep = 1 - Math.pow(1 - sweepProg, 3);
      var spotSweepX = (cx - R * 1.5) * (1 - easedSweep) + cx * easedSweep;
      var spotSway = reduceSpotMotion ? 0 : Math.sin(elapsedSec * 0.35) * R * 0.05;
      spotX = spotSweepX + spotSway * easedSweep;

      // Lamp power strike: filament surge & flare settling into full beam
      var strikeProg = Math.min(1, tSpot / 0.30);
      var lampIgnite = Math.sin(strikeProg * Math.PI * 0.5);
      var lampFlare = (tSpot > 0.10 && tSpot < 0.38) ? Math.sin((tSpot - 0.10) / 0.28 * Math.PI) * 0.22 : 0;
      spotFade = reduceSpotMotion ? 1 : Math.min(1, lampIgnite + lampFlare);

      // Illumination scales as beam converges on sphere
      var distToSphere = Math.abs(spotX - cx);
      var sphereInBeam = Math.max(0, 1 - distToSphere / (R * 1.8));
      spotIllumination = spotFade * sphereInBeam;
    } else {
      // Phase 3+: Full steady spotlight with live breathing & sway
      var spotSway = reduceSpotMotion ? 0 : Math.sin(elapsedSec * 0.35) * R * 0.05;
      spotX = cx + spotSway;
      spotFade = 1.0;
      spotIllumination = 1.0;
    }

    var spinEnergy = (phase === "spinning" && elapsedSec >= 2.38 && elapsedSec < 3.48)
      ? Math.sin(((elapsedSec - 2.38) / 1.10) * Math.PI) * 0.15 : 0;
    var spotSwell = Math.min(0.20, Math.abs(hopY) * 0.012 + spinEnergy + (bubbleState === "speaking" ? 0.06 : 0));
    var spotBreath = (reduceSpotMotion ? 0.42 : 0.42 + Math.sin(elapsedSec * 0.9) * 0.045) * spotFade;
    if (beamSprite && spotFade > 0.001) {
      var beamW = R * 3.0 * (0.85 + SPOT_WATTS * 0.15);
      var beamTop = -H * 0.06;
      var beamH = (targetCy + R + 44) - beamTop;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = Math.min(1, spotBreath + spotSwell);
      ctx.drawImage(beamSprite, spotX - beamW / 2, beamTop, beamW, beamH);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 3. THINKING NEURAL RIPPLE WAVES (EMITS AROUND HEAD)
    // -------------------------------------------------------------
    if (phase === "thinking") {
      var thinkT = (elapsedSec - 3.80);
      for (var w = 0; w < 3; w++) {
        var waveProg = ((thinkT * 2.2 + w * 0.33) % 1.0);
        var waveRadius = R * (1.06 + waveProg * 0.42);
        var waveAlpha = (1.0 - waveProg) * 0.40;

        ctx.strokeStyle = "rgba(52, 211, 153, " + waveAlpha.toFixed(3) + ")";
        ctx.lineWidth = Math.max(1.5, 3.2 * (1.0 - waveProg));
        ctx.beginPath();
        ctx.arc(cx, currentCy - R * 0.12, waveRadius, -Math.PI * 0.88, -Math.PI * 0.12);
        ctx.stroke();
      }
    }

    // -------------------------------------------------------------
    // 4. PIXAR STUDIO FLOOR — pre-rendered sprites, zero per-frame
    // gradients. Physical model: contact hardening (small/dark/sharp
    // when grounded, wide/faint/soft when airborne) + key-light
    // direction offset + critically-damped temporal smoothing so the
    // shadow never pops or jitters between frames.
    // -------------------------------------------------------------
    var shadowFloorY = targetCy + R + 36;
    var altitude = Math.max(0, shadowFloorY - (currentCy + R));
    var altitudeFactor = Math.max(0.05, Math.min(1.0, 1.0 - altitude / 340));
    // Frame-rate independent smoothing (~90ms time constant)
    if (now !== undefined && lastFrameNow >= 0) {
      var dtS = Math.min(0.10, Math.max(0.001, (now - lastFrameNow) / 1000));
      var blend = Math.min(1, dtS * 11);
      smoothContact += (altitudeFactor - smoothContact) * blend;
    } else {
      smoothContact += (altitudeFactor - smoothContact) * 0.18;
    }
    lastFrameNow = (now !== undefined) ? now : lastFrameNow;
    var contact = smoothContact; // 1 = grounded, 0 = high airborne

    // Overhead key: the shadow drops straight beneath the sphere,
    // breathing microscopically with the rig sway. No side offset.
    var shadowX = cx + (spotX - cx) * 0.3;
    var cScale = 1.26 - 0.34 * contact;          // wider when high
    var cAlpha = 0.38 + 0.62 * contact;          // fainter when high
    var squashX = (scaleX || 1), squashY = (scaleY || 1);

    if (hotPoolSprite && contactSprite) {
      ctx.save();
      // A. The spotlight pool: the ONLY floor light. Drawn BEFORE the
      // contact shadow — compositing it on top with 'screen' re-lit the
      // exact area the shadow occupies and turned the occlusion grey.
      var hW = R * 3.0 * SPOT_WATTS * squashX, hH = R * 0.75 * squashY;
      ctx.globalCompositeOperation = "screen";
      var poolAlpha = Math.min(1, ((0.45 + 0.45 * contact) + spotSwell) * spotFade * SPOT_WATTS);
      if (poolAlpha > 0.005) {
        ctx.globalAlpha = poolAlpha;
        ctx.drawImage(hotPoolSprite, spotX - hW / 2, shadowFloorY - hH / 2, hW, hH);
      }
      ctx.globalCompositeOperation = "source-over";
      // B. Porcelain bounce off the body (a reflection, not a lamp)
      var bW = R * 1.9 * squashX, bH = R * 0.48 * squashY;
      var bounceAlpha = Math.min(1, (0.45 + 0.55 * contact) * Math.max(0.25, spotIllumination));
      ctx.globalAlpha = bounceAlpha;
      ctx.drawImage(bounceSprite, shadowX - bW / 2, shadowFloorY - 2 - bH / 2, bW, bH);
      // C. Layered AO contact shadow — always last, so occlusion wins.
      var cW = R * 2.9 * cScale * squashX, cH = R * 0.88 * cScale * squashY;
      var ambientContactFactor = 0.55 + 0.45 * spotIllumination;
      ctx.globalAlpha = Math.min(1, Math.max(0, cAlpha * ambientContactFactor));
      ctx.drawImage(contactSprite, shadowX - cW / 2, shadowFloorY - cH / 2, cW, cH);
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 5. PORCELAIN SPHERE IN STAGE LIGHTING & FLOATING "Zzz"
    // The bot is the beloved cute white porcelain Grok bot.
    // In semi-ambient lighting before the spotlight, he rests
    // peacefully with gentle breathing and floating "Zzz" snoozes.
    // When the overhead spotlight strikes, he illuminates radiantly
    // and catches the crisp top-light kiss across his crown.
    // -------------------------------------------------------------
    if (sphereSprite) {
      var dW = R * 2 * squashX, dH = R * 2 * squashY;
      ctx.save();
      var sphereAlpha = (elapsedSec < 0.35) ? Math.min(1, elapsedSec / 0.35) : 1.0;

      // Soft ambient room tone when resting -> full brilliant stage light in spotlight
      var ambientLight = 0.55 + 0.45 * spotIllumination;
      ctx.globalAlpha = Math.min(1, sphereAlpha * ambientLight);
      ctx.drawImage(sphereSprite, cx - dW / 2, currentCy - dH / 2, dW, dH);

      // Top-light kiss: overhead wash clipped to the body so the rig lights porcelain
      if (topKissSprite && spotFade > 0.01 && spotIllumination > 0.01) {
        ctx.save();
        ctx.beginPath();
        if (ctx.ellipse) {
          ctx.ellipse(cx, currentCy, Math.max(1, R * squashX * 0.99), Math.max(1, R * squashY * 0.99), 0, 0, Math.PI * 2);
        } else {
          ctx.arc(cx, currentCy, Math.max(1, R * 0.99), 0, Math.PI * 2);
        }
        ctx.clip();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = Math.min(1, (0.62 * spotFade * SPOT_WATTS + spotSwell * spotFade) * spotIllumination);
        var kW = R * 2.1 * squashX, kH = R * 2.1 * squashY;
        ctx.drawImage(topKissSprite, cx - kW / 2, currentCy - kH / 2 - R * 0.18, kW, kH);
        ctx.restore();
      }
      ctx.restore();

      // Floating "Zzz" snooze particles drifting upward while sleeping
      renderZzz(cx, currentCy, elapsedSec, sleepProgress);
    }

    // -------------------------------------------------------------
    // 6. 3D PROJECTED EYES & REAL-TIME LIP-SYNC MOUTH
    // -------------------------------------------------------------
    var isSpeakingNow = (botAudio && !botAudio.paused && !botAudio.ended) ||
      (speechFlowState === "speaking" && elapsedSec >= 5.18 && elapsedSec < 9.7) ||
      ("speechSynthesis" in window && window.speechSynthesis.speaking);

    renderEye(EYE_LEFT, currentCy, false, isSpeakingNow);
    renderEye(EYE_RIGHT, currentCy, true, isSpeakingNow);
    renderSmile(currentCy, elapsedSec, isSpeakingNow);

    requestAnimationFrame(render);
  }

  // =============================================================
  // 3D EYE PROJECTION & RENDERING (EXPRESSIVE, SOULFUL, SPARKLING)
  // =============================================================
  function renderEye(eyeCoord, sphereY, isRightEye, isSpeakingNow) {
    var p0 = sphericalTo3D(eyeCoord.phi, eyeCoord.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.02) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.18, pRot.z);
    var baseEyeW = R * 0.096 * normalForeshorten;
    // Keep eye comfortably wide and open, with subtle speech breathing pulse
    var speechPulse = isSpeakingNow ? (1.0 + Math.sin(Date.now() * 0.012) * 0.04) : 1.0;
    var baseEyeH = R * 0.128 * eyeWiden * speechPulse;

    var openFactor = Math.max(0.08, 1.0 - blink);
    var curEyeH = baseEyeH * openFactor;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(pRot.x * 0.28 + roll);

    var sm = smileProgress; // 0 (neutral) to 1 (full warm smiling gaze)

    // =========================================================
    // A. CUTE PEACEFUL SLEEPING EYE CURVES (⌣ ⌣)
    // Sweet curved snooze arcs while Grok bot sleeps peacefully.
    // Crossfades into open Pixar character eyes as bot wakes up.
    // =========================================================
    if (sleepProgress > 0.005) {
      ctx.save();
      ctx.globalAlpha = sleepProgress;
      ctx.strokeStyle = "#1e2230";
      ctx.lineWidth = Math.max(2.6, R * 0.034 * normalForeshorten);
      ctx.lineCap = "round";

      var arcW = baseEyeW * 0.85;
      var arcDrop = baseEyeH * 0.45;

      ctx.beginPath();
      ctx.moveTo(-arcW, -arcDrop * 0.30);
      ctx.quadraticCurveTo(0, arcDrop, arcW, -arcDrop * 0.30);
      ctx.stroke();

      // Cute sleeping eyelash accent on outer corner
      var outerX = isRightEye ? arcW : -arcW;
      var lashDir = isRightEye ? 1 : -1;
      ctx.lineWidth = Math.max(1.8, R * 0.022 * normalForeshorten);
      ctx.beginPath();
      ctx.moveTo(outerX, -arcDrop * 0.30);
      ctx.lineTo(outerX + lashDir * arcW * 0.26, -arcDrop * 0.70);
      ctx.stroke();

      ctx.restore();
    }

    // =========================================================
    // B. PIXAR CHARACTER EYE (AWAKE IN SPOTLIGHT)
    // Fades in cleanly as the bot wakes up and spotlight shines
    // =========================================================
    var awakeAlpha = Math.max(0, 1.0 - sleepProgress);
    if (awakeAlpha > 0.005) {
      ctx.save();
      ctx.globalAlpha = awakeAlpha;

      ctx.fillStyle = "#07090e";
      ctx.beginPath();
      if (openFactor > 0.32) {
        var topH = curEyeH;
        var botH = curEyeH * (1.0 - sm * 0.32);
        ctx.moveTo(-baseEyeW, 0);
        ctx.bezierCurveTo(-baseEyeW, -topH * 1.25, baseEyeW, -topH * 1.25, baseEyeW, 0);
        ctx.bezierCurveTo(baseEyeW, botH * 0.95, -baseEyeW, botH * 0.95, -baseEyeW, 0);
        ctx.fill();

        // Dual glossy catchlights
        var spark1X = baseEyeW * 0.32;
        var spark1Y = -curEyeH * 0.38;
        var spark1R = Math.max(1.8, baseEyeW * 0.38);
        ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
        ctx.beginPath();
        ctx.arc(spark1X, spark1Y, spark1R, 0, Math.PI * 2);
        ctx.fill();

        var spark2X = -baseEyeW * 0.30;
        var spark2Y = curEyeH * 0.22;
        var spark2R = Math.max(1.1, baseEyeW * 0.18);
        ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
        ctx.beginPath();
        ctx.arc(spark2X, spark2Y, spark2R, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "#07090e";
        ctx.lineWidth = Math.max(2.5, R * 0.034 * normalForeshorten);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-baseEyeW, 0);
        ctx.lineTo(baseEyeW, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  // =============================================================
  // REAL-TIME LIP-SYNC SMILE MOUTH RENDERING
  // =============================================================
  function renderSmile(sphereY, elapsedSec, isSpeakingNowArg) {
    if (smileProgress <= 0.01) return;
    var p0 = sphericalTo3D(MOUTH_CENTER.phi, MOUTH_CENTER.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.05) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.15, pRot.z);

    // Dynamic lip-sync speech oscillation
    var isSpeakingNow = (isSpeakingNowArg !== undefined) ? isSpeakingNowArg :
      ((botAudio && !botAudio.paused && !botAudio.ended) ||
       (speechFlowState === "speaking" && elapsedSec >= 5.18 && elapsedSec < 9.7) ||
       ("speechSynthesis" in window && window.speechSynthesis.speaking));
    var talkVibe = isSpeakingNow ? Math.sin(elapsedSec * 22) * 0.38 : 0;
    var mouthTalkDepth = isSpeakingNow ? (Math.sin(elapsedSec * 20) * 0.5 + 0.5) * R * 0.022 : 0;

    var mouthW = Math.max(2, (R * 0.17 * normalForeshorten + talkVibe * R * 0.015) * smileProgress);
    var mouthDepth = Math.max(0.5, (R * 0.058 + mouthTalkDepth) * smileProgress);
    var strokeW = Math.max(2.2, R * 0.026 * normalForeshorten);

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(pRot.x * 0.2 + roll);

    ctx.strokeStyle = "#090a0f";
    ctx.lineWidth = strokeW;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(-mouthW * 0.5, -mouthDepth * 0.25);
    ctx.quadraticCurveTo(0, mouthDepth, mouthW * 0.5, -mouthDepth * 0.25);
    ctx.stroke();

    ctx.restore();
  }


  // Initialize
  resize();
  // First paint must have sprites immediately — scheduleRebake defers,
  // so bake up front and record the radius so the next resize is a no-op.
  bakedR = R;
  buildShadowSprites();
  buildSphereSprite();
  buildSpotSprites();
  window.addEventListener("resize", scheduleRebake);
  requestAnimationFrame(render);

})();

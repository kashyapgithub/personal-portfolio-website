/* ============================================================
   Grok-Inspired 3D Sphere Bot — Interactive Hero Engine
   - Perfect 1:1 circular aspect ratio with high-DPI Retina support
   - Snappy physical entrance: drops and bounces into center within 0.8s
   - Rotates on loading for ~2.5s with 3D spherical eye mapping
   - "Notices the user" double-take: curious head tilt, wide eyes, inquisitive blink
   - Delighted recognition: warm smiling crescents (⌒  ⌒) + mouth arc
   - Frosted glass dialogue card reveal with elevated copywriting
   - Responsive cursor eye contact with spring damping
   ============================================================ */

(function () {
  "use strict";

  var canvas = document.getElementById("grok-bot-canvas");
  if (!canvas) return;

  var hero = canvas.closest(".hero") || canvas.parentElement;
  var dialogueCard = document.getElementById("bot-dialogue");
  var statusPillText = document.getElementById("bot-status-text");
  var statusIndicator = document.querySelector(".status-indicator");
  var scrollCta = document.getElementById("bot-cta-scroll");
  var emailCta = document.getElementById("bot-cta-email");

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Screen & Dimensions
  var W = 0, H = 0, DPR = 1;
  var R = 115; // Sphere radius in CSS px
  var cx = 0, targetCy = 0;

  // Ambient Stardust Particles
  var stars = [];
  var STAR_COUNT = 40;

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * (W || window.innerWidth),
        y: Math.random() * (H || 600),
        r: 0.7 + Math.random() * 1.3,
        alpha: 0.08 + Math.random() * 0.26,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.05 - Math.random() * 0.12
      });
    }
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
      R = Math.max(64, Math.min(76, W * 0.19));
    } else if (W < 1024) {
      R = Math.max(90, Math.min(108, W * 0.15));
    } else {
      R = Math.max(105, Math.min(125, W * 0.11));
    }

    cx = Math.round(W * 0.5);

    // Compute targetCy: vertically centered in space above dialogue card with generous clearance
    var headerH = W < 640 ? 56 : 70;
    var cardHeightApprox = W < 640 ? 270 : 220;
    var availableH = Math.max(180, H - headerH - cardHeightApprox);
    targetCy = Math.round(headerH + availableH * 0.36);

    if (stars.length === 0) initStars();
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

  var curY = -180; // Starts just above screen
  var scaleX = 1;
  var scaleY = 1;

  var blink = 0; // 0 = open, 1 = closed
  var eyeWiden = 1.0;
  var smileProgress = 0;
  var hopY = 0;

  var phase = "entrance"; // entrance -> spinning -> notice -> smile -> active
  var dialogueRevealed = false;

  var lastBlinkTime = 0;
  var nextBlinkInterval = 4.2;

  // Mouse / Pointer Eye Contact Tracking
  function onPointerMove(clientX, clientY) {
    if (phase === "entrance" || phase === "spinning") return;
    var rect = canvas.getBoundingClientRect();
    var mouseX = clientX - rect.left;
    var mouseY = clientY - rect.top;

    var dx = (mouseX - cx) / (W * 0.5);
    var dy = (mouseY - targetCy) / (H * 0.5);

    // Responsive 3D yaw and pitch with comfortable limits
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

  // Click Interaction: Playful bounce & double blink
  canvas.addEventListener("click", function () {
    if (phase === "entrance") return;
    triggerPlayfulHop();
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
    var y2 = y1;
    var z2 = -x1 * sinY + z1 * cosY;

    // 3. Roll around Z
    var cosR = Math.cos(curRoll), sinR = Math.sin(curRoll);
    var x3 = x2 * cosR - y2 * sinR;
    var y3 = x2 * sinR + y2 * cosR;
    var z3 = z2;

    return { x: x3, y: y3, z: z3 };
  }

  // Animation Loop
  var startTime = performance.now();

  function render(now) {
    var elapsedSec = (now - startTime) / 1000;
    if (debugTime !== null && !isNaN(debugTime)) {
      elapsedSec = debugTime;
    }

    // -------------------------------------------------------------
    // 1. CHOREOGRAPHY & CHARACTER ANIMATION TIMELINE
    // -------------------------------------------------------------

    // --- PHASE 1: SNAPPY BOUNCY ARRIVAL (0.0s - 0.85s) ---
    if (elapsedSec < 0.85) {
      phase = "entrance";
      var t = elapsedSec;
      var startY = -R - 35;
      var floorY = targetCy;

      if (t < 0.45) {
        // Drop in quickly with gravity acceleration
        var pDrop = t / 0.45;
        curY = startY + (floorY - startY) * (pDrop * pDrop);
        yaw = -Math.PI * 4.0 * (1 - pDrop * 0.15);
        scaleX = 0.95; scaleY = 1.05; // Air stretch
        roll = Math.sin(pDrop * Math.PI) * 0.12;
      } else if (t < 0.58) {
        // Impact 1: Squash on landing - EYES FACE FRONT!
        var pSq = (t - 0.45) / 0.13;
        var sqAmt = Math.sin(pSq * Math.PI) * 0.18;
        curY = floorY + Math.sin(pSq * Math.PI) * 8;
        scaleY = 1.0 - sqAmt;
        scaleX = 1.0 + sqAmt * 0.8;
        yaw = -Math.PI * 4.0;
        roll = 0.04;
      } else if (t < 0.76) {
        // Gentle Rebound Arc
        var pReb = (t - 0.58) / 0.18;
        curY = floorY - Math.sin(pReb * Math.PI) * 26;
        yaw = -Math.PI * 4.0;
        scaleX = 1.0; scaleY = 1.0;
        roll = 0;
      } else {
        // Settles to floor
        var pSet = (t - 0.76) / 0.09;
        curY = floorY + Math.sin(pSet * Math.PI) * 4;
        scaleX = 1.0; scaleY = 1.0;
        yaw = -Math.PI * 4.0;
      }

      smileProgress = 0;
      blink = 0;
      eyeWiden = 1.0;
    }
    // --- PHASE 2: ROTATING ON LOADING (0.85s - 3.2s) ---
    else if (elapsedSec < 3.2) {
      phase = "spinning";
      curY = targetCy;
      scaleX = 1; scaleY = 1;

      var tSpin = elapsedSec - 0.85; // 0 to 2.35s
      var spinProg = tSpin / 2.35;
      // Smooth cubic ease out: exactly 2 full turns (-4*PI to 0)
      var easedSpin = 1 - Math.pow(1 - spinProg, 2.5);

      yaw = -Math.PI * 4.0 * (1 - easedSpin);
      pitch = Math.sin(tSpin * 3.5) * 0.04 * (1 - spinProg);
      roll = Math.sin(tSpin * 4.0) * 0.03 * (1 - spinProg);

      smileProgress = 0;
      blink = 0;
      eyeWiden = 1.0;

      if (statusPillText && statusPillText.textContent !== "Calibrating Grok neural sphere...") {
        statusPillText.textContent = "Calibrating Grok neural sphere...";
      }
    }
    // --- PHASE 3: THE DOUBLE-TAKE / NOTICES VISITOR! (3.2s - 3.7s) ---
    else if (elapsedSec < 3.7) {
      phase = "notice";
      curY = targetCy;
      scaleX = 1; scaleY = 1;

      var tNotice = elapsedSec - 3.2; // 0 to 0.5s
      var pNotice = tNotice / 0.5;

      // Cocks head with curious wonder! (+8 deg roll tilt, looks slightly up)
      roll = Math.sin(pNotice * Math.PI * 0.5) * 0.14;
      pitch = -0.06 * Math.sin(pNotice * Math.PI * 0.5);
      yaw = -0.04 * Math.sin(pNotice * Math.PI * 0.5);

      // Eyes widen with astonishment!
      eyeWiden = 1.0 + Math.sin(pNotice * Math.PI * 0.5) * 0.28;

      // Inquisitive surprised blink (3.35s - 3.55s)
      if (tNotice > 0.15 && tNotice < 0.38) {
        var bP = (tNotice - 0.15) / 0.23;
        blink = Math.sin(bP * Math.PI);
      } else {
        blink = 0;
      }

      if (statusPillText && statusPillText.textContent !== "Visitor detected... 👀") {
        statusPillText.textContent = "Visitor detected... 👀";
      }

      smileProgress = 0;
    }
    // --- PHASE 4: DELIGHTED RECOGNITION & THE SMILE (3.7s - 4.2s) ---
    else if (elapsedSec < 4.2) {
      phase = "smile";
      curY = targetCy;
      var tSm = elapsedSec - 3.7; // 0 to 0.5s

      // Head straightens proudly
      roll += (0 - roll) * 0.12;
      pitch += (0.02 - pitch) * 0.12;
      eyeWiden += (1.0 - eyeWiden) * 0.10;

      // Smile morphs from 0 to 1
      smileProgress = Math.min(1, tSm / 0.35);

      // Buoyant happy hop
      if (tSm < 0.38) {
        hopY = -Math.sin((tSm / 0.38) * Math.PI) * 9.0;
      } else {
        hopY = 0;
      }

      // Status Pill Updates
      if (statusPillText) {
        if (elapsedSec < 3.2) {
          statusPillText.textContent = "Calibrating Grok neural sphere...";
          if (statusIndicator) statusIndicator.classList.remove("is-online");
        } else if (elapsedSec < 3.7) {
          statusPillText.textContent = "Visitor detected... 👀";
          if (statusIndicator) statusIndicator.classList.remove("is-online");
        } else {
          statusPillText.textContent = "Spotted you! Welcome";
          if (statusIndicator) statusIndicator.classList.add("is-online");
        }
      }

      // Reveal Dialogue Card at 3.9s
      if (elapsedSec >= 3.9 && !dialogueRevealed) {
        dialogueRevealed = true;
        if (dialogueCard) dialogueCard.classList.add("is-visible");
      }
    }
    // --- PHASE 5: LIVING INTERACTIVE EYE CONTACT (4.2s+) ---
    else {
      phase = "active";
      curY = targetCy;
      smileProgress = 1;
      eyeWiden = 1.0;

      if (statusPillText) {
        statusPillText.textContent = "Spotted you! Welcome";
        if (statusIndicator) statusIndicator.classList.add("is-online");
      }

      // Attentive eye contact: tracks cursor with smooth spring damping
      yaw += (targetYaw - yaw) * 0.08;
      pitch += (targetPitch - pitch) * 0.08;
      roll += (0 - roll) * 0.08;

      // Natural idle blinking every 4-5s
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

    // Gentle breathing float once settled
    var floatY = (elapsedSec >= 0.85) ? Math.sin(elapsedSec * 1.8) * 5.5 : 0;
    var currentCy = curY + floatY + hopY;

    // -------------------------------------------------------------
    // 2. CLEAR CANVAS & BACKGROUND STARDUST
    // -------------------------------------------------------------
    ctx.clearRect(0, 0, W, H);

    for (var s = 0; s < stars.length; s++) {
      var star = stars[s];
      star.y += star.vy;
      star.x += star.vx;
      if (star.y < 0) { star.y = H; star.x = Math.random() * W; }
      if (star.x < 0) star.x = W;
      if (star.x > W) star.x = 0;

      ctx.fillStyle = "rgba(255, 255, 255, " + star.alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // -------------------------------------------------------------
    // 3. DYNAMIC GROUND SHADOW (SCALES WITH SPHERE ALTITUDE)
    // -------------------------------------------------------------
    var shadowFloorY = targetCy + R + 38;
    var altitude = Math.max(0, shadowFloorY - (currentCy + R));
    var altitudeFactor = Math.max(0.05, Math.min(1.0, 1.0 - altitude / 320));

    var shadowRx = R * 0.85 * altitudeFactor * (scaleX || 1);
    var shadowRy = R * 0.18 * altitudeFactor * (scaleY || 1);
    var shadowAlpha = Math.max(0.04, Math.min(0.55, 0.45 * (altitudeFactor * altitudeFactor)));

    if (shadowRx > 3) {
      var shadowGrad = ctx.createRadialGradient(cx, shadowFloorY, 0, cx, shadowFloorY, shadowRx);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, " + shadowAlpha.toFixed(3) + ")");
      shadowGrad.addColorStop(0.48, "rgba(0, 0, 0, " + (shadowAlpha * 0.42).toFixed(3) + ")");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, shadowFloorY, shadowRx, shadowRy, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // 4. WHITE PORCELAIN MATTE 3D SPHERE
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(cx, currentCy);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-cx, -currentCy);

    // Key directional light coming from upper-left-front
    var keyLightX = cx - R * 0.32;
    var keyLightY = currentCy - R * 0.36;

    var sphereGrad = ctx.createRadialGradient(keyLightX, keyLightY, R * 0.04, cx, currentCy, R * 1.05);
    // Smooth Grok-style porcelain white shading
    sphereGrad.addColorStop(0.00, "#ffffff");
    sphereGrad.addColorStop(0.22, "#f8fafc");
    sphereGrad.addColorStop(0.50, "#e2e8f0");
    sphereGrad.addColorStop(0.76, "#cbd5e1");
    sphereGrad.addColorStop(0.93, "#94a3b8");
    sphereGrad.addColorStop(1.00, "#64748b");

    ctx.beginPath();
    ctx.arc(cx, currentCy, R, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    // Subtle luminous rim / fresnel edge backlight
    var rimGrad = ctx.createRadialGradient(cx, currentCy, R * 0.84, cx, currentCy, R);
    rimGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
    rimGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.12)");
    rimGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.44)");

    ctx.beginPath();
    ctx.arc(cx, currentCy, R, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    // -------------------------------------------------------------
    // 5. 3D PROJECTED EYES & SMILE ON SPHERE SURFACE
    // -------------------------------------------------------------
    renderEye(EYE_LEFT, -1, currentCy);
    renderEye(EYE_RIGHT, 1, currentCy);

    if (smileProgress > 0.01) {
      renderSmile(currentCy);
    }

    ctx.restore();

    requestAnimationFrame(render);
  }

  // Eye Rendering with 3D Foreshortening, Widen & Smile Morph
  function renderEye(eyeCoord, sideSign, sphereY) {
    var p0 = sphericalTo3D(eyeCoord.phi, eyeCoord.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.02) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.12, pRot.z);

    // Dynamic eye sizing with widening factor
    var baseEyeW = R * 0.092 * normalForeshorten * eyeWiden;
    var baseEyeH = R * 0.135 * eyeWiden;

    var openFactor = Math.max(0.04, 1 - blink * 0.94);
    var curEyeH = baseEyeH * openFactor;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(pRot.x * 0.25 * sideSign + roll);

    var sm = smileProgress;

    if (sm < 0.22) {
      // --- CURIOUS / NEUTRAL BLACK EYE ---
      ctx.fillStyle = "#090a0f";
      ctx.beginPath();
      ctx.ellipse(0, 0, baseEyeW, curEyeH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Specular reflection catchlight
      if (openFactor > 0.35) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(baseEyeW * 0.28, -curEyeH * 0.30, Math.max(1.2, baseEyeW * 0.30), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // --- JOYFUL SMILING CRESCENT (⌒) ---
      var strokeW = Math.max(2.5, R * 0.038 * normalForeshorten);
      ctx.strokeStyle = "#090a0f";
      ctx.lineWidth = strokeW;
      ctx.lineCap = "round";

      var archRadius = baseEyeW * 1.15;
      var archHeight = curEyeH * 0.88;

      ctx.beginPath();
      ctx.moveTo(-archRadius, archHeight * 0.35);
      ctx.quadraticCurveTo(0, -archHeight * 0.95 * sm, archRadius, archHeight * 0.35);
      ctx.stroke();

      if (openFactor > 0.5 && sm < 0.9) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.arc(archRadius * 0.3, -archHeight * 0.4, strokeW * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Smile Mouth Arc Rendering
  function renderSmile(sphereY) {
    var p0 = sphericalTo3D(MOUTH_CENTER.phi, MOUTH_CENTER.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.05) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.15, pRot.z);
    var mouthW = R * 0.17 * normalForeshorten * smileProgress;
    var mouthDepth = R * 0.058 * smileProgress;
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

  // -------------------------------------------------------------
  // 6. INTERACTIVE CTA ACTION HOOKS
  // -------------------------------------------------------------
  if (scrollCta) {
    scrollCta.addEventListener("click", function (e) {
      e.preventDefault();
      var target = document.getElementById("work");
      if (target) {
        var headerH = 70;
        var topPos = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: topPos, behavior: "smooth" });
      }
    });
  }

  if (emailCta) {
    emailCta.addEventListener("click", function () {
      var globalCopyBtn = document.getElementById("copy-email-btn");
      if (globalCopyBtn) {
        globalCopyBtn.click();
      } else {
        var email = "bhabajitkashyapik@gmail.com";
        navigator.clipboard.writeText(email).then(function () {
          var toast = document.getElementById("copy-toast");
          if (toast) {
            toast.textContent = "Email copied: " + email;
            toast.classList.add("show");
            setTimeout(function () { toast.classList.remove("show"); }, 2800);
          }
        });
      }
    });
  }

  // Initialize
  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(render);

})();

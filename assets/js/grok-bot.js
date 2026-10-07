/* ============================================================
   Grok-Inspired 3D Sphere Bot — Interactive Hero Engine
   - Physical bouncy entrance from above the viewport
   - 3D tumbling rotation while falling & bouncing
   - "Notices the user" double-take: curious head tilt, wide eyes, surprised blink
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
  var scrollCta = document.getElementById("bot-cta-scroll");
  var emailCta = document.getElementById("bot-cta-email");

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Screen & Dimensions
  var W = 0, H = 0, DPR = 1;
  var R = 120; // Sphere radius in CSS px
  var cx = 0, targetCy = 0;

  // Ambient Stardust Particles
  var stars = [];
  var STAR_COUNT = 45;

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * (W || window.innerWidth),
        y: Math.random() * (H || 600),
        r: 0.7 + Math.random() * 1.4,
        alpha: 0.08 + Math.random() * 0.28,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.06 - Math.random() * 0.14
      });
    }
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2.5);
    W = hero ? hero.clientWidth : window.innerWidth;
    H = hero ? hero.clientHeight : Math.max(540, window.innerHeight * 0.85);

    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    // Responsive sphere radius & resting position
    if (W < 640) {
      R = Math.max(85, Math.min(105, W * 0.24));
      cx = W * 0.5;
      targetCy = Math.round(Math.max(R + 25, H * 0.32));
    } else if (W < 1024) {
      R = Math.max(105, Math.min(125, W * 0.18));
      cx = W * 0.5;
      targetCy = Math.round(Math.max(R + 35, H * 0.35));
    } else {
      R = Math.max(120, Math.min(145, W * 0.13));
      cx = W * 0.5;
      targetCy = Math.round(Math.max(R + 40, H * 0.38));
    }

    if (stars.length === 0) initStars();
  }

  // 3D Orientation & Animation States
  var yaw = 0;
  var pitch = 0;
  var roll = 0;

  var targetYaw = 0;
  var targetPitch = 0;

  var curY = -250; // Starts offscreen above viewport
  var scaleX = 1;
  var scaleY = 1;

  var blink = 0; // 0 = open, 1 = closed
  var eyeWiden = 1; // Eye scale factor (widens when noticing visitor)
  var smileProgress = 0; // 0 = neutral, 1 = full warm smile
  var hopY = 0;

  var phase = "entrance"; // entrance -> notice -> smile -> active
  var dialogueRevealed = false;

  var lastBlinkTime = 0;
  var nextBlinkInterval = 4.2;

  // Mouse / Touch Tracking (Eye Contact)
  function onPointerMove(clientX, clientY) {
    if (phase === "entrance") return;
    var rect = canvas.getBoundingClientRect();
    var mouseX = clientX - rect.left;
    var mouseY = clientY - rect.top;

    var dx = (mouseX - cx) / (W * 0.5);
    var dy = (mouseY - targetCy) / (H * 0.5);

    // Responsive 3D yaw and pitch
    targetYaw = Math.max(-0.52, Math.min(0.52, dx * 0.46));
    targetPitch = Math.max(-0.35, Math.min(0.35, dy * 0.32));
  }

  window.addEventListener("mousemove", function (e) {
    onPointerMove(e.clientX, e.clientY);
  }, { passive: true });

  window.addEventListener("touchmove", function (e) {
    if (e.touches && e.touches[0]) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Click Interaction: Playful bounce & wink
  canvas.addEventListener("click", function () {
    if (phase === "entrance") return;
    triggerPlayfulHop();
  });

  function triggerPlayfulHop() {
    var hopStart = performance.now();
    var duration = 480;
    function animHop(now) {
      var p = (now - hopStart) / duration;
      if (p < 1) {
        hopY = -Math.sin(p * Math.PI) * 14;
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

  // Render Loop
  var startTime = performance.now();

  function render(now) {
    var elapsedSec = (now - startTime) / 1000;

    // -------------------------------------------------------------
    // 1. CHOREOGRAPHY & CHARACTER ANIMATION TIMELINE
    // -------------------------------------------------------------
    if (reduceMotion) {
      curY = targetCy;
      yaw = 0; pitch = 0; roll = 0;
      scaleX = 1; scaleY = 1;
      smileProgress = 1;
      eyeWiden = 1;
      phase = "active";
      if (!dialogueRevealed && dialogueCard) {
        dialogueRevealed = true;
        dialogueCard.classList.add("is-visible");
        if (statusPillText) statusPillText.textContent = "Online & Glad you're here";
      }
    } else {
      // --- PHASE A: BOUNCY ENTRANCE FROM SKY (0.0s - 2.0s) ---
      if (elapsedSec < 2.0) {
        phase = "entrance";
        var t = elapsedSec;
        var startY = -R - 90;
        var floorY = targetCy;

        // Multi-bounce physical decay curve
        if (t < 0.65) {
          // Fall 1 (Accelerate with gravity)
          var p1 = t / 0.65;
          curY = startY + (floorY - startY) * (p1 * p1);
          // 3D Tumbling while dropping
          yaw = -Math.PI * 4.8 * (1 - p1 * 0.6);
          roll = Math.sin(p1 * Math.PI) * 0.22;
          pitch = (1 - p1) * 0.15;
          scaleX = 0.95; scaleY = 1.05; // Air stretch
        } else if (t < 0.78) {
          // Bounce 1 Impact & Squash!
          var pSquash = (t - 0.65) / 0.13;
          curY = floorY + Math.sin(pSquash * Math.PI) * 14;
          var squashAmt = Math.sin(pSquash * Math.PI) * 0.22;
          scaleY = 1.0 - squashAmt;
          scaleX = 1.0 + squashAmt * 0.9;
          yaw = -Math.PI * 2.2;
          roll = 0.05;
        } else if (t < 1.30) {
          // Rebound 1 (Arc up to 55px above targetCy)
          var p2 = (t - 0.78) / 0.52;
          var bounceH = 65;
          curY = floorY - Math.sin(p2 * Math.PI) * bounceH;
          yaw = -Math.PI * 2.2 * (1 - p2 * 0.65);
          roll = Math.sin(p2 * Math.PI) * -0.12;
          scaleX = 0.97; scaleY = 1.03;
        } else if (t < 1.42) {
          // Bounce 2 Impact & Smaller Squash
          var pSquash2 = (t - 1.30) / 0.12;
          curY = floorY + Math.sin(pSquash2 * Math.PI) * 6;
          var sAmt2 = Math.sin(pSquash2 * Math.PI) * 0.12;
          scaleY = 1.0 - sAmt2;
          scaleX = 1.0 + sAmt2 * 0.7;
          yaw = -Math.PI * 0.6;
        } else {
          // Final Settling Spring
          var p3 = (t - 1.42) / 0.58;
          var bounceH2 = 18;
          curY = floorY - Math.sin(p3 * Math.PI) * bounceH2 * (1 - p3);
          yaw = -Math.PI * 0.6 * (1 - p3);
          roll = 0;
          scaleX = 1; scaleY = 1;
        }

        smileProgress = 0;
        blink = 0;
        eyeWiden = 1.0;
      }
      // --- PHASE B: "NOTICES THE USER" DOUBLE-TAKE (2.0s - 3.4s) ---
      else if (elapsedSec < 3.4) {
        phase = "notice";
        curY += (targetCy - curY) * 0.15;
        scaleX = 1; scaleY = 1;

        var tNotice = elapsedSec - 2.0; // 0 to 1.4s

        if (tNotice < 0.55) {
          // Settles forward facing the camera
          yaw += (0 - yaw) * 0.15;
          pitch += (0 - pitch) * 0.15;
          roll += (0 - roll) * 0.15;
          eyeWiden = 1.0;
        } else if (tNotice < 1.0) {
          // THE DOUBLE-TAKE! Cocks head with curious surprise ("Wait, someone is watching me?!")
          var pSurprise = (tNotice - 0.55) / 0.45;
          var easedS = 1 - Math.pow(1 - pSurprise, 2);
          roll = easedS * 0.14; // +8 deg cute head tilt
          pitch = easedS * -0.08; // slightly looks up towards user
          yaw = easedS * -0.06;
          eyeWiden = 1.0 + easedS * 0.32; // Eyes widen in wonder!

          // Surprised blink in disbelief
          if (tNotice > 0.75 && tNotice < 0.95) {
            var bP = (tNotice - 0.75) / 0.20;
            blink = Math.sin(bP * Math.PI);
          } else {
            blink = 0;
          }

          if (statusPillText && statusPillText.textContent !== "Visitor detected... 👀") {
            statusPillText.textContent = "Visitor detected... 👀";
          }
        } else {
          // Pause and look right at the visitor with wide, curious eyes
          roll = 0.12;
          pitch = -0.06;
          eyeWiden = 1.30;
          blink = 0;
        }

        smileProgress = 0;
      }
      // --- PHASE C: DELIGHTED RECOGNITION & SMILE (3.4s - 4.1s) ---
      else if (elapsedSec < 4.1) {
        phase = "smile";
        var tSmile = elapsedSec - 3.4; // 0 to 0.7s

        // Head tilts back to joyful upright posture
        roll += (0 - roll) * 0.12;
        pitch += (0.02 - pitch) * 0.12;
        eyeWiden += (1.0 - eyeWiden) * 0.10;

        // Smile morphs from 0 to 1
        smileProgress = Math.min(1, tSmile / 0.45);

        // Buoyant joyful recognition hop!
        if (tSmile < 0.45) {
          hopY = -Math.sin((tSmile / 0.45) * Math.PI) * 9.5;
        } else {
          hopY = 0;
        }

        if (statusPillText && statusPillText.textContent !== "Spotted you! Welcome") {
          statusPillText.textContent = "Spotted you! Welcome";
          var statusDot = document.querySelector(".status-indicator");
          if (statusDot) statusDot.classList.add("is-online");
        }

        // Reveal Dialogue Card at 3.9s
        if (elapsedSec >= 3.9 && !dialogueRevealed) {
          dialogueRevealed = true;
          if (dialogueCard) dialogueCard.classList.add("is-visible");
        }
      }
      // --- PHASE D: LIVING INTERACTIVE EYE CONTACT (4.1s+) ---
      else {
        phase = "active";
        smileProgress = 1;
        eyeWiden = 1;

        // Attentive eye contact: tracks visitor's cursor across screen
        yaw += (targetYaw - yaw) * 0.08;
        pitch += (targetPitch - pitch) * 0.08;
        roll += (0 - roll) * 0.08;

        // Natural idle blinking every 4-5 seconds
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
    }

    // Gentle organic floating harmonic once settled
    var floatY = (phase === "active" || phase === "smile") ? Math.sin(elapsedSec * 1.8) * 5.5 : 0;
    var currentCy = curY + floatY + hopY;

    // -------------------------------------------------------------
    // 2. CLEAR & BACKGROUND STARDUST
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
    var shadowFloorY = targetCy + R + 42;
    var altitude = Math.max(0, shadowFloorY - (currentCy + R));
    var altitudeFactor = Math.max(0.05, Math.min(1.0, 1.0 - altitude / 350));

    var shadowRx = R * 0.85 * altitudeFactor * (scaleX || 1);
    var shadowRy = R * 0.19 * altitudeFactor * (scaleY || 1);
    var shadowAlpha = Math.max(0.04, Math.min(0.55, 0.45 * (altitudeFactor * altitudeFactor)));

    if (shadowRx > 2) {
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
    // 4. WHITE PORCELAIN MATTE 3D SPHERE (WITH SQUASH & STRETCH)
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(cx, currentCy);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-cx, -currentCy);

    var keyLightX = cx - R * 0.32;
    var keyLightY = currentCy - R * 0.36;

    var sphereGrad = ctx.createRadialGradient(keyLightX, keyLightY, R * 0.04, cx, currentCy, R * 1.05);
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

    // Luminous rim / fresnel edge backlight
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

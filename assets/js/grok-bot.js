/* ============================================================
   Grok-Inspired 3D Sphere Bot — Interactive Hero Engine
   - 1:1 circular aspect ratio with high-DPI Retina support
   - Snappy physical entrance: drops and bounces into view (0.0s - 0.85s)
   - Rotates on loading for ~2.3s with 3D spherical eye mapping (0.85s - 3.2s)
   - "Visitor detected" thinking effect: neural ripple waves + thought bubble (3.2s - 3.8s)
   - Delighted recognition & speech: hops, smiles, dialogue card emerges from mouth (3.8s+)
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
  var scrollCta = document.getElementById("bot-explore-cta");

  var ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Screen & Dimensions
  var W = 0, H = 0, DPR = 1;
  var R = 115; // Sphere radius in CSS px
  var cx = 0, targetCy = 0;

  // Ambient Stardust Particles
  var stars = [];
  var STAR_COUNT = 42;

  function initStars() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * (W || window.innerWidth),
        y: Math.random() * (H || 600),
        r: 0.7 + Math.random() * 1.3,
        alpha: 0.08 + Math.random() * 0.28,
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

  var curY = -180;
  var scaleX = 1;
  var scaleY = 1;

  var blink = 0;
  var eyeWiden = 1.0;
  var smileProgress = 0;
  var hopY = 0;

  var phase = "entrance"; // entrance -> spinning -> thinking -> smile -> active
  var lastBlinkTime = 0;
  var nextBlinkInterval = 4.2;

  // Mouth coordinates in screen pixels
  var screenMouthX = 0;
  var screenMouthY = 0;

  // Speech Bubble State Machine: 'hidden' | 'thinking' | 'closing_thinking' | 'speaking' | 'swallowed'
  var bubbleState = "hidden";
  var isMuted = true; // By default kept in mute per user instructions
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
    if (isMuted || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      playCuteChirp();

      var text = "In a world that never stops rushing, thank you for taking a moment to pause here.";
      speechUtterance = new SpeechSynthesisUtterance(text);
      if (!availableVoice) availableVoice = pickCuteMaleVoice();
      if (availableVoice) speechUtterance.voice = availableVoice;

      // Cute male AI companion tuning:
      // Pitch: 1.22 gives an energetic, friendly, adorable young AI character tone
      // Rate: 1.04 keeps it lively, articulate, and crisp
      speechUtterance.pitch = 1.22;
      speechUtterance.rate = 1.04;
      speechUtterance.volume = 1.0;

      window.speechSynthesis.speak(speechUtterance);
    } catch (e) {
      console.warn("Speech synthesis error", e);
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
        if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      } else {
        soundBtn.classList.add("is-active");
        soundBtn.setAttribute("aria-label", "Mute bot voice");
        soundBtn.setAttribute("title", "Mute bot voice");
        if (iconMuted) iconMuted.style.display = "none";
        if (iconOn) iconOn.style.display = "block";
        if (soundLabel) soundLabel.textContent = "Mute Voice";

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
        '<span>💭 Visitor detected</span>' +
        '<span class="thinking-dots"><span></span><span></span><span></span></span>' +
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
    bubbleEl.className = "bot-mouth-bubble is-open is-speaking";
    if (bubbleInner) {
      bubbleInner.innerHTML =
        '<p class="bubble-speech-text"><span class="bubble-speech-quote">&ldquo;</span>In a world that never stops rushing, thank you for taking a moment to pause here.<span class="bubble-speech-quote">&rdquo;</span></p>' +
        '<span class="bubble-tap-hint">tap to swallow</span>';
    }
  }

  function swallowSpeechBubble() {
    if (!bubbleEl) return;
    bubbleState = "swallowed";
    bubbleEl.className = "bot-mouth-bubble is-closing";
    if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  }

  if (bubbleEl) {
    bubbleEl.addEventListener("click", function (e) {
      e.stopPropagation();
      if (bubbleState === "speaking") {
        swallowSpeechBubble();
      }
    });
  }

  // Mouse / Pointer Eye Contact Tracking
  function onPointerMove(clientX, clientY) {
    if (phase === "entrance" || phase === "spinning") return;
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
    if (phase === "entrance") return;
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
    var elapsedSec = (debugTime !== null) ? debugTime : (now - startTime) / 1000;

    // -------------------------------------------------------------
    // 1. TIMELINE & CHOREOGRAPHY
    // -------------------------------------------------------------

    // --- PHASE 1: PHYSICAL ENTRANCE (0.0s - 0.85s) ---
    if (elapsedSec < 0.85) {
      phase = "entrance";
      var t = elapsedSec;
      var floorY = targetCy;

      if (t < 0.44) {
        var pFall = t / 0.44;
        curY = -R - 80 + (floorY - (-R - 80)) * (pFall * pFall);
        scaleX = 0.94; scaleY = 1.08;
        yaw = -Math.PI * 4.0;
      } else if (t < 0.58) {
        var pSq = (t - 0.44) / 0.14;
        curY = floorY;
        var sq = Math.sin(pSq * Math.PI);
        scaleX = 1.0 + sq * 0.18;
        scaleY = 1.0 - sq * 0.18;
        yaw = -Math.PI * 4.0;
      } else if (t < 0.76) {
        var pRb = (t - 0.58) / 0.18;
        curY = floorY - Math.sin(pRb * Math.PI) * 22;
        scaleX = 0.96; scaleY = 1.05;
        yaw = -Math.PI * 4.0;
      } else {
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
      var easedSpin = 1 - Math.pow(1 - spinProg, 2.5);

      yaw = -Math.PI * 4.0 * (1 - easedSpin);
      pitch = Math.sin(tSpin * 3.5) * 0.04 * (1 - spinProg);
      roll = Math.sin(tSpin * 4.0) * 0.03 * (1 - spinProg);

      smileProgress = 0;
      blink = 0;
      eyeWiden = 1.0;
    }
    // --- PHASE 3: THINKING EFFECT / VISITOR DETECTED (3.2s - 3.8s) ---
    else if (elapsedSec < 3.8) {
      phase = "thinking";
      curY = targetCy;
      scaleX = 1; scaleY = 1;

      var tThink = elapsedSec - 3.2; // 0 to 0.6s
      var pThink = Math.min(1, tThink / 0.45);

      // Cocks head inquisitively (+9 deg roll, looking slightly up)
      roll = Math.sin(pThink * Math.PI * 0.5) * 0.15;
      pitch = -0.06 * Math.sin(pThink * Math.PI * 0.5);
      yaw = -0.04 * Math.sin(pThink * Math.PI * 0.5);

      // Wide inquisitive eyes
      eyeWiden = 1.0 + Math.sin(pThink * Math.PI * 0.5) * 0.28;

      // Thinking blink
      if (tThink > 0.12 && tThink < 0.32) {
        var bP = (tThink - 0.12) / 0.20;
        blink = Math.sin(bP * Math.PI);
      } else {
        blink = 0;
      }

      smileProgress = 0;

      if (elapsedSec < 3.72) {
        showThinkingBubble();
      } else {
        retractThinkingBubble();
      }
    }
    // --- PHASE 4: DELIGHTED RECOGNITION & SMILE (3.8s - 4.3s) ---
    else if (elapsedSec < 4.3) {
      phase = "smile";
      curY = targetCy;
      var tSm = elapsedSec - 3.8; // 0 to 0.5s

      roll += (0 - roll) * 0.12;
      pitch += (0.02 - pitch) * 0.12;
      eyeWiden += (1.0 - eyeWiden) * 0.10;

      smileProgress = Math.min(1, tSm / 0.32);

      // Happy recognition hop
      if (tSm < 0.36) {
        hopY = -Math.sin((tSm / 0.36) * Math.PI) * 9.5;
      } else {
        hopY = 0;
      }

      if (elapsedSec >= 3.88 && bubbleState !== "speaking" && bubbleState !== "swallowed") {
        openSpeechBubble();
        if (!speechTriggered && !isMuted) {
          speechTriggered = true;
          speakGreeting();
        }
      }
    }
    // --- PHASE 5: LIVING INTERACTIVE EYE CONTACT (4.3s+) ---
    else {
      phase = "active";
      curY = targetCy;
      smileProgress = 1;
      eyeWiden = 1.0;

      if (bubbleState !== "speaking" && bubbleState !== "swallowed") {
        openSpeechBubble();
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

    var floatY = (elapsedSec >= 0.85) ? Math.sin(elapsedSec * 1.8) * 5.5 : 0;
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
      bubbleEl.style.setProperty("--mouth-x", screenMouthX.toFixed(1) + "px");
      bubbleEl.style.setProperty("--mouth-y", screenMouthY.toFixed(1) + "px");
      bubbleEl.style.setProperty("--bubble-y", bubbleTop.toFixed(1) + "px");
    }

    // -------------------------------------------------------------
    // 2. CLEAR CANVAS & BACKGROUND STARDUST
    // -------------------------------------------------------------
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      s.x += s.vx;
      s.y += s.vy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;

      var pulse = 0.8 + Math.sin(elapsedSec * 2.5 + i) * 0.2;
      ctx.fillStyle = "rgba(255, 255, 255, " + (s.alpha * pulse).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // -------------------------------------------------------------
    // 3. THINKING NEURAL RIPPLE WAVES (EMITS AROUND HEAD)
    // -------------------------------------------------------------
    if (phase === "thinking") {
      var thinkT = (elapsedSec - 3.2);
      for (var w = 0; w < 3; w++) {
        var waveProg = ((thinkT * 2.2 + w * 0.33) % 1.0);
        var waveRadius = R * (1.06 + waveProg * 0.42);
        var waveAlpha = (1.0 - waveProg) * 0.40;

        ctx.strokeStyle = "rgba(165, 180, 252, " + waveAlpha.toFixed(3) + ")";
        ctx.lineWidth = Math.max(1.5, 3.2 * (1.0 - waveProg));
        ctx.beginPath();
        ctx.arc(cx, currentCy - R * 0.12, waveRadius, -Math.PI * 0.88, -Math.PI * 0.12);
        ctx.stroke();
      }
    }

    // -------------------------------------------------------------
    // 4. DYNAMIC GROUND SHADOW
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
    // 5. WHITE PORCELAIN MATTE 3D SPHERE
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
    sphereGrad.addColorStop(0.78, "#94a3b8");
    sphereGrad.addColorStop(0.94, "#64748b");
    sphereGrad.addColorStop(1.00, "#475569");

    ctx.beginPath();
    ctx.arc(cx, currentCy, R, 0, Math.PI * 2);
    ctx.fillStyle = sphereGrad;
    ctx.fill();

    var rimGrad = ctx.createRadialGradient(cx, currentCy, R * 0.84, cx, currentCy, R);
    rimGrad.addColorStop(0.0, "rgba(255, 255, 255, 0)");
    rimGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.12)");
    rimGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.32)");
    ctx.beginPath();
    ctx.arc(cx, currentCy, R, 0, Math.PI * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    ctx.restore();

    // -------------------------------------------------------------
    // 6. 3D PROJECTED EYES & REAL-TIME LIP-SYNC MOUTH
    // -------------------------------------------------------------
    renderEye(EYE_LEFT, currentCy, false);
    renderEye(EYE_RIGHT, currentCy, true);
    renderSmile(currentCy, elapsedSec);

    requestAnimationFrame(render);
  }

  // =============================================================
  // 3D EYE PROJECTION & RENDERING
  // =============================================================
  function renderEye(eyeCoord, sphereY, isRightEye) {
    var p0 = sphericalTo3D(eyeCoord.phi, eyeCoord.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.02) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.18, pRot.z);
    var baseEyeW = R * 0.090 * normalForeshorten;
    var baseEyeH = R * 0.115 * eyeWiden;

    var openFactor = Math.max(0.06, 1.0 - blink);
    var curEyeH = baseEyeH * openFactor;

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(pRot.x * 0.32 + roll);

    var sm = smileProgress;

    if (sm < 0.55) {
      // Curious inquisitive eye (●)
      var morphW = baseEyeW * (1.0 + sm * 0.25);
      var morphH = curEyeH * (1.0 - sm * 0.45);

      ctx.fillStyle = "#090a0f";
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(1.8, morphW), Math.max(1.5, morphH), 0, 0, Math.PI * 2);
      ctx.fill();

      if (openFactor > 0.45) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(baseEyeW * 0.28, -curEyeH * 0.30, Math.max(1.2, baseEyeW * 0.30), 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Joyful smiling crescent (⌒)
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

  // =============================================================
  // REAL-TIME LIP-SYNC SMILE MOUTH RENDERING
  // =============================================================
  function renderSmile(sphereY, elapsedSec) {
    var p0 = sphericalTo3D(MOUTH_CENTER.phi, MOUTH_CENTER.theta);
    var pRot = rotate3D(p0, yaw, pitch, roll);

    if (pRot.z <= 0.05) return;

    var screenX = cx + R * pRot.x;
    var screenY = sphereY + R * pRot.y;

    var normalForeshorten = Math.max(0.15, pRot.z);

    // Dynamic lip-sync speech oscillation
    var isSpeakingNow = (bubbleState === "speaking" && elapsedSec < 6.8) || ("speechSynthesis" in window && window.speechSynthesis.speaking);
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

  // =============================================================
  // CTA SCROLL ACTION HOOK
  // =============================================================
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

  // Initialize
  resize();
  window.addEventListener("resize", resize);
  requestAnimationFrame(render);

})();

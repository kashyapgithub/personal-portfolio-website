/* ============================================================
   B. Kashyap — Product | Agentic AI Development
   Progressive enhancement: 100% vanilla JS, zero dependencies.
   Content source: LinkedIn "send to agent" export in repo.
   All role/latency claims are profile-quoted, not benchmarked.
   Features:
   - Dynamic Hero Word Rotator
   - Cascading Illuminated Workflow Line
   - Illustrative Engine Console Demo
   - Interactive Work Tab Panels
   - Scroll Reveal Animations
   - Theme Persistence (Dark / Light)
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------
     1. Theme: dark only (no toggle)
     ------------------------------------------------------------ */
  document.documentElement.setAttribute("data-theme", "dark");

  /* ------------------------------------------------------------
     2. Copy Email with Toast Feedback
     ------------------------------------------------------------ */
  var copyBtn = document.getElementById("copy-email-btn");
  var toast = document.getElementById("copy-toast");

  if (copyBtn && toast) {
    copyBtn.addEventListener("click", async function () {
      var email = "bhabajitkashyapik@gmail.com";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          var textarea = document.createElement("textarea");
          textarea.value = email;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        showToast("Email copied: " + email);
      } catch (err) {
        showToast("Contact: " + email);
      }
    });

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(function () {
        toast.classList.remove("show");
      }, 2800);
    }
  }

  /* ------------------------------------------------------------
     3. Hero Headline Rotator (6 Systems Specialties)
     ------------------------------------------------------------ */
  (function heroRotate() {
    var slot = document.getElementById("hero-rotate");
    if (!slot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var specializations = [
      "risk management engines",
      "alpha generation (Genie 2.0)",
      "TUI observability",
      "product UI/UX",
      "dry-run verification",
      "agentic AI development"
    ];
    var i = 0;

    setInterval(function () {
      if (document.hidden) return;
      slot.classList.add("out");
      setTimeout(function () {
        i = (i + 1) % specializations.length;
        slot.textContent = specializations[i];
        void slot.offsetWidth;
        slot.classList.remove("out");
      }, 320);
    }, 2600);
  })();

  /* ------------------------------------------------------------
     4. Hero Workflow Cascade: Steps illuminate sequentially
     ------------------------------------------------------------ */
  (function workflow() {
    var flow = document.querySelector(".mock-flow ol");
    if (!flow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    var items = Array.prototype.slice.call(flow.querySelectorAll("li"));
    if (items.length === 0) return;

    flow.classList.add("cascade");
    items.forEach(function (li) {
      var dot = document.createElement("span");
      dot.className = "st";
      dot.setAttribute("aria-hidden", "true");
      li.insertBefore(dot, li.firstChild);
    });

    var index = -1;
    var timer = null;

    /* Live telemetry counters bumping — illustrative only, profile-quoted range */
    var statEls = Array.prototype.slice.call(
      document.querySelectorAll(".mock-stats .ms-value")
    );

    var bump = function (el, text) {
      el.textContent = text;
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    };

    var nudgeNumbers = function () {
      if (statEls.length < 1) return;
      // Keep the profile-quoted 12–100 μs range; drift inside it for effect only.
      var lat = (12 + Math.random() * 88).toFixed(0);
      bump(statEls[0], lat + " μs · per profile");
    };

    var show = function (i) {
      items.forEach(function (li, j) {
        li.classList.toggle("lit", j <= i);
        li.classList.toggle("running", j === i);
      });
      flow.classList.toggle("complete", i >= items.length - 1);
      if (items[0]) {
        var first = items[0].offsetTop + items[0].offsetHeight / 2;
        var current = i >= 0 && items[i]
          ? items[i].offsetTop + items[i].offsetHeight / 2
          : first;
        flow.style.setProperty("--dashTop", first + "px");
        flow.style.setProperty("--dashH", Math.max(0, current - first) + "px");
      }
    };

    var stop = function () {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    };

    var start = function () {
      if (timer !== null || document.hidden) return;
      var tick = function () {
        if (document.hidden) return;
        index = index + 1;
        if (index > items.length) {
          index = -1;
        }
        if (index === items.length - 1) {
          nudgeNumbers();
        }
        show(index);
      };
      tick();
      timer = setInterval(tick, 1200);
    };

    var inView = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        inView = entry.isIntersecting;
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      });
    }, { threshold: 0.25 }).observe(flow);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stop();
      } else if (inView) {
        start();
      }
    });
  })();

  /* ------------------------------------------------------------
     5. Hero console note: static roadmap line (no fake sync %)
     ------------------------------------------------------------ */
  (function liveAnalyzing() {
    // Intentionally static: the "early 2027" line is a roadmap date from
    // the LinkedIn profile, not a live sync percentage. Do nothing.
    return;
  })();

  /* ------------------------------------------------------------
     6. Interactive Architecture Tabs
     ------------------------------------------------------------ */
  (function initTabs() {
    var tabContainers = document.querySelectorAll("[data-tabs]");
    tabContainers.forEach(function (container) {
      var tabs = container.querySelectorAll(".tab");
      var panels = container.querySelectorAll(".tab-panel");

      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
          var targetId = tab.getAttribute("aria-controls");
          tabs.forEach(function (t) {
            t.classList.remove("is-active");
            t.setAttribute("aria-selected", "false");
          });
          panels.forEach(function (p) {
            p.classList.remove("is-active");
          });

          tab.classList.add("is-active");
          tab.setAttribute("aria-selected", "true");
          var targetPanel = document.getElementById(targetId);
          if (targetPanel) {
            targetPanel.classList.add("is-active");
          }
        });
      });
    });
  })();

  /* ------------------------------------------------------------
     7. Engine Console Demo Controls (illustrative UI only)
     ------------------------------------------------------------ */
  (function initRaftSim() {
    var termVal = document.getElementById("sim-raft-term");
    var commitVal = document.getElementById("sim-raft-commit");
    var quorumVal = document.getElementById("sim-raft-quorum");
    var btnHeartbeat = document.getElementById("sim-btn-heartbeat");
    var btnPartition = document.getElementById("sim-btn-partition");
    var btnElection = document.getElementById("sim-btn-election");

    if (!termVal || !btnHeartbeat) return;

    var checks = ["Passing", "Reviewing", "Passing", "Strict"];
    var checkIdx = 0;
    var verified = 1042;
    var dryRunOn = true;

    btnHeartbeat.addEventListener("click", function () {
      verified += 1;
      commitVal.textContent = verified.toLocaleString("en-US");
      commitVal.classList.remove("bump");
      void commitVal.offsetWidth;
      commitVal.classList.add("bump");
    });

    btnPartition.addEventListener("click", function () {
      dryRunOn = !dryRunOn;
      if (dryRunOn) {
        quorumVal.textContent = "Live · Dry-run on";
        quorumVal.classList.add("ok");
        quorumVal.style.color = "";
        btnPartition.textContent = "Toggle Dry-Run";
      } else {
        quorumVal.textContent = "Live · Dry-run bypassed (demo)";
        quorumVal.classList.remove("ok");
        quorumVal.style.color = "var(--signal-amber)";
        btnPartition.textContent = "Re-enable Dry-Run";
      }
    });

    btnElection.addEventListener("click", function () {
      checkIdx = (checkIdx + 1) % checks.length;
      termVal.textContent = checks[checkIdx];
      termVal.classList.remove("bump");
      void termVal.offsetWidth;
      termVal.classList.add("bump");
    });
  })();

  /* ------------------------------------------------------------
     8. Scroll Reveal (IntersectionObserver)
     ------------------------------------------------------------ */
  (function initReveal() {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* ------------------------------------------------------------
     9. Lazy-loaded "Chapters of Our Lives" reader
     The modal/genie engine is ~2300 lines, so it lives in
     chapters.js and is fetched only when the shelf approaches or
     a book is hovered/clicked.
     ------------------------------------------------------------ */
  (function lazyChapterReader() {
    var cards = document.querySelectorAll(".book-card");
    if (!cards.length) return;

    var loaded = false;
    var loading = null;
    var pending = null;

    function load() {
      if (loaded) return Promise.resolve();
      if (loading) return loading;
      loading = new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.src = "assets/js/chapters.min.js?v=1";
        script.async = true;
        script.onload = function () {
          loaded = true;
          resolve();
        };
        script.onerror = function () {
          loading = null;
          reject(new Error("Unable to load chapters.js"));
        };
        document.head.appendChild(script);
      });
      return loading;
    }

    function openPending() {
      if (pending === null) return;
      var bookId = pending;
      pending = null;
      var card = document.querySelector('.book-card[data-book-id="' + bookId + '"]');
      if (window.__chapterReader && typeof window.__chapterReader.open === "function") {
        window.__chapterReader.open(bookId, card);
      } else if (card) {
        card.click();
      }
    }

    function queueOpen(card) {
      if (loaded) return;
      pending = card.getAttribute("data-book-id");
      load().then(openPending, function () {
        pending = null;
      });
    }

    function prefetch() {
      load().catch(function () { /* the click path retries */ });
    }

    cards.forEach(function (card) {
      card.addEventListener("pointerenter", prefetch, { once: true, passive: true });
      card.addEventListener("focus", prefetch, { once: true });
      card.addEventListener("touchstart", prefetch, { once: true, passive: true });
      card.addEventListener("click", function () {
        if (loaded) return;
        queueOpen(card);
      });
    });

    // Start fetching once the first book actually enters the viewport.
    // The hero is full-height, so observing #work with a large rootMargin
    // would fetch the reader during the intro and defeat the split.
    var trigger = document.querySelector(".book-card") || document.getElementById("work");
    if (trigger && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          io.disconnect();
          load();
        }
      }, { rootMargin: "0px" });
      io.observe(trigger);
    } else {
      load();
    }
  })();

  /* ------------------------------------------------------------
     10. Trust Section: Bioluminescent Node Web
     A dense web of phosphor-green nodes, like algae lighting up in
     dark water. Nodes drift and connect with thick glowing edges;
     hovering pushes them away and shifts nearby nodes into random
     cool blues and cyans, which fade back to green afterwards.
     Canvas-based and dependency-free.
     ------------------------------------------------------------ */
  (function initTrustNetwork() {
    var section = document.querySelector('[data-od-id="trust"]');
    var canvas = document.getElementById("trust-net");
    if (!section || !canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canvasW = 0;
    var canvasH = 0;
    var dpr = 1;
    var particles = [];
    var glowSprites = [];
    var rafId = null;
    var running = false;
    var visible = true;
    var pointer = { x: -9999, y: -9999, active: false };

    var TAU = Math.PI * 2;
    var LINK_DIST = 130;
    var LINK_DIST2 = LINK_DIST * LINK_DIST;
    var POINTER_DIST = 190;
    var POINTER_DIST2 = POINTER_DIST * POINTER_DIST;
    var LIGHT_DIST = 260;
    var LIGHT_DIST2 = LIGHT_DIST * LIGHT_DIST;
    var LINK_WIDTH = 1.9;
    var POINTER_WIDTH = 2.2;
    var BUCKETS = 6;
    var linkBuckets = [];
    for (var lb = 0; lb < BUCKETS; lb++) linkBuckets.push([]);
    var hotLinks = [];
    var flow = 0;

    // Default bioluminescent algae greens, brightest first: seafoam,
    // mint, emerald, deep sea, shadowed weed.
    var COLORS = [
      [0, 255, 130],
      [80, 255, 170],
      [0, 230, 150],
      [20, 190, 130],
      [0, 150, 100]
    ];

    // Cool "disturbed plankton" colours: cyans, blues, aqua.
    var HOVER_COLORS = [
      [0, 225, 255],
      [64, 140, 255],
      [0, 255, 190],
      [120, 160, 255],
      [30, 255, 230],
      [90, 120, 255]
    ];

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    // ---- Node web ----
    function makeGlowSprites() {
      glowSprites = [];
      var all = COLORS.concat(HOVER_COLORS);
      for (var i = 0; i < all.length; i++) {
        var size = 128;
        var cvs = document.createElement("canvas");
        cvs.width = size;
        cvs.height = size;
        var g = cvs.getContext("2d");
        var c = all[i];
        var rgb = c[0] + ", " + c[1] + ", " + c[2];
        var grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        grad.addColorStop(0, "rgba(" + rgb + ", 0.9)");
        grad.addColorStop(0.3, "rgba(" + rgb + ", 0.28)");
        grad.addColorStop(1, "rgba(" + rgb + ", 0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        glowSprites.push(cvs);
      }
    }

    function makeParticles() {
      particles = [];
      var count = Math.round((canvasW * canvasH) / 4700);
      count = Math.max(90, Math.min(340, count));

      for (var i = 0; i < count; i++) {
        var angle = Math.random() * TAU;
        var speed = rand(0.12, 0.34);
        var ci = (Math.random() * COLORS.length) | 0;
        var c = COLORS[ci];
        var alpha = rand(0.45, 0.95);
        particles.push({
          x: Math.random() * canvasW,
          y: Math.random() * canvasH,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          bvx: Math.cos(angle) * speed,
          bvy: Math.sin(angle) * speed,
          r: rand(0.7, 1.6),
          ci: ci,
          base: c,
          cr: c[0],
          cg: c[1],
          cb: c[2],
          rgb: c[0] + ", " + c[1] + ", " + c[2],
          alpha: alpha,
          aNow: alpha,
          heat: 0,
          hover: null,
          hoverCi: -1,
          phase: Math.random() * TAU,
          pulse: rand(0.008, 0.02)
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvasW, canvasH);
      var i, j, a, b, dx, dy, d2, alpha, dist;

      // Additive compositing: crossings of thick edges glow brighter
      ctx.globalCompositeOperation = "lighter";

      // Node-to-node links in terminal green. With 3-digit node counts,
      // thousands of per-link strokes would dominate the frame, so pairs
      // are bucketed by alpha (6 levels) and each bucket is stroked as
      // one path -- 6 stroke calls total instead of thousands. Links
      // touching a "lit" node are pulled out and tinted individually.
      ctx.lineWidth = LINK_WIDTH;
      for (i = 0; i < BUCKETS; i++) linkBuckets[i].length = 0;
      hotLinks.length = 0;

      for (i = 0; i < particles.length; i++) {
        a = particles[i];
        for (j = i + 1; j < particles.length; j++) {
          b = particles[j];
          dx = a.x - b.x;
          dy = a.y - b.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST2) {
            dist = Math.sqrt(d2);
            if (a.heat > 0.03 || b.heat > 0.03) {
              hotLinks.push(a, b, 1 - dist / LINK_DIST);
            } else {
              var bi = ((1 - dist / LINK_DIST) * BUCKETS) | 0;
              if (bi >= BUCKETS) bi = BUCKETS - 1;
              linkBuckets[bi].push(a.x, a.y, b.x, b.y);
            }
          }
        }
      }

      for (i = 0; i < BUCKETS; i++) {
        var coords = linkBuckets[i];
        if (!coords.length) continue;
        alpha = ((i + 0.5) / BUCKETS) * 0.32;
        ctx.strokeStyle = "rgba(0, 255, 130, " + alpha.toFixed(3) + ")";
        ctx.beginPath();
        for (var k = 0; k < coords.length; k += 4) {
          ctx.moveTo(coords[k], coords[k + 1]);
          ctx.lineTo(coords[k + 2], coords[k + 3]);
        }
        ctx.stroke();
      }

      // Lit links: average the two endpoints' current (blended) colours
      for (i = 0; i < hotLinks.length; i += 3) {
        a = hotLinks[i];
        b = hotLinks[i + 1];
        alpha = hotLinks[i + 2] * 0.5;
        var rr = (a.cr + b.cr) * 0.5 | 0;
        var gg = (a.cg + b.cg) * 0.5 | 0;
        var bb = (a.cb + b.cb) * 0.5 | 0;
        ctx.strokeStyle = "rgba(" + rr + ", " + gg + ", " + bb + ", " + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // Cursor links pull in each node's current colour
      if (pointer.active) {
        ctx.lineWidth = POINTER_WIDTH;
        for (i = 0; i < particles.length; i++) {
          a = particles[i];
          dx = a.x - pointer.x;
          dy = a.y - pointer.y;
          d2 = dx * dx + dy * dy;
          if (d2 < POINTER_DIST2) {
            dist = Math.sqrt(d2);
            alpha = (1 - dist / POINTER_DIST) * 0.6;
            ctx.strokeStyle = "rgba(" + a.rgb + ", " + alpha.toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(pointer.x, pointer.y);
            ctx.lineTo(a.x, a.y);
            ctx.stroke();
          }
        }
      }

      // Nodes: green glow crossfades into the cool hover glow
      for (i = 0; i < particles.length; i++) {
        a = particles[i];
        var v = a.aNow;
        var gr = a.r * 6;
        var baseAlpha = Math.min(1, v * 0.65) * (1 - a.heat);

        if (baseAlpha > 0.003) {
          ctx.globalAlpha = baseAlpha;
          ctx.drawImage(glowSprites[a.ci], a.x - gr, a.y - gr, gr * 2, gr * 2);
        }
        if (a.heat > 0.01) {
          var hgr = gr * 1.25;
          ctx.globalAlpha = Math.min(1, v * 0.95) * a.heat;
          ctx.drawImage(glowSprites[COLORS.length + a.hoverCi], a.x - hgr, a.y - hgr, hgr * 2, hgr * 2);
        }
        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.fillStyle = "rgba(" + a.rgb + ", " + (v * 0.95).toFixed(3) + ")";
        ctx.arc(a.x, a.y, a.r, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    }

    function step() {
      var px = pointer.x;
      var py = pointer.y;
      var active = pointer.active;
      flow += 0.005;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var dx, dy, d2, dist, force;
        var lit = false;

        if (active) {
          dx = p.x - px;
          dy = p.y - py;
          d2 = dx * dx + dy * dy;

          // Light radius is deliberately wider than push radius, so
          // nodes glow cool even as the cursor clears them away.
          if (d2 < LIGHT_DIST2) {
            lit = true;
            if (!p.hover) {
              p.hoverCi = (Math.random() * HOVER_COLORS.length) | 0;
              p.hover = HOVER_COLORS[p.hoverCi];
            }
          }

          // Repel from the cursor, squaring force for a soft edge
          if (d2 < POINTER_DIST2 && d2 > 0.000001) {
            dist = Math.sqrt(d2);
            force = 1 - dist / POINTER_DIST;
            force *= force * 0.9;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Bioluminescent heat: light up fast, fade back slowly
        var target = lit ? 1 : 0;
        p.heat += (target - p.heat) * (lit ? 0.14 : 0.05);
        if (!lit && p.heat < 0.01) {
          p.heat = 0;
          p.hover = null;
          p.hoverCi = -1;
          p.cr = p.base[0];
          p.cg = p.base[1];
          p.cb = p.base[2];
          p.rgb = p.base[0] + ", " + p.base[1] + ", " + p.base[2];
        } else if (p.hover && p.heat > 0) {
          p.cr = (p.base[0] + (p.hover[0] - p.base[0]) * p.heat) | 0;
          p.cg = (p.base[1] + (p.hover[1] - p.base[1]) * p.heat) | 0;
          p.cb = (p.base[2] + (p.hover[2] - p.base[2]) * p.heat) | 0;
          p.rgb = p.cr + ", " + p.cg + ", " + p.cb;
        }

        // Ease back toward the particle's natural drift
        p.vx += (p.bvx - p.vx) * 0.018;
        p.vy += (p.bvy - p.vy) * 0.018;

        // Gentle ambient current, like water moving over algae
        p.vx += Math.cos(p.y * 0.01 + flow) * 0.0012;
        p.vy += Math.sin(p.x * 0.01 + flow * 0.8) * 0.0012;

        // Slow twinkle so the web breathes
        p.phase += p.pulse;
        p.aNow = p.alpha * (0.8 + 0.2 * Math.sin(p.phase));

        // Speed limit so a fast swipe doesn't launch nodes
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 2.6) {
          p.vx = (p.vx / speed) * 2.6;
          p.vy = (p.vy / speed) * 2.6;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off the section edges, flipping the drift too
        if (p.x < 0) { p.x = 0; p.vx *= -1; p.bvx *= -1; }
        else if (p.x > canvasW) { p.x = canvasW; p.vx *= -1; p.bvx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; p.bvy *= -1; }
        else if (p.y > canvasH) { p.y = canvasH; p.vy *= -1; p.bvy *= -1; }
      }
    }

    function frame() {
      rafId = null;
      if (!running || !visible) return;
      step();
      draw();
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      running = true;
      if (!reduceMotion && rafId === null) rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    function resize() {
      var rect = section.getBoundingClientRect();
      canvasW = Math.max(1, Math.round(rect.width));
      canvasH = Math.max(1, Math.round(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      makeGlowSprites();
      makeParticles();
      draw();
    }

    // Pointer is tracked on the section so hovering a card still works
    section.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    }, { passive: true });

    section.addEventListener("pointerleave", function () {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    });

    if ("ResizeObserver" in window) {
      new ResizeObserver(resize).observe(section);
    } else {
      window.addEventListener("resize", resize);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible && !document.hidden) start();
        else stop();
      }, { threshold: 0, rootMargin: "120px 0px" }).observe(section);
    } else {
      start();
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else if (visible) start();
    });

    resize();
  })();

  /* ------------------------------------------------------------
     11. Smart Sticky Nav Bar Header (Hide on Scroll Down, Reveal on Scroll Up)
     ------------------------------------------------------------ */
  (function initSmartHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    var ticking = false;
    var scrollThreshold = 8; // Small threshold for responsive detection

    function updateHeader() {
      var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
      var diff = currentScrollY - lastScrollY;

      // When at or near the very top of the page, always keep header visible
      if (currentScrollY <= 60) {
        header.classList.remove("is-hidden");
      } else if (Math.abs(diff) > scrollThreshold) {
        if (diff > 0) {
          // Scrolling DOWN -> smoothly hide out of view
          header.classList.add("is-hidden");
        } else {
          // Scrolling UP -> smoothly slide back into view
          header.classList.remove("is-hidden");
        }
      }
      lastScrollY = currentScrollY;

      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ------------------------------------------------------------
     12. Character Select: Neumorphic Tiles
     One active tile at a time. Kept as toggle buttons so the
     pressed state is conveyed to keyboard and screen-reader users.
     ------------------------------------------------------------ */
  (function initCharacterSelect() {
    var grid = document.querySelector(".characters-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".character-card"));

    function select(card) {
      cards.forEach(function (other) {
        var isSelected = other === card;
        var label = other.getAttribute("data-label") || other.getAttribute("aria-label") || "Character";

        other.classList.toggle("is-selected", isSelected);
        other.setAttribute("aria-pressed", isSelected ? "true" : "false");
        other.setAttribute(
          "aria-label",
          (isSelected ? "Selected: " : "") + label.replace(/^Selected: /, "")
        );
      });
    }

    cards.forEach(function (card) {
      var current = card.getAttribute("aria-label");
      if (current) card.setAttribute("data-label", current.replace(/^Selected: /, ""));

      card.addEventListener("click", function () {
        select(card);
      });
    });
  })();

})();

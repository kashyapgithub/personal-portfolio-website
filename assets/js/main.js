/* ============================================================
   Bhabajit Kashyap — Personal Portfolio & Systems Engineering
   Progressive enhancement: 100% vanilla JS, zero dependencies.
   Features:
   - Dynamic Hero Word Rotator
   - Cascading Illuminated Workflow Line
   - Live Auto-Bumping Metrics & Sparklines
   - Ticking Progress & Telemetry Pipeline
   - Interactive Architecture Tab Panels & Raft Simulator
   - Scroll Reveal Animations
   - Theme Persistence (Dark / Light)
   ============================================================ */

(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* ------------------------------------------------------------
     1. Theme Management (System-aware + LocalStorage)
     ------------------------------------------------------------ */
  var themeToggleBtn = document.getElementById("theme-toggle-btn");
  var currentTheme = localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");

  document.documentElement.setAttribute("data-theme", currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      var active = document.documentElement.getAttribute("data-theme");
      var next = active === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

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
      "distributed consensus",
      "ultra-low-latency HFT",
      "autonomous agent systems",
      "lock-free concurrency",
      "multi-agent MCP protocols",
      "fault-tolerant ledgers"
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

    /* Live telemetry counters bumping */
    var statEls = Array.prototype.slice.call(
      document.querySelectorAll(".mock-stats .ms-value")
    );
    var baseProcessed = 14291847;
    var baseLatency = 1.42;
    var processed = baseProcessed;

    var bump = function (el, text) {
      el.textContent = text;
      el.classList.remove("bump");
      void el.offsetWidth;
      el.classList.add("bump");
    };

    var nudgeNumbers = function () {
      if (statEls.length < 3) return;
      processed += 12;
      bump(statEls[0], processed.toLocaleString("en-US"));
      var lat = (1.35 + Math.random() * 0.18).toFixed(2);
      bump(statEls[1], lat + " μs");
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
     5. Hero Telemetry Table: Live analyzing loop
     ------------------------------------------------------------ */
  (function liveAnalyzing() {
    var text = document.querySelector(".conf-live .conf-text");
    if (!text) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var pct = 32;
    setInterval(function () {
      if (document.hidden) return;
      pct += 4 + Math.floor(Math.random() * 5);
      if (pct >= 98) {
        pct = 24 + Math.floor(Math.random() * 10);
      }
      text.textContent = pct + "% synced";
    }, 700);
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
     7. Raft Consensus Simulator Controls (Panel 2)
     ------------------------------------------------------------ */
  (function initRaftSim() {
    var termVal = document.getElementById("sim-raft-term");
    var commitVal = document.getElementById("sim-raft-commit");
    var quorumVal = document.getElementById("sim-raft-quorum");
    var btnHeartbeat = document.getElementById("sim-btn-heartbeat");
    var btnPartition = document.getElementById("sim-btn-partition");
    var btnElection = document.getElementById("sim-btn-election");

    if (!termVal || !btnHeartbeat) return;

    var term = 14;
    var commit = 1042;
    var partitioned = false;

    btnHeartbeat.addEventListener("click", function () {
      commit += 1;
      commitVal.textContent = commit;
      commitVal.classList.remove("bump");
      void commitVal.offsetWidth;
      commitVal.classList.add("bump");
    });

    btnPartition.addEventListener("click", function () {
      partitioned = !partitioned;
      if (partitioned) {
        quorumVal.textContent = "3/5 (Quorum Met)";
        quorumVal.classList.remove("ok");
        quorumVal.style.color = "var(--signal-amber)";
        btnPartition.textContent = "Heal Partition";
      } else {
        quorumVal.textContent = "5/5 (Full Quorum)";
        quorumVal.classList.add("ok");
        quorumVal.style.color = "";
        btnPartition.textContent = "Simulate Partition";
      }
    });

    btnElection.addEventListener("click", function () {
      term += 1;
      termVal.textContent = term;
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

})();

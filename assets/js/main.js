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
     9. Systems & Product Bookshelf Modal & Interactivity
     ------------------------------------------------------------ */
  (function initBookshelf() {
    var overlay = document.getElementById("book-modal-overlay");
    var closeBtn = document.getElementById("book-modal-close");
    var closeAction = document.getElementById("modal-close-action");
    var backdrop = document.getElementById("book-modal-backdrop");
    var bookCards = document.querySelectorAll(".book-card");

    if (!overlay || !bookCards.length) return;

    var BOOK_DATA = {
      genie: {
        title: "Genie 2.0",
        subtitle: "High-Frequency Alpha Generation Engine on AWS Mumbai",
        eyebrow: "VOLUME 01 · ALPHA ENGINE",
        tags: ["HFT", "AWS Mumbai", "12–100 μs", "Python / C++", "Autonomous Execution"],
        metrics: [
          { label: "Order Latency", val: "12–100 μs" },
          { label: "Cloud Node", val: "AWS Mumbai" },
          { label: "Architecture", val: "HFT Alpha Engine" }
        ],
        desc: "Designed and developed (assisted by AI agents) the core alpha generation engine (Genie 2.0) for B. Singularity, a stealth quantitative hedge fund. The system extracts statistical edge and executes sub-millisecond orders under tough, turbulent market conditions.",
        bullets: [
          "Achieved average order execution latency between 12 and 100 microseconds for instantaneous market response.",
          "Deployed directly to AWS Mumbai low-latency availability zones for optimal broker and exchange co-location.",
          "Orchestrated real-time trade signals alongside dynamic capital allocation rules and position limits."
        ]
      },
      mrp: {
        title: "Manage Risk Pro (MRP 1.3)",
        subtitle: "Core Risk Fortress Engine with Multi-Layered Safeguards",
        eyebrow: "VOLUME 02 · RISK ARCHITECTURE",
        tags: ["Fortress Risk", "MRP 1.3", "Dynamic Limits", "Drawdown Shield", "Real-Time"],
        metrics: [
          { label: "Safeguard Layers", val: "Multi-Tier" },
          { label: "Risk Version", val: "MRP 1.3" },
          { label: "Market Mode", val: "Live Production" }
        ],
        desc: "Engineered from scratch as B. Singularity's flagship risk fortification system. Manages portfolio volatility, tail-risk events, and margin constraints through active automated circuit breakers and bespoke risk products for hedge fund clients.",
        bullets: [
          "Multi-layered safeguards protecting capital, reflecting the enduring strength of time-tested fortification.",
          "Designed custom risk products tailored for external institutional clients and fund partners.",
          "Designed primary workflow for AI-assisted risk management guidance features during live trading sessions."
        ]
      },
      tui: {
        title: "AWS Terminal TUI",
        subtitle: "Real-Time Terminal Observability for Distributed Cloud Servers",
        eyebrow: "VOLUME 03 · INFRASTRUCTURE & TUI",
        tags: ["Terminal UI", "AWS Telemetry", "Real-Time Stream", "SSH Pipeline", "DevOps"],
        metrics: [
          { label: "Interface", val: "Custom TUI" },
          { label: "Data Pipeline", val: "AWS Stream" },
          { label: "Sync Speed", val: "Sub-second" }
        ],
        desc: "Designed the Terminal User Interface (TUI) for the risk and order management engine. Streams live telemetry from AWS server terminals directly to a custom-built client-side display, letting stakeholders monitor automated engines operating in real-time.",
        bullets: [
          "Streams telemetry from AWS headless cloud instances into an intuitive, lightweight keyboard-driven TUI.",
          "Allows clients to monitor live order flows, position deltas, and risk limits as engines execute autonomously.",
          "Bridges high-performance Unix backend pipes with readable, human-centric telemetry monitors."
        ]
      },
      dryrun: {
        title: "Dry Run Engine",
        subtitle: "Deterministic Simulation & Safety Verification Engine",
        eyebrow: "VOLUME 04 · SIMULATION & SAFETY",
        tags: ["Simulation", "Zero Slip", "Pre-Flight", "Virtual Order Book", "Deterministic"],
        metrics: [
          { label: "Verification", val: "100% Deterministic" },
          { label: "Engine Type", val: "Pre-Flight Sandbox" },
          { label: "Error Margin", val: "Zero Slip" }
        ],
        desc: "Built the dry-run engine from scratch to simulate order behavior, slippage, and queue positions against historical and synthetic market states before deploying new strategies to live capital.",
        bullets: [
          "Eliminated execution surprises by subjecting algorithms to high-stress liquidity and latency dry runs.",
          "Accurately emulates order book queues, matching engine semantics, and broker throttling constraints.",
          "Serves as the mandatory validation gatekeeper before releasing alpha models to production."
        ]
      },
      cred: {
        title: "CRED: Life Matrix",
        subtitle: "Conceptual Financial Interface & Behavioral Dashboard",
        eyebrow: "VOLUME 05 · FINTECH PRODUCT",
        tags: ["CRED Concept", "Kunal Shah", "Behavioral UX", "Fintech Luxury", "Meta-Backed"],
        metrics: [
          { label: "Recognition", val: "Leadership Review" },
          { label: "Studio", val: "Imagine Planet" },
          { label: "Domain", val: "Fintech Matrix" }
        ],
        desc: "Created the 'Life Matrix' concept for CRED, exploring holistic wealth tracking and member behavioral psychology. The conceptual interface was reviewed and appreciated by top leadership at CRED following their high-profile investment round.",
        bullets: [
          "Crafted an unconventional financial matrix aligning luxury dark-mode aesthetics with credit score intelligence.",
          "Appreciated by CRED's top executive management for innovative design thinking and brand resonance.",
          "Explored high-contrast typography, haptic cues, and modular telemetry for premium consumer finance."
        ]
      },
      fyers: {
        title: "FYERS: Candle Signals",
        subtitle: "Evening Supermarket Ad Campaign & Ambient Trading Visuals",
        eyebrow: "VOLUME 06 · AD CAMPAIGN & UX",
        tags: ["FYERS Campaign", "Founder Liked", "Candlestick Art", "Out-of-Home", "Ad Concept"],
        metrics: [
          { label: "Recognition", val: "Liked by Founder" },
          { label: "Format", val: "Ambient OOH Ad" },
          { label: "Theme", val: "Trading Psychology" }
        ],
        desc: "Created a real-world evening ad campaign concept for brokerage platform FYERS. Centered around how green and red candles dictate trader emotions, set outside busy evening supermarkets. Liked and praised directly by the founder of FYERS.",
        bullets: [
          "Synthesized trader culture into an unforgettable physical ambient advertisement concept.",
          "Directly appreciated by the founder of FYERS on social media.",
          "Combined high-impact street-level advertising with authentic market psychology and brand storytelling."
        ]
      },
      imagine: {
        title: "Imagine Planet Studio",
        subtitle: "Independent Product & UI/UX Design Studio",
        eyebrow: "VOLUME 07 · DESIGN STUDIO",
        tags: ["Design Studio", "Fintech Unicorns", "Mobile Systems", "Brand Writing", "4+ Years"],
        metrics: [
          { label: "Studio Age", val: "4y 9m" },
          { label: "Clients", val: "Fintech & E-Comm" },
          { label: "Output", val: "Apps & Systems" }
        ],
        desc: "Founded Imagine Planet Design, an independent product design studio that builds bespoke software products, mobile interfaces, and backend telemetry dashboards. Work has been appreciated by leaders across Indian fintech unicorns.",
        bullets: [
          "Designed comprehensive mobile interfaces, complex data-handling dashboards, and notification systems.",
          "Delivered end-to-end product strategy, ad copywriting, and brand identity systems for growth-stage companies.",
          "Pioneered physical-digital product collaborations, including upcoming hardware projects for quick-commerce giants."
        ]
      },
      zomato: {
        title: "Partner Safety UX",
        subtitle: "Deep-Dive Teardown of Zomato & Blinkit Logistics UX",
        eyebrow: "VOLUME 08 · PRODUCT TEARDOWN",
        tags: ["Logistics UX", "Zomato x Blinkit", "Driver Welfare", "Quick Commerce", "Field Analysis"],
        metrics: [
          { label: "Reach", val: "3.8k+ Impressions" },
          { label: "Category", val: "Logistics Product" },
          { label: "Platform", val: "Delivery Partner App" }
        ],
        desc: "Conducted extensive field and product analysis of Zomato and Blinkit delivery partner applications, highlighting their gold-standard focus on partner safety, healthcare, and financial well-being.",
        bullets: [
          "Identified and cataloged world-class in-app safety features built for high-stress last-mile delivery fleets.",
          "Engaged the product community on quick-commerce interface ergonomics and real-world courier ergonomics.",
          "Formulated actionable UX proposals for leading real estate and e-commerce platforms."
        ]
      },
      cloud: {
        title: "Singularity Cloud",
        subtitle: "Android Multi-Cloud Management & Monitoring Client",
        eyebrow: "VOLUME 09 · MOBILE ARCHITECTURE",
        tags: ["Android App", "AWS & GCP", "Mobile Telemetry", "Secure Auth", "Live Feeds"],
        metrics: [
          { label: "Platform", val: "Android / Kotlin" },
          { label: "Cloud Backends", val: "AWS + GCP" },
          { label: "Data Sync", val: "Encrypted WebSockets" }
        ],
        desc: "Architected and coded the official Android companion application for B. Singularity, establishing bi-directional encrypted connectivity with AWS Mumbai and Google Cloud instances.",
        bullets: [
          "Provides secure remote visibility into live risk engines and portfolio delta exposures on mobile devices.",
          "Implements native low-latency socket listeners and push alerts for instant threshold notifications.",
          "Seamlessly connects AWS execution server telemetry with Google Cloud analytics storage."
        ]
      }
    };

    var currentTrigger = null;

    function openModal(bookId, triggerEl) {
      var data = BOOK_DATA[bookId];
      if (!data) return;

      currentTrigger = triggerEl;

      // Populate text
      document.getElementById("modal-eyebrow").textContent = data.eyebrow;
      document.getElementById("modal-title").textContent = data.title;
      document.getElementById("modal-subtitle").textContent = data.subtitle;
      document.getElementById("modal-desc").textContent = data.desc;

      // Populate badges
      var badgesContainer = document.getElementById("modal-badges");
      badgesContainer.innerHTML = "";
      data.tags.forEach(function (tag) {
        var span = document.createElement("span");
        span.className = "modal-badge-pill";
        span.textContent = tag;
        badgesContainer.appendChild(span);
      });

      // Populate metrics
      var metricsContainer = document.getElementById("modal-metrics");
      metricsContainer.innerHTML = "";
      data.metrics.forEach(function (m) {
        var card = document.createElement("div");
        card.className = "modal-metric-card";
        card.innerHTML = '<span class="mm-label">' + m.label + '</span><span class="mm-val">' + m.val + '</span>';
        metricsContainer.appendChild(card);
      });

      // Populate highlights
      var bulletsContainer = document.getElementById("modal-bullets");
      bulletsContainer.innerHTML = "";
      data.bullets.forEach(function (b) {
        var li = document.createElement("li");
        li.textContent = b;
        bulletsContainer.appendChild(li);
      });

      // 3D Book Clone
      var bookDisplay = document.getElementById("modal-book-3d");
      bookDisplay.innerHTML = "";
      if (triggerEl) {
        var cover = triggerEl.querySelector(".book-cover");
        if (cover) {
          var clone = cover.cloneNode(true);
          clone.className = "modal-book-clone " + (triggerEl.classList.contains("book-card--" + bookId) ? "book-card--" + bookId : "");
          bookDisplay.appendChild(clone);
        }
      }

      // Show modal
      overlay.classList.add("is-active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Focus close button for accessibility
      setTimeout(function () {
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function closeModal() {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (currentTrigger) {
        currentTrigger.focus();
        currentTrigger = null;
      }
    }

    // Attach book click & keyboard listeners
    bookCards.forEach(function (card) {
      var bookId = card.getAttribute("data-book-id");

      card.addEventListener("click", function () {
        openModal(bookId, card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(bookId, card);
        }
      });
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeAction) closeAction.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-active")) {
        closeModal();
      }
    });
  })();

})();

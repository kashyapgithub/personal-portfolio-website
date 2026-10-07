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
     9. "Chapters of Our Lives" Neumorphic Bookshelf & Modal Reader
     ------------------------------------------------------------ */
  (function initChapterReader() {
    var overlay = document.getElementById("chapter-modal-overlay");
    var backdrop = document.getElementById("chapter-modal-backdrop");
    var closeBtn = document.getElementById("chapter-close-btn");
    var prevBtn = document.getElementById("chapter-prev-btn");
    var nextBtn = document.getElementById("chapter-next-btn");
    var nextActionBtn = document.getElementById("chapter-next-action");

    var progressEl = document.getElementById("chapter-progress");
    var categoryEl = document.getElementById("chapter-category");
    var titleEl = document.getElementById("chapter-title");
    var taglineEl = document.getElementById("chapter-tagline");
    var quoteEl = document.getElementById("chapter-quote");
    var narrativeEl = document.getElementById("chapter-narrative");
    var highlightsEl = document.getElementById("chapter-highlights");
    var eraEl = document.getElementById("chapter-era");
    var metricsEl = document.getElementById("chapter-metrics");
    var tagsEl = document.getElementById("chapter-tags");
    var artDisplayEl = document.getElementById("chapter-book-display");
    var bookCards = document.querySelectorAll(".book-card");
    if (!overlay || !bookCards.length) return;

    var CHAPTER_KEYS = ["genie", "mrp", "tui", "dryrun", "cred", "fyers", "imagine", "zomato", "cloud"];

    var CHAPTERS = {
      genie: {
        id: "genie",
        chapterNum: "01",
        category: "CHAPTER 01 · ALGORITHMIC GENESIS",
        title: "Genie 2.0: The 12-Microsecond Frontier",
        tagline: "Engineering ultra-fast quantitative execution inside the quiet corners of the financial markets.",
        era: "2021 – 2026 · B. SINGULARITY STEALTH FUND",
        quote: "“In the quiet interstices of the markets where whispers swell into waves and disorder yields to calculation, B. Singularity operates beyond notice.”",
        metrics: [
          { label: "Order Latency", val: "12–100 μs" },
          { label: "Node Co-location", val: "AWS Mumbai" },
          { label: "Architecture", val: "Alpha Generation" },
          { label: "Methodology", val: "Agentic AI + C++" }
        ],
        tags: ["HFT Engine", "AWS Mumbai", "Sub-Millisecond", "Autonomous Execution", "Stealth Fund", "Discreet Alpha"],
        narrative: [
          "During my five years building core systems at B. Singularity—a stealth quantitative hedge fund—speed was not a vanity metric; it was our entire reason for existing. Markets do not wait for human reflexes or clunky distributed consensus. When statistical pricing edges emerge, they vanish within microseconds. Genie 2.0 was designed and developed, assisted by autonomous AI agents, to seize those transient alpha windows before anyone else in the order queue.",
          "We deployed Genie 2.0 directly onto low-latency AWS Mumbai availability zones, shaving every redundant microsecond of networking overhead. The engine achieved an average execution latency between 12 and 100 microseconds, allowing it to evaluate order books, calculate risk constraints, and fire orders with absolute deterministic precision.",
          "What made Genie 2.0 special wasn't just raw horsepower—it was its ability to stay disciplined under turbulent, high-volatility market crashes where ordinary algorithms freeze or run wild. It demonstrated that human architectural judgment coupled with AI-augmented development could rival systems built by massive institutional trading desks."
        ],
        highlights: [
          "Pioneered AI-assisted low-latency algorithmic development, driving order turnaround times down to 12–100 microseconds.",
          "Co-located execution servers in AWS Mumbai zones for minimal network hop latency to national exchanges.",
          "Integrated dynamic capital allocation thresholds and instantaneous volatility shock absorbents."
        ]
      },
      mrp: {
        id: "mrp",
        chapterNum: "02",
        category: "CHAPTER 02 · FORTRESS RISK ARCHITECTURE",
        title: "Manage Risk Pro: The Unshakeable Shield",
        tagline: "Building multi-layered automated circuit breakers to protect capital against tail-risk collapse.",
        era: "2021 – 2026 · MRP 1.3 SYSTEM",
        quote: "“Multi-layered safeguards protecting capital reflect the enduring strength of time-tested fortification.”",
        metrics: [
          { label: "Safeguard Tiers", val: "Multi-Layered" },
          { label: "Engine State", val: "MRP 1.3 Live" },
          { label: "Next Milestone", val: "AI Guidance 2027" },
          { label: "Core Domain", val: "Capital Preservation" }
        ],
        tags: ["Fortress Risk", "MRP 1.3", "Dynamic Limits", "Drawdown Shield", "Circuit Breakers", "Tail Risk"],
        narrative: [
          "In quantitative finance, everyone loves discussing alpha, but it is risk architecture that decides who survives to trade tomorrow. I built the Core Risk Management Engine (MRP 1.3) from scratch for B. Singularity, establishing an uncompromising defensive perimeter around our trading operations.",
          "Instead of relying on single stop-losses that can slip during rapid market gap-downs, MRP implements multi-tiered safeguards: real-time gross exposure throttles, dynamic drawdown circuit breakers, volatility-adjusted position caps, and automated kill-switches that sever broker connections the instant an anomalous variance is detected.",
          "We also crafted tailored risk products for external hedge fund clients and designed the core workflow for AI-assisted risk management guidance during live markets, pioneering a system scheduled for client rollout in early 2027."
        ],
        highlights: [
          "Constructed the multi-tiered risk engine MRP 1.3 from scratch, eliminating catastrophic drawdown vulnerabilities.",
          "Designed bespoke institutional risk management products delivered to hedge fund partners.",
          "Architected the workflow for upcoming AI-guided live market interventions launching in early 2027."
        ]
      },
      tui: {
        id: "tui",
        chapterNum: "03",
        category: "CHAPTER 03 · TERMINAL OBSERVABILITY",
        title: "AWS Live TUI: Telemetry in the Dark",
        tagline: "Streaming live telemetry from headless AWS instances into a responsive, keyboard-driven terminal console.",
        era: "2022 – 2025 · INFRASTRUCTURE TOOLING",
        quote: "“When algorithms trade in fractions of a millisecond, visual clarity without lag is the difference between control and chaos.”",
        metrics: [
          { label: "Telemetry Stream", val: "AWS Headless Pipes" },
          { label: "Display Latency", val: "Sub-Second" },
          { label: "Interface Mode", val: "Interactive TUI" },
          { label: "Controls", val: "100% Keyboard" }
        ],
        tags: ["Terminal UI", "AWS Server Stream", "DevOps Telemetry", "Real-Time Observability", "Unix Pipes"],
        narrative: [
          "Automated trading engines run on headless, stripped-down Linux instances across AWS cloud zones. Traditional heavy web dashboards introduce lag, consume unnecessary bandwidth, and often collapse under massive data throughput during high-volume market hours. We needed an observability bridge that was as lean and immediate as the engine itself.",
          "I designed and built the AWS Terminal User Interface (TUI) for our risk and order management systems. It directly taps into the standard output and socket streams of our remote AWS servers, rendering an elegant, dense, and lightweight terminal monitor on client machines.",
          "Stakeholders and operators could watch live order flows, order-book queue positions, delta shifts, and circuit breaker metrics unfold in real time, all governed with quick keyboard shortcuts and zero browser overhead."
        ],
        highlights: [
          "Built a custom TUI terminal client streaming live system internals directly from remote AWS Mumbai instances.",
          "Enabled sub-second observability for high-frequency algorithmic activity without burdening the host servers.",
          "Created a human-centric monitoring surface that made complex distributed states immediately comprehensible."
        ]
      },
      dryrun: {
        id: "dryrun",
        chapterNum: "04",
        category: "CHAPTER 04 · SIMULATION & SAFETY",
        title: "Dry Run Engine: The Pre-Flight Chamber",
        tagline: "Deterministic simulation and order matching verification before touching live capital.",
        era: "2023 – 2025 · SAFETY VERIFICATION",
        quote: "“Before a single rupee of real capital is committed to the exchange, the strategy must prove its composure in the simulation furnace.”",
        metrics: [
          { label: "Determinism", val: "100% Exact" },
          { label: "Slippage Emulation", val: "Dynamic Book" },
          { label: "Validation Gate", val: "Zero-Tolerance" },
          { label: "Testing Suite", val: "Pre-Flight Sandbox" }
        ],
        tags: ["Dry Run", "Simulation Engine", "Order Book Emulation", "Slippage Testing", "Pre-Flight Gate"],
        narrative: [
          "The most dangerous place to test an algorithmic strategy is in production with real money. Backtests often lie because they assume unlimited liquidity, zero slippage, and immediate order fulfillment. To bridge this deadly gap, I built the Dry Run Engine entirely from scratch.",
          "The Dry Run Engine acts as an uncompromising pre-flight simulation gatekeeper. It feeds historical ticks, synthetic volatility spikes, and simulated network jitter into the algorithms while accurately emulating order book queue dynamics and broker throttling limits.",
          "Every proposed alpha signal and risk configuration had to clear the Dry Run Engine with zero unexpected deviations before receiving authorization to connect to live brokerage APIs. It eliminated execution surprises and saved capital on countless occasions."
        ],
        highlights: [
          "Developed the end-to-end deterministic Dry Run Engine from scratch to simulate realistic market microstructure.",
          "Modeled complex order book queue physics, bid-ask spreads, and latency degradation scenarios.",
          "Established a zero-tolerance verification gate that prevented faulty logic from reaching live production nodes."
        ]
      },
      cred: {
        id: "cred",
        chapterNum: "05",
        category: "CHAPTER 05 · FINTECH PRODUCT & UX",
        title: "CRED Life Matrix: High-Trust Behavioral UX",
        tagline: "A holistic wealth interface concept praised by top executive leadership at CRED.",
        era: "2025 · IMAGINE PLANET DESIGN",
        quote: "“Crafted an unconventional financial matrix aligning luxury dark-mode aesthetics with credit score intelligence.”",
        metrics: [
          { label: "Audience", val: "CRED Leadership" },
          { label: "Concept Scope", val: "Holistic Wealth" },
          { label: "Design Language", val: "Monolithic Dark" },
          { label: "Feedback", val: "Direct Executive Praise" }
        ],
        tags: ["CRED Concept", "Kunal Shah", "Behavioral Design", "Fintech Luxury", "Meta-Backed Era", "Wealth Matrix"],
        narrative: [
          "CRED transformed Indian fintech by proving that trust, luxury aesthetics, and behavioral psychology could turn routine credit card payments into an aspirational club. Following their major investment milestone, I set out to conceptualize what the next generational evolution of their product could look like: the 'Life Matrix'.",
          "Rather than presenting users with fragmented account balances and disjointed transaction lists, the Life Matrix synthesized total net worth, credit velocity, investment health, and behavioral credit milestones into an interconnected, multi-dimensional matrix. I focused heavily on subtle micro-interactions, high-contrast typography, and tactile feedback cues.",
          "When shared, the concept caught the direct attention of CRED's top executive leadership (including the new head of CRED post-investment). They appreciated the conceptual boldness, aesthetic restraint, and depth of thinking behind translating abstract financial health into an intuitive visual story."
        ],
        highlights: [
          "Conceptualized the 'Life Matrix' holistic wealth dashboard for CRED, aligning behavioral psychology with luxury aesthetics.",
          "Received direct praise and review from CRED's top executive management for innovative design thinking.",
          "Pioneered tactile dark-mode layout architectures that challenge conventional banking and fintech UX."
        ]
      },
      fyers: {
        id: "fyers",
        chapterNum: "06",
        category: "CHAPTER 06 · AD CAMPAIGN & CULTURE",
        title: "FYERS Candle Signals: The Supermarket Campaign",
        tagline: "Translating emotional market psychology into an ambient evening ad campaign liked by the founder of FYERS.",
        era: "2025 · AMBIENT ADVERTISING",
        quote: "“Green and red candles are everything for a trader—even when stepping outside the trading desk into everyday life.”",
        metrics: [
          { label: "Recognition", val: "Founder Liked & Praised" },
          { label: "Ad Medium", val: "Ambient OOH / Street" },
          { label: "Context", val: "Evening Supermarkets" },
          { label: "Core Motif", val: "Candlestick Psychology" }
        ],
        tags: ["FYERS Campaign", "Founder Endorsement", "Candlestick Art", "Ambient Advertising", "Trading Culture"],
        narrative: [
          "Anyone who has ever traded actively knows that candlestick charts don't just stay on screens—they live rent-free in your mind. The green candles bring quiet confidence; the red candles trigger hesitation. Even after the 3:30 PM market bell rings, when a trader walks into a grocery store or supermarket in the evening, those colors and emotional frequencies linger.",
          "I conceived and designed an ambient out-of-home ad campaign demo for FYERS, positioned outside busy evening supermarkets where professionals unwind after work. The campaign used minimalist green and red candlestick silhouettes to capture the unspoken emotional resonance of everyday traders.",
          "The concept resonated deeply with the financial community and caught the attention of the founder of FYERS, who personally liked and praised the campaign concept on social media. It was proof that understanding your audience's emotional reality always outperforms generic corporate advertising."
        ],
        highlights: [
          "Created a culturally resonant ambient ad concept bridging financial trading psychology with daily evening routines.",
          "Directly recognized and appreciated by the founder of FYERS on social media.",
          "Demonstrated how brand storytelling and empathetic copywriting amplify product resonance far beyond digital screens."
        ]
      },
      imagine: {
        id: "imagine",
        chapterNum: "07",
        category: "CHAPTER 07 · INDEPENDENT STUDIO",
        title: "Imagine Planet: The 4-Year Design Foundry",
        tagline: "Building software products, backend telemetry dashboards, and brand identities for ambitious founders.",
        era: "2021 – 2025 · 4 YEARS 9 MONTHS",
        quote: "“An independent product design studio developing software systems and improving the UI/UX of complex machinery.”",
        metrics: [
          { label: "Studio Longevity", val: "4 yrs 9 mos" },
          { label: "Industry Reach", val: "Fintech & Logistics" },
          { label: "Product Types", val: "Mobile, Web & Hardware" },
          { label: "Status", val: "Independent Foundry" }
        ],
        tags: ["Design Studio", "Imagine Planet", "Product Strategy", "Bespoke UI/UX", "Hardware Design", "Brand Systems"],
        narrative: [
          "In January 2021, I founded Imagine Planet Design as an independent product design studio. Over four years and nine months, the studio became an engine for crafting software products, high-density backend dashboards, client engagement systems, and brand narratives.",
          "We didn't just design pretty mockups; we engineered user journeys that handle high-stress data, low-latency financial feeds, and mission-critical workflows. Our work consistently earned appreciation from founders and CEOs across Indian fintech unicorns including CRED and FYERS.",
          "Beyond pure digital interfaces, Imagine Planet expanded into copywriting, strategic campaign storytelling, and even physical industrial product design—including an upcoming hardware collaboration designed for one of India's leading quick-commerce giants."
        ],
        highlights: [
          "Operated an independent product studio for over 4.5 years, partnering with fintech, tech, and e-commerce leaders.",
          "Designed complex data dashboards, mobile apps, notification architectures, and cross-platform design systems.",
          "Expanded studio capabilities into physical hardware product design and high-impact brand copywriting."
        ]
      },
      zomato: {
        id: "zomato",
        chapterNum: "08",
        category: "CHAPTER 08 · LOGISTICS PRODUCT TEARDOWN",
        title: "Zomato & Blinkit: Partner Safety UX",
        tagline: "A deep-dive teardown into the world-class ergonomics and driver welfare features powering 10-minute deliveries.",
        era: "2025 · PRODUCT TEARDOWN",
        quote: "“The delivery partner apps for both Zomato and Blinkit are probably the best in-house products designed in India.”",
        metrics: [
          { label: "Impression Reach", val: "3,800+ Views" },
          { label: "Target Domain", val: "Quick Commerce Logistics" },
          { label: "Core Focus", val: "Driver Health & Safety" },
          { label: "Study Type", val: "In-Depth Teardown" }
        ],
        tags: ["Zomato x Blinkit", "Driver Safety UX", "Quick Commerce", "Field Ergonomics", "Product Teardown", "Welfare Systems"],
        narrative: [
          "When we tap a button on our phones and groceries arrive at our doorstep in ten minutes, few people appreciate the immense product engineering and human empathy required behind the scenes. Having studied consumer tech and field operations, I conducted an in-depth product analysis of the delivery partner apps built by Zomato and Blinkit.",
          "What I discovered was extraordinary: Zomato and Blinkit care about delivery partner safety, health, and financial well-being to a degree that someone without access to the internal partner apps would hardly believe. From emergency panic triggers and rain-shelter routing to micro-insurance access and clear earnings transparency, these apps represent some of the finest in-house product design in India.",
          "My teardown drew thousands of impressions from product managers and engineers across the tech ecosystem, sparking meaningful conversations on how technology platforms can protect and empower frontline workers."
        ],
        highlights: [
          "Authored an acclaimed product teardown of Zomato and Blinkit delivery partner apps with over 3,800 impressions.",
          "Documented best-in-class safety, healthcare, and financial wellness features built for high-tempo logistics fleets.",
          "Advocated for empathetic ergonomics in on-demand service platforms and real-world gig worker tools."
        ]
      },
      cloud: {
        id: "cloud",
        chapterNum: "09",
        category: "CHAPTER 09 · MOBILE SYSTEMS ARCHITECTURE",
        title: "Singularity Cloud: Multi-Cloud Command",
        tagline: "An Android native companion connecting AWS Mumbai execution nodes with Google Cloud analytics.",
        era: "2023 – 2026 · MOBILE INFRASTRUCTURE",
        quote: "“Carrying the pulse of cloud execution and fund risk metrics securely in the palm of your hand.”",
        metrics: [
          { label: "Mobile Platform", val: "Native Android / Kotlin" },
          { label: "Cloud Mesh", val: "AWS Mumbai + GCP" },
          { label: "Security", val: "End-to-End Encrypted" },
          { label: "Push Feeds", val: "Sub-Second WebSockets" }
        ],
        tags: ["Android App", "AWS Mumbai", "Google Cloud", "Encrypted Telemetry", "Mobile DevOps", "Push Alarms"],
        narrative: [
          "When running autonomous algorithmic trading engines, you cannot afford to be chained to a multi-monitor desk 24 hours a day. Yet you can never afford to be out of touch with system health or margin parameters either. To give our team true mobility without compromising operational vigilance, I developed the Singularity Cloud Android application.",
          "The app connects directly to both our AWS Mumbai execution servers and our Google Cloud analytics pipelines using authenticated, encrypted WebSocket channels. It streams real-time portfolio delta exposures, order fulfillment rates, and engine heartbeat signals directly to a dark-mode mobile dashboard.",
          "It features low-latency push notifications that trigger instant audible alerts if circuit breaker thresholds are touched or if server latency crosses defined tolerances, providing comprehensive peace of mind wherever we go."
        ],
        highlights: [
          "Engineered the native Android companion app integrating AWS Mumbai low-latency nodes with Google Cloud backends.",
          "Implemented encrypted bidirectional WebSocket listeners for live risk alerts and heartbeat telemetry.",
          "Delivered a seamless, lightweight mobile command surface for monitoring multi-cloud quantitative infrastructure."
        ]
      }
    };

    var currentChapterIndex = 0;
    var currentTriggerCard = null;

    function renderChapter(index) {
      if (index < 0) index = CHAPTER_KEYS.length - 1;
      if (index >= CHAPTER_KEYS.length) index = 0;
      currentChapterIndex = index;

      var key = CHAPTER_KEYS[currentChapterIndex];
      var data = CHAPTERS[key];
      if (!data) return;

      if (progressEl) {
        progressEl.textContent = "CHAPTER " + data.chapterNum + " OF 09";
      }
      if (categoryEl) {
        categoryEl.textContent = data.category;
        categoryEl.style.animation = "none";
        void categoryEl.offsetWidth;
        categoryEl.style.animation = "";
      }
      if (titleEl) {
        titleEl.textContent = data.title;
        titleEl.style.animation = "none";
        void titleEl.offsetWidth;
        titleEl.style.animation = "";
      }
      if (taglineEl) {
        taglineEl.textContent = data.tagline;
      }
      if (quoteEl) {
        quoteEl.textContent = data.quote;
      }
      if (eraEl) {
        eraEl.textContent = data.era;
      }

      // Narrative paragraphs
      if (narrativeEl) {
        narrativeEl.innerHTML = "";
        data.narrative.forEach(function (para) {
          var p = document.createElement("p");
          p.textContent = para;
          narrativeEl.appendChild(p);
        });
      }

      // Highlights / Takeaways
      if (highlightsEl) {
        highlightsEl.innerHTML = "";
        data.highlights.forEach(function (h) {
          var li = document.createElement("li");
          li.textContent = h;
          highlightsEl.appendChild(li);
        });
      }

      // Key Metrics
      if (metricsEl) {
        metricsEl.innerHTML = "";
        data.metrics.forEach(function (m) {
          var row = document.createElement("div");
          row.className = "cm-row";
          row.innerHTML = '<span class="cm-label">' + m.label + '</span><span class="cm-val">' + m.val + '</span>';
          metricsEl.appendChild(row);
        });
      }

      // Domain Tags
      if (tagsEl) {
        tagsEl.innerHTML = "";
        data.tags.forEach(function (t) {
          var pill = document.createElement("span");
          pill.className = "chapter-tag-pill";
          pill.textContent = t;
          tagsEl.appendChild(pill);
        });
      }

      // 3D Artwork Clone
      if (artDisplayEl) {
        artDisplayEl.innerHTML = "";
        var cardOnShelf = document.querySelector('.book-card[data-book-id="' + key + '"]');
        if (cardOnShelf) {
          // Synchronize shelf open card with active chapter
          if (cardOnShelf !== currentTriggerCard && overlay.classList.contains("is-active")) {
            if (currentTriggerCard) {
              currentTriggerCard.classList.remove("is-opening", "is-closing");
            }
            currentTriggerCard = cardOnShelf;
            currentTriggerCard.classList.add("is-opening");
          }

          var cover = cardOnShelf.querySelector(".book-cover-front");
          if (cover) {
            var clone = cover.cloneNode(true);
            clone.className = "book-cover-front modal-book-clone book-card--" + key;
            artDisplayEl.appendChild(clone);
          }
        }
      }
    }

    function openChapter(bookId, cardEl) {
      var idx = CHAPTER_KEYS.indexOf(bookId);
      if (idx === -1) idx = 0;
      currentTriggerCard = cardEl;

      // Close any other open book cards on the shelves
      bookCards.forEach(function (c) {
        if (c !== cardEl) {
          c.classList.remove("is-opening", "is-closing");
        }
      });

      // Play smooth 3D physical book opening animation
      if (cardEl) {
        cardEl.classList.remove("is-closing");
        cardEl.classList.add("is-opening");
      }

      // Allow 380ms for the realistic 3D book cover to swing open smoothly
      setTimeout(function () {
        renderChapter(idx);
        overlay.classList.add("is-active");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        if (closeBtn) {
          closeBtn.focus();
        }
      }, 380);
    }

    function closeChapter() {
      overlay.classList.remove("is-active");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";

      // Smoothly fold the book back shut onto the shelf
      if (currentTriggerCard) {
        var cardToClose = currentTriggerCard;
        cardToClose.classList.remove("is-opening");
        cardToClose.classList.add("is-closing");

        setTimeout(function () {
          cardToClose.classList.remove("is-closing");
        }, 420);

        cardToClose.focus();
      }
    }

    function prevChapter() {
      renderChapter(currentChapterIndex - 1);
    }

    function nextChapter() {
      renderChapter(currentChapterIndex + 1);
    }

    // Attach listeners to book cards on both shelves
    bookCards.forEach(function (card) {
      var bookId = card.getAttribute("data-book-id");

      card.addEventListener("click", function () {
        openChapter(bookId, card);
      });

      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openChapter(bookId, card);
        }
      });
    });

    // Control buttons
    if (closeBtn) closeBtn.addEventListener("click", closeChapter);
    if (backdrop) backdrop.addEventListener("click", closeChapter);
    if (prevBtn) prevBtn.addEventListener("click", prevChapter);
    if (nextBtn) nextBtn.addEventListener("click", nextChapter);
    if (nextActionBtn) nextActionBtn.addEventListener("click", nextChapter);

    // Keyboard navigation (<Esc>, <ArrowLeft>, <ArrowRight>)
    document.addEventListener("keydown", function (e) {
      if (!overlay.classList.contains("is-active")) return;

      if (e.key === "Escape") {
        closeChapter();
      } else if (e.key === "ArrowLeft") {
        prevChapter();
      } else if (e.key === "ArrowRight") {
        nextChapter();
      }
    });
  })();

})();

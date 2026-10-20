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
    var containerEl = overlay ? overlay.querySelector(".chapter-modal-container") : null;
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

    // MUST stay in the same order as data-book-id in index.html: index() maps
    // position -> key, and openChapter reverse-maps key -> index.
    //   LEVEL 01: product, design, development, opensource
    //   LEVEL 02: education, experience, marketing, tools, ai
    // genie/mrp/tui/dryrun/cred/fyers/imagine/zomato/cloud are deliberately
    // absent — they are no longer standalone books; their writing is folded
    // into the category volumes. The CHAPTERS entries are kept so that none
    // of that text is lost and any of it can be restored later.
    var CHAPTER_KEYS = ["product", "design", "development", "opensource", "education", "experience", "marketing", "tools", "ai"];

    var CHAPTERS = {
      // ================================================================
      // LEVEL 01 — CATEGORY VOLUMES
      // Each replaces a row of former project books. The genie/mrp/tui/
      // dryrun/cred entries below are retained verbatim so their writing
      // is preserved; they now live inside the `development` and
      // `education` volumes.
      // ================================================================
      product: {
        id: "product",
        chapterNum: "01",
        category: "VOLUME 01 · PRODUCT DEVELOPMENT",
        title: "My Product Development Works",
        tagline: "Taking things from an idea to something people actually use.",
        era: "2021 – 2026 · ZERO TO ONE",
        quote: "“A product is not what you planned. It is what survived contact with people.”",
        metrics: [
          { label: "Stage", val: "Idea → Ship" },
          { label: "Domains", val: "Fintech · Commerce" },
          { label: "Approach", val: "Build & Measure" },
          { label: "Ownership", val: "End to End" }
        ],
        tags: ["Product Development", "Zero to One", "MVP", "Fintech", "Commerce", "Rapid Prototyping", "Product Strategy"],
        narrative: [
          "This is the work where I owned the whole arc rather than one slice of it — deciding what to build, building it, and staying with it long enough to see what the numbers said afterwards.",
          "Most of it started as a problem someone was willing to bet on: a trading engine that had to be right in microseconds, a safety problem in quick-commerce logistics, a campaign idea that had to survive being read by actual traders. The through-line is building the real thing, not a presentation of the idea, and letting real usage correct the plan."
        ],
        highlights: [
          "Genie 2.0 — alpha generation engine taken from concept to 12–100 μs live execution.",
          "Partner Safety UX — logistics-side safety problem reframed and shipped with Zomato & Blinkit.",
          "Candle Signals — a trading campaign concept built and taken to market with FYERS.",
          "Singularity Cloud — multi-cloud telemetry app built for Android from the ground up."
        ]
      },
      design: {
        id: "design",
        chapterNum: "02",
        category: "VOLUME 02 · DESIGN PORTFOLIO",
        title: "My Design Works",
        tagline: "Product design, interface systems and the thinking behind them.",
        era: "2019 – 2026 · IMAGINE PLANET & PARTNERSHIPS",
        quote: "“Design is not what you add at the end. It is the argument you make at the start.”",
        metrics: [
          { label: "Discipline", val: "Product · UI/UX" },
          { label: "Systems", val: "Design Systems" },
          { label: "Focus", val: "Fintech · Commerce" },
          { label: "Approach", val: "Research → Ship" }
        ],
        tags: ["Product Design", "UI/UX", "Design Systems", "User Research", "Prototyping", "Fintech", "Commerce"],
        narrative: [
          "My design practice sits where product thinking meets interface craft. I work end to end — framing the problem with research, sketching the system, and carrying it through to a shipped, measurable interface.",
          "The work below spans consumer fintech, quick commerce, and long-running product studios. Across all of it the method is consistent: understand the real constraint, design the system rather than the screen, and treat visual polish as a consequence of clarity rather than a substitute for it."
        ],
        highlights: [
          "Life Matrix for CRED — a behavioural UX concept taken to top leadership review.",
          "Candle Signals for FYERS — a campaign concept built around trading psychology.",
          "Imagine Planet — a product studio shipping fintech and consumer interfaces.",
          "Partner Safety UX for Zomato & Blinkit — a teardown of logistics-side safety experience."
        ]
      },
      development: {
        id: "development",
        chapterNum: "03",
        category: "VOLUME 03 · ENGINEERING",
        title: "My Development Works",
        tagline: "Low-latency engines, realtime infrastructure and tooling built to hold up under load.",
        era: "2021 – 2026 · SYSTEMS & PLATFORM",
        quote: "“Correctness is table stakes. The difference is what the system does when everything is on fire.”",
        metrics: [
          { label: "Latency", val: "12–100 μs" },
          { label: "Stack", val: "C++ · Cloud · Android" },
          { label: "Reliability", val: "Multi-Layered" },
          { label: "Methodology", val: "AI-Assisted" }
        ],
        tags: ["Backend", "Low Latency", "Realtime Systems", "Cloud", "Android", "Simulation", "Observability"],
        narrative: [
          "Most of my engineering has been spent on systems where being fast and being right are the same requirement: order execution, risk containment, streaming telemetry, and the simulation harnesses that prove the first two behave before real capital is at stake.",
          "These were built with AI coding agents under my direction. That changed the economics rather than the standard — I could hold more systems in my head at once, but the architecture, the failure modes, and the review of every generated change stayed mine."
        ],
        highlights: [
          "Genie 2.0 — alpha generation engine running 12–100 μs on co-located AWS Mumbai infrastructure.",
          "Manage Risk Pro 1.3 — multi-layered automated circuit breakers for tail-risk containment.",
          "AWS Live TUI — streaming server telemetry for observability in dark infrastructure.",
          "Dry Run Engine — deterministic pre-flight simulation with zero-slip verification."
        ]
      },
      opensource: {
        id: "opensource",
        chapterNum: "04",
        category: "VOLUME 04 · PUBLIC REPOSITORIES",
        title: "My Open Source Works",
        tagline: "Public repositories and shared tooling — in preparation.",
        era: "IN PREPARATION · GITHUB",
        quote: "“Software you publish is software you have to maintain in public. That is the point.”",
        metrics: [
          { label: "Status", val: "In Preparation" },
          { label: "Hosting", val: "GitHub" },
          { label: "Focus", val: "Reusable Tooling" },
          { label: "License", val: "To Be Declared" }
        ],
        tags: ["Open Source", "GitHub", "Tooling", "Coming Soon"],
        narrative: [
          "This volume is being prepared. The intent is to publish the parts of my engineering work that stand on their own — the simulation harness, the low-latency instrumentation, and the small utilities that grew out of building the systems in the previous volume.",
          "Anything published here will be documented well enough to be useful to someone who has never seen the original project, and maintained rather than abandoned."
        ],
        highlights: [
          "Nothing published yet — this volume opens as work lands.",
          "Repositories will link back to the originating case study where one exists."
        ]
      },
      education: {
        id: "education",
        chapterNum: "05",
        category: "VOLUME 05 · CREDENTIALS",
        title: "Education",
        tagline: "Academic record, continuous study, and the work that came out of leadership review.",
        era: "2015 – 2026 · ACADEMIC & LEADERSHIP RECORD",
        quote: "“Education is not the credential you hold. It is the habit of not stopping.”",
        metrics: [
          { label: "Focus", val: "Computer Science" },
          { label: "Practice", val: "Continuous" },
          { label: "Review", val: "CRED Leadership" },
          { label: "Applied", val: "Fintech UX" }
        ],
        tags: ["Credentials", "Continuous Learning", "Fintech", "Leadership Review", "Applied Research"],
        narrative: [
          "My academic record sits underneath everything in the previous volumes: the systems thinking behind the engines, and the design reasoning behind the interfaces. Study has not stopped at the credential — the most useful part of it has been applied work under review.",
          "The clearest example is the CRED Life Matrix concept, which reached top leadership review. That was not a classroom exercise: it was a design and behavioural problem put in front of people who decide what ships at scale, and it changed how I think about presenting an idea to a room that can say no."
        ],
        highlights: [
          "Life Matrix for CRED — behavioural UX concept taken to top leadership review.",
          "Foundations in computer science applied directly to low-latency and realtime systems work.",
          "Continuous study: every credential here is applied to work in this portfolio."
        ]
      },
// ================================================================
      // LEVEL 02 — RECORD VOLUMES
      // Replace the former project books (fyers/imagine/zomato/cloud).
      // Their CHAPTERS entries are retained below so no writing is lost.
      // ================================================================
      experience: {
        id: "experience",
        chapterNum: "06",
        category: "VOLUME 06 · PROFESSIONAL RECORD",
        title: "Work Experience",
        tagline: "Five years inside a stealth quantitative fund, and four and a half running an independent studio.",
        era: "2021 – 2026 · B. SINGULARITY & IMAGINE PLANET",
        quote: "“Most of what I know about building systems that matter, I learned from systems that were already on fire.”",
        metrics: [
          { label: "B. Singularity", val: "5 Years" },
          { label: "Imagine Planet", val: "4 Years 9 Mos" },
          { label: "Domain", val: "Fintech · HFT" },
          { label: "Role", val: "Systems & Product" }
        ],
        tags: ["Stealth Fund", "Low Latency", "Risk Systems", "Observability", "Simulation", "Founder", "Studio"],
        narrative: [
          "I spent five years building core systems at B. Singularity, a stealth quantitative hedge fund. Speed was not a vanity metric there — it was the entire reason the firm existed. Markets do not wait for human reflexes, so the work was about making order evaluation, risk containment and execution fast enough to matter and disciplined enough to survive a crash.",
          "Genie 2.0 was the flagship: an alpha generation engine running 12–100 microseconds on co-located AWS Mumbai infrastructure. Around it sat Manage Risk Pro, a multi-layer circuit-breaker system built after watching tail risk collapse other strategies; the AWS Live TUI for streaming telemetry when dark infrastructure goes wrong; and the Dry Run Engine, a deterministic pre-flight simulation that proved a strategy behaved before real capital was at stake.",
          "In parallel I founded Imagine Planet Design in January 2021 and ran it for four years and nine months as an independent product studio — shipping software products, high-density backend dashboards and brand systems for fintech founders, including work appreciated by teams at CRED and FYERS. Singularity Cloud, the native Android companion that carried execution telemetry into my pocket, came out of that same stretch."
        ],
        highlights: [
          "Five years at B. Singularity building low-latency execution and risk infrastructure for external hedge fund clients.",
          "Genie 2.0 — 12–100 μs order execution on co-located AWS Mumbai nodes.",
          "Manage Risk Pro 1.3, AWS Live TUI and the Dry Run Engine, covering risk, observability and pre-flight verification.",
          "Founded and ran Imagine Planet Design for 4 years 9 months as an independent product studio."
        ]
      },
      marketing: {
        id: "marketing",
        chapterNum: "07",
        category: "VOLUME 07 · BRAND & CAMPAIGN",
        title: "Marketing & Ad Work",
        tagline: "Brand, campaign, and the copywriting that makes a product feel like something people already want.",
        era: "2021 – 2026 · BRAND STORYTELLING",
        quote: "“Advertising does not win attention. It wins the hour after the customer walks away from the screen.”",
        metrics: [
          { label: "Approach", val: "Ambient & OOH" },
          { label: "Focus", val: "Emotional Truth" },
          { label: "Recognition", val: "Founder Endorsed" },
          { label: "Also", val: "Brand & Copywriting" }
        ],
        tags: ["Campaign Concept", "Out of Home", "Brand Identity", "Copywriting", "Trading Culture", "Storytelling"],
        narrative: [
          "The strongest marketing work I have done came from noticing something true rather than reaching for a format. Candlestick charts do not stay on screens — the green and red linger in a trader's head long after the 3:30 bell. That observation became the FYERS Candle Signals campaign: minimalist candle silhouettes placed outside busy evening supermarkets, where professionals unwind after work.",
          "The concept was liked and publicly praised by the founder of FYERS. More valuable than the recognition was the lesson — reading your audience's emotional reality beats generic corporate advertising almost every time.",
          "The same instinct runs through the studio work: brand narratives, copywriting and campaign storytelling for fintech founders, where the product may be dense but the story still has to land in one line."
        ],
        highlights: [
          "Conceived and designed the FYERS Candle Signals ambient out-of-home campaign for evening supermarkets.",
          "Personally liked and praised by the founder of FYERS on social media.",
          "Brand identity, narrative and copywriting delivered through the Imagine Planet studio practice."
        ]
      },
      tools: {
        id: "tools",
        chapterNum: "08",
        category: "VOLUME 08 · DAILY TOOLKIT",
        title: "Everyday Tech Stack",
        tagline: "The tools I actually use, day in and day out.",
        era: "TO BE COMPLETED",
        quote: "“A tool you have not opened in a month is not part of your stack. It is part of your history.”",
        metrics: [
          { label: "Editor / IDE", val: "— to fill —" },
          { label: "Terminal", val: "— to fill —" },
          { label: "Version Control", val: "— to fill —" },
          { label: "AI Tooling", val: "— to fill —" }
        ],
        tags: ["Tooling", "Workflow", "Productivity", "To Be Completed"],
        narrative: [
          "This volume is a scaffold. The categories below are the ones worth listing for someone who builds and designs at the same time — the rest of this portfolio is full of systems, interfaces and campaigns, and this is the honest answer to what runs underneath all of it.",
          "Replace each placeholder with the tools you actually use. A list of tools you no longer open is worse than no list at all."
        ],
        highlights: [
          "Editor / IDE — to fill in.",
          "Terminal and shell — to fill in.",
          "Version control and collaboration — to fill in.",
          "Cloud, design and AI tooling — to fill in."
        ]
      },
      ai: {
        id: "ai",
        chapterNum: "09",
        category: "VOLUME 09 · APPLIED AI",
        title: "AI-Focused Work",
        tagline: "Using agentic AI to build systems where a human still owns the architecture and every hard call.",
        era: "2021 – 2026 · AI-ASSISTED ENGINEERING",
        quote: "“The point was never to let the model decide. It was to stop being the bottleneck on the parts that are not the decision.”",
        metrics: [
          { label: "Method", val: "Agentic AI + C++" },
          { label: "Applied To", val: "Trading & Risk" },
          { label: "Autonomy", val: "Engine-Level" },
          { label: "Ownership", val: "Human Architectural" }
        ],
        tags: ["Agentic AI", "AI-Assisted Development", "Autonomous Systems", "LLM Workflow", "Architecture", "C++"],
        narrative: [
          "Genie 2.0 was developed with autonomous AI agents under my direction, and that is where this practice started rather than where it became a talking point. The economics changed immediately: I could hold more systems in context at once, iterate faster, and keep a much larger surface area under active development.",
          "The discipline is what matters. Architecture, failure modes, the risk model and the review of every generated change stayed human. An engine that fires orders into a live market is exactly the place where being confidently wrong is expensive, so the AI did the work and I kept the decisions.",
          "The same approach carries into risk work — Manage Risk Pro included AI-assisted risk management guidance for external hedge fund clients, and the Dry Run Engine exists precisely so that autonomous behaviour can be verified before it is trusted with anything real."
        ],
        highlights: [
          "Pioneered AI-assisted low-latency algorithmic development, driving order turnaround down to 12–100 microseconds.",
          "Built and directed autonomous agentic workflows across C++ execution infrastructure.",
          "AI-assisted risk management guidance delivered to external hedge fund clients.",
          "Designed verification-first pipelines so autonomous systems can be proven before deployment."
        ]
      },
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
    // A close requested mid-morph is queued instead of dropped, so an
    // impatient click/Escape never leaves the modal stranded open.
    var pendingClose = false;
    // An open whose raster/morph hasn't started yet (async wait). Guards
    // double-opens and lets a close abort the pending launch cleanly.
    var openPending = false;

    function renderChapter(index) {
      if (index < 0) index = CHAPTER_KEYS.length - 1;
      if (index >= CHAPTER_KEYS.length) index = 0;
      currentChapterIndex = index;

      var key = CHAPTER_KEYS[currentChapterIndex];
      var data = CHAPTERS[key];
      if (!data) return;

      if (progressEl) {
        progressEl.textContent = "VOLUME " + data.chapterNum + " OF 09";
      }
      if (categoryEl) {
        categoryEl.textContent = data.category;
      }
      if (titleEl) {
        titleEl.textContent = data.title;
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

    /* ------------------------------------------------------------
       macOS Catalina Style Genie Effect Engine (Dual-Phase Harmonic Deformation)
       ------------------------------------------------------------ */
    var genieCanvas = document.getElementById("genie-canvas");
    var GenieFX = (function () {
      var canvas = genieCanvas;
      var ctx = canvas ? canvas.getContext("2d") : null;
      var activeAnimId = null;
      var isAnimating = false;
      // Adaptive governor state (shared scope: resizeCanvas() lives here,
      // outside animateGenie — a binding local to animateGenie would throw
      // ReferenceError inside resizeCanvas and brick the opener mid-setup).
      var renderScale = 1, govSlow = 0;

      var THEME_COLORS = {
        // LEVEL 01 — category volumes (must mirror .book-card--* in styles.css)
        product: { bg1: "#10193a", bg2: "#1e2f66", accent: "#81a1ff" },
        design: { bg1: "#2a0f3d", bg2: "#43206b", accent: "#c084fc" },
        development: { bg1: "#04231d", bg2: "#0b4437", accent: "#34d399" },
        opensource: { bg1: "#14171c", bg2: "#23272e", accent: "#f0f6fc" },
        // LEVEL 02 — record volumes
        education: { bg1: "#2b1c06", bg2: "#4d360f", accent: "#fbbf24" },
        experience: { bg1: "#04212e", bg2: "#0a3d54", accent: "#38bdf8" },
        marketing: { bg1: "#3a0a1a", bg2: "#63152c", accent: "#fb7185" },
        tools: { bg1: "#161c24", bg2: "#2a333f", accent: "#94a3b8" },
        ai: { bg1: "#331205", bg2: "#5c2408", accent: "#f97316" },
        // LEVEL 02 — project volumes
        genie: { bg1: "#061917", bg2: "#0c332e", accent: "#00d4c8" },
        mrp: { bg1: "#240b12", bg2: "#3e121d", accent: "#f43f5e" },
        tui: { bg1: "#211606", bg2: "#3a270d", accent: "#ffa42b" },
        dryrun: { bg1: "#091728", bg2: "#122b4a", accent: "#38bdf8" },
        cred: { bg1: "#161514", bg2: "#292622", accent: "#e5c07b" },
        fyers: { bg1: "#091c16", bg2: "#132f25", accent: "#10b981" },
        imagine: { bg1: "#1b0e2f", bg2: "#311854", accent: "#a855f7" },
        zomato: { bg1: "#260a0f", bg2: "#3e1218", accent: "#fbbf24" },
        cloud: { bg1: "#091a24", bg2: "#102e3f", accent: "#2dd4bf" }
      };

      function resizeCanvas() {
        if (!canvas) return;
        // Cap DPR at 1.75 for the transient morph canvas: halves backing
        // pixels vs 2x on retina with no visible difference over 480ms,
        // roughly 30-40% faster slice blits. Multiplied by the governor's
        // renderScale (1 until sustained slowness steps it down).
        var dpr = Math.min(window.devicePixelRatio || 1, 1.75) * (renderScale || 1);
        var w = window.innerWidth;
        var h = window.innerHeight;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }

      window.addEventListener("resize", resizeCanvas);

      function clearCanvas() {
        if (!ctx || !canvas) return;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
      }

      function drawRoundRect(c, x, y, w, h, r) {
        if (c.roundRect) {
          c.roundRect(x, y, w, h, r);
          return;
        }
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
      }

      function createSnapshot(data, width, height, bookId) {
        if (!width || !height) return null;
        var dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        var offCanvas = document.createElement("canvas");
        offCanvas.width = Math.round(width * dpr);
        offCanvas.height = Math.round(height * dpr);
        var sctx = offCanvas.getContext("2d");
        if (!sctx) return null;
        sctx.scale(dpr, dpr);

        var theme = THEME_COLORS[bookId] || THEME_COLORS.genie;

        // --- Baked neumorphic shadows (one-time blurred paints at snapshot
        // build; the per-frame morph only blits, so flight stays free).
        // Without these, the morphed panel is flat while the live DOM wears
        // real box-shadows — the crossfade then visibly "applies" shadows
        // as a second step after load. Values mirror the DOM box-shadows.
        var shadowOK = false;
        try { shadowOK = (typeof sctx.filter === "string"); } catch (e) { shadowOK = false; }

        // Outset plate: dark lobe bottom-right + light lobe top-left behind
        // the fill. dx/blur/darkA mirror the DOM `dx dx blur` pair.
        function outsetPlate(x, y, w, h, r, dx, blur, darkA) {
          if (shadowOK && blur > 0) {
            sctx.save();
            sctx.filter = "blur(" + blur + "px)";
            sctx.fillStyle = "rgba(148,160,182," + darkA + ")";
            sctx.beginPath();
            drawRoundRect(sctx, x + dx, y + dx, w, h, r);
            sctx.fill();
            sctx.fillStyle = "rgba(255,255,255,0.85)";
            sctx.beginPath();
            drawRoundRect(sctx, x - dx, y - dx, w, h, r);
            sctx.fill();
            sctx.restore();
          }
          sctx.beginPath();
          drawRoundRect(sctx, x, y, w, h, r);
          sctx.fillStyle = "#edf2f8";
          sctx.fill();
          sctx.strokeStyle = "rgba(255,255,255,0.9)";
          sctx.lineWidth = 1;
          sctx.stroke();
        }

        // Inset plate: fill, then clipped feathered bands for directional
        // inner shading — mirrors `inset dx dx blur` box-shadow pairs.
        function insetPlate(x, y, w, h, r, d, blur) {
          sctx.beginPath();
          drawRoundRect(sctx, x, y, w, h, r);
          sctx.fillStyle = "#edf2f8";
          sctx.fill();
          if (shadowOK && blur > 0) {
            sctx.save();
            sctx.beginPath();
            drawRoundRect(sctx, x, y, w, h, r);
            sctx.clip();
            sctx.filter = "blur(" + blur + "px)";
            sctx.fillStyle = "rgba(148,160,182,0.45)";
            sctx.fillRect(x, y, w, d + blur);
            sctx.fillRect(x, y, d + blur, h);
            sctx.fillStyle = "rgba(255,255,255,0.75)";
            sctx.fillRect(x, y + h - d - blur, w, d + blur);
            sctx.fillRect(x + w - d - blur, y, d + blur, h);
            sctx.restore();
          }
          sctx.strokeStyle = "rgba(166, 178, 195, 0.4)";
          sctx.lineWidth = 1;
          sctx.beginPath();
          drawRoundRect(sctx, x, y, w, h, r);
          sctx.stroke();
        }

        // Base Bright Neumorphic Modal Plate (#edf2f8)
        sctx.save();
        sctx.beginPath();
        drawRoundRect(sctx, 0, 0, width, height, 28);
        sctx.fillStyle = "#edf2f8";
        sctx.fill();
        sctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        sctx.lineWidth = 1.5;
        sctx.stroke();

        // Top Navigation Bar
        var pillX = 36, pillY = 22, pillW = 150, pillH = 28;
        insetPlate(pillX, pillY, pillW, pillH, 14, 2.5, 4);
        sctx.fillStyle = "#0284c7";
        sctx.font = "700 11px monospace";
        sctx.fillText("VOLUME " + (data.chapterNum || "01") + " OF 09", pillX + 14, pillY + 18);

        // Header Navigation Controls (Prev / Next / Close)
        var btnW = 104, btnH = 32, btnY = 20;
        var prevX = width - 280;
        var nextX = width - 165;
        var closeX = width - 52, closeSize = 34;

        // Prev Chapter Button
        outsetPlate(prevX, btnY, btnW, btnH, 10, 4, 9, 0.4);
        sctx.fillStyle = "#334155";
        sctx.font = "600 11px monospace";
        sctx.fillText("‹ Prev Chapter", prevX + 12, btnY + 20);

        // Next Chapter Button
        outsetPlate(nextX, btnY, btnW, btnH, 10, 4, 9, 0.4);
        sctx.fillStyle = "#334155";
        sctx.font = "600 11px monospace";
        sctx.fillText("Next Chapter ›", nextX + 12, btnY + 20);

        // Close Button (Square Pill)
        outsetPlate(closeX, btnY - 1, closeSize, closeSize, 10, 4, 9, 0.4);
        sctx.strokeStyle = "#64748b";
        sctx.lineWidth = 2;
        sctx.beginPath();
        sctx.moveTo(closeX + 11, btnY + 10);
        sctx.lineTo(closeX + 23, btnY + 22);
        sctx.moveTo(closeX + 23, btnY + 10);
        sctx.lineTo(closeX + 11, btnY + 22);
        sctx.stroke();

        // Header Divider
        sctx.beginPath();
        sctx.moveTo(36, 68);
        sctx.lineTo(width - 36, 68);
        sctx.strokeStyle = "rgba(166, 178, 195, 0.4)";
        sctx.lineWidth = 1;
        sctx.stroke();

        // Layout Columns (2-Column Desktop Grid)
        var isTwoCol = width >= 700;
        var artColW = isTwoCol ? 280 : width - 72;
        var startY = 88;

        // Artwork Card (Left Column)
        var artCardH = 340;
        outsetPlate(36, startY, artColW, artCardH, 20, 6, 14, 0.32);

        // 3D Book Cover inside Artwork Card
        var bW = 190;
        var bH = 265;
        var bX = 36 + (artColW - bW) / 2;
        var bY = startY + 20;

        var bookGrad = sctx.createLinearGradient(bX, bY, bX + bW, bY + bH);
        bookGrad.addColorStop(0, theme.bg1);
        bookGrad.addColorStop(0.5, theme.bg2);
        bookGrad.addColorStop(1, theme.bg1);

        // Book drop shadow + accent glow (mirrors .modal-book-clone shadow)
        if (shadowOK) {
          sctx.save();
          sctx.filter = "blur(16px)";
          sctx.fillStyle = "rgba(100,116,139,0.42)";
          sctx.beginPath();
          drawRoundRect(sctx, bX - 6, bY + 10, bW + 4, bH, 10);
          sctx.fill();
          sctx.filter = "blur(20px)";
          sctx.globalAlpha = 0.3;
          sctx.fillStyle = theme.accent;
          sctx.beginPath();
          drawRoundRect(sctx, bX, bY, bW, bH, 10);
          sctx.fill();
          sctx.restore();
        }

        sctx.beginPath();
        drawRoundRect(sctx, bX, bY, bW, bH, 10);
        sctx.fillStyle = bookGrad;
        sctx.fill();
        sctx.strokeStyle = theme.accent;
        sctx.lineWidth = 1;
        sctx.stroke();

        // Book Spine & Accent line
        sctx.fillStyle = theme.accent;
        sctx.fillRect(bX + 10, bY + 14, 2, bH - 28);

        // Book Cover Badges. Both strings were hardcoded to Genie's
        // "HFT · 12–100 μs" / "ALPHA GENERATION", so every other book
        // rendered its own cover wearing Genie's text whenever the DOM
        // raster fell back to this painted path. Derive both from data.
        var badgeTag = (data.tags && data.tags[0]) || (data.category || "");
        // category reads "VOLUME 06 · PROFESSIONAL RECORD"; the tail is the
        // series name that belongs on the cover.
        var seriesName = String(data.category || "").split("·").pop().trim();
        sctx.fillStyle = theme.accent;
        sctx.font = "700 9px monospace";
        sctx.fillText(String(badgeTag).toUpperCase().slice(0, 22), bX + 18, bY + 28);
        sctx.fillText("VOL. " + (data.chapterNum || "01"), bX + bW - 48, bY + 28);

        // Book Cover Central Radar Reticle
        var iconCx = bX + bW / 2;
        var iconCy = bY + bH / 2 - 8;
        sctx.beginPath();
        sctx.arc(iconCx, iconCy, 24, 0, Math.PI * 2);
        sctx.strokeStyle = theme.accent;
        sctx.lineWidth = 1.2;
        sctx.stroke();
        sctx.beginPath();
        sctx.arc(iconCx, iconCy, 14, 0, Math.PI * 2);
        sctx.strokeStyle = theme.accent;
        sctx.stroke();
        sctx.beginPath();
        sctx.moveTo(iconCx - 32, iconCy);
        sctx.lineTo(iconCx + 32, iconCy);
        sctx.moveTo(iconCx, iconCy - 32);
        sctx.lineTo(iconCx, iconCy + 32);
        sctx.strokeStyle = theme.accent;
        sctx.stroke();

        // Book Cover Bottom Titles — series from data, not Genie's label
        sctx.fillStyle = theme.accent;
        sctx.font = "700 8px monospace";
        sctx.fillText(seriesName.toUpperCase().slice(0, 24), bX + 18, bY + bH - 34);
        sctx.fillStyle = "#ffffff";
        sctx.font = "800 13px sans-serif";
        var titleWord = (data.title || "").split(":")[0];
        sctx.fillText(titleWord.slice(0, 18), bX + 18, bY + bH - 18);

        // Era Stamp under Artwork
        var eraY = startY + artCardH - 32;
        insetPlate(52, eraY, artColW - 32, 22, 11, 2.5, 4);
        sctx.fillStyle = "#64748b";
        sctx.font = "700 9px monospace";
        sctx.textAlign = "center";
        sctx.fillText((data.era || "").slice(0, 36), 52 + (artColW - 32) / 2, eraY + 15);
        sctx.textAlign = "left";

        // Key Metrics Card
        var metY = startY + artCardH + 18;
        var metH = 135;
        outsetPlate(36, metY, artColW, metH, 16, 5, 12, 0.3);
        sctx.fillStyle = "#64748b";
        sctx.font = "700 9px monospace";
        sctx.fillText("KEY METRICS · PLATFORM", 48, metY + 22);

        if (data.metrics && data.metrics.length) {
          data.metrics.slice(0, 4).forEach(function (m, idx) {
            var my = metY + 44 + idx * 22;
            sctx.fillStyle = "#64748b";
            sctx.font = "11px monospace";
            sctx.fillText(m.label, 48, my);
            sctx.fillStyle = "#0f172a";
            sctx.font = "700 11px monospace";
            sctx.textAlign = "right";
            sctx.fillText(m.val, 36 + artColW - 14, my);
            sctx.textAlign = "left";
          });
        }

        // Domain Tags Card (height flows with wrapped rows, like the DOM)
        var tagsY = metY + metH + 18;
        var tagRows = [];
        if (data.tags && data.tags.length) {
          var tagRight = 36 + artColW - 14;
          var cur = [];
          var curW = 0;
          for (var tgi = 0; tgi < data.tags.length; tgi++) {
            var tagn = data.tags[tgi];
            var tagW = Math.min(120, tagn.length * 7 + 14);
            if (curW + tagW > tagRight - 48 && cur.length) {
              tagRows.push(cur);
              cur = [];
              curW = 0;
            }
            cur.push({ text: tagn.slice(0, 16), w: tagW });
            curW += tagW + 6;
          }
          if (cur.length) tagRows.push(cur);
        }
        if (!tagRows.length) tagRows.push([]);
        var tagsH = 36 + tagRows.length * 26 + 8;
        outsetPlate(36, tagsY, artColW, tagsH, 16, 5, 12, 0.3);
        sctx.fillStyle = "#64748b";
        sctx.font = "700 9px monospace";
        sctx.fillText("DOMAIN · ARTIFACTS", 48, tagsY + 22);
        for (var tri = 0; tri < tagRows.length; tri++) {
          var tx = 48, ty = tagsY + 36 + tri * 26;
          for (var tc = 0; tc < tagRows[tri].length; tc++) {
            var pill = tagRows[tri][tc];
            outsetPlate(tx, ty, pill.w, 20, 6, 2, 5, 0.35);
            sctx.fillStyle = "#475569";
            sctx.font = "600 9px monospace";
            sctx.fillText(pill.text, tx + 6, ty + 14);
            tx += pill.w + 6;
          }
        }

        // ---- Right Column (Editorial Story) ----
        // Mirrors the DOM flow (category / title / tagline / quote /
        // narrative / takeaways) with greedy wrapping at DOM sizes, so the
        // painted panel fills exactly like the live modal (which shows the
        // same top portion through its scroll viewport). Fixed offsets left
        // content clustered at the top and read as a size jump on handoff.
        var storyX = isTwoCol ? 36 + artColW + 36 : 36;
        var storyW = width - storyX - 36;
        var sY = isTwoCol ? startY : tagsY + tagsH + 18;

        function wrapLines(text, maxW) {
          var words = String(text).split(/\s+/);
          var lines = [];
          var line = "";
          for (var wi = 0; wi < words.length; wi++) {
            var trial = line ? line + " " + words[wi] : words[wi];
            if (sctx.measureText(trial).width > maxW && line) {
              lines.push(line);
              line = words[wi];
            } else {
              line = trial;
            }
          }
          if (line) lines.push(line);
          return lines;
        }

        // Eyebrow Category (DOM: 0.76rem mono 700)
        sctx.fillStyle = "#0284c7";
        sctx.font = "700 12px monospace";
        sctx.fillText((data.category || "").toUpperCase().slice(0, 48), storyX, sY + 12);

        // Main Title (DOM: clamp fluid 700; read the live size so lines match)
        var titlePx = 32;
        try {
          var liveTitle = document.getElementById("chapter-title");
          if (liveTitle) {
            var tcs = window.getComputedStyle(liveTitle);
            var tfs = parseFloat(tcs.fontSize);
            if (tfs >= 20 && tfs <= 60) titlePx = tfs;
          }
        } catch (e) { /* keep default */ }
        sctx.fillStyle = "#0f172a";
        sctx.font = "700 " + titlePx + "px -apple-system, 'Segoe UI', Roboto, sans-serif";
        var titleLH = Math.round(titlePx * 1.15);
        var titleLines = wrapLines(data.title || "", storyW);
        var tyy = sY + 14 + titlePx;
        for (var ti = 0; ti < titleLines.length; ti++) {
          sctx.fillText(titleLines[ti], storyX, tyy + ti * titleLH);
        }
        var afterTitle = tyy + (titleLines.length - 1) * titleLH + 8;

        // Subtitle / Tagline (DOM: 1rem, lh 1.5, wrapped)
        sctx.fillStyle = "#475569";
        sctx.font = "500 16px -apple-system, 'Segoe UI', Roboto, sans-serif";
        var tagLines = wrapLines(data.tagline || "", storyW);
        var tagLH = 24;
        var gyy = afterTitle + 18;
        for (var gi = 0; gi < tagLines.length; gi++) {
          sctx.fillText(tagLines[gi], storyX, gyy + gi * tagLH);
        }
        var afterTag = gyy + (tagLines.length - 1) * tagLH;

        // Quote Box (DOM: italic 0.95rem Georgia lh 1.6, pad 14, inset shadow)
        sctx.font = "italic 15px Georgia, serif";
        var qClean = (data.quote || "").replace(/[“”"]/g, "");
        var qLines = wrapLines('"' + qClean + '"', storyW - 32);
        var qLH = 24;
        var qH = qLines.length * qLH + 28;
        var qY = afterTag + 18;
        insetPlate(storyX, qY, storyW, qH, 8, 2.5, 5);
        sctx.fillStyle = "#0284c7";
        sctx.fillRect(storyX, qY, 3.5, qH);

        sctx.fillStyle = "#334155";
        sctx.font = "italic 15px Georgia, serif";
        for (var qi = 0; qi < qLines.length; qi++) {
          sctx.fillText(qLines[qi], storyX + 16, qY + 26 + qi * qLH);
        }

        // Narrative Section (DOM: 0.96rem lh 1.72, 12px para gaps, drop cap)
        var nY = qY + qH + 22;
        sctx.fillStyle = "#64748b";
        sctx.font = "700 12px monospace";
        sctx.fillText("THE STORY BEHIND THIS CHAPTER", storyX, nY);
        var nyy = nY + 26;

        sctx.font = "15px -apple-system, 'Segoe UI', Roboto, sans-serif";
        var nLead = 26;
        var nGap = 12;
        if (data.narrative && data.narrative.length) {
          for (var pi = 0; pi < data.narrative.length; pi++) {
            var para = data.narrative[pi];
            if (pi === 0) {
              // Drop cap (DOM: 3.2rem serif float)
              var firstChar = para.charAt(0);
              sctx.fillStyle = "#0284c7";
              sctx.font = "800 48px Georgia, serif";
              sctx.fillText(firstChar, storyX, nyy + 40);
              sctx.fillStyle = "#334155";
              sctx.font = "15px -apple-system, 'Segoe UI', Roboto, sans-serif";
              var words0 = para.slice(1).split(/\s+/);
              // Local line breaker with word-index accounting.
              function takeLine(words, from, maxW) {
                var ln = "";
                var i = from;
                for (; i < words.length; i++) {
                  var tr = ln ? ln + " " + words[i] : words[i];
                  if (sctx.measureText(tr).width > maxW && ln) break;
                  ln = tr;
                }
                if (!ln && from < words.length) { ln = words[from]; i = from + 1; }
                return { line: ln, next: i };
              }
              // First two lines indent around the cap, then full width.
              var painted = 0;
              var l1 = takeLine(words0, 0, storyW - 48);
              sctx.fillText(l1.line, storyX + 48, nyy + painted * nLead);
              painted++;
              var l2 = takeLine(words0, l1.next, storyW - 48);
              if (l2.line) {
                sctx.fillText(l2.line, storyX + 48, nyy + painted * nLead);
                painted++;
              }
              var liR = l2.next;
              while (liR < words0.length) {
                var lr = takeLine(words0, liR, storyW);
                if (!lr.line) break;
                sctx.fillText(lr.line, storyX, nyy + painted * nLead);
                painted++;
                liR = lr.next;
              }
              nyy += painted * nLead + nGap;
            } else {
              var wl = wrapLines(para, storyW);
              sctx.fillStyle = "#334155";
              for (var li = 0; li < wl.length; li++) {
                sctx.fillText(wl[li], storyX, nyy + li * nLead);
              }
              nyy += wl.length * nLead + nGap;
            }
          }
        }

        // Architectural Footprint & Lessons Box (DOM: outset card, flows
        // after the narrative; clipped by the plate edge exactly like the
        // modal's scroll viewport when it runs long).
        var footY = nyy + 6;
        var hLines = [];
        if (data.highlights && data.highlights.length) {
          sctx.font = "14px -apple-system, 'Segoe UI', Roboto, sans-serif";
          for (var hi = 0; hi < data.highlights.length; hi++) {
            var parts = wrapLines(data.highlights[hi], storyW - 60);
            for (var hp = 0; hp < parts.length; hp++) hLines.push(parts[hp]);
          }
        }
        var footH = 40 + hLines.length * 22 + 14;
        outsetPlate(storyX, footY, storyW, footH, 16, 5, 12, 0.3);
        sctx.fillStyle = "#64748b";
        sctx.font = "700 12px monospace";
        sctx.fillText("ARCHITECTURAL FOOTPRINT · LESSONS", storyX + 16, footY + 24);

        sctx.font = "14px -apple-system, 'Segoe UI', Roboto, sans-serif";
        for (var fy = 0; fy < hLines.length; fy++) {
          var hyy = footY + 48 + fy * 22;
          sctx.fillStyle = "#0284c7";
          sctx.fillText("✦", storyX + 16, hyy);
          sctx.fillStyle = "#334155";
          sctx.fillText(hLines[fy], storyX + 32, hyy);
        }

        sctx.restore();
        return offCanvas;
      }

      function animateGenie(isOpening, cardEl, overlay, containerEl, data, bookId, callback, prebuilt) {
        if (!canvas || !ctx) {
          if (callback) callback(false);
          return;
        }

        var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
          if (callback) callback(false);
          return;
        }

        if (activeAnimId) {
          cancelAnimationFrame(activeAnimId);
          activeAnimId = null;
        }

        // Claim the busy flag BEFORE the (possibly blocking) measure +
        // snapshot build below. Otherwise a close/open landing mid-build
        // sees a false idle and double-launches a second morph.
        isAnimating = true;
        // Fresh run, full pixels: the governor steps down only on sustained
        // slowness inside this run.
        renderScale = 1;
        govSlow = 0;

        resizeCanvas();

        // Calculate Modal Target Rect (Destination dialog in viewport)
        var modalRect = containerEl ? containerEl.getBoundingClientRect() : null;
        var Mw = (modalRect && modalRect.width > 50) ? modalRect.width : Math.min(window.innerWidth * 0.92, 980);
        var Mh = (modalRect && modalRect.height > 50) ? modalRect.height : Math.min(window.innerHeight * 0.88, 640);
        var Mtop = (modalRect && modalRect.top) ? modalRect.top : (window.innerHeight - Mh) / 2;
        var Mleft = (modalRect && modalRect.left) ? modalRect.left : (window.innerWidth - Mw) / 2;
        var Mcx = Mleft + Mw / 2;
        // MID-FLIGHT RETARGET (opening only): the launch rect above is read
        // while the modal is freshly mounted and hidden — fonts, images and
        // scrollbars may still move it. T* starts equal to M* and bends to
        // the live rect from t=0.5 on, so the flight lands on truth instead
        // of paying it off as a second stage at t=1.
        var TMw = Mw, TMh = Mh, TMtop = Mtop, TMcx = Mcx;
        var retargeted = false, retargetFrom = null, retargetTo = null;

        // Calculate Book Origin Rect (Anchor point on shelf)
        var bookRect = cardEl ? cardEl.getBoundingClientRect() : null;
        var Bw = (bookRect && bookRect.width > 20) ? bookRect.width * 0.88 : 140;
        var Bh = (bookRect && bookRect.height > 20) ? bookRect.height : 210;
        var Btop = (bookRect && bookRect.top) ? bookRect.top : (window.innerHeight - Bh - 60);
        var Bcx = (bookRect && bookRect.left) ? (bookRect.left + bookRect.width / 2) : (window.innerWidth / 2);

        // Morph texture: pixel-true DOM raster when available, painted
        // approximation as fallback (also used for closing from a scrolled
        // modal, where live scroll offset can't be serialized).
        var snapshot = prebuilt || createSnapshot(data, Mw, Mh, bookId);
        try { window.__lastSnapshotKind = prebuilt ? "raster" : "painted"; } catch (e) { /* ignore */ }
        if (!snapshot) {
          // Texture failed (canvas 2d contexts exhaust under memory
          // pressure, even on real devices): report failure so the caller
          // presents instantly instead of stranding the UI invisible.
          isAnimating = false;
          if (callback) callback(false);
          return;
        }

        var snapW = snapshot.width;
        var snapH = snapshot.height;

        // Flight telemetry (read via window.__geniePerf): per-frame deltas
        // expose stalls as gaps; longtasks name the blocker. Zero-cost idle.
        // `slices` is constant for the run -- the count no longer varies.
        var perf = null;
        var ltObs = null;
        try {
          perf = { kind: isOpening ? "open" : "close", book: bookId,
            slices: N, sliceMaxAllowed: N_MAX,
            t0: Math.round(performance.now()), frames: [], tasks: [], marks: {} };
          window.__geniePerf = perf;
          if ("PerformanceObserver" in window) {
            ltObs = new PerformanceObserver(function (list) {
              var es = list.getEntries();
              for (var li = 0; li < es.length && perf.tasks.length < 20; li++) {
                perf.tasks.push({ s: Math.round(es[li].startTime), d: Math.round(es[li].duration) });
              }
            });
            ltObs.observe({ entryTypes: ["longtask"] });
          }
        } catch (e) { perf = null; ltObs = null; }

        function endPerf(total) {
          try {
            if (perf) {
              perf.marks.morphMs = Math.round(performance.now() - perf.t0);
              perf.total = total;
            }
            if (ltObs) ltObs.disconnect();
          } catch (e) { /* ignore */ }
        }

        var duration = isOpening ? 520 : 400; // smooth macOS timing with ample frames
        var startTime = null;
        // Slice density for a continuous deformation contour.
        var isLowEnd = (window.innerWidth < 640) ||
          ((navigator && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));

        // Slice density for a continuous deformation contour.
        //
        // N_MAX is doubled again, 128 -> 256 (88 -> 144 on low-end). At 128
        // the drawn silhouette still carried 2.84 device px of staircase error
        // at the steepest part of the flare; at 256 that is 1.43, and with
        // SLICE_WARP below it drops to 0.95 -- sub-pixel. (Staircase error is
        // |dx/dv| * sliceHeight / 2, so it falls as 1/N, not 1/N^2: the last
        // doubling is worth more than it looks.)
        //
        // The count is FIXED for the whole flight, sized from the modal
        // height. An earlier version re-derived it per frame from the live
        // sheet height, which was a mistake: the count then changed ~234
        // times over the 520ms run, and every change re-seeds where the slice
        // boundaries fall, shifting the drawn edge by up to ~1px in a
        // direction uncorrelated with the motion. That reads as a 1px boil at
        // 60fps -- strictly worse than the coarser-but-stable contour it was
        // meant to improve. Stability beats adaptivity here.
        //
        // A fixed high count is also cheaper than it sounds on the opening
        // frames: drawImage cost tracks destination AREA, and early slices are
        // only a few px tall, so oversampling the collapsed sheet costs
        // almost nothing while the tall second half gets the full budget.
        var N_MAX = isLowEnd ? 144 : 256;
        var N_MIN = 16;                       // never collapse the contour
        var N_SLICE_PX = isLowEnd ? 5.5 : 2.75; // Mh 700 -> full N_MAX

        // SLICE_WARP concentrates slices where the contour actually bends.
        // The staircase error is |dx/dv| * sliceHeight / 2, and |dx/dv| is
        // largest at v=0 (the flaring wide end) and smallest around v=0.7.
        // Uniform spacing therefore spends most of its budget where there is
        // nothing to resolve: measured at N=256, the top 3/8 of the sheet
        // carried 62% of the total error against 37.5% for an even split.
        // vty = (i/N)^SLICE_WARP biases slices toward v=0 and cuts the worst
        // error ~35% (0.82 -> 0.54 CSS px) at identical cost, which is what takes
        // the contour under 1 device px. >1 concentrates at the top; ~1.4-1.6
        // is the measured optimum, past which the tip starts to starve.
        var SLICE_WARP = 1.35;

        // Resolve once. Capped at snapH so the integer source bands still tile
        // the snapshot exactly (no duplicated or dropped source rows).
        var N = Math.round(Mh / N_SLICE_PX);
        if (N < N_MIN) N = N_MIN;
        if (N > N_MAX) N = N_MAX;
        if (N > snapH) N = snapH;

        // -------------------------------------------------------------
        // SETTLE PHASE
        //
        // The morph's last frame lands exactly on the rect measured when the
        // flight STARTED. The DOM modal underneath, though, is live and has
        // had the whole flight to settle: webfonts land, images resolve, a
        // scrollbar appears. It can end up bigger than the frame we drew.
        //
        // Rather than let that difference surface as a pop when the canvas
        // dissolves, measure the live rect at t=1 and interpolate the canvas
        // across the difference over SETTLE_STEPS frames, increasing in width
        // and height, so the two are pixel-aligned before the crossfade.
        //
        // It is skipped entirely when the difference is under SETTLE_MIN_PX:
        // these frames exist to absorb a mismatch, and when there is no
        // mismatch they would just be a visible stall -- the exact thing the
        // rest of this engine works to avoid.
        // -------------------------------------------------------------
        var SETTLE_STEPS = 20;    // interpolated frames, as requested
        var SETTLE_MIN_PX = 2;    // below this the canvas already matches
        var SETTLE_MAX_MS = 260;  // hard cap, so a slow frame rate can't drag it
        var settleTo = null;      // {sx, sy, tx, ty} mapping modal rect -> live rect
        var settleXf = null;      // this frame's interpolated transform
        var settleStep = 0;
        var settleT0 = 0;
        var settling = false;
        var settleInited = false;

        // Pre-rendered soft flight shadow (one drawImage per frame — the
        // old 3x ctx.shadowBlur contour fills were the top jank source;
        // shadowBlur forces a software raster of the full contour).
        var flightShadow = null;
        (function buildFlightShadow() {
          try {
            flightShadow = document.createElement("canvas");
            flightShadow.width = 256; flightShadow.height = 128;
            var fctx = flightShadow.getContext("2d");
            var fg = fctx.createRadialGradient(128, 64, 8, 128, 64, 126);
            fg.addColorStop(0.00, "rgba(15,23,42,0.30)");
            fg.addColorStop(0.55, "rgba(15,23,42,0.16)");
            fg.addColorStop(0.80, "rgba(166,178,195,0.10)");
            fg.addColorStop(1.00, "rgba(166,178,195,0)");
            fctx.save();
            fctx.translate(128, 64); fctx.scale(1, 0.5); fctx.translate(-128, -64);
            fctx.fillStyle = fg;
            fctx.fillRect(0, -64, 256, 256);
            fctx.restore();
          } catch (e) { flightShadow = null; }
        })();
        if (ctx) {
          try { ctx.imageSmoothingQuality = "low"; } catch (e) { /* ignore */ }
        }

        // Pre-rendered RESTING shadow: the exact shadow the live DOM modal
        // wears at rest (.chapter-modal-container box-shadow: white lobe
        // top-left, dark lobe bottom-right, wide ambient drop). Drawn at the
        // destination while the panel is still flying in, so the final
        // shadow is already in place BEFORE the pop — it never ramps up
        // afterwards. Built once per animation (filter blur is a one-time
        // cost; per-frame is a single blit).
        var restShadow = null;
        var restPad = 64; // CSS px of blur spread around the panel
        (function buildRestShadow() {
          try {
            var RS = 0.5; // half-scale backing: shadow is soft, needs no res
            restShadow = document.createElement("canvas");
            restShadow.width = Math.max(2, Math.round((Mw + restPad * 2) * RS));
            restShadow.height = Math.max(2, Math.round((Mh + restPad * 2) * RS));
            var rctx = restShadow.getContext("2d");
            if (!rctx) { restShadow = null; return; }
            rctx.scale(RS, RS);
            var px = restPad, py = restPad;
            var supportsBlur = (typeof rctx.filter === "string");
            function shadowBlob(dx, dy, blurPx, color) {
              if (supportsBlur) {
                rctx.save();
                rctx.filter = "blur(" + blurPx + "px)";
                rctx.fillStyle = color;
                rctx.beginPath();
                drawRoundRect(rctx, px + dx, py + dy, Mw, Mh, 28);
                rctx.fill();
                rctx.restore();
              } else {
                // Fallback fake-blur: stacked expanding plates, fading out.
                rctx.save();
                rctx.fillStyle = color;
                for (var s = 4; s >= 1; s--) {
                  rctx.globalAlpha = 0.22 / s;
                  var grow = blurPx * (s / 4);
                  rctx.beginPath();
                  drawRoundRect(rctx, px + dx - grow, py + dy - grow,
                    Mw + grow * 2, Mh + grow * 2, 28 + grow);
                  rctx.fill();
                }
                rctx.restore();
              }
            }
            // Dark neumorphic lobe (matches 8px 8px 22px rgba slate).
            // Kept deliberately lighter than spec: during the crossfade this
            // sits over the DOM's identical real shadow, so erring light
            // reads as a gentle settle while erring dark pops.
            shadowBlob(8, 8, 22, "rgba(150,162,184,0.22)");
            // Wide ambient drop (matches 0 24px 48px -12px rgba ink:
            // negative spread contracts the shape, so inset the rect).
            (function ambientBlob() {
              if (supportsBlur) {
                rctx.save();
                rctx.filter = "blur(48px)";
                rctx.fillStyle = "rgba(15,23,42,0.12)";
                rctx.beginPath();
                drawRoundRect(rctx, px + 12, py + 24, Mw - 24, Mh - 24, 22);
                rctx.fill();
                rctx.restore();
              } else {
                shadowBlob(0, 24, 26, "rgba(15,23,42,0.30)");
              }
            })();
            // Top-left specular lobe (matches -6px -6px 16px white)
            shadowBlob(-6, -6, 16, "rgba(255,255,255,0.4)");
          } catch (e) { restShadow = null; }
        })();

        function smoothstep(min, max, value) {
          var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
          return x * x * (3 - 2 * x);
        }

        // ONE master curve for the entire morph.
        //
        // The old stack — easeInOutCubic, then sin(p*PI/2) for the top and
        // p^1.5 for the bottom — composed three SATURATING curves into an
        // effective ~quintic ease-out. Measured over the 520ms run, 99.7% of
        // the width travel was done by 400ms and the panel then sat at
        // literally 0.0px/frame for 100ms straight before the DOM handoff.
        // That dead tail is exactly the "freezes on a smaller frame, then
        // pops to the bigger one" artifact. A single smoothstep still peaks
        // mid-flight and decelerates, but only reaches zero velocity in the
        // final frames, so motion is continuous across the whole duration.
        function easeMorph(val) {
          var x = val < 0 ? 0 : (val > 1 ? 1 : val);
          return x * x * (3 - 2 * x);
        }

        // -------------------------------------------------------------
        // GENIE SPINE
        //
        // The sheet is drawn from two INDEPENDENT edge travels, each a plain
        // lerp between its book position and its modal position:
        //
        //   topY = Mtop + (Btop - Mtop) * (1 - topProg)
        //   botY = Btop + ((Mtop + Mh) - Btop) * botProg
        //
        // Both hit their endpoints exactly at r=1, so the final frame is
        // exactly the modal rect by construction. Nothing is clamped or
        // corrected at the end, which is what keeps the handoff invisible.
        //
        // botProg LAGS topProg, and the book tip sits at the BOTTOM of the
        // sheet, so the lagging edge is the tip: the panel is pinched at the
        // book and flares as it climbs — the Catalina flask. (Leading with
        // botProg instead inverts it and reads as a wedge, not a genie.)
        // -------------------------------------------------------------

        var NECK_TOP_MARGIN = 6;  // px the stretched tip may rise above Mtop
        var NECK_OVER_MAX = 0.12; // hard ceiling on stretch, viewport permitting
        var LEAD = 0.20;          // how far the top edge runs ahead mid-flight
        var TIP_PINCH = 0.22;     // how far the tip lags at its narrowest
        var FLARE = 2.0;          // taper exponent: 1 = linear, >1 = trumpet

        // How far past 1 we may go before the sheet leaves the viewport.
        var roomX = Math.max(0, (window.innerWidth * 0.995 - Bw) / Math.max(1, Mw - Bw) - 1);
        var roomY = (Btop - Mtop) > 1 ? Math.max(0, (Mtop - NECK_TOP_MARGIN) / (Btop - Mtop)) : 0;
        var neckRoom = Math.min(roomX, roomY, NECK_OVER_MAX);

        // Peak of f(r) = r + A*bell(r), bell = 4r(1-r). f'(r) = 1 + 4A(1-2r),
        // so the max sits at r* = (1 + 1/(4A))/2 when A <= 0.5, else f never
        // exceeds 1 and there is no stretch to solve for.
        function overshootPeak(A) {
          if (A <= 1e-6) return 1;
          var rStar = (1 + 1 / (4 * A)) / 2;
          if (rStar >= 1) return 1;
          return rStar + A * 4 * rStar * (1 - rStar);
        }

        // Solve the neck coefficient so the stretch peaks at exactly the
        // available room. Monotone in S, so bisection is exact. Solving beats
        // clamping: a hard clamp pins topProg against its ceiling for a few
        // frames, which is precisely the freeze this rewrite is removing.
        var SWELL = 0;
        (function solveNeck() {
          if (overshootPeak(LEAD) >= 1 + neckRoom - 1e-9) return; // lead alone already fills it
          var lo = 0, hi = 0.60;
          for (var i = 0; i < 40; i++) {
            var mid = (lo + hi) / 2;
            if (overshootPeak(LEAD + mid) < 1 + neckRoom) lo = mid; else hi = mid;
          }
          SWELL = lo;
        })();

        function getGeometry(topProg, botProg, wTop, wBot, vty) {
          var topY = TMtop + (Btop - TMtop) * (1 - topProg);
          var botY = Btop + ((TMtop + TMh) - Btop) * botProg;
          var currentHeight = botY - topY;
          var screenY = topY + currentHeight * vty;

          // Trumpet taper: FLARE>1 holds the sheet near tip width through the
          // lower body and opens it out fast over the top third.
          var profile = Math.pow(1 - vty, FLARE);
          var w = Bw + (TMw - Bw) * (wTop * profile + wBot * (1 - profile));

          // Centerline with Compiz harmonic S-swish
          var centerShift = (Bcx - TMcx) * (vty * (1 - botProg) + (1 - vty) * (1 - topProg));
          var swish = Math.sin(vty * Math.PI) * (Bcx - TMcx) * 0.25 * botProg * (1 - topProg);
          var centerX = TMcx + centerShift + swish;

          return {
            screenY: screenY,
            centerX: centerX,
            w: Math.max(4, w),
            leftX: centerX - w * 0.5,
            rightX: centerX + w * 0.5
          };
        }

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var t = Math.min(1, elapsed / duration);

          if (perf) {
            var ldt = timestamp - (perf._last || timestamp);
            perf._last = timestamp;
            if (perf.frames.length < 240) perf.frames.push(Math.round(ldt * 10) / 10);
            // Adaptive governor: 6 straight slow frames (>26ms) steps the
            // backing store down a notch (1 -> 0.75 -> 0.6). Output scale
            // only — slice boundaries never re-seed, so no contour boil.
            // Fast frames forgive twice as fast as slow ones accuse.
            if (renderScale > 0.6) {
              if (ldt > 26) { govSlow++; } else if (govSlow > 0) { govSlow -= 2; if (govSlow < 0) govSlow = 0; }
              if (govSlow >= 6) {
                govSlow = 0;
                renderScale = renderScale > 0.75 ? 0.75 : 0.6;
                try {
                  resizeCanvas();
                  perf.marks.govQuality = renderScale;
                  perf.marks.govAt = Math.round(timestamp - startTime);
                } catch (e) { /* keep flying at current pixels */ }
              }
            }
            // Auto-flag stalls so they can be reported straight from console.
            if (ldt > 250 && perf.frames.length > 2 && !perf.stallWarned) {
              perf.stallWarned = true;
              try { console.warn("[genie] frame gap " + Math.round(ldt) + "ms during " + perf.kind + " (" + perf.book + "). See window.__geniePerf."); } catch (e) { /* ignore */ }
            }
          }

          var p = easeMorph(t);

          // r is the single "distance from the book" scalar:
          //   opening 0 -> 1 (book  -> modal)
          //   closing 1 -> 0 (modal -> book)
          // Both directions run the same formula, so close is the exact
          // time-reverse of open — no second curve to keep in sync.
          var r = isOpening ? p : (1 - p);
          // Mid-flight retarget (opening only): first frame past t=0.5,
          // snapshot the live modal rect and bend T* onto it over the rest
          // of the flight. Blend starts at 0 so this frame is identical to
          // the last — no pop at the handoff point.
          if (isOpening && !retargeted && t >= 0.5) {
            retargeted = true;
            try {
              var rr = containerEl ? containerEl.getBoundingClientRect() : null;
              if (rr && rr.width > 50 && rr.height > 50) {
                retargetFrom = { w: TMw, h: TMh, cx: TMcx, top: TMtop };
                retargetTo = { w: rr.width, h: rr.height, cx: rr.left + rr.width / 2, top: rr.top };
                if (perf) {
                  perf.marks.retargetDW = Math.round(Math.abs(rr.width - TMw));
                  perf.marks.retargetDH = Math.round(Math.abs(rr.height - TMh));
                }
              }
            } catch (e) { retargetFrom = null; }
          }
          if (retargetFrom && retargetTo) {
            var rk = (t - 0.5) / 0.5;
            if (rk < 0) rk = 0; if (rk > 1) rk = 1;
            rk = rk * rk * (3 - 2 * rk);
            TMw = retargetFrom.w + (retargetTo.w - retargetFrom.w) * rk;
            TMh = retargetFrom.h + (retargetTo.h - retargetFrom.h) * rk;
            TMcx = retargetFrom.cx + (retargetTo.cx - retargetFrom.cx) * rk;
            TMtop = retargetFrom.top + (retargetTo.top - retargetFrom.top) * rk;
          }

          // bell is 0 at BOTH ends and 1 at mid-flight. Everything below is a
          // multiple of it, which is the structural reason no edge can ever be
          // pinned while another is still travelling: at r=1 every bell term
          // vanishes identically, so all four progresses land on 1 together.
          var bell = 4 * r * (1 - r);

          // Top edge runs ahead (the leading, wide end of the flask); the
          // bottom edge lags and therefore stays pinched at the book tip.
          // LEAD gives the diagonal shear, SWELL is the neck that carries the
          // top edge past Mtop (and the sheet past Mw) before it settles.
          var topProg = r + (LEAD + SWELL) * bell;
          var botProg = r;

          // Width gets its own pair so the tip can pinch harder than the edge
          // travel alone would: wBot dips BELOW r at mid-flight, so the tip
          // stays book-width while the top has already flared out.
          var wTop = topProg;
          var wBot = Math.max(0, r - TIP_PINCH * bell);

          // Height mirrors getGeometry() so the shadow/silhouette guards below
          // test the real flown height, not a re-derived second copy of it.
          var currentHeight =
            (Btop + ((TMtop + TMh) - Btop) * botProg) -
            (TMtop + (Btop - TMtop) * (1 - topProg));
          var elevation = r;

          clearCanvas();

          var leftPath = [];
          var rightPath = [];
          var sliceGeoms = [];

          // Precompute slices and exact contour paths. The count N is fixed
          // for the whole flight (see above) so the slice boundaries never
          // move relative to each other between frames -- the silhouette can
          // only translate and scale, never re-shuffle. SLICE_WARP biases
          // the boundaries toward the flaring top; it stays monotone 0->1,
          // so the integer source bands still tile the snapshot with no gaps.
          for (var i = 0; i < N; i++) {
            var vty0 = Math.pow(i / N, SLICE_WARP);
            var vty1 = Math.pow((i + 1) / N, SLICE_WARP);

            var s0 = getGeometry(topProg, botProg, wTop, wBot, vty0);
            var s1 = getGeometry(topProg, botProg, wTop, wBot, vty1);

            var y0 = s0.screenY;
            var y1 = s1.screenY;
            var dh = (y1 - y0) + 0.35; // subpixel antialiasing guard

            var cx = (s0.centerX + s1.centerX) * 0.5;
            var w = (s0.w + s1.w) * 0.5;
            var x = cx - w * 0.5;

            if (i === 0) {
              leftPath.push({ x: s0.leftX, y: y0 });
              rightPath.push({ x: s0.rightX, y: y0 });
            }
            leftPath.push({ x: s1.leftX, y: y1 });
            rightPath.push({ x: s1.rightX, y: y1 });

            sliceGeoms.push({
              sy: Math.round(vty0 * snapH),
              sh: Math.max(1, Math.round(vty1 * snapH) - Math.round(vty0 * snapH)),
              x: x,
              y0: y0,
              w: w,
              dh: dh
            });
          }

          // (leftPath/rightPath still feed the flight-shadow bounds below.)

          // Single-pass flight shadow: one pre-blurred sprite blit scaled
          // to the morphing bounds. Envelope peaks mid-flight and fades to
          // ZERO at landing so the preloaded DOM modal's real neumorphism
          // takes over 1:1 — the very same panel pops up, never a double
          // (canvas + DOM) shadow. Costs ~0.2ms vs ~6ms for the old
          // triple shadowBlur contour fills.
          //
          // SETTLE TRANSFORM: on settle frames the whole panel (slices, resting
          // shadow, rails) is drawn through one transform that maps the modal
          // rect onto the live settled rect. Identity until the settle phase
          // arms it, so the normal flight is untouched.
          if (settleXf) {
            ctx.save();
            ctx.translate(TMcx + settleXf.tx, (TMtop + TMh * 0.5) + settleXf.ty);
            ctx.scale(settleXf.sx, settleXf.sy);
            ctx.translate(-TMcx, -(TMtop + TMh * 0.5));
          }
          var flightEnv = Math.sin(Math.PI * Math.min(1, Math.max(0, elevation)));
          if (flightShadow && !isLowEnd && flightEnv > 0.03 && currentHeight > 12) {
            try {
              var minLX = leftPath[0].x, maxRX = rightPath[0].x;
              for (var q = 1; q < leftPath.length; q++) {
                if (leftPath[q].x < minLX) minLX = leftPath[q].x;
                if (rightPath[q].x > maxRX) maxRX = rightPath[q].x;
              }
              var shW = Math.max(8, maxRX - minLX);
              var shH = Math.min(90, 18 + 64 * flightEnv);
              var botY = leftPath[leftPath.length - 1].y;
              ctx.save();
              ctx.globalAlpha = Math.min(0.8, 0.7 * flightEnv);
              ctx.drawImage(flightShadow, minLX - shW * 0.06, botY - shH * 0.35, shW * 1.12, shH);
              ctx.restore();
            } catch (e) { /* ignore shadow errors */ }
          }

          // Destination resting shadow (opening only): fades in over the
          // final stretch of flight so the panel lands INTO its final
          // shadow. At t=1 the canvas shadow == the preloaded modal's real
          // shadow, and the CSS cross-fade below swaps them with no jump.
          // Window starts at 0.88: the sheet now deliberately overshoots
          // the modal rect around p=0.85, and a full-size resting shadow
          // blooming under a still-stretched panel reads as a second, larger
          // frame. Holding it back until the neck has settled means the
          // shadow only ever appears on the final approach.
          if (isOpening && restShadow) {
            var restAlpha = smoothstep(0.88, 1, p);
            if (restAlpha > 0.01 && currentHeight > 12) {
              ctx.save();
              ctx.globalAlpha = Math.min(1, restAlpha);
              ctx.drawImage(restShadow,
                (TMcx - TMw / 2) - restPad, TMtop - restPad,
                TMw + restPad * 2, TMh + restPad * 2);
              ctx.restore();
            }
          }

          // Draw the horizontal slices (integer source rows avoid seam
          // bleeding; low smoothing keeps blits on the fast path)
          for (var s = 0; s < N; s++) {
            var g = sliceGeoms[s];
            ctx.drawImage(snapshot, 0, g.sy, snapW, g.sh, g.x, g.y0, g.w, g.dh);
          }

          // NOTE: a "Liquid Outer Rails Glass Sheen" used to stroke the
          // left/right contour paths here in white. Screenshot-verified
          // (fat red/green split test), those strokes rendered as long
          // detached strings arcing hundreds of px past the panel into
          // empty backdrop, while the slice panel itself was pixel-true.
          // The sheen is decorative; the strings were not. Removed.

          if (settleXf) ctx.restore();

          if (t >= 1 && isOpening && !settleInited) {
            // Measure the LIVE rect now. Fonts, images and any scrollbar have
            // had the whole flight to resolve, so this is the modal as it will
            // actually be presented — not as it was when we launched.
            settleInited = true;
            try {
              var fr = containerEl ? containerEl.getBoundingClientRect() : null;
              // Fallback and deltas are measured against the CURRENT target
              // (post-retarget): a flight that already landed on truth yields
              // identity here and skips the second stage entirely.
              var fw = TMw, fh = TMh;
              var fcx = TMcx, fcy = TMtop + TMh * 0.5;
              if (fr && fr.width > 50 && fr.height > 50) {
                fw = fr.width; fh = fr.height;
                fcx = fr.left + fr.width * 0.5;
                fcy = fr.top + fr.height * 0.5;
              }
              var dW = Math.abs(fw - TMw), dH = Math.abs(fh - TMh);
              var dX = fcx - TMcx, dY = fcy - (TMtop + TMh * 0.5);
              var dC = Math.sqrt(dX * dX + dY * dY);
              if (perf) {
                perf.marks.settleDW = Math.round(dW);
                perf.marks.settleDH = Math.round(dH);
                perf.marks.settleDC = Math.round(dC);
              }
              if (Math.max(dW, dH, dC) >= SETTLE_MIN_PX) {
                settleTo = { sx: fw / TMw, sy: fh / TMh, tx: dX, ty: dY };
                settling = true;
                settleStep = 0;
                settleT0 = performance.now();
              }
            } catch (e) { /* ignore: fall through to a plain handoff */ }

            // Reveal the preloaded modal HERE, not at the end of the settle.
            // The CSS comment on .is-genie-active is explicit that an
            // opacity-0 subtree skips raster entirely, so the handoff must
            // find the panel already painted -- otherwise its first full
            // style+paint lands between the last morph frame and the settled
            // panel, which is the exact n-1 -> n gap this engine exists to
            // avoid. Doing it here buys the settle frames to cover that cost.
            overlay.classList.remove("is-genie-active");
            overlay.classList.add("genie-settled");
          }

          if (settling) {
            // Increasing order, eased so the first and last settle frames are
            // both still. Time-capped so a dropped frame rate cannot stretch
            // this into a stall.
            settleStep++;
            var sStep = settleStep / SETTLE_STEPS;
            if (performance.now() - settleT0 > SETTLE_MAX_MS) sStep = 1;
            if (sStep > 1) sStep = 1;
            var sEase = sStep * sStep * (3 - 2 * sStep);
            // settleXf is deliberately NOT cleared on completion: the handoff
            // frame still has to draw at the FINAL transform, or the panel
            // would snap back to the smaller modal rect for one frame right
            // before the crossfade -- reintroducing the pop this absorbs.
            settleXf = {
              sx: 1 + (settleTo.sx - 1) * sEase,
              sy: 1 + (settleTo.sy - 1) * sEase,
              tx: settleTo.tx * sEase,
              ty: settleTo.ty * sEase
            };
            if (sStep >= 1) settling = false;
          }

          if (t < 1 || settling) {
            activeAnimId = requestAnimationFrame(step);
          } else {
            if (isOpening) {
              // Seamless handoff: the live DOM modal was preloaded (rendered
              // + painted) before the transition started, the canvas already
              // wears the identical resting shadow — so cross-fade the two
              // (canvas out, modal in) instead of a hard clear. Shadow and
              // panel stay constant through the swap. The reveal itself
              // already happened above, at the top of the settle, so this
              // frame is a pure composite swap.
              endPerf("open-done");
              if (perf) perf.marks.flipT = Math.round(performance.now());
              isAnimating = false;
              if (callback) callback();

              // GATED CROSSFADE: hold the final canvas frame — pixel-
              // identical to the settled modal — until the reveal's style +
              // paint + commit has actually gone through two frames, and only
              // then dissolve. If the reveal costs main-thread time, that
              // cost is spent on a frame that already looks final, so it can
              // never read as a gap between the last morph frame and the
              // settled panel (the whole n-1 -> n problem).
              var fadeRafs = 0;
              function armFade() {
                // A close consumed the overlay during the gate: abort, leave
                // the canvas opaque for the closing morph. activeAnimId now
                // belongs to that close — don't touch it.
                if (!overlay.classList.contains("genie-settled")) {
                  if (canvas) canvas.classList.remove("is-fading");
                  return;
                }
                if (++fadeRafs < 1) { requestAnimationFrame(armFade); return; }
                try { if (perf) perf.marks.fadeStartT = Math.round(performance.now()); } catch (e) { /* ignore */ }
                if (canvas) canvas.classList.add("is-fading");
                setTimeout(function () {
                  // Never wipe a close that started inside the fade window.
                  if (isAnimating) return;
                  try { if (perf) perf.marks.fadeEndT = Math.round(performance.now()); } catch (e) { /* ignore */ }
                  clearCanvas();
                  if (canvas) canvas.classList.remove("is-fading");
                  activeAnimId = null;
                }, 160);
              }
              requestAnimationFrame(armFade);
            } else {
              // Closing finished: clear canvas immediately and execute close callback
              endPerf("close-done");
              clearCanvas();
              isAnimating = false;
              activeAnimId = null;
              if (callback) callback();
            }
          }
        }

        activeAnimId = requestAnimationFrame(step);
      }

      return {
        open: function (cardEl, overlay, containerEl, data, bookId, callback, prebuilt) {
          animateGenie(true, cardEl, overlay, containerEl, data, bookId, callback, prebuilt || null);
        },
        close: function (cardEl, overlay, containerEl, data, bookId, callback, prebuilt) {
          animateGenie(false, cardEl, overlay, containerEl, data, bookId, callback, prebuilt || null);
        },
        isBusy: function () {
          return isAnimating;
        }
      };
    })();

    // ---------------------------------------------------------------
    // TRUE-SNAPSHOT RASTERIZER: serialize the live, preloaded DOM modal
    // (SVG foreignObject, same-origin CSS inlined) and rasterize it into
    // the morph texture. The flight panel is then pixel-true to the modal
    // that pops up — text, book art, neumorphic shadows and all — so the
    // handoff crossfade is invisible. Falls back to the painted snapshot
    // (null) on any failure. One-time cost per open (~tens of ms, hidden
    // inside the cover-swing lead time); per-frame morph cost unchanged.
    // ---------------------------------------------------------------
    function rasterizeModal(modalW, modalH, done) {
      var finished = false;
      function finish(canvasOrNull) {
        if (!finished) { finished = true; done(canvasOrNull); }
      }
      setTimeout(function () { finish(null); }, 800); // cap: painted fallback
      try {
        if (!containerEl || !modalW || !modalH) { finish(null); return; }

        var cssText = "";
        for (var i = 0; i < document.styleSheets.length; i++) {
          try {
            var rules = document.styleSheets[i].cssRules;
            for (var r = 0; r < rules.length; r++) cssText += rules[r].cssText + "\n";
          } catch (e) { /* cross-origin sheet: skip */ }
        }
        if (!cssText) { finish(null); return; }

        var clone = containerEl.cloneNode(true);
        clone.removeAttribute("id");
        var styleEl = document.createElement("style");
        styleEl.textContent = cssText;
        clone.insertBefore(styleEl, clone.firstChild);
        clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        // Explicit geometry = laid-out geometry; overflow hidden clips
        // exactly like the (unscrolled, scrollTop forced 0 by caller) DOM.
        clone.style.cssText = "width:" + modalW + "px;height:" + modalH +
          "px;max-height:none;margin:0;transform:none;opacity:1;overflow:hidden;";

        // SVG viewport = window size so vw/vh units inside resolve exactly
        // as on the page; the modal sits in a same-size foreignObject.
        var vw = window.innerWidth, vh = window.innerHeight;
        var svgStr = '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh + '">'
          + '<foreignObject x="0" y="0" width="' + modalW + '" height="' + modalH + '">'
          + new XMLSerializer().serializeToString(clone)
          + "</foreignObject></svg>";

        var url = URL.createObjectURL(new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" }));
        var img = new Image();
        img.onload = function () {
          try {
            // Flight texture renders at 1x: it is seen only while moving
            // and deforming for ~480ms, where retina detail is invisible —
            // but a full-res SVG raster of this shadow-heavy panel costs
            // hundreds of ms cold (measured 387ms click-to-morph on real
            // hardware), stalling the morph start past the cover swing and
            // leaving the open book sitting static. Quarter pixels ≈
            // quarter raster time; the handoff crossfade lands on the
            // sharp live DOM anyway.
            var dpr = 1;
            var c = document.createElement("canvas");
            c.width = Math.max(2, Math.round(modalW * dpr));
            c.height = Math.max(2, Math.round(modalH * dpr));
            var x = c.getContext("2d");
            if (!x) { URL.revokeObjectURL(url); finish(null); return; }
            x.scale(dpr, dpr);
            x.drawImage(img, 0, 0, modalW, modalH);
            URL.revokeObjectURL(url);
            // NOTE: no readback/taint check — some builds flag SVG draws
            // origin-dirty, but these pixels are only ever blitted forward
            // (never read), so it changes nothing visually. Screenshot
            // tests, which ignore taint, verify the match instead.
            finish(c);
          } catch (e) { try { URL.revokeObjectURL(url); } catch (_) {} finish(null); }
        };
        img.onerror = function () { try { URL.revokeObjectURL(url); } catch (e) {} finish(null); };
        img.src = url;
      } catch (e) { finish(null); }
    }

    // ---------------------------------------------------------------
    // INTENT-PREBUILD CACHE: hover/focus on a book renders + rasterizes
    // its chapter in the background, so the click-time morph starts with
    // a hot texture instead of stalling the flight on a build. Entries
    // keyed by chapter + dims (+dpr bucket); LRU-capped at 3 (each is a
    // ~2.5MB backing at 1x flight resolution) and invalidated on resize.
    // ---------------------------------------------------------------
    var snapshotCache = {};
    var snapshotCacheOrder = [];
    var prebuilding = false;
    var prebuildingBook = null;
    var prebuildQueued = null;
    var prebuildWaiters = [];

    function cacheDimsMatch(entry, w, h) {
      return entry && entry.canvas && entry.w === w && entry.h === h;
    }

    function storeSnapshot(bookId, cv, w, h) {
      if (!cv) return;
      cv._rw = w;
      cv._rh = h;
      delete snapshotCache[bookId];
      snapshotCache[bookId] = { canvas: cv, w: w, h: h };
      snapshotCacheOrder.push(bookId);
      while (snapshotCacheOrder.length > 3) {
        var drop = snapshotCacheOrder.shift();
        if (drop !== bookId) delete snapshotCache[drop];
      }
    }

    function clearSnapshotCache() {
      snapshotCache = {};
      snapshotCacheOrder = [];
    }

    function measureModal() {
      var r = containerEl ? containerEl.getBoundingClientRect() : null;
      return {
        w: (r && r.width > 50) ? Math.round(r.width) : Math.min(window.innerWidth * 0.92, 980),
        h: (r && r.height > 50) ? Math.round(r.height) : Math.min(window.innerHeight * 0.88, 640)
      };
    }

    function prebuildFor(bookId) {
      if (!containerEl) return;
      if (overlay.classList.contains("is-active")) return;
      if (GenieFX.isBusy() || openPending) return;
      if (prebuilding) { prebuildQueued = bookId; return; }
      var idx = CHAPTER_KEYS.indexOf(bookId);
      if (idx === -1) return;
      var m = measureModal();
      var hit = snapshotCache[bookId];
      if (cacheDimsMatch(hit, m.w, m.h)) return; // already hot
      prebuilding = true;
      prebuildingBook = bookId;
      try { containerEl.scrollTop = 0; } catch (e) { /* ignore */ }
      renderChapter(idx);
      rasterizeModal(m.w, m.h, function (cv) {
        storeSnapshot(bookId, cv, m.w, m.h);
        prebuilding = false;
        prebuildingBook = null;
        var waiters = prebuildWaiters.splice(0);
        for (var wi = 0; wi < waiters.length; wi++) {
          try { waiters[wi](); } catch (e) { /* ignore */ }
        }
        if (prebuildQueued && prebuildQueued !== bookId) {
          var q = prebuildQueued;
          prebuildQueued = null;
          prebuildFor(q);
        } else {
          prebuildQueued = null;
        }
      });
    }

    // Run cb now unless a prebuild for this exact book is mid-flight —
    // then run it the moment that prebuild lands, so a click piggybacks
    // on the hover build instead of racing it with a duplicate raster.
    function whenPrebuildSettles(bookId, cb) {
      if (prebuilding && prebuildingBook === bookId) {
        prebuildWaiters.push(cb);
      } else {
        cb();
      }
    }


    function openChapter(bookId, cardEl) {
      if (GenieFX.isBusy() || openPending) return;
      pendingClose = false;
      openPending = true;
      var idx = CHAPTER_KEYS.indexOf(bookId);
      if (idx === -1) idx = 0;
      currentTriggerCard = cardEl;

      bookCards.forEach(function (c) {
        if (c !== cardEl) {
          c.classList.remove("is-opening", "is-closing");
        }
      });

      // 1. PRELOAD the destination before anything moves: render the chapter
      // and mount the overlay hidden (is-genie-active holds the container at
      // opacity 0), then force a sync layout. The browser paints the real
      // neumorphic modal during the cover swing below, so when the Genie
      // morph lands, the very same panel is already there — no first-paint
      // pop, no extra neumorphism layer.
      renderChapter(idx);
      overlay.classList.remove("genie-settled");
      overlay.classList.add("is-active", "is-genie-active");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (containerEl) { void containerEl.offsetWidth; }

      // 2. Swing the physical cover on the shelf (GPU-composited, untouched).
      if (cardEl) {
        cardEl.classList.remove("is-closing");
        void cardEl.offsetWidth; // restart the transition on rapid re-clicks
        cardEl.classList.add("is-opening");
      }

      // 3. Let the cover lead and rasterize the preloaded modal in parallel:
      // the morph starts once BOTH are ready, so the flight panel is the
      // true modal pixels (raster ~tens of ms; on failure the raster yields
      // null and the painted fallback is used). A hover-prebuilt hot texture
      // skips the wait entirely.
      //
      // The arming delay is 90ms, not a fixed 180ms: it only has to cover the
      // cover-swing beat so the panel visibly peels off the book, and the real
      // gate is `rasterSettled`. A longer fixed delay stacked dead time in
      // front of the morph, so the open read as two separate motions — a small
      // one on the shelf, then a big one — instead of one continuous throw.
      // tryLaunch() still blocks on the raster, so a slow build simply waits
      // and this floor only ever removes dead time, never shortens a wait.
      var launchArmed = false;
      var rasterCanvas = null;
      var rasterSettled = false;
      var freshRebuilds = 0;
      try { window.__genieOpenLog = { clickT: Math.round(performance.now()) }; } catch (e) { /* ignore */ }
      function tryLaunch() {
        if (launchArmed && rasterSettled) {
          // A close may have consumed the overlay while the raster was
          // pending: abort instead of morphing over a closed state.
          if (!overlay.classList.contains("is-active")) {
            openPending = false;
            return;
          }
          // The modal can settle geometrically between click and launch
          // (fonts/scrollbars/first-paint): if the live rect moved, rebuild
          // the texture for it instead of stretching a stale raster.
          // Capped: a restless layout still launches after 2 refreshes.
          var fresh = measureModal();
          var stale = rasterCanvas && (Math.abs(fresh.w - (rasterCanvas._rw || 0)) > 2 ||
            Math.abs(fresh.h - (rasterCanvas._rh || 0)) > 2);
          // Tag raster dims at store time (see storeSnapshot/prebuild).
          if (stale && freshRebuilds < 2) {
            freshRebuilds++;
            rasterSettled = false;
            try { containerEl.scrollTop = 0; } catch (e) { /* ignore */ }
            rasterizeModal(fresh.w, fresh.h, function (cv) {
              rasterCanvas = cv;
              rasterSettled = true;
              storeSnapshot(CHAPTER_KEYS[idx], cv, fresh.w, fresh.h);
              tryLaunch();
            });
            return;
          }
          openPending = false;
          try {
            if (window.__genieOpenLog) window.__genieOpenLog.morphStartT = Math.round(performance.now());
          } catch (e) { /* ignore */ }
          var key = CHAPTER_KEYS[idx];
          var data = CHAPTERS[key];
          if (genieCanvas) genieCanvas.classList.remove("is-fading");
          GenieFX.open(cardEl, overlay, containerEl, data, key, function (ok) {
            if (ok === false) {
              // No texture (or no motion): present the preloaded modal
              // instantly and release the opener — never strand the UI
              // behind an invisible overlay or brick future opens.
              openPending = false;
              overlay.classList.remove("is-genie-active");
              overlay.classList.add("genie-settled");
              if (cardEl) cardEl.classList.remove("is-opening", "is-closing");
            }
            if (pendingClose) {
              pendingClose = false;
              closeChapter();
            } else {
              // Focus AFTER the swap has presented: focus() forces sync
              // layout, and doing it in the handoff task wedges that work
              // between the last morph frame and the settled panel — the
              // exact n-1 -> n gap. Deferred past the canvas dissolve.
              setTimeout(function () {
                if (closeBtn) {
                  try { closeBtn.focus({ preventScroll: true }); }
                  catch (e) { closeBtn.focus(); }
                }
              }, 170);
            }
          }, rasterCanvas);
        }
      }
      setTimeout(function () {
        launchArmed = true;
        tryLaunch();
      }, 90);
      // Piggyback: if hover already triggered this book's prebuild, wait for
      // it (single raster) instead of racing a duplicate build.
      whenPrebuildSettles(bookId, function measureAndRasterize() {
        var m = measureModal();
        var w = m.w, h = m.h;
        try { containerEl.scrollTop = 0; } catch (e) { /* ignore */ }
        // Hot path: hover-prebuilt texture for these exact dims.
        var hot = snapshotCache[bookId];
        if (cacheDimsMatch(hot, w, h)) {
          rasterCanvas = hot.canvas;
          rasterSettled = true;
          tryLaunch();
          return;
        }
        rasterizeModal(w, h, function (cv) {
          rasterCanvas = cv;
          rasterSettled = true;
          storeSnapshot(bookId, cv, w, h);
          tryLaunch();
        });
      });
    }

    function closeChapter() {
      if (GenieFX.isBusy()) { pendingClose = true; return; }
      if (!overlay.classList.contains("is-active")) return;
      pendingClose = false;

      var key = CHAPTER_KEYS[currentChapterIndex];
      var data = CHAPTERS[key];
      var cardToClose = currentTriggerCard || document.querySelector('.book-card[data-book-id="' + key + '"]');

      function doClose(rasterCanvas) {
        openPending = false;
        overlay.classList.remove("genie-settled");
        overlay.classList.add("is-genie-active");

        GenieFX.close(cardToClose, overlay, containerEl, data, key, function () {
          overlay.classList.remove("is-active", "is-genie-active");
          overlay.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";

          if (cardToClose) {
            cardToClose.classList.remove("is-opening");
            cardToClose.classList.add("is-closing");
            setTimeout(function () {
              cardToClose.classList.remove("is-closing");
            }, 380);
            try { cardToClose.focus({ preventScroll: true }); }
            catch (e) { cardToClose.focus(); }
          }
        }, rasterCanvas);
      }

      // Same true-pixel treatment when the modal is unscrolled (its markup
      // state then equals the live view); otherwise painted fallback.
      // A hot cache entry skips the rebuild entirely.
      var scrolled = false;
      try { scrolled = containerEl && containerEl.scrollTop > 4; } catch (e) { scrolled = true; }
      if (!scrolled && containerEl) {
        var m = measureModal();
        var hot = snapshotCache[key];
        if (cacheDimsMatch(hot, m.w, m.h)) {
          doClose(hot.canvas);
        } else {
          rasterizeModal(m.w, m.h, function (cv) {
            storeSnapshot(key, cv, m.w, m.h);
            doClose(cv);
          });
        }
      } else {
        doClose(null);
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

      // Intent prebuild: hover/focus rasterizes the chapter in the
      // background so the click-time morph starts with a hot texture.
      card.addEventListener("pointerenter", function () {
        prebuildFor(bookId);
      }, { passive: true });
      card.addEventListener("focus", function () {
        prebuildFor(bookId);
      });
    });

    // Viewport geometry feeds cached textures: drop them on resize.
    window.addEventListener("resize", clearSnapshotCache);

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
     One choice, remembered locally. Each tile is a toggle button
     so keyboard and screen-reader users get the same interaction.
     ------------------------------------------------------------ */
  (function initCharacterSelect() {
    var grid = document.querySelector(".characters-grid");
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll(".character-card"));
    var status = document.getElementById("characters-status");
    var storageKey = "bk-favourite-character";

    function select(card, persist) {
      var name = card.getAttribute("data-character");

      cards.forEach(function (other) {
        var isSelected = other === card;
        other.classList.toggle("is-selected", isSelected);
        other.setAttribute("aria-pressed", isSelected ? "true" : "false");
        other.setAttribute(
          "aria-label",
          (isSelected ? "Selected: " : "Choose ") + other.getAttribute("data-character")
        );
      });

      if (status) {
        status.textContent = "Selected / " + name;
      }

      if (persist) {
        try {
          localStorage.setItem(storageKey, name);
        } catch (e) {
          /* Storage can be unavailable; the choice still works for this visit. */
        }
      }
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        select(card, true);
      });
    });

    try {
      var saved = localStorage.getItem(storageKey);
      if (saved) {
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].getAttribute("data-character") === saved) {
            select(cards[i], false);
            break;
          }
        }
      }
    } catch (e) {
      /* Ignore unavailable storage. */
    }
  })();

})();

# B. Kashyap — Product | Agentic AI Development

Portfolio for **B. Kashyap** ([LinkedIn](https://www.linkedin.com/in/bkashyap07) / [@kashyapgithub](https://github.com/kashyapgithub)).

> Product and software development across trading risk systems and consumer product design — Core Risk Management Engine + Genie 2.0 alpha generation (B. Singularity), and mobile/dashboard/product design (Imagine Planet Design).

Content source of truth: the `send to agent` LinkedIn export committed in this repo. Role titles, dates, latency figures, and concept stories are quoted from that profile — not independently benchmarked.

---

## What changed (trash cleanup)

Removed prior agent-invented claims with no LinkedIn/GitHub basis:

- ❌ “Staff Systems Engineer & Technical Product Architect” title
- ❌ Raft consensus / LMAX Disruptor / MCP gateway expertise
- ❌ Sub-2-microsecond / 1.42μs benchmarks, 14M LOB events, quorum dashboards
- ❌ 127 modules / 47 labs / 750 hot-seat cases / 230+ original repos

Replaced with profile-backed content:

- ✅ B. Singularity (Apr 2021–Jul 2026): risk engine 0→1, Genie 2.0, **12–100μs execution (per profile)**, TUI streaming AWS terminal, dry-run engine, AWS Mumbai, Android app, website alpha, AI risk guidance (early-2027 target)
- ✅ Imagine Planet Design (Jan 2021–Sep 2025): mobile screens, backend dashboards, notifications, ad writing, physical-product work
- ✅ Featured concepts (explicitly demos): FYERS “Candles” campaign demo + CRED Life Matrix concept
- ✅ Zenrays trainee (Jul–Aug 2019): Angular/React/Node, AWS over SSH; BTech CS; career break Sep 2019–Dec 2021 as listed
- ✅ Honest GitHub framing: 235 public repos, many forks — no “original systems” inflation

---

## Project Structure

```text
├── index.html            # Entry point (profile-backed copy)
├── send to agent         # LinkedIn profile export — source of truth
├── assets/
│   ├── css/
│   │   └── styles.css    # Design tokens, dark/light theme, layout
│   └── js/
│       └── main.js       # Rotator, workflow cascade, console demo, tabs, reveal
├── .gitignore
└── README.md
```

---

## Running Locally

Zero build steps — vanilla HTML/CSS/JS:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Verification

```bash
node --check assets/js/main.js
python3 -c "from html.parser import HTMLParser; HTMLParser().feed(open('index.html').read()); print('HTML parses OK')"
grep -ri "raft\|LMAX\|disruptor\|MCP gateway\|750 hot\|127 modules\|1.42" index.html assets/js/main.js || echo "No stale fake claims"
```

## Book-open diagnostics

If the book-opening morph ever stutters, open devtools console on the
page, click a book, and paste the stall report:

```js
JSON.stringify({log:window.__genieOpenLog,perf:window.__geniePerf},null,1)
```

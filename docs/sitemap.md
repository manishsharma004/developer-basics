# Developer Basics — Site Map & Knowledge Index

An interactive course teaching the fundamentals of software development. The app
has **two experiences** that share the same underlying knowledge but change the
layout, navigation, and content.

- **🎓 Student** — learn by doing: each topic is an interactive lab plus concise
  explanation, self-check quizzes, and a glossary.
- **🧑‍🏫 Teacher** — teach with confidence: each topic becomes a lesson plan with
  objectives, key concepts, common misconceptions, discussion prompts, a lab
  guide, and assessment ideas. Layout is grouped by level and themed differently.

The active experience is chosen from the sidebar switcher and persisted in
`localStorage` (`devbasics.experience`).

## Themes

A catalog of ~24 editor/IDE color themes (Midnight, Light, Nord, Dracula,
Terminal, Solarized Dark/Light, Monokai, One Dark/Light, Gruvbox Dark/Light,
Tokyo Night, Catppuccin Mocha/Latte, GitHub Dark/Light, Ayu Dark/Light, Rosé
Pine, Night Owl, Synthwave '84, Cobalt2, Palenight). Chosen from the sidebar
**theme dropdown** (Dark / Light optgroups, with a live swatch) and persisted in
`localStorage` (`devbasics.theme`); applied via `<html data-theme>`. Defined in
`src/theme/themes.ts` + palette blocks in `src/index.css`. Code surfaces stay
dark in every theme for legibility. The desktop sidebar is collapsible and
mobile uses a top-bar drawer; code editors capture Tab for indentation.

## Routes

| Route | Student view | Teacher view |
| --- | --- | --- |
| `/` | All lessons (cards) | Curriculum overview (grouped table) |
| `/lessons/:topic` | Interactive lesson | Lesson plan |

Routing uses `HashRouter` (GitHub Pages friendly). Adding a lesson = one entry in
`src/lessons/meta.ts` (including its `group`) + a component wired in
`src/lessons/index.tsx`; the teacher guide lives in
`src/experience/teacherGuides.ts`.

## Modules

Chapters are organized into **8 thematic modules** (`groups` in
`src/lessons/meta.ts`). The student sidebar shows them as **collapsible groups**
and the student home page renders one section per module; teacher mode still
groups by level. Module order defines chapter order (and "next chapter" flow).

1. **🧱 Foundations** — variables, controlflow, data, json, floatingpoint, memory, time, errors
2. **🖥️ Systems & the OS** — filesystem, process, concurrency, compute
3. **🧮 Data Structures & Algorithms** — datastructures, algorithms, search, recursion, trees
4. **🗄️ Data & Persistence** — sql, caching, queues
5. **🌐 Networking & the Web** — network, loadbalancing, apis, auth
6. **🔐 Security & Cryptography** — crypto, security
7. **🛠️ Tooling & Workflow** — cli, git, regex, testing, cicd, debugging
8. **🎨 Programming & Design** — classes, oop, patterns, functional

## Chapters (36)

Legend for lab tech: **Py** = Python via Pyodide (WebAssembly), **React** = pure
client-side React, **WebCrypto** = SubtleCrypto, **Intl** = Intl/Date. Snippet-
driven chapters share `SnippetRunner`
(`src/lessons/components/SnippetRunner.tsx`) for editable Python labs.

| Module | Topic | Path | Level | Min | Interactive lab | Tech |
| --- | --- | --- | --- | --- | --- | --- |
| Foundations | Variables & Types | `/lessons/variables` | Beginner | 12 | Types, rebinding, truthiness | Py |
| Foundations | Control Flow & Logic | `/lessons/controlflow` | Beginner | 14 | if/for/while + boolean logic | Py |
| Foundations | Data & Encoding | `/lessons/data` | Beginner | 13 | Number-base + UTF-8 converter | React |
| Foundations | JSON & Serialization | `/lessons/json` | Beginner | 13 | dump/load + types + pretty/compact | Py |
| Foundations | Floating Point & Precision | `/lessons/floatingpoint` | Beginner | 13 | 0.1+0.2, isclose, money patterns | Py |
| Foundations | Memory: Stack & Heap | `/lessons/memory` | Intermediate | 16 | References REPL + stack/heap visualizer | Py + React |
| Foundations | Time, Dates & Timezones | `/lessons/time` | Beginner | 15 | Epoch / timezone converter | Intl |
| Foundations | Errors & Exceptions | `/lessons/errors` | Beginner | 13 | try/except/finally playground | Py |
| Systems | The Filesystem | `/lessons/filesystem` | Beginner | 14 | Live shell + filesystem tree | Py |
| Systems | Processes & the CPU | `/lessons/process` | Beginner | 16 | CPU scheduler + animated Gantt | Py |
| Systems | Concurrency & Races | `/lessons/concurrency` | Intermediate | 15 | Thread race-condition simulation | Py |
| Systems | Compute Instances | `/lessons/compute` | Intermediate | 15 | Autoscaling simulator | React |
| DS & Algorithms | Data Structures | `/lessons/datastructures` | Intermediate | 16 | Hash-map visualizer | React |
| DS & Algorithms | Algorithms & Big-O | `/lessons/algorithms` | Intermediate | 15 | Sorting visualizer | React |
| DS & Algorithms | Searching & Binary Search | `/lessons/search` | Beginner | 14 | Linear vs binary step counts | Py |
| DS & Algorithms | Recursion | `/lessons/recursion` | Beginner | 13 | Recursion call-tree (+ memoization) | React |
| DS & Algorithms | Trees & Graphs | `/lessons/trees` | Intermediate | 16 | DFS/BFS + shortest-path traversals | Py |
| Persistence | Databases & SQL | `/lessons/sql` | Beginner | 16 | Real SQLite playground | Py (sqlite3) |
| Persistence | Caching & LRU | `/lessons/caching` | Intermediate | 14 | LRU cache simulator | React |
| Persistence | Queue Architecture | `/lessons/queues` | Intermediate | 15 | Producer/consumer queue sim | React |
| Web | How the Web Talks | `/lessons/network` | Intermediate | 15 | Request lifecycle tracer + URL anatomy | React |
| Web | Load Balancing | `/lessons/loadbalancing` | Intermediate | 14 | RR / least-conn / random simulator | React |
| Web | APIs & REST | `/lessons/apis` | Beginner | 14 | JSON + REST router + status codes | Py |
| Web | Auth, Sessions & Tokens | `/lessons/auth` | Intermediate | 15 | Salted hash + JWT decoder | Py |
| Security | Hashing & Cryptography | `/lessons/crypto` | Intermediate | 14 | SHA-256 hasher (avalanche) | WebCrypto |
| Security | Security Basics | `/lessons/security` | Intermediate | 15 | Injection & XSS: break-then-fix | Py |
| Tooling | The Command Line & Pipes | `/lessons/cli` | Beginner | 13 | Pipeline composer | Py |
| Tooling | Version Control with Git | `/lessons/git` | Beginner | 14 | Commit-graph builder | React |
| Tooling | Regular Expressions | `/lessons/regex` | Beginner | 14 | Live regex tester | React |
| Tooling | Testing & TDD | `/lessons/testing` | Beginner | 14 | Red/green asserts + tiny test runner | Py |
| Tooling | CI/CD Pipelines | `/lessons/cicd` | Intermediate | 14 | Four-stage pipeline simulator | React |
| Tooling | Debugging & Logging | `/lessons/debugging` | Beginner | 14 | Prints, log levels, asserts | Py |
| Design | Classes & Objects | `/lessons/classes` | Beginner | 13 | Class → instances visualizer | React |
| Design | Object-Oriented Programming | `/lessons/oop` | Intermediate | 18 | Four-pillars Python playground | Py |
| Design | Design Patterns | `/lessons/patterns` | Advanced | 24 | Pattern catalog (28 patterns, runnable) | Py |
| Design | Functional Programming | `/lessons/functional` | Intermediate | 15 | Pure fns + map/filter/reduce | Py |

## Per-lesson detail

Each entry lists the **student sections** (in-page nav) and the **interactive
lab**. Every student lesson also ends with **Key terms** and **Check yourself**
(quiz). Every teacher lesson plan has the same six sections: Learning objectives ·
Key concepts · Common misconceptions · Discussion prompts · Interactive lab ·
Assessment.

### 01 · Data & Encoding (`data`)
- Student: Why it matters → Bits, bytes & bases → Convert it live → Text is bytes too → Under the hood → Key terms → Check yourself → Recap
- Lab: Two-way number-base converter (dec/hex/bin/oct + byte view) and a UTF-8 text→bytes explorer.

### 02 · JSON & Serialization (`json`)
- Student: Why it matters → Objects become text → Serialize it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python `json.dumps` / `loads`, type round-trips, and compact vs pretty size comparison.

### 03 · Memory: Stack & Heap (`memory`)
- Student: Why it matters → Values vs. references → Stack & heap, live → Garbage & leaks → Under the hood → Key terms → Check yourself → Recap
- Lab: Python "values vs references" REPL + interactive stack/heap visualizer (frames, allocation, references, stack overflow, garbage).

### 04 · Time, Dates & Timezones (`time`)
- Student: Why it matters → Epoch, UTC & offsets → Convert time → Formats & pitfalls → Under the hood → Key terms → Check yourself → Recap
- Lab: Epoch ↔ human-date converter shown across multiple timezones; expanded notes on ISO 8601, ms vs s, and naive datetimes.

### 05 · Errors & Exceptions (`errors`)
- Student: Why it matters → How errors propagate → Catch it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Python playground running uncaught vs. handled errors, showing real tracebacks and `finally`.

### 06 · The Filesystem (`filesystem`)
- Student: Why it matters → The mental model → Try it live → Working with files → Under the hood → Key terms → Check yourself → Recap
- Lab: Live Unix-like shell (`ls`, `cd`, `cat`, `mkdir`, `cp`, `mv`, `ln`, `wc`, `tree`, `stat`) over a real in-browser filesystem + live tree.

### 07 · Processes & the CPU (`process`)
- Student: Why it matters → What is a process? → Schedule it live → How processes start → Under the hood → Key terms → Check yourself → Recap
- Lab: Editable process table → FCFS/SJF/Round-Robin simulation with an animated Gantt chart and metrics.

### 08 · Concurrency & Races (`concurrency`)
- Student: Why it matters → Threads & sharing → Race it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Multi-thread counter simulation interleaving read/add/write; compare correctness with and without a lock.

### 09 · Compute Instances (`compute`)
- Student: Why it matters → VMs, containers, serverless → Scale it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Autoscaling simulator — load vs. instances, per-instance utilization, dropped requests, and cost.

### 10 · Data Structures (`datastructures`)
- Student: Why it matters → The big three → A hash map, live → Under the hood → Key terms → Check yourself → Recap
- Lab: Hash-map visualizer showing hashing to buckets, collisions/chaining, and load factor.

### 11 · Algorithms & Big-O (`algorithms`)
- Student: Why it matters → Big-O in plain words → Watch a sort → Under the hood → Key terms → Check yourself → Recap
- Lab: Animated sorting visualizer (bubble/insertion/selection) with a live comparison counter.

### 12 · Searching & Binary Search (`search`)
- Student: Why it matters → Scan vs. bisect → Search it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python linear search, binary search, and a million-element step-count comparison.

### 13 · Recursion (`recursion`)
- Student: Why it matters → Base case & recursion → Trace the calls → Under the hood → Key terms → Check yourself → Recap
- Lab: Factorial/Fibonacci call-tree with a memoization toggle showing the call-count collapse.

### 14 · Trees & Graphs (`trees`)
- Student: Why it matters → Trees, graphs & traversal → Traverse it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python DFS (recursive) and BFS (queue) over a binary tree, plus BFS shortest-path over an adjacency-list graph.

### 15 · Databases & SQL (`sql`)
- Student: Why it matters → Tables & queries → Run SQL live → Under the hood → Key terms → Check yourself → Recap
- Lab: Real in-browser SQLite (Pyodide `sqlite3`) with a seeded schema; run SELECT/WHERE/JOIN/GROUP BY.

### 16 · Caching & LRU (`caching`)
- Student: Why it matters → Hits, misses & eviction → Drive an LRU cache → Under the hood → Key terms → Check yourself → Recap
- Lab: LRU cache simulator with capacity control and hit/miss/hit-rate stats.

### 17 · Queue Architecture (`queues`)
- Student: Why it matters → Producers, consumers, brokers → Run a live queue → Under the hood → Key terms → Check yourself → Recap
- Lab: Animated producer/consumer queue; create backpressure and drain it by adding consumers.

### 18 · How the Web Talks (`network`)
- Student: Why it matters → Anatomy of a URL → Trace a request → Methods & status codes → Under the hood → Key terms → Check yourself → Recap
- Lab: Animated DNS → TCP → TLS → HTTP request tracer with latency slider and cache/keep-alive toggles.

### 19 · APIs & REST (`apis`)
- Student: Why it matters → Resources, verbs & JSON → Build a JSON API → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python JSON serialize/parse, a tiny (method, path) → status REST router, and status-code families.

### 20 · Auth, Sessions & Tokens (`auth`)
- Student: Why it matters → AuthN vs. AuthZ → Decode a token → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python salted password hashing/verification and a JWT payload decoder showing tokens are signed, not secret.

### 21 · Hashing & Cryptography (`crypto`)
- Student: Why it matters → Hash vs. encrypt → Hash it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Real SHA-256 (Web Crypto) demonstrating the avalanche effect.

### 22 · Security Basics (`security`)
- Student: Why it matters → Think like an attacker → Break it, then fix it → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python SQL-injection demo vs. a parameterized fix, plus `html.escape` defusing an XSS payload.

### 23 · The Command Line & Pipes (`cli`)
- Student: Why it matters → Streams & pipes → Compose a pipeline → Under the hood → Key terms → Check yourself → Recap
- Lab: Python-backed pipeline engine chaining `grep`, `sort`, `uniq`, `wc`, `head`, `tail`, `nl`.

### 24 · Version Control with Git (`git`)
- Student: Why it matters → Commits & branches → Build a history → Under the hood → Key terms → Check yourself → Recap
- Lab: Interactive commit-graph builder (commit / branch / checkout / merge) producing two-parent merge commits.

### 25 · Regular Expressions (`regex`)
- Student: Why it matters → The building blocks → Test a pattern → Under the hood → Key terms → Check yourself → Recap
- Lab: Live regex tester with match highlighting, flags, and presets.

### 26 · Testing & TDD (`testing`)
- Student: Why it matters → The testing pyramid → Red, green, refactor → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python red (failing) → green (passing) asserts and a tiny pass/fail test runner.

### 27 · Debugging & Logging (`debugging`)
- Student: Why it matters → Observe, then change → Probe it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python print probes, leveled logging, and assertion invariants.

### 28 · Classes & Objects (`classes`)
- Student: Why it matters → Blueprints & instances → Make some objects → Under the hood → Key terms → Check yourself → Recap
- Lab: A class blueprint plus live instances with independent state and shared methods.

### 29 · Object-Oriented Programming (`oop`)
- Student: Why it matters → The four pillars → OOP in real code → The SOLID principles → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python snippets for encapsulation, inheritance, polymorphism, and abstraction.

### 30 · Design Patterns (`patterns`)
- Student: Why it matters → Three categories → The pattern catalog → Using patterns well → Key terms → Check yourself → Recap
- Lab: Searchable/filterable catalog of 28 patterns (all 23 GoF + industry), each with intent, when-to-use, real-world usage, and a runnable Python example.

### 31 · Functional Programming (`functional`)
- Student: Why it matters → Pure functions & higher-order → map / filter / reduce → Under the hood → Key terms → Check yourself → Recap
- Lab: Runnable Python pure-vs-impure, map/filter/reduce, and function composition over immutable data.

## Source map

```
src/
  App.tsx                     # experience-aware layout, theme dropdown, routing
  main.tsx                    # entry; wraps app in ExperienceProvider + HashRouter
  index.css                   # all styles (incl. teacher theme + theme select)
  pages/
    Home.tsx                  # student home (lesson cards)
    TeacherHome.tsx           # teacher home (curriculum overview)
  experience/
    ExperienceContext.tsx     # student/teacher context, persisted
    teacherGuides.ts          # teaching content for all lessons
    LessonPlan.tsx            # teacher lesson-plan view
  theme/
    themes.ts                 # theme catalog (id, label, swatch, mode)
    ThemeContext.tsx          # theme provider + hook, persisted
  lessons/
    meta.ts                   # lesson metadata + sections (registry data)
    index.tsx                 # id → component registry
    components/
      Lesson.tsx              # student lesson shell (hero + TOC + next)
      blocks.tsx              # Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms
      SnippetRunner.tsx       # shared editable Python lab runner
    <topic>/                  # one folder per lesson: <Topic>Lesson.tsx, playground(s), program.ts (Py)
  lib/
    pyodide.ts, usePyodide.ts # shared Pyodide runtime + hook
  components/RuntimeBanner.tsx
```

## Interactive labs by technology

- **Python / Pyodide:** Variables, Control Flow, Floating Point, Filesystem, Processes, Memory (references), Concurrency, Command Line, SQL (sqlite3), Errors, OOP, Design Patterns, Trees & Graphs, APIs & REST, Auth, Security Basics, Testing & TDD, Functional Programming, JSON & Serialization, Searching & Binary Search, Debugging & Logging.
- **Pure React:** Data & Encoding, Network, Load Balancing, Git, Data Structures, Algorithms, Recursion, Regex, Caching, Time, Compute Instances, Queue Architecture, Classes & Objects, CI/CD Pipelines.
- **Web Crypto:** Hashing & Cryptography.

## Deployment

Built with Vite (TypeScript) + Bun; deployed to GitHub Pages via
`.github/workflows/deploy.yml` on push to `main`. Cloud Agents use
`.cursor/environment.json` + `.cursor/install.sh` (Bun install, Vite on port
5173).

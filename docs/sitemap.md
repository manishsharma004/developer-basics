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

## Routes

| Route | Student view | Teacher view |
| --- | --- | --- |
| `/` | All lessons (cards) | Curriculum overview (grouped table) |
| `/lessons/:topic` | Interactive lesson | Lesson plan |

Routing uses `HashRouter` (GitHub Pages friendly). Adding a lesson = one entry in
`src/lessons/meta.ts` + a component wired in `src/lessons/index.tsx`; the teacher
guide lives in `src/experience/teacherGuides.ts`.

## Lessons (17)

Legend for lab tech: **Py** = Python via Pyodide (WebAssembly), **React** = pure
client-side React, **WebCrypto** = SubtleCrypto, **Intl** = Intl/Date.

| # | Topic | Path | Level | Min | Interactive lab | Tech |
| --- | --- | --- | --- | --- | --- | --- |
| 01 | The Filesystem | `/lessons/filesystem` | Beginner | 14 | Live shell + filesystem tree | Py |
| 02 | Processes & the CPU | `/lessons/process` | Beginner | 16 | CPU scheduler + animated Gantt | Py |
| 03 | Memory: Stack & Heap | `/lessons/memory` | Intermediate | 16 | References REPL + stack/heap visualizer | Py + React |
| 04 | Concurrency & Races | `/lessons/concurrency` | Intermediate | 15 | Thread race-condition simulation | Py |
| 05 | Data & Encoding | `/lessons/data` | Beginner | 13 | Number-base + UTF-8 converter | React |
| 06 | How the Web Talks | `/lessons/network` | Intermediate | 15 | Request lifecycle tracer + URL anatomy | React |
| 07 | Version Control with Git | `/lessons/git` | Beginner | 14 | Commit-graph builder | React |
| 08 | The Command Line & Pipes | `/lessons/cli` | Beginner | 13 | Pipeline composer | Py |
| 09 | Data Structures | `/lessons/datastructures` | Intermediate | 16 | Hash-map visualizer | React |
| 10 | Algorithms & Big-O | `/lessons/algorithms` | Intermediate | 15 | Sorting visualizer | React |
| 11 | Recursion | `/lessons/recursion` | Beginner | 13 | Recursion call-tree (+ memoization) | React |
| 12 | Databases & SQL | `/lessons/sql` | Beginner | 16 | Real SQLite playground | Py (sqlite3) |
| 13 | Regular Expressions | `/lessons/regex` | Beginner | 14 | Live regex tester | React |
| 14 | Errors & Exceptions | `/lessons/errors` | Beginner | 13 | try/except/finally playground | Py |
| 15 | Caching & LRU | `/lessons/caching` | Intermediate | 14 | LRU cache simulator | React |
| 16 | Hashing & Cryptography | `/lessons/crypto` | Intermediate | 14 | SHA-256 hasher (avalanche) | WebCrypto |
| 17 | Time, Dates & Timezones | `/lessons/time` | Beginner | 13 | Epoch / timezone converter | Intl |

## Per-lesson detail

Each entry lists the **student sections** (in-page nav) and the **interactive
lab**. Every student lesson also ends with **Key terms** and **Check yourself**
(quiz). Every teacher lesson plan has the same six sections: Learning objectives ·
Key concepts · Common misconceptions · Discussion prompts · Interactive lab ·
Assessment.

### 01 · The Filesystem (`filesystem`)
- Student: Why it matters → The mental model → Try it live → Working with files → Under the hood → Key terms → Check yourself → Recap
- Lab: Live Unix-like shell (`ls`, `cd`, `cat`, `mkdir`, `cp`, `mv`, `ln`, `wc`, `tree`, `stat`) over a real in-browser filesystem + live tree.

### 02 · Processes & the CPU (`process`)
- Student: Why it matters → What is a process? → Schedule it live → How processes start → Under the hood → Key terms → Check yourself → Recap
- Lab: Editable process table → FCFS/SJF/Round-Robin simulation with an animated Gantt chart and metrics.

### 03 · Memory: Stack & Heap (`memory`)
- Student: Why it matters → Values vs. references → Stack & heap, live → Garbage & leaks → Under the hood → Key terms → Check yourself → Recap
- Lab: Python "values vs references" REPL + interactive stack/heap visualizer (frames, allocation, references, stack overflow, garbage).

### 04 · Concurrency & Races (`concurrency`)
- Student: Why it matters → Threads & sharing → Race it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Multi-thread counter simulation interleaving read/add/write; compare correctness with and without a lock.

### 05 · Data & Encoding (`data`)
- Student: Why it matters → Bits, bytes & bases → Convert it live → Text is bytes too → Under the hood → Key terms → Check yourself → Recap
- Lab: Two-way number-base converter (dec/hex/bin/oct + byte view) and a UTF-8 text→bytes explorer.

### 06 · How the Web Talks (`network`)
- Student: Why it matters → Anatomy of a URL → Trace a request → Methods & status codes → Under the hood → Key terms → Check yourself → Recap
- Lab: Animated DNS → TCP → TLS → HTTP request tracer with latency slider and cache/keep-alive toggles.

### 07 · Version Control with Git (`git`)
- Student: Why it matters → Commits & branches → Build a history → Under the hood → Key terms → Check yourself → Recap
- Lab: Interactive commit-graph builder (commit / branch / checkout / merge) producing two-parent merge commits.

### 08 · The Command Line & Pipes (`cli`)
- Student: Why it matters → Streams & pipes → Compose a pipeline → Under the hood → Key terms → Check yourself → Recap
- Lab: Python-backed pipeline engine chaining `grep`, `sort`, `uniq`, `wc`, `head`, `tail`, `nl`.

### 09 · Data Structures (`datastructures`)
- Student: Why it matters → The big three → A hash map, live → Under the hood → Key terms → Check yourself → Recap
- Lab: Hash-map visualizer showing hashing to buckets, collisions/chaining, and load factor.

### 10 · Algorithms & Big-O (`algorithms`)
- Student: Why it matters → Big-O in plain words → Watch a sort → Under the hood → Key terms → Check yourself → Recap
- Lab: Animated sorting visualizer (bubble/insertion/selection) with a live comparison counter.

### 11 · Recursion (`recursion`)
- Student: Why it matters → Base case & recursion → Trace the calls → Under the hood → Key terms → Check yourself → Recap
- Lab: Factorial/Fibonacci call-tree with a memoization toggle showing the call-count collapse.

### 12 · Databases & SQL (`sql`)
- Student: Why it matters → Tables & queries → Run SQL live → Under the hood → Key terms → Check yourself → Recap
- Lab: Real in-browser SQLite (Pyodide `sqlite3`) with a seeded schema; run SELECT/WHERE/JOIN/GROUP BY.

### 13 · Regular Expressions (`regex`)
- Student: Why it matters → The building blocks → Test a pattern → Under the hood → Key terms → Check yourself → Recap
- Lab: Live regex tester with match highlighting, flags, and presets.

### 14 · Errors & Exceptions (`errors`)
- Student: Why it matters → How errors propagate → Catch it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Python playground running uncaught vs. handled errors, showing real tracebacks and `finally`.

### 15 · Caching & LRU (`caching`)
- Student: Why it matters → Hits, misses & eviction → Drive an LRU cache → Under the hood → Key terms → Check yourself → Recap
- Lab: LRU cache simulator with capacity control and hit/miss/hit-rate stats.

### 16 · Hashing & Cryptography (`crypto`)
- Student: Why it matters → Hash vs. encrypt → Hash it live → Under the hood → Key terms → Check yourself → Recap
- Lab: Real SHA-256 (Web Crypto) demonstrating the avalanche effect.

### 17 · Time, Dates & Timezones (`time`)
- Student: Why it matters → Epoch, UTC & offsets → Convert time → Under the hood → Key terms → Check yourself → Recap
- Lab: Epoch ↔ human-date converter shown across multiple timezones.

## Source map

```
src/
  App.tsx                     # experience-aware layout, switcher, routing
  main.tsx                    # entry; wraps app in ExperienceProvider + HashRouter
  index.css                   # all styles (incl. teacher theme)
  pages/
    Home.tsx                  # student home (lesson cards)
    TeacherHome.tsx           # teacher home (curriculum overview)
  experience/
    ExperienceContext.tsx     # student/teacher context, persisted
    teacherGuides.ts          # teaching content for all 17 lessons
    LessonPlan.tsx            # teacher lesson-plan view
  lessons/
    meta.ts                   # lesson metadata + sections (registry data)
    index.tsx                 # id → component registry
    components/
      Lesson.tsx              # student lesson shell (hero + TOC + next)
      blocks.tsx              # Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms
    <topic>/                  # one folder per lesson: <Topic>Lesson.tsx, playground(s), program.ts (Py)
  lib/
    pyodide.ts, usePyodide.ts # shared Pyodide runtime + hook
  components/RuntimeBanner.tsx
```

## Interactive labs by technology

- **Python / Pyodide:** Filesystem, Processes, Memory (references), Concurrency, Command Line, SQL (sqlite3), Errors.
- **Pure React:** Data & Encoding, Network, Git, Data Structures, Algorithms, Recursion, Regex, Caching, Time.
- **Web Crypto:** Hashing & Cryptography.

## Deployment

Built with Vite (TypeScript) + Bun; deployed to GitHub Pages via
`.github/workflows/deploy.yml` on push to `main`.

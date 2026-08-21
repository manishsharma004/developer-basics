# developer-basics

An interactive React playground for learning **developer basics**. Each topic
runs a real simulation in your browser (Python via WebAssembly), so you can
experiment and watch the model respond — no server required.

Current demos include interactive labs across **8 modules and 36 chapters** —
filesystem shells, CPU scheduling, memory models, SQL, networking, security,
algorithms, searching, serialization, debugging, and more. Each topic runs a
real simulation in your browser (often Python via WebAssembly), so you can
experiment and watch the model respond — no server required.

Highlights:

- **🗂️ Filesystem** — a genuine Unix-like shell and Python REPL on a real
  in-browser filesystem, with a live-updating directory tree.
- **⚙️ Process Architecture** — an editable process table feeding a real CPU
  scheduling simulation (FCFS, SJF, Round Robin) with an animated Gantt chart.
- **🔍 Searching & Binary Search**, **📦 JSON & Serialization**, and
  **🐛 Debugging & Logging** — runnable Python labs via the shared snippet runner.

See [`docs/sitemap.md`](docs/sitemap.md) for the full chapter index.

## Tech stack

- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/) in **TypeScript**
- [Vite](https://vite.dev/) for dev server and builds
- [Pyodide](https://pyodide.org/) (CPython on WebAssembly) powering the interactive simulations
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- [Bun](https://bun.sh/) as the package manager and script runner
- Deployed to **GitHub Pages** via GitHub Actions

## Getting started

Requires [Bun](https://bun.sh/) (`curl -fsSL https://bun.sh/install | bash`).

```bash
bun install        # install dependencies
bun run dev        # start the dev server (http://localhost:5173)
bun run lint       # run the linter
bun run typecheck  # type-check with tsc
bun run build      # production build into dist/
bun run preview    # preview the production build locally
```

## Deployment

Pushes to `main` trigger the [`Deploy to GitHub Pages`](.github/workflows/deploy.yml)
workflow, which lints, builds with the correct base path, and publishes `dist/`
to GitHub Pages. Enable Pages in the repo settings with **Source: GitHub Actions**.

## Project structure

```
src/
  App.tsx                    # layout + routing + theme dropdown
  main.tsx                   # entry point (HashRouter)
  pages/Home.tsx             # landing page (modules × chapters)
  lessons/
    meta.ts                  # chapter registry (36 lessons, 8 modules)
    index.tsx                # id → component wiring
    <topic>/                 # one folder per chapter
  theme/                     # color themes (persisted)
docs/sitemap.md              # full knowledge index
```

Add a new lesson by creating a component, registering it in `src/lessons/meta.ts`
and `src/lessons/index.tsx`, and adding a teacher guide in
`src/experience/teacherGuides.ts`.

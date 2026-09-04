# developer-basics

An interactive React playground for learning **developer basics**. Each topic
runs a real simulation in your browser (Python via WebAssembly), so you can
experiment and watch the model respond — no server required.

The course spans **14 modules and 123 chapters** — from variables and memory
through SQL, MongoDB, FastAPI, React, networking, security, tooling, and design
patterns. Highlights include filesystem shells, CPU scheduling, live SQL
playgrounds, and runnable Python labs via Pyodide.

See [`docs/sitemap.md`](docs/sitemap.md) for the full chapter index (regenerate
with `bun run sitemap` after editing `src/lessons/meta.ts`).

**Runtime architecture:** [open the interactive map](https://manishsharma004.github.io/developer-basics/architecture/developer-basics-runtime.architecture.html) on GitHub Pages (static file — no `#/` in the URL), or see [`docs/architecture/README.md`](docs/architecture/README.md) to regenerate with [Archify](https://github.com/tt-a1i/archify).

## Features

- **Progress tracking** — read state, quizzes, and capstone steps in IndexedDB (export/import supported)
- **Global search** — `Ctrl+K` / `⌘K` with shareable section links (`?section=`)
- **30+ themes** — including a System option that follows OS light/dark preference
- **Student & teacher modes** — interactive labs vs. lesson plans
- **Capstone path** — guided task-tracker project across SQL, API, React, auth, tests, deploy

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
bun run sitemap    # regenerate docs/sitemap.md from meta.ts
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
  progress/                  # IndexedDB progress + capstone steps
  lessons/
    meta.ts                  # chapter registry (123 lessons, 14 modules)
    index.tsx                # id → component wiring
    <topic>/                 # one folder per chapter
  theme/                     # color themes (persisted)
docs/sitemap.md              # full knowledge index (generated)
docs/architecture/           # Archify runtime map (JSON + HTML)
scripts/generate-sitemap.mjs # sitemap generator
scripts/architecture-deliver.sh
```

Add a new lesson by creating a component, registering it in `src/lessons/meta.ts`
and `src/lessons/index.tsx`, running `bun run sitemap`, and adding a teacher
guide in `src/experience/teacherGuides.ts` or `chapterGuides.ts`.

# developer-basics

An interactive React playground for learning **developer basics**. Each topic
runs a real simulation in your browser (Python via WebAssembly), so you can
experiment and watch the model respond — no server required.

Current demos:

- **🗂️ Filesystem** — a genuine Unix-like shell (`ls`, `cd`, `cat`, `mkdir`,
  `tree`, `stat`, redirection…) and a Python REPL, both operating on a real
  in-browser filesystem, with a live-updating directory tree.
- **⚙️ Process Architecture** — an editable process table feeding a real CPU
  scheduling simulation (FCFS, SJF, Round Robin) with an animated Gantt chart
  and waiting/turnaround metrics.

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
  App.tsx                    # layout + routing
  main.tsx                   # entry point (HashRouter)
  pages/Home.tsx             # landing page
  lib/
    pyodide.ts               # shared, lazily-loaded Pyodide runtime
    usePyodide.ts            # React hook exposing load state
  components/RuntimeBanner.tsx
  demos/
    index.ts                 # demo registry (nav + routes)
    FilesystemDemo.tsx       # shell + Python REPL + live tree
    filesystemProgram.ts     # Python shell implementation
    ProcessDemo.tsx          # scheduling UI + animated Gantt chart
    processProgram.ts        # Python CPU-scheduling simulation
```

Add a new demo by creating a component and registering it in `src/demos/index.ts`.

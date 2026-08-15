# developer-basics

An interactive React playground for learning **developer basics**. Each topic
pairs a short explanation with something you can click.

Current demos:

- **🗂️ Filesystem** — explore a Unix-like directory tree and inspect the
  metadata (paths, permissions, owner, size, inode) the OS stores per entry.
- **⚙️ Process Architecture** — walk a process tree, see a virtual memory
  layout, and step a process through its lifecycle state machine.

## Tech stack

- [React 19](https://react.dev/) + [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/) for dev server and builds
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting
- Deployed to **GitHub Pages** via GitHub Actions

## Getting started

Requires Node.js 20+.

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run lint     # run the linter
npm run build    # production build into dist/
npm run preview  # preview the production build locally
```

## Deployment

Pushes to `main` trigger the [`Deploy to GitHub Pages`](.github/workflows/deploy.yml)
workflow, which lints, builds with the correct base path, and publishes `dist/`
to GitHub Pages. Enable Pages in the repo settings with **Source: GitHub Actions**.

## Project structure

```
src/
  App.jsx              # layout + routing
  main.jsx             # entry point (HashRouter)
  pages/Home.jsx       # landing page
  demos/
    index.js           # demo registry (nav + routes)
    FilesystemDemo.jsx
    ProcessDemo.jsx
```

Add a new demo by creating a component and registering it in `src/demos/index.js`.

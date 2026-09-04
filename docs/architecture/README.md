# Runtime architecture

Interactive map of how **developer-basics** runs in the browser — generated with [Archify](https://github.com/tt-a1i/archify).

| Artifact | Purpose |
| --- | --- |
| [`public/architecture/developer-basics-runtime.architecture.html`](../../public/architecture/developer-basics-runtime.architecture.html) | Deployed static file (Vite `public/` → GitHub Pages) |
| [`developer-basics-runtime.architecture.json`](./developer-basics-runtime.architecture.json) | Typed source IR — edit and re-deliver when architecture changes |

## View on GitHub Pages

The diagram is a **static HTML file**, not a React route. Open it **without** the `#/` hash:

**https://manishsharma004.github.io/developer-basics/architecture/developer-basics-runtime.architecture.html**

Wrong (HashRouter shows the home page):

`…/developer-basics/#/docs/architecture/…`

Local dev: `http://localhost:5173/architecture/developer-basics-runtime.architecture.html`

## What it shows

- **Static delivery** — GitHub Actions → GitHub Pages (no app server)
- **COI service worker** — enables `SharedArrayBuffer` for WASM shells
- **Lesson runtimes** — Pyodide (Python), v86 (Alpine+Podman), Wasmer (bash fallback)
- **Client state** — IndexedDB for progress and v86 VM snapshots

## Install Archify (Cursor skill)

Requires Node.js 18+ and `npx`:

```bash
bash scripts/install-archify-skill.sh
```

Or manually:

```bash
npx -y skills add tt-a1i/archify --skill archify --agent cursor --global --copy --yes
```

The skill installs to `~/.cursor/skills/archify` (global) or `.cursor/skills/archify` (project-local if you omit `--global`).

## Regenerate after architecture changes

1. Edit `developer-basics-runtime.architecture.json` (components, connections, `meta.repository.revision`).
2. Run:

```bash
bash scripts/architecture-deliver.sh
```

3. Commit the `.json` and `public/architecture/*.html`.

Validate only (no HTML write):

```bash
node .cursor/skills/archify/bin/archify.mjs validate architecture \
  docs/architecture/developer-basics-runtime.architecture.json \
  --quality showcase --repo-root . --json
```

## Ask the agent

```
Analyze this repository, then use archify to update docs/architecture/developer-basics-runtime.architecture.json
and re-deliver the HTML to public/architecture/. Show 8–12 core components, the primary lesson-load path,
WASM runtimes, and trust boundaries.
```

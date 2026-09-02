# Cursor agent instructions — developer-basics

Instructions for Cursor Cloud Agents and other automated contributors working in this repo.

## Project

Interactive React + TypeScript course with in-browser simulations (Pyodide, Wasmer, v86). Lessons live under `src/lessons/`; routes in `src/lessons/index.tsx` and `src/App.tsx`.

## Commands

| Task | Command |
|------|---------|
| Install | `bun install` |
| Dev server | `bun run dev` (http://localhost:5173) |
| Typecheck | `bun run typecheck` |
| Build | `bun run build` |
| Lint | `bun run lint` |
| E2E tests | `bun run test:e2e` |

Dev server in Cloud: port **5173** (see `.cursor/environment.json`).

## Git workflow (required)

### Always rebase before opening or updating a PR

**Before every `create_pr` / `update_pr` and before every push**, rebase your feature branch onto the PR **base branch**. In most cases the base branch is **`main`**. If the task or cloud instructions name a different base (e.g. `cursor-agent/issue-backlog-72bc`), use that instead.

```bash
# Replace <base> with main unless told otherwise
git fetch origin <base>
git rebase origin/<base>
```

1. **Fetch and rebase** — do not merge the base branch into your feature branch unless the user explicitly asks for a merge commit.
2. **Fix conflicts**, run `bun run typecheck` (and tests if you changed behavior), then `git rebase --continue`.
3. **Push** the rebased branch:
   ```bash
   git push -u origin <branch-name> --force-with-lease
   ```
4. **Create or update the PR** only after the rebase and push succeed, so the diff is against the current base.

If rebase skips commits already on the base (zero commits ahead), close or do not open an empty PR — note that the work is already merged.

### Branch naming

Use the prefix and suffix required by the active cloud task, e.g.:

```text
cursor-agent/<descriptive-name>-<suffix>
```

### Pull requests

- Use the `ManagePullRequest` tool (not `gh`) to create and update PRs.
- Set `branch_name` and `base_branch` on every call.
- Default **`base_branch` to `main`** unless the task specifies another base.
- Commit and push before each PR create/update.
- Write clear commit messages and PR descriptions in complete sentences.

## Code conventions

- Minimal, focused diffs; match surrounding style and patterns.
- Do not add docs or markdown the user did not request (this file and existing project docs excepted).
- Lessons: `src/lessons/meta.ts`, `src/lessons/index.tsx`, chapter tracks via `createChapterLesson`.
- Teacher guides: `src/experience/chapterGuides.ts`, `src/experience/teacherGuides.ts`.

## Containerization lab (v86 / Wasmer)

- Shell toggle: `src/components/ShellBackendToggle.tsx`, `src/lib/shellRuntime.ts`.
- v86 VM image is built in CI (`bun run v86:build-image`); not committed to git. See `docs/plans/v86-podman-lab.md`.
- Local dev without Docker: `bun run v86:fetch-lab-image`.

## Gotchas

- GitHub Pages `BASE_PATH` is `/developer-basics/` — use `asset()` / `import.meta.env.BASE_URL` for public asset URLs.
- Stale TS build cache: `rm -f tsconfig.app.tsbuildinfo tsconfig.node.tsbuildinfo` then rebuild.
- Workflow file changes may require `workflow` scope on the push token; if push is rejected, commit other files and document the workflow edit for the user.

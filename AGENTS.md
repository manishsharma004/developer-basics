# developer-basics

Interactive React + TypeScript course with in-browser simulations (Pyodide). Lessons live under `src/lessons/`; metadata in `src/lessons/meta.ts`; routes and sidebar wiring in `src/lessons/index.tsx` and `src/App.tsx`.

**Cursor agents:** see [`.cursor/AGENTS.md`](.cursor/AGENTS.md) for full Cloud Agent instructions (git rebase before PR, commands, conventions).

## Commands

- Install: `bun install`
- Dev server: `bun run dev` (http://localhost:5173)
- Typecheck + build: `bun run build`
- Lint: `bun run lint`

## Git workflow (required)

Before **every push** and before **creating or updating a pull request**:

1. **Fetch and rebase onto the PR base branch** — usually `main`; use another base only when the task says so. Do not merge the base into feature branches unless the user explicitly asks for a merge commit.
   ```bash
   git fetch origin main
   git rebase origin/main
   ```
2. **Resolve conflicts**, re-run `bun run build`, then continue the rebase if needed.
3. **Force-push rebased branches** with lease:
   ```bash
   git push -u origin <branch-name> --force-with-lease
   ```
4. **Create or update the PR** after rebase and push so the diff targets the current base.

If a feature branch’s changes are already on the base after rebase (zero commits ahead), note that in the PR and close it instead of leaving an empty PR open.

**Before reporting back to the user**, check whether the PR is already merged (rebase may skip commits; `git log origin/main..HEAD` may be empty). Do not ask the user to merge work that is already on `main`. See [`.cursor/AGENTS.md`](.cursor/AGENTS.md) for the full checklist.

Branch names for cloud agents: `cursor-agent/<descriptive-name>-<suffix>` (suffix from the active cloud task).

## Project conventions

- Add lessons in `src/lessons/meta.ts` + `src/lessons/index.tsx`; chapter tracks use `createChapterLesson` in `src/lessons/components/ChapterLesson.tsx`.
- Teacher guides: `src/experience/chapterGuides.ts` and `src/experience/teacherGuides.ts`.
- Prefer minimal, focused diffs; match existing patterns in surrounding files.
- Do not edit unrelated files or add markdown/docs the user did not request.

## Cursor Cloud environment

- Package manager: **Bun** (`bun install`, `bun run dev`).
- Dev server port: **5173** (see `.cursor/environment.json`).
- Stale TS build cache can cause false errors; clear with `rm -f tsconfig.app.tsbuildinfo tsconfig.node.tsbuildinfo` before rebuilding if needed.

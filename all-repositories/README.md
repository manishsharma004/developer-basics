# all-repositories

Sibling projects checked out alongside [developer-basics](../README.md) for local development in Cloud Agents.

| Project | Dev URL | Stack |
| --- | --- | --- |
| [retro-games](./retro-games/) | http://localhost:5174/retro-games/ | Vite + React + Nostalgist |
| [system-design-copilot](./system-design-copilot/) | http://localhost:4173/system-design-copilot/ | SvelteKit + Vite |

## Setup

From the repository root, Cloud Agent install runs `./all-repositories/setup.sh`, which clones any missing repos and runs `bun install` in each.

Manual setup:

```bash
bash all-repositories/setup.sh
```

## Dev servers

```bash
# retro-games (port 5174 avoids clashing with developer-basics on 5173)
cd all-repositories/retro-games && bun run dev -- --host 0.0.0.0 --port 5174

# system-design-copilot
cd all-repositories/system-design-copilot && bun run dev
```

See each project's README for build, lint, and test commands.

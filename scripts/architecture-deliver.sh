#!/usr/bin/env bash
# Validate and deliver the runtime architecture diagram (Archify).
# HTML is written to public/ so Vite copies it into dist/ for GitHub Pages.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SKILL="${ARCHIFY_SKILL_DIR:-$ROOT/.cursor/skills/archify}/bin/archify.mjs"
JSON="$ROOT/docs/architecture/developer-basics-runtime.architecture.json"
HTML="$ROOT/public/architecture/developer-basics-runtime.architecture.html"

if [[ ! -f "$SKILL" ]]; then
  echo "Archify skill not found at $SKILL" >&2
  echo "Run: bash scripts/install-archify-skill.sh" >&2
  exit 1
fi

mkdir -p "$(dirname "$HTML")"
REV="$(git -C "$ROOT" rev-parse HEAD)"
echo "Delivering architecture diagram (revision $REV)…"
node "$SKILL" deliver architecture "$JSON" "$HTML" --quality showcase --repo-root "$ROOT" --json

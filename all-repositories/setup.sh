#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="${BUN_INSTALL:-$HOME/.bun}/bin:$PATH"

clone_if_missing() {
  local name="$1"
  local url="$2"
  local dir="$ROOT/$name"

  if [[ -d "$dir/.git" ]]; then
    echo "Repository already present: $name"
    return 0
  fi

  echo "Cloning $name…"
  git clone "$url" "$dir"
}

install_project() {
  local name="$1"
  local dir="$ROOT/$name"

  echo "Installing dependencies for $name…"
  (cd "$dir" && bun install)
}

clone_if_missing retro-games https://github.com/manishsharma004/retro-games.git
clone_if_missing system-design-copilot https://github.com/manishsharma004/system-design-copilot.git

install_project retro-games
install_project system-design-copilot

echo "all-repositories setup complete."

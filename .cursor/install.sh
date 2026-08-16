#!/usr/bin/env bash
set -euo pipefail

# Ensure Bun is available. The Cloud Agent base image does not ship Bun, so we
# bootstrap it once; the guard keeps this idempotent (no repeated profile edits
# on re-runs) and lets the result be captured in an environment snapshot.
if ! command -v bun >/dev/null 2>&1; then
  echo "Installing Bun…"
  curl -fsSL https://bun.sh/install | bash
fi

export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
export PATH="$BUN_INSTALL/bin:$PATH"

bun --version
bun install --frozen-lockfile

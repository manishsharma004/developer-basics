#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/public/v86/bios"
BASE="https://cdn.jsdelivr.net/gh/copy/v86@master/bios"

mkdir -p "$DEST"

for file in seabios.bin vgabios.bin; do
  if [ ! -f "$DEST/$file" ]; then
    echo "Downloading $file…"
    curl -fsSL "$BASE/$file" -o "$DEST/$file"
  else
    echo "Already present: $file"
  fi
done

echo "BIOS files ready in $DEST"

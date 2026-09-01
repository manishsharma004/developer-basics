#!/usr/bin/env bash
# Download the pre-built v86 Podman lab image (manifest + fs.json + flat chunks).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/public/v86/lab-rootfs"
SOURCE="${V86_LAB_SOURCE:-https://manishsharma004.github.io/developer-basics/v86/lab-rootfs}"

mkdir -p "$OUT/flat"

echo "Fetching manifest from $SOURCE …"
if ! curl -fsSL "$SOURCE/manifest.json" -o "$OUT/manifest.json"; then
  echo "Pre-built lab image not found at $SOURCE" >&2
  echo "The image is built during GitHub Pages deploy, or locally with: bun run v86:build-image" >&2
  exit 1
fi

echo "Fetching fs.json …"
curl -fsSL "$SOURCE/fs.json" -o "$OUT/fs.json"

echo "Downloading rootfs chunks (this may take a minute) …"
python3 - "$SOURCE" "$OUT" <<'PY'
import json
import sys
import urllib.request
from pathlib import Path

source, out = sys.argv[1], Path(sys.argv[2])
fs = json.loads((out / "fs.json").read_text())

def collect_hashes(node):
    hashes = set()
    if isinstance(node, dict):
        contents = node.get("contents")
        if isinstance(contents, str) and len(contents) == 64 and all(c in "0123456789abcdef" for c in contents):
            hashes.add(contents)
        for value in node.values():
            hashes |= collect_hashes(value)
    elif isinstance(node, list):
        for item in node:
            hashes |= collect_hashes(item)
    return hashes

hashes = collect_hashes(fs)
flat = out / "flat"
flat.mkdir(parents=True, exist_ok=True)
total = len(hashes)
for i, digest in enumerate(sorted(hashes), 1):
    dest = flat / digest
    if dest.exists():
        continue
    url = f"{source.rstrip('/')}/flat/{digest}"
    print(f"  [{i}/{total}] {digest[:12]}…", flush=True)
    with urllib.request.urlopen(url) as resp:
        dest.write_bytes(resp.read())

print(f"Lab image ready in {out}")
PY

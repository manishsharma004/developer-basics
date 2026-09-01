#!/usr/bin/env bash
# Hash inputs that affect the v86 Podman lab rootfs (used by CI cache key).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

{
  printf 'v86-lab-cache-v1\n'
  sha256sum \
    scripts/v86/Dockerfile \
    scripts/v86/lab-init.sh \
    scripts/v86/build-lab-image.sh \
    src/lessons/containerization/programs/fake-compose.sh \
    src/lessons/containerization/programs/fake-kubectl.sh \
    2>/dev/null
  find src/lessons/containerization/programs/lab -type f | sort | while read -r f; do
    sha256sum "$f"
  done
} | sha256sum | awk '{print $1}'

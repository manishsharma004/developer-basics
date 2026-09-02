#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
V86_DIR="$ROOT/scripts/v86"
OUT="$ROOT/public/v86/lab-rootfs"
IMAGES="$ROOT/.cache/v86-images"
CONTAINER_NAME=developer-basics-v86-lab
IMAGE_NAME=developer-basics/v86-podman-lab

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required to build the v86 Podman lab image." >&2
  echo "Install Docker, then re-run: bun run v86:build-image" >&2
  exit 1
fi

bash "$V86_DIR/download-bios.sh"

mkdir -p "$IMAGES" "$OUT" "$V86_DIR/staging/opt-lab"

if [[ "${V86_SKIP_IF_PRESENT:-}" == "1" ]] && [[ -f "$OUT/manifest.json" ]] && [[ -f "$OUT/fs.json" ]] && [[ -d "$OUT/flat" ]]; then
  echo "v86 lab rootfs already present — skipping build (V86_SKIP_IF_PRESENT=1)"
  exit 0
fi

# Stage compose/kubectl simulators (podman handles build/run).
cp "$ROOT/src/lessons/containerization/programs/fake-compose.sh" "$V86_DIR/staging/opt-lab/compose.sh"
cp "$ROOT/src/lessons/containerization/programs/fake-kubectl.sh" "$V86_DIR/staging/opt-lab/kubectl.sh"
cp -r "$ROOT/src/lessons/containerization/programs/lab/." "$V86_DIR/staging/lab/"
cp "$V86_DIR/lab-init.sh" "$V86_DIR/staging/lab-init.sh"

TOOLS="$ROOT/.cache/v86-tools"
if [ ! -f "$TOOLS/tools/fs2json.py" ]; then
  echo "Fetching v86 fs2json tools…"
  rm -rf "$TOOLS"
  git clone --depth 1 https://github.com/copy/v86.git "$TOOLS"
fi

echo "Building Alpine i386 image with Podman…"
docker build --platform linux/386 -f "$V86_DIR/Dockerfile" \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t "$IMAGE_NAME" "$V86_DIR/staging"

docker rm -f "$CONTAINER_NAME" 2>/dev/null || true
docker create --platform linux/386 -t -i --name "$CONTAINER_NAME" "$IMAGE_NAME"

ROOTFS_TAR="$IMAGES/alpine-podman-rootfs.tar"
docker export "$CONTAINER_NAME" -o "$ROOTFS_TAR"
docker rm -f "$CONTAINER_NAME"

tar -f "$ROOTFS_TAR" --delete ".dockerenv" 2>/dev/null || true

FSJSON="$OUT/fs.json"
FLAT="$OUT/flat"
rm -rf "$FLAT"
mkdir -p "$FLAT"

python3 "$TOOLS/tools/fs2json.py" --out "$FSJSON" "$ROOTFS_TAR"
python3 "$TOOLS/tools/copy-to-sha256.py" "$ROOTFS_TAR" "$FLAT"

# fs.json and flat/ are already in $OUT — no move needed.

BYTES=$(wc -c < "$ROOTFS_TAR" | tr -d ' ')
CHUNK=256000
PARTS=$(( (BYTES + CHUNK - 1) / CHUNK ))

cat > "$OUT/manifest.json" <<EOF
{
  "version": 2,
  "profile": "alpine-podman-lab",
  "rootfsBytes": $BYTES,
  "chunkSize": $CHUNK,
  "baseurl": ".",
  "memoryMb": 384,
  "cmdline": "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci console=ttyS0"
}
EOF

echo "Lab rootfs written to $OUT ($PARTS flat chunks, ${BYTES} bytes tar)"
echo "Run: bun run dev — v86 shell will use Podman when manifest.json is present."

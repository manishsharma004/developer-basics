# v86 + Podman container lab — implementation plan

> Status: **Implemented** (hybrid shell runtime)  
> Branch: `cursor-agent/v86-podman-lab-9bf7`

## Goal

Replace the “fake filesystem” Wasmer experience with a **real 32-bit Linux VM** (v86) running **Podman** for container build/run, while keeping Wasmer and React simulators as fallbacks.

## Architecture

```
ContainerShell
├── Tier 1: v86 Alpine VM + Podman (primary)     ← real ls/touch/podman build
├── Tier 2: Wasmer bash + scripted CLIs (fast)   ← fallback when image missing
└── Tier 3: DockerCliSim React (always while loading / COI failure)
```

## Phases

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 0 | Spike: v86 serial console + 9p lab mount | Done |
| 1 | `shellRuntime` abstraction, `V86Shell`, fallback chain | Done |
| 2 | Alpine i386 image with `podman`, `podman-docker`, lab tree | Done (`scripts/v86/`) |
| 3 | VM snapshot cache (IndexedDB), boot progress UI | Done |

**9p root:** kernel cmdline must use `root=host9p` (not `root=/dev/root`). Alpine **3.18.6** + edge `mkinitfs` for reliable v86 virtio-9p boot.

## Image build

Podman requires the custom Alpine rootfs (~50–80 MB chunked). It is **not committed to git**; deploy CI builds it and serves it as a pre-built asset.

```bash
bun run v86:download-bios    # seabios + vgabios → public/v86/bios/ (committed)
bun run v86:fetch-lab-image  # download pre-built image for local dev
bun run v86:build-image      # optional: rebuild with Docker
```

Without a reachable `manifest.json` (local, same-origin, or pre-built CDN), the app falls back to Wasmer.

**CI cache:** deploy restores `public/v86/lab-rootfs/` from GitHub Actions cache (keyed on Dockerfile, lab-init, and lab files). Rebuilds only when those inputs change.

## Guest layout

| Path | Contents |
|------|----------|
| `/home/lab` | Sample app (`Dockerfile`, `package.json`, `src/`) |
| `/opt/lab` | `compose.sh`, `kubectl.sh` (simulated orchestration) |
| `/var/lib/containers` | Podman storage (real) |

`podman-docker` provides `docker` → Podman CLI compatibility.

## Pros / cons (decision record)

**Pros:** Real Linux VFS, real Podman builds, honest container semantics, no Wasmer `Directory()` hacks.

**Cons:** 20–60 s cold boot, large disk image, 256 MB+ RAM, 32-bit only, image build requires Docker.

## Tests

- `tests/e2e/wasmer-shell.spec.ts` — Wasmer fallback path (unchanged)
- `tests/e2e/v86-shell.spec.ts` — optional when `V86_E2E=1` and image built

## References

- [v86](https://github.com/copy/v86) — x86 emulator in WASM
- [v86 Alpine guest](https://github.com/copy/v86/tree/master/tools/docker/alpine)
- Alpine i386 `podman` package (community repo)

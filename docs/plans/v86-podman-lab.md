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

## Image build

Podman requires the custom Alpine rootfs (not bundled in git — ~50–80 MB chunked).

```bash
bun run v86:download-bios    # seabios + vgabios → public/v86/bios/
bun run v86:build-image      # Docker required: Alpine i386 + podman → public/v86/lab-rootfs/
```

Without `public/v86/lab-rootfs/manifest.json`, the app falls back to Wasmer automatically.

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

# Podman lab rootfs (generated)

Run `bun run v86:build-image` (requires Docker) to produce:

- `fs.json` — 9p filesystem index for v86
- `flat/` — content-addressed rootfs chunks
- `manifest.json` — runtime metadata

Until this directory is populated, the app falls back to the Wasmer shell.

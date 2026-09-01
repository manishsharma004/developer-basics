# Podman lab rootfs (pre-built)

The v86 Real VM shell loads a **pre-built** Alpine i386 image with Podman.

## Production

GitHub Pages deploy builds the image automatically (`bun run v86:build-image` in CI) and serves it from `/v86/lab-rootfs/`.

## Local development

```bash
bun run v86:fetch-lab-image   # download pre-built image from the live site
# or, if you have Docker:
bun run v86:build-image
```

Until `manifest.json` exists here, the app uses the Wasmer shell or shows a setup hint for Real VM.

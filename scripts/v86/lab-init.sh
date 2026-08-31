#!/bin/sh
# Sourced on login in the v86 Alpine lab VM.
export HOME=/root
export PS1='lab-vm# '
cd /home/lab 2>/dev/null || cd /

if command -v podman >/dev/null 2>&1; then
  alias docker=podman 2>/dev/null
  alias kubectl='bash /opt/lab/kubectl.sh' 2>/dev/null
  alias compose='bash /opt/lab/compose.sh' 2>/dev/null
  echo "Podman lab ready — try: podman build -t sample-img -f Dockerfile ."
else
  echo "Podman not found — rebuild the lab image with: bun run v86:build-image"
fi

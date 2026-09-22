#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="${HOME}/.bun/bin:${PATH}"
DEV_PORT="${DEV_PORT:-5173}"

cleanup() {
  [[ -n "${BROKER_PID:-}" ]] && kill "$BROKER_PID" 2>/dev/null || true
  [[ -n "${LAB_PID:-}" ]] && kill "$LAB_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting Kafka broker (Docker Redpanda or tiny-kafka fallback)…"
bun scripts/start-kafka-broker.mjs &
BROKER_PID=$!

sleep 2
echo "Starting Kafka lab HTTP API…"
bun scripts/kafka-lab-server.mjs &
LAB_PID=$!

sleep 1
echo "Starting Vite on port ${DEV_PORT}…"
bun run dev --port "$DEV_PORT" --host 0.0.0.0

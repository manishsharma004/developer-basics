#!/bin/bash
# Detach nested bash from the shared xterm stdin stream (WASI has no TTY).
exec 0<&-

# Simulated docker compose for the in-browser bash lab.
STATE="/var/lab"
STACK_FILE="$STATE/compose-stack.tsv"
touch "$STACK_FILE" 2>/dev/null || true

usage() {
  cat <<'EOF'
Usage: docker compose [COMMAND]

Commands:
  up       Start services (simulated dependency order)
  down     Stop and remove services
  ps       List services
  logs     Show service logs

State lives in /var/lab
EOF
}

default_stack() {
  cat > "$STACK_FILE" <<'EOF'
web	up	8080:80	api
api	up		myapi:1.0	db
db	up		postgres:16
EOF
}

cmd="${1:-}"
shift || true

case "$cmd" in
  ''|--help|-h|help)
    usage
    ;;
  up)
    default_stack
    echo "Creating network compose_default ..."
  while IFS=$'\t' read -r name status ports deps; do
      [ -z "$name" ] && continue
      if [ -n "$deps" ]; then
        echo "Waiting for $deps ..."
      fi
      echo "Starting $name ... done"
    done < "$STACK_FILE"
    echo "Compose stack is up (simulated)."
    ;;
  down)
    : > "$STACK_FILE"
    echo "Stopping services ... done"
    echo "Removing network compose_default ... done"
    ;;
  ps)
    if [ ! -s "$STACK_FILE" ]; then
      echo "(no services — run: docker compose up -d)"
    else
      echo -e "NAME\tSTATUS\tPORTS"
      while IFS=$'\t' read -r name status ports _; do
        [ -z "$name" ] && continue
        echo -e "${name}\t${status}\t${ports}"
      done < "$STACK_FILE"
    fi
    ;;
  logs)
    svc="${1:-web}"
    echo "[$svc] GET /health 200"
    echo "[$svc] listening on :80"
    ;;
  *)
    echo "compose: '$cmd' is not simulated. Try: up, down, ps, logs" >&2
    exit 1
    ;;
esac

#!/bin/bash
# Detach nested bash from the shared xterm stdin stream (WASI has no TTY).
exec 0<&-

# Simulated kubectl for the in-browser bash lab.
STATE="/var/lab"
PODS_FILE="$STATE/k8s-pods.tsv"
DEPLOYS_FILE="$STATE/k8s-deploys.tsv"

init_cluster() {
  if [ ! -s "$PODS_FILE" ]; then
    cat > "$PODS_FILE" <<'EOF'
web-7d4f8-abc	Running	node-1
web-7d4f8-def	Running	node-2
api-9k2-x1	Running	node-1
EOF
  fi
  if [ ! -s "$DEPLOYS_FILE" ]; then
    echo -e "web\t2\t2" > "$DEPLOYS_FILE"
  fi
}

init_cluster

usage() {
  cat <<'EOF'
Usage: kubectl [command]

Commands:
  get pods|deploy
  scale deploy <name> --replicas=N
  delete pod <name>
  logs <resource>
  apply -f <file>   (simulated)

State lives in /var/lab
EOF
}

cmd="${1:-}"
shift || true

case "$cmd" in
  ''|--help|-h|help)
    usage
    ;;
  get)
    resource="${1:-}"
    case "$resource" in
      pods|pod)
        echo -e "NAME\tSTATUS\tNODE"
        cat "$PODS_FILE"
        ;;
      deploy|deployment|deployments)
        echo -e "NAME\tREADY"
        while IFS=$'\t' read -r name replicas ready; do
          [ -z "$name" ] && continue
          echo -e "${name}\t${ready}/${replicas}"
        done < "$DEPLOYS_FILE"
        ;;
      *)
        echo "kubectl get: unsupported resource '$resource'" >&2
        exit 1
        ;;
    esac
    ;;
  scale)
    if [ "${1:-}" != "deploy" ] && [ "${1:-}" != "deployment" ]; then
      echo "kubectl scale deploy <name> --replicas=N" >&2
      exit 1
    fi
    name="${2:-}"
    replicas=""
    for arg in "$@"; do
      case "$arg" in
        --replicas=*) replicas="${arg#--replicas=}" ;;
      esac
    done
    if [ -z "$name" ] || [ -z "$replicas" ]; then
      echo "usage: kubectl scale deploy <name> --replicas=N" >&2
      exit 1
    fi
    while IFS=$'\t' read -r dname dreplicas dready; do
      if [ "$dname" = "$name" ]; then
        dreplicas="$replicas"
        [ "$dready" -gt "$replicas" ] 2>/dev/null && dready="$replicas"
      fi
      printf '%s\t%s\t%s\n' "$dname" "$dreplicas" "$dready"
    done < "$DEPLOYS_FILE" > "$DEPLOYS_FILE.tmp"
    mv "$DEPLOYS_FILE.tmp" "$DEPLOYS_FILE"
    echo "deployment/${name} scaled"
    ;;
  delete)
    resource="${1:-}"
    name="${2:-}"
    if [ "$resource" = "pod" ] && [ -n "$name" ]; then
      while IFS= read -r line; do
        [ "${line%%$'\t'*}" = "$name" ] || printf '%s\n' "$line"
      done < "$PODS_FILE" > "$PODS_FILE.tmp"
      mv "$PODS_FILE.tmp" "$PODS_FILE"
      echo "pod \"${name}\" deleted"
    else
      echo "kubectl delete: try delete pod <name>" >&2
      exit 1
    fi
    ;;
  logs)
    target="${1:-web}"
    echo "[${target}] GET /health 200"
    ;;
  apply)
    echo "deployment.apps/web configured (simulated apply)"
    ;;
  *)
    echo "kubectl: '$cmd' is not simulated. Try: get, scale, delete, logs, apply" >&2
    exit 1
    ;;
esac

#!/bin/bash
# Simulated docker CLI for the in-browser bash lab (not a real daemon).
STATE="/tmp/.docker-sim"
mkdir -p "$STATE"
IMAGE_FLAG="$STATE/has_image"
CTR_FILE="$STATE/containers.tsv"
NEXT_FILE="$STATE/next_id"
touch "$CTR_FILE"
[ -f "$NEXT_FILE" ] || echo 1 > "$NEXT_FILE"

usage() {
  cat <<'EOF'
Usage: docker [OPTIONS] COMMAND

Common commands:
  build    Build an image from a Dockerfile
  run      Run a container from an image
  ps       List containers
  stop     Stop a running container
  rm       Remove a container
  logs     Fetch container logs

This is a browser simulation — state lives in /tmp/.docker-sim
EOF
}

next_id() {
  local id
  id=$(cat "$NEXT_FILE")
  echo "c$id"
  echo $((id + 1)) > "$NEXT_FILE"
}

has_image() {
  [ -f "$IMAGE_FLAG" ]
}

update_row() {
  local id="$1" field="$2" value="$3"
  awk -F'\t' -v id="$id" -v f="$field" -v v="$value" '
    BEGIN { OFS="\t" }
    $1 == id {
      if (f == "status") $4 = v
      print
      next
    }
    { print }
  ' "$CTR_FILE" > "$CTR_FILE.tmp" && mv "$CTR_FILE.tmp" "$CTR_FILE"
}

cmd="${1:-}"
shift || true

case "$cmd" in
  ''|--help|-h|help)
    usage
    ;;
  build)
    touch "$IMAGE_FLAG"
    echo "Successfully tagged myapp:1.0"
    ;;
  run)
    if ! has_image; then
      echo "Error: image myapp:1.0 not found — run: docker build -t myapp:1.0 ." >&2
      exit 1
    fi
    name=""
    while [ $# -gt 0 ]; do
      case "$1" in
        --name) name="$2"; shift 2 ;;
        -p|--publish|-v|--volume|-e|--env|--restart|-t) shift 2 ;;
        -d|--detach) shift ;;
        -*) shift ;;
        *) shift ;;
      esac
    done
    id=$(next_id)
    [ -n "$name" ] || name="$id"
    echo -e "${id}\t${name}\tmyapp:1.0\trunning\t8080→80" >> "$CTR_FILE"
    echo "$id"
    ;;
  ps)
    if [ ! -s "$CTR_FILE" ]; then
      echo "(no containers)"
    else
      echo -e "ID\tNAME\tIMAGE\tSTATUS\tPORTS"
      cat "$CTR_FILE"
    fi
    ;;
  stop)
    id="${1:-}"
    if [ -z "$id" ]; then
      echo "docker stop requires a container id" >&2
      exit 1
    fi
    if grep -q "^${id}" "$CTR_FILE"; then
      update_row "$id" status stopped
      echo "$id"
    else
      echo "No such container: $id" >&2
      exit 1
    fi
    ;;
  rm)
    id="${1:-}"
    if [ -z "$id" ]; then
      echo "docker rm requires a container id" >&2
      exit 1
    fi
    grep -v "^${id}" "$CTR_FILE" > "$CTR_FILE.tmp" && mv "$CTR_FILE.tmp" "$CTR_FILE"
    echo "$id"
    ;;
  logs)
    id="${1:-}"
    if ! grep -q "^${id}" "$CTR_FILE"; then
      echo "No such container: $id" >&2
      exit 1
    fi
    name=$(grep "^${id}" "$CTR_FILE" | head -1 | cut -f2)
    echo "[${name}] listening on :80"
    echo "volume mounted: my-data"
    ;;
  compose)
    bash /opt/lab/compose.sh "$@" </dev/null
    ;;
  images)
    if has_image; then
      echo -e "REPOSITORY\tTAG\tIMAGE ID"
      echo -e "myapp\t1.0\tsimulated"
    else
      echo "(no images — run: docker build -t myapp:1.0 .)"
    fi
    ;;
  network)
    sub="${1:-}"
  case "$sub" in
      create)
        echo "Network ${2:-bridge} created"
        ;;
      ls)
        echo -e "NETWORK ID\tNAME\tDRIVER"
        echo -e "sim1\tbridge\tbridge"
        ;;
      *)
        echo "docker network: try create, ls" >&2
        exit 1
        ;;
    esac
    ;;
  volume)
    sub="${1:-}"
    case "$sub" in
      create)
        echo "${2:-my-data}"
        ;;
      ls)
        echo -e "DRIVER\tVOLUME NAME"
        echo -e "local\tmy-data"
        ;;
      *)
        echo "docker volume: try create, ls" >&2
        exit 1
        ;;
    esac
    ;;
  *)
    echo "docker: '$cmd' is not a simulated command. Try: build, run, ps, logs, stop, rm, compose, images" >&2
    exit 1
    ;;
esac

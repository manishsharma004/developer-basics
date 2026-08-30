#!/bin/bash
cmd="${1:-}"
shift || true

STATE="/var/lab"

if [ "$cmd" = "build" ]; then
  context="."
  tag="myapp:1.0"
  while [ $# -gt 0 ]; do
    case "$1" in
      -t|--tag) tag="$2"; shift 2 ;;
      -f|--file) shift 2 ;;
      -*) shift ;;
      *) context="$1"; shift ;;
    esac
  done
  dockerfile="${context%/}/Dockerfile"
  if [ ! -f "$dockerfile" ]; then
    echo "ERROR: failed to solve: Dockerfile not found in $context"
    echo "Hint: run from ~/lab where the sample Dockerfile lives."
    exit 1
  fi
  echo "Sending build context to Docker daemon ..."
  echo "Step 1/6 : FROM node:20-alpine"
  echo "Step 2/6 : WORKDIR /app"
  echo "Step 3/6 : COPY package.json ."
  echo "Step 4/6 : RUN npm install --omit=dev"
  echo "Step 5/6 : COPY src/ ./src/"
  echo "Step 6/6 : CMD [\"node\", \"src/app.js\"]"
  echo "Successfully built and tagged $tag"
  echo "$tag" > "$STATE/image-${tag//:/-}" 2>/dev/null || true
  echo "${tag//:/-}" >> "$STATE/image-index" 2>/dev/null || true
  exit 0
fi

if [ "$cmd" = "run" ]; then
  image="myapp:1.0"
  name="web"
  while [ $# -gt 0 ]; do
    case "$1" in
      --name) name="${2:-web}"; shift 2 ;;
      -*) shift ;;
      *) image="$1"; shift ;;
    esac
  done
  image_file="$STATE/image-${image//:/-}"
  if [ ! -f "$image_file" ]; then
    echo "Unable to find image '$image' locally"
    echo "Hint: build it first with: docker build -t $image ."
    exit 0
  fi
  cid="c1"
  if [ -f "$STATE/container-c1" ]; then
    cid="c2"
  fi
  if [ -f "$STATE/container-c2" ]; then
    cid="c3"
  fi
  echo "$image" > "$STATE/container-$cid" 2>/dev/null || true
  echo "$cid"
  exit 0
fi

if [ "$cmd" = "ps" ]; then
  found=0
  for cid in c1 c2 c3; do
    if [ -f "$STATE/container-$cid" ]; then
      if [ "$found" = 0 ]; then
        echo "CONTAINER ID	NAME	IMAGE	STATUS	PORTS"
        found=1
      fi
      status="running"
      [ -f "$STATE/container-$cid-stopped" ] && status="stopped"
      echo "${cid} web myapp:1.0 ${status} 8080->80"
    fi
  done
  [ "$found" = 0 ] && echo "(no containers)"
  exit 0
fi

# Detach nested bash from the shared xterm stdin stream (WASI has no TTY).
exec 0<&-

image_slug() {
  echo "${1//:/-}"
}

image_built() {
  [ -f "$STATE/image-$(image_slug "$1")" ]
}

write_container() {
  echo "$3" > "$STATE/container-$1" 2>/dev/null || true
  if [ "$4" = "stopped" ]; then
    echo stopped > "$STATE/container-$1-stopped" 2>/dev/null || true
  else
    rm -f "$STATE/container-$1-stopped" 2>/dev/null || true
  fi
}

read_container_field() {
  cid="$1"
  field="$2"
  [ -f "$STATE/container-$cid" ] || return 1
  case "$field" in
    name) echo "web" ;;
    image) cat "$STATE/container-$cid" 2>/dev/null ;;
    status)
      if [ -f "$STATE/container-$cid-stopped" ]; then echo stopped; else echo running; fi
      ;;
    ports) echo "8080->80" ;;
  esac
}

usage() {
  cat <<'EOF'
Usage: docker [OPTIONS] COMMAND

Common commands:
  build    Build an image from a Dockerfile
  run      Run a container from an image
  ps       List containers
  images   List images
  stop     Stop a running container
  rm       Remove a container
  logs     Fetch container logs
  compose  Docker Compose commands

State lives in /var/lab
EOF
}

list_containers() {
  for cid in c1 c2 c3; do
    if [ -f "$STATE/container-$cid" ]; then
      status="running"
      [ -f "$STATE/container-$cid-stopped" ] && status="stopped"
      echo "${cid}	web	myapp:1.0	${status}	8080->80"
    fi
  done
}

has_containers() {
  [ -f "$STATE/container-c1" ] || [ -f "$STATE/container-c2" ] || [ -f "$STATE/container-c3" ]
}

find_container_id() {
  needle="$1"
  for cid in c1 c2 c3; do
    case "$cid" in
      "$needle"*) echo "$cid"; return 0 ;;
    esac
    if [ -f "$STATE/container-$cid" ] && [ "$needle" = "web" ]; then
      echo "$cid"
      return 0
    fi
  done
  return 1
}

case "$cmd" in
  ''|--help|-h|help)
    usage
    ;;
  ps)
    echo "docker: ps should have been handled earlier" >&2
    exit 1
    ;;
  images)
    found=0
    echo "REPOSITORY	TAG	IMAGE ID"
    if [ -f "$STATE/image-index" ]; then
      while read -r slug; do
        [ -z "$slug" ] && continue
        [ ! -f "$STATE/image-$slug" ] && continue
        full=$(head -n 1 "$STATE/image-$slug" 2>/dev/null || echo "$slug")
        repo="${full%%:*}"
        tag="${full#*:}"
        [ "$tag" = "$full" ] && tag="latest"
        echo "${repo}	${tag}	simulated"
        found=1
      done < "$STATE/image-index"
    fi
    [ "$found" = 0 ] && echo "(no images — run: docker build -t myapp:1.0 .)"
    ;;
  stop)
    id="${1:-}"
    [ -z "$id" ] && { echo "docker stop requires a container id"; exit 1; }
    cid=$(find_container_id "$id") || { echo "No such container: $id"; exit 1; }
    echo stopped > "$STATE/container-$cid-stopped" 2>/dev/null || true
    echo "$cid"
    ;;
  rm)
    id="${1:-}"
    [ -z "$id" ] && { echo "docker rm requires a container id"; exit 1; }
    cid=$(find_container_id "$id") || { echo "No such container: $id"; exit 1; }
    rm -f "$STATE/container-$cid" "$STATE/container-$cid-stopped" 2>/dev/null || true
    echo "$cid"
    ;;
  logs)
    id="${1:-}"
    [ -z "$id" ] && { echo "docker logs requires a container id or name"; exit 1; }
    cid=$(find_container_id "$id") || cid="$id"
    cname=$(read_container_field "$cid" name 2>/dev/null) || cname="$id"
    echo "[${cname}] myapp listening on :80"
    echo "[${cname}] GET /health 200"
    ;;
  compose)
    bash /opt/lab/compose.sh "$@"
    ;;
  network)
    sub="${1:-}"
    case "$sub" in
      create) echo "Network ${2:-bridge} created" ;;
      ls)
        echo -e "NETWORK ID\tNAME\tDRIVER"
        echo -e "sim1\tbridge\tbridge"
        ;;
      *) echo "docker network: try create, ls"; exit 1 ;;
    esac
    ;;
  volume)
    sub="${1:-}"
    case "$sub" in
      create) echo "${2:-my-data}" ;;
      ls)
        echo -e "DRIVER\tVOLUME NAME"
        echo -e "local\tmy-data"
        ;;
      *) echo "docker volume: try create, ls"; exit 1 ;;
    esac
    ;;
  build|run)
    echo "docker: internal error — $cmd should have been handled earlier" >&2
    exit 1
    ;;
  *)
    echo "docker: '$cmd' is not a simulated command. Try: build, run, ps, images, logs, stop, rm, compose"
    exit 1
    ;;
esac

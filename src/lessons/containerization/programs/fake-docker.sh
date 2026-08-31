#!/bin/bash
# Simulated docker CLI with real build context staging and container state under /var/lab.
cmd="${1:-}"
shift || true

STATE="/var/lab"

# --- Plugin-style commands (docker image ls, docker container ls, …) ---
if [ "$cmd" = "image" ]; then
  sub="${1:-ls}"
  shift || true
  case "$sub" in
    ls) cmd=images ;;
    inspect) cmd=image_inspect ;;
    rm) cmd=rmi ;;
    *)
      echo "docker: 'image $sub' is not a simulated command. Try: ls, inspect, rm"
      exit 1
      ;;
  esac
fi

if [ "$cmd" = "container" ]; then
  sub="${1:-ls}"
  shift || true
  case "$sub" in
    ls|ps) cmd=ps ;;
    run) cmd=run ;;
    stop) cmd=stop ;;
    rm) cmd=rm ;;
    logs) cmd=logs ;;
    exec) cmd=exec ;;
    *)
      echo "docker: 'container $sub' is not a simulated command. Try: ls, run, stop, rm, logs, exec"
      exit 1
      ;;
  esac
fi

# --- Phase 1: copy lab/image files before closing stdin (cat works; extra fds do not) ---
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
  slug="${tag//:/-}"
  base="$STATE/img-$slug"
  ctx="${context%/}"
  if [ -f "$ctx/package.json" ]; then
    cat "$ctx/package.json" > "${base}-fs-package.json"
  fi
  if [ -f "$ctx/src/app.js" ]; then
    cat "$ctx/src/app.js" > "${base}-fs-src-app.js"
  fi
  if [ -f "$ctx/Dockerfile" ]; then
    cat "$ctx/Dockerfile" > "${base}-fs-Dockerfile"
  fi
fi

if [ "$cmd" = "run" ]; then
  image="myapp:1.0"
  name=""
  publish=""
  detach=0
  while [ $# -gt 0 ]; do
    case "$1" in
      -d) detach=1; shift ;;
      --name) name="$2"; shift 2 ;;
      -p|--publish) publish="$2"; shift 2 ;;
      -*) shift ;;
      *) image="$1"; shift ;;
    esac
  done
  img_slug="${image//:/-}"
  img_base="$STATE/img-$img_slug"
  n=0
  if [ -f "$STATE/next-cid" ]; then
    n=$(cat "$STATE/next-cid" 2>/dev/null)
  fi
  n=$((n + 1))
  cid="c$n"
  p="$STATE/ctr-$cid"
  if [ -f "${img_base}-fs-package.json" ]; then
    cat "${img_base}-fs-package.json" > "${p}-fs-package.json"
  fi
  if [ -f "${img_base}-fs-src-app.js" ]; then
    cat "${img_base}-fs-src-app.js" > "${p}-fs-src-app.js"
  fi
  if [ -f "${img_base}-fs-Dockerfile" ]; then
    cat "${img_base}-fs-Dockerfile" > "${p}-fs-Dockerfile"
  fi
fi

if [ "$cmd" = "exec" ]; then
  EXEC_CONTAINER=""
  EXEC_CMD=""
  while [ $# -gt 0 ]; do
    case "$1" in
      -it|-ti|-i|-t) shift ;;
      -*) shift ;;
      *)
        if [ -z "$EXEC_CONTAINER" ]; then
          EXEC_CONTAINER="$1"
        else
          if [ -n "$EXEC_CMD" ]; then
            EXEC_CMD="$EXEC_CMD $1"
          else
            EXEC_CMD="$1"
          fi
        fi
        shift
        ;;
    esac
  done
  p="$STATE/ctr-$EXEC_CONTAINER"
  case "$EXEC_CMD" in
    cat\ package.json|cat\ /app/package.json)
      if [ -f "${p}-fs-package.json" ]; then
        cat "${p}-fs-package.json"
        exit 0
      fi
      if [ -f "${p}-image" ]; then
        read -r image < "${p}-image"
        slug="${image//:/-}"
        imgfs="$STATE/img-$slug-fs-package.json"
        if [ -f "$imgfs" ]; then
          cat "$imgfs"
          exit 0
        fi
      fi
      ;;
    cat\ src/app.js|cat\ /app/src/app.js)
      if [ -f "${p}-fs-src-app.js" ]; then
        cat "${p}-fs-src-app.js"
        exit 0
      fi
      if [ -f "${p}-image" ]; then
        read -r image < "${p}-image"
        slug="${image//:/-}"
        imgfs="$STATE/img-$slug-fs-src-app.js"
        if [ -f "$imgfs" ]; then
          cat "$imgfs"
          exit 0
        fi
      fi
      ;;
  esac
fi

# Detach nested bash from the shared xterm stdin stream (WASI has no TTY).
exec 0<&-

# --- Phase 2: metadata, output, and reads via echo/read (no extra file descriptors) ---

if [ "$cmd" = "build" ]; then
  context="."
  tag="myapp:1.0"
  # Args consumed in phase 1; variables slug/base/ctx/tag still in scope from same shell.
  dockerfile="${ctx}/Dockerfile"
  if [ ! -f "$dockerfile" ]; then
    echo "ERROR: failed to solve: Dockerfile not found in $context"
    echo "Hint: run from ~/lab where the sample Dockerfile lives."
    exit 1
  fi
  echo "Sending build context to Docker daemon ..."
  echo "Step 1/6 : FROM node:20-alpine"
  echo "Step 2/6 : WORKDIR /app"
  if [ -f "${base}-fs-package.json" ]; then
    echo "Step 3/6 : COPY package.json ."
  else
    echo "Step 3/6 : COPY package.json . (skipped — file missing)"
  fi
  echo "Step 4/6 : RUN npm install --omit=dev"
  if [ -f "${base}-fs-src-app.js" ]; then
    echo "Step 5/6 : COPY src/ ./src/"
  else
    echo "Step 5/6 : COPY src/ ./src/ (skipped — file missing)"
  fi
  echo "Step 6/6 : CMD [\"node\", \"src/app.js\"]"
  echo "$tag" > "${base}-tag"
  echo "aba3f2c1d0e9" > "${base}-id"
  echo "$tag" > "$STATE/built-tag"
  repo="${tag%%:*}"
  tagpart="${tag#*:}"
  if [ "$tagpart" = "$tag" ]; then
    tagpart="latest"
  fi
  echo "${repo}	${tagpart}	aba3f2c1d0e9	2 minutes ago	42MB" > "${base}-images-row"
  echo "Successfully built aba3f2c1d0e9"
  echo "Successfully built and tagged $tag"
  exit 0
fi

if [ "$cmd" = "run" ]; then
  img_slug="${image//:/-}"
  img_base="$STATE/img-$img_slug"
  if [ ! -f "$STATE/built-tag" ] && [ ! -f "${img_base}-tag" ] && [ ! -f "${img_base}-fs-package.json" ]; then
    echo "Unable to find image '$image' locally"
    echo "Hint: build it first with: docker build -t $image ."
    exit 0
  fi
  if [ "$n" -gt 10 ]; then
    echo "Error: lab supports up to 10 containers"
    exit 1
  fi
  if [ -z "$name" ]; then
    name="$cid"
  fi
  ports="0.0.0.0:8080:80/tcp"
  if [ -n "$publish" ]; then
    ports="0.0.0.0:${publish}/tcp"
  fi
  echo "$n" > "$STATE/next-cid"
  echo "$name" > "${p}-name"
  echo "$image" > "${p}-image"
  echo "running" > "${p}-status"
  echo "$ports" > "${p}-ports"
  echo "Up 1 second" > "${p}-created"
  echo "myapp listening on :80" > "${p}-log"
  echo "GET /health 200" >> "${p}-log"
  if [ -f "${p}-fs-package.json" ]; then
    echo "Loaded package.json from image layer" >> "${p}-log"
  fi
  echo "${cid}   ${image}   node src/app.js   Up 1 second   running   ${ports}" > "${p}-row"
  if [ "$detach" = 1 ]; then
    echo "$cid"
  else
    echo "myapp listening on :80"
    echo "GET /health 200"
    if [ -f "${p}-fs-package.json" ]; then
      echo "Loaded package.json from image layer"
    fi
  fi
  exit 0
fi

if [ "$cmd" = "ps" ]; then
  while [ $# -gt 0 ]; do
    case "$1" in
      -a|--all|-q|--quiet|--format) shift ;;
      -*) shift ;;
      *) shift ;;
    esac
  done
  found=0
  row=""
  if [ -f "$STATE/ctr-c1-row" ]; then
    read -r row < "$STATE/ctr-c1-row"
    echo "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS          PORTS"
    found=1
    echo "$row"
  fi
  if [ -f "$STATE/ctr-c2-row" ]; then
    read -r row < "$STATE/ctr-c2-row"
    if [ "$found" = 0 ]; then
      echo "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS          PORTS"
      found=1
    fi
    echo "$row"
  fi
  if [ -f "$STATE/ctr-c3-row" ]; then
    read -r row < "$STATE/ctr-c3-row"
    if [ "$found" = 0 ]; then
      echo "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS          PORTS"
      found=1
    fi
    echo "$row"
  fi
  if [ -f "$STATE/ctr-c4-row" ]; then
    read -r row < "$STATE/ctr-c4-row"
    if [ "$found" = 0 ]; then
      echo "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS          PORTS"
      found=1
    fi
    echo "$row"
  fi
  if [ -f "$STATE/ctr-c5-row" ]; then
    read -r row < "$STATE/ctr-c5-row"
    if [ "$found" = 0 ]; then
      echo "CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS          PORTS"
      found=1
    fi
    echo "$row"
  fi
  if [ "$found" = 0 ]; then
    echo "(no containers)"
  fi
  exit 0
fi

if [ "$cmd" = "images" ]; then
  while [ $# -gt 0 ]; do
    case "$1" in
      -a|--all|-q|--quiet) shift ;;
      -*) shift ;;
      *) shift ;;
    esac
  done
  echo "REPOSITORY	TAG	IMAGE ID	CREATED		SIZE"
  found=0
  row=""
  if [ -f "$STATE/img-myapp-1.0-images-row" ]; then
    read -r row < "$STATE/img-myapp-1.0-images-row"
    echo "$row"
    found=1
  fi
  if [ -f "$STATE/img-myapp-latest-images-row" ]; then
    read -r row < "$STATE/img-myapp-latest-images-row"
    echo "$row"
    found=1
  fi
  if [ -f "$STATE/img-web-latest-images-row" ]; then
    read -r row < "$STATE/img-web-latest-images-row"
    echo "$row"
    found=1
  fi
  if [ "$found" = 0 ]; then
    echo "(no images — run: docker build -t myapp:1.0 .)"
  fi
  exit 0
fi

if [ "$cmd" = "image_inspect" ]; then
  ref="${1:-myapp:1.0}"
  slug="${ref//:/-}"
  ibase="$STATE/img-$slug"
  if [ ! -f "${ibase}-fs-package.json" ] && [ ! -f "${ibase}-tag" ] && [ ! -f "$STATE/built-tag" ]; then
    echo "Error: No such image: $ref"
    exit 1
  fi
  imgid="aba3f2c1d0e9"
  if [ -f "${ibase}-id" ]; then
    read -r imgid < "${ibase}-id"
  fi
  echo "["
  echo "  {"
  echo "    \"Id\": \"sha256:${imgid}\","
  echo "    \"RepoTags\": [\"$ref\"],"
  echo "    \"Architecture\": \"amd64\","
  echo "    \"Os\": \"linux\""
  echo "  }"
  echo "]"
  exit 0
fi

if [ "$cmd" = "rmi" ]; then
  ref="${1:-}"
  if [ -z "$ref" ]; then
    echo "docker rmi requires an image reference"
    exit 1
  fi
  slug="${ref//:/-}"
  ibase="$STATE/img-$slug"
  rm -f "${ibase}-tag" "${ibase}-id" "${ibase}-images-row" "${ibase}-fs-package.json" "${ibase}-fs-src-app.js" "${ibase}-fs-Dockerfile"
  rm -f "$STATE/built-tag"
  echo "Untagged: $ref"
  exit 0
fi

if [ "$cmd" = "stop" ]; then
  id="${1:-}"
  if [ -z "$id" ]; then
    echo "docker stop requires a container id"
    exit 1
  fi
  p="$STATE/ctr-$id"
  if [ ! -f "${p}-image" ]; then
    echo "Error response from daemon: No such container: $id"
    exit 1
  fi
  echo "exited" > "${p}-status"
  echo "Exited" > "${p}-created"
  echo "$id"
  exit 0
fi

if [ "$cmd" = "rm" ]; then
  id="${1:-}"
  if [ -z "$id" ]; then
    echo "docker rm requires a container id"
    exit 1
  fi
  p="$STATE/ctr-$id"
  if [ ! -f "${p}-image" ]; then
    echo "Error response from daemon: No such container: $id"
    exit 1
  fi
  rm -f "${p}-name" "${p}-image" "${p}-status" "${p}-ports" "${p}-created" "${p}-log" "${p}-row" \
    "${p}-fs-package.json" "${p}-fs-src-app.js" "${p}-fs-Dockerfile"
  echo "$id"
  exit 0
fi

if [ "$cmd" = "logs" ]; then
  id="${1:-}"
  if [ -z "$id" ]; then
    echo "docker logs requires a container id or name"
    exit 1
  fi
  p="$STATE/ctr-$id"
  if [ ! -f "${p}-log" ]; then
    echo "Error response from daemon: No such container: $id"
    exit 1
  fi
  echo "myapp listening on :80"
  echo "GET /health 200"
  if [ -f "${p}-fs-package.json" ]; then
    echo "Loaded package.json from image layer"
  fi
  exit 0
fi

if [ "$cmd" = "exec" ]; then
  container="$EXEC_CONTAINER"
  exec_cmd="$EXEC_CMD"
  p="$STATE/ctr-$container"
  if [ ! -f "${p}-image" ]; then
    echo "Error response from daemon: No such container: $container"
    exit 1
  fi
  case "$exec_cmd" in
    cat\ package.json|cat\ /app/package.json)
      if [ -f "${p}-fs-package.json" ]; then
        awk '{print}' "${p}-fs-package.json"
      elif [ -f "${p}-image" ]; then
        read -r image < "${p}-image"
        slug="${image//:/-}"
        imgfs="$STATE/img-$slug-fs-package.json"
        if [ -f "$imgfs" ]; then
          awk '{print}' "$imgfs"
        else
          echo "cat: package.json: No such file"
        fi
      else
        echo "cat: package.json: No such file"
      fi
      ;;
    cat\ src/app.js|cat\ /app/src/app.js)
      if [ -f "${p}-fs-src-app.js" ]; then
        awk '{print}' "${p}-fs-src-app.js"
      elif [ -f "${p}-image" ]; then
        read -r image < "${p}-image"
        slug="${image//:/-}"
        imgfs="$STATE/img-$slug-fs-src-app.js"
        if [ -f "$imgfs" ]; then
          awk '{print}' "$imgfs"
        else
          echo "cat: src/app.js: No such file"
        fi
      else
        echo "cat: src/app.js: No such file"
      fi
      ;;
    ls|ls\ /app)
      echo "package.json"
      echo "src"
      ;;
    *)
      echo "OCI runtime exec failed: $exec_cmd not available in lab shell (try: cat package.json)"
      exit 127
      ;;
  esac
  exit 0
fi

usage() {
  cat <<'EOF'
Usage: docker [OPTIONS] COMMAND

Common commands:
  build    Build an image from a Dockerfile
  run      Run a container from an image
  ps       List containers (alias: container ls)
  images   List images (alias: image ls)
  stop     Stop a running container
  rm       Remove a container
  logs     Fetch container logs
  exec     Run a command in a running container
  compose  Docker Compose commands

State and image layers live in /var/lab
EOF
}

case "$cmd" in
  ''|--help|-h|help)
    usage
    ;;
  compose)
    bash /opt/lab/compose.sh "$@"
    ;;
  network)
    sub="${1:-}"
    case "$sub" in
      create) echo "Network ${2:-bridge} created" ;;
      ls)
        echo "NETWORK ID	NAME	DRIVER"
        echo "sim1	bridge	bridge"
        ;;
      *) echo "docker network: try create, ls"; exit 1 ;;
    esac
    ;;
  volume)
    sub="${1:-}"
    case "$sub" in
      create) echo "${2:-my-data}" ;;
      ls)
        echo "DRIVER	VOLUME NAME"
        echo "local	my-data"
        ;;
      *) echo "docker volume: try create, ls"; exit 1 ;;
    esac
    ;;
  build|run|ps|images|stop|rm|logs|exec|image_inspect|rmi)
    echo "docker: internal error — $cmd should have been handled earlier" >&2
    exit 1
    ;;
  *)
    echo "docker: '$cmd' is not a simulated command. Try: build, run, ps, image ls, images, logs, stop, rm, compose"
    exit 1
    ;;
esac

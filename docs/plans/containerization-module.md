# Containerization Module — Implementation Plan

> Status: **Implemented** — see [PR #58](https://github.com/manishsharma004/developer-basics/pull/58)  
> Plan PR: [#57](https://github.com/manishsharma004/developer-basics/pull/57) (reference)  
> COI / shell follow-ups: [#63](https://github.com/manishsharma004/developer-basics/pull/63)  
> Branch base: `cursor-agent/issue-backlog-72bc` (rebased onto `main` as of 2026-08-30)

## Goal

Extract Docker from **Systems & the OS** into a new **Containerization** module that covers the full day-to-day DevOps surface area: Docker, images, Docker Compose, Kubernetes (control plane through operators), managed platforms (EKS, ECS, Rancher, etc.), and hands-on simulation labs following existing chapter conventions.

## Current state

| Item | Location |
| --- | --- |
| `docker` chapter (single lesson) | `src/lessons/docker/` — group `systems` |
| Container mentions in compute | `src/lessons/compute/ComputeLesson.tsx` (VM vs container vs serverless) |
| Container mentions in CI/CD | `src/lessons/cicd/CicdLesson.tsx` (build stage produces Docker image) |
| Teacher guide for docker | `src/experience/teacherGuides.ts` → `docker` key |
| Module registry | `src/lessons/meta.ts` (`groups`, `lessonsMeta`) |

The existing `DockerSim` is a lightweight React state machine (build → run → stop). It does **not** run a real container runtime.

## Target architecture

### New module: `containerization`

Insert after **Systems & the OS** and before **Data Structures & Algorithms** in `groups`:

```ts
{
  id: 'containerization',
  title: 'Containerization',
  icon: '🐳',
  blurb: 'Package apps with Docker, orchestrate with Kubernetes, and deploy on managed platforms — with interactive labs.',
}
```

### Migration

1. Remove `docker` from `group: 'systems'` in `meta.ts`.
2. Re-home `docker` chapters under `group: 'containerization'`.
3. Trim `compute` lesson container prose to a forward link: *"Containers are covered in depth in the Containerization module."*
4. Add cross-links from `cicd` build stage → containerization registry/image chapters.

### File layout (mirror `fastapi/`, `react/`, `web/`)

```
src/lessons/containerization/
  chapterMeta.ts          # all chapter metadata entries
  chapters.tsx            # createChapterLesson() definitions
  index.ts                # id → component map (re-export)
  snippets.ts             # optional Pyodide snippets (minimal — prefer Wasmer for shell)
  sims/
    WasmerShell.tsx       # shared xterm + @wasmer/sdk loader
    DockerCliSim.tsx      # bash + fake-docker wrapper
    ComposeSim.tsx        # parse & run multi-service compose graph
    K8sClusterSim.tsx     # control-plane + node topology
    K8sServiceSim.tsx     # ClusterIP / NodePort / LB routing
    K8sWorkloadSim.tsx    # Deployment replica reconciliation
    K8sStorageSim.tsx     # PV/PVC binding animation
    K8sOperatorSim.tsx    # CRD → controller reconcile loop
    KubectlLab.tsx        # command builder + simulated API server
    PlatformCompare.tsx   # EKS vs ECS vs GKE vs Rancher matrix
  programs/
    fake-docker.sh        # mounted into Wasmer bash as /usr/local/bin/docker
```

Extend `chapterMeta.ts` helper:

- Add `'containerization'` to `ChapterMetaInput['group']` and `GROUP_ICON`.
- Import `containerizationLessonsMeta` in `meta.ts` and spread into `lessonsMeta`.

Wire components in `src/lessons/index.tsx` the same way as `fastapi` / `react` chapter bundles.

---

## Chapter curriculum (~22 chapters)

Each chapter follows the established shape:

`Why it matters` → `Core ideas` → `Try it` (sim lab) → optional `Under the hood` → `Key terms` → `Check yourself` → `Recap`

Every playground includes **TryThis** prompts and a **SimReality** callout (what the sim models vs what production looks like).

### Track A — Docker fundamentals (6 chapters)

| ID | Title | Lab | Tech |
| --- | --- | --- | --- |
| `container-intro` | Why containers? | Compare VM vs container resource diagram; link from compute | React |
| `docker-images` | Images & layers | Build layers from Dockerfile instructions; inspect layer cache | React + CodePreview |
| `docker-containers` | Containers & lifecycle | **Migrate existing `DockerSim`**; extend with `docker ps/stop/rm/logs` | Wasmer bash + fake-docker |
| `docker-dockerfile` | Dockerfile deep dive | Edit a Dockerfile; validate stages; build in Wasmer | Wasmer |
| `docker-networks` | Networks & ports | Bridge vs host networking; `-p` mapping simulator | React |
| `docker-volumes` | Volumes & bind mounts | Ephemeral FS vs named volume vs bind mount | React + Wasmer |

**Content coverage**

- Image immutability, tags, digests, registries (Docker Hub, ECR, GCR, GHCR)
- `docker build`, `docker push/pull`, multi-stage builds, `.dockerignore`
- `docker run` flags: `-d`, `-e`, `--name`, `--restart`, `--memory`, `--cpus`
- `docker exec`, `docker logs`, `docker inspect`, health checks
- Networking: bridge, host, overlay (conceptual), DNS inside user-defined networks

### Track B — Docker Compose (3 chapters)

| ID | Title | Lab | Tech |
| --- | --- | --- | --- |
| `compose-intro` | Compose mental model | YAML → service graph visualization | React |
| `compose-services` | Services, depends_on, env | Bring up a 3-service stack (web + api + db) | ComposeSim |
| `compose-production` | Volumes, networks, profiles | Override files, `docker compose up -d`, healthchecks | ComposeSim + Wasmer |

**Day-to-day coverage**

- `docker compose up/down/ps/logs/exec/build`
- `depends_on` vs `condition: service_healthy`
- Named volumes, external networks, build contexts
- `.env` files, variable substitution `${VAR}`
- Profiles (`--profile`), `compose.override.yml`, scaling `docker compose up --scale`
- Common patterns: dev hot-reload vs prod multi-stage image

### Track C — Kubernetes core (10 chapters)

| ID | Title | Lab | Tech |
| --- | --- | --- | --- |
| `k8s-intro` | Why orchestration? | Single host → cluster pain points animation | React |
| `k8s-architecture` | Control plane & nodes | Clickable cluster diagram: API server, etcd, scheduler, controller-manager, kubelet, kube-proxy | K8sClusterSim |
| `k8s-workloads` | Pods & controllers | Create Deployment; watch desired vs actual replicas | K8sWorkloadSim |
| `k8s-services` | Service types | Route traffic: ClusterIP → NodePort → LoadBalancer | K8sServiceSim |
| `k8s-ingress` | Ingress & gateways | Host/path rules → backend services | React |
| `k8s-networking` | DNS, CNI, IPs | Pod IP vs Service cluster IP; CoreDNS lookup sim | React |
| `k8s-storage` | PV, PVC, StorageClass | Bind PVC to PV; dynamic provisioning flow | K8sStorageSim |
| `k8s-config-secrets` | ConfigMaps & Secrets | Mount config; contrast Secret base64 vs encryption at rest | React |
| `k8s-commands` | kubectl for DevOps | Interactive `kubectl get/describe/apply/logs/exec/scale/rollout` | KubectlLab |
| `k8s-nodes` | Node management | `kubectl cordon/drain`, taints/tolerations, node conditions | React |

**Kubernetes depth checklist**

- **Control plane**: API server (REST), etcd (source of truth), scheduler, controller-manager
- **Node components**: kubelet, kube-proxy, container runtime (containerd/CRI)
- **Workloads**: Pod, ReplicaSet, Deployment, StatefulSet, DaemonSet, Job/CronJob
- **Services**: ClusterIP, headless, NodePort, LoadBalancer, ExternalName
- **Ingress**: ingress controllers, TLS termination
- **IP management**: Pod CIDR, Service CIDR, kube-proxy modes (iptables/IPVS), NetworkPolicy (intro)
- **Storage**: PV, PVC, StorageClass, CSI drivers (conceptual)
- **Secrets**: types, mounting as env vs volume, sealed-secrets mention
- **Namespaces**, labels/selectors, annotations
- **Probes**: liveness, readiness, startup
- **Resource requests/limits**, QoS classes
- **HPA** (tie back to compute autoscaling lesson)

### Track D — Operators (2 chapters)

| ID | Title | Lab | Tech |
| --- | --- | --- | --- |
| `k8s-operators-builtin` | Built-in controllers | Watch Deployment controller reconcile loop | K8sOperatorSim |
| `k8s-operators-custom` | CRDs & custom operators | Define a CRD; see operator create child resources | K8sOperatorSim |

**Coverage**

- Declarative desired state vs reconciliation loop
- Built-in: Deployment, StatefulSet, DaemonSet controllers
- CRD + controller pattern; Operator Framework / Helm operator mention
- Real examples: cert-manager, prometheus-operator (conceptual)

### Track E — Managed platforms (2 chapters)

| ID | Title | Lab | Tech |
| --- | --- | --- | --- |
| `platforms-managed-k8s` | EKS, GKE, AKS | Compare control-plane ownership, IAM, add-ons | PlatformCompare |
| `platforms-ecs-rancher` | ECS & Rancher | ECS task/service vs EKS; Rancher multi-cluster UI tour | PlatformCompare |

**Coverage**

| Platform | Topics |
| --- | --- |
| **Amazon EKS** | Managed control plane, node groups, Fargate profiles, IAM OIDC |
| **Amazon ECS** | Task definitions, services, Fargate vs EC2 launch, no k8s API |
| **Google GKE** | Autopilot vs Standard, workload identity |
| **Azure AKS** | AAD integration, node pools |
| **Rancher** | Multi-cluster management, RKE/RKE2/K3s, catalog apps |
| **Docker Desktop** | Local dev k8s toggle, compose integration |

### Capstone

| ID | Title | Lab |
| --- | --- | --- |
| `container-capstone` | Ship a small stack | Dockerfile → compose → mock deploy to k8s manifest → rollout |

Reuse patterns from existing `capstone` chapter in the design module.

---

## Simulation strategy: Wasmer-js + React

### Why hybrid?

| Concern | Wasmer-js (`@wasmer/sdk`) | Pure React sim |
| --- | --- | --- |
| Shell commands (`docker`, `kubectl` feel) | ✅ Real bash via `sharrattj/bash` | ❌ Fake buttons only |
| K8s control-plane timing / topology | ❌ Cannot run real k8s | ✅ Purpose-built viz |
| Bundle size | ⚠️ Large WASM + registry fetch | ✅ Lightweight |
| GitHub Pages | ⚠️ Needs cross-origin isolation | ✅ No special headers |

**Recommendation**

- **Wasmer** for Docker/Compose chapters where typing real commands matters.
- **React** for Kubernetes topology, networking, operators, and platform comparison.
- Lazy-load Wasmer only on containerization routes (dynamic `import()`), with React fallback sim if isolation fails.

### Wasmer integration sketch

```ts
// src/lib/wasmer.ts
import { init, Wasmer } from '@wasmer/sdk'

let ready: Promise<void> | null = null

export function ensureWasmer() {
  if (!ready) ready = init()
  return ready
}

export async function runBash(mount: Record<string, unknown>, args: string[]) {
  await ensureWasmer()
  const pkg = await Wasmer.fromRegistry('sharrattj/bash')
  return pkg.entrypoint!.run({ args, mount })
}
```

Mount a **fake-docker** script that manipulates a shared `Directory` filesystem so `docker build/run/ps` behave predictably in the lesson.

Reference: [Wasmer xterm.js tutorial](https://docs.wasmer.io/sdk/wasmer-js/tutorials/xterm-js/), [filesystem mounts](https://docs.wasmer.io/sdk/wasmer-js/how-to/use-filesystem/).

### SimReality examples (required per lab)

| Lab | In the sim | In production |
| --- | --- | --- |
| Docker CLI | Bash + scripted `docker` against virtual FS | Real containerd/dockerd, cgroups, namespaces |
| Compose | Parsed YAML spins logical services | Real network namespaces, volume drivers |
| kubectl | Simulated API server returns JSON | Real etcd persistence, admission webhooks |
| K8s Service | Instant traffic routing | kube-proxy, conntrack, cloud LB provisioning |

---

## GitHub Pages & cross-origin isolation (CORS / COOP / COEP)

### Problem

`@wasmer/sdk` requires `SharedArrayBuffer`, which browsers only expose when the page is **cross-origin isolated** (`self.crossOriginIsolated === true`). That requires response headers:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

GitHub Pages **does not** let you set custom HTTP headers on static assets.

Without isolation, Wasmer logs:

```
Failed to execute 'postMessage' on 'Worker': SharedArrayBuffer transfer
requires self.crossOriginIsolated.
```

See: [Wasmer troubleshooting — SharedArrayBuffer](https://docs.wasmer.io/sdk/wasmer-js/explainers/troubleshooting/#sharedarraybuffer-and-cross-origin-isolation)

### Recommended fix: `coi-serviceworker`

Per [Wasmer's GitHub Pages guide](https://docs.wasmer.io/sdk/wasmer-js/how-to/coop-coep-headers/):

1. Add dependency: `coi-serviceworker` (or copy `coi-serviceworker.min.js` to `public/`).
2. In `index.html`, **before** the app bundle:

   ```html
   <script src="%BASE_URL%coi-serviceworker.js"></script>
   ```

3. Ensure Vite copies the file to `dist/` (not bundled — must be same-origin).
4. First visit triggers a reload after the service worker registers.

### Vite / BASE_PATH considerations

This repo builds with `BASE_PATH: /${{ github.event.repository.name }}/` for project Pages. The coi script `src` must respect the base:

```html
<script src="/developer-basics/coi-serviceworker.js"></script>
```

Or inject via `index.html` transform using `%BASE_URL%` if we add a small Vite plugin.

### COEP side effects to audit

`COEP: require-corp` blocks cross-origin resources that lack CORP/CORS headers. Audit:

| Asset | Risk | Mitigation |
| --- | --- | --- |
| Pyodide CDN (jsDelivr) | May break | Ensure `crossorigin` on script tags; test after COEP |
| Google Fonts / external images | Blocked | Self-host or remove |
| Monaco workers | Often needs `crossOriginIsolated` anyway | Already uses blob workers — verify |
| Wasmer registry packages | HTTPS fetch | Should work; test offline fallback |
| GitHub Pages analytics | N/A | None today |

### Runtime detection & graceful degradation

Add `src/lib/crossOriginIsolation.ts`:

```ts
export const isCrossOriginIsolated =
  typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated
```

- Show a `RuntimeBanner`-style strip on containerization labs when isolation is false.
- Offer **React-only fallback sim** (existing `DockerSim` pattern) with a "Enable isolated mode" troubleshooting link.
- Dev: `vite preview` does not set COOP/COEP — rely on `coi-serviceworker` locally too, or document `vite-plugin-cross-origin-isolation`.

### Verification checklist (CI + manual)

- [ ] `self.crossOriginIsolated` is `true` on deployed GitHub Pages URL
- [ ] Wasmer bash lab loads and accepts input
- [ ] Pyodide lessons still load (regression)
- [ ] Monaco editor still works on capstone / code chapters
- [ ] Service worker updates don't trap users on stale caches (version coi script)

### Optional: dedicated lesson section

Add `container-hood-isolation` or a `Callout kind="warning"` in `container-intro` explaining *why* browser security (post-Spectre) affects container labs in the browser — good teaching moment connecting security module to infra.

---

## Teacher guides & progress

For each new chapter id, add an entry in `src/experience/teacherGuides.ts`:

- Learning objectives (3–5 bullets)
- Key concepts
- Common misconceptions
- Discussion prompts
- Interactive lab guide
- Assessment (reuse quiz questions)

Run `bun run sitemap` after metadata changes.

---

## Implementation phases

### Phase 0 — Infrastructure (1 PR)

- [ ] Add `containerization` group to `meta.ts`
- [ ] `coi-serviceworker` + `index.html` integration
- [ ] `src/lib/wasmer.ts`, `src/lib/crossOriginIsolation.ts`
- [ ] `WasmerShell.tsx` with lazy loading + isolation gate
- [ ] `RuntimeBanner` generalization or `WasmerRuntimeBanner`
- [ ] COEP regression test on Pyodide + Monaco

### Phase 1 — Docker track (1 PR)

- [ ] `chapterMeta.ts` + `chapters.tsx` scaffold
- [ ] Migrate/refactor `docker` → `docker-containers`
- [ ] Implement Tracks A chapters
- [ ] Update `compute` cross-links
- [ ] Teacher guides for Track A

### Phase 2 — Compose track (1 PR)

- [ ] `ComposeSim.tsx` (YAML parser → service graph)
- [ ] Track B chapters + guides

### Phase 3 — Kubernetes tracks (2 PRs)

- [ ] PR 3a: k8s-intro through k8s-services
- [ ] PR 3b: storage, secrets, commands, nodes, operators
- [ ] Shared `K8sClusterSim` component library

### Phase 4 — Platforms & capstone (1 PR)

- [ ] Platform comparison chapters
- [ ] `container-capstone`
- [ ] Final sitemap + teacher guides

### Phase 5 — Polish

- [ ] Global search keywords (`kubectl`, `docker compose`, `pod`, `deployment`)
- [ ] Mermaid diagrams for control-plane architecture (reuse `MermaidDiagram.tsx`)
- [ ] Beginner path / capstone links

---

## Dependencies

```json
{
  "@wasmer/sdk": "^latest",
  "xterm": "^5",
  "xterm-addon-fit": "^0.8",
  "coi-serviceworker": "^latest",
  "yaml": "^2"
}
```

- Lazy-chunk Wasmer (~large); keep out of main bundle.
- `yaml` for compose parsing in `ComposeSim`.

---

## Open questions

1. **Chapter count** — 22 chapters is large (similar to React module). OK to ship incrementally behind complete tracks?
2. **Real kubectl** — Simulated API server vs embedding a minimal k8s API mock?
3. **Offline** — Wasmer registry fetch requires network; ship pinned WASM for fake-docker bash?
4. **Pyodide overlap** — Any compose validation in Python, or 100% Wasmer/shell?

---

## Success criteria

- [x] `docker` no longer appears under Systems & the OS
- [x] New Containerization module with ≥20 chapters, each with sim + TryThis + quiz
- [x] Wasmer shell labs work on GitHub Pages (`crossOriginIsolated === true`) — via `coi-serviceworker` ([follow-up fixes in PR #63](https://github.com/manishsharma004/developer-basics/pull/63))
- [x] Graceful fallback when isolation unavailable
- [x] No regressions to existing Pyodide / Monaco lessons (build passes)
- [x] Teacher guides and sitemap updated

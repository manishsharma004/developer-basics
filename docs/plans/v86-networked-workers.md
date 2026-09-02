# v86 networked worker images — implementation plan

> Status: **Proposed**  
> Depends on: [v86-podman-lab.md](./v86-podman-lab.md) (implemented), [containerization-module.md](./containerization-module.md) (implemented)

## Goal

Introduce **lighter v86 guest images** purpose-built for worker nodes, wire them together with an **in-browser Ethernet bridge**, and add **hands-on labs** where learners run real `curl` requests across VMs — including paths that mirror Kubernetes service routing — without booting the full Podman image for every scenario.

## Problem statement

| Today | Pain |
| --- | --- |
| Single `alpine-podman-lab` profile (~50–80 MB, 384 MB RAM) | Heavy for concepts that only need bash + curl |
| `net_device: virtio` with no relay | NIC exists in guest but no L2 network |
| K8s labs are React sims + fake `kubectl` | No real packets, no `curl` to a service IP |
| One terminal per chapter | Cannot show multi-node topology interactively |

We want learners to **feel** networking and orchestration: multiple terminals, real HTTP, visible routing — while keeping cold boot and download size as low as possible.

## Design principles

1. **Tiered images** — boot the smallest guest that satisfies the lab; never pay for Podman when the lesson is ping/curl/DNS.
2. **Real packets where it matters** — use v86 `inbrowser` / BroadcastChannel L2 bridge for multi-VM labs; keep React sims for control-plane concepts k3s cannot run in-browser.
3. **Honest SimReality** — every lab states what is emulated (fake etcd, scripted kube-proxy) vs real (virtio-net, HTTP, iptables).
4. **Progressive disclosure** — start with 2 VMs + ping; graduate to 3-tier ingress and service-IP routing.

---

## Architecture overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Browser (COI + SharedArrayBuffer)                                      │
│                                                                         │
│  ┌──────────────────┐     BroadcastChannel / inbrowser L2 switch        │
│  │ V86NetworkBridge │◄──────────────────────────────────────────────┐   │
│  └────────┬─────────┘                                              │   │
│           │ virtio-net frames                                      │   │
│     ┌─────┴─────┬─────────────┬─────────────┐                      │   │
│     ▼           ▼             ▼             ▼                      │   │
│  ┌────────┐ ┌────────┐   ┌────────┐   ┌────────┐                  │   │
│  │ infra  │ │ worker │   │ worker │   │ client │                  │   │
│  │ .10    │ │ .11    │   │ .12    │   │ .20    │                  │   │
│  │ DNS?   │ │ API    │   │ API    │   │ curl   │                  │   │
│  └────────┘ └────────┘   └────────┘   └────────┘                  │   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ K8sOrchestrator (host-side, TypeScript)                          │   │
│  │  • maps ClusterIP 10.43.0.10 → worker endpoints (round-robin)   │   │
│  │  • optional: inject /etc/hosts or push dnsmasq records to infra │   │
│  │  • syncs with React K8s*Sim panels for visual topology           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Why not real Kubernetes in v86?**  
k3s/kind/minikube need 64-bit Linux, hundreds of MB RAM per node, and kernel features (cgroups v2, namespaces depth) that are impractical in a 384 MB i386 guest. The plan uses a **hybrid**:

| Layer | Implementation |
| --- | --- |
| Control plane (API server, etcd, scheduler) | React sims + host-side `K8sOrchestrator` state |
| Data plane (packets, HTTP) | Real worker VMs on the L2 bridge |
| `kubectl` | Extend `fake-kubectl.sh` to mutate orchestrator + VM lifecycle |
| Container runtime | Podman only on **worker** profiles that need it; otherwise static binaries or `busybox httpd` |

---

## Image profiles (tiered rootfs)

All profiles share: Alpine **3.18.6 i386**, `linux-virt` kernel, 9p root, edge `mkinitfs` with `base virtio 9p`, serial console autologin.

| Profile ID | Packages | Target size | RAM | Boot (cold, no snapshot) | Use when |
| --- | --- | --- | --- | --- | --- |
| `worker-min` | `bash`, `iproute2`, `busybox-extras` (ping, httpd) | **12–18 MB** | **128 MB** | **8–20 s** | L2 mesh, static IP, ping, tiny HTTP |
| `worker-net` | worker-min + `curl`, `socat`, `iptables` | **18–25 MB** | **160 MB** | **10–25 s** | Client/server, port forward, basic firewall |
| `worker-agent` | worker-net + `podman`, `podman-docker` | **35–45 MB** | **256 MB** | **15–35 s** | Real container on worker; no full lab tree |
| `alpine-podman-lab` (current) | agent + curl + `/home/lab` sample app | **50–80 MB** | **384 MB** | **20–60 s** | Dockerfile build/run capstone |

### Slimming tactics (worker-min)

- Drop `openrc` services not needed for serial-only boot; use minimal `/sbin/init` script chain.
- No `podman`, `curl` (use `wget -O-` from busybox if needed), no firmware blobs beyond virtio.
- Pre-baked `/etc/network/interfaces` or `setup-interfaces` with **static** `10.42.0.x/24` (no DHCP daemon in guest).
- Shared chunk store: identical base layers across profiles in `public/v86/` (content-addressed `flat/` already supports this).

### Build layout

```
scripts/v86/
  Dockerfile.worker-min
  Dockerfile.worker-net
  Dockerfile.worker-agent
  Dockerfile                    # existing podman lab
  profiles/
    worker-min-init.sh
    worker-net-init.sh
    shared-networking.sh        # modprobe virtio-net; static IP by ROLE env
  build-profile.sh              # --profile worker-min|worker-net|...
```

Manifest gains a `profile` field (already used for `alpine-podman-lab`) and per-profile `memoryMb`, `cmdline`, `snapshotKey`.

### Lazy-fetch (per lab preset)

Images are **not** bundled in one mega-download. Each profile is fetched on demand when a chapter lab mounts.

```
public/v86/profiles/
  worker-min/manifest.json + fs.json + flat/
  worker-net/manifest.json + fs.json + flat/
  worker-agent/manifest.json + ...
  alpine-podman-lab/          # existing path (alias or redirect)
  lab-bundles/
    net-dns-svc/hosts.overlay   # tiny preset-specific files merged at boot
```

Runtime flow:

1. Chapter declares `labPreset` → `preset.requiredProfiles[]` (e.g. `['worker-net', 'worker-net']`).
2. `fetchLabManifest(profile)` tries same-origin, then GitHub Pages CDN (mirror today's podman lab).
3. Download progress shown per profile; profiles already in Cache API / IndexedDB skipped.
4. Content-addressed `flat/` chunks **deduplicate** across profiles (shared Alpine base layers).
5. Optional `lab-bundles/<preset>/` fetched only when preset needs extra files (e.g. `/etc/hosts`).

API sketch:

```ts
export type V86ProfileId = 'worker-min' | 'worker-net' | 'worker-agent' | 'alpine-podman-lab'

export async function fetchLabManifest(profile: V86ProfileId): Promise<V86LabManifest | null>
export async function ensureProfiles(profiles: V86ProfileId[], onProgress): Promise<void>
```

Scripts: `bun run v86:fetch-profile -- worker-min` (local dev); CI builds all profiles, deploy serves each independently.

---

## Network bridge (host-side)

### v86 backend: `inbrowser`

v86 supports an L2 relay via `relay_url: 'inbrowser'` (BroadcastChannel). Multiple emulator instances in the same page (or tab) exchange Ethernet frames without a server.

Reference: [v86 networking docs](https://github.com/copy/v86/blob/master/docs/networking.md), [broadcast-network example](https://github.com/copy/v86/blob/master/examples/broadcast-network.html).

### `V86NetworkBridge` module (`src/lib/v86NetworkBridge.ts`)

Responsibilities:

1. Create named bridge (`developer-basics-lab-net`) — one per lab session.
2. Register/unregister emulator instances with MAC + role metadata.
3. Attach `net0-send` / `net0-receive` listeners (or set `relay_url: 'inbrowser'` with shared `id`).
4. Expose `assignIp(role): 10.42.0.x` table.
5. Optional: host-side **ClusterIP NAT** — intercept frames to `10.43.0.0/16` and DNAT to worker backends (teaching kube-proxy without kube-proxy).

```ts
// Sketch — not implemented
export type VmRole = 'infra' | 'worker' | 'client'

export interface BridgePeer {
  id: string
  role: VmRole
  ip: string
  emulator: V86Emulator
}

export class V86NetworkBridge {
  constructor(readonly channelId: string) {}
  attach(peer: BridgePeer): void
  detach(id: string): void
  mapService(clusterIp: string, endpoints: string[]): void // host-side kube-proxy sim
}
```

### IP plan (default lab network)

| Address | Role | Typical process |
| --- | --- | --- |
| `10.42.0.11` | worker-1 | `busybox httpd` or Podman pod |
| `10.42.0.12` | worker-2 | second replica |
| `10.42.0.20` | client | learner shell — `curl` / proxied `kubectl` |
| `10.43.0.10` | ClusterIP (virtual) | host bridge DNAT → `.11`/`.12` round-robin |

No dedicated **infra/DNS VM** — see [Decisions](#decisions) (host-injected `/etc/hosts`).

Guest cmdline addition: pass `lab.ip=10.42.0.11` via kernel cmdline or 9p small `lab-env` file read by init.

---

## K8s orchestration (hybrid model)

### Host `K8sOrchestrator`

TypeScript state machine aligned with existing `fake-kubectl.sh` TSV files but authoritative for multi-VM labs:

- **Deployments** → N worker VMs or N Podman containers across workers.
- **Services** → ClusterIP mapping on the bridge; NodePort = `10.42.0.11:30080`.
- **Endpoints** → health-checked HTTP ports on workers.
- **Events** → feed `K8sWorkloadSim` / `KubectlLab` React panels.

`kubectl` in multi-VM labs is handled by a **host terminal proxy** — see [Decisions](#decisions). The client VM shell runs `curl`/`ping` natively; `kubectl` lines are intercepted before they reach the guest.

### What learners actually run

```bash
# client VM (worker-net)
curl -s http://10.43.0.10/api/health    # ClusterIP (host DNAT)
curl -s http://my-svc.default.svc.cluster.local/api/health  # after infra DNS

# compare
curl -s http://10.42.0.11:8080/api/health   # direct pod IP — breaks when worker drained
```

React panel shows the same request path as `K8sServiceSim` but driven by **live** curl output in xterm.

---

## Hands-on use cases (curriculum map)

Each use case = one **lab preset** (`LabPreset` config: profiles, bridge topology, starter commands, linked chapters).

### Tier 1 — Networking fundamentals (worker-min, 2 VMs)

| ID | Title | VMs | Learner does | Concepts |
| --- | --- | --- | --- | --- |
| `net-ping-mesh` | Two-node L2 network | client + worker | `ping 10.42.0.11` | virtio-net, static IP, L2 bridge |
| `net-http-static` | Tiny HTTP server | server + client | start `httpd`, `wget -O- http://10.42.0.11/` | bind address, port, request/response |
| `net-arp-neighbor` | Who has this IP? | 3× worker-min | `ip neigh`, ping all | ARP, same broadcast domain |

### Tier 2 — Service patterns (worker-net, 3 VMs)

| ID | Title | VMs | Learner does | Concepts |
| --- | --- | --- | --- | --- |
| `net-curl-api` | Call an API over the bridge | api + client | `curl http://10.42.0.11:8080/health` | HTTP, JSON, service vs client |
| `net-dns-svc` | Name → IP | api + client (preset hosts) | `curl http://my-api/health` | `/etc/hosts`, stable names |
| `net-nodeport` | Published port | api + client | curl node IP:30080 | NodePort mapping |
| `net-firewall` | Blocked path | api + client | iptables DROP, curl fails | NetworkPolicy intuition |

### Tier 3 — Orchestration-shaped (worker-net/agent + orchestrator, 3–4 VMs)

| ID | Title | VMs | Learner does | Concepts |
| --- | --- | --- | --- | --- |
| `k8s-clusterip-curl` | Service VIP | 2 workers + client | curl ClusterIP; watch RR in logs | Service, endpoints, kube-proxy idea |
| `k8s-scale-out` | Add a replica | orchestrator scales | `kubectl scale`, curl 10× | desired vs actual, load spread |
| `k8s-drain` | Node unavailable | stop worker-2 VM | curl still works via ClusterIP | failover, readiness |
| `k8s-ingress-path` | Host-based routing | ingress VM + 2 backends + client | `curl -H 'Host: api.lab'` | Ingress, virtual hosts |

### Tier 4 — Containers on workers (worker-agent, 2 VMs)

| ID | Title | VMs | Learner does | Concepts |
| --- | --- | --- | --- | --- |
| `podman-bridge-net` | User-defined network | 1 agent (2 containers) | `podman network create`, run api/db | bridge, DNS embedded |
| `podman-multi-vm` | API in container on worker | agent + client | build image on worker, curl from client | image on node, host port publish |

### Tier 5 — Capstone (mixed)

| ID | Title | Components | Learner does |
| --- | --- | --- | --- |
| `capstone-three-tier` | Web → API → DB | 3 workers or compose on 1 agent + sim DB | deploy stack, curl through ingress, read DB row |
| `capstone-debug-net` | Broken service | misconfigured IP/DNS | use `ping`, `curl -v`, `ip route` to fix |

### UI: `MultiVmLab` component

- Grid of 2–4 `ShellTerminal` panes, color-coded by role.
- Side panel: topology diagram (reuse `K8sClusterSim` nodes, highlight packet path on curl).
- **Preset loader** — one click boots the right profile set.
- RAM guard: refuse 4× podman-full; allow 4× worker-min.

---

## Implementation phases

| Phase | Deliverable | Success criteria |
| --- | --- | --- |
| **0 — Spike** | 2× `worker-min` + manual BroadcastChannel wiring | ping across VMs in dev page |
| **1 — Bridge module** | `V86NetworkBridge`, `relay_url: 'inbrowser'` in v86 opts | reusable attach/detach API |
| **2 — worker-min image** | Dockerfile + build script + manifest profile | <20 MB, <128 MB RAM, boots <25 s |
| **3 — worker-net + curl lab** | `net-curl-api` preset in one chapter | E2E: curl returns JSON from peer VM |
| **4 — Orchestrator** | `K8sOrchestrator` + ClusterIP DNAT | `curl` to virtual service IP hits workers |
| **5 — MultiVmLab UI** | Chapter integration (`k8s-networking`, new `k8s-hands-on-net`) | 3-pane lab in production build |
| **6 — worker-agent** | Podman on worker only | build/run on worker, curl from client VM |
| **7 — CI + cache** | Profile-aware cache keys, fetch script | deploy builds all profiles; lazy fetch per lab |

### Phase 0 spike tasks (concrete)

1. Add `scripts/v86/Dockerfile.worker-min` and `build-profile.sh --profile worker-min`.
2. Dev-only page `src/dev/V86NetworkSpike.tsx`: spawn 2 emulators, shared bridge channel.
3. Guest: `/root/bring-up-net.sh` sets `10.42.0.11` / `10.42.0.20`, starts `httpd` on server.
4. Verify `ping` and `wget`/`curl` (worker-net) across bridge.
5. Document RAM/CPU limits on low-end mobile (fallback: animated replay + Wasmer).

---

## Runtime selection matrix

| Lab preset | v86 profile | Fallback if image/RAM missing |
| --- | --- | --- |
| `net-ping-mesh` | 2× worker-min | Wasmer + narrated ASCII ping |
| `net-curl-api` | worker-net × 2 | Single Wasmer + fake HTTP script |
| `k8s-clusterip-curl` | worker-net × 3 + orchestrator | `K8sServiceSim` + recorded curl transcript |
| `docker-containers` | alpine-podman-lab × 1 | Wasmer fake-docker |
| Capstone build | alpine-podman-lab | existing path |

`useShellRuntime` extended with `labPreset` → chooses profile(s) and bridge config.

---

## Testing

| Test | Type | Notes |
| --- | --- | --- |
| Bridge frame relay | unit | mock `net0-send` / `net0-receive` |
| ClusterIP DNAT | unit | endpoint list rotation |
| worker-min image size | CI | fail if manifest uncompressed > 22 MB |
| 2-VM ping | e2e optional (`V86_NET_E2E=1`) | Playwright, long timeout |
| curl ClusterIP | e2e optional | assert JSON body |

---

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| 4 VMs × 128 MB = 512 MB host RAM | Cap concurrent VMs; presets max 3 workers + 1 client; snapshot shared base |
| inbrowser backend not in older v86 | Pin v86 version; fallback to manual BroadcastChannel listeners |
| Alpine static IP drift | Role-based IP in kernel cmdline; no DHCP dependency |
| Mobile browsers OOM | Auto-downgrade to Tier 1 single-VM or React sim; show RAM estimate before boot |
| Learner confusion (sim vs real) | **SimReality** callout on every multi-VM chapter; green badge “real network” |

---

## Decisions

Resolved 2026-09-02 — optimize for **low browser resource use**, **low complexity**, and **stability**.

### 1. DNS → host-injected `/etc/hosts` (no dnsmasq, no infra VM)

| Option | Verdict |
| --- | --- |
| dnsmasq in infra VM | Rejected — extra VM, daemon RAM, UDP stack, boot ordering |
| Host-injected `/etc/hosts` | **Chosen** |

**How it works**

- Each lab preset ships a **static `hosts` overlay** in its lazy-fetched `lab-bundles/<preset>/` (typically &lt;1 KB).
- Guest `bring-up-net.sh` appends overlay to `/etc/hosts` on boot.
- Typical k8s preset entries (stable for the whole lab — scale/drain does not change service names):

  ```
  10.43.0.10  my-svc.default.svc.cluster.local my-svc
  10.42.0.11  worker-1
  10.42.0.12  worker-2
  ```

- **ClusterIP DNAT** is handled by the host bridge; `/etc/hosts` only maps names → VIP. Endpoint changes behind the VIP do not require hosts updates.
- Advanced `kubectl apply` creating a *new* service name: host terminal proxy prints the new mapping and, if needed, sends a one-line serial command to append a hosts entry (rare path; most labs use fixed presets).

**Why stable:** no DHCP lease expiry, no DNS daemon crash, no cross-VM UDP broadcast. Matches how many CI/kind setups seed `/etc/hosts` for simplicity.

### 2. Downloads → lazy-fetch per profile/preset

**Chosen.** See [Lazy-fetch](#lazy-fetch-per-lab-preset) above. First visit to a networking chapter downloads ~18 MB (worker-net); podman capstone still lazy-fetches ~50 MB only when opened.

### 3. kubectl → host terminal proxy (serial input intercept)

| Option | Verdict |
| --- | --- |
| HTTP sidecar on infra VM | Rejected — extra VM + HTTP server process |
| 9p request/response queue | Rejected — v86 rootfs overlay is guest-local; host cannot reliably watch writes |
| **Host terminal proxy** | **Chosen** |

**How it works**

- In multi-VM labs, `ShellTerminal` wraps `term.onData` for the **client** pane only.
- Lines matching `kubectl …` are **not** sent to the guest serial port.
- Host runs `K8sOrchestrator.handleKubectl(argv)` (TypeScript port of `fake-kubectl.sh` output format).
- Output is written directly to xterm; React topology panels subscribe to orchestrator events.
- `curl`, `ping`, `ip`, `wget` pass through to the real guest — real packets on the bridge.
- Single-VM podman lab unchanged: in-guest `fake-kubectl.sh` via `/opt/lab/kubectl.sh`.

**Why stable:** no network service in any VM; orchestrator state is single source of truth in the host; same UX as typing kubectl in the terminal.

```ts
// ShellTerminal sketch — client pane in multi-VM preset
term.onData((data) => {
  if (preset.orchestrator && pane.role === 'client' && looksLikeKubectl(data)) {
    const out = orchestrator.handleKubectl(parseLine(data))
    term.write(out)
    return
  }
  emulator.serial0_send(data)
})
```

### Remaining open question

4. **Ingress TLS** — terminate on ingress VM with self-signed cert for `curl -k` lab? (defer to Phase 5 UI work)

---

## References

- [v86-podman-lab.md](./v86-podman-lab.md) — current single-VM lab
- [containerization-module.md](./containerization-module.md) — K8s React sims and fake CLIs
- [v86 networking](https://github.com/copy/v86/blob/master/docs/networking.md)
- [v86 inbrowser network PR](https://github.com/copy/v86/pull/1216)
- [v86 issue #1094 — multi-instance networking](https://github.com/copy/v86/issues/1094)

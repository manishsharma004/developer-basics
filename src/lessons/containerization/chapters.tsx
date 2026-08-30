import type { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { createChapterLesson, type QuizQuestion } from '../components/ChapterLesson.tsx'
import { Callout, SimReality, TryThis, UnderTheHood, CodePreview } from '../components/blocks.tsx'
import { VmContainerCompare } from './sims/VmContainerCompare.tsx'
import { ImageLayersSim } from './sims/ImageLayersSim.tsx'
import { DockerCliSim } from './sims/DockerCliSim.tsx'
import { WasmerShell } from './sims/WasmerShell.tsx'
import { DockerfileEditorSim } from './sims/DockerfileEditorSim.tsx'
import { DockerNetworkSim } from './sims/DockerNetworkSim.tsx'
import { DockerVolumeSim } from './sims/DockerVolumeSim.tsx'
import { ComposeGraphSim } from './sims/ComposeGraphSim.tsx'
import { ComposeSim } from './sims/ComposeSim.tsx'
import { K8sClusterSim } from './sims/K8sClusterSim.tsx'
import { K8sWorkloadSim } from './sims/K8sWorkloadSim.tsx'
import { K8sServiceSim } from './sims/K8sServiceSim.tsx'
import { IngressSim } from './sims/IngressSim.tsx'
import { K8sNetworkingSim } from './sims/K8sNetworkingSim.tsx'
import { K8sStorageSim } from './sims/K8sStorageSim.tsx'
import { ConfigSecretsSim } from './sims/ConfigSecretsSim.tsx'
import { KubectlLab } from './sims/KubectlLab.tsx'
import { K8sNodeSim } from './sims/K8sNodeSim.tsx'
import { K8sOperatorSim } from './sims/K8sOperatorSim.tsx'
import { PlatformCompare } from './sims/PlatformCompare.tsx'
import { ContainerCapstoneSim } from './sims/ContainerCapstoneSim.tsx'
import { COI_TROUBLESHOOTING } from '../../lib/crossOriginIsolation.ts'

function q(question: string, options: string[], answer: number, explain?: string): QuizQuestion {
  return { q: question, options, answer, explain }
}

const simNote = (sim: ReactNode, prod: ReactNode) => (
  <SimReality inSim={sim} inReality={prod} />
)

const containerIntro = createChapterLesson({
  id: 'container-intro',
  modelTitle: 'VMs vs containers',
  intro: (
    <p className="prose">
      Your app needs an OS, libraries, and config. <strong>Virtual machines</strong> bundle a full guest
      OS; <strong>containers</strong> share the host kernel and isolate at the process level — faster to
      start and denser on the same hardware. See also{' '}
      <Link to="/lessons/compute">Compute Instances</Link> for scaling context.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        A container image is a <strong>portable package</strong> — your app plus dependencies — that runs
        the same on a laptop, CI runner, or cloud.
      </Callout>
      {simNote(
        <span>Side-by-side stack diagram toggling VM vs container.</span>,
        <span>Real cgroups, namespaces, and a container runtime (containerd).</span>,
      )}
    </>
  ),
  playground: (
    <>
      <VmContainerCompare />
      <TryThis>Toggle VM vs container and note boot time and isolation differences.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Browser labs & cross-origin isolation">
      <p className="prose">
        Shell labs use Wasmer in the browser, which needs <code>SharedArrayBuffer</code> and therefore{' '}
        <strong>cross-origin isolation</strong> (COOP/COEP). GitHub Pages uses{' '}
        <code>coi-serviceworker</code> to enable this.{' '}
        <a href={COI_TROUBLESHOOTING} target="_blank" rel="noreferrer">
          Troubleshooting guide
        </a>
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'container image', def: 'Read-only template with layers (OS libs + app).' },
    { term: 'container', def: 'Running instance of an image.' },
    { term: 'OCI', def: 'Open Container Initiative — image and runtime standards.' },
  ],
  quiz: [
    q('Containers vs VMs — containers typically:', ['Include a full guest OS', 'Share the host kernel', 'Boot in minutes', 'Cannot run on Linux'], 1),
    q('An image is:', ['A running process', 'An immutable template', 'A git branch', 'A load balancer'], 1),
  ],
  recap: [
    <>Containers package apps with dependencies; lighter and faster than VMs.</>,
    <>Images are immutable; containers are running instances.</>,
  ],
})

const dockerImages = createChapterLesson({
  id: 'docker-images',
  modelTitle: 'Images & registries',
  intro: (
    <p className="prose">
      A <strong>Docker image</strong> is built from a Dockerfile as stacked layers. Tags like{' '}
      <code>myapp:1.2</code> point at images; digests are content-addressed. Registries (Docker Hub, GHCR,
      ECR) store and distribute images.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><code>docker build -t name:tag .</code> — build from Dockerfile in context</li>
        <li><code>docker push</code> / <code>docker pull</code> — sync with registry</li>
        <li>Layer cache — unchanged instructions reuse cached layers</li>
        <li><code>.dockerignore</code> — exclude files from build context</li>
      </ul>
      {simNote(<span>Step through Dockerfile lines as cached layers.</span>, <span>Real buildkit/buildx, manifest lists, multi-arch.</span>)}
    </>
  ),
  playground: (
    <>
      <ImageLayersSim />
      <TryThis>Click build repeatedly — notice layers already marked cached are skipped on rebuild.</TryThis>
    </>
  ),
  terms: [
    { term: 'layer', def: 'Filesystem diff created by each Dockerfile instruction.' },
    { term: 'tag', def: 'Human-readable label for an image (mutable).' },
    { term: 'registry', def: 'Remote store for images (Hub, ECR, GHCR).' },
  ],
  quiz: [
    q('docker build creates:', ['A running container', 'An image from a Dockerfile', 'A git tag', 'A PVC'], 1),
    q('Layer caching helps because:', ['It encrypts images', 'Unchanged steps skip rebuild work', 'It removes the need for a registry', 'It replaces kubectl'], 1),
  ],
  recap: [<>Dockerfile → layered image → tag → push to registry.</>],
})

const dockerContainers = createChapterLesson({
  id: 'docker-containers',
  modelTitle: 'Container lifecycle',
  intro: (
    <p className="prose">
      <code>docker run</code> creates a writable container layer on top of an image. Map ports with{' '}
      <code>-p</code>, pass env with <code>-e</code>, and use <code>docker logs/exec</code> for operations.
    </p>
  ),
  model: (
    <>
      <CodePreview language="plaintext" code={`docker run -d --name web -p 8080:80 -e NODE_ENV=prod myapp:1.0\ndocker ps\ndocker logs web\ndocker exec -it web sh\ndocker stop web && docker rm web`} />
      {simNote(<span>CLI simulator or Wasmer bash when isolated.</span>, <span>containerd/dockerd, cgroups, namespaces.</span>)}
    </>
  ),
  playground: (
    <>
      <WasmerShell fallback={<DockerCliSim />} />
      <TryThis>Build an image, run two containers on different ports, then stop and remove one.</TryThis>
    </>
  ),
  terms: [
    { term: 'docker run', def: 'Create and start a container from an image.' },
    { term: 'port mapping', def: '-p host:container publishes container port on host.' },
    { term: 'detached', def: '-d runs container in background.' },
  ],
  quiz: [
    q('docker run creates:', ['Only an image', 'A running container', 'A Kubernetes Pod', 'An ingress'], 1),
    q('-p 8080:80 maps:', ['Container 8080 to host 80', 'Host 8080 to container 80', 'Only UDP', 'etcd port'], 1),
  ],
  recap: [<>run → ps/logs/exec → stop → rm. Container FS is ephemeral unless volumes are used.</>],
})

const dockerDockerfile = createChapterLesson({
  id: 'docker-dockerfile',
  modelTitle: 'Dockerfile instructions',
  intro: (
    <p className="prose">
      Common instructions: <code>FROM</code>, <code>WORKDIR</code>, <code>COPY</code>, <code>RUN</code>,{' '}
      <code>EXPOSE</code>, <code>CMD</code>/<code>ENTRYPOINT</code>. Multi-stage builds keep final images small.
    </p>
  ),
  model: (
    <>
      <Callout kind="tip" title="Multi-stage">
        Build in a fat image (Node, Go toolchain), copy artifacts into a minimal runtime image (alpine,
        distroless).
      </Callout>
      {simNote(<span>Validate Dockerfile structure in the editor.</span>, <span>BuildKit secrets, SBOM, image scanning.</span>)}
    </>
  ),
  playground: (
    <>
      <DockerfileEditorSim />
      <TryThis>Remove CMD and validate — fix it, then simulate a successful build.</TryThis>
    </>
  ),
  terms: [
    { term: 'ENTRYPOINT', def: 'Fixed executable; CMD provides default args.' },
    { term: 'multi-stage', def: 'Multiple FROM stages; copy artifacts between them.' },
  ],
  quiz: [q('Multi-stage builds mainly:', ['Add more VMs', 'Shrink final image size', 'Replace docker compose', 'Remove layers'], 1)],
  recap: [<>FROM sets base; COPY/RUN build layers; CMD/ENTRYPOINT define the process.</>],
})

const dockerNetworks = createChapterLesson({
  id: 'docker-networks',
  modelTitle: 'Networking modes',
  intro: <p className="prose">Containers on the default <strong>bridge</strong> network get private IPs; <code>-p</code> publishes ports. <strong>host</strong> mode shares the host network stack.</p>,
  model: (
    <ul className="prose-list">
      <li><code>docker network create mynet</code> — user-defined bridge</li>
      <li>Containers on same network resolve each other by name</li>
      <li>Overlay networks (Swarm/k8s CNI) span hosts — conceptual here</li>
    </ul>
  ),
  playground: (
    <>
      <DockerNetworkSim />
      <TryThis>Switch bridge vs host and change port mapping — read the path diagram.</TryThis>
    </>
  ),
  terms: [
    { term: 'bridge network', def: 'Default isolated network with NAT to host.' },
    { term: 'host network', def: 'Container uses host interfaces directly.' },
  ],
  quiz: [q('User-defined bridge networks enable:', ['Git merges', 'DNS between containers by name', 'Faster CPUs', 'SQL joins'], 1)],
  recap: [<>Default bridge + port maps for publishing; custom networks for service DNS.</>],
})

const dockerVolumes = createChapterLesson({
  id: 'docker-volumes',
  modelTitle: 'Persistent storage',
  intro: <p className="prose">Container writable layers disappear with <code>docker rm</code>. <strong>Volumes</strong> and <strong>bind mounts</strong> persist data on the host.</p>,
  model: (
    <ul className="prose-list">
      <li><strong>Named volume</strong> — managed by Docker (<code>-v mydata:/data</code>)</li>
      <li><strong>Bind mount</strong> — host path (<code>-v /host/path:/container/path</code>)</li>
      <li><code>tmpfs</code> — memory-only (not shown in sim)</li>
    </ul>
  ),
  playground: (
    <>
      <DockerVolumeSim />
      <TryThis>Run without a volume, write data, remove container — data is lost. Repeat with a named volume.</TryThis>
    </>
  ),
  terms: [
    { term: 'named volume', def: 'Docker-managed storage surviving container removal.' },
    { term: 'bind mount', def: 'Maps a host directory into the container.' },
  ],
  quiz: [q('Volumes help because:', ['They speed DNS', 'Data survives container deletion', 'They replace React', 'They encrypt git'], 1)],
  recap: [<>Use volumes for databases and uploads; bind mounts for dev hot-reload.</>],
})

const composeIntro = createChapterLesson({
  id: 'compose-intro',
  modelTitle: 'Services & dependencies',
  intro: <p className="prose"><strong>Docker Compose</strong> defines multi-container apps in one YAML file — services, networks, volumes.</p>,
  model: (
    <>
      <CodePreview language="plaintext" code={`services:\n  web:\n    build: .\n    ports: ["8080:80"]\n    depends_on: [api]\n  api:\n    image: myapi:1.0`} />
      {simNote(<span>YAML → dependency graph.</span>, <span>Real compose creates networks and starts containers.</span>)}
    </>
  ),
  playground: (
    <>
      <ComposeGraphSim />
      <TryThis>Edit depends_on and watch which services wait on others.</TryThis>
    </>
  ),
  terms: [
    { term: 'compose file', def: 'docker-compose.yml defining services, networks, volumes.' },
    { term: 'service', def: 'One container definition in compose.' },
  ],
  quiz: [q('depends_on ensures:', ['Startup order awareness', 'Automatic TLS', 'Git push', 'SQL migrations always'], 0)],
  recap: [<>Compose models multi-service apps; depends_on expresses startup dependencies.</>],
})

const composeServices = createChapterLesson({
  id: 'compose-services',
  modelTitle: 'Multi-service stacks',
  intro: <p className="prose">Typical stack: <strong>web</strong> + <strong>api</strong> + <strong>db</strong>. Environment variables wire connection strings.</p>,
  model: (
    <ul className="prose-list">
      <li><code>docker compose up -d</code> — detached</li>
      <li><code>docker compose ps / logs / exec</code></li>
      <li><code>docker compose down -v</code> — tear down including volumes</li>
    </ul>
  ),
  playground: (
    <>
      <ComposeSim />
      <TryThis>Run compose up and watch db → api → web come up in dependency order.</TryThis>
    </>
  ),
  terms: [
    { term: 'docker compose up', def: 'Create and start all services.' },
    { term: 'environment', def: 'Env vars injected into service containers.' },
  ],
  quiz: [q('docker compose down removes:', ['Only images', 'Containers and default networks for the project', 'Git history', 'kubectl config'], 1)],
  recap: [<>Compose up brings the whole stack; logs and exec work per service.</>],
})

const composeProduction = createChapterLesson({
  id: 'compose-production',
  modelTitle: 'Prod patterns',
  intro: <p className="prose">Production uses overrides, healthchecks, profiles, and scaling — same files, different invocations.</p>,
  model: (
    <ul className="prose-list">
      <li><code>compose.override.yml</code> — dev defaults; prod file via <code>-f</code></li>
      <li><code>profiles:</code> — optional services (<code>--profile debug</code>)</li>
      <li><code>healthcheck</code> + <code>depends_on: condition: service_healthy</code></li>
      <li><code>docker compose up --scale api=3</code></li>
    </ul>
  ),
  playground: (
    <>
      <ComposeSim showProfiles />
      <TryThis>Add a profile to a service in YAML and toggle profiles before compose up.</TryThis>
    </>
  ),
  terms: [
    { term: 'profile', def: 'Optional service group activated with --profile.' },
    { term: 'healthcheck', def: 'Command compose uses to mark service healthy.' },
  ],
  quiz: [q('service_healthy condition:', ['Waits for healthcheck pass', 'Disables networks', 'Removes volumes', 'Runs git pull'], 0)],
  recap: [<>Overrides and profiles separate dev/prod; healthchecks improve startup ordering.</>],
})

const k8sIntro = createChapterLesson({
  id: 'k8s-intro',
  modelTitle: 'Orchestration problems',
  intro: <p className="prose">Many containers across many hosts need scheduling, health checks, rolling updates, and service discovery — <strong>Kubernetes</strong> automates that.</p>,
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Declare <strong>desired state</strong> (3 replicas of this image); controllers continuously reconcile
        reality to match.
      </Callout>
      <ul className="prose-list">
        <li>Self-healing — restart failed containers</li>
        <li>Scaling — change replica count or HPA</li>
        <li>Rolling updates — zero-downtime deploys</li>
      </ul>
    </>
  ),
  playground: (
    <>
      <K8sWorkloadSim />
      <TryThis>Change desired replicas and watch the controller create pods.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Kubernetes vs Docker Compose">
      <p className="prose">Compose is excellent for local multi-container dev. Kubernetes targets production clusters with many nodes, RBAC, and cloud integrations.</p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'orchestrator', def: 'System that schedules and manages containers at scale.' },
    { term: 'desired state', def: 'Declarative spec controllers work toward.' },
  ],
  quiz: [q('Kubernetes is primarily for:', ['Local single-laptop only', 'Scheduling containers across a cluster', 'Replacing SQL', 'Git hosting'], 1)],
  recap: [<>K8s reconciles desired state; solves multi-host scheduling and upgrades.</>],
})

const k8sArchitecture = createChapterLesson({
  id: 'k8s-architecture',
  modelTitle: 'Cluster architecture',
  intro: <p className="prose">A cluster has a <strong>control plane</strong> (API server, etcd, scheduler, controllers) and <strong>worker nodes</strong> (kubelet, kube-proxy, runtime).</p>,
  model: (
    <ul className="prose-list">
      <li><strong>API server</strong> — all kubectl/cloud calls go here</li>
      <li><strong>etcd</strong> — consistent store for cluster state</li>
      <li><strong>kubelet</strong> — runs pods on the node</li>
      <li><strong>kube-proxy</strong> — Service VIP routing</li>
    </ul>
  ),
  playground: (
    <>
      <K8sClusterSim />
      <TryThis>Click each component and explain its role in a deploy request.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="High availability">
      <p className="prose">Production control planes run multiple API server/etcd instances. Worker nodes are expendable; workloads reschedule elsewhere.</p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'control plane', def: 'Brains of the cluster — API, etcd, scheduler, controllers.' },
    { term: 'kubelet', def: 'Node agent that runs pod containers.' },
    { term: 'CRI', def: 'Container Runtime Interface — containerd, CRI-O.' },
  ],
  quiz: [q('Cluster state is stored in:', ['Git', 'etcd', 'nginx', 'Redis only'], 1)],
  recap: [<>API server + etcd + controllers on control plane; kubelet + runtime on nodes.</>],
})

const k8sWorkloads = createChapterLesson({
  id: 'k8s-workloads',
  modelTitle: 'Workloads',
  intro: <p className="prose">A <strong>Pod</strong> is one or more containers sharing network/storage. <strong>Deployments</strong> manage ReplicaSets to run N identical pods.</p>,
  model: (
    <ul className="prose-list">
      <li>Deployment → ReplicaSet → Pods</li>
      <li>StatefulSet — stable network IDs and storage</li>
      <li>DaemonSet — one pod per node</li>
      <li>Job / CronJob — batch work</li>
    </ul>
  ),
  playground: (
    <>
      <K8sWorkloadSim />
      <TryThis>Scale replicas to 0, then back to 4 — watch reconciliation.</TryThis>
    </>
  ),
  terms: [
    { term: 'Pod', def: 'Smallest deployable unit — one or more containers.' },
    { term: 'Deployment', def: 'Declarative rolling updates for stateless apps.' },
  ],
  quiz: [q('Deployments manage:', ['SQL schemas', 'Desired pod replica count', 'DNS registrars', 'Git branches'], 1)],
  recap: [<>Pods run containers; Deployments keep the right number running.</>],
})

const k8sServices = createChapterLesson({
  id: 'k8s-services',
  modelTitle: 'Kubernetes Services',
  intro: <p className="prose">Pod IPs change. A <strong>Service</strong> provides a stable virtual IP and DNS name that load-balances to ready pods.</p>,
  model: (
    <ul className="prose-list">
      <li><strong>ClusterIP</strong> — internal only (default)</li>
      <li><strong>NodePort</strong> — exposes on each node IP</li>
      <li><strong>LoadBalancer</strong> — cloud LB provisions external IP</li>
    </ul>
  ),
  playground: (
    <>
      <K8sServiceSim />
      <TryThis>Switch service types and send requests — trace the path.</TryThis>
    </>
  ),
  terms: [
    { term: 'ClusterIP', def: 'Internal virtual IP for in-cluster access.' },
    { term: 'selector', def: 'Labels that tie a Service to matching pods.' },
  ],
  quiz: [q('ClusterIP Services are reachable:', ['From the public internet by default', 'Inside the cluster', 'Only from etcd', 'Without pods'], 1)],
  recap: [<>Services stable-endpoint pods; types control how traffic enters.</>],
})

const k8sIngress = createChapterLesson({
  id: 'k8s-ingress',
  modelTitle: 'Ingress rules',
  intro: <p className="prose"><strong>Ingress</strong> HTTP routing (host/path) to Services, often with TLS termination via an ingress controller (nginx, traefik).</p>,
  model: <p className="prose">Ingress is L7; LoadBalancer Service is L4. Many apps use Ingress + cert-manager for HTTPS.</p>,
  playground: (
    <>
      <IngressSim />
      <TryThis>Change host/path to hit different backends or get 404.</TryThis>
    </>
  ),
  terms: [
    { term: 'Ingress', def: 'HTTP routing rules into the cluster.' },
    { term: 'ingress controller', def: 'Pod that implements Ingress (nginx, etc.).' },
  ],
  quiz: [q('Ingress typically routes:', ['HTTP host/path to Services', 'Disk volumes', 'Git commits', 'CPU interrupts'], 0)],
  recap: [<>Ingress = HTTP routing; controller implements rules + TLS.</>],
})

const k8sNetworking = createChapterLesson({
  id: 'k8s-networking',
  modelTitle: 'Cluster networking',
  intro: <p className="prose"><strong>CNI</strong> plugins assign pod IPs. <strong>CoreDNS</strong> resolves <code>service.namespace.svc.cluster.local</code>.</p>,
  model: (
    <ul className="prose-list">
      <li>Pod CIDR — per-node pod IP ranges</li>
      <li>Service CIDR — cluster IPs for Services</li>
      <li>kube-proxy — iptables/IPVS rules to endpoints</li>
      <li>NetworkPolicy — firewall between pods (optional)</li>
    </ul>
  ),
  playground: (
    <>
      <K8sNetworkingSim />
      <TryThis>Look up a Service DNS name vs a pod hostname pattern.</TryThis>
    </>
  ),
  terms: [
    { term: 'CNI', def: 'Plugin that wires pod network interfaces.' },
    { term: 'CoreDNS', def: 'In-cluster DNS for Services and pods.' },
  ],
  quiz: [q('Service DNS names end with:', ['.com', '.svc.cluster.local', '.docker', '.github'], 1)],
  recap: [<>Pods get ephemeral IPs; Services get stable DNS and cluster IPs.</>],
})

const k8sStorage = createChapterLesson({
  id: 'k8s-storage',
  modelTitle: 'Persistent storage',
  intro: <p className="prose"><strong>PersistentVolumeClaim</strong> requests storage; bound to a <strong>PV</strong> or provisioned via <strong>StorageClass</strong>.</p>,
  model: <p className="prose">CSI drivers connect to cloud disks (EBS, GCE PD). Pods mount PVCs as volumes.</p>,
  playground: (
    <>
      <K8sStorageSim />
      <TryThis>Apply a PVC with dynamic vs static provisioning.</TryThis>
    </>
  ),
  terms: [
    { term: 'PVC', def: 'Pod request for storage capacity.' },
    { term: 'StorageClass', def: 'Template for dynamic volume provisioning.' },
  ],
  quiz: [q('PVC Bound means:', ['Git merged', 'Volume attached and ready to mount', 'Pod deleted', 'Ingress created'], 1)],
  recap: [<>PVC requests storage; PV/StorageClass fulfill it; mount in pod spec.</>],
})

const k8sConfigSecrets = createChapterLesson({
  id: 'k8s-config-secrets',
  modelTitle: 'Config & secrets',
  intro: <p className="prose"><strong>ConfigMaps</strong> hold non-secret config; <strong>Secrets</strong> hold sensitive data (base64 in etcd — not encryption by default).</p>,
  model: (
    <ul className="prose-list">
      <li>Mount as env vars or files</li>
      <li>Update ConfigMap — pods may need restart to pick up changes</li>
      <li>Sealed Secrets / external secret operators for GitOps</li>
    </ul>
  ),
  playground: (
    <>
      <ConfigSecretsSim />
      <TryThis>Toggle env vs volume mount — see how secrets reach the container.</TryThis>
    </>
  ),
  terms: [
    { term: 'ConfigMap', def: 'Key-value config decoupled from images.' },
    { term: 'Secret', def: 'Sensitive data; mount carefully with RBAC.' },
  ],
  quiz: [q('Kubernetes Secrets in etcd are:', ['Encrypted by default in all clusters', 'Often base64-encoded, not secret alone', 'Public on GitHub', 'Same as TLS certs'], 1)],
  recap: [<>ConfigMaps for config; Secrets for credentials — protect with RBAC and encryption at rest.</>],
})

const k8sCommands = createChapterLesson({
  id: 'k8s-commands',
  modelTitle: 'Essential kubectl',
  intro: <p className="prose">Day-to-day DevOps: inspect resources, apply manifests, stream logs, exec shells, scale, and roll out.</p>,
  model: (
    <CodePreview language="plaintext" code={`kubectl get pods -o wide\nkubectl describe deploy web\nkubectl apply -f deploy.yaml\nkubectl logs deploy/web\nkubectl exec -it pod -- sh\nkubectl scale deploy web --replicas=5\nkubectl rollout status deploy/web`} />
  ),
  playground: (
    <>
      <KubectlLab />
      <TryThis>Run get pods, scale deploy web, delete a pod, get logs.</TryThis>
    </>
  ),
  terms: [
    { term: 'kubectl apply', def: 'Declarative create/update from YAML.' },
    { term: 'rollout', def: 'Manage Deployment update progress.' },
  ],
  quiz: [q('kubectl apply is:', ['Imperative only', 'Declarative — desired state in YAML', 'A Docker command', 'A SQL statement'], 1)],
  recap: [<>get/describe for inspect; apply for deploy; logs/exec for debug.</>],
})

const k8sNodes = createChapterLesson({
  id: 'k8s-nodes',
  modelTitle: 'Node operations',
  intro: <p className="prose">Maintain nodes with <code>kubectl cordon</code>, <code>drain</code>, <strong>taints</strong> and <strong>tolerations</strong> for specialized hardware.</p>,
  model: <p className="prose">Cordon marks node unschedulable; drain evicts pods (respecting PDBs in real clusters).</p>,
  playground: (
    <>
      <K8sNodeSim />
      <TryThis>Cordon node-1, then drain — watch pod count hit zero.</TryThis>
    </>
  ),
  terms: [
    { term: 'cordon', def: 'Prevent new pods on a node.' },
    { term: 'taint', def: 'Repels pods unless they have a matching toleration.' },
  ],
  quiz: [q('drain is used before:', ['Writing CSS', 'Node maintenance / upgrade', 'git commit', 'JSON parse'], 1)],
  recap: [<>Cordon + drain for safe maintenance; taints steer workloads.</>],
})

const k8sOperatorsBuiltin = createChapterLesson({
  id: 'k8s-operators-builtin',
  modelTitle: 'Reconciliation loops',
  intro: <p className="prose">Controllers watch API objects and reconcile: Deployment controller ensures pod count matches spec.</p>,
  model: <p className="prose">Loop: observe → compare desired vs actual → act → repeat.</p>,
  playground: (
    <>
      <K8sOperatorSim mode="builtin" />
      <TryThis>Change replicas and read controller event lines.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Built-in controllers">
      <p className="prose">ReplicaSet, Deployment, StatefulSet, DaemonSet, Job controllers all follow the same pattern in controller-manager.</p>
    </UnderTheHood>
  ),
  terms: [{ term: 'reconciliation', def: 'Continuously matching cluster state to spec.' }],
  quiz: [q('Deployment controller creates:', ['SQL tables', 'Pods to match replicas', 'Git tags', 'Docker images'], 1)],
  recap: [<>Controllers are control loops; Deployments are the workhorse for stateless apps.</>],
})

const k8sOperatorsCustom = createChapterLesson({
  id: 'k8s-operators-custom',
  modelTitle: 'Custom operators',
  intro: <p className="prose"><strong>CRDs</strong> extend the API; <strong>operators</strong> run custom controllers (e.g. cert-manager, prometheus-operator).</p>,
  model: <p className="prose">You declare a high-level resource; the operator creates Deployments, Services, PVCs underneath.</p>,
  playground: (
    <>
      <K8sOperatorSim mode="custom" />
      <TryThis>Watch the operator create child resources from a CRD claim.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Operator Framework">
      <p className="prose">Kubebuilder and Operator SDK scaffold controllers; Helm can package operators too.</p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'CRD', def: 'Custom Resource Definition — new API type.' },
    { term: 'operator', def: 'Controller for custom resources.' },
  ],
  quiz: [q('Custom operators package:', ['Domain knowledge as code', 'Only CSS', 'Only git hooks', 'VM hypervisors'], 0)],
  recap: [<>CRD + controller = operator; automates complex day-2 operations.</>],
})

const platformsManagedK8s = createChapterLesson({
  id: 'platforms-managed-k8s',
  modelTitle: 'Managed Kubernetes',
  intro: <p className="prose">Cloud providers run the control plane; you manage node pools, IAM, and add-ons.</p>,
  model: (
    <ul className="prose-list">
      <li><strong>EKS</strong> — AWS; IRSA for pod IAM roles</li>
      <li><strong>GKE</strong> — Autopilot vs Standard</li>
      <li><strong>AKS</strong> — Azure AD integration</li>
    </ul>
  ),
  playground: (
    <>
      <PlatformCompare keys={['eks', 'gke', 'aks']} />
      <TryThis>Compare control plane ownership and node options across clouds.</TryThis>
    </>
  ),
  terms: [{ term: 'managed control plane', def: 'Cloud runs API server/etcd; you pay for uptime SLA.' }],
  quiz: [q('EKS stands for:', ['Elastic Kubernetes Service', 'Every Key Stores', 'External Key System', 'Event Queue Service'], 0)],
  recap: [<>Managed k8s offloads control plane ops; you still own workloads and node strategy.</>],
})

const platformsEcsRancher = createChapterLesson({
  id: 'platforms-ecs-rancher',
  modelTitle: 'Platform choices',
  intro: <p className="prose">Not every workload needs Kubernetes. <strong>ECS</strong> is AWS-native; <strong>Rancher</strong> manages many clusters; <strong>Docker Desktop</strong> powers local dev.</p>,
  model: <p className="prose">ECS uses task definitions and services — simpler model, no kubectl. Rancher adds UI/RBAC across clusters.</p>,
  playground: (
    <>
      <PlatformCompare keys={['ecs', 'rancher', 'desktop']} />
      <TryThis>Contrast ECS task model with Kubernetes Pod/Deployment.</TryThis>
    </>
  ),
  terms: [
    { term: 'ECS task', def: 'One or more containers launched together on AWS.' },
    { term: 'Rancher', def: 'Multi-cluster Kubernetes management platform.' },
  ],
  quiz: [q('ECS uses:', ['kubectl as primary API', 'Task definitions and services', 'Only VMs', 'MongoDB only'], 1)],
  recap: [<>Pick ECS for AWS simplicity; Rancher for multi-cluster; Desktop for local dev.</>],
})

const containerCapstone = createChapterLesson({
  id: 'container-capstone',
  modelTitle: 'End-to-end flow',
  intro: (
    <p className="prose">
      Ship a feature: build image in CI (see <Link to="/lessons/cicd">CI/CD</Link>), run locally with Compose,
      deploy to Kubernetes with rolling update.
    </p>
  ),
  model: (
    <ol className="prose-list">
      <li>Dockerfile → image → registry</li>
      <li>compose up for integration test</li>
      <li>Deployment manifest → kubectl apply</li>
      <li>Rollout status + smoke test</li>
    </ol>
  ),
  playground: (
    <>
      <ContainerCapstoneSim />
      <TryThis>Step through each phase and name the command you would run in real life.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="GitOps">
      <p className="prose">Many teams store manifests in git; Argo CD or Flux reconcile cluster state from repo — same declarative idea as kubectl apply.</p>
    </UnderTheHood>
  ),
  terms: [{ term: 'vertical slice', def: 'End-to-end path through all layers for one feature.' }],
  quiz: [q('First step in the capstone flow:', ['kubectl delete all', 'Build and push image', 'Drop database', 'Disable TLS'], 1)],
  recap: [<>Image → compose → manifest → rollout. Automate in CI/CD.</>],
})

export const CONTAINERIZATION_CHAPTERS: Record<string, ComponentType> = {
  'container-intro': containerIntro,
  'docker-images': dockerImages,
  'docker-containers': dockerContainers,
  'docker-dockerfile': dockerDockerfile,
  'docker-networks': dockerNetworks,
  'docker-volumes': dockerVolumes,
  'compose-intro': composeIntro,
  'compose-services': composeServices,
  'compose-production': composeProduction,
  'k8s-intro': k8sIntro,
  'k8s-architecture': k8sArchitecture,
  'k8s-workloads': k8sWorkloads,
  'k8s-services': k8sServices,
  'k8s-ingress': k8sIngress,
  'k8s-networking': k8sNetworking,
  'k8s-storage': k8sStorage,
  'k8s-config-secrets': k8sConfigSecrets,
  'k8s-commands': k8sCommands,
  'k8s-nodes': k8sNodes,
  'k8s-operators-builtin': k8sOperatorsBuiltin,
  'k8s-operators-custom': k8sOperatorsCustom,
  'platforms-managed-k8s': platformsManagedK8s,
  'platforms-ecs-rancher': platformsEcsRancher,
  'container-capstone': containerCapstone,
}

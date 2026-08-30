import { createChapterLesson } from '../../components/ChapterLesson.tsx'
import { Callout, TryThis, UnderTheHood, CodePreview } from '../../components/blocks.tsx'
import { K8sClusterSim } from '../sims/K8sClusterSim.tsx'
import { K8sWorkloadSim } from '../sims/K8sWorkloadSim.tsx'
import { K8sServiceSim } from '../sims/K8sServiceSim.tsx'
import { IngressSim } from '../sims/IngressSim.tsx'
import { K8sNetworkingSim } from '../sims/K8sNetworkingSim.tsx'
import { K8sStorageSim } from '../sims/K8sStorageSim.tsx'
import { ConfigSecretsSim } from '../sims/ConfigSecretsSim.tsx'
import { ContainerShell } from '../sims/ContainerShell.tsx'
import { KubectlLab } from '../sims/KubectlLab.tsx'
import { K8sNodeSim } from '../sims/K8sNodeSim.tsx'
import { K8sOperatorSim } from '../sims/K8sOperatorSim.tsx'
import { q, simNote } from '../shared.tsx'

export const k8sIntro = createChapterLesson({
  id: 'k8s-intro',
  modelTitle: 'Orchestration problems',
  intro: (
    <>
      <p className="prose">
        Docker on one host breaks down quickly: which machine runs which container? What happens when a host dies?
        How do you roll out v2 without downtime? <strong>Kubernetes</strong> automates scheduling, health
        checks, scaling, and service discovery across a <strong>cluster</strong> of nodes.
      </p>
      <p className="prose">
        You declare <strong>desired state</strong> in YAML (&ldquo;run 3 replicas of this image&rdquo;);
        controllers continuously <strong>reconcile</strong> reality to match — restarting failed pods, adding
        replicas, and rolling updates.
      </p>
    </>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Kubernetes is a <strong>control loop platform</strong> — you specify intent; it keeps the cluster aligned.
      </Callout>
      <ul className="prose-list">
        <li>
          <strong>Self-healing</strong> — replace crashed containers; reschedule off failed nodes
        </li>
        <li>
          <strong>Scaling</strong> — change replica count or use Horizontal Pod Autoscaler (HPA)
        </li>
        <li>
          <strong>Rolling updates</strong> — swap images gradually with readiness probes
        </li>
        <li>
          <strong>Service discovery</strong> — stable DNS and IPs for dynamic pod addresses
        </li>
      </ul>
      {simNote(
        <span>Replica slider shows controller creating/removing pods.</span>,
        <span>Real clusters add admission webhooks, RBAC, network policies, and multi-zone scheduling.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'pain-points',
      title: 'Problems Compose cannot solve alone',
      content: (
        <ul className="prose-list">
          <li>Scheduling across many hosts with resource constraints</li>
          <li>Automatic rescheduling when a node disappears</li>
          <li>Zero-downtime deployments with health-gated traffic shift</li>
          <li>Declarative load balancing and TLS ingress at cluster scope</li>
        </ul>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">Change desired replicas and watch the controller reconcile pod count toward the target.</p>
  ),
  playground: (
    <>
      <K8sWorkloadSim />
      <TryThis>Scale from 1 → 5 → 0 → 3 replicas. Which direction is instant vs gradual?</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Kubernetes vs Docker Compose">
      <p className="prose">
        Compose is excellent for local multi-container dev. Kubernetes targets production clusters with many nodes,
        RBAC, cloud integrations, and standardized APIs every tool speaks.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'orchestrator', def: 'System scheduling and managing containers at scale.' },
    { term: 'desired state', def: 'Declarative spec controllers work toward.' },
    { term: 'reconciliation', def: 'Observe → compare → act loop until spec matches reality.' },
    { term: 'cluster', def: 'Control plane plus worker nodes running workloads.' },
  ],
  quiz: [
    q('Kubernetes is primarily for:', ['Local single-laptop only', 'Scheduling containers across a cluster', 'Replacing SQL', 'Git hosting'], 1),
    q('Desired state means:', ['SSH commands on each server', 'YAML declaring what should run', 'Manual pod creation only', 'Dockerfile instructions'], 1),
    q('Self-healing refers to:', ['Replacing failed pods automatically', 'Encrypting etcd', 'Deleting images', 'Disabling DNS'], 0),
  ],
  recap: [
    <>K8s reconciles desired state across many nodes.</>,
    <>Controllers handle replicas, rollouts, and recovery — you write manifests.</>,
    <>Compose for local stacks; Kubernetes for production orchestration.</>,
  ],
})

export const k8sArchitecture = createChapterLesson({
  id: 'k8s-architecture',
  modelTitle: 'Cluster architecture',
  intro: (
    <>
      <p className="prose">
        A Kubernetes cluster splits into the <strong>control plane</strong> (brains) and{' '}
        <strong>worker nodes</strong> (muscle). Every kubectl call and controller loop goes through the{' '}
        <strong>API server</strong>; state lives in <strong>etcd</strong>; the <strong>scheduler</strong> assigns
        pods to nodes; <strong>kubelet</strong> on each node starts containers via the container runtime.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>API server</strong> — REST front door; authn/authz; validates objects
        </li>
        <li>
          <strong>etcd</strong> — consistent key-value store for all cluster state
        </li>
        <li>
          <strong>scheduler</strong> — picks a node for each new pod
        </li>
        <li>
          <strong>controller-manager</strong> — runs Deployment, ReplicaSet, Node controllers
        </li>
        <li>
          <strong>kubelet</strong> — node agent; reports health; runs pods
        </li>
        <li>
          <strong>kube-proxy</strong> — programs routing to Service cluster IPs
        </li>
      </ul>
      {simNote(
        <span>Click each component to see its role in a deploy request.</span>,
        <span>HA control planes run multiple API/etcd members; workers are cattle, not pets.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'deploy-path',
      title: 'Path of a deploy request',
      content: (
        <ol className="prose-list">
          <li>
            <code>kubectl apply</code> → API server validates and writes to etcd
          </li>
          <li>Deployment controller creates/updates ReplicaSet</li>
          <li>ReplicaSet controller creates pods</li>
          <li>Scheduler binds each pod to a node</li>
          <li>kubelet pulls image and starts containers</li>
        </ol>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Click components in order from kubectl to running container.</p>,
  playground: (
    <>
      <K8sClusterSim />
      <TryThis>Trace: kubectl apply → API server → etcd → scheduler → kubelet → container runtime.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="High availability">
      <p className="prose">
        Production control planes run multiple API server/etcd instances behind load balancers. Worker nodes are
        expendable — workloads reschedule elsewhere when a node fails.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'control plane', def: 'API server, etcd, scheduler, controllers — cluster brains.' },
    { term: 'kubelet', def: 'Node agent that runs pod containers.' },
    { term: 'CRI', def: 'Container Runtime Interface — containerd, CRI-O.' },
    { term: 'etcd', def: 'Distributed store holding all Kubernetes object data.' },
  ],
  quiz: [
    q('Cluster state is stored in:', ['Git', 'etcd', 'nginx', 'Redis only'], 1),
    q('kubelet runs on:', ['Every worker node', 'Only laptops', 'Docker Hub', 'GitHub'], 0),
    q('The API server is:', ['The only entry point for kubectl and controllers', 'A container image registry', 'A CSS framework', 'A SQL database'], 0),
  ],
  recap: [
    <>API server + etcd + controllers on control plane; kubelet + runtime on nodes.</>,
    <>Follow the deploy path when debugging stuck rollouts.</>,
    <>HA control plane protects brains; design workloads to survive node loss.</>,
  ],
})

export const k8sWorkloads = createChapterLesson({
  id: 'k8s-workloads',
  modelTitle: 'Workloads',
  intro: (
    <>
      <p className="prose">
        The smallest unit Kubernetes schedules is a <strong>Pod</strong> — one or more containers sharing network
        and storage namespaces (sidecar pattern). You rarely create pods directly;{' '}
        <strong>controllers</strong> manage them.
      </p>
      <p className="prose">
        <strong>Deployments</strong> own ReplicaSets for stateless apps. <strong>StatefulSets</strong> give stable
        network IDs and disks. <strong>DaemonSets</strong> run one pod per node (agents). <strong>Jobs</strong>{' '}
        run to completion.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: web }\n  template:\n    metadata:\n      labels: { app: web }\n    spec:\n      containers:\n        - name: web\n          image: myapp:1.0\n          ports: [{ containerPort: 80 }]`}
      />
      <ul className="prose-list">
        <li>Deployment → ReplicaSet → Pods (rolling updates built-in)</li>
        <li>StatefulSet — ordered rollout, persistent identity per pod</li>
        <li>DaemonSet — logging/monitoring agents on every node</li>
        <li>Job / CronJob — batch and scheduled work</li>
      </ul>
      {simNote(
        <span>Scale replica slider; pods appear/disappear to match desired count.</span>,
        <span>Probes, resource requests/limits, and PDBs gate real rollouts.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'labels',
      title: 'Labels & selectors',
      content: (
        <p className="prose">
          Labels like <code>app=web</code> tie Deployments, Services, and NetworkPolicies together. Selectors must
          match pod template labels or traffic and scaling break silently.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Treat the slider as <code>kubectl scale deployment/web --replicas=N</code>.</p>,
  playground: (
    <>
      <K8sWorkloadSim />
      <TryThis>Scale to 0, then 4. Imagine which controller creates and deletes pod objects.</TryThis>
    </>
  ),
  terms: [
    { term: 'Pod', def: 'Smallest deployable unit — one or more shared containers.' },
    { term: 'Deployment', def: 'Declarative rolling updates for stateless apps.' },
    { term: 'ReplicaSet', def: 'Ensures N pod replicas match template.' },
    { term: 'StatefulSet', def: 'Pods with stable hostname and storage identity.' },
  ],
  quiz: [
    q('Deployments manage:', ['SQL schemas', 'Desired pod replica count', 'DNS registrars', 'Git branches'], 1),
    q('Pods are created directly by users:', ['Always', 'Usually via controllers like Deployment', 'Never', 'Only on Windows'], 1),
    q('DaemonSet ensures:', ['One pod per node', 'One pod total', 'No pods', 'Only Jobs'], 0),
  ],
  recap: [
    <>Pods run containers; Deployments keep the right number running.</>,
    <>Match labels between workload, Service, and policy selectors.</>,
    <>Pick StatefulSet when identity and disk order matter.</>,
  ],
})

export const k8sServices = createChapterLesson({
  id: 'k8s-services',
  modelTitle: 'Kubernetes Services',
  intro: (
    <>
      <p className="prose">
        Pod IPs are ephemeral — they change on every reschedule. A <strong>Service</strong> provides a stable
        virtual IP and DNS name (<code>web.default.svc.cluster.local</code>) that load-balances to{' '}
        <strong>ready</strong> pods matching label selectors.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>ClusterIP</strong> (default) — internal VIP only
        </li>
        <li>
          <strong>NodePort</strong> — opens a high port on every node
        </li>
        <li>
          <strong>LoadBalancer</strong> — cloud provisions external LB → NodePort/ClusterIP
        </li>
        <li>
          <strong>Headless</strong> (<code>clusterIP: None</code>) — DNS returns pod IPs directly (StatefulSet)
        </li>
      </ul>
      {simNote(
        <span>Switch service types and trace request paths in the diagram.</span>,
        <span>kube-proxy programs iptables/IPVS; cloud controllers create LBs.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'endpoints',
      title: 'Endpoints & readiness',
      content: (
        <p className="prose">
          Only pods passing <strong>readiness probes</strong> receive traffic via Endpoints. Liveness probes
          restart unhealthy containers; readiness removes them from Service rotation during slow startup.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Send a request through each service type and read the hop list.</p>,
  playground: (
    <>
      <K8sServiceSim />
      <TryThis>Switch ClusterIP → NodePort → LoadBalancer. Where does traffic enter the cluster?</TryThis>
    </>
  ),
  terms: [
    { term: 'ClusterIP', def: 'Internal virtual IP for in-cluster access.' },
    { term: 'selector', def: 'Labels tying a Service to matching pods.' },
    { term: 'Endpoints', def: 'List of pod IPs backing a Service.' },
    { term: 'kube-proxy', def: 'Node agent programming Service routing rules.' },
  ],
  quiz: [
    q('ClusterIP Services are reachable:', ['From the public internet by default', 'Inside the cluster', 'Only from etcd', 'Without pods'], 1),
    q('LoadBalancer type typically:', ['Provisions a cloud load balancer', 'Deletes pods', 'Disables DNS', 'Runs only on laptops'], 0),
    q('Readiness probes determine:', ['Whether a pod receives Service traffic', 'Git branch name', 'Image digest', 'Node OS version'], 0),
  ],
  recap: [
    <>Services stable-endpoint pods; types control how traffic enters.</>,
    <>Readiness gates traffic during startup and failures.</>,
    <>Headless Services expose individual pod DNS for stateful apps.</>,
  ],
})

export const k8sIngress = createChapterLesson({
  id: 'k8s-ingress',
  modelTitle: 'Ingress rules',
  intro: (
    <>
      <p className="prose">
        Exposing every microservice with its own LoadBalancer is expensive and messy. <strong>Ingress</strong>{' '}
        provides HTTP/HTTPS routing — host and path rules to Services — often with TLS termination at the edge.
      </p>
      <p className="prose">
        An <strong>ingress controller</strong> (nginx, traefik, AWS LB controller) watches Ingress resources and
        configures the data plane. <strong>cert-manager</strong> automates TLS certificates via Let&apos;s Encrypt.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: web\nspec:\n  rules:\n    - host: app.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80`}
      />
      <p className="prose">
        Ingress is <strong>L7</strong> (HTTP semantics). LoadBalancer Service is <strong>L4</strong> (TCP/UDP).
        Many clusters use Ingress (or Gateway API) + one external LB.
      </p>
      {simNote(
        <span>Edit host/path rules; toggle TLS to see HTTPS routing.</span>,
        <span>Controllers sync nginx/envoy config; cert-manager handles ACME challenges.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'gateway-api',
      title: 'Gateway API (next step)',
      content: (
        <p className="prose">
          Gateway API generalizes Ingress with role-oriented resources (Gateway, HTTPRoute). New clusters may adopt
          it, but the mental model — edge proxy routing by host/path — stays the same.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Change host and path rules; enable TLS to see HTTPS termination at ingress.</p>,
  playground: (
    <>
      <IngressSim />
      <TryThis>Route <code>api.example.com/v1</code> to a different backend than <code>/</code>. Try a path that returns 404.</TryThis>
    </>
  ),
  terms: [
    { term: 'Ingress', def: 'HTTP routing rules into the cluster.' },
    { term: 'ingress controller', def: 'Pod implementing Ingress (nginx, traefik, etc.).' },
    { term: 'TLS termination', def: 'Decrypt HTTPS at the edge proxy.' },
    { term: 'pathType', def: 'Prefix, Exact, or ImplementationSpecific matching.' },
  ],
  quiz: [
    q('Ingress typically routes:', ['HTTP host/path to Services', 'Disk volumes', 'Git commits', 'CPU interrupts'], 0),
    q('Ingress without a controller:', ['Does nothing useful', 'Auto-installs nginx', 'Creates pods', 'Replaces etcd'], 0),
    q('L7 vs L4 means:', ['HTTP vs TCP/UDP routing', 'Linux versions', 'Seven nodes', 'Four load balancers'], 0),
  ],
  recap: [
    <>Ingress = HTTP routing; controller implements rules + TLS.</>,
    <>One ingress can front many Services — cheaper than many LBs.</>,
    <>Pair with cert-manager for automated HTTPS certificates.</>,
  ],
})

export const k8sNetworking = createChapterLesson({
  id: 'k8s-networking',
  modelTitle: 'Cluster networking',
  intro: (
    <>
      <p className="prose">
        Every pod gets an IP from a <strong>pod CIDR</strong> per node. <strong>CNI plugins</strong> (Calico,
        Cilium, AWS VPC CNI) wire virtual interfaces and routes. <strong>CoreDNS</strong> resolves Service names
        cluster-wide.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>Pod CIDR — per-node pod IP ranges (e.g. 10.244.0.0/16)</li>
        <li>Service CIDR — virtual IPs for ClusterIP Services</li>
        <li>kube-proxy — forwards Service VIP → pod endpoints</li>
        <li>NetworkPolicy — optional firewall between pods/namespaces</li>
      </ul>
      {simNote(
        <span>DNS lookup simulator — click nslookup to resolve Service vs pod names.</span>,
        <span>CNI choice affects encryption, network policies, and cloud integration.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'dns-patterns',
      title: 'DNS patterns',
      content: (
        <CodePreview
          language="plaintext"
          code={`# Service (stable)\nweb.default.svc.cluster.local → ClusterIP\n\n# Pod (direct, often via headless service)\nweb-0.web.default.svc.cluster.local → 10.244.1.5`}
        />
      ),
    },
  ],
  playgroundIntro: <p className="prose">Enter a DNS name and click nslookup to see how CoreDNS would answer.</p>,
  playground: (
    <>
      <K8sNetworkingSim />
      <TryThis>
        Resolve <code>api.default.svc.cluster.local</code> vs a bare pod name. What differs in the answer?
      </TryThis>
    </>
  ),
  terms: [
    { term: 'CNI', def: 'Plugin assigning pod network interfaces and routes.' },
    { term: 'CoreDNS', def: 'In-cluster DNS for Services and pods.' },
    { term: 'NetworkPolicy', def: 'L3/L4 firewall rules between pods.' },
    { term: 'pod CIDR', def: 'IP range from which pod addresses are allocated per node.' },
  ],
  quiz: [
    q('Service DNS names end with:', ['.com', '.svc.cluster.local', '.docker', '.github'], 1),
    q('CNI plugins handle:', ['Pod IP assignment and routing', 'Git merges', 'CSS layout', 'SQL queries'], 0),
    q('NetworkPolicy can:', ['Restrict which pods may talk to each other', 'Build Docker images', 'Replace ingress', 'Delete etcd'], 0),
  ],
  recap: [
    <>Pods get ephemeral IPs; Services get stable DNS and cluster IPs.</>,
    <>Learn your CNI — it affects policies, observability, and cloud routing.</>,
    <>Use NetworkPolicy to default-deny and allow only required paths.</>,
  ],
})

export const k8sStorage = createChapterLesson({
  id: 'k8s-storage',
  modelTitle: 'Persistent storage',
  intro: (
    <>
      <p className="prose">
        Pod filesystems are ephemeral. Databases and uploads need <strong>PersistentVolumeClaims (PVCs)</strong>{' '}
        that bind to <strong>PersistentVolumes (PVs)</strong> or are <strong>dynamically provisioned</strong> via a{' '}
        <strong>StorageClass</strong>.
      </p>
      <p className="prose">
        <strong>CSI drivers</strong> connect Kubernetes to cloud disks (EBS, GCE PD, Azure Disk) and enterprise
        storage. Mount PVCs in pod specs as volumes — the same claim can reattach when a pod reschedules.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: pgdata\nspec:\n  accessModes: [ReadWriteOnce]\n  resources:\n    requests:\n      storage: 10Gi\n  storageClassName: gp3`}
      />
      <ul className="prose-list">
        <li>
          <strong>Access modes</strong> — RWO (one node), RWX (many), ROM (many readers)
        </li>
        <li>
          <strong>Reclaim policy</strong> — Retain vs Delete when PVC removed
        </li>
        <li>StatefulSet + volumeClaimTemplates — one PVC per pod identity</li>
      </ul>
      {simNote(
        <span>Apply PVC and watch binding animation static vs dynamic.</span>,
        <span>CSI snapshots, volume expansion, and zone-aware scheduling in cloud.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'stateful',
      title: 'StatefulSets & disks',
      content: (
        <p className="prose">
          StatefulSets create PVCs per pod (<code>data-web-0</code>, <code>data-web-1</code>) so each replica keeps
          its data across restarts. Rolling updates respect pod order.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Toggle static vs dynamic provisioning and watch PVC → PV binding.</p>,
  playground: (
    <>
      <K8sStorageSim />
      <TryThis>Switch provisioning mode. When would you pre-create a PV manually?</TryThis>
    </>
  ),
  terms: [
    { term: 'PVC', def: 'Pod request for storage capacity and access mode.' },
    { term: 'StorageClass', def: 'Template for dynamic volume provisioning.' },
    { term: 'CSI', def: 'Standard interface for storage plugins.' },
    { term: 'ReadWriteOnce', def: 'Volume mountable read-write by one node at a time.' },
  ],
  quiz: [
    q('PVC Bound means:', ['Git merged', 'Volume attached and ready to mount', 'Pod deleted', 'Ingress created'], 1),
    q('StorageClass enables:', ['Dynamic provisioning of PVs', 'Faster CSS', 'Git push', 'DNS only'], 0),
    q('StatefulSet volumeClaimTemplates:', ['Create one PVC per pod', 'Delete all data on restart', 'Replace Services', 'Disable networking'], 0),
  ],
  recap: [
    <>PVC requests storage; PV/StorageClass fulfill it; mount in pod spec.</>,
    <>Match access modes to workload — RWO for most databases.</>,
    <>StatefulSets pair stable identity with per-pod disks.</>,
  ],
})

export const k8sConfigSecrets = createChapterLesson({
  id: 'k8s-config-secrets',
  modelTitle: 'Config & secrets',
  intro: (
    <>
      <p className="prose">
        Twelve-factor apps read config from the environment. <strong>ConfigMaps</strong> hold non-secret settings;
        <strong> Secrets</strong> hold sensitive values (API keys, DB passwords). Mount either as environment
        variables or files in the pod filesystem.
      </p>
      <p className="prose">
        Secrets in etcd are <strong>base64-encoded, not encrypted</strong> by default — enable encryption at rest,
        restrict RBAC, and prefer external secret operators (Sealed Secrets, ESO) for GitOps.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <code>envFrom.configMapRef</code> — inject all keys as env vars
        </li>
        <li>
          <code>volumeMount</code> — project keys as files under <code>/etc/config</code>
        </li>
        <li>Updating ConfigMap does not auto-reload apps — restart pods or use watchers</li>
        <li>Never commit plain Secrets to git — use sealed/encrypted workflows</li>
      </ul>
      {simNote(
        <span>Toggle env vs volume mount and edit sample ConfigMap keys.</span>,
        <span>Encryption at rest, Vault integration, and rotation policies in production.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'gitops-secrets',
      title: 'Secrets in GitOps',
      content: (
        <p className="prose">
          <strong>Sealed Secrets</strong> encrypts Secret data so only the cluster can decrypt.{' '}
          <strong>External Secrets Operator</strong> syncs from AWS SM / GCP SM / Vault into Kubernetes Secrets.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Edit ConfigMap values and switch mount style to see how apps receive config.</p>,
  playground: (
    <>
      <ConfigSecretsSim />
      <TryThis>Switch env vs file mount. Change LOG_LEVEL in the ConfigMap — would a running pod see it without restart?</TryThis>
    </>
  ),
  terms: [
    { term: 'ConfigMap', def: 'Key-value config decoupled from images.' },
    { term: 'Secret', def: 'Sensitive data; protect with RBAC and encryption at rest.' },
    { term: 'envFrom', def: 'Bulk inject ConfigMap/Secret keys as environment variables.' },
    { term: 'Sealed Secret', def: 'Encrypted Secret safe to store in git.' },
  ],
  quiz: [
    q('Kubernetes Secrets in etcd are:', ['Encrypted by default in all clusters', 'Often base64-encoded, not secret alone', 'Public on GitHub', 'Same as TLS certs'], 1),
    q('ConfigMaps should hold:', ['Non-sensitive configuration', 'Private keys only', 'Docker images', 'Node kernels'], 0),
    q('Volume mount style is useful when:', ['Apps expect config files on disk', 'You need faster DNS', 'You delete pods', 'You disable RBAC'], 0),
  ],
  recap: [
    <>ConfigMaps for config; Secrets for credentials — protect with RBAC and encryption at rest.</>,
    <>Prefer file mounts for apps that hot-reload config files.</>,
    <>Use sealed/external secrets for GitOps — never plain secrets in repos.</>,
  ],
})

export const k8sCommands = createChapterLesson({
  id: 'k8s-commands',
  modelTitle: 'Essential kubectl',
  intro: (
    <>
      <p className="prose">
        <code>kubectl</code> is the CLI for the Kubernetes API. Day-one skills: list resources, describe details,
        apply manifests, stream logs, exec debug shells, scale replicas, and watch rollouts.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`kubectl get pods -o wide\nkubectl describe deploy web\nkubectl apply -f deploy.yaml\nkubectl logs deploy/web -f\nkubectl exec -it deploy/web -- sh\nkubectl scale deploy web --replicas=5\nkubectl rollout status deploy/web\nkubectl rollout undo deploy/web`}
      />
      <Callout kind="tip" title="Context & namespace">
        <code>kubectl config get-contexts</code> switches clusters; <code>-n staging</code> targets a namespace.
        Use <code>kubectl get all</code> cautiously — it is not everything, but a quick overview.
      </Callout>
      {simNote(
        <span>Wasmer shell with simulated kubectl, or React KubectlLab fallback.</span>,
        <span>Real kubectl talks HTTPS to API server with kubeconfig credentials.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'debug-flow',
      title: 'Debug workflow',
      content: (
        <ol className="prose-list">
          <li>
            <code>kubectl get pods</code> — status CrashLoopBackOff?
          </li>
          <li>
            <code>kubectl describe pod</code> — events at the bottom
          </li>
          <li>
            <code>kubectl logs</code> — app stderr; add <code>--previous</code> for last crash
          </li>
          <li>
            <code>kubectl exec</code> — curl DNS, check files, run migrations
          </li>
        </ol>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Practice get/scale/logs against simulated cluster state. Commands persist under <code>/var/lab</code>.
    </p>
  ),
  playground: (
    <>
      <ContainerShell fallback={<KubectlLab />} hint="kubectl get pods, kubectl scale deploy web --replicas=3, kubectl logs web" />
      <TryThis>
        Run <code>kubectl get pods</code>, <code>kubectl scale deploy web --replicas=3</code>, then{' '}
        <code>kubectl get pods</code> again. Fetch logs for a pod name.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'kubectl apply', def: 'Declarative create/update from YAML.' },
    { term: 'rollout', def: 'Manage Deployment update progress and undo.' },
    { term: 'kubeconfig', def: 'File with cluster URL, credentials, and context.' },
    { term: 'describe', def: 'Human-readable details plus recent events.' },
  ],
  quiz: [
    q('kubectl apply is:', ['Imperative only', 'Declarative — desired state in YAML', 'A Docker command', 'A SQL statement'], 1),
    q('CrashLoopBackOff debug starts with:', ['Deleting the cluster', 'kubectl describe pod and logs', 'Formatting disk', 'Disabling DNS'], 1),
    q('kubectl scale changes:', ['Replica count on a controller', 'Git remotes', 'Image registry URL', 'Node kernel'], 0),
  ],
  recap: [
    <>get/describe for inspect; apply for deploy; logs/exec for debug.</>,
    <>rollout status/undo for deployment safety.</>,
    <>Always check namespace and context before destructive commands.</>,
  ],
})

export const k8sNodes = createChapterLesson({
  id: 'k8s-nodes',
  modelTitle: 'Node operations',
  intro: (
    <>
      <p className="prose">
        Worker nodes run kubelet and your pods. Maintenance requires draining workloads safely.{' '}
        <strong>Taints</strong> repel pods unless they have matching <strong>tolerations</strong> — useful for
        GPU nodes, system daemons, or dedicated tenancy.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <code>kubectl cordon node-1</code> — no new pods scheduled
        </li>
        <li>
          <code>kubectl drain node-1</code> — evict workloads (respects PDBs in real clusters)
        </li>
        <li>
          <code>kubectl uncordon node-1</code> — allow scheduling again
        </li>
        <li>Taint example: <code>gpu=true:NoSchedule</code> + toleration on GPU jobs</li>
      </ul>
      {simNote(
        <span>Cordon/drain simulation on a two-node cluster.</span>,
        <span>PDBs, grace periods, and daemonsets affect what drain can evict.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'pdb',
      title: 'PodDisruptionBudgets',
      content: (
        <p className="prose">
          A <strong>PDB</strong> ensures at least N pods stay available during voluntary disruptions (node
          upgrades). Drain stops if evicting would violate the budget — plan maintenance windows accordingly.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Cordon a node, drain pods, and observe scheduling stop on that node.</p>,
  playground: (
    <>
      <K8sNodeSim />
      <TryThis>Cordon node-1, drain it, then uncordon. Which pods moved?</TryThis>
    </>
  ),
  terms: [
    { term: 'cordon', def: 'Mark node unschedulable for new pods.' },
    { term: 'drain', def: 'Evict existing pods from a node for maintenance.' },
    { term: 'taint', def: 'Repels pods unless they tolerate the taint key/value/effect.' },
    { term: 'PDB', def: 'Limits voluntary disruptions to protected workloads.' },
  ],
  quiz: [
    q('drain is used before:', ['Writing CSS', 'Node maintenance / upgrade', 'git commit', 'JSON parse'], 1),
    q('cordon prevents:', ['New pods scheduling on the node', 'All DNS', 'Image pulls', 'Git pushes'], 0),
    q('Taints and tolerations:', ['Steer specialized workloads to specific nodes', 'Encrypt secrets', 'Build images', 'Replace ingress'], 0),
  ],
  recap: [
    <>Cordon + drain for safe maintenance; uncordon when done.</>,
    <>Use taints/tolerations for dedicated hardware pools.</>,
    <>Define PDBs so drains do not take down critical services.</>,
  ],
})

export const k8sOperatorsBuiltin = createChapterLesson({
  id: 'k8s-operators-builtin',
  modelTitle: 'Reconciliation loops',
  intro: (
    <>
      <p className="prose">
        Kubernetes controllers are infinite loops: <strong>observe</strong> current state,{' '}
        <strong>compare</strong> to desired spec, <strong>act</strong> to close the gap, repeat. The Deployment
        controller ensures pod count matches replicas; the Node controller marks nodes unhealthy.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview language="plaintext" code={`observe → diff(desired, actual) → act → sleep → repeat`} />
      <p className="prose">
        Built-in controllers live in <code>kube-controller-manager</code>: ReplicaSet, Deployment, StatefulSet,
        DaemonSet, Job, Namespace, and more.
      </p>
      {simNote(
        <span>Change replicas and read controller event lines in the log.</span>,
        <span>Leader election ensures one active controller per type in HA setups.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'level-triggered',
      title: 'Level-triggered vs edge-triggered',
      content: (
        <p className="prose">
          Controllers are <strong>level-triggered</strong> — they reconcile toward desired state even if they miss
          an event. That is why you can delete a pod manually and the ReplicaSet recreates it.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Adjust desired replicas and watch the built-in controller log its reconcile steps.</p>,
  playground: (
    <>
      <K8sOperatorSim mode="builtin" />
      <TryThis>Change replicas from 2 → 5. Which log lines show create vs delete actions?</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Built-in controllers">
      <p className="prose">
        ReplicaSet, Deployment, StatefulSet, DaemonSet, and Job controllers all share the same reconcile pattern
        inside controller-manager.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'reconciliation', def: 'Continuously matching cluster state to spec.' },
    { term: 'controller', def: 'Control loop watching API objects of a kind.' },
    { term: 'informers', def: 'Efficient watches feeding controller caches.' },
    { term: 'level-triggered', def: 'Reconcile toward desired state, not single events.' },
  ],
  quiz: [
    q('Deployment controller creates:', ['SQL tables', 'Pods to match replicas', 'Git tags', 'Docker images'], 1),
    q('If you delete a pod managed by Deployment:', ['It stays gone', 'Controller recreates it', 'Cluster shuts down', 'etcd deletes'], 1),
    q('Controllers run in:', ['kube-controller-manager', 'containerd only', 'GitHub Actions', 'CSS files'], 0),
  ],
  recap: [
    <>Controllers are control loops; Deployments are the workhorse for stateless apps.</>,
    <>Manual pod deletes are corrected — desired state wins.</>,
    <>Understanding reconcile helps debug stuck rollouts.</>,
  ],
})

export const k8sOperatorsCustom = createChapterLesson({
  id: 'k8s-operators-custom',
  modelTitle: 'Custom operators',
  intro: (
    <>
      <p className="prose">
        Some applications need domain-specific automation — certificate renewal, database failover, backup
        schedules. <strong>Custom Resource Definitions (CRDs)</strong> extend the Kubernetes API;{' '}
        <strong>operators</strong> are controllers for those types.
      </p>
      <p className="prose">
        You declare a high-level resource (<code>Certificate</code>, <code>PostgresCluster</code>); the operator
        creates Deployments, Services, PVCs, and Jobs underneath.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>cert-manager — TLS certificates from Let&apos;s Encrypt</li>
        <li>prometheus-operator — monitoring stack components</li>
        <li>Cloud-specific operators — RDS, message queues, etc.</li>
      </ul>
      {simNote(
        <span>Watch operator create child resources from a CRD claim.</span>,
        <span>Kubebuilder/Operator SDK scaffold Go controllers; OLM bundles for install.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'crd-example',
      title: 'CRD mental model',
      content: (
        <CodePreview
          language="plaintext"
          code={`apiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: web-tls\nspec:\n  secretName: web-tls\n  issuerRef:\n    name: letsencrypt-prod`}
        />
      ),
    },
  ],
  playgroundIntro: <p className="prose">Submit a custom resource and read which child objects the operator creates.</p>,
  playground: (
    <>
      <K8sOperatorSim mode="custom" />
      <TryThis>Apply the sample CRD instance. List Deployment, Service, and Secret the operator created.</TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Operator Framework">
      <p className="prose">
        Kubebuilder and Operator SDK scaffold controllers; Helm can package operators; OLM manages lifecycle in
        OpenShift and some enterprise clusters.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'CRD', def: 'Custom Resource Definition — new API type in Kubernetes.' },
    { term: 'operator', def: 'Controller encoding domain knowledge for a CRD.' },
    { term: 'OLM', def: 'Operator Lifecycle Manager — install/upgrade operators.' },
    { term: 'day-2 operations', def: 'Backups, upgrades, failover — operator sweet spot.' },
  ],
  quiz: [
    q('Custom operators package:', ['Domain knowledge as code', 'Only CSS', 'Only git hooks', 'VM hypervisors'], 0),
    q('CRDs extend:', ['The Kubernetes API with new object kinds', 'Dockerfile syntax', 'Git branches', 'CSS selectors'], 0),
    q('cert-manager is an example of:', ['An operator for TLS certificates', 'A container runtime', 'A load test tool', 'A SQL database'], 0),
  ],
  recap: [
    <>CRD + controller = operator; automates complex day-2 operations.</>,
    <>Prefer maintained operators over bespoke shell scripts in clusters.</>,
    <>Operators still need RBAC, upgrades, and monitoring like any workload.</>,
  ],
})

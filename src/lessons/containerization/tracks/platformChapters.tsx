import { createChapterLesson } from '../../components/ChapterLesson.tsx'
import { Callout, TryThis, UnderTheHood } from '../../components/blocks.tsx'
import { PlatformCompare } from '../sims/PlatformCompare.tsx'
import { ContainerCapstoneSim } from '../sims/ContainerCapstoneSim.tsx'
import { ContainerShell } from '../sims/ContainerShell.tsx'
import { DockerCliSim } from '../sims/DockerCliSim.tsx'
import { Link } from 'react-router-dom'
import { q, simNote } from '../shared.tsx'

export const platformsManagedK8s = createChapterLesson({
  id: 'platforms-managed-k8s',
  modelTitle: 'Managed Kubernetes',
  intro: (
    <>
      <p className="prose">
        Running your own Kubernetes control plane means patching etcd, securing the API server, and on-call for
        quorum loss. <strong>Managed Kubernetes</strong> (EKS, GKE, AKS) offloads the control plane: you manage
        node pools, workloads, IAM, and add-ons; the cloud runs API server and etcd with an SLA.
      </p>
      <p className="prose">
        Each cloud adds integrations — IRSA on AWS for pod IAM roles, Workload Identity on GKE, Azure AD on AKS
        — so applications access cloud APIs without long-lived keys on disk.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>EKS</strong> — AWS; Fargate or EC2 nodes; tight VPC and IAM integration
        </li>
        <li>
          <strong>GKE</strong> — Autopilot (Google manages nodes) vs Standard (you pick node pools)
        </li>
        <li>
          <strong>AKS</strong> — Azure; integrates with AAD, Azure Monitor, and Container Registry
        </li>
      </ul>
      <Callout kind="tip" title="You still own">
        Node sizing, cluster upgrades, network policies, cost monitoring, and workload manifests — managed does
        not mean hands-off.
      </Callout>
      {simNote(
        <span>Compare control plane ownership and node options in the table.</span>,
        <span>Real clusters bill for control plane hours, node VMs, load balancers, and egress.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'node-strategy',
      title: 'Node strategy',
      content: (
        <p className="prose">
          Choose instance types for workload shape (CPU vs memory), use separate node pools for system vs app
          workloads, and enable cluster autoscaler so nodes join when pods are pending. Spot/preemptible nodes
          cut cost for fault-tolerant batch work.
        </p>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">Select each managed offering and compare who runs the control plane, nodes, and IAM integration.</p>
  ),
  playground: (
    <>
      <PlatformCompare keys={['eks', 'gke', 'aks']} />
      <TryThis>
        For each platform, list one advantage and one thing you still configure yourself (nodes, IAM, ingress,
        etc.).
      </TryThis>
    </>
  ),
  terms: [
    { term: 'managed control plane', def: 'Cloud runs API server/etcd; you pay for uptime SLA.' },
    { term: 'node pool', def: 'Group of worker nodes with shared configuration.' },
    { term: 'IRSA', def: 'AWS IAM Roles for Service Accounts — short-lived creds for pods.' },
    { term: 'cluster autoscaler', def: 'Adds/removes nodes based on pending pods.' },
  ],
  quiz: [
    q('EKS stands for:', ['Elastic Kubernetes Service', 'Every Key Stores', 'External Key System', 'Event Queue Service'], 0),
    q('Managed Kubernetes means:', ['You never touch YAML', 'Cloud runs control plane; you run workloads', 'No nodes exist', 'Docker Desktop only'], 1),
    q('GKE Autopilot:', ['Google manages node provisioning', 'Disables pods', 'Replaces Docker', 'Is only on-prem'], 0),
  ],
  recap: [
    <>Managed k8s offloads control plane ops; you still own workloads, networking, and cost.</>,
    <>Pick cloud based on existing IAM, registry, and observability stack.</>,
    <>Plan node pools and autoscaling early — they drive bill and reliability.</>,
  ],
})

export const platformsEcsRancher = createChapterLesson({
  id: 'platforms-ecs-rancher',
  modelTitle: 'Platform choices',
  intro: (
    <>
      <p className="prose">
        Kubernetes is not the only answer. <strong>Amazon ECS</strong> runs containers with task definitions and
        services — simpler mental model, deep AWS integration, no kubectl. <strong>Rancher</strong> manages many
        Kubernetes clusters with UI, RBAC, and app catalogs. <strong>Docker Desktop</strong> gives developers
        local Kubernetes and compose on macOS/Windows.
      </p>
      <p className="prose">
        Choose based on team skills, cloud lock-in tolerance, and operational surface area — not hype.
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>ECS</strong> — task = one or more containers; service maintains desired count; ALB integration
        </li>
        <li>
          <strong>Fargate</strong> — serverless tasks; no EC2 to patch
        </li>
        <li>
          <strong>Rancher</strong> — multi-cluster UI, RBAC, fleet GitOps patterns
        </li>
        <li>
          <strong>Docker Desktop</strong> — local k8s/compose; not for production
        </li>
      </ul>
      {simNote(
        <span>Platform comparison table with ECS vs k8s vs Desktop highlights.</span>,
        <span>ECS uses AWS APIs; Rancher installs on existing clusters; Desktop uses a Linux VM on Mac/Win.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'when-ecs',
      title: 'When ECS wins',
      content: (
        <p className="prose">
          All-in on AWS, small platform team, mostly stateless services behind ALB — ECS plus Fargate minimizes
          moving parts. Need portable manifests, operators, or multi-cloud — Kubernetes ecosystem pays off despite
          complexity.
        </p>
      ),
    },
  ],
  playgroundIntro: <p className="prose">Compare ECS task model with Kubernetes Pod/Deployment and note operational differences.</p>,
  playground: (
    <>
      <PlatformCompare keys={['ecs', 'rancher', 'desktop']} />
      <TryThis>
        Map ECS <em>task definition</em> → k8s <em>Pod spec</em> and ECS <em>service</em> → k8s{' '}
        <em>Deployment</em> in your own words.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'ECS task', def: 'One or more containers launched together on AWS.' },
    { term: 'Rancher', def: 'Multi-cluster Kubernetes management platform.' },
    { term: 'Fargate', def: 'Serverless compute for ECS/EKS without managing EC2.' },
    { term: 'task definition', def: 'JSON spec for CPU, memory, images, and env in ECS.' },
  ],
  quiz: [
    q('ECS uses:', ['kubectl as primary API', 'Task definitions and services', 'Only VMs', 'MongoDB only'], 1),
    q('Docker Desktop is for:', ['Production multi-region clusters', 'Local development', 'Replacing EKS control plane', 'etcd backups'], 1),
    q('Rancher helps with:', ['Managing multiple Kubernetes clusters', 'Writing Dockerfiles only', 'CSS layout', 'SQL queries'], 0),
  ],
  recap: [
    <>Pick ECS for AWS simplicity; Rancher for multi-cluster k8s ops; Desktop for local dev.</>,
    <>Same container images run everywhere — orchestrator choice is operational, not app-code.</>,
    <>Fargate trades node management for per-task pricing — model cost early.</>,
  ],
})

export const containerCapstone = createChapterLesson({
  id: 'container-capstone',
  modelTitle: 'End-to-end flow',
  intro: (
    <>
      <p className="prose">
        Shipping a feature touches every layer: Dockerfile → CI build → registry → local compose test → Kubernetes
        manifest → rolling rollout → smoke test. This capstone walks the <strong>vertical slice</strong> so you
        see how lessons connect (see also <Link to="/lessons/cicd">CI/CD</Link>).
      </p>
      <p className="prose">
        In production, automate each gate — image scan, integration tests on compose, progressive delivery with
        readiness probes, and GitOps reconciliation from manifest repos.
      </p>
    </>
  ),
  model: (
    <>
      <ol className="prose-list">
        <li>
          <strong>Build</strong> — <code>docker build -t registry/myapp:$GIT_SHA .</code> in CI
        </li>
        <li>
          <strong>Push</strong> — immutable tag in GHCR/ECR
        </li>
        <li>
          <strong>Integrate</strong> — <code>docker compose up</code> runs API + DB tests
        </li>
        <li>
          <strong>Deploy</strong> — <code>kubectl apply -f deploy.yaml</code> updates Deployment image
        </li>
        <li>
          <strong>Verify</strong> — <code>kubectl rollout status</code> + HTTP smoke test
        </li>
      </ol>
      {simNote(
        <span>Step-through simulator with commands per phase; shell lab for docker/compose/kubectl.</span>,
        <span>Argo CD/Flux reconcile git; cloud deploy pipelines add approvals and canaries.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'rollback',
      title: 'Rollback plan',
      content: (
        <p className="prose">
          Keep previous image digests handy. <code>kubectl rollout undo deployment/web</code> reverts to the last
          ReplicaSet. In CI, failing smoke tests should block promotion and alert on-call — never debug production
          only via SSH.
        </p>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Click through each shipping phase and note the command you would run. Then practice build/compose/kubectl in
      the shell.
    </p>
  ),
  playground: (
    <>
      <ContainerCapstoneSim />
      <ContainerShell
        fallback={<DockerCliSim />}
        hint="docker build -t myapp:1.0 ., docker compose up -d, kubectl get pods"
      />
      <TryThis>
        Complete all capstone steps in the simulator, then run <code>docker build</code>,{' '}
        <code>docker compose up -d</code>, and <code>kubectl get pods</code> in the shell.
      </TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="GitOps">
      <p className="prose">
        Many teams store manifests in git; Argo CD or Flux reconcile cluster state from the repo — same declarative
        idea as <code>kubectl apply</code>, with audit trail and drift detection.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'vertical slice', def: 'End-to-end path through all layers for one feature.' },
    { term: 'rolling update', def: 'Replace pods gradually with a new image version.' },
    { term: 'smoke test', def: 'Minimal post-deploy check that critical paths work.' },
    { term: 'GitOps', def: 'Git as source of truth for desired cluster state.' },
  ],
  quiz: [
    q('First step in the capstone flow:', ['kubectl delete all', 'Build and push image', 'Drop database', 'Disable TLS'], 1),
    q('docker compose up in CI typically:', ['Runs integration tests against real services', 'Replaces git', 'Deletes the registry', 'Patches etcd'], 0),
    q('kubectl rollout undo:', ['Reverts to previous Deployment revision', 'Deletes the cluster', 'Stops Docker Desktop', 'Removes compose files'], 0),
  ],
  recap: [
    <>Image → registry → compose test → manifest → rollout → smoke test.</>,
    <>Automate gates in CI; keep rollbacks one command away.</>,
    <>GitOps extends kubectl apply with continuous reconciliation from git.</>,
  ],
})

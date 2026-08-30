import { Link } from 'react-router-dom'
import { createChapterLesson } from '../../components/ChapterLesson.tsx'
import { Callout, TryThis, UnderTheHood, CodePreview } from '../../components/blocks.tsx'
import { COI_TROUBLESHOOTING } from '../../../lib/crossOriginIsolation.ts'
import { VmContainerCompare } from '../sims/VmContainerCompare.tsx'
import { ImageLayersSim } from '../sims/ImageLayersSim.tsx'
import { DockerCliSim } from '../sims/DockerCliSim.tsx'
import { ContainerShell } from '../sims/ContainerShell.tsx'
import { DockerfileEditorSim } from '../sims/DockerfileEditorSim.tsx'
import { DockerNetworkSim } from '../sims/DockerNetworkSim.tsx'
import { DockerVolumeSim } from '../sims/DockerVolumeSim.tsx'
import { q, simNote } from '../shared.tsx'

export const containerIntro = createChapterLesson({
  id: 'container-intro',
  modelTitle: 'VMs vs containers',
  intro: (
    <>
      <p className="prose">
        You ship code to a server and it fails with &ldquo;works on my machine.&rdquo; The classic fix was a{' '}
        <strong>virtual machine (VM)</strong> — a full guest OS on a hypervisor — so every environment looked
        identical. VMs are reliable but heavy: each one boots an entire OS and reserves CPU/RAM you might not
        use.
      </p>
      <p className="prose">
        <strong>Containers</strong> solve the same portability problem with a lighter model: processes isolated by
        Linux <em>namespaces</em> and <em>cgroups</em>, sharing the host kernel. They start in seconds, pack
        densely on the same host, and travel as immutable <strong>images</strong>. See also{' '}
        <Link to="/lessons/compute">Compute Instances</Link> for when you scale from one container to many.
      </p>
    </>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        A container image is a <strong>portable package</strong> — your app plus libraries and config — that runs
        the same on a laptop, CI runner, or cloud VM.
      </Callout>
      <ul className="prose-list">
        <li>
          <strong>VM stack:</strong> app → guest OS → hypervisor → host OS → hardware
        </li>
        <li>
          <strong>Container stack:</strong> app → container runtime → host kernel → hardware
        </li>
        <li>
          <strong>Image vs container:</strong> an image is the read-only template; a container is a running
          instance with a thin writable layer on top
        </li>
      </ul>
      {simNote(
        <span>Side-by-side stack diagram toggling VM vs container boot time and isolation.</span>,
        <span>containerd/CRI-O, cgroups v2, and seccomp/AppArmor policies on real hosts.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'when-containers',
      title: 'When containers win',
      content: (
        <>
          <p className="prose">
            Containers excel at <strong>stateless microservices</strong>, CI build agents, and local dev stacks
            where you need identical dependencies fast. VMs still matter for strong kernel isolation, legacy
            monoliths expecting a full OS, or regulated workloads requiring separate kernels.
          </p>
          <Callout kind="tip" title="Mental model">
            Think &ldquo;process with its own filesystem view&rdquo; rather than &ldquo;mini computer.&rdquo;
          </Callout>
        </>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Toggle between VM and container stacks. Notice boot time, memory footprint, and what layer provides
      isolation in each model.
    </p>
  ),
  playground: (
    <>
      <VmContainerCompare />
      <TryThis>
        Toggle VM vs container three times. Which stack has more layers between your app and the hardware?
      </TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Browser labs & cross-origin isolation">
      <p className="prose">
        Shell labs in later chapters use Wasmer in the browser, which needs <code>SharedArrayBuffer</code> and
        therefore <strong>cross-origin isolation</strong> (COOP/COEP). GitHub Pages uses{' '}
        <code>coi-serviceworker</code> to enable this.{' '}
        <a href={COI_TROUBLESHOOTING} target="_blank" rel="noreferrer">
          Troubleshooting guide
        </a>
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'container image', def: 'Read-only template built from stacked layers (OS libs + app).' },
    { term: 'container', def: 'Running instance of an image with an ephemeral writable layer.' },
    { term: 'OCI', def: 'Open Container Initiative — standards for images and runtimes.' },
    { term: 'namespace', def: 'Kernel feature isolating process views of IDs, network, mounts, etc.' },
    { term: 'cgroup', def: 'Kernel feature limiting and accounting CPU, memory, and I/O per group.' },
  ],
  quiz: [
    q(
      'Containers vs VMs — containers typically:',
      ['Include a full guest OS', 'Share the host kernel', 'Boot in minutes', 'Cannot run on Linux'],
      1,
      'Containers isolate processes but reuse the host kernel; VMs virtualize hardware and run a guest OS.',
    ),
    q('An image is:', ['A running process', 'An immutable template', 'A git branch', 'A load balancer'], 1),
    q(
      'Why are containers faster to start than VMs?',
      ['They skip the hypervisor and guest OS boot', 'They use faster CPUs', 'They disable networking', 'They run only JavaScript'],
      0,
    ),
  ],
  recap: [
    <>Containers package apps with dependencies; lighter and faster to start than VMs.</>,
    <>Images are immutable templates; containers are running instances with a writable layer.</>,
    <>Pick VMs when you need a separate kernel; pick containers for dense, portable workloads.</>,
  ],
})

export const dockerImages = createChapterLesson({
  id: 'docker-images',
  modelTitle: 'Images & registries',
  intro: (
    <>
      <p className="prose">
        Shipping a tarball of your app is fragile — you forget a library or pin the wrong Node version. A{' '}
        <strong>Docker image</strong> captures everything the process needs in ordered <strong>layers</strong>,
        built from a <code>Dockerfile</code> and identified by a <strong>tag</strong> (e.g.{' '}
        <code>myapp:1.2</code>) or immutable <strong>digest</strong> (content hash).
      </p>
      <p className="prose">
        Registries (Docker Hub, GHCR, ECR, GCR) store and distribute images. CI builds once, pushes to a
        registry, and every environment pulls the same artifact — no more &ldquo;SSH and apt install on
        prod.&rdquo;
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`# Typical workflow\ndocker build -t myregistry/myapp:1.2 .\ndocker push myregistry/myapp:1.2\ndocker pull myregistry/myapp:1.2`}
      />
      <ul className="prose-list">
        <li>
          <code>docker build -t name:tag .</code> — send build context (current directory) to the daemon
        </li>
        <li>
          <strong>Layer cache</strong> — if a Dockerfile line and its inputs are unchanged, rebuild skips that
          step
        </li>
        <li>
          <code>.dockerignore</code> — exclude <code>node_modules</code>, <code>.git</code>, secrets from the
          context tarball
        </li>
        <li>
          <strong>Multi-arch</strong> — manifest lists let one tag point at arm64 and amd64 images (buildx in
          production)
        </li>
      </ul>
      {simNote(
        <span>Step through Dockerfile lines as cached layers; shell lab builds a sample image in ~/lab.</span>,
        <span>BuildKit/buildx, SBOM scanning, and signing with cosign in real pipelines.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'tags-digests',
      title: 'Tags vs digests',
      content: (
        <p className="prose">
          Tags are mutable pointers — <code>latest</code> can change tomorrow. Digests like{' '}
          <code>sha256:abc…</code> are content-addressed and ideal for production deploys and security audits.
          Pin digests in Kubernetes manifests when you need reproducible rollouts.
        </p>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      First, step through Dockerfile lines to see how layer caching works. Then use the shell lab to run a real{' '}
      <code>docker build</code> against the sample app in <code>~/lab</code>.
    </p>
  ),
  playground: (
    <>
      <ImageLayersSim />
      <ContainerShell fallback={<DockerCliSim />} hint="docker build -t myapp:1.0 ., docker images" />
      <TryThis>
        In the layer sim, rebuild after changing only the last line — earlier layers stay cached. In the shell,
        run <code>docker build -t myapp:1.0 .</code> then <code>docker images</code>.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'layer', def: 'Filesystem diff created by each Dockerfile instruction; stacked read-only.' },
    { term: 'tag', def: 'Human-readable label for an image (mutable).' },
    { term: 'digest', def: 'Immutable SHA256 content address of an image manifest.' },
    { term: 'registry', def: 'Remote store for images (Hub, ECR, GHCR, GCR).' },
    { term: 'build context', def: 'Files sent to the daemon when you run docker build.' },
  ],
  quiz: [
    q('docker build creates:', ['A running container', 'An image from a Dockerfile', 'A git tag', 'A PVC'], 1),
    q(
      'Layer caching helps because:',
      ['It encrypts images', 'Unchanged steps skip rebuild work', 'It removes the need for a registry', 'It replaces kubectl'],
      1,
    ),
    q(
      '.dockerignore is similar to:',
      ['.gitignore for the build context', 'A Kubernetes Secret', 'A compose override file', 'A TLS certificate'],
      0,
    ),
  ],
  recap: [
    <>Dockerfile instructions → stacked layers → tag → push to registry → pull anywhere.</>,
    <>Cache layers aggressively by ordering slow steps (dependency install) before frequently changing files.</>,
    <>Pin digests in production; use tags for human-friendly CI promotion.</>,
  ],
})

export const dockerContainers = createChapterLesson({
  id: 'docker-containers',
  modelTitle: 'Container lifecycle',
  intro: (
    <>
      <p className="prose">
        An image is inert until you <code>docker run</code> it. That creates a <strong>container</strong> — a
        process (or tree of processes) with its own filesystem view, network namespace, and resource limits.
        Map host ports with <code>-p</code>, inject config with <code>-e</code>, and name instances with{' '}
        <code>--name</code> so scripts can target them reliably.
      </p>
      <p className="prose">
        Day-two operations matter: <code>docker ps</code> lists running instances, <code>docker logs</code>{' '}
        streams stdout/stderr, <code>docker exec</code> opens a shell inside a running container, and{' '}
        <code>docker stop</code> / <code>docker rm</code> clean up. Without volumes, anything written inside the
        container layer is lost when the container is removed.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`docker run -d --name web -p 8080:80 -e NODE_ENV=prod myapp:1.0\ndocker ps\ndocker logs -f web\ndocker exec -it web sh\ndocker inspect web --format '{{.State.Status}}'\ndocker stop web && docker rm web`}
      />
      <Callout kind="tip" title="Flags you will use daily">
        <code>-d</code> detached (background), <code>-p host:container</code> publish ports, <code>-e</code> env
        vars, <code>--restart unless-stopped</code> for daemons on servers.
      </Callout>
      {simNote(
        <span>Wasmer bash in ~/lab with simulated docker CLI, or React fallback when isolation is unavailable.</span>,
        <span>containerd/dockerd, OCI runtime spec, cgroups, and container networking plugins.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'lifecycle-states',
      title: 'Lifecycle states',
      content: (
        <ul className="prose-list">
          <li>
            <strong>created → running → paused/stopped → removed</strong> — inspect with{' '}
            <code>docker inspect</code>
          </li>
          <li>
            Exit code non-zero? Check <code>docker logs</code> and whether the main process (PID 1) exited
          </li>
          <li>
            <code>docker run --rm</code> auto-removes the container when the process exits — great for one-off
            commands
          </li>
        </ul>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      The shell starts in <code>~/lab</code> with a sample Node app and Dockerfile. Build before you run — the
      simulator tracks image and container state under <code>/var/lab</code>.
    </p>
  ),
  playground: (
    <>
      <ContainerShell fallback={<DockerCliSim />} />
      <TryThis>
        Run <code>ls</code> and <code>cat Dockerfile</code>, then{' '}
        <code>docker build -t myapp:1.0 .</code>, <code>docker run -d myapp:1.0</code>, and{' '}
        <code>docker ps</code>. Try <code>docker run myapp:1.0</code> <em>before</em> building — read the error.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'docker run', def: 'Create and start a container from an image.' },
    { term: 'port mapping', def: '-p host:container publishes a container port on the host.' },
    { term: 'detached', def: '-d runs the container in the background.' },
    { term: 'docker exec', def: 'Run a command in a running container (debugging, migrations).' },
    { term: 'PID 1', def: 'First process in the container; should handle signals and reap zombies.' },
  ],
  quiz: [
    q('docker run creates:', ['Only an image', 'A running container', 'A Kubernetes Pod', 'An ingress'], 1),
    q('-p 8080:80 maps:', ['Container 8080 to host 80', 'Host 8080 to container 80', 'Only UDP', 'etcd port'], 1),
    q(
      'Which command opens an interactive shell inside a running container?',
      ['docker attach', 'docker exec -it NAME sh', 'docker build', 'docker network ls'],
      1,
    ),
  ],
  recap: [
    <>Workflow: build image → run → ps/logs/exec → stop → rm.</>,
    <>Container filesystem is ephemeral unless you attach volumes (next chapters).</>,
    <>Name containers and publish ports explicitly — scripts and teammates depend on stable identifiers.</>,
  ],
})

export const dockerDockerfile = createChapterLesson({
  id: 'docker-dockerfile',
  modelTitle: 'Dockerfile instructions',
  intro: (
    <>
      <p className="prose">
        The <code>Dockerfile</code> is the recipe for your image. Each instruction adds a layer. Order matters
        for cache efficiency: copy dependency manifests before source code so{' '}
        <code>npm install</code> reruns only when <code>package.json</code> changes.
      </p>
      <p className="prose">
        Production images stay small with <strong>multi-stage builds</strong>: compile in a fat builder image,
        copy only the artifact into a minimal runtime (Alpine, distroless). Fewer packages means smaller attack
        surface and faster pulls.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`FROM node:20-alpine AS build\nWORKDIR /app\nCOPY package.json .\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine\nWORKDIR /app\nCOPY --from=build /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD ["node", "dist/main.js"]`}
      />
      <Callout kind="tip" title="Instruction cheat sheet">
        <code>FROM</code> base image · <code>WORKDIR</code> cd inside build · <code>COPY</code>/<code>ADD</code>{' '}
        files · <code>RUN</code> build steps · <code>ENV</code> defaults · <code>EXPOSE</code> documentation ·{' '}
        <code>CMD</code> default args · <code>ENTRYPOINT</code> fixed executable
      </Callout>
      {simNote(
        <span>Validate Dockerfile structure in the editor; build the sample app in the shell lab.</span>,
        <span>BuildKit secrets, cache mounts, SBOM, and image scanning in CI.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'dockerignore',
      title: '.dockerignore & security',
      content: (
        <>
          <p className="prose">
            Never <code>COPY . .</code> without a <code>.dockerignore</code> — you risk baking in{' '}
            <code>.env</code>, <code>.git</code>, and huge <code>node_modules</code> directories. Run containers
            as non-root (<code>USER</code>) when possible.
          </p>
          <Callout kind="warning" title="Common mistake">
            Using <code>latest</code> in <code>FROM</code> breaks reproducible builds. Pin a digest or minor
            version tag.
          </Callout>
        </>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Edit the Dockerfile in the validator, then build the same project in the shell with{' '}
      <code>docker build -t myapp:1.0 .</code>.
    </p>
  ),
  playground: (
    <>
      <DockerfileEditorSim />
      <ContainerShell fallback={<DockerCliSim />} hint="cat Dockerfile, docker build -t myapp:1.0 ." />
      <TryThis>
        Remove <code>CMD</code> in the editor and validate — fix errors. In the shell, compare{' '}
        <code>cat Dockerfile</code> with your edits and run a successful build.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'ENTRYPOINT', def: 'Fixed executable; CMD provides default arguments.' },
    { term: 'multi-stage', def: 'Multiple FROM stages; copy artifacts between them.' },
    { term: 'distroless', def: 'Minimal runtime image with no shell — smaller and safer.' },
    { term: '.dockerignore', def: 'Excludes paths from the build context tarball.' },
  ],
  quiz: [
    q('Multi-stage builds mainly:', ['Add more VMs', 'Shrink final image size', 'Replace docker compose', 'Remove layers'], 1),
    q(
      'Why COPY package.json before COPY . .?',
      ['Docker requires it', 'Better layer cache for dependency install', 'It enables TLS', 'It creates volumes'],
      1,
    ),
    q('EXPOSE documents:', ['Which ports the container listens on', 'Host firewall rules', 'Kubernetes Services', 'Git remotes'], 0),
  ],
  recap: [
    <>FROM sets base; COPY/RUN build layers; CMD/ENTRYPOINT define the process.</>,
    <>Order instructions for cache hits; multi-stage for small production images.</>,
    <>Use .dockerignore and non-root USER for safer, faster builds.</>,
  ],
})

export const dockerNetworks = createChapterLesson({
  id: 'docker-networks',
  modelTitle: 'Networking modes',
  intro: (
    <>
      <p className="prose">
        Containers get network namespaces — their own routing table and interfaces. By default, Docker attaches
        containers to a <strong>bridge</strong> network: private IPs on <code>docker0</code>, with{' '}
        <code>-p</code> publishing selected ports to the host via NAT.
      </p>
      <p className="prose">
        User-defined bridge networks add <strong>DNS</strong>: containers resolve each other by service name.
        <strong> host</strong> mode shares the host stack (no port mapping needed but less isolation). Overlay
        networks (Swarm/Kubernetes CNI) span multiple hosts — the same mental model, different plugin.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`docker network create appnet\ndocker run -d --name api --network appnet myapi:1.0\ndocker run -d --name web --network appnet -p 8080:80 myweb:1.0\n# web can curl http://api:8080 by name`}
      />
      <ul className="prose-list">
        <li>
          <code>docker network ls</code> / <code>inspect</code> — see drivers and attached containers
        </li>
        <li>
          Published port <code>-p 8080:80</code> — traffic to host:8080 → container:80
        </li>
        <li>
          <code>host</code> network — container binds directly on host interfaces (Linux only nuances)
        </li>
      </ul>
      {simNote(
        <span>Interactive bridge vs host diagram; shell supports docker network create/ls.</span>,
        <span>iptables/nftables NAT, CNI plugins, and service meshes in Kubernetes.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'dns-publish',
      title: 'DNS & publishing',
      content: (
        <p className="prose">
          On the default bridge, containers <em>cannot</em> resolve each other by name — use a user-defined
          network for microservice demos. Publishing ports exposes only what you intend; bind to{' '}
          <code>127.0.0.1:8080:80</code> on shared dev machines to avoid accidental LAN exposure.
        </p>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Switch bridge vs host in the diagram, then try <code>docker network create mynet</code> and{' '}
      <code>docker network ls</code> in the shell.
    </p>
  ),
  playground: (
    <>
      <DockerNetworkSim />
      <ContainerShell fallback={<DockerCliSim />} hint="docker network create mynet, docker network ls" />
      <TryThis>
        Change port mapping in the diagram and trace host → NAT → container. In the shell, create a network and
        list it.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'bridge network', def: 'Default isolated L2 network with NAT to the host.' },
    { term: 'host network', def: 'Container uses host network interfaces directly.' },
    { term: 'port publishing', def: '-p maps a host port to a container port.' },
    { term: 'embedded DNS', def: 'Resolves container names on user-defined bridge networks.' },
  ],
  quiz: [
    q('User-defined bridge networks enable:', ['Git merges', 'DNS between containers by name', 'Faster CPUs', 'SQL joins'], 1),
    q('-p 3000:80 means:', ['Host port 3000 → container 80', 'Container 3000 → host 80', 'Only HTTPS', 'Disable firewall'], 0),
    q('host network mode:', ['Shares the host network stack', 'Creates a new VPN', 'Requires Kubernetes', 'Encrypts traffic'], 0),
  ],
  recap: [
    <>Default bridge + -p for publishing; custom networks for service DNS.</>,
    <>Only publish ports you intend to expose; prefer named networks for multi-container apps.</>,
    <>Kubernetes Services extend this model with cluster-wide virtual IPs.</>,
  ],
})

export const dockerVolumes = createChapterLesson({
  id: 'docker-volumes',
  modelTitle: 'Persistent storage',
  intro: (
    <>
      <p className="prose">
        Container writable layers are ephemeral — <code>docker rm</code> deletes them. Databases, uploads, and
        local caches need storage that survives container replacement. Docker offers{' '}
        <strong>named volumes</strong> (managed by Docker), <strong>bind mounts</strong> (host path mapped in),
        and <strong>tmpfs</strong> (memory-only, never hits disk).
      </p>
      <p className="prose">
        Dev workflows often bind-mount source code for hot reload (<code>-v $(pwd):/app</code>). Production
        databases use named volumes or external storage drivers so you can replace the container without losing
        data.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`docker volume create pgdata\ndocker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16\ndocker run -d -v $(pwd)/src:/app/src myapp:dev  # bind mount`}
      />
      <ul className="prose-list">
        <li>
          <strong>Named volume</strong> — <code>-v mydata:/data</code>, survives <code>docker rm</code>
        </li>
        <li>
          <strong>Bind mount</strong> — host path; great for dev, risky permissions on macOS/Windows VM layers
        </li>
        <li>
          <code>docker volume ls</code> / <code>docker volume rm</code> — lifecycle separate from containers
        </li>
      </ul>
      {simNote(
        <span>Sim shows data surviving container removal with a volume; shell supports volume create.</span>,
        <span>CSI drivers, EBS/GCE PD, and Kubernetes PVCs for cloud persistence.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'choose-mount',
      title: 'Choosing a mount type',
      content: (
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Best for</th>
              <th>Survives rm?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Writable layer</td>
              <td>Temp files</td>
              <td>No</td>
            </tr>
            <tr>
              <td>Named volume</td>
              <td>DB data, uploads</td>
              <td>Yes</td>
            </tr>
            <tr>
              <td>Bind mount</td>
              <td>Dev hot-reload</td>
              <td>Yes (on host)</td>
            </tr>
            <tr>
              <td>tmpfs</td>
              <td>Secrets in RAM</td>
              <td>No</td>
            </tr>
          </tbody>
        </table>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Watch data disappear without a volume, then persist it with <code>docker volume create</code> in the
      simulator and shell.
    </p>
  ),
  playground: (
    <>
      <DockerVolumeSim />
      <ContainerShell fallback={<DockerCliSim />} hint="docker volume create my-data, docker volume ls" />
      <TryThis>
        In the sim, write data, remove the container without a volume — data is lost. Repeat with a named volume.
        In the shell, create <code>my-data</code> and list volumes.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'named volume', def: 'Docker-managed storage surviving container removal.' },
    { term: 'bind mount', def: 'Maps a host directory into the container.' },
    { term: 'tmpfs mount', def: 'RAM-backed filesystem; cleared when container stops.' },
    { term: 'volume driver', def: 'Plugin for remote/network storage backends.' },
  ],
  quiz: [
    q('Volumes help because:', ['They speed DNS', 'Data survives container deletion', 'They replace React', 'They encrypt git'], 1),
    q('Bind mounts map:', ['A host path into the container', 'Only GPU devices', 'Kubernetes Secrets', 'DNS records'], 0),
    q('docker volume rm removes:', ['The image', 'The named volume data', 'Git history', 'All containers automatically'], 1),
  ],
  recap: [
    <>Use named volumes for databases and uploads; bind mounts for dev hot-reload.</>,
    <>Volumes outlive containers — back them up and plan migration separately from app deploys.</>,
    <>Kubernetes PVCs are the cluster-scale version of this idea.</>,
  ],
})

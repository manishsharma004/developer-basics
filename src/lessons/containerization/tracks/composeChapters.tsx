import { createChapterLesson } from '../../components/ChapterLesson.tsx'
import { Callout, TryThis, CodePreview } from '../../components/blocks.tsx'
import { ComposeGraphSim } from '../sims/ComposeGraphSim.tsx'
import { ComposeSim } from '../sims/ComposeSim.tsx'
import { ContainerShell } from '../sims/ContainerShell.tsx'
import { DockerCliSim } from '../sims/DockerCliSim.tsx'
import { q, simNote } from '../shared.tsx'

export const composeIntro = createChapterLesson({
  id: 'compose-intro',
  modelTitle: 'Services & dependencies',
  intro: (
    <>
      <p className="prose">
        Running three containers with long <code>docker run</code> commands does not scale — you forget a port map
        or env var. <strong>Docker Compose</strong> describes your stack in one YAML file: services, networks,
        volumes, and how they connect.
      </p>
      <p className="prose">
        Compose is ideal for <strong>local development</strong> and integration tests: one{' '}
        <code>docker compose up</code> brings up web, API, and database with consistent names and DNS on the
        default project network.
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`services:\n  web:\n    build: .\n    ports: ["8080:80"]\n    depends_on: [api]\n    environment:\n      API_URL: http://api:8080\n  api:\n    image: myapi:1.0\n    depends_on:\n      db:\n        condition: service_started\n  db:\n    image: postgres:16\n    volumes: [pgdata:/var/lib/postgresql/data]\nvolumes:\n  pgdata:`}
      />
      <Callout kind="why" title="The one idea">
        One file declares <strong>desired stack state</strong>; Compose creates networks and starts containers
        in dependency order.
      </Callout>
      {simNote(
        <span>YAML parser builds a live dependency graph as you edit.</span>,
        <span>Compose v2 plugin talks to the Docker API; Swarm mode uses a different orchestrator.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'compose-files',
      title: 'File layout',
      content: (
        <ul className="prose-list">
          <li>
            <code>compose.yaml</code> (or <code>docker-compose.yml</code>) — main stack definition
          </li>
          <li>
            <code>compose.override.yaml</code> — auto-merged dev tweaks (bind mounts, debug ports)
          </li>
          <li>
            <code>-f prod.yaml</code> — explicit file for staging/production-like runs
          </li>
        </ul>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Edit the compose YAML and watch the dependency graph update. Add or remove <code>depends_on</code> edges
      and see which services must start first.
    </p>
  ),
  playground: (
    <>
      <ComposeGraphSim />
      <TryThis>
        Remove <code>depends_on</code> from web → api and observe parallel startup. Add a fourth service that
        depends on db.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'compose file', def: 'YAML defining services, networks, volumes for a project.' },
    { term: 'service', def: 'One container (or scaled group) defined in compose.' },
    { term: 'project name', def: 'Prefix for networks/volumes; defaults to directory name.' },
    { term: 'depends_on', def: 'Startup ordering hint between services.' },
  ],
  quiz: [
    q('depends_on ensures:', ['Startup order awareness', 'Automatic TLS', 'Git push', 'SQL migrations always'], 0),
    q('Compose is best for:', ['Local multi-container dev stacks', 'Replacing etcd', 'Compiling kernels', 'Git hosting'], 0),
    q('Services on the default compose network:', ['Resolve each other by service name', 'Need static IPs only', 'Cannot talk to each other', 'Use only host network'], 0),
  ],
  recap: [
    <>Compose models multi-service apps in one YAML file.</>,
    <>depends_on expresses startup dependencies; networks provide DNS between services.</>,
    <>Use override files to separate dev defaults from production-like configs.</>,
  ],
})

export const composeServices = createChapterLesson({
  id: 'compose-services',
  modelTitle: 'Multi-service stacks',
  intro: (
    <>
      <p className="prose">
        A typical three-tier stack — <strong>web</strong> (nginx/React), <strong>api</strong> (Node/Go),{' '}
        <strong>db</strong> (Postgres) — shares a compose network. The API reads <code>DB_HOST=db</code> from
        environment variables; the web tier calls <code>http://api:8080</code> using embedded DNS.
      </p>
      <p className="prose">
        Operate the stack with <code>docker compose up -d</code>, inspect with <code>ps</code> and{' '}
        <code>logs -f</code>, debug with <code>exec</code>, and tear down with <code>down</code> (add{' '}
        <code>-v</code> to remove named volumes).
      </p>
    </>
  ),
  model: (
    <>
      <CodePreview
        language="plaintext"
        code={`docker compose up -d\ndocker compose ps\ndocker compose logs -f api\ndocker compose exec db psql -U postgres\ndocker compose down -v  # removes containers + project volumes`}
      />
      <ul className="prose-list">
        <li>
          <code>environment</code> / <code>env_file</code> — inject connection strings and feature flags
        </li>
        <li>
          <code>build:</code> vs <code>image:</code> — build from Dockerfile or pull a prebuilt image
        </li>
        <li>
          <code>volumes</code> — persist database files across <code>compose down</code> (without <code>-v</code>)
        </li>
      </ul>
      {simNote(
        <span>Editable YAML with simulated compose up ordering; shell runs fake docker compose commands.</span>,
        <span>Real compose creates project networks, labels containers, and wires env interpolation.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'env-wiring',
      title: 'Wiring with environment',
      content: (
        <p className="prose">
          Never hard-code IPs — use service names as hostnames. For secrets in dev, prefer{' '}
          <code>.env</code> (gitignored) with <code>env_file</code>; in production move to a secret manager and
          Kubernetes Secrets.
        </p>
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Edit the stack YAML, run <code>compose up</code> in the simulator, then try the same commands in the shell
      lab.
    </p>
  ),
  playground: (
    <>
      <ComposeSim />
      <ContainerShell fallback={<DockerCliSim />} hint="docker compose up -d, docker compose ps, docker compose logs web" />
      <TryThis>
        Click <code>docker compose up -d</code> and watch db → api → web reach <code>up</code>. Break YAML on
        purpose and fix the parse error. In the shell, run <code>docker compose up -d</code> and{' '}
        <code>docker compose ps</code>.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'docker compose up', def: 'Create and start all services in the project.' },
    { term: 'environment', def: 'Env vars injected into service containers.' },
    { term: 'compose exec', def: 'Run a one-off command in a running service container.' },
    { term: 'project volume', def: 'Named volume scoped to the compose project name.' },
  ],
  quiz: [
    q('docker compose down removes:', ['Only images', 'Containers and default networks for the project', 'Git history', 'kubectl config'], 1),
    q('DB_HOST=db works because:', ['Compose DNS resolves service names', 'Postgres creates hostnames', 'Docker disables networking', 'It is magic'], 0),
    q('docker compose logs -f:', ['Follows log output', 'Formats disks', 'Deletes volumes', 'Builds images only'], 0),
  ],
  recap: [
    <>Compose up brings the whole stack; logs and exec debug individual services.</>,
    <>Wire tiers with environment variables and service DNS names.</>,
    <>Use down -v deliberately — it destroys named volumes in the project.</>,
  ],
})

export const composeProduction = createChapterLesson({
  id: 'compose-production',
  modelTitle: 'Prod patterns',
  intro: (
    <>
      <p className="prose">
        The same compose files that power local dev can approximate production — with overrides, profiles,
        healthchecks, and scaling. Teams keep <code>compose.yaml</code> as the contract and layer{' '}
        <code>compose.prod.yaml</code> for stricter limits, pinned images, and no bind mounts.
      </p>
      <p className="prose">
        <code>depends_on: condition: service_healthy</code> waits for a healthcheck before starting dependents —
        closer to real readiness than mere &ldquo;container started.&rdquo;
      </p>
    </>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <code>compose.override.yml</code> — dev-only bind mounts; not deployed to servers
        </li>
        <li>
          <code>profiles:</code> — optional services (<code>docker compose --profile debug up</code>)
        </li>
        <li>
          <code>healthcheck</code> — command that must succeed for &ldquo;healthy&rdquo; status
        </li>
        <li>
          <code>docker compose up --scale api=3</code> — multiple containers for one service (no LB built-in)
        </li>
      </ul>
      <Callout kind="warning" title="Compose limits">
        Compose is not a production orchestrator for multi-host clusters — Kubernetes, ECS, or Nomad handle
        rolling updates, PDBs, and multi-AZ scheduling. Compose teaches the service model those tools automate.
      </Callout>
      {simNote(
        <span>Toggle profiles and health-gated startup in the compose simulator.</span>,
        <span>Production uses Helm/Kustomize, ECS services, or GitOps — not compose scale on laptops.</span>,
      )}
    </>
  ),
  extraSections: [
    {
      id: 'healthchecks',
      title: 'Healthchecks in practice',
      content: (
        <CodePreview
          language="plaintext"
          code={`services:\n  api:\n    healthcheck:\n      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]\n      interval: 10s\n      retries: 3\n  web:\n    depends_on:\n      api:\n        condition: service_healthy`}
        />
      ),
    },
  ],
  playgroundIntro: (
    <p className="prose">
      Enable the <strong>debug</strong> profile to add optional services. Healthchecks gate startup order when
      enabled in the YAML.
    </p>
  ),
  playground: (
    <>
      <ComposeSim showProfiles showHealthchecks />
      <ContainerShell fallback={<DockerCliSim />} hint="docker compose --profile debug up -d, docker compose down" />
      <TryThis>
        Add <code>profiles: [debug]</code> to a service, switch profiles, and compose up. Add a healthcheck to
        api and watch web wait for healthy status.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'profile', def: 'Optional service group activated with --profile.' },
    { term: 'healthcheck', def: 'Command compose uses to mark a service healthy.' },
    { term: 'override file', def: 'Merged compose file for environment-specific differences.' },
    { term: 'service_healthy', def: 'depends_on condition waiting for healthcheck pass.' },
  ],
  quiz: [
    q('service_healthy condition:', ['Waits for healthcheck pass', 'Disables networks', 'Removes volumes', 'Runs git pull'], 0),
    q('Profiles are for:', ['Optional services like debug tooling', 'Encrypting images', 'Replacing DNS', 'Git branches'], 0),
    q('Compose scale on one host:', ['Does not provide a built-in load balancer', 'Replaces Kubernetes', 'Creates multi-AZ clusters', 'Deletes images'], 0),
  ],
  recap: [
    <>Overrides and profiles separate dev convenience from production-like runs.</>,
    <>Healthchecks improve startup ordering beyond depends_on alone.</>,
    <>For real production orchestration, graduate to Kubernetes or a managed container service.</>,
  ],
})

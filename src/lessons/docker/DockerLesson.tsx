import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, SimReality, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { DockerSim } from './DockerSim.tsx'

export default function DockerLesson() {
  return (
    <Lesson id="docker">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Containers package your app with its dependencies so it runs the same everywhere.
          Docker is the tool most tutorials and teams use to build and ship that package.
        </p>
        <Callout kind="why" title="The one idea">
          An <strong>image</strong> is an immutable template; a <strong>container</strong>{' '}
          is a running instance of that image.
        </Callout>
      </Section>

      <Section id="model" title="Images, containers, volumes">
        <ul className="prose-list">
          <li><strong>Dockerfile</strong> — instructions to build layers (FROM, COPY, RUN, CMD).</li>
          <li><strong>docker build</strong> — creates an image from a Dockerfile.</li>
          <li><strong>docker run</strong> — starts a container; <code>-p</code> maps ports.</li>
          <li><strong>Volumes</strong> — mount host storage so data survives container restarts.</li>
        </ul>
        <SimReality
          inSim={<span>Build one image and run containers in a table — no real daemon.</span>}
          inReality={<span>Production uses orchestrators (Kubernetes), registries, health checks, and resource limits.</span>}
        />
      </Section>

      <Section id="playground" title="Build and run">
        <DockerSim />
        <TryThis>Build the image, run two containers on different ports, stop one — discuss ephemeral container FS vs volumes.</TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'image', def: 'Read-only template with layers (OS + deps + app).' },
          { term: 'container', def: 'Writable running instance of an image.' },
          { term: 'volume', def: 'Persistent storage mounted into a container.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'docker run creates:', options: ['A new image only', 'A running container from an image', 'A git branch', 'An SQL index'], answer: 1 },
          { q: 'Volumes help because:', options: ['They speed DNS', 'Data survives container deletion', 'They replace React', 'They encrypt git'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Dockerfile → image → container.</>,
          <>Map ports and use volumes for persistent data.</>,
        ]} />
      </Section>
    </Lesson>
  )
}

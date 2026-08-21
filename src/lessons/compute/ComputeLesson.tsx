import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ScalingSimulator } from './ScalingSimulator.tsx'

const ROWS = [
  { k: 'Virtual machine', boot: 'seconds–minutes', iso: 'strong (own OS)', scale: 'manual / slow', use: 'legacy apps, full control' },
  { k: 'Container', boot: 'sub-second', iso: 'process-level (shared kernel)', scale: 'fast, orchestrated', use: 'microservices, most apps' },
  { k: 'Serverless', boot: 'ms (warm) / cold starts', iso: 'per-invocation', scale: 'automatic, to zero', use: 'spiky/event workloads' },
]

export default function ComputeLesson() {
  return (
    <Lesson id="compute">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Your code has to run <em>somewhere</em>. Choosing where — a virtual
          machine, a container, or a serverless function — shapes how fast you
          deploy, how you scale under load, how you're isolated from neighbors, and
          what you pay. It's one of the first decisions in any system design.
        </p>
        <Callout kind="why" title="The one idea">
          A single machine has a ceiling. Scaling means running <strong>more
          instances</strong> behind a load balancer and adding or removing them as
          demand changes — trading cost for capacity.
        </Callout>
      </Section>

      <Section id="model" title="VMs, containers, serverless">
        <p className="prose">
          The three common units of compute trade off isolation, startup speed,
          and how much you manage:
        </p>
        <div className="panel">
          <table className="metrics-table">
            <thead>
              <tr><th>Unit</th><th>Startup</th><th>Isolation</th><th>Scaling</th><th>Good for</th></tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.k}>
                  <td><strong>{r.k}</strong></td>
                  <td>{r.boot}</td>
                  <td>{r.iso}</td>
                  <td>{r.scale}</td>
                  <td>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout kind="note">
          <strong>Vertical scaling</strong> = a bigger machine (more CPU/RAM).{' '}
          <strong>Horizontal scaling</strong> = more machines. Horizontal is how
          large systems grow, because a single box always has a hard ceiling.
        </Callout>
      </Section>

      <Section id="playground" title="Scale it live">
        <p className="prose">
          Drive the load and the instance count. Watch per-instance utilization,
          dropped requests when you're under-provisioned, and the monthly cost.
          Then flip on autoscaling and change the load.
        </p>
        <ScalingSimulator />
        <TryThis>
          Push the load past your capacity and watch requests get dropped, then add
          instances until it's healthy. Now enable <strong>Autoscale</strong> and
          drag the load up and down — instances follow to hold ~70% utilization.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Stateless services scale easily">
          <p className="prose">
            You can only add identical instances freely if each request can go to{' '}
            <em>any</em> instance. That means keeping instances{' '}
            <strong>stateless</strong> — session data lives in a shared store
            (cache/DB), not in one instance's memory. Stateful services are far
            harder to scale, which is why "make it stateless" is a recurring design
            mantra.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Cold starts and autoscaling lag">
          <p className="prose">
            New instances aren't instant: VMs boot in minutes, containers in
            seconds, serverless functions suffer <strong>cold starts</strong> on the
            first request. Autoscalers also react <em>after</em> load rises, so a
            sudden spike can drop requests before capacity catches up — which is why
            teams keep headroom or pre-warm capacity for known spikes.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'instance', def: 'One running copy of your service (VM, container, or function).' },
            { term: 'horizontal scaling', def: 'Adding more instances to handle more load.' },
            { term: 'vertical scaling', def: 'Giving one instance more CPU/RAM.' },
            { term: 'load balancer', def: 'Distributes incoming requests across instances.' },
            { term: 'stateless', def: 'Instances keep no per-user state, so any can serve any request.' },
            { term: 'cold start', def: 'The delay when a fresh instance starts before it can serve.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Requests are being dropped at peak. The most direct fix is to:',
              options: ['Rewrite in a faster language', 'Add more instances (scale horizontally) or autoscale', 'Add more logging', 'Restart the database'],
              answer: 1,
              explain: 'More instances add capacity; autoscaling does this automatically as load rises.',
            },
            {
              q: 'Why must instances be stateless to scale horizontally?',
              options: ['To save memory', 'So any instance can serve any request (state lives in a shared store)', 'To boot faster', 'Statelessness is not required'],
              answer: 1,
              explain: 'If per-user state lived on one instance, requests could not be freely balanced across all of them.',
            },
            {
              q: 'Which unit typically has cold starts but scales to zero?',
              options: ['Virtual machine', 'Container', 'Serverless function', 'Load balancer'],
              answer: 2,
              explain: 'Serverless scales to zero and spins up on demand, incurring cold-start latency.',
            },

            {
              q: 'Containers vs VMs — containers typically:',
              options: [
                'Include full OS kernel',
              'Share host kernel, isolate processes',
              'Cannot scale',
              'Are always serverless',
              ],
              answer: 1,
              explain: 'Containers share the kernel; VMs virtualize hardware + OS.',
            },
            {
              q: 'Autoscaling adds instances when:',
              options: [
                'Disk is full',
              'Load exceeds capacity thresholds',
              'Code is committed',
              'DNS fails',
              ],
              answer: 1,
              explain: 'Metrics like CPU, latency, or queue depth trigger scale-out.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Code runs on VMs, containers, or serverless — trading isolation, startup, and cost.</>,
            <>Scale <strong>horizontally</strong> (more instances) behind a load balancer.</>,
            <>Keep services <strong>stateless</strong> so any instance can serve any request.</>,
            <>Autoscaling reacts to load but lags; account for cold starts and spikes.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap } from '../components/blocks.tsx'
import { SchedulerPlayground } from './SchedulerPlayground.tsx'

const STATES = [
  { name: 'New', desc: 'being created' },
  { name: 'Ready', desc: 'waiting for the CPU' },
  { name: 'Running', desc: 'executing now' },
  { name: 'Waiting', desc: 'blocked on I/O' },
  { name: 'Terminated', desc: 'finished' },
]

export default function ProcessLesson() {
  return (
    <Lesson id="process">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          When you run <code>node server.js</code> or click an app, the operating
          system creates a <strong>process</strong> to run it. Your machine has a
          handful of CPU cores but runs hundreds of processes, so the OS rapidly
          switches between them. Understanding this explains why programs feel
          concurrent, why "it's slow" often means "it's waiting", and what a
          background job really is.
        </p>
        <Callout kind="why" title="The one idea">
          A process is a running program plus its state. The OS <em>scheduler</em>{' '}
          gives each one short turns on the CPU, creating the illusion that
          everything runs at once.
        </Callout>
      </Section>

      <Section id="model" title="What is a process?">
        <p className="prose">
          A process bundles the program's code, its memory, and bookkeeping the OS
          keeps (its ID, owner, open files, and current state). Over its life a
          process moves between a few states:
        </p>
        <div className="state-track">
          {STATES.map((s, i) => (
            <div key={s.name} className="state-node-wrap">
              <div className={`state-node state-${s.name.toLowerCase()}`}>
                <div className="state-node-name">{s.name}</div>
                <div className="state-node-desc">{s.desc}</div>
              </div>
              {i < STATES.length - 1 && <span className="state-arrow">→</span>}
            </div>
          ))}
        </div>
        <Callout kind="note">
          A process rarely runs start-to-finish in one go. It runs a little, gets
          paused so another can run, waits for the disk or network, then resumes.
        </Callout>
      </Section>

      <Section id="playground" title="Schedule it live">
        <p className="prose">
          Below, several processes want the CPU. Each has an <strong>arrival</strong>{' '}
          time (when it shows up) and a <strong>burst</strong> (how much CPU time
          it needs). Pick a scheduling strategy and watch how the CPU's time gets
          divided up. The simulation runs in real Python.
        </p>
        <SchedulerPlayground />
        <TryThis>
          Press <strong>Play</strong> to watch the timeline fill in. Then switch
          between <strong>FCFS</strong>, <strong>SJF</strong>, and{' '}
          <strong>Round Robin</strong> and watch the average waiting time change.
          Which strategy is fairest? Which is fastest on average?
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="What a context switch actually costs">
          <p className="prose">
            To switch from one process to another, the CPU saves the first
            process's registers and program counter, then loads the next one's.
            That's a <strong>context switch</strong>. It's fast but not free — do
            it too often (e.g. a tiny Round Robin quantum) and the overhead adds
            up. That trade-off is exactly why quantum size matters.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Preemption, fairness, and starvation">
          <p className="prose">
            <strong>FCFS</strong> never interrupts a running job, so one long job
            can make everyone wait (the "convoy effect"). <strong>SJF</strong>{' '}
            gives the best average waiting time but can <em>starve</em> long jobs
            if short ones keep arriving. <strong>Round Robin</strong> preempts
            after a fixed quantum, trading a little throughput for fairness and
            responsiveness — which is why interactive systems favor it.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A process is a running program plus its OS-tracked state.</>,
            <>Processes cycle through <strong>ready → running → waiting</strong> as they share the CPU.</>,
            <>The scheduler picks who runs next; the strategy changes fairness and average wait.</>,
            <>Switching between processes costs a little (a <strong>context switch</strong>), so quantum size is a trade-off.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
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

      <Section id="lifecycle" title="How processes start">
        <p className="prose">
          On Unix, new processes are born in a distinctive two-step dance that's
          worth knowing because it explains parent/child relationships, shells, and
          background jobs.
        </p>
        <ul className="prose-list">
          <li>
            <strong>fork()</strong> — a process clones itself, producing a nearly
            identical child. Both continue from the same point; only the return
            value differs, so each knows whether it's the parent or child.
          </li>
          <li>
            <strong>exec()</strong> — the child replaces its own program image with
            a new one (e.g. your shell forks, then the child execs <code>ls</code>).
          </li>
          <li>
            <strong>wait()</strong> — the parent waits for the child to finish and
            collects its exit code.
          </li>
        </ul>
        <Callout kind="tip">
          Running a command with <code>&amp;</code> in a shell tells it{' '}
          <em>not</em> to <code>wait()</code> — that's a background job.
        </Callout>
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
        <UnderTheHood title="Processes vs. threads">
          <p className="prose">
            A process has its own private memory. A <strong>thread</strong> is a
            lighter unit of execution that lives <em>inside</em> a process and
            shares its memory with sibling threads. Threads are cheaper to create
            and communicate, but sharing memory is exactly what makes them prone to
            race conditions (the next lesson).
          </p>
        </UnderTheHood>
        <UnderTheHood title="Preemption, fairness, and starvation">
          <p className="prose">
            <strong>FCFS</strong> never interrupts a running job, so one long job
            can make everyone wait (the "convoy effect"). <strong>SJF</strong>{' '}
            gives the best average waiting time but can <em>starve</em> long jobs.{' '}
            <strong>Round Robin</strong> preempts after a fixed quantum, trading a
            little throughput for fairness and responsiveness — which is why
            interactive systems favor it.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'process', def: 'A running program with its own memory and OS-tracked state.' },
            { term: 'thread', def: 'A unit of execution inside a process that shares the process memory.' },
            { term: 'scheduler', def: 'The OS component that decides which ready process runs next.' },
            { term: 'context switch', def: "Saving one process's CPU state and loading another's." },
            { term: 'burst', def: 'The amount of CPU time a process needs before it blocks or finishes.' },
            { term: 'preemption', def: 'Interrupting a running process so another can run.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Why does Round Robin use context switches more than FCFS?',
              options: [
                'It runs processes in parallel',
                'It preempts each process after a fixed quantum',
                'It never lets a process finish',
                'It uses more memory',
              ],
              answer: 1,
              explain: 'Round Robin slices time into quanta and switches at each one, so more switches occur.',
            },
            {
              q: 'What is the main difference between a thread and a process?',
              options: [
                'Threads are always faster',
                'Threads share memory within a process; processes have separate memory',
                'Processes cannot do I/O',
                'There is no difference',
              ],
              answer: 1,
              explain: 'Threads live inside a process and share its address space; processes are isolated.',
            },
            {
              q: <>After <code>fork()</code>, how does the child know it is the child?</>,
              options: [
                'It has a different program',
                'fork() returns 0 in the child and the child PID in the parent',
                'It starts from main() again',
                'It cannot know',
              ],
              answer: 1,
              explain: 'fork() returns 0 to the child and the new PID to the parent, so each can branch.',
            },

            {
              q: 'Round Robin uses a:',
              options: [
                'Priority queue only',
              'Time quantum per process',
              'Random pick',
              'Single long job first',
              ],
              answer: 1,
              explain: 'Each process gets a slice; the scheduler rotates.',
            },
            {
              q: 'A process in "waiting" state is usually:',
              options: [
                'Crashed',
              'Blocked on I/O or a lock',
              'Using 100% CPU',
              'Finished',
              ],
              answer: 1,
              explain: 'Waiting means not runnable until an event (I/O, signal) completes.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A process is a running program plus its OS-tracked state.</>,
            <>Processes cycle through <strong>ready → running → waiting</strong> as they share the CPU.</>,
            <>New processes are made with <strong>fork()</strong> then <strong>exec()</strong>.</>,
            <>The scheduler picks who runs next; switching costs a <strong>context switch</strong>, so quantum size is a trade-off.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

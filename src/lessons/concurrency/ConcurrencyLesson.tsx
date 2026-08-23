import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, SimReality, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { RacePlayground } from './RacePlayground.tsx'
import { AsyncParallelSim } from './AsyncParallelSim.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Lost update (no lock)',
    code: `# Model two threads interleaving read-add-write
counter = 0

def read_add_write():
    global counter
    tmp = counter      # read
    tmp = tmp + 1      # add
    counter = tmp      # write

# Both "threads" read 0 before either writes
counter = 0
a = counter          # thread A reads 0
b = counter          # thread B reads 0
counter = a + 1      # A writes 1
counter = b + 1      # B writes 1 — one increment lost!

print("expected: 2")
print("actual:  ", counter)`,
  },
  {
    label: 'Lock serializes access',
    code: `import threading

counter = 0
lock = threading.Lock()

def safe_increment(n):
    global counter
    for _ in range(n):
        with lock:          # only one thread inside
            counter += 1

threads = [threading.Thread(target=safe_increment, args=(10_000,))
           for _ in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print("expected:", 4 * 10_000)
print("actual:  ", counter)`,
  },
  {
    label: 'Async: overlap without threads',
    code: `import asyncio

async def fetch(name, delay):
    print(f"{name} start")
    await asyncio.sleep(delay)   # yields control while "waiting"
    print(f"{name} done")
    return name

async def main():
    # Three tasks overlap in time on one thread
    results = await asyncio.gather(
        fetch("A", 0.2),
        fetch("B", 0.1),
        fetch("C", 0.15),
    )
    print("results:", results)

asyncio.run(main())
print("concurrency: tasks interleave; parallelism needs multiple cores")`,
  },
  {
    label: 'Deadlock sketch (concept)',
    code: `# Two locks acquired in opposite order -> both threads wait forever
import threading

lock_a = threading.Lock()
lock_b = threading.Lock()

def worker1():
    with lock_a:
        with lock_b:
            print("worker1")

def worker2():
    with lock_b:      # holds B, waits for A
        with lock_a:
            print("worker2")

# In real code this can hang. Here we only print the pattern:
print("deadlock risk: thread1 wants A then B, thread2 wants B then A")
print("fix: always acquire locks in the same global order")`,
  },
]

export default function ConcurrencyLesson() {
  return (
    <Lesson id="concurrency">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Modern programs do many things at once — handle requests, update UIs,
          crunch data on multiple cores. That's <strong>concurrency</strong>, and
          it unlocks huge speedups. But the moment two threads touch the same data,
          you can get bugs that appear only sometimes and vanish when you look —
          the notorious <strong>race condition</strong>.
        </p>
        <Callout kind="why" title="The one idea">
          Concurrency is easy until state is <em>shared and mutable</em>. Protect
          shared data (or avoid sharing) and most concurrency bugs disappear.
        </Callout>
        <SimReality
          inSim={
            <>
              Python threads and a visual race simulator in one browser tab. This is
              not true multi-core parallelism — the GIL limits real CPU parallelism
              for Python threads here.
            </>
          }
          inReality={
            <>
              Real systems use OS threads, async runtimes, and process pools across
              many cores. Race conditions, deadlocks, and memory models are subtle —
              the <em>lost-update pattern</em> you see here absolutely happens in
              production.
            </>
          }
        />
      </Section>

      <Section id="model" title="Threads & sharing">
        <p className="prose">
          A <strong>thread</strong> is an independent stream of execution inside a
          process. Threads in the same process <em>share memory</em>, which makes
          communication cheap — and dangerous. Consider incrementing a counter:
        </p>
        <ul className="prose-list">
          <li><code>tmp = counter</code> &nbsp;(read)</li>
          <li><code>tmp = tmp + 1</code> &nbsp;(add)</li>
          <li><code>counter = tmp</code> &nbsp;(write)</li>
        </ul>
        <p className="prose">
          It looks atomic, but it's three steps. If two threads read the same value
          before either writes, one increment is <strong>lost</strong>.
        </p>
        <TryThis>
          In <strong>Code labs</strong> below, run <strong>Lost update</strong> and
          confirm the counter ends at 1 instead of 2. Then run{' '}
          <strong>Lock serializes access</strong> — the mutex makes each increment
          finish before the next thread can read.
        </TryThis>
      </Section>

      <Section id="async" title="Concurrency vs parallelism">
        <p className="prose">
          <strong>Concurrency</strong> is making progress on multiple tasks in overlapping
          time — one thread can start task B while task A waits on I/O.{' '}
          <strong>Parallelism</strong> is literally running work on multiple CPU cores at
          the same instant. Async/await (JavaScript, Python asyncio) gives you concurrency
          on a single thread by yielding at <code>await</code> points instead of blocking.
        </p>
        <ul className="prose-list">
          <li>Threads + shared memory → race risk; message passing avoids sharing.</li>
          <li>Async helps I/O-bound work (network, disk); CPU-bound work often needs processes or a thread pool.</li>
          <li>Even async code can race if you mutate shared state without coordination.</li>
        </ul>
        <AsyncParallelSim />
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label.startsWith('Async'))} />
        <Callout kind="note" title="JavaScript note">
          JavaScript on the browser is single-threaded for your code; <code>await</code>{' '}
          lets the event loop handle other callbacks while a fetch is in flight — same
          concurrency idea, different runtime.
        </Callout>
      </Section>

      <Section id="playground" title="Race it live">
        <p className="prose">
          Below, several threads each increment a shared counter. The simulation
          interleaves their read/add/write steps randomly across many runs — just
          like a real scheduler. Compare the result <em>without</em> a lock to{' '}
          <em>with</em> one.
        </p>
        <RacePlayground />
        <TryThis>
          With the lock <strong>off</strong>, notice the counter often ends below
          the expected total and varies run to run — that's lost updates. Turn the
          lock <strong>on</strong> and every run becomes correct. Increase threads
          and increments to make the race more severe.
        </TryThis>
      </Section>

      <Section id="deadlock" title="Deadlock & ordering">
        <p className="prose">
          A <strong>deadlock</strong> happens when threads wait on each other in a circle —
          each holds a lock someone else needs. Classic fix: acquire multiple locks in a
          fixed global order, or use timeouts and back off. Another fix: don't nest locks;
          pass messages instead of sharing mutable state.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label.startsWith('Deadlock'))} />
        <Callout kind="warning" title="Livelock and starvation">
          Threads can also <strong>starve</strong> (never get the lock) or{' '}
          <strong>livelock</strong> (keep retrying politely but make no progress). Good
          design limits lock scope and avoids long critical sections.
        </Callout>
      </Section>

      <Section id="labs" title="Code labs">
        <p className="prose">
          Run the lost-update simulation and the locked version side by side. Compare
          the conceptual interleaving with the live race playground above.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => !s.label.startsWith('Async') && !s.label.startsWith('Deadlock'))} />
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Critical sections and locks">
          <p className="prose">
            The three-step increment is a <strong>critical section</strong>: code
            that must not be interleaved. A <strong>lock (mutex)</strong> lets only
            one thread into that section at a time, so the read-add-write completes
            as a unit. The cost is contention — threads wait for the lock — so you
            want critical sections small.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Other ways to stay safe">
          <p className="prose">
            Locks aren't the only tool. You can use <strong>atomic</strong>{' '}
            operations, <strong>immutable</strong> data (nothing to race on), or
            avoid sharing entirely by giving each worker its own state and combining
            results at the end. Beware the opposite failure too:{' '}
            <strong>deadlock</strong>, where two threads each hold a lock the other
            needs and both wait forever.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'concurrency', def: 'Making progress on multiple tasks in overlapping time.' },
            { term: 'race condition', def: 'A bug where the result depends on the timing of interleaved operations.' },
            { term: 'critical section', def: 'Code that must run without interleaving to stay correct.' },
            { term: 'lock / mutex', def: 'A primitive that lets only one thread into a critical section at a time.' },
            { term: 'atomic', def: 'An operation that completes as an indivisible unit.' },
            { term: 'deadlock', def: 'Threads waiting on each other forever, so none proceed.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Why can an unsynchronized counter increment lose updates?',
              options: [
                'Addition is slow',
                'The read-add-write is three steps that can interleave',
                'Threads run on different computers',
                'The counter is too large',
              ],
              answer: 1,
              explain: 'Two threads can both read the same value before either writes, so one increment is overwritten.',
            },
            {
              q: 'What does a lock (mutex) do?',
              options: [
                'Makes code run faster',
                'Lets only one thread execute a critical section at a time',
                'Creates more threads',
                'Encrypts shared data',
              ],
              answer: 1,
              explain: 'A mutex serializes access so the critical section runs as an indivisible unit.',
            },
            {
              q: 'Which approach avoids races without any locks?',
              options: [
                'Sharing more state',
                'Using immutable data or not sharing state at all',
                'Adding more threads',
                'Ignoring the problem',
              ],
              answer: 1,
              explain: 'If nothing mutable is shared, there is nothing to race on.',
            },
            {
              q: 'What is deadlock?',
              options: [
                'A thread runs forever in a loop',
                'Two threads each hold a lock the other needs, so both wait forever',
                'A lock that is too slow',
                'When a thread exits before releasing memory',
              ],
              answer: 1,
              explain: 'Circular waiting on locks prevents any thread from proceeding.',
            },
            {
              q: 'Why keep critical sections small?',
              options: [
                'Locks use more memory for longer code',
                'Long critical sections increase contention and reduce parallelism',
                'Python forbids long critical sections',
                'Small sections prevent deadlocks entirely',
              ],
              answer: 1,
              explain: 'While one thread holds the lock, others wait — shorter sections mean less waiting.',
            },
            {
              q: 'Async/await on one thread mainly helps with:',
              options: [
                'Using all CPU cores for math',
                'Overlapping I/O waits without blocking the thread',
                'Eliminating the need for any locks',
                'Making every operation atomic',
              ],
              answer: 1,
              explain: 'Await yields while waiting on I/O so other tasks can run — concurrency, not multi-core parallelism.',
            },
            {
              q: 'A safe way to avoid deadlock when using two locks:',
              options: [
                'Acquire them in random order each time',
                'Always acquire lock A before lock B everywhere',
                'Never release locks',
                'Use only one thread',
              ],
              answer: 1,
              explain: 'A consistent global lock order prevents circular waiting.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Threads share memory, which is powerful but race-prone.</>,
            <>A seemingly atomic increment is really read-add-write, and can lose updates.</>,
            <>A <strong>lock</strong> serializes a <strong>critical section</strong> to keep it correct.</>,
            <>Immutability and not sharing state avoid races entirely; watch out for deadlock.</>,
            <>Async overlaps I/O on one thread; parallelism needs multiple cores.</>,
            <>Acquire locks in a consistent order to prevent circular waits.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

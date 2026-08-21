import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { RacePlayground } from './RacePlayground.tsx'

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
              q: 'A race condition happens when:',
              options: [
                'Two CPUs exist',
              'Outcome depends on thread interleaving',
              'Code is too fast',
              'Locks are used',
              ],
              answer: 1,
              explain: 'Shared mutable state without synchronization yields nondeterministic results.',
            },
            {
              q: 'A lock prevents:',
              options: [
                'All parallelism',
              'Two threads entering a critical section at once',
              'Memory leaks',
              'DNS lookups',
              ],
              answer: 1,
              explain: 'Only one holder at a time protects shared updates.',
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
          ]}
        />
      </Section>
    </Lesson>
  )
}

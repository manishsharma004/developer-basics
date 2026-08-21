import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { RecursionViz } from './RecursionViz.tsx'

export default function RecursionLesson() {
  return (
    <Lesson id="recursion">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Recursion — a function that calls itself — is the natural way to work with
          nested things: file trees, JSON, HTML, org charts, and many algorithms.
          Once you can picture the call tree, recursion stops feeling like magic and
          becomes a tool you reach for deliberately.
        </p>
        <Callout kind="why" title="The one idea">
          Every recursion needs a <strong>base case</strong> that stops it, and a{' '}
          <strong>recursive case</strong> that moves toward the base case. Miss the
          base case and you get infinite recursion — a stack overflow.
        </Callout>
      </Section>

      <Section id="model" title="Base case & recursion">
        <p className="prose">
          Take factorial: <code>fact(n) = n × fact(n − 1)</code>, with base case{' '}
          <code>fact(1) = 1</code>. Each call defers to a smaller one until it hits
          the base, then the results multiply back up. Fibonacci does the same but
          branches <em>twice</em> (<code>fib(n) = fib(n−1) + fib(n−2)</code>), which
          is where things get interesting.
        </p>
      </Section>

      <Section id="playground" title="Trace the calls">
        <p className="prose">
          Watch the actual call tree. For factorial it's a straight line. For
          Fibonacci it branches — and without memoization the same subproblems get
          recomputed over and over.
        </p>
        <RecursionViz />
        <TryThis>
          Pick <strong>fibonacci</strong> and raise <code>n</code> — see the call
          count explode (fib(8) makes 67 calls!). Now tick <strong>Memoize</strong>:
          repeated subproblems become "cache hit" leaves and the count collapses to
          roughly linear.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Recursion and the call stack">
          <p className="prose">
            Each recursive call pushes a frame onto the call stack (see the Memory
            lesson). The deepest the recursion goes is the most stack it uses — so
            unbounded recursion overflows the stack. Some languages optimize{' '}
            <em>tail calls</em> (a recursive call in the last position) to reuse a
            frame, but many, including Python, do not.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Overlapping subproblems → memoization">
          <p className="prose">
            Naive Fibonacci is O(2ⁿ) because it recomputes <code>fib(k)</code> a
            huge number of times. Storing each result the first time (memoization)
            makes it O(n). Recognizing overlapping subproblems is the gateway to{' '}
            <strong>dynamic programming</strong>.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'base case', def: 'The condition that stops the recursion.' },
            { term: 'recursive case', def: 'The step that calls the function on a smaller input.' },
            { term: 'call tree', def: 'The tree of all recursive calls made.' },
            { term: 'memoization', def: 'Caching results of calls to avoid recomputation.' },
            { term: 'stack overflow', def: 'Running out of stack from too-deep recursion.' },
            { term: 'tail call', def: 'A recursive call in the final position, sometimes optimized.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What happens if a recursive function has no reachable base case?',
              options: ['It returns 0', 'It recurses forever until a stack overflow', 'It runs once', 'It memoizes'],
              answer: 1,
              explain: 'Without a base case the recursion never stops and exhausts the stack.',
            },
            {
              q: 'Why is naive Fibonacci so slow?',
              options: ['It uses too much disk', 'It recomputes the same subproblems exponentially', 'It sorts the input', 'It uses the heap'],
              answer: 1,
              explain: 'The two-way branching recomputes overlapping subproblems, giving O(2ⁿ).',
            },
            {
              q: 'What does memoization change about repeated calls?',
              options: ['They error', 'They return a cached result instead of recomputing', 'They run twice', 'They use more stack'],
              answer: 1,
              explain: 'Cached results are returned immediately, collapsing repeated work.',
            },

            {
              q: 'Every recursive function needs:',
              options: [
                'Two loops',
              'A base case',
              'Global variables',
              'Threads',
              ],
              answer: 1,
              explain: 'Base case stops recursion; without it you overflow the stack.',
            },
            {
              q: 'Memoization helps when:',
              options: [
                'No repeated subproblems',
              'Same inputs are recomputed many times',
              'Using only loops',
              'Memory is unlimited',
              ],
              answer: 1,
              explain: 'Caching results avoids exponential recomputation (e.g. naive Fibonacci).',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Recursion = a <strong>base case</strong> plus a <strong>recursive case</strong> heading toward it.</>,
            <>Each call uses stack; too-deep recursion overflows it.</>,
            <>Branching recursion can recompute subproblems exponentially.</>,
            <><strong>Memoization</strong> caches results and is the basis of dynamic programming.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

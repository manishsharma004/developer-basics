import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { RecursionViz } from './RecursionViz.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Factorial',
    code: `def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

for i in range(1, 7):
    print(f"fact({i}) = {fact(i)}")`,
  },
  {
    label: 'Naive vs memoized Fibonacci',
    code: `def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n - 1) + fib_naive(n - 2)

cache = {}
def fib_memo(n):
    if n in cache:
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fib_memo(n - 1) + fib_memo(n - 2)
    return cache[n]

n = 30
print("naive fib(20):", fib_naive(20))
print("memo fib(30):", fib_memo(n))
print("cache size:", len(cache))`,
  },
  {
    label: 'Directory walk',
    code: `tree = {
    "src": {
        "main.py": None,
        "utils": {"helpers.py": None, "config.py": None},
    },
    "README.md": None,
}

def walk(path, node, depth=0):
    indent = "  " * depth
    if isinstance(node, dict):
        print(f"{indent}{path}/")
        for name, child in node.items():
            walk(name, child, depth + 1)
    else:
        print(f"{indent}{path}")

walk("project", tree)`,
  },
]

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
        <Callout kind="tip" title="When to reach for recursion">
          Recursion shines when the data is <em>self-similar</em>: a tree is nodes
          containing trees, a directory contains directories. If you find yourself
          writing a loop with an explicit stack to simulate depth, recursion might be
          the clearer expression.
        </Callout>
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

      <Section id="labs" title="Code lab">
        <p className="prose">
          Run factorial to see the base case in action, then compare naive and
          memoized Fibonacci. The directory walk shows recursion on nested
          structures — the pattern behind parsing JSON, HTML, and file systems.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>Naive vs memoized Fibonacci</strong> and compare how far each
          can go before slowing down. Then run <strong>Directory walk</strong> and
          trace how depth increases with each nested folder.
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
        <UnderTheHood title="Recursion vs iteration">
          <p className="prose">
            Any recursion can be rewritten as a loop with an explicit stack — and
            vice versa. Choose based on clarity: tree walks and divide-and-conquer
            often read cleaner recursively; simple counting loops are usually clearer
            as iteration.
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
            { term: 'dynamic programming', def: 'Solving problems by caching overlapping subproblems.' },
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
              options: ['Two loops', 'A base case', 'Global variables', 'Threads'],
              answer: 1,
              explain: 'Base case stops recursion; without it you overflow the stack.',
            },
            {
              q: 'Memoization helps when:',
              options: ['No repeated subproblems', 'Same inputs are recomputed many times', 'Using only loops', 'Memory is unlimited'],
              answer: 1,
              explain: 'Caching results avoids exponential recomputation (e.g. naive Fibonacci).',
            },
            {
              q: 'Walking a nested file tree is a classic use of:',
              options: ['Sorting', 'Recursion on self-similar structure', 'Hashing', 'Floating point'],
              answer: 1,
              explain: 'Each directory can contain more directories — the same pattern at every level.',
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
            <>Use recursion when data is self-similar (trees, nested structures).</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

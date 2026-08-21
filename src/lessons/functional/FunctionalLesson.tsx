import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Pure vs. impure',
    code: `# Pure: output depends only on inputs; no side effects.
def add_tax(price, rate):
    return round(price * (1 + rate), 2)

print(add_tax(100, 0.2))
print(add_tax(100, 0.2))     # same input -> same output, always

# Impure: reads/writes outside state, so calls interfere.
total = 0
def add_to_total(x):
    global total
    total += x               # side effect
    return total

print(add_to_total(5), add_to_total(5))   # 5 then 10 — order matters`,
  },
  {
    label: 'map / filter / reduce',
    code: `from functools import reduce

nums = [1, 2, 3, 4, 5, 6]

doubled = list(map(lambda n: n * 2, nums))       # transform each
evens   = list(filter(lambda n: n % 2 == 0, nums))  # keep some
total   = reduce(lambda acc, n: acc + n, nums, 0)   # fold to one value

print("doubled:", doubled)
print("evens:  ", evens)
print("sum:    ", total)

# The same three, Pythonically:
print("comprehension:", [n * 2 for n in nums if n % 2 == 0])`,
  },
  {
    label: 'Immutability & composition',
    code: `# Higher-order functions take or return functions.
def compose(f, g):
    return lambda x: f(g(x))

def inc(x): return x + 1
def double(x): return x * 2

inc_then_double = compose(double, inc)
print(inc_then_double(3))    # (3+1)*2 = 8

# Immutability: build new data instead of mutating in place.
base = (1, 2, 3)             # a tuple can't be changed
extended = base + (4,)       # a NEW tuple
print("base:", base, "extended:", extended)`,
  },
  {
    label: 'map & filter',
    code: `    nums = [1, 2, 3, 4, 5]
    squares = list(map(lambda n: n * n, nums))
    evens = list(filter(lambda n: n % 2 == 0, nums))
    print("squares", squares)
    print("evens", evens)`,
  },

]

export default function FunctionalLesson() {
  return (
    <Lesson id="functional">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Functional programming is less about a language and more about a{' '}
          <em>discipline</em>: build programs out of small, predictable functions and
          avoid hidden state. The payoff is code that's easier to test, parallelize,
          and reason about — ideas you'll find in React, data pipelines, and modern
          APIs everywhere.
        </p>
        <Callout kind="why" title="The one idea">
          A <strong>pure function</strong> returns the same output for the same input
          and changes nothing else. Compose pure functions and transform{' '}
          <strong>immutable</strong> data, and whole classes of bugs simply can't
          happen.
        </Callout>
      </Section>

      <Section id="model" title="Pure functions & higher-order">
        <ul className="prose-list">
          <li>
            A <strong>pure function</strong> depends only on its arguments and has no{' '}
            <strong>side effects</strong> (no writing globals, files, or the screen).
            It's trivially testable and safe to cache or run in parallel.
          </li>
          <li>
            <strong>Higher-order functions</strong> take functions as arguments or
            return them — <code>map</code>, <code>filter</code>, and{' '}
            <code>reduce</code> are the classic trio for transforming collections.
          </li>
          <li>
            <strong>Immutability</strong> means you create new values instead of
            mutating existing ones. No shared value changes under someone else's feet —
            the same insight behind avoiding race conditions.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="map / filter / reduce">
        <p className="prose">
          Run these to feel the difference between pure and impure functions, replace
          a loop with <code>map</code>/<code>filter</code>/<code>reduce</code>, and
          compose small functions into a bigger one over immutable data.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>map / filter / reduce</strong>, change the reduce to compute a{' '}
          <em>product</em> instead of a sum (start the accumulator at <code>1</code>{' '}
          and multiply). Then rewrite <code>doubled</code> as a list comprehension.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why purity enables parallelism">
          <p className="prose">
            If a function never touches shared state, two calls can't interfere — so
            you can run them on different cores, memoize results, or reorder them
            freely. That's why <code>map</code>-style transforms scale to huge datasets
            (MapReduce, Spark) and why React prefers pure render functions: given the
            same props, you get the same UI, which makes updates predictable.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Declarative vs. imperative">
          <p className="prose">
            <code>[n*2 for n in nums if n % 2 == 0]</code> says <em>what</em> you
            want; a for-loop with an accumulator says <em>how</em> to build it step by
            step. Declarative code hides the bookkeeping (indexes, temp variables),
            leaving fewer places for off-by-one and mutation bugs to hide — at the cost
            of sometimes being less obvious for beginners.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'pure function', def: 'Same input → same output, with no side effects.' },
            { term: 'side effect', def: 'Any change outside the return value (I/O, globals, mutation).' },
            { term: 'higher-order function', def: 'A function that takes or returns other functions.' },
            { term: 'map / filter / reduce', def: 'Transform, select, and fold a collection.' },
            { term: 'immutability', def: 'Creating new values instead of mutating existing ones.' },
            { term: 'composition', def: 'Combining small functions into larger behavior.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which best describes a pure function?',
              options: [
                'It prints its result',
                'It returns the same output for the same input and has no side effects',
                'It uses global variables',
                'It never takes arguments',
              ],
              answer: 1,
              explain: 'Purity = deterministic output and no outside changes.',
            },
            {
              q: 'What does reduce (fold) do?',
              options: [
                'Filters a list',
                'Transforms each element',
                'Combines a collection into a single value',
                'Sorts the list',
              ],
              answer: 2,
              explain: 'reduce folds many values into one using an accumulator.',
            },
            {
              q: 'Why does immutability reduce bugs?',
              options: [
                'It uses less memory',
                'No shared value changes unexpectedly under other code',
                'It makes code shorter always',
                'It disables functions',
              ],
              answer: 1,
              explain: 'Immutable data cannot be mutated out from under you, avoiding aliasing/race bugs.',
            },

            {
              q: 'A pure function:',
              options: [
                'Reads global state',
              'Same inputs → same outputs, no side effects',
              'Must use classes',
              'Cannot call other functions',
              ],
              answer: 1,
              explain: 'Purity makes reasoning and testing easier.',
            },
            {
              q: '`map(f, items)` returns:',
              options: [
                'Filtered items',
              'f applied to each element (new iterable)',
              'Sum of items',
              'Sorted list',
              ],
              answer: 1,
              explain: 'map transforms every element with f.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>Pure functions</strong> are deterministic and side-effect free.</>,
            <><strong>map / filter / reduce</strong> replace manual loops for transforming data.</>,
            <><strong>Immutability</strong> avoids shared-state and aliasing bugs.</>,
            <>Purity enables <strong>caching, parallelism</strong>, and predictable UIs.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

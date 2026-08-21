import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Linear search',
    code: `def linear_search(items, target):
    steps = 0
    for i, value in enumerate(items):
        steps += 1
        if value == target:
            return i, steps
    return -1, steps

data = [3, 8, 1, 9, 4, 7, 2]
print("found at", linear_search(data, 7))
print("missing ", linear_search(data, 5))`,
  },
  {
    label: 'Binary search',
    code: `def binary_search(sorted_items, target):
    lo, hi = 0, len(sorted_items) - 1
    steps = 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steps += 1
        if sorted_items[mid] == target:
            return mid, steps
        if sorted_items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

data = list(range(0, 100, 3))  # 0, 3, 6, ... sorted
print("n =", len(data))
print("found  ", binary_search(data, 54))
print("missing", binary_search(data, 55))`,
  },
  {
    label: 'Compare step counts',
    code: `def linear(items, target):
    for i, value in enumerate(items):
        if value == target:
            return i + 1  # steps
    return len(items)

def binary(items, target):
    lo, hi, steps = 0, len(items) - 1, 0
    while lo <= hi:
        mid = (lo + hi) // 2
        steps += 1
        if items[mid] == target:
            return steps
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps

n = 1_000_000
items = list(range(n))
target = n - 1  # worst-ish for linear
print("linear steps ~", linear(items, target))
print("binary steps ~", binary(items, target))`,
  },
]

export default function SearchLesson() {
  return (
    <Lesson id="search">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Looking something up is one of the most common things code does: find a
          user by id, a word in a dictionary, a key in a sorted list. The algorithm
          you pick decides whether that lookup stays fast as data grows from dozens
          to millions of rows.
        </p>
        <Callout kind="why" title="The one idea">
          <strong>Linear search</strong> checks items one by one — fine for small
          lists. <strong>Binary search</strong> halves a <em>sorted</em> range each
          step, so one million items need only about twenty comparisons.
        </Callout>
      </Section>

      <Section id="model" title="Scan vs. bisect">
        <ul className="prose-list">
          <li>
            <strong>Linear (sequential) search</strong> walks the list from the
            start. Worst case is every element — <code>O(n)</code>. Works on any
            order.
          </li>
          <li>
            <strong>Binary search</strong> requires sorted data. Compare the middle;
            discard half; repeat. Worst case is about <code>log₂(n)</code> steps.
          </li>
          <li>
            The trade-off: binary search needs sorted input (or an index). Sorting
            once costs <code>O(n log n)</code>, then many lookups become cheap.
          </li>
          <li>
            Hash maps give average <code>O(1)</code> lookup by key — a different
            tool (see Data Structures) when you search by exact key, not by order.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Search it live">
        <p className="prose">
          Run linear and binary search, then compare how many steps each needs on a
          large sorted range. Watch binary search stay tiny while linear crawls.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Binary search</strong>, change the target to a value that is{' '}
          <em>not</em> in the list and confirm you get <code>-1</code>. In{' '}
          <strong>Compare step counts</strong>, try <code>n = 10</code> then{' '}
          <code>n = 1_000_000</code> and note how linear grows with <code>n</code>{' '}
          while binary barely moves.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Off-by-one and the loop invariant">
          <p className="prose">
            Binary search bugs are legendary: wrong mid, <code>lo = mid</code>{' '}
            instead of <code>mid + 1</code>, inclusive vs exclusive bounds. The
            invariant to keep is “if the target exists, it lies in{' '}
            <code>[lo, hi]</code>.” Every update must preserve that until the range
            collapses.
          </p>
        </UnderTheHood>
        <UnderTheHood title="When sorting is worth it">
          <p className="prose">
            If you search once, linear may beat “sort then binary.” If you search
            many times, pay for sorting (or keep a balanced tree / sorted structure)
            and reuse it. Databases build indexes for exactly this reason.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'linear search', def: 'Check each element in order until you find the target (or finish).' },
            { term: 'binary search', def: 'Repeatedly discard half of a sorted range based on a mid comparison.' },
            { term: 'sorted', def: 'Elements ordered so you can decide which half still might contain the target.' },
            { term: 'O(n)', def: 'Work grows proportionally with the number of items.' },
            { term: 'O(log n)', def: 'Work grows with how many times you can halve n (very slowly).' },
            { term: 'index', def: 'An auxiliary structure that makes lookups fast without scanning everything.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Binary search requires the input to be:',
              options: ['Random', 'Sorted', 'A hash map', 'Uniquely keyed strings'],
              answer: 1,
              explain: 'Halving only works when order tells you which half to keep.',
            },
            {
              q: 'Roughly how many binary-search steps for 1,000,000 sorted items?',
              options: ['About 20', 'About 1,000', 'About 1,000,000', 'Exactly 2'],
              answer: 0,
              explain: 'log₂(1e6) ≈ 20 comparisons in the worst case.',
            },
            {
              q: 'When is linear search often enough?',
              options: [
                'Only on sorted data',
                'Tiny lists, or a single scan where sorting would cost more',
                'Never — always use binary search',
                'Only for strings',
              ],
              answer: 1,
              explain: 'Constant factors and setup cost matter; linear is simple and fine for small n.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>Linear search</strong> is O(n) and works on any order.</>,
            <><strong>Binary search</strong> is O(log n) but needs sorted data.</>,
            <>Pay for sorting (or an index) when you look up many times.</>,
            <>Hash maps win for exact-key lookup; binary search wins on ordered ranges.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

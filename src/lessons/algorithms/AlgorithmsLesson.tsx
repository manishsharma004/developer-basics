import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { SortViz } from './SortViz.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Count nested-loop work',
    code: `def count_pairs(items):
    steps = 0
    for i in items:
        for j in items:
            steps += 1
    return steps

for n in [10, 20, 40]:
    print(f"n={n} → {count_pairs(range(n))} steps")`,
  },
  {
    label: 'Linear vs quadratic',
    code: `def linear_sum(items):
    total = 0
    for x in items:
        total += x
    return total

def quadratic_pairs(items):
  count = 0
  for i in items:
    for j in items:
      if i < j:
        count += 1
  return count

nums = list(range(100))
print("linear:", linear_sum(nums))
print("quadratic pairs:", quadratic_pairs(nums))`,
  },
  {
    label: 'Binary search steps',
    code: `def binary_search_steps(items, target):
    lo, hi = 0, len(items) - 1
    steps = 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if items[mid] == target:
            return steps
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return steps

nums = list(range(1, 1_000_001))
for target in [1, 500_000, 1_000_000, 999_999]:
    print(f"find {target}: {binary_search_steps(nums, target)} steps")`,
  },
]

export default function AlgorithmsLesson() {
  return (
    <Lesson id="algorithms">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Code that's fast on 100 items can grind to a halt on 100,000. Big-O
          notation is how developers predict that <em>before</em> it happens, and
          talk about it precisely. You don't need heavy math — just a feel for how
          work grows with input size.
        </p>
        <Callout kind="why" title="The one idea">
          Big-O describes how the number of steps grows as the input grows,
          ignoring constants. <code>O(n²)</code> means doubling the input
          quadruples the work; <code>O(n log n)</code> barely more than doubles it.
        </Callout>
      </Section>

      <Section id="model" title="Big-O in plain words">
        <ul className="prose-list">
          <li><strong>O(1)</strong> — constant: same work regardless of size (a hash-map lookup).</li>
          <li><strong>O(log n)</strong> — halves the problem each step (binary search).</li>
          <li><strong>O(n)</strong> — linear: one pass over the data.</li>
          <li><strong>O(n log n)</strong> — the best general sorting can do.</li>
          <li><strong>O(n²)</strong> — nested loops over the data; fine for small n, painful for large n.</li>
        </ul>
        <Callout kind="note">
          Big-O is about <em>growth</em>, not exact time. An O(n²) algorithm can beat
          an O(n log n) one for tiny inputs — but not for long.
        </Callout>
      </Section>

      <Section id="playground" title="Watch a sort">
        <p className="prose">
          These three sorts are all O(n²), but they do different amounts of work.
          Press play and watch the comparisons pile up — then generate a new array
          and compare the comparison counts.
        </p>
        <SortViz />
        <TryThis>
          Run <strong>Bubble</strong>, note the total comparisons, then run{' '}
          <strong>Selection</strong> on a new array of the same size. Selection
          always does about n²/2 comparisons; bubble and insertion do fewer when
          the data is already nearly sorted.
        </TryThis>
      </Section>

      <Section id="labs" title="Code lab">
        <p className="prose">
          Run these snippets and watch how step counts scale. The nested-loop
          counter quadruples when you double <code>n</code>; binary search barely
          budges even on a million items.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>Count nested-loop work</strong> and note the ratio between
          n=20 and n=40 — it should be close to 4×. Then run{' '}
          <strong>Binary search steps</strong> on a million items and see how few
          steps it needs.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Best, average, and worst case">
          <p className="prose">
            An algorithm's Big-O can differ by case. Insertion sort is O(n) on
            already-sorted data (best case) but O(n²) when reversed (worst case).
            When people say "O(n log n) sort" they usually mean the average/worst
            case of algorithms like merge sort or quicksort.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Why real languages don't use these sorts">
          <p className="prose">
            Standard libraries use O(n log n) algorithms (often a hybrid like
            Timsort) because the gap is enormous at scale: sorting a million items
            is ~20 million steps at O(n log n) versus ~a trillion at O(n²). The
            constant factors you'd optimize by hand are dwarfed by the exponent.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Space complexity matters too">
          <p className="prose">
            Big-O also applies to memory. Merge sort needs O(n) extra space to merge
            halves; quicksort is typically O(log n) stack depth for recursion.
            When data doesn't fit in RAM, I/O cost dominates — and the algorithm
            you pick changes again.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'Big-O', def: 'An upper bound on how work grows with input size, ignoring constants.' },
            { term: 'O(1)', def: 'Constant time — independent of input size.' },
            { term: 'O(n)', def: 'Linear — grows in direct proportion to input size.' },
            { term: 'O(n log n)', def: 'The practical best for comparison sorting.' },
            { term: 'O(n²)', def: 'Quadratic — typical of nested loops over the data.' },
            { term: 'worst case', def: 'The most-work input for an algorithm.' },
            { term: 'space complexity', def: 'How much extra memory an algorithm needs as input grows.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'If an O(n²) algorithm takes 1s on 1,000 items, roughly how long on 2,000?',
              options: ['~1s', '~2s', '~4s', '~8s'],
              answer: 2,
              explain: 'Doubling n multiplies O(n²) work by ~4.',
            },
            {
              q: 'Which complexity is best for large inputs?',
              options: ['O(n²)', 'O(n log n)', 'O(n!)', 'O(2ⁿ)'],
              answer: 1,
              explain: 'Among these, O(n log n) grows slowest for large n.',
            },
            {
              q: 'A hash-map lookup by key is typically:',
              options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
              answer: 0,
              explain: 'Average-case hash lookups are constant time.',
            },
            {
              q: 'O(n²) means doubling input size roughly:',
              options: ['Doubles work', 'Quadruples work', 'Halves work', 'No change'],
              answer: 1,
              explain: 'n² grows with the square — 2n → 4× comparisons in many quadratic algorithms.',
            },
            {
              q: 'Bubble sort is mainly useful for:',
              options: ['Production at scale', 'Teaching — simple but slow on large n', 'Sorting millions of rows', 'Hash tables'],
              answer: 1,
              explain: 'It is easy to visualize but O(n²) is too slow for large data.',
            },
            {
              q: 'Binary search on 1,000,000 sorted items needs at most about:',
              options: ['1,000,000 steps', '1,000 steps', '20 steps', '2 steps'],
              answer: 2,
              explain: 'log₂(1,000,000) ≈ 20 — each step halves the search space.',
            },
            {
              q: 'Space complexity measures:',
              options: ['How fast code runs', 'How much extra memory an algorithm uses', 'Disk size only', 'Network bandwidth'],
              answer: 1,
              explain: 'Algorithms can trade time for space (and vice versa).',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Big-O describes how work grows with input size, ignoring constants.</>,
            <>The same algorithm can have different best/worst cases.</>,
            <>O(n log n) sorts vastly outperform O(n²) ones at scale.</>,
            <>For small inputs, constants and simplicity can matter more than Big-O.</>,
            <>Don't forget <strong>space complexity</strong> — memory use scales too.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SortViz } from './SortViz.tsx'

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
          ]}
        />
      </Section>
    </Lesson>
  )
}

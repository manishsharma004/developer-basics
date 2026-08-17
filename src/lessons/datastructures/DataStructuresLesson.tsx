import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { HashMapViz } from './HashMapViz.tsx'

export default function DataStructuresLesson() {
  return (
    <Lesson id="datastructures">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Picking the right data structure is often the difference between code
          that's instant and code that crawls. You don't need dozens — three cover
          the vast majority of everyday programming: the <strong>array</strong>,
          the <strong>linked list</strong>, and the <strong>hash map</strong>.
        </p>
        <Callout kind="why" title="The one idea">
          Each structure trades off how fast you can look things up, insert, and
          remove. Knowing those trade-offs tells you which to reach for.
        </Callout>
      </Section>

      <Section id="model" title="The big three">
        <ul className="prose-list">
          <li>
            <strong>Array</strong> — items in a contiguous block. Instant access by
            index (<code>a[5]</code>), but inserting in the middle shifts everything
            after it.
          </li>
          <li>
            <strong>Linked list</strong> — each item points to the next. Cheap to
            insert/remove anywhere you already are, but finding the Nth item means
            walking from the start.
          </li>
          <li>
            <strong>Hash map</strong> (dict/object/map) — stores key→value pairs.
            A <em>hash function</em> turns a key into a bucket index, giving
            average <strong>O(1)</strong> lookup, insert, and delete.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="A hash map, live">
        <p className="prose">
          Below, a key is hashed to one of 8 buckets. Insert some keys and watch
          where they land. When two keys hash to the same bucket, that's a{' '}
          <strong>collision</strong> — the map just keeps a small list in that
          bucket (called chaining).
        </p>
        <HashMapViz />
        <TryThis>
          Insert a few keys and note the bucket each lands in. Keep adding until two
          share a bucket — you'll see them <em>chained</em> together and highlighted
          as a collision. Then look one up: the map jumps straight to its bucket.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why hash lookups are O(1) — usually">
          <p className="prose">
            A hash function spreads keys evenly across buckets, so on average each
            bucket holds very few items and a lookup is near-constant time. But if
            too many keys collide (a bad hash or a full table), buckets grow and
            lookups degrade toward O(n). Real hash maps <strong>resize</strong> (add
            buckets and rehash) when the load factor gets high to keep buckets short.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Cache-friendliness">
          <p className="prose">
            Arrays store elements next to each other in memory, so scanning one is
            very fast — the CPU cache loves sequential access. Linked lists scatter
            nodes across the heap, so even though "insert is O(1)", traversing one
            can be slower in practice than an array. Big-O isn't the whole story.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'array', def: 'Contiguous, index-addressable storage; O(1) access by index.' },
            { term: 'linked list', def: 'Nodes each pointing to the next; O(1) insert where you are, O(n) to find.' },
            { term: 'hash map', def: 'Key→value store using a hash function for O(1) average operations.' },
            { term: 'hash function', def: 'Maps a key to a bucket index.' },
            { term: 'collision', def: 'Two keys hashing to the same bucket; resolved by chaining.' },
            { term: 'load factor', def: 'Entries ÷ buckets; high values trigger a resize.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'You need fast lookup by a string id. Which structure fits best?',
              options: ['Array', 'Linked list', 'Hash map', 'None'],
              answer: 2,
              explain: 'Hash maps give average O(1) lookup by key.',
            },
            {
              q: 'What is a collision in a hash map?',
              options: ['The map is full', 'Two keys hash to the same bucket', 'A key is missing', 'The hash function crashed'],
              answer: 1,
              explain: 'Different keys can map to the same bucket; chaining stores both there.',
            },
            {
              q: 'Why can an array be faster to scan than a linked list even though inserts are cheaper in a list?',
              options: ['Arrays are shorter', 'Contiguous memory is cache-friendly', 'Lists use more CPU', 'They are the same'],
              answer: 1,
              explain: 'Sequential memory access benefits from CPU caching; scattered list nodes do not.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Arrays: O(1) index access, costly mid-insertions.</>,
            <>Linked lists: cheap local insert/remove, O(n) to find by position.</>,
            <>Hash maps: average O(1) by key via a hash function; collisions chain.</>,
            <>High load factor triggers a resize to keep buckets short.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

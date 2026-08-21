import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { HashMapViz } from './HashMapViz.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'List vs dict lookup',
    code: `import time

names = [f"user_{i}" for i in range(10_000)]
lookup_list = "user_9999"
lookup_miss = "user_missing"

# list scan — O(n)
start = time.perf_counter()
found = lookup_list in names
list_time = time.perf_counter() - start

# dict lookup — O(1) average
name_set = {n: True for n in names}
start = time.perf_counter()
found = lookup_list in name_set
dict_time = time.perf_counter() - start

print("list scan:", round(list_time * 1000, 3), "ms")
print("dict lookup:", round(dict_time * 1000, 3), "ms")`,
  },
  {
    label: 'Stack with a list',
    code: `stack = []

def push(item):
    stack.append(item)

def pop():
    return stack.pop()

push("first")
push("second")
push("third")
print("pop:", pop())
print("pop:", pop())
print("remaining:", stack)`,
  },
  {
    label: 'Queue with deque',
    code: `from collections import deque

queue = deque()

def enqueue(item):
    queue.append(item)

def dequeue():
    return queue.popleft()

for task in ["email", "backup", "report"]:
    enqueue(task)

while queue:
    print("processing:", dequeue())`,
  },
]

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
        <Callout kind="tip" title="Stacks and queues">
          A <strong>stack</strong> (last-in, first-out) and a <strong>queue</strong>{' '}
          (first-in, first-out) are patterns built on top of arrays or linked lists —
          not separate structures, but rules for how you add and remove.
        </Callout>
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

      <Section id="labs" title="Code lab">
        <p className="prose">
          Feel the lookup-speed difference between scanning a list and jumping into a
          dict. Then build a stack and queue — two patterns you'll use constantly
          (undo history, task scheduling, BFS).
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>List vs dict lookup</strong> and compare timings. Increase the
          list size in the code to 100,000 and re-run — the gap widens dramatically.
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
        <UnderTheHood title="Python's list is a dynamic array">
          <p className="prose">
            Python lists are implemented as dynamic arrays — contiguous storage that
            grows by over-allocating when full. <code>append</code> is amortized O(1);
            inserting at the front is O(n) because everything shifts.{' '}
            <code>collections.deque</code> uses a doubly-linked block structure for
            O(1) operations at both ends.
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
            { term: 'stack / queue', def: 'LIFO and FIFO access patterns built on lists or deques.' },
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
            {
              q: 'Hash map average lookup time:',
              options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
              answer: 2,
              explain: 'With a good hash and load factor, lookups are constant average time.',
            },
            {
              q: 'Linked list vs array for front insertions:',
              options: ['Array is always faster', 'Linked list avoids shifting elements', 'Both are O(1)', 'Neither supports insert'],
              answer: 1,
              explain: 'Arrays must shift elements; linked lists update pointers.',
            },
            {
              q: 'A queue processes items in:',
              options: ['Random order', 'Last-in, first-out', 'First-in, first-out', 'Sorted order'],
              answer: 2,
              explain: 'Queues dequeue from the front — FIFO order.',
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
            <>Stacks (LIFO) and queues (FIFO) are access patterns on top of lists.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

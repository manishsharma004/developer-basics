import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { LruCacheViz } from './LruCache.tsx'

export default function CachingLesson() {
  return (
    <Lesson id="caching">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Caching is one of the highest-leverage performance tools there is: keep a
          copy of expensive-to-get data close by, and future requests are instant.
          Browsers, CPUs, databases, and CDNs all cache. The catch is capacity —
          you can't keep everything, so you must decide what to <em>evict</em>.
        </p>
        <Callout kind="why" title="The one idea">
          A cache trades memory for speed. When it's full, an{' '}
          <strong>eviction policy</strong> decides what to drop.{' '}
          <strong>LRU</strong> (least-recently-used) drops whatever hasn't been
          touched for the longest.
        </Callout>
      </Section>

      <Section id="model" title="Hits, misses & eviction">
        <ul className="prose-list">
          <li>A <strong>hit</strong> — the item was in the cache (fast).</li>
          <li>A <strong>miss</strong> — it wasn't, so you fetch it and store it.</li>
          <li>An <strong>eviction</strong> — the cache is full, so the policy removes something to make room.</li>
        </ul>
        <p className="prose">
          The <strong>hit rate</strong> (hits ÷ accesses) measures how well the
          cache is working. Bigger caches usually hit more — up to a point.
        </p>
      </Section>

      <Section id="playground" title="Drive an LRU cache">
        <p className="prose">
          Access keys and watch the cache reorder (most-recently-used moves to the
          front) and evict from the back when full. Change the capacity to see the
          hit rate respond.
        </p>
        <LruCacheViz />
        <TryThis>
          Set capacity to <strong>2</strong> and click <strong>Run sample</strong> —
          note the low hit rate and frequent evictions. Raise capacity to{' '}
          <strong>4</strong> and run again: more of the working set fits, so the hit
          rate climbs.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="How LRU is implemented in O(1)">
          <p className="prose">
            A fast LRU uses a <strong>hash map</strong> (key → node) plus a{' '}
            <strong>doubly linked list</strong> ordered by recency. A lookup finds
            the node via the map and moves it to the front in constant time;
            eviction removes the tail. Both O(1) — the two structures from the Data
            Structures lesson working together.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Invalidation: the hard part">
          <p className="prose">
            "There are only two hard things in computer science: cache invalidation
            and naming things." A cache can serve <strong>stale</strong> data if the
            source changed. Strategies include time-to-live (TTL) expiry, explicit
            invalidation on write, and versioned keys. Choosing wrong gives you
            either stale results or a uselessly cold cache.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'cache hit / miss', def: 'Whether requested data was already cached.' },
            { term: 'eviction policy', def: 'The rule for what to remove when full (e.g. LRU).' },
            { term: 'LRU', def: 'Least-recently-used: evict what was accessed longest ago.' },
            { term: 'hit rate', def: 'Hits divided by total accesses.' },
            { term: 'TTL', def: 'Time-to-live before a cached entry expires.' },
            { term: 'invalidation', def: 'Removing/refreshing entries that are now stale.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What does an LRU cache evict when it is full?',
              options: ['A random entry', 'The most-recently-used entry', 'The least-recently-used entry', 'The largest entry'],
              answer: 2,
              explain: 'LRU drops whatever has gone the longest without being accessed.',
            },
            {
              q: 'A cache is returning outdated data after the source changed. This is a problem of:',
              options: ['Eviction', 'Invalidation', 'Hashing', 'Sorting'],
              answer: 1,
              explain: 'Serving stale data is a cache invalidation problem.',
            },
            {
              q: 'Increasing cache capacity generally does what to the hit rate?',
              options: ['Lowers it', 'Raises it, up to a point', 'No effect', 'Makes it random'],
              answer: 1,
              explain: 'More capacity fits more of the working set, improving hits until diminishing returns.',
            },

            {
              q: 'A cache miss means:',
              options: [
                'Data was deleted',
              'Requested key was not in cache — must fetch source',
              'TLS failed',
              'Disk full',
              ],
              answer: 1,
              explain: 'Misses are slower because you pay the full fetch cost.',
            },
            {
              q: 'LRU evicts:',
              options: [
                'Random entry',
              'Least recently used item',
              'Largest item',
              'Newest item',
              ],
              answer: 1,
              explain: 'LRU drops the stale entry when capacity is full.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Caches trade memory for speed; <strong>hit rate</strong> measures success.</>,
            <>When full, an <strong>eviction policy</strong> (like LRU) picks what to drop.</>,
            <>Fast LRU = hash map + doubly linked list, all O(1).</>,
            <>The hard problem is <strong>invalidation</strong> — avoiding stale data.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { LruCacheViz } from './LruCache.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Simple dict cache',
    code: `cache = {}

def fetch_user(user_id):
    if user_id in cache:
        print(f"  HIT  user_{user_id}")
        return cache[user_id]
    print(f"  MISS user_{user_id} — fetching from DB")
    data = {"id": user_id, "name": f"User {user_id}"}
    cache[user_id] = data
    return data

for uid in [1, 2, 1, 3, 2, 1]:
    fetch_user(uid)
print("cache keys:", list(cache.keys()))`,
  },
  {
    label: 'TTL expiry',
    code: `import time

cache = {}

def get(key, ttl=2):
    entry = cache.get(key)
    if entry and time.time() - entry["ts"] < ttl:
        return entry["value"], "HIT"
    value = f"fresh-{key}"
    cache[key] = {"value": value, "ts": time.time()}
    return value, "MISS"

for i in range(3):
    val, status = get("session")
    print(f"attempt {i+1}: {status} → {val}")
    time.sleep(1)`,
  },
  {
    label: 'LRU with OrderedDict',
    code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            evicted = self.cache.popitem(last=False)
            print(f"  evicted {evicted[0]}")

c = LRUCache(2)
c.put("a", 1)
c.put("b", 2)
c.get("a")
c.put("c", 3)
print("final:", dict(c.cache))`,
  },
]

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

      <Section id="labs" title="Code lab">
        <p className="prose">
          Build a cache from a plain dict, add TTL expiry so entries go stale, then
          see how Python's <code>OrderedDict</code> makes LRU eviction straightforward.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>Simple dict cache</strong> and count hits vs misses in the
          output. Then run <strong>LRU with OrderedDict</strong> and trace which key
          gets evicted when capacity is exceeded.
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
        <UnderTheHood title="Cache levels in real systems">
          <p className="prose">
            Caches nest: CPU L1/L2/L3, OS page cache, database buffer pool, Redis,
            CDN edge nodes, browser cache. Each level is faster but smaller. A miss
            at one level falls through to the next — and each miss costs more latency.
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
            { term: 'working set', def: 'The data actually accessed during a workload.' },
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
              options: ['Data was deleted', 'Requested key was not in cache — must fetch source', 'TLS failed', 'Disk full'],
              answer: 1,
              explain: 'Misses are slower because you pay the full fetch cost.',
            },
            {
              q: 'LRU evicts:',
              options: ['Random entry', 'Least recently used item', 'Largest item', 'Newest item'],
              answer: 1,
              explain: 'LRU drops the stale entry when capacity is full.',
            },
            {
              q: 'TTL on a cache entry means:',
              options: ['It never expires', 'It expires after a set time', 'It is encrypted', 'It is read-only'],
              answer: 1,
              explain: 'Time-to-live forces a refresh after the deadline, reducing staleness.',
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
            <>Real systems stack caches at every level from CPU to CDN.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

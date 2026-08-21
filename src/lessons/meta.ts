// Pure metadata for every lesson. This module intentionally imports no React
// components so lesson components can read it without creating import cycles.
// Adding a lesson = add an entry here + a component wired up in `index.tsx`.

import { databasesLessonsMeta } from './databases/chapterMeta.ts'
import { fastapiLessonsMeta } from './fastapi/chapterMeta.ts'
import { mongodbLessonsMeta } from './mongodb/chapterMeta.ts'
import { reactLessonsMeta } from './react/chapterMeta.ts'
import { sqlLessonsMeta } from './sql/chapterMeta.ts'
import { webLessonsMeta } from './web/chapterMeta.ts'

export type Level = 'Beginner' | 'Intermediate' | 'Advanced'

export interface SectionMeta {
  id: string
  title: string
}

// A thematic module that groups related chapters together in the nav and on the
// home page. The order of `groups` defines the order chapters appear in.
export interface LessonGroup {
  id: string
  title: string
  icon: string
  blurb: string
}

export interface LessonMeta {
  id: string
  path: string
  title: string
  tagline: string
  icon: string
  level: Level
  minutes: number
  summary: string
  sections: SectionMeta[]
  group: string
}

const CLOSING: SectionMeta[] = [
  { id: 'terms', title: 'Key terms' },
  { id: 'check', title: 'Check yourself' },
  { id: 'recap', title: 'Recap' },
]

// Modules, in the order learners should encounter them. Each chapter below
// declares which module it belongs to via its `group` id.
export const groups: LessonGroup[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    icon: '🧱',
    blurb: 'The building blocks every program is made of: variables, control flow, data, encoding, memory, time, and failure.',
  },
  {
    id: 'systems',
    title: 'Systems & the OS',
    icon: '🖥️',
    blurb: 'How your code actually runs on a real machine and shares its resources.',
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    icon: '🧮',
    blurb: 'Organize data well, search it efficiently, and reason about whether your code stays fast at scale.',
  },
  {
    id: 'databases',
    title: 'Databases & Persistence',
    icon: '🗃️',
    blurb: 'Why apps store data outside memory — models, ACID, and choosing SQL vs documents.',
  },
  {
    id: 'sql',
    title: 'SQL & Relational Databases',
    icon: '🗄️',
    blurb: 'Tables, queries, joins, connectors, and a live SQLite playground.',
  },
  {
    id: 'mongodb',
    title: 'MongoDB & Documents',
    icon: '🍃',
    blurb: 'Flexible documents, aggregation pipelines, PyMongo, and Motor.',
  },
  {
    id: 'persistence',
    title: 'Caching & Queues',
    icon: '💾',
    blurb: 'Trade memory for speed with caches, and decouple services with message queues.',
  },
  {
    id: 'web',
    title: 'Networking & the Web',
    icon: '🌐',
    blurb: 'HTTP, DNS, TLS, load balancing, reverse proxies, API gateways, and rate limits.',
  },
  {
    id: 'fastapi',
    title: 'FastAPI',
    icon: '⚡',
    blurb: 'Build modern Python HTTP APIs — routes, validation, dependencies, async, and CORS.',
  },
  {
    id: 'react',
    title: 'React',
    icon: '⚛️',
    blurb: 'Interactive UIs with components, state, hooks, Context, and external stores.',
  },
  {
    id: 'security',
    title: 'Security & Cryptography',
    icon: '🔐',
    blurb: 'Protect data and users — from hashing fundamentals to everyday defenses.',
  },
  {
    id: 'tooling',
    title: 'Tooling & Workflow',
    icon: '🛠️',
    blurb: 'The everyday craft of shipping code: the shell, version control, tests, and debugging.',
  },
  {
    id: 'design',
    title: 'Programming & Design',
    icon: '🎨',
    blurb: 'Structure code that other people (including future you) can actually maintain.',
  },
]

export const lessonsMeta: LessonMeta[] = [
  // ── Foundations ────────────────────────────────────────────────────────
  {
    id: 'variables',
    path: '/lessons/variables',
    title: 'Variables & Types',
    tagline: 'Names for values — and the types that decide what you can do with them.',
    icon: '🏷️',
    level: 'Beginner',
    minutes: 15,
    summary:
      'Learn how variables bind to values, explore Python’s core types, dynamic typing, truthiness, and safe type conversion with runnable snippets.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Names, types & values' },
      { id: 'playground', title: 'Explore types live' },
      { id: 'casting', title: 'Converting between types' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'controlflow',
    path: '/lessons/controlflow',
    title: 'Control Flow & Logic',
    tagline: 'Branching, looping, and boolean logic — how programs choose what runs next.',
    icon: '🔀',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Master if/elif/else, for and while loops, break/continue, and boolean combinations with editable Python examples.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Branching & loops' },
      { id: 'playground', title: 'Run the branches' },
      { id: 'logic', title: 'Boolean logic' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'data',
    path: '/lessons/data',
    title: 'Data & Encoding',
    tagline: 'Everything is bits: numbers, text, and how they are represented.',
    icon: '🔢',
    level: 'Beginner',
    minutes: 16,
    summary:
      'Learn how computers store numbers in binary and hex, how text becomes bytes via Unicode/UTF-8, and convert between them with an interactive tool.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Bits, bytes & bases' },
      { id: 'playground', title: 'Convert it live' },
      { id: 'text', title: 'Text is bytes too' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'json',
    path: '/lessons/json',
    title: 'JSON & Serialization',
    tagline: 'Turn objects into text and back — the lingua franca of APIs and config.',
    icon: '📦',
    level: 'Beginner',
    minutes: 16,
    summary:
      'Learn what serialization is, which types JSON can represent, and practice dumping and loading real JSON in Python.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Objects become text' },
      { id: 'playground', title: 'Serialize it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'floatingpoint',
    path: '/lessons/floatingpoint',
    title: 'Floating Point & Precision',
    tagline: 'Why 0.1 + 0.2 ≠ 0.3 — and how to compare numbers safely.',
    icon: '🔬',
    level: 'Beginner',
    minutes: 16,
    summary:
      'See IEEE float approximation in action, compare with isclose, and learn integer-cents and Decimal patterns for money.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Approximation, not exact' },
      { id: 'playground', title: 'See the bits drift' },
      { id: 'compare', title: 'Comparing floats safely' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'memory',
    path: '/lessons/memory',
    title: 'Memory: Stack & Heap',
    tagline: 'Variables, references, and where things live while your program runs.',
    icon: '🧠',
    level: 'Intermediate',
    minutes: 27,
    summary:
      'See the difference between the stack and the heap, understand value vs. reference semantics, shallow vs deep copy, watch memory grow and shrink, and learn how garbage collection works.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'refs', title: 'Values vs. references' },
      { id: 'immutability', title: 'Immutable vs mutable' },
      { id: 'copying', title: 'Shallow vs deep copy' },
      { id: 'playground', title: 'Stack & heap, live' },
      { id: 'gc', title: 'Garbage & leaks' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'time',
    path: '/lessons/time',
    title: 'Time, Dates & Timezones',
    tagline: 'Epochs, UTC, and the bugs that come from getting time wrong.',
    icon: '🕒',
    level: 'Beginner',
    minutes: 18,
    summary:
      'Learn Unix timestamps, UTC vs. local time, offsets, and common format pitfalls — and convert between an epoch and a human date interactively.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Epoch, UTC & offsets' },
      { id: 'playground', title: 'Convert time' },
      { id: 'formats', title: 'Formats & pitfalls' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'errors',
    path: '/lessons/errors',
    title: 'Errors & Exceptions',
    tagline: 'How failures propagate, and how to handle them without hiding them.',
    icon: '🧯',
    level: 'Beginner',
    minutes: 16,
    summary:
      'Understand exceptions, try/except/finally, and stack traces by triggering and catching real errors in Python.',
    group: 'foundations',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'How errors propagate' },
      { id: 'playground', title: 'Catch it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Systems & the OS ───────────────────────────────────────────────────
  {
    id: 'filesystem',
    path: '/lessons/filesystem',
    title: 'The Filesystem',
    tagline: 'Where your code and data live: files, folders, paths, links, and permissions.',
    icon: '🗂️',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Navigate a real filesystem, master absolute vs. relative paths, read permissions, copy and link files, and learn what a file really is under the hood.',
    group: 'systems',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The mental model' },
      { id: 'playground', title: 'Try it live' },
      { id: 'ops', title: 'Working with files' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'process',
    path: '/lessons/process',
    title: 'Processes & the CPU',
    tagline: 'How your program actually runs, and how the OS shares one CPU across many.',
    icon: '⚙️',
    level: 'Beginner',
    minutes: 19,
    summary:
      'Learn what a process is, how fork/exec starts one, the states it moves through, and how a scheduler decides who runs next — by driving a real simulation.',
    group: 'systems',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'What is a process?' },
      { id: 'playground', title: 'Schedule it live' },
      { id: 'lifecycle', title: 'How processes start' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'concurrency',
    path: '/lessons/concurrency',
    title: 'Concurrency & Races',
    tagline: 'Doing many things at once — and the subtle bugs that come with it.',
    icon: '🔀',
    level: 'Intermediate',
    minutes: 28,
    summary:
      'Understand threads vs. processes, async vs parallelism, why shared mutable state causes race conditions, how locks fix them, and how deadlock happens — with a live interleaving simulation.',
    group: 'systems',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Threads & sharing' },
      { id: 'async', title: 'Concurrency vs parallelism' },
      { id: 'playground', title: 'Race it live' },
      { id: 'deadlock', title: 'Deadlock & ordering' },
      { id: 'labs', title: 'Code labs' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'compute',
    path: '/lessons/compute',
    title: 'Compute Instances',
    tagline: 'VMs, containers, and serverless — where your code actually runs, and how it scales.',
    icon: '🖥️',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Compare VMs, containers, and serverless, then drive an autoscaling simulator to see how instances, load, capacity, and cost interact.',
    group: 'systems',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'VMs, containers, serverless' },
      { id: 'playground', title: 'Scale it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Data Structures & Algorithms ───────────────────────────────────────
  {
    id: 'datastructures',
    path: '/lessons/datastructures',
    title: 'Data Structures',
    tagline: 'Arrays, linked lists, and hash maps — and when to reach for each.',
    icon: '🧱',
    level: 'Intermediate',
    minutes: 22,
    summary:
      'See how a hash map turns keys into buckets, why lookups are O(1), what a collision is, and how arrays differ from linked lists — with runnable stack and queue labs.',
    group: 'dsa',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The big three' },
      { id: 'playground', title: 'A hash map, live' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'algorithms',
    path: '/lessons/algorithms',
    title: 'Algorithms & Big-O',
    tagline: 'How to reason about whether code will still be fast at scale.',
    icon: '📈',
    level: 'Intermediate',
    minutes: 22,
    summary:
      'Build intuition for Big-O notation, watch sorting algorithms run step by step, and run Python labs that count nested-loop work vs binary search.',
    group: 'dsa',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Big-O in plain words' },
      { id: 'playground', title: 'Watch a sort' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'search',
    path: '/lessons/search',
    title: 'Searching & Binary Search',
    tagline: 'Find a needle in a haystack — and why sorted data makes it fast.',
    icon: '🔍',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Compare linear and binary search, count the steps each takes, and learn when sorting first is worth it.',
    group: 'dsa',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Scan vs. bisect' },
      { id: 'playground', title: 'Search it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'recursion',
    path: '/lessons/recursion',
    title: 'Recursion',
    tagline: 'Functions that call themselves — and how to reason about them.',
    icon: '🔁',
    level: 'Beginner',
    minutes: 20,
    summary:
      'Understand base cases and recursive cases, visualize the call tree, and run Python labs for factorial, memoized Fibonacci, and tree walks.',
    group: 'dsa',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Base case & recursion' },
      { id: 'playground', title: 'Trace the calls' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'trees',
    path: '/lessons/trees',
    title: 'Trees & Graphs',
    tagline: 'Hierarchies and networks: the shapes behind filesystems, routing, and search.',
    icon: '🌳',
    level: 'Intermediate',
    minutes: 19,
    summary:
      'Model data as trees and graphs, then traverse them depth-first and breadth-first to search and order nodes — by running real traversals in Python.',
    group: 'dsa',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Trees, graphs & traversal' },
      { id: 'playground', title: 'Traverse it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Databases (foundations) ────────────────────────────────────────────
  ...databasesLessonsMeta,

  // ── SQL ────────────────────────────────────────────────────────────────
  ...sqlLessonsMeta,

  // ── MongoDB ────────────────────────────────────────────────────────────
  ...mongodbLessonsMeta,

  // ── Caching & Queues ───────────────────────────────────────────────────
  {
    id: 'caching',
    path: '/lessons/caching',
    title: 'Caching & LRU',
    tagline: 'Trading memory for speed — and deciding what to forget.',
    icon: '⚡',
    level: 'Intermediate',
    minutes: 21,
    summary:
      'Learn hits, misses, and eviction, drive a live LRU cache, and build dict caches with TTL and OrderedDict eviction in Python.',
    group: 'persistence',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Hits, misses & eviction' },
      { id: 'playground', title: 'Drive an LRU cache' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'queues',
    path: '/lessons/queues',
    title: 'Queue Architecture',
    tagline: 'Decoupling producers from consumers with message queues and backpressure.',
    icon: '📨',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Learn producers, consumers, brokers, and backpressure, then run a live queue where you can outrun the consumers and watch the backlog build.',
    group: 'persistence',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Producers, consumers, brokers' },
      { id: 'playground', title: 'Run a live queue' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Networking & the Web ───────────────────────────────────────────────
  {
    id: 'network',
    path: '/lessons/network',
    title: 'How the Web Talks',
    tagline: 'What really happens between typing a URL and seeing a response.',
    icon: '🌐',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Follow a request through DNS, the TCP handshake, TLS, and HTTP — step by step — learn methods and status codes, and see where latency comes from.',
    group: 'web',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'url', title: 'Anatomy of a URL' },
      { id: 'playground', title: 'Trace a request' },
      { id: 'http', title: 'Methods & status codes' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'loadbalancing',
    path: '/lessons/loadbalancing',
    title: 'Load Balancing',
    tagline: 'Spread traffic across backends — round robin, least connections, and overload.',
    icon: '⚖️',
    level: 'Intermediate',
    minutes: 17,
    summary:
      'Compare load-balancing algorithms, send bursts to capacity-limited servers, and see how L4/L7 balancers keep services available at scale.',
    group: 'web',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Algorithms' },
      { id: 'playground', title: 'Balance traffic live' },
      { id: 'layers', title: 'Layer 4 vs layer 7' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'apis',
    path: '/lessons/apis',
    title: 'APIs & REST',
    tagline: 'How programs talk to each other over HTTP with resources, verbs, and JSON.',
    icon: '🔌',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Learn how REST maps HTTP methods to actions on resources, how JSON carries data, and what status codes mean — by building and parsing real responses in Python.',
    group: 'web',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Resources, verbs & JSON' },
      { id: 'playground', title: 'Build a JSON API' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'auth',
    path: '/lessons/auth',
    title: 'Auth, Sessions & Tokens',
    tagline: 'Proving who you are and what you may do — passwords, sessions, and tokens.',
    icon: '🪪',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Separate authentication from authorization, see why passwords are salted and hashed, and decode a JWT to learn why a token is signed, not secret.',
    group: 'web',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'AuthN vs. AuthZ' },
      { id: 'playground', title: 'Decode a token' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  ...webLessonsMeta,
  ...fastapiLessonsMeta,
  ...reactLessonsMeta,

  // ── Security & Cryptography ────────────────────────────────────────────
  {
    id: 'crypto',
    path: '/lessons/crypto',
    title: 'Hashing & Cryptography',
    tagline: 'Fingerprints, secrets, and why you never store plain passwords.',
    icon: '🔐',
    level: 'Intermediate',
    minutes: 21,
    summary:
      'Understand hashing vs. encryption, see SHA-256 avalanche in the browser, and run Python labs for salted passwords and tamper detection.',
    group: 'security',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Hash vs. encrypt' },
      { id: 'playground', title: 'Hash it live' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'security',
    path: '/lessons/security',
    title: 'Security Basics',
    tagline: 'The everyday defenses: injection, escaping, secrets, and least privilege.',
    icon: '🛡️',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Think like an attacker to spot injection and XSS, then fix them with parameterized queries and output escaping — with runnable before/after examples.',
    group: 'security',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Think like an attacker' },
      { id: 'playground', title: 'Break it, then fix it' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Tooling & Workflow ─────────────────────────────────────────────────
  {
    id: 'cli',
    path: '/lessons/cli',
    title: 'The Command Line & Pipes',
    tagline: 'Small programs, composed: how the shell turns tools into pipelines.',
    icon: '🐚',
    level: 'Beginner',
    minutes: 16,
    summary:
      'Learn how stdin/stdout and the pipe operator let you chain tiny programs into powerful one-liners — by composing a real pipeline.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Streams & pipes' },
      { id: 'playground', title: 'Compose a pipeline' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'git',
    path: '/lessons/git',
    title: 'Version Control with Git',
    tagline: 'How teams track history, branch, and merge without stepping on each other.',
    icon: '🌿',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Understand commits, branches, and merges as a graph of snapshots — then build a small project history interactively.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Commits & branches' },
      { id: 'playground', title: 'Build a history' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'regex',
    path: '/lessons/regex',
    title: 'Regular Expressions',
    tagline: 'A mini-language for describing and matching patterns in text.',
    icon: '🔎',
    level: 'Beginner',
    minutes: 17,
    summary:
      'Learn the core regex building blocks and test patterns against your own text with live match highlighting.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The building blocks' },
      { id: 'playground', title: 'Test a pattern' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'testing',
    path: '/lessons/testing',
    title: 'Testing & TDD',
    tagline: 'Confidence to change code: assertions, unit tests, and red-green-refactor.',
    icon: '✅',
    level: 'Beginner',
    minutes: 30,
    summary:
      'Learn the testing pyramid, TDD red-green-refactor, Arrange–Act–Assert, mocking and pytest patterns, frontend testing basics, and running tests in CI.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The testing pyramid' },
      { id: 'tdd', title: 'Test-Driven Development' },
      { id: 'unit', title: 'What to test in a unit' },
      { id: 'aaa', title: 'Arrange–Act–Assert' },
      { id: 'mocking', title: 'Mocks, stubs, and fakes' },
      { id: 'pytest', title: 'pytest-style tests' },
      { id: 'frontend', title: 'Frontend testing' },
      { id: 'playground', title: 'Red, green, refactor' },
      { id: 'ci', title: 'Tests in CI' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'cicd',
    path: '/lessons/cicd',
    title: 'CI/CD Pipelines',
    tagline: 'Automated lint, test, build, and deploy on every change.',
    icon: '🔄',
    level: 'Intermediate',
    minutes: 17,
    summary:
      'Walk through a four-stage CI pipeline, simulate failures, and learn how branch protection keeps broken code off main.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Pipeline stages' },
      { id: 'playground', title: 'Run a pipeline' },
      { id: 'workflow', title: 'CI vs CD' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'debugging',
    path: '/lessons/debugging',
    title: 'Debugging & Logging',
    tagline: 'Reproduce, observe, and fix — with prints, logs, and asserts.',
    icon: '🐛',
    level: 'Beginner',
    minutes: 28,
    summary:
      'Follow a repeatable debugging loop, use Python tracebacks pdb and logging, debug frontend with DevTools and React tools, and practice probes with live snippets.',
    group: 'tooling',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'general', title: 'General practices' },
      { id: 'python', title: 'Debugging Python' },
      { id: 'frontend', title: 'Debugging frontend' },
      { id: 'playground', title: 'Probe it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },

  // ── Programming & Design ───────────────────────────────────────────────
  {
    id: 'classes',
    path: '/lessons/classes',
    title: 'Classes & Objects',
    tagline: 'Blueprints and instances: the atom of object-oriented design.',
    icon: '🧩',
    level: 'Beginner',
    minutes: 20,
    summary:
      'Understand how a class is a blueprint and objects are instances with their own state but shared behavior — with interactive and Python code labs.',
    group: 'design',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Blueprints & instances' },
      { id: 'playground', title: 'Make some objects' },
      { id: 'labs', title: 'Code lab' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'oop',
    path: '/lessons/oop',
    title: 'Object-Oriented Programming',
    tagline: 'Encapsulation, inheritance, polymorphism, abstraction — and SOLID.',
    icon: '🧬',
    level: 'Intermediate',
    minutes: 21,
    summary:
      'Master the four pillars of OOP with runnable Python examples, then learn the five SOLID principles that keep object-oriented code maintainable.',
    group: 'design',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The four pillars' },
      { id: 'playground', title: 'OOP in real code' },
      { id: 'solid', title: 'The SOLID principles' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'patterns',
    path: '/lessons/patterns',
    title: 'Design Patterns',
    tagline: 'The catalog of reusable solutions every engineer should recognize.',
    icon: '🏛️',
    level: 'Advanced',
    minutes: 27,
    summary:
      'Browse the full catalog of Gang-of-Four patterns plus common industry ones — grouped, searchable, each with intent, a runnable example, and real-world uses.',
    group: 'design',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Three categories' },
      { id: 'playground', title: 'The pattern catalog' },
      { id: 'hood', title: 'Using patterns well' },
      ...CLOSING,
    ],
  },
  {
    id: 'functional',
    path: '/lessons/functional',
    title: 'Functional Programming',
    tagline: 'Pure functions, immutability, and composing behavior from small pieces.',
    icon: 'λ',
    level: 'Intermediate',
    minutes: 18,
    summary:
      'Understand pure functions and side effects, replace loops with map/filter/reduce, and see why immutability makes code easier to reason about — all runnable.',
    group: 'design',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Pure functions & higher-order' },
      { id: 'playground', title: 'map / filter / reduce' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
]

export function getLessonMeta(id: string): LessonMeta | undefined {
  return lessonsMeta.find((l) => l.id === id)
}

export function getNextLesson(id: string): LessonMeta | undefined {
  const idx = lessonsMeta.findIndex((l) => l.id === id)
  if (idx === -1 || idx === lessonsMeta.length - 1) return undefined
  return lessonsMeta[idx + 1]
}

export function getGroup(id: string): LessonGroup | undefined {
  return groups.find((g) => g.id === id)
}

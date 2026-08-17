// Pure metadata for every lesson. This module intentionally imports no React
// components so lesson components can read it without creating import cycles.
// Adding a lesson = add an entry here + a component wired up in `index.tsx`.

export type Level = 'Beginner' | 'Intermediate'

export interface SectionMeta {
  id: string
  title: string
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
}

const CLOSING: SectionMeta[] = [
  { id: 'terms', title: 'Key terms' },
  { id: 'check', title: 'Check yourself' },
  { id: 'recap', title: 'Recap' },
]

export const lessonsMeta: LessonMeta[] = [
  {
    id: 'filesystem',
    path: '/lessons/filesystem',
    title: 'The Filesystem',
    tagline: 'Where your code and data live: files, folders, paths, links, and permissions.',
    icon: '🗂️',
    level: 'Beginner',
    minutes: 14,
    summary:
      'Navigate a real filesystem, master absolute vs. relative paths, read permissions, copy and link files, and learn what a file really is under the hood.',
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
    minutes: 16,
    summary:
      'Learn what a process is, how fork/exec starts one, the states it moves through, and how a scheduler decides who runs next — by driving a real simulation.',
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
    id: 'memory',
    path: '/lessons/memory',
    title: 'Memory: Stack & Heap',
    tagline: 'Variables, references, and where things live while your program runs.',
    icon: '🧠',
    level: 'Intermediate',
    minutes: 16,
    summary:
      'See the difference between the stack and the heap, understand value vs. reference semantics, watch memory grow and shrink, and learn how garbage collection works.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'refs', title: 'Values vs. references' },
      { id: 'playground', title: 'Stack & heap, live' },
      { id: 'gc', title: 'Garbage & leaks' },
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
    minutes: 15,
    summary:
      'Understand threads vs. processes, why shared mutable state causes race conditions, and how locks fix them — by running a real interleaving simulation.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Threads & sharing' },
      { id: 'playground', title: 'Race it live' },
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
    minutes: 13,
    summary:
      'Learn how computers store numbers in binary and hex, how text becomes bytes via Unicode/UTF-8, and convert between them with an interactive tool.',
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
    id: 'network',
    path: '/lessons/network',
    title: 'How the Web Talks',
    tagline: 'What really happens between typing a URL and seeing a response.',
    icon: '🌐',
    level: 'Intermediate',
    minutes: 15,
    summary:
      'Follow a request through DNS, the TCP handshake, TLS, and HTTP — step by step — learn methods and status codes, and see where latency comes from.',
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
    id: 'git',
    path: '/lessons/git',
    title: 'Version Control with Git',
    tagline: 'How teams track history, branch, and merge without stepping on each other.',
    icon: '🌿',
    level: 'Beginner',
    minutes: 14,
    summary:
      'Understand commits, branches, and merges as a graph of snapshots — then build a small project history interactively.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Commits & branches' },
      { id: 'playground', title: 'Build a history' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'cli',
    path: '/lessons/cli',
    title: 'The Command Line & Pipes',
    tagline: 'Small programs, composed: how the shell turns tools into pipelines.',
    icon: '🐚',
    level: 'Beginner',
    minutes: 13,
    summary:
      'Learn how stdin/stdout and the pipe operator let you chain tiny programs into powerful one-liners — by composing a real pipeline.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Streams & pipes' },
      { id: 'playground', title: 'Compose a pipeline' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'datastructures',
    path: '/lessons/datastructures',
    title: 'Data Structures',
    tagline: 'Arrays, linked lists, and hash maps — and when to reach for each.',
    icon: '🧱',
    level: 'Intermediate',
    minutes: 16,
    summary:
      'See how a hash map turns keys into buckets, why lookups are O(1), what a collision is, and how arrays differ from linked lists.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The big three' },
      { id: 'playground', title: 'A hash map, live' },
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
    minutes: 15,
    summary:
      'Build intuition for Big-O notation and watch sorting algorithms run step by step to feel the difference between O(n²) and O(n log n).',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Big-O in plain words' },
      { id: 'playground', title: 'Watch a sort' },
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
    minutes: 13,
    summary:
      'Understand base cases and recursive cases, visualize the call tree, and see why naive Fibonacci explodes while memoization tames it.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Base case & recursion' },
      { id: 'playground', title: 'Trace the calls' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'sql',
    path: '/lessons/sql',
    title: 'Databases & SQL',
    tagline: 'Store, relate, and query data — with a real database in your browser.',
    icon: '🗄️',
    level: 'Beginner',
    minutes: 16,
    summary:
      'Learn tables, rows, and queries, then run real SQL (SELECT, WHERE, JOIN, GROUP BY) against a live SQLite database.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Tables & queries' },
      { id: 'playground', title: 'Run SQL live' },
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
    minutes: 14,
    summary:
      'Learn the core regex building blocks and test patterns against your own text with live match highlighting.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The building blocks' },
      { id: 'playground', title: 'Test a pattern' },
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
    minutes: 13,
    summary:
      'Understand exceptions, try/except/finally, and stack traces by triggering and catching real errors in Python.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'How errors propagate' },
      { id: 'playground', title: 'Catch it live' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'caching',
    path: '/lessons/caching',
    title: 'Caching & LRU',
    tagline: 'Trading memory for speed — and deciding what to forget.',
    icon: '⚡',
    level: 'Intermediate',
    minutes: 14,
    summary:
      'Learn hits, misses, and eviction, then drive a live LRU cache and watch the hit rate change as capacity and access patterns change.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Hits, misses & eviction' },
      { id: 'playground', title: 'Drive an LRU cache' },
      { id: 'hood', title: 'Under the hood' },
      ...CLOSING,
    ],
  },
  {
    id: 'crypto',
    path: '/lessons/crypto',
    title: 'Hashing & Cryptography',
    tagline: 'Fingerprints, secrets, and why you never store plain passwords.',
    icon: '🔐',
    level: 'Intermediate',
    minutes: 14,
    summary:
      'Understand hashing vs. encryption and see a real SHA-256 hash change completely with the tiniest input tweak (the avalanche effect).',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Hash vs. encrypt' },
      { id: 'playground', title: 'Hash it live' },
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
    minutes: 13,
    summary:
      'Learn Unix timestamps, UTC vs. local time, and offsets — and convert between an epoch and a human date interactively.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'Epoch, UTC & offsets' },
      { id: 'playground', title: 'Convert time' },
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

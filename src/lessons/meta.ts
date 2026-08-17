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
]

export function getLessonMeta(id: string): LessonMeta | undefined {
  return lessonsMeta.find((l) => l.id === id)
}

export function getNextLesson(id: string): LessonMeta | undefined {
  const idx = lessonsMeta.findIndex((l) => l.id === id)
  if (idx === -1 || idx === lessonsMeta.length - 1) return undefined
  return lessonsMeta[idx + 1]
}

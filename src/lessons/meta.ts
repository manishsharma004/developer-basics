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

export const lessonsMeta: LessonMeta[] = [
  {
    id: 'filesystem',
    path: '/lessons/filesystem',
    title: 'The Filesystem',
    tagline: 'Where your code and data live: files, folders, paths, and permissions.',
    icon: '🗂️',
    level: 'Beginner',
    minutes: 12,
    summary:
      'Navigate a real filesystem, understand absolute vs. relative paths, read permissions, and learn what a file really is under the hood.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'The mental model' },
      { id: 'playground', title: 'Try it live' },
      { id: 'hood', title: 'Under the hood' },
      { id: 'recap', title: 'Recap' },
    ],
  },
  {
    id: 'process',
    path: '/lessons/process',
    title: 'Processes & the CPU',
    tagline: 'How your program actually runs, and how the OS shares one CPU across many.',
    icon: '⚙️',
    level: 'Beginner',
    minutes: 14,
    summary:
      'Learn what a process is, the states it moves through, and how a scheduler decides who runs next — by driving a real simulation.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'model', title: 'What is a process?' },
      { id: 'playground', title: 'Schedule it live' },
      { id: 'hood', title: 'Under the hood' },
      { id: 'recap', title: 'Recap' },
    ],
  },
  {
    id: 'memory',
    path: '/lessons/memory',
    title: 'Memory: Stack & Heap',
    tagline: 'Variables, references, and where things live while your program runs.',
    icon: '🧠',
    level: 'Intermediate',
    minutes: 15,
    summary:
      'See the difference between the stack and the heap, understand value vs. reference semantics, and watch memory grow and shrink.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'refs', title: 'Values vs. references' },
      { id: 'playground', title: 'Stack & heap, live' },
      { id: 'hood', title: 'Under the hood' },
      { id: 'recap', title: 'Recap' },
    ],
  },
  {
    id: 'network',
    path: '/lessons/network',
    title: 'How the Web Talks',
    tagline: 'What really happens between typing a URL and seeing a response.',
    icon: '🌐',
    level: 'Intermediate',
    minutes: 13,
    summary:
      'Follow a request through DNS, the TCP handshake, TLS, and HTTP — step by step — and learn where latency comes from.',
    sections: [
      { id: 'intro', title: 'Why it matters' },
      { id: 'url', title: 'Anatomy of a URL' },
      { id: 'playground', title: 'Trace a request' },
      { id: 'hood', title: 'Under the hood' },
      { id: 'recap', title: 'Recap' },
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

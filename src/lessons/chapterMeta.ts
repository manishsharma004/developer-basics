import type { LessonMeta, Level, SectionMeta } from './meta.ts'

const CLOSING: SectionMeta[] = [
  { id: 'terms', title: 'Key terms' },
  { id: 'check', title: 'Check yourself' },
  { id: 'recap', title: 'Recap' },
]

const GROUP_ICON: Record<string, string> = {
  react: '⚛️',
  fastapi: '⚡',
  databases: '🗃️',
  sql: '🗄️',
  mongodb: '🍃',
  web: '🌐',
  css: '🎨',
}

export interface ChapterMetaInput {
  id: string
  title: string
  tagline: string
  summary: string
  group: 'react' | 'fastapi' | 'databases' | 'sql' | 'mongodb' | 'web' | 'css'
  minutes: number
  level?: Level
  modelTitle?: string
  playgroundTitle?: string
  hasPlayground?: boolean
  hasHood?: boolean
}

export function chapterMeta(input: ChapterMetaInput): LessonMeta {
  const sections: SectionMeta[] = [
    { id: 'intro', title: 'Why it matters' },
    { id: 'model', title: input.modelTitle ?? 'Core ideas' },
  ]
  if (input.hasPlayground) {
    sections.push({ id: 'playground', title: input.playgroundTitle ?? 'Try it' })
  }
  if (input.hasHood) {
    sections.push({ id: 'hood', title: 'Under the hood' })
  }
  sections.push(...CLOSING)

  return {
    id: input.id,
    path: `/lessons/${input.id}`,
    title: input.title,
    tagline: input.tagline,
    icon: GROUP_ICON[input.group],
    level: input.level ?? (input.group === 'sql' || input.group === 'databases' || input.group === 'css' ? 'Beginner' : 'Intermediate'),
    minutes: input.minutes,
    summary: input.summary,
    group: input.group,
    sections,
  }
}

import Fuse from 'fuse.js'
import { groups, lessonsMeta } from '../lessons/meta.ts'

export interface LessonSearchItem {
  id: string
  kind: 'lesson' | 'section'
  lessonId: string
  path: string
  sectionId?: string
  title: string
  subtitle: string
  icon: string
  groupTitle: string
  tagline: string
  summary: string
  sectionTitle: string
  keywords: string
}

function buildSearchItems(): LessonSearchItem[] {
  const groupTitleById = Object.fromEntries(groups.map((g) => [g.id, g.title]))
  const items: LessonSearchItem[] = []

  for (const lesson of lessonsMeta) {
    const groupTitle = groupTitleById[lesson.group] ?? lesson.group

    items.push({
      id: lesson.id,
      kind: 'lesson',
      lessonId: lesson.id,
      path: lesson.path,
      title: lesson.title,
      subtitle: groupTitle,
      icon: lesson.icon,
      groupTitle,
      tagline: lesson.tagline,
      summary: lesson.summary,
      sectionTitle: '',
      keywords: `${lesson.id} ${lesson.level} ${lesson.title}`,
    })

    for (const section of lesson.sections) {
      items.push({
        id: `${lesson.id}:${section.id}`,
        kind: 'section',
        lessonId: lesson.id,
        path: lesson.path,
        sectionId: section.id,
        title: section.title,
        subtitle: `${lesson.title} · ${groupTitle}`,
        icon: lesson.icon,
        groupTitle,
        tagline: lesson.tagline,
        summary: lesson.summary,
        sectionTitle: section.title,
        keywords: `${lesson.title} ${section.id} ${section.title} ${groupTitle}`,
      })
    }
  }

  return items
}

const SEARCH_ITEMS = buildSearchItems()

const fuse = new Fuse(SEARCH_ITEMS, {
  keys: [
    { name: 'title', weight: 0.35 },
    { name: 'tagline', weight: 0.15 },
    { name: 'summary', weight: 0.15 },
    { name: 'groupTitle', weight: 0.1 },
    { name: 'sectionTitle', weight: 0.15 },
    { name: 'keywords', weight: 0.1 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
})

export function searchLessons(query: string, limit = 14): LessonSearchItem[] {
  const q = query.trim()
  if (!q) return []
  return fuse.search(q, { limit }).map((result) => result.item)
}

export function listLessonTopics(limit = 10): LessonSearchItem[] {
  return SEARCH_ITEMS.filter((item) => item.kind === 'lesson').slice(0, limit)
}

export const lessonSearchCount = SEARCH_ITEMS.length

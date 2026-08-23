import { getLessonMeta, type LessonMeta } from './meta.ts'

/** Ordered beginner track — foundations before systems before web/security. */
export const BEGINNER_PATH: string[] = [
  'variables',
  'controlflow',
  'data',
  'errors',
  'filesystem',
  'process',
  'algorithms',
  'sql-intro',
  'network',
  'security',
]

export function isOnBeginnerPath(lessonId: string): boolean {
  return BEGINNER_PATH.includes(lessonId)
}

export function getBeginnerPathLessons(): LessonMeta[] {
  return BEGINNER_PATH.map((id) => getLessonMeta(id)).filter((l): l is LessonMeta => !!l)
}

export function getNextPathLesson(lessonId: string): LessonMeta | undefined {
  const idx = BEGINNER_PATH.indexOf(lessonId)
  if (idx === -1 || idx === BEGINNER_PATH.length - 1) return undefined
  return getLessonMeta(BEGINNER_PATH[idx + 1]!)
}

export function getPathResumeLesson(
  isRead: (lessonId: string) => boolean,
): LessonMeta | undefined {
  for (const id of BEGINNER_PATH) {
    if (!isRead(id)) return getLessonMeta(id)
  }
  return getLessonMeta(BEGINNER_PATH[0]!)
}

export function getPathProgress(isRead: (lessonId: string) => boolean): {
  completed: number
  total: number
  percent: number
} {
  const total = BEGINNER_PATH.length
  const completed = BEGINNER_PATH.filter((id) => isRead(id)).length
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 }
}

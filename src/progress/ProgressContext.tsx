import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  loadAllLessonProgress,
  normalizeQuizAnswers,
  saveLessonProgress,
  serializeQuizAnswers,
  type LessonProgressRecord,
} from '../lib/progressDb.ts'

export interface LessonProgress {
  lessonId: string
  openCount: number
  read: boolean
  firstOpenedAt: number
  lastOpenedAt: number
  quizAnswers: Record<number, number>
}

interface ProgressContextValue {
  ready: boolean
  progressByLesson: ReadonlyMap<string, LessonProgress>
  getProgress: (lessonId: string) => LessonProgress | undefined
  recordOpen: (lessonId: string) => Promise<void>
  saveQuizAnswer: (lessonId: string, questionIndex: number, optionIndex: number) => Promise<void>
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function toLessonProgress(record: LessonProgressRecord): LessonProgress {
  return {
    lessonId: record.lessonId,
    openCount: record.openCount,
    read: record.read,
    firstOpenedAt: record.firstOpenedAt,
    lastOpenedAt: record.lastOpenedAt,
    quizAnswers: normalizeQuizAnswers(record.quizAnswers),
  }
}

function toRecord(progress: LessonProgress): LessonProgressRecord {
  return {
    lessonId: progress.lessonId,
    openCount: progress.openCount,
    read: progress.read,
    firstOpenedAt: progress.firstOpenedAt,
    lastOpenedAt: progress.lastOpenedAt,
    quizAnswers: serializeQuizAnswers(progress.quizAnswers),
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [progressByLesson, setProgressByLesson] = useState<Map<string, LessonProgress>>(new Map())

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const records = await loadAllLessonProgress()
        if (cancelled) return
        setProgressByLesson(new Map(records.map((record) => [record.lessonId, toLessonProgress(record)])))
      } catch {
        if (!cancelled) setProgressByLesson(new Map())
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const getProgress = useCallback(
    (lessonId: string) => progressByLesson.get(lessonId),
    [progressByLesson],
  )

  const recordOpen = useCallback(
    async (lessonId: string) => {
      const now = Date.now()
      let nextProgress: LessonProgress | null = null
      setProgressByLesson((current) => {
        const existing = current.get(lessonId)
        nextProgress = existing
          ? {
              ...existing,
              openCount: existing.openCount + 1,
              read: true,
              lastOpenedAt: now,
            }
          : {
              lessonId,
              openCount: 1,
              read: true,
              firstOpenedAt: now,
              lastOpenedAt: now,
              quizAnswers: {},
            }
        const next = new Map(current)
        next.set(lessonId, nextProgress)
        return next
      })
      if (nextProgress) await saveLessonProgress(toRecord(nextProgress))
    },
    [],
  )

  const saveQuizAnswer = useCallback(
    async (lessonId: string, questionIndex: number, optionIndex: number) => {
      const now = Date.now()
      let nextProgress: LessonProgress | null = null
      setProgressByLesson((current) => {
        const existing = current.get(lessonId)
        nextProgress = existing
          ? {
              ...existing,
              quizAnswers: { ...existing.quizAnswers, [questionIndex]: optionIndex },
              lastOpenedAt: now,
            }
          : {
              lessonId,
              openCount: 0,
              read: false,
              firstOpenedAt: now,
              lastOpenedAt: now,
              quizAnswers: { [questionIndex]: optionIndex },
            }
        const next = new Map(current)
        next.set(lessonId, nextProgress)
        return next
      })
      if (nextProgress) await saveLessonProgress(toRecord(nextProgress))
    },
    [],
  )

  const value = useMemo<ProgressContextValue>(
    () => ({
      ready,
      progressByLesson,
      getProgress,
      recordOpen,
      saveQuizAnswer,
    }),
    [ready, progressByLesson, getProgress, recordOpen, saveQuizAnswer],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}

export function useLessonProgress(lessonId: string | undefined) {
  const { getProgress, ready } = useProgress()
  return {
    ready,
    progress: lessonId ? getProgress(lessonId) : undefined,
  }
}

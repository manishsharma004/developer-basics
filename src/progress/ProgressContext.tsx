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
  clearAllCapstoneProgress,
  clearAllLessonProgress,
  loadAllCapstoneProgress,
  loadAllLessonProgress,
  normalizeQuizAnswers,
  PROGRESS_EXPORT_VERSION,
  saveCapstoneProgress,
  saveLessonProgress,
  serializeQuizAnswers,
  type CapstoneProgressRecord,
  type LessonProgressRecord,
  type ProgressExportPayload,
} from '../lib/progressDb.ts'

export const CAPSTONE_TASK_TRACKER_ID = 'task-tracker'

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
  capstoneSteps: ReadonlySet<string>
  getProgress: (lessonId: string) => LessonProgress | undefined
  isCapstoneStepDone: (capstoneId: string, stepId: string, linkedLessonId?: string) => boolean
  setCapstoneStepDone: (capstoneId: string, stepId: string, done: boolean) => Promise<void>
  recordOpen: (lessonId: string) => Promise<void>
  setLessonRead: (lessonId: string, read: boolean) => Promise<void>
  saveQuizAnswer: (lessonId: string, questionIndex: number, optionIndex: number) => Promise<void>
  exportProgress: () => ProgressExportPayload
  importProgress: (payload: ProgressExportPayload, mode: 'merge' | 'replace') => Promise<void>
  resetAllProgress: () => Promise<void>
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

function capstoneStepsFromRecords(records: CapstoneProgressRecord[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const record of records) {
    map.set(record.capstoneId, new Set(record.completedSteps))
  }
  return map
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [progressByLesson, setProgressByLesson] = useState<Map<string, LessonProgress>>(new Map())
  const [capstoneById, setCapstoneById] = useState<Map<string, Set<string>>>(new Map())

  useEffect(() => {
    let cancelled = false
    void (async () => {
      try {
        const [lessonRecords, capstoneRecords] = await Promise.all([
          loadAllLessonProgress(),
          loadAllCapstoneProgress(),
        ])
        if (cancelled) return
        setProgressByLesson(new Map(lessonRecords.map((record) => [record.lessonId, toLessonProgress(record)])))
        setCapstoneById(capstoneStepsFromRecords(capstoneRecords))
      } catch {
        if (!cancelled) {
          setProgressByLesson(new Map())
          setCapstoneById(new Map())
        }
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const capstoneSteps = useMemo(
    () => capstoneById.get(CAPSTONE_TASK_TRACKER_ID) ?? new Set<string>(),
    [capstoneById],
  )

  const getProgress = useCallback(
    (lessonId: string) => progressByLesson.get(lessonId),
    [progressByLesson],
  )

  const isCapstoneStepDone = useCallback(
    (capstoneId: string, stepId: string, linkedLessonId?: string) => {
      if (capstoneById.get(capstoneId)?.has(stepId)) return true
      if (linkedLessonId && progressByLesson.get(linkedLessonId)?.read) return true
      return false
    },
    [capstoneById, progressByLesson],
  )

  const setCapstoneStepDone = useCallback(async (capstoneId: string, stepId: string, done: boolean) => {
    let nextSteps: Set<string> | null = null
    setCapstoneById((current) => {
      const existing = new Set(current.get(capstoneId) ?? [])
      if (done) existing.add(stepId)
      else existing.delete(stepId)
      nextSteps = existing
      const next = new Map(current)
      next.set(capstoneId, existing)
      return next
    })
    if (nextSteps) {
      await saveCapstoneProgress({
        capstoneId,
        completedSteps: Array.from(nextSteps),
      })
    }
  }, [])

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
              lastOpenedAt: now,
            }
          : {
              lessonId,
              openCount: 1,
              read: false,
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

  const setLessonRead = useCallback(async (lessonId: string, read: boolean) => {
    const now = Date.now()
    let nextProgress: LessonProgress | null = null
    setProgressByLesson((current) => {
      const existing = current.get(lessonId)
      nextProgress = existing
        ? { ...existing, read, lastOpenedAt: now }
        : {
            lessonId,
            openCount: 0,
            read,
            firstOpenedAt: now,
            lastOpenedAt: now,
            quizAnswers: {},
          }
      const next = new Map(current)
      next.set(lessonId, nextProgress)
      return next
    })
    if (nextProgress) await saveLessonProgress(toRecord(nextProgress))
  }, [])

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

  const exportProgress = useCallback((): ProgressExportPayload => {
    const lessons = Array.from(progressByLesson.values()).map(toRecord)
    const capstone = Array.from(capstoneById.entries()).map(([capstoneId, steps]) => ({
      capstoneId,
      completedSteps: Array.from(steps),
    }))
    return {
      version: PROGRESS_EXPORT_VERSION,
      exportedAt: new Date().toISOString(),
      lessons,
      capstone,
    }
  }, [progressByLesson, capstoneById])

  const importProgress = useCallback(
    async (payload: ProgressExportPayload, mode: 'merge' | 'replace') => {
      const incoming = payload.lessons.map(toLessonProgress)
      const incomingCapstone = capstoneStepsFromRecords(payload.capstone ?? [])
      let nextMap: Map<string, LessonProgress>
      let nextCapstone: Map<string, Set<string>>
      if (mode === 'replace') {
        await clearAllLessonProgress()
        await clearAllCapstoneProgress()
        nextMap = new Map(incoming.map((p) => [p.lessonId, p]))
        nextCapstone = incomingCapstone
      } else {
        nextMap = new Map(progressByLesson)
        for (const record of incoming) {
          const existing = nextMap.get(record.lessonId)
          nextMap.set(
            record.lessonId,
            existing
              ? {
                  ...existing,
                  openCount: Math.max(existing.openCount, record.openCount),
                  read: existing.read || record.read,
                  firstOpenedAt: Math.min(existing.firstOpenedAt, record.firstOpenedAt),
                  lastOpenedAt: Math.max(existing.lastOpenedAt, record.lastOpenedAt),
                  quizAnswers: { ...record.quizAnswers, ...existing.quizAnswers },
                }
              : record,
          )
        }
        nextCapstone = new Map(capstoneById)
        for (const [capstoneId, steps] of incomingCapstone) {
          const merged = new Set(nextCapstone.get(capstoneId) ?? [])
          for (const step of steps) merged.add(step)
          nextCapstone.set(capstoneId, merged)
        }
      }
      setProgressByLesson(nextMap)
      setCapstoneById(nextCapstone)
      await Promise.all(Array.from(nextMap.values()).map((p) => saveLessonProgress(toRecord(p))))
      await Promise.all(
        Array.from(nextCapstone.entries()).map(([capstoneId, steps]) =>
          saveCapstoneProgress({ capstoneId, completedSteps: Array.from(steps) }),
        ),
      )
    },
    [progressByLesson, capstoneById],
  )

  const resetAllProgress = useCallback(async () => {
    await clearAllLessonProgress()
    await clearAllCapstoneProgress()
    setProgressByLesson(new Map())
    setCapstoneById(new Map())
  }, [])

  const value = useMemo<ProgressContextValue>(
    () => ({
      ready,
      progressByLesson,
      capstoneSteps,
      getProgress,
      isCapstoneStepDone,
      setCapstoneStepDone,
      recordOpen,
      setLessonRead,
      saveQuizAnswer,
      exportProgress,
      importProgress,
      resetAllProgress,
    }),
    [
      ready,
      progressByLesson,
      capstoneSteps,
      getProgress,
      isCapstoneStepDone,
      setCapstoneStepDone,
      recordOpen,
      setLessonRead,
      saveQuizAnswer,
      exportProgress,
      importProgress,
      resetAllProgress,
    ],
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

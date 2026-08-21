import { createContext, useContext, type ReactNode } from 'react'

const CurrentLessonContext = createContext<string | null>(null)

export function CurrentLessonProvider({
  lessonId,
  children,
}: {
  lessonId: string
  children: ReactNode
}) {
  return <CurrentLessonContext.Provider value={lessonId}>{children}</CurrentLessonContext.Provider>
}

export function useCurrentLessonId() {
  return useContext(CurrentLessonContext)
}

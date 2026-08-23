import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ClassroomValue {
  classroomMode: boolean
  setClassroomMode: (on: boolean) => void
  toggleClassroomMode: () => void
}

const ClassroomContext = createContext<ClassroomValue | null>(null)
const STORAGE_KEY = 'devbasics.classroomMode'

function readInitial(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function ClassroomProvider({ children }: { children: ReactNode }) {
  const [classroomMode, setClassroomModeState] = useState(readInitial)

  const setClassroomMode = (on: boolean) => {
    setClassroomModeState(on)
    try {
      sessionStorage.setItem(STORAGE_KEY, on ? '1' : '0')
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.dataset.classroom = classroomMode ? '1' : '0'
  }, [classroomMode])

  return (
    <ClassroomContext.Provider
      value={{
        classroomMode,
        setClassroomMode,
        toggleClassroomMode: () => setClassroomMode(!classroomMode),
      }}
    >
      {children}
    </ClassroomContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useClassroom(): ClassroomValue {
  const ctx = useContext(ClassroomContext)
  if (!ctx) throw new Error('useClassroom must be used within ClassroomProvider')
  return ctx
}

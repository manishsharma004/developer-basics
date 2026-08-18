import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Experience = 'student' | 'teacher'

interface ExperienceValue {
  experience: Experience
  setExperience: (e: Experience) => void
}

const ExperienceContext = createContext<ExperienceValue | null>(null)
const STORAGE_KEY = 'devbasics.experience'

function readInitial(): Experience {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'teacher' || saved === 'student') return saved
  } catch {
    /* ignore */
  }
  return 'student'
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [experience, setExperienceState] = useState<Experience>(readInitial)

  const setExperience = (e: Experience) => {
    setExperienceState(e)
    try {
      localStorage.setItem(STORAGE_KEY, e)
    } catch {
      /* ignore */
    }
  }

  // Expose the current experience on <html> so global CSS can theme everything.
  useEffect(() => {
    document.documentElement.dataset.experience = experience
  }, [experience])

  return (
    <ExperienceContext.Provider value={{ experience, setExperience }}>{children}</ExperienceContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useExperience(): ExperienceValue {
  const ctx = useContext(ExperienceContext)
  if (!ctx) throw new Error('useExperience must be used within ExperienceProvider')
  return ctx
}

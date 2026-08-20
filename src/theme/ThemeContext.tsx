import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { THEMES, type ThemeId } from './themes.ts'

interface ThemeValue {
  theme: ThemeId
  setTheme: (t: ThemeId) => void
}

const ThemeContext = createContext<ThemeValue | null>(null)
const STORAGE_KEY = 'devbasics.theme'

function readInitial(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    if (saved && THEMES.some((t) => t.id === saved)) return saved
  } catch {
    /* ignore */
  }
  return 'midnight'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(readInitial)

  const setTheme = (t: ThemeId) => {
    setThemeState(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

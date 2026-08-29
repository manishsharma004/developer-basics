import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { resolveTheme, THEMES, type ThemeId, type ThemePreference } from './themes.ts'

interface ThemeValue {
  /** Stored preference — may be `system` or a concrete theme id. */
  preference: ThemePreference
  /** Theme applied to `<html data-theme>` (always a concrete id). */
  resolvedTheme: ThemeId
  setTheme: (t: ThemePreference) => void
}

const ThemeContext = createContext<ThemeValue | null>(null)
const STORAGE_KEY = 'devbasics.theme'

function readInitial(): ThemePreference {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'system') return 'system'
    if (saved && saved !== 'system' && THEMES.some((t) => t.id === saved)) return saved as ThemeId
  } catch {
    /* ignore */
  }
  return 'midnight'
}

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(readInitial)
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)

  const resolvedTheme = resolveTheme(preference, prefersDark)

  const setTheme = (t: ThemePreference) => {
    setPreferenceState(t)
    try {
      localStorage.setItem(STORAGE_KEY, t)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme
  }, [resolvedTheme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => setPrefersDark(event.matches)
    setPrefersDark(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

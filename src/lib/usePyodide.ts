import { useCallback, useEffect, useRef, useState } from 'react'
import type { PyodideInterface } from 'pyodide'
import { getPyodide, onPyodideProgress, resetPyodideLoad, type LoadPhase } from './pyodide.ts'

export interface UsePyodideResult {
  pyodide: PyodideInterface | null
  phase: LoadPhase
  message: string
  error: string | null
  retry: () => void
  skipped: boolean
  skip: () => void
}

// Kicks off (or reuses) the shared Pyodide load and exposes its progress so a
// component can render a spinner, an error with details, or the ready UI.
export function usePyodide(): UsePyodideResult {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [phase, setPhase] = useState<LoadPhase>('loading')
  const [message, setMessage] = useState(
    'Downloading the Python runtime (~15 MB). This may take a minute on school Wi‑Fi.',
  )
  const [error, setError] = useState<string | null>(null)
  const [skipped, setSkipped] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const mounted = useRef(true)

  const retry = useCallback(() => {
    resetPyodideLoad()
    setSkipped(false)
    setError(null)
    setPyodide(null)
    setPhase('loading')
    setMessage('Retrying Python runtime download…')
    setAttempt((n) => n + 1)
  }, [])

  const skip = useCallback(() => {
    setSkipped(true)
    setPhase('error')
    setError(null)
  }, [])

  useEffect(() => {
    mounted.current = true
    const unsubscribe = onPyodideProgress((msg) => {
      if (mounted.current) setMessage(msg)
    })

    getPyodide()
      .then((py) => {
        if (!mounted.current) return
        setPyodide(py)
        setPhase('ready')
        setSkipped(false)
      })
      .catch((err: unknown) => {
        if (!mounted.current) return
        setPhase('error')
        setError(err instanceof Error ? err.message : String(err))
      })

    return () => {
      mounted.current = false
      unsubscribe()
    }
  }, [attempt])

  return { pyodide, phase, message, error, retry, skipped, skip }
}

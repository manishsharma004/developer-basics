import { useEffect, useRef, useState } from 'react'
import type { PyodideInterface } from 'pyodide'
import { getPyodide, onPyodideProgress, type LoadPhase } from './pyodide.ts'

export interface UsePyodideResult {
  pyodide: PyodideInterface | null
  phase: LoadPhase
  message: string
  error: string | null
}

// Kicks off (or reuses) the shared Pyodide load and exposes its progress so a
// component can render a spinner, an error with details, or the ready UI.
export function usePyodide(): UsePyodideResult {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null)
  const [phase, setPhase] = useState<LoadPhase>('loading')
  const [message, setMessage] = useState('Booting the Python runtime…')
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

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
  }, [])

  return { pyodide, phase, message, error }
}

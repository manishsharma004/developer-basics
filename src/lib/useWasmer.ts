import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { isCrossOriginIsolated } from './crossOriginIsolation.ts'
import { onWasmerProgress, resetWasmerLoad, runBashTerminal, type WasmerLoadPhase } from './wasmer.ts'

const LOAD_TIMEOUT_MS = 30_000

export interface UseWasmerResult {
  phase: WasmerLoadPhase
  message: string
  error: string | null
  retry: () => void
}

export function useWasmer(hostRef: RefObject<HTMLElement | null>): UseWasmerResult {
  const [phase, setPhase] = useState<WasmerLoadPhase>(() =>
    isCrossOriginIsolated ? 'loading' : 'unsupported',
  )
  const [message, setMessage] = useState(() =>
    isCrossOriginIsolated
      ? 'Checking cross-origin isolation…'
      : 'Cross-origin isolation unavailable — using built-in simulator.',
  )
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const mounted = useRef(true)

  const retry = useCallback(() => {
    resetWasmerLoad()
    cleanupRef.current?.()
    cleanupRef.current = undefined
    setError(null)
    setPhase(isCrossOriginIsolated ? 'loading' : 'unsupported')
    setMessage('Retrying shell runtime…')
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    mounted.current = true
    const unsubscribe = onWasmerProgress((msg) => {
      if (mounted.current) setMessage(msg)
    })

    if (!isCrossOriginIsolated) {
      setPhase('unsupported')
      setMessage('Cross-origin isolation unavailable — using built-in simulator below.')
      return () => {
        mounted.current = false
        unsubscribe()
      }
    }

    const host = hostRef.current
    if (!host) {
      setPhase('error')
      setError('Terminal mount failed.')
      return () => {
        mounted.current = false
        unsubscribe()
      }
    }

    let cancelled = false
    const timeout = window.setTimeout(() => {
      if (!cancelled && mounted.current) {
        setPhase('error')
        setError('Shell runtime timed out after 30s. Check your network or use the simulator below.')
      }
    }, LOAD_TIMEOUT_MS)

    void (async () => {
      try {
        setPhase('loading')
        setError(null)
        setMessage('Loading shell runtime…')
        const cleanup = await runBashTerminal(host, (msg) => {
          if (mounted.current) setMessage(msg)
        })
        cleanupRef.current = cleanup
        if (!cancelled && mounted.current) {
          window.clearTimeout(timeout)
          setPhase('ready')
          setMessage('Shell ready.')
        }
      } catch (e) {
        if (!cancelled && mounted.current) {
          window.clearTimeout(timeout)
          setPhase('error')
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()

    return () => {
      cancelled = true
      mounted.current = false
      window.clearTimeout(timeout)
      cleanupRef.current?.()
      cleanupRef.current = undefined
      unsubscribe()
    }
  }, [attempt])

  return { phase, message, error, retry }
}

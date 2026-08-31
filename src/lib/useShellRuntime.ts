import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { getCrossOriginIsolated, waitForCrossOriginIsolation } from './crossOriginIsolation.ts'
import {
  V86_LOAD_TIMEOUT_MS,
  WASMER_LOAD_TIMEOUT_MS,
  type ShellBackend,
  type ShellLoadPhase,
} from './shellRuntime.ts'
import { isV86LabImageAvailable, onV86Progress, resetV86Load, runV86Terminal } from './v86.ts'
import { onWasmerProgress, resetWasmerLoad, runBashTerminal } from './wasmer.ts'

export interface UseShellRuntimeResult {
  phase: ShellLoadPhase
  backend: ShellBackend | null
  message: string
  error: string | null
  retry: () => void
}

export function useShellRuntime(
  hostRef: RefObject<HTMLElement | null>,
  selectedBackend: ShellBackend | null,
): UseShellRuntimeResult {
  const [phase, setPhase] = useState<ShellLoadPhase>(selectedBackend ? 'loading' : 'idle')
  const [backend, setBackend] = useState<ShellBackend | null>(null)
  const [message, setMessage] = useState('Checking shell runtime…')
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  const mounted = useRef(true)

  const retry = useCallback(() => {
    resetV86Load()
    resetWasmerLoad()
    cleanupRef.current?.()
    cleanupRef.current = undefined
    setError(null)
    setBackend(null)
    setPhase('loading')
    setMessage('Retrying shell runtime…')
    setAttempt((n) => n + 1)
  }, [])

  useEffect(() => {
    mounted.current = true
    const unsubV86 = onV86Progress((msg) => {
      if (mounted.current) setMessage(msg)
    })
    const unsubWasmer = onWasmerProgress((msg) => {
      if (mounted.current) setMessage(msg)
    })

    let cancelled = false

    void (async () => {
      if (!selectedBackend) {
        setPhase('idle')
        return
      }

      setPhase('loading')
      setError(null)
      setMessage(`Loading ${selectedBackend === 'v86' ? 'v86 Podman VM' : 'Wasmer'} shell…`)

      if (!getCrossOriginIsolated()) {
        setMessage('Activating cross-origin isolation (first visit may reload once)…')
        const isolated = await waitForCrossOriginIsolation()
        if (cancelled || !mounted.current) return
        if (!isolated) {
          setPhase('unsupported')
          setMessage(
            'Cross-origin isolation is still activating. If the shell does not load, click Enable shell runtime below.',
          )
          return
        }
      }

      const host = hostRef.current
      if (!host) {
        setPhase('error')
        setError('Terminal mount failed.')
        return
      }

      const tryBackend = async (name: ShellBackend, timeoutMs: number): Promise<boolean> => {
        let timer = 0
        try {
          await Promise.race([
            (async () => {
              setPhase('loading')
              setError(null)
              setMessage(`Loading ${name === 'v86' ? 'v86 Podman VM' : 'Wasmer'} shell…`)
              const cleanup =
                name === 'v86'
                  ? await runV86Terminal(host, (msg) => mounted.current && setMessage(msg))
                  : await runBashTerminal(host, (msg) => mounted.current && setMessage(msg))
              cleanupRef.current = cleanup
              if (!cancelled && mounted.current) {
                setBackend(name)
                setPhase('ready')
                setMessage(name === 'v86' ? 'Podman VM shell ready.' : 'Wasmer shell ready.')
              }
            })(),
            new Promise<never>((_, reject) => {
              timer = window.setTimeout(
                () => reject(new Error(`${name} timed out after ${Math.round(timeoutMs / 1000)}s`)),
                timeoutMs,
              )
            }),
          ])
          return !cancelled && mounted.current
        } catch (e) {
          cleanupRef.current?.()
          cleanupRef.current = undefined
          if (!cancelled && mounted.current) {
            setError(e instanceof Error ? e.message : String(e))
          }
          return false
        } finally {
          window.clearTimeout(timer)
        }
      }

      if (selectedBackend === 'v86') {
        const available = await isV86LabImageAvailable()
        if (!available) {
          setPhase('error')
          setError(
            'v86 Podman image not built. Run bun run v86:build-image on a machine with Docker, or switch to Fast (Wasmer).',
          )
          return
        }
      }

      const ok = await tryBackend(
        selectedBackend,
        selectedBackend === 'v86' ? V86_LOAD_TIMEOUT_MS : WASMER_LOAD_TIMEOUT_MS,
      )
      if (!ok && !cancelled && mounted.current) {
        setPhase('error')
        setError((prev) => prev ?? `Could not start ${selectedBackend} shell.`)
      }
    })()

    return () => {
      cancelled = true
      mounted.current = false
      cleanupRef.current?.()
      cleanupRef.current = undefined
      unsubV86()
      unsubWasmer()
    }
  }, [attempt, hostRef, selectedBackend])

  return { phase, backend, message, error, retry }
}

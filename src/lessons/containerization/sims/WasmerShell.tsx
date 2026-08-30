import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isCrossOriginIsolated } from '../../../lib/crossOriginIsolation.ts'
import { runBashTerminal } from '../../../lib/wasmer.ts'
import { WasmerRuntimeBanner } from '../../../components/WasmerRuntimeBanner.tsx'
import { DockerCliSim } from './DockerCliSim.tsx'

export function WasmerShell({ fallback }: { fallback?: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error' | 'unsupported'>(
    isCrossOriginIsolated ? 'loading' : 'unsupported',
  )
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!isCrossOriginIsolated || !hostRef.current) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    void (async () => {
      try {
        setPhase('loading')
        setError(null)
        cleanup = await runBashTerminal(hostRef.current!, () => {
          if (!cancelled) setPhase('loading')
        })
        if (!cancelled) setPhase('ready')
      } catch (e) {
        if (!cancelled) {
          setPhase('error')
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [retry])

  return (
    <div>
      <WasmerRuntimeBanner
        phase={phase}
        error={error}
        onRetry={() => setRetry((r) => r + 1)}
      />
      {phase === 'ready' ? (
        <div ref={hostRef} className="wasmer-terminal" style={{ height: 280, marginTop: '0.5rem' }} />
      ) : (
        fallback ?? <DockerCliSim />
      )}
    </div>
  )
}

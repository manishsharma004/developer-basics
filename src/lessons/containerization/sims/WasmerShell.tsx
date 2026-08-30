import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isCrossOriginIsolated } from '../../../lib/crossOriginIsolation.ts'
import { runBashTerminal } from '../../../lib/wasmer.ts'
import { WasmerRuntimeBanner } from '../../../components/WasmerRuntimeBanner.tsx'
import { DockerCliSim } from './DockerCliSim.tsx'

const LOAD_TIMEOUT_MS = 25_000

export function WasmerShell({ fallback }: { fallback?: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error' | 'unsupported'>(() =>
    isCrossOriginIsolated ? 'loading' : 'unsupported',
  )
  const [error, setError] = useState<string | null>(null)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!isCrossOriginIsolated) return

    const host = hostRef.current
    if (!host) return

    let cleanup: (() => void) | undefined
    let cancelled = false

    const timeout = window.setTimeout(() => {
      if (!cancelled) {
        setPhase('error')
        setError('Shell runtime timed out. Use the simulator below.')
      }
    }, LOAD_TIMEOUT_MS)

    void (async () => {
      try {
        setPhase('loading')
        setError(null)
        cleanup = await runBashTerminal(host, () => {})
        if (!cancelled) {
          window.clearTimeout(timeout)
          setPhase('ready')
        }
      } catch (e) {
        if (!cancelled) {
          window.clearTimeout(timeout)
          setPhase('error')
          setError(e instanceof Error ? e.message : String(e))
        }
      }
    })()

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
      cleanup?.()
    }
  }, [retry])

  const showFallback = phase !== 'ready'

  return (
    <div>
      <WasmerRuntimeBanner
        phase={phase}
        error={error}
        onRetry={() => setRetry((r) => r + 1)}
      />
      {/* Host must exist before Wasmer mounts — hidden until ready */}
      <div
        ref={hostRef}
        className="wasmer-terminal"
        style={{
          height: phase === 'ready' ? 280 : 0,
          marginTop: phase === 'ready' ? '0.5rem' : 0,
          overflow: 'hidden',
          visibility: phase === 'ready' ? 'visible' : 'hidden',
        }}
        aria-hidden={phase !== 'ready'}
      />
      {showFallback && (fallback ?? <DockerCliSim />)}
    </div>
  )
}

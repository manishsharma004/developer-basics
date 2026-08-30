import type { ReactNode } from 'react'
import { useRef } from 'react'
import { useWasmer } from '../../../lib/useWasmer.ts'
import { WasmerRuntimeBanner } from '../../../components/WasmerRuntimeBanner.tsx'
import { DockerCliSim } from './DockerCliSim.tsx'

export function WasmerShell({ fallback }: { fallback?: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const { phase, message, error, retry } = useWasmer(hostRef)

  const showFallback = phase !== 'ready'
  const showTerminal = phase === 'ready' || phase === 'loading'

  return (
    <div className="wasmer-shell">
      <WasmerRuntimeBanner phase={phase} message={message} error={error} onRetry={retry} />
      {showTerminal && (
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
      )}
      {showFallback && (
        <div className="wasmer-fallback">
          <p className="panel-hint runtime-fallback-label">
            {phase === 'loading'
              ? 'Built-in simulator available while the shell loads:'
              : 'Built-in simulator:'}
          </p>
          {fallback ?? <DockerCliSim />}
        </div>
      )}
    </div>
  )
}

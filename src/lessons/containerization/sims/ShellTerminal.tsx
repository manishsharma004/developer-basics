import type { ReactNode } from 'react'
import { useRef } from 'react'
import { ShellRuntimeBanner } from '../../../components/ShellRuntimeBanner.tsx'
import { useShellRuntime } from '../../../lib/useShellRuntime.ts'
import { DockerCliSim } from './DockerCliSim.tsx'

export function ShellTerminal({ fallback }: { fallback?: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const { phase, backend, message, error, retry } = useShellRuntime(hostRef)

  const showFallback = phase !== 'ready'
  const showTerminal = phase === 'ready' || phase === 'loading'

  return (
    <div className="wasmer-shell container-shell-terminal">
      <ShellRuntimeBanner phase={phase} backend={backend} message={message} error={error} onRetry={retry} />
      {showTerminal && (
        <div
          ref={hostRef}
          className={`wasmer-terminal${phase === 'ready' ? '' : ' wasmer-terminal--booting'}`}
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

/** @deprecated Use ShellTerminal */
export const WasmerShell = ShellTerminal

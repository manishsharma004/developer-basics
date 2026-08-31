import type { ReactNode } from 'react'
import { useRef } from 'react'
import { ShellBackendToggle, useShellBackendPreference } from '../../../components/ShellBackendToggle.tsx'
import { ShellRuntimeBanner } from '../../../components/ShellRuntimeBanner.tsx'
import { useShellRuntime } from '../../../lib/useShellRuntime.ts'
import { DockerCliSim } from './DockerCliSim.tsx'

export function ShellTerminal({ fallback }: { fallback?: ReactNode }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [selectedBackend, setSelectedBackend, preferenceReady] = useShellBackendPreference()
  const { phase, backend, message, error, retry } = useShellRuntime(
    hostRef,
    preferenceReady ? selectedBackend : null,
  )

  const showFallback = phase !== 'ready'
  const showTerminal = preferenceReady && selectedBackend != null
  const switching = phase === 'loading'

  return (
    <div className="wasmer-shell container-shell-terminal">
      <ShellBackendToggle
        value={selectedBackend ?? 'wasmer'}
        onChange={setSelectedBackend}
        disabled={switching || !preferenceReady}
      />
      <ShellRuntimeBanner phase={phase} backend={backend} message={message} error={error} onRetry={retry} />
      {showTerminal && (
        <div
          key={selectedBackend}
          ref={hostRef}
          className={`wasmer-terminal${phase === 'ready' ? '' : ' wasmer-terminal--booting'}`}
          data-shell-backend={phase === 'ready' ? backend ?? selectedBackend ?? 'wasmer' : selectedBackend ?? 'wasmer'}
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

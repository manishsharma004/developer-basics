import type { LoadPhase } from '../lib/pyodide.ts'
import { pyodideVersion } from '../lib/pyodide.ts'

interface Props {
  phase: LoadPhase
  message: string
  error: string | null
}

// A compact status strip that shows whether the in-browser Python runtime is
// still downloading, ready, or failed to load.
export function RuntimeBanner({ phase, message, error }: Props) {
  const state =
    phase === 'error' ? 'error' : phase === 'ready' ? 'ready' : 'loading'

  return (
    <div className={`runtime-banner runtime-banner--${state}`}>
      {state === 'loading' && <span className="spinner" aria-hidden />}
      <span className="runtime-dot" aria-hidden />
      <span className="runtime-text">
        {state === 'error'
          ? `Python runtime failed to load: ${error ?? 'unknown error'}`
          : state === 'ready'
            ? `Python ${pyodideVersion} ready — running in your browser via Pyodide (WebAssembly).`
            : message}
      </span>
    </div>
  )
}

import type { LoadPhase } from '../lib/pyodide.ts'
import { pyodideVersion } from '../lib/pyodide.ts'

interface Props {
  phase: LoadPhase
  message: string
  error: string | null
  onRetry?: () => void
  onSkip?: () => void
  skipped?: boolean
}

// A compact status strip that shows whether the in-browser Python runtime is
// still downloading, ready, or failed to load.
export function RuntimeBanner({ phase, message, error, onRetry, onSkip, skipped }: Props) {
  const state =
    skipped ? 'skipped' : phase === 'error' ? 'error' : phase === 'ready' ? 'ready' : 'loading'

  return (
    <div
      className={`runtime-banner runtime-banner--${state}`}
      role="status"
      aria-live="polite"
    >
      {state === 'loading' && <span className="spinner" aria-hidden />}
      <span className="runtime-dot" aria-hidden />
      <div className="runtime-text">
        {state === 'skipped' ? (
          <span>
            Python runtime skipped — you can still read the lesson and try the quizzes below.
            The code playground is unavailable until Python loads.
          </span>
        ) : state === 'error' ? (
          <span>
            Python runtime failed to load{error ? `: ${error}` : ''}. Check your network or try
            again. You can still read the lesson prose and quizzes.
          </span>
        ) : state === 'ready' ? (
          <span>
            Python {pyodideVersion} ready — running in your browser via Pyodide (WebAssembly).
          </span>
        ) : (
          <span>{message}</span>
        )}
      </div>
      {(state === 'error' || state === 'skipped') && (
        <div className="runtime-actions">
          {onRetry && (
            <button type="button" className="btn btn--sm" onClick={onRetry}>
              Retry Python
            </button>
          )}
          {state === 'error' && onSkip && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={onSkip}>
              Continue reading
            </button>
          )}
        </div>
      )}
    </div>
  )
}

import { COI_TROUBLESHOOTING, isCrossOriginIsolated } from '../lib/crossOriginIsolation.ts'

interface Props {
  phase: 'loading' | 'ready' | 'error' | 'unsupported'
  message?: string
  error?: string | null
  onRetry?: () => void
}

export function WasmerRuntimeBanner({ phase, message, error, onRetry }: Props) {
  if (phase === 'ready') return null

  const state = phase === 'error' ? 'error' : phase === 'unsupported' ? 'skipped' : 'loading'

  return (
    <div className={`runtime-banner runtime-banner--${state}`} role="status" aria-live="polite">
      {state === 'loading' && <span className="spinner" aria-hidden />}
      <span className="runtime-dot" aria-hidden />
      <div className="runtime-text">
        {phase === 'unsupported' ? (
          <span>
            Shell lab needs <strong>cross-origin isolation</strong> (SharedArrayBuffer). On GitHub
            Pages this is enabled via <code>coi-serviceworker</code> — reload once if you just
            landed. A React fallback simulator is shown below.{' '}
            <a href={COI_TROUBLESHOOTING} target="_blank" rel="noreferrer">
              Troubleshooting
            </a>
            {!isCrossOriginIsolated && ' — currently: not isolated.'}
          </span>
        ) : phase === 'error' ? (
          <span>
            Wasmer failed to load{error ? `: ${error}` : ''}. Use the fallback simulator below.
          </span>
        ) : (
          <span>{message ?? 'Loading shell runtime…'}</span>
        )}
      </div>
      {phase === 'error' && onRetry && (
        <div className="runtime-actions">
          <button type="button" className="btn btn--sm" onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  )
}

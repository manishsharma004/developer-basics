import { useState } from 'react'
import { COI_TROUBLESHOOTING, getCrossOriginIsolated, resetCoiServiceWorker } from '../lib/crossOriginIsolation.ts'
import type { WasmerLoadPhase } from '../lib/wasmer.ts'

interface Props {
  phase: WasmerLoadPhase
  message: string
  error?: string | null
  onRetry?: () => void
}

export function WasmerRuntimeBanner({ phase, message, error, onRetry }: Props) {
  const [resetting, setResetting] = useState(false)

  if (phase === 'ready') return null

  const state =
    phase === 'error' ? 'error' : phase === 'unsupported' ? 'skipped' : 'loading'

  const enableShell = async () => {
    setResetting(true)
    try {
      await resetCoiServiceWorker()
    } catch {
      setResetting(false)
    }
  }

  return (
    <div className={`runtime-banner runtime-banner--${state}`} role="status" aria-live="polite">
      {state === 'loading' && <span className="spinner" aria-hidden />}
      <span className="runtime-dot" aria-hidden />
      <div className="runtime-text">
        {phase === 'unsupported' ? (
          <span>
            <strong>Shell runtime unavailable.</strong> {message}{' '}
            <a href={COI_TROUBLESHOOTING} target="_blank" rel="noreferrer">
              Why cross-origin isolation matters
            </a>
            {!getCrossOriginIsolated() && ' (currently not isolated).'}
          </span>
        ) : phase === 'error' ? (
          <span>
            <strong>Shell runtime failed.</strong> {error ?? message}
          </span>
        ) : (
          <span>
            <strong>Loading shell runtime…</strong> {message}
          </span>
        )}
      </div>
      <div className="runtime-actions">
        {phase === 'unsupported' && (
          <button type="button" className="btn btn--sm" disabled={resetting} onClick={() => void enableShell()}>
            {resetting ? 'Enabling…' : 'Enable shell runtime'}
          </button>
        )}
        {phase === 'error' && onRetry && (
          <button type="button" className="btn btn--sm" onClick={onRetry}>
            Retry shell
          </button>
        )}
      </div>
    </div>
  )
}

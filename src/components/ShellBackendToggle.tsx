import { useEffect, useState } from 'react'
import {
  readStoredShellBackend,
  SHELL_BACKEND_LABELS,
  writeStoredShellBackend,
  type ShellBackend,
} from '../lib/shellRuntime.ts'
import { isV86LabImageAvailable } from '../lib/v86.ts'

type ShellBackendToggleProps = {
  value: ShellBackend
  onChange: (backend: ShellBackend) => void
  disabled?: boolean
}

export function ShellBackendToggle({ value, onChange, disabled }: ShellBackendToggleProps) {
  const [v86Ready, setV86Ready] = useState<boolean | null>(null)

  useEffect(() => {
    void isV86LabImageAvailable().then(setV86Ready)
  }, [])

  return (
    <div className="shell-backend-toggle" role="group" aria-label="Shell runtime">
      <span className="shell-backend-toggle__label">Shell mode</span>
      <div className="shell-backend-toggle__options">
        {(['wasmer', 'v86'] as const).map((id) => {
          const meta = SHELL_BACKEND_LABELS[id]
          const needsSetup = id === 'v86' && v86Ready === false
          return (
            <button
              key={id}
              type="button"
              className={`shell-backend-toggle__btn${value === id ? ' shell-backend-toggle__btn--active' : ''}${needsSetup ? ' shell-backend-toggle__btn--needs-setup' : ''}`}
              aria-pressed={value === id}
              disabled={disabled}
              title={
                needsSetup
                  ? 'Pre-built VM image is not reachable yet'
                  : meta.blurb
              }
              onClick={() => {
                writeStoredShellBackend(id)
                onChange(id)
              }}
            >
              <span className="shell-backend-toggle__short">{meta.short}</span>
              <span className="shell-backend-toggle__name">{meta.title}</span>
            </button>
          )
        })}
      </div>
      <p className="shell-backend-toggle__hint panel-hint">
        {v86Ready === false
          ? 'Real VM uses a pre-built Alpine+Podman image. It loads from this site after deploy, or run bun run v86:fetch-lab-image for local dev.'
          : v86Ready === null
            ? 'Loading pre-built VM image info…'
            : 'Switch anytime — the terminal reloads with your choice.'}
      </p>
    </div>
  )
}

export function useShellBackendPreference(): [
  ShellBackend | null,
  (backend: ShellBackend) => void,
  boolean,
] {
  const [backend, setBackend] = useState<ShellBackend | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    void isV86LabImageAvailable().then((v86Ready) => {
      if (cancelled) return
      const stored = readStoredShellBackend()
      if (stored) {
        setBackend(stored)
      } else if (v86Ready) {
        setBackend('v86')
      } else {
        setBackend('wasmer')
      }
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const select = (next: ShellBackend) => {
    writeStoredShellBackend(next)
    setBackend(next)
  }
  return [backend, select, ready]
}

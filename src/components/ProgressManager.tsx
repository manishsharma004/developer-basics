import { useRef, useState } from 'react'
import { useProgress } from '../progress/ProgressContext.tsx'
import type { ProgressExportPayload } from '../lib/progressDb.ts'

export function ProgressManager({ compact = false }: { compact?: boolean }) {
  const { ready, exportProgress, importProgress, resetAllProgress } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string | null>(null)

  const download = () => {
    const payload = exportProgress()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `developer-basics-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setStatus('Progress exported.')
  }

  const onFile = async (file: File) => {
    try {
      const text = await file.text()
      const payload = JSON.parse(text) as ProgressExportPayload
      if (!payload?.lessons || !Array.isArray(payload.lessons)) {
        throw new Error('Invalid progress file')
      }
      const replace = window.confirm(
        'Import progress?\n\nOK = replace all progress on this device\nCancel = merge with existing progress',
      )
      await importProgress(payload, replace ? 'replace' : 'merge')
      setStatus(replace ? 'Progress replaced.' : 'Progress merged.')
    } catch (err) {
      setStatus(err instanceof Error ? err.message : 'Import failed')
    }
  }

  const reset = async () => {
    if (
      !window.confirm(
        'Reset all progress on this device? This cannot be undone unless you exported a backup.',
      )
    ) {
      return
    }
    await resetAllProgress()
    setStatus('All progress reset.')
  }

  if (!ready) return null

  return (
    <div className={`progress-manager${compact ? ' progress-manager--compact' : ''}`}>
      {!compact && (
        <p className="progress-manager-note">
          Progress stays on this device unless you export it.
        </p>
      )}
      <div className="progress-manager-actions">
        <button type="button" className="btn btn--ghost btn--sm" onClick={download} title="Download progress">
          <span className="nav-icon" aria-hidden>⬇</span>
          <span className="nav-label">Export</span>
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => fileRef.current?.click()}
          title="Import progress from file"
        >
          <span className="nav-icon" aria-hidden>⬆</span>
          <span className="nav-label">Import</span>
        </button>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => void reset()} title="Reset all progress">
          <span className="nav-icon" aria-hidden>↺</span>
          <span className="nav-label">Reset</span>
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void onFile(file)
          e.target.value = ''
        }}
      />
      {status && (
        <p className="progress-manager-status" role="status">
          {status}
        </p>
      )}
    </div>
  )
}

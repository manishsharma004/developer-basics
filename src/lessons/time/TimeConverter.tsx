import { useState } from 'react'

const ZONES = [
  { tz: 'UTC', label: 'UTC' },
  { tz: 'America/Los_Angeles', label: 'Los Angeles' },
  { tz: 'America/New_York', label: 'New York' },
  { tz: 'Europe/London', label: 'London' },
  { tz: 'Asia/Kolkata', label: 'Mumbai' },
  { tz: 'Asia/Tokyo', label: 'Tokyo' },
]

function fmt(date: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'long',
      timeZone: tz,
    }).format(date)
  } catch {
    return '—'
  }
}

export function TimeConverter() {
  const [epoch, setEpoch] = useState(() => Math.floor(Date.now() / 1000))
  const date = new Date(epoch * 1000)
  const valid = !Number.isNaN(date.getTime())

  return (
    <div className="panel">
      <div className="time-controls">
        <label className="conv-field" style={{ maxWidth: 260 }}>
          <span>Unix timestamp (seconds since 1970-01-01 UTC)</span>
          <input type="number" value={epoch} onChange={(e) => setEpoch(Number(e.target.value))} />
        </label>
        <div className="time-buttons">
          <button className="btn" onClick={() => setEpoch(Math.floor(Date.now() / 1000))}>Now</button>
          <button className="btn btn--ghost" onClick={() => setEpoch((s) => s + 3600)}>+1 hour</button>
          <button className="btn btn--ghost" onClick={() => setEpoch((s) => s + 86400)}>+1 day</button>
        </div>
      </div>

      {valid && (
        <>
          <div className="time-iso">
            <span className="git-label">ISO 8601 (UTC)</span>
            <code>{date.toISOString()}</code>
          </div>
          <table className="metrics-table time-table">
            <thead>
              <tr><th>Timezone</th><th>Local time at this instant</th></tr>
            </thead>
            <tbody>
              {ZONES.map((z) => (
                <tr key={z.tz}>
                  <td>{z.label} <span className="panel-hint">({z.tz})</span></td>
                  <td>{fmt(date, z.tz)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="panel-hint">It's the same instant everywhere — only the wall-clock reading differs by offset.</p>
        </>
      )}
    </div>
  )
}

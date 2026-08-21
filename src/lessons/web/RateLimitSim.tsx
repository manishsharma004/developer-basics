import { useState } from 'react'

export function RateLimitSim() {
  const [limit, setLimit] = useState(5)
  const [windowMs, setWindowMs] = useState(3000)
  const [tokens, setTokens] = useState(5)
  const [lastRefill, setLastRefill] = useState(Date.now())
  const [accepted, setAccepted] = useState(0)
  const [rejected, setRejected] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const refill = () => {
    const now = Date.now()
    const elapsed = now - lastRefill
    if (elapsed < windowMs) return tokens
    setLastRefill(now)
    setTokens(limit)
    return limit
  }

  const send = () => {
    const available = refill()
    if (available <= 0) {
      setRejected((n) => n + 1)
      setLog((entries) => [...entries.slice(-7), '✗ 429 Too Many Requests'])
      return
    }
    const next = available - 1
    setTokens(next)
    setAccepted((n) => n + 1)
    setLog((entries) => [...entries.slice(-7), `✓ 200 OK (${next} tokens left)`])
  }

  const burst = (count: number) => {
    for (let i = 0; i < count; i++) send()
  }

  const reset = () => {
    setTokens(limit)
    setLastRefill(Date.now())
    setAccepted(0)
    setRejected(0)
    setLog([])
  }

  return (
    <div className="panel">
      <div className="panel-title">Token bucket (fixed window)</div>
      <p className="panel-hint">
        Each window allows <strong>{limit}</strong> requests; extras get{' '}
        <strong>429</strong>.
      </p>
      <div className="race-controls">
        <label className="conv-field">
          <span>Limit</span>
          <input
            className="conv-text"
            type="number"
            min={1}
            max={20}
            value={limit}
            onChange={(e) => {
              const next = Number(e.target.value) || 1
              setLimit(next)
              setTokens(next)
            }}
          />
        </label>
        <label className="conv-field">
          <span>Window (ms)</span>
          <input
            className="conv-text"
            type="number"
            min={500}
            step={500}
            value={windowMs}
            onChange={(e) => setWindowMs(Number(e.target.value) || 3000)}
          />
        </label>
        <div className="proc-actions">
          <button className="btn" onClick={() => send()}>
            Send request
          </button>
          <button className="btn btn--ghost" onClick={() => burst(8)}>
            Burst ×8
          </button>
          <button className="btn btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <p className="panel-hint">
        Tokens: {tokens}/{limit} · Accepted: {accepted} · Rejected (429): {rejected}
      </p>
      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}

import { useMemo, useState } from 'react'

type Algo = 'round-robin' | 'random' | 'least-conn'

interface Backend {
  id: string
  maxConn: number
  active: number
  handled: number
}

const INIT: Backend[] = [
  { id: 'A', maxConn: 4, active: 0, handled: 0 },
  { id: 'B', maxConn: 4, active: 0, handled: 0 },
  { id: 'C', maxConn: 4, active: 0, handled: 0 },
]

export function LoadBalancerSim() {
  const [algo, setAlgo] = useState<Algo>('round-robin')
  const [backends, setBackends] = useState<Backend[]>(() => INIT.map((b) => ({ ...b })))
  const [rrIndex, setRrIndex] = useState(0)
  const [requests, setRequests] = useState(0)
  const [rejected, setRejected] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const totalHandled = useMemo(() => backends.reduce((s, b) => s + b.handled, 0), [backends])

  const sendRequest = () => {
    setRequests((r) => r + 1)
    setBackends((prev) => {
      const next = prev.map((b) => ({ ...b }))
      const available = next.filter((b) => b.active < b.maxConn)
      if (available.length === 0) {
        setRejected((r) => r + 1)
        setLog((l) => [...l.slice(-8), '✗ no capacity — request dropped'].slice(-9))
        return prev
      }

      let target: Backend
      if (algo === 'random') {
        target = available[Math.floor(Math.random() * available.length)]
      } else if (algo === 'least-conn') {
        target = available.reduce((best, b) => (b.active < best.active ? b : best))
      } else {
        let idx = rrIndex
        let picked: Backend | undefined
        for (let i = 0; i < next.length; i++) {
          const b = next[(idx + i) % next.length]
          if (b.active < b.maxConn) {
            picked = b
            setRrIndex((idx + i + 1) % next.length)
            break
          }
        }
        target = picked ?? available[0]
      }

      const b = next.find((x) => x.id === target.id)!
      b.active += 1
      b.handled += 1
      setLog((l) => [...l.slice(-8), `→ ${b.id} (active ${b.active}/${b.maxConn})`].slice(-9))
      return next
    })
  }

  const tick = () => {
    setBackends((prev) =>
      prev.map((b) => (b.active > 0 ? { ...b, active: b.active - 1 } : b)),
    )
  }

  const burst = (n: number) => {
    for (let i = 0; i < n; i++) sendRequest()
  }

  const reset = () => {
    setBackends(INIT.map((b) => ({ ...b })))
    setRrIndex(0)
    setRequests(0)
    setRejected(0)
    setLog([])
  }

  return (
    <div className="panel">
      <div className="race-controls">
        <label className="conv-field">
          <span>Algorithm</span>
          <select value={algo} onChange={(e) => setAlgo(e.target.value as Algo)}>
            <option value="round-robin">Round robin</option>
            <option value="least-conn">Least connections</option>
            <option value="random">Random</option>
          </select>
        </label>
        <div className="proc-actions">
          <button className="btn" onClick={sendRequest}>
            + 1 request
          </button>
          <button className="btn btn--ghost" onClick={() => burst(5)}>
            Burst ×5
          </button>
          <button className="btn btn--ghost" onClick={tick}>
            Complete work (tick)
          </button>
          <button className="btn btn--ghost" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      <div className="lb-grid">
        <div className="lb-front">⚖️ LB</div>
        {backends.map((b) => {
          const pct = Math.round((b.active / b.maxConn) * 100)
          const hot = pct >= 100
          return (
            <div key={b.id} className="lb-backend">
              <div className="lb-backend-top">🖥️ {b.id}</div>
              <div className="instance-bar">
                <div
                  className={`instance-fill${hot ? ' instance-fill--hot' : ''}`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <div className="lb-stats">
                active {b.active}/{b.maxConn} · served {b.handled}
              </div>
            </div>
          )
        })}
      </div>

      <div className="sim-averages">
        <div>
          <span className="avg-label">Sent</span>
          <span className="avg-value">{requests}</span>
        </div>
        <div>
          <span className="avg-label">Handled</span>
          <span className="avg-value">{totalHandled}</span>
        </div>
        <div>
          <span className="avg-label">Dropped</span>
          <span className={`avg-value ${rejected > 0 ? 'race-bad' : 'race-ok'}`}>{rejected}</span>
        </div>
      </div>

      {log.length > 0 && <pre className="term-output pipeline-log">{log.join('\n')}</pre>}

      {rejected > 0 && (
        <div className="race-verdict race-verdict--bad">
          ✗ All backends at max connections — load balancer must queue, retry, or scale out.
        </div>
      )}
    </div>
  )
}

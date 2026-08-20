import { useEffect, useState } from 'react'

const CAP = 100 // requests/sec one instance can handle
const COST = 30 // $/month per instance

export function ScalingSimulator() {
  const [load, setLoad] = useState(250)
  const [instances, setInstances] = useState(3)
  const [autoscale, setAutoscale] = useState(false)

  // Autoscale keeps utilization near 70% by adding/removing instances.
  useEffect(() => {
    if (!autoscale) return
    const target = Math.max(1, Math.ceil(load / (CAP * 0.7)))
    if (target !== instances) {
      const id = setTimeout(() => setInstances(target), 400)
      return () => clearTimeout(id)
    }
  }, [autoscale, load, instances])

  const capacity = instances * CAP
  const utilization = capacity > 0 ? Math.round((load / capacity) * 100) : 0
  const dropped = Math.max(0, load - capacity)
  const perInstance = Math.min(load / instances, CAP)

  return (
    <div className="panel">
      <div className="race-controls">
        <label className="conv-field" style={{ maxWidth: 280 }}>
          <span>Incoming load: {load} req/s</span>
          <input type="range" min={0} max={1200} step={10} value={load} onChange={(e) => setLoad(Number(e.target.value))} />
        </label>
        <label className="lock-toggle">
          <input type="checkbox" checked={autoscale} onChange={(e) => setAutoscale(e.target.checked)} />
          Autoscale (target 70% utilization)
        </label>
        <div className="proc-actions">
          <button className="btn" disabled={autoscale} onClick={() => setInstances((n) => n + 1)}>+ instance</button>
          <button className="btn btn--ghost" disabled={autoscale} onClick={() => setInstances((n) => Math.max(1, n - 1))}>− instance</button>
        </div>
      </div>

      <p className="panel-hint">Each instance handles {CAP} req/s and costs ${COST}/mo.</p>

      <div className="instance-grid">
        {Array.from({ length: instances }, (_, i) => {
          const pct = Math.round((perInstance / CAP) * 100)
          const hot = pct >= 90
          return (
            <div key={i} className="instance">
              <div className="instance-top">🖥️ #{i + 1}</div>
              <div className="instance-bar">
                <div className={`instance-fill${hot ? ' instance-fill--hot' : ''}`} style={{ height: `${pct}%` }} />
              </div>
              <div className="instance-pct">{pct}%</div>
            </div>
          )
        })}
      </div>

      <div className="sim-averages">
        <div><span className="avg-label">Instances</span><span className="avg-value">{instances}</span></div>
        <div><span className="avg-label">Utilization</span><span className={`avg-value ${utilization > 100 ? 'race-bad' : utilization > 85 ? '' : 'race-ok'}`}>{utilization}%</span></div>
        <div><span className="avg-label">Dropped</span><span className={`avg-value ${dropped > 0 ? 'race-bad' : 'race-ok'}`}>{dropped} req/s</span></div>
        <div><span className="avg-label">Cost</span><span className="avg-value">${instances * COST}/mo</span></div>
      </div>

      {dropped > 0 && (
        <div className="race-verdict race-verdict--bad">
          ✗ Overloaded — capacity is {capacity} req/s but {load} req/s are arriving, so {dropped} req/s are being dropped. Add instances (or turn on autoscaling).
        </div>
      )}
      {dropped === 0 && utilization < 40 && instances > 1 && (
        <div className="race-verdict race-verdict--ok">
          ✓ Comfortable — but utilization is only {utilization}%. You could remove an instance to cut cost.
        </div>
      )}
    </div>
  )
}

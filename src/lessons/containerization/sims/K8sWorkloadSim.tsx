import { useEffect, useState } from 'react'

export function K8sWorkloadSim() {
  const [desired, setDesired] = useState(3)
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (actual >= desired) return
    const t = setTimeout(() => setActual((a) => Math.min(a + 1, desired)), 600)
    return () => clearTimeout(t)
  }, [actual, desired])

  useEffect(() => {
    if (actual > desired) setActual(desired)
  }, [desired, actual])

  return (
    <div className="panel">
      <div className="panel-title">Deployment reconciliation</div>
      <label className="modal-field">
        <span>spec.replicas</span>
        <input
          type="range"
          min={0}
          max={6}
          value={desired}
          onChange={(e) => setDesired(Number(e.target.value))}
        />
        <span>{desired}</span>
      </label>
      <p className="panel-hint">
        Controller sees desired={desired}, actual={actual} — creates or terminates pods until they match.
      </p>
      <div className="ref-run-row" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        {Array.from({ length: actual }, (_, i) => (
          <span key={i} className="badge badge--beginner">
            Pod {i + 1}
          </span>
        ))}
        {actual < desired && <span className="badge badge--muted">scheduling…</span>}
      </div>
    </div>
  )
}

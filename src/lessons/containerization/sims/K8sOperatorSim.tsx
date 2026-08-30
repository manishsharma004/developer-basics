import { useEffect, useState } from 'react'

export function K8sOperatorSim({ mode }: { mode: 'builtin' | 'custom' }) {
  const [desired, setDesired] = useState(2)
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    setEvents([])
    const lines =
      mode === 'builtin'
        ? [
            `Deployment controller: desired replicas=${desired}`,
            ...Array.from({ length: desired }, (_, i) => `Created Pod web-${i + 1}`),
            'Status: Available',
          ]
        : [
            `CRD DatabaseClaim/db-prod observed`,
            `Operator: ensure StatefulSet db-prod (replicas=1)`,
            `Operator: ensure Service db-prod`,
            `Status: Ready`,
          ]
    let i = 0
    const id = setInterval(() => {
      if (i < lines.length) {
        setEvents((e) => [...e, lines[i]!])
        i++
      } else clearInterval(id)
    }, 500)
    return () => clearInterval(id)
  }, [desired, mode])

  return (
    <div className="panel">
      <div className="panel-title">{mode === 'builtin' ? 'Deployment controller' : 'Custom operator'}</div>
      {mode === 'builtin' && (
        <label className="modal-field">
          <span>spec.replicas</span>
          <input type="range" min={0} max={5} value={desired} onChange={(e) => setDesired(Number(e.target.value))} />
        </label>
      )}
      <pre className="terminal-output">{events.join('\n') || 'Reconciling…'}</pre>
    </div>
  )
}

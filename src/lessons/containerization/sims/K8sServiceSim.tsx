import { useState } from 'react'

type SvcType = 'ClusterIP' | 'NodePort' | 'LoadBalancer'

export function K8sServiceSim() {
  const [type, setType] = useState<SvcType>('ClusterIP')
  const [hits, setHits] = useState<string[]>([])

  const route = () => {
    const pod = `pod-${(hits.length % 3) + 1}`
    let path = ''
    if (type === 'ClusterIP') path = `cluster DNS my-svc → ${pod}`
    if (type === 'NodePort') path = `nodeIP:30080 → service → ${pod}`
    if (type === 'LoadBalancer') path = `cloud LB → NodePort → service → ${pod}`
    setHits((h) => [...h, path])
  }

  return (
    <div className="panel">
      <div className="panel-title">Service types</div>
      <div className="ref-run-row">
        {(['ClusterIP', 'NodePort', 'LoadBalancer'] as const).map((t) => (
          <button key={t} type="button" className={`btn ${type === t ? '' : 'btn--ghost'}`} onClick={() => setType(t)}>
            {t}
          </button>
        ))}
      </div>
      <button type="button" className="btn" onClick={route}>
        Send request
      </button>
      <pre className="terminal-output">{hits.slice(-5).join('\n') || 'Click Send request'}</pre>
    </div>
  )
}

import { useState } from 'react'

const RULES = [
  { host: 'api.example.com', path: '/v1', backend: 'api-svc:8080' },
  { host: 'www.example.com', path: '/', backend: 'web-svc:80' },
]

export function IngressSim() {
  const [host, setHost] = useState('api.example.com')
  const [path, setPath] = useState('/v1/users')

  const match = RULES.find((r) => host === r.host && path.startsWith(r.path))

  return (
    <div className="panel">
      <div className="panel-title">Ingress routing</div>
      <label className="modal-field">
        <span>Host</span>
        <input value={host} onChange={(e) => setHost(e.target.value)} />
      </label>
      <label className="modal-field">
        <span>Path</span>
        <input value={path} onChange={(e) => setPath(e.target.value)} />
      </label>
      <pre className="terminal-output">
        {match ? `Ingress → ${match.backend}` : '404 — no ingress rule matched'}
      </pre>
    </div>
  )
}

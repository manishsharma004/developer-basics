import { useState } from 'react'

const RULES = [
  { host: 'api.example.com', path: '/v1', backend: 'api-svc:8080' },
  { host: 'www.example.com', path: '/', backend: 'web-svc:80' },
]

export function IngressSim() {
  const [host, setHost] = useState('api.example.com')
  const [path, setPath] = useState('/v1/users')
  const [tls, setTls] = useState(true)

  const match = RULES.find((r) => host === r.host && path.startsWith(r.path))
  const scheme = tls ? 'https' : 'http'

  return (
    <div className="panel">
      <div className="panel-title">Ingress routing</div>
      <div className="ref-run-row">
        <label className="modal-field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={tls} onChange={(e) => setTls(e.target.checked)} />
          <span>TLS termination at ingress</span>
        </label>
      </div>
      <label className="modal-field">
        <span>Host</span>
        <input value={host} onChange={(e) => setHost(e.target.value)} />
      </label>
      <label className="modal-field">
        <span>Path</span>
        <input value={path} onChange={(e) => setPath(e.target.value)} />
      </label>
      <pre className="terminal-output">
        {match
          ? `${scheme.toUpperCase()} ${scheme}://${host}${path}\n  → terminate TLS at ingress-controller\n  → forward HTTP to ${match.backend}`
          : `404 — no ingress rule matched for ${host}${path}`}
      </pre>
      <p className="panel-hint">Rules table: {RULES.map((r) => `${r.host}${r.path} → ${r.backend}`).join(' · ')}</p>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { MermaidDiagram } from '../../components/MermaidDiagram.tsx'
import { useFlowAnimation } from '../../components/useFlowAnimation.ts'
import { API_GATEWAY_DIAGRAM, WEB_NODE_META } from './diagrams.ts'

const KEYS = {
  valid: 'sk_live_demo_key',
  invalid: 'bad_key',
} as const

const ROUTES = [
  { path: '/users', service: 'users' as const },
  { path: '/orders', service: 'orders' as const },
]

export function ApiGatewaySim() {
  const [apiKey, setApiKey] = useState<string>(KEYS.valid)
  const [path, setPath] = useState('/users')
  const [selected, setSelected] = useState<string | null>(null)
  const { running, log, reset, runSteps, activeNodes } = useFlowAnimation()

  const route = useMemo(() => ROUTES.find((r) => r.path === path) ?? ROUTES[0]!, [path])
  const keyOk = apiKey === KEYS.valid

  const steps = useMemo(() => {
    if (!keyOk) {
      return [
        { nodes: ['client'], message: `${path}  Authorization: Bearer ${apiKey}` },
        { nodes: ['gw'], message: 'Gateway receives request — checking API key…' },
        { nodes: ['auth'], message: 'Key lookup failed — invalid or revoked' },
        { nodes: ['r401'], message: '✗ 401 Unauthorized (rejected before backend)' },
      ]
    }
    return [
      { nodes: ['client'], message: `${path}  Authorization: Bearer ${apiKey.slice(0, 12)}…` },
      { nodes: ['gw', 'auth'], message: 'API key valid — quota OK' },
      { nodes: ['route'], message: `Route ${path} → ${route.service} service` },
      { nodes: [route.service], message: `✓ 200 OK from ${route.service} microservice` },
    ]
  }, [apiKey, keyOk, path, route.service])

  const invoke = () => {
    reset()
    void runSteps(steps)
  }

  return (
    <div className="panel web-lab">
      <div className="panel-title">API gateway simulator</div>
      <p className="panel-hint">
        Gateways add auth, keys, and routing on top of a reverse proxy — reject bad keys before
        backends see traffic.
      </p>

      <MermaidDiagram
        code={API_GATEWAY_DIAGRAM}
        title="Gateway flow"
        activeNodes={activeNodes(steps)}
        selectedNode={selected}
        nodeMeta={WEB_NODE_META}
        onNodeClick={setSelected}
      />

      <div className="race-controls">
        <label className="conv-field">
          <span>API key</span>
          <select value={apiKey} onChange={(e) => setApiKey(e.target.value)} disabled={running}>
            <option value={KEYS.valid}>Valid demo key</option>
            <option value={KEYS.invalid}>Invalid key</option>
          </select>
        </label>
        <label className="conv-field">
          <span>Path</span>
          <select value={path} onChange={(e) => setPath(e.target.value)} disabled={running}>
            {ROUTES.map((r) => (
              <option key={r.path} value={r.path}>
                {r.path}
              </option>
            ))}
          </select>
        </label>
        <div className="proc-actions">
          <button className="btn" onClick={invoke} disabled={running}>
            {running ? 'Processing…' : '▶ Invoke API'}
          </button>
          <button className="btn btn--ghost" onClick={reset} disabled={running}>
            Reset
          </button>
        </div>
      </div>

      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}

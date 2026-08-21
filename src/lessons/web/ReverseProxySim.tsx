import { useMemo, useState } from 'react'
import { MermaidDiagram } from '../../components/MermaidDiagram.tsx'
import { useFlowAnimation } from '../../components/useFlowAnimation.ts'
import { REVERSE_PROXY_DIAGRAM, WEB_NODE_META } from './diagrams.ts'

const PATHS = [
  { path: '/api/users', label: 'GET /api/users', backend: 'api' as const },
  { path: '/', label: 'GET / (SPA)', backend: 'web' as const },
]

export function ReverseProxySim() {
  const [path, setPath] = useState(PATHS[0]!.path)
  const [selected, setSelected] = useState<string | null>(null)
  const { running, log, reset, runSteps, activeNodes } = useFlowAnimation()

  const choice = useMemo(() => PATHS.find((p) => p.path === path) ?? PATHS[0]!, [path])

  const steps = useMemo(
    () => [
      { nodes: ['client'], message: `Client → nginx:443  HTTPS  ${choice.path}` },
      { nodes: ['nginx'], message: 'nginx terminates TLS — decrypts HTTPS to HTTP internally' },
      {
        nodes: ['nginx', choice.backend],
        message: `proxy_pass http://${choice.backend === 'api' ? 'api:8000' : 'frontend:3000'}`,
      },
      {
        nodes: [choice.backend],
        message: `✓ 200 OK from ${choice.backend === 'api' ? 'API' : 'Frontend'} upstream`,
      },
    ],
    [choice],
  )

  const send = () => {
    reset()
    void runSteps(steps)
  }

  return (
    <div className="panel web-lab">
      <div className="panel-title">Reverse proxy request flow</div>
      <p className="panel-hint">
        The client sees one public host. nginx terminates TLS and forwards to private upstreams.
      </p>

      <MermaidDiagram
        code={REVERSE_PROXY_DIAGRAM}
        title="Architecture"
        activeNodes={activeNodes(steps)}
        selectedNode={selected}
        nodeMeta={WEB_NODE_META}
        onNodeClick={setSelected}
      />

      <div className="race-controls">
        <label className="conv-field">
          <span>Request</span>
          <select value={path} onChange={(e) => setPath(e.target.value)} disabled={running}>
            {PATHS.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <div className="proc-actions">
          <button className="btn" onClick={send} disabled={running}>
            {running ? 'Routing…' : '▶ Send through nginx'}
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

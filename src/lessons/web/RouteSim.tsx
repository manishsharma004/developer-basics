import { useMemo, useState } from 'react'
import { MermaidDiagram } from '../../components/MermaidDiagram.tsx'
import { NGINX_ROUTING_DIAGRAM, WEB_NODE_META } from './diagrams.ts'

interface RouteRule {
  id: string
  prefix: string
  upstream: string
}

const RULES: RouteRule[] = [
  { id: 'api', prefix: '/api/', upstream: 'api:8000' },
  { id: 'admin', prefix: '/admin/', upstream: 'admin:9000' },
  { id: 'static', prefix: '/static/', upstream: 'cdn:443' },
]

export function RouteSim() {
  const [path, setPath] = useState('/api/users')
  const [log, setLog] = useState<string[]>([])
  const [activeNodes, setActiveNodes] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  const match = useMemo(() => {
    const sorted = [...RULES].sort((a, b) => b.prefix.length - a.prefix.length)
    return sorted.find((rule) => path.startsWith(rule.prefix))
  }, [path])

  const route = () => {
    setActiveNodes(['req', 'nginx'])
    if (match) {
      setActiveNodes(['req', 'nginx', match.id])
      setLog((entries) => [
        ...entries.slice(-7),
        `${path} → proxy_pass http://${match.upstream}`,
      ])
      return
    }
    setActiveNodes(['req', 'nginx', 'err'])
    setLog((entries) => [...entries.slice(-7), `${path} → 404 (no location match)`])
  }

  return (
    <div className="panel web-lab">
      <div className="panel-title">nginx-style path router</div>
      <p className="panel-hint">
        Longest prefix wins — same idea as nginx <code>location</code> blocks.
      </p>

      <MermaidDiagram
        code={NGINX_ROUTING_DIAGRAM}
        title="Routing diagram"
        activeNodes={activeNodes}
        selectedNode={selected}
        nodeMeta={WEB_NODE_META}
        onNodeClick={setSelected}
      />
      <div className="race-controls">
        <input
          className="conv-text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="/api/users"
          aria-label="Request path"
        />
        <div className="proc-actions">
          <button className="btn" onClick={route}>
            Route
          </button>
        </div>
      </div>
      <p className="panel-hint">
        Match:{' '}
        {match ? (
          <>
            <code>{match.prefix}</code> → <code>{match.upstream}</code>
          </>
        ) : (
          'none'
        )}
      </p>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Prefix</th>
            <th>Upstream</th>
          </tr>
        </thead>
        <tbody>
          {RULES.map((rule) => (
            <tr key={rule.id}>
              <td>
                <code>{rule.prefix}</code>
              </td>
              <td>
                <code>{rule.upstream}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {log.length > 0 && (
        <pre className="term-output">{log.join('\n')}</pre>
      )}
    </div>
  )
}

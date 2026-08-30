import { useMemo, useState } from 'react'
import { parse as parseYaml } from 'yaml'

const SAMPLE = `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
    depends_on:
      - api
  api:
    build: ./api
    environment:
      DATABASE_URL: postgres://db:5432/app
    depends_on:
      - db
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`

export function ComposeGraphSim() {
  const [yaml, setYaml] = useState(SAMPLE)
  const graph = useMemo(() => {
    try {
      const doc = parseYaml(yaml) as { services?: Record<string, { depends_on?: string[] | Record<string, unknown> }> }
      const services = doc.services ?? {}
      return Object.entries(services).map(([name, cfg]) => ({
        name,
        deps: Array.isArray(cfg.depends_on)
          ? cfg.depends_on
          : cfg.depends_on
            ? Object.keys(cfg.depends_on)
            : [],
      }))
    } catch {
      return null
    }
  }, [yaml])

  return (
    <div className="panel">
      <div className="panel-title">Compose → service graph</div>
      <textarea className="code-input" rows={16} value={yaml} onChange={(e) => setYaml(e.target.value)} spellCheck={false} />
      {graph ? (
        <pre className="flow-diagram">
          {graph
            .map((s) => {
              const arrows = s.deps.length ? ` ← depends on ${s.deps.join(', ')}` : ''
              return `[${s.name}]${arrows}`
            })
            .join('\n')}
        </pre>
      ) : (
        <p className="panel-hint">Fix YAML syntax to see the dependency graph.</p>
      )}
    </div>
  )
}

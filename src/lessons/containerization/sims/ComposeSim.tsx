import { useMemo, useState } from 'react'
import { parse as parseYaml } from 'yaml'

const DEFAULT = `services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
    depends_on: [api]
  api:
    image: myapi:1.0
    environment:
      DB_HOST: db
    depends_on: [db]
  db:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:`

type Svc = { name: string; status: 'down' | 'starting' | 'up'; deps: string[] }

export function ComposeSim({ showProfiles = false }: { showProfiles?: boolean }) {
  const [yaml, setYaml] = useState(DEFAULT)
  const [profile, setProfile] = useState<'default' | 'debug'>('default')
  const [up, setUp] = useState(false)

  const services = useMemo((): Svc[] | null => {
    try {
      const doc = parseYaml(yaml) as {
        services?: Record<string, { depends_on?: string[]; profiles?: string[] }>
      }
      const raw = doc.services ?? {}
      return Object.entries(raw)
        .filter(([, cfg]) => {
          if (!showProfiles || !cfg.profiles?.length) return true
          return cfg.profiles.includes(profile)
        })
        .map(([name, cfg]) => ({
          name,
          status: 'down' as const,
          deps: cfg.depends_on ?? [],
        }))
    } catch {
      return null
    }
  }, [yaml, profile, showProfiles])

  const running = useMemo(() => {
    if (!services || !up) return services?.map((s) => ({ ...s, status: 'down' as const })) ?? []
    const status = new Map(services.map((s) => [s.name, 'down' as 'down' | 'starting' | 'up']))
    let changed = true
    while (changed) {
      changed = false
      for (const s of services) {
        if (status.get(s.name) === 'up') continue
        const depsUp = s.deps.every((d) => status.get(d) === 'up')
        if (s.deps.length === 0 || depsUp) {
          if (status.get(s.name) !== 'up') {
            status.set(s.name, 'up')
            changed = true
          }
        } else if (s.deps.some((d) => status.get(d) === 'up')) {
          status.set(s.name, 'starting')
        }
      }
    }
    return services.map((s) => ({ ...s, status: status.get(s.name) ?? 'down' }))
  }, [services, up])

  return (
    <div className="panel">
      <div className="panel-title">docker compose up</div>
      {showProfiles && (
        <div className="ref-run-row">
          <span>Profile:</span>
          <button type="button" className={`btn ${profile === 'default' ? '' : 'btn--ghost'}`} onClick={() => setProfile('default')}>
            default
          </button>
          <button type="button" className={`btn ${profile === 'debug' ? '' : 'btn--ghost'}`} onClick={() => setProfile('debug')}>
            debug
          </button>
        </div>
      )}
      <textarea className="code-input" rows={12} value={yaml} onChange={(e) => setYaml(e.target.value)} spellCheck={false} />
      <div className="ref-run-row">
        <button type="button" className="btn" onClick={() => setUp(true)}>
          docker compose up -d
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setUp(false)}>
          docker compose down
        </button>
      </div>
      {services ? (
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Depends on</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {running.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td>{s.deps.join(', ') || '—'}</td>
                <td>
                  <span className={`badge badge--${s.status === 'up' ? 'beginner' : 'muted'}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="panel-hint">Invalid YAML</p>
      )}
    </div>
  )
}

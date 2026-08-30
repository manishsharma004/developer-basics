import { useMemo, useState } from 'react'
import { parse as parseYaml } from 'yaml'

const DEFAULT = `services:
  web:
    image: nginx:alpine
    ports: ["8080:80"]
    depends_on:
      api:
        condition: service_healthy
  api:
    image: myapi:1.0
    environment:
      DB_HOST: db
    depends_on: [db]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 5s
      retries: 3
  db:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]
volumes:
  pgdata:`

type Svc = { name: string; status: 'down' | 'starting' | 'up' | 'healthy'; deps: string[]; hasHealth: boolean }

function parseServices(
  yaml: string,
  profile: 'default' | 'debug',
  showProfiles: boolean,
): Svc[] | null {
  try {
    const doc = parseYaml(yaml) as {
      services?: Record<string, { depends_on?: string[] | Record<string, { condition?: string }>; profiles?: string[]; healthcheck?: unknown }>
    }
    const raw = doc.services ?? {}
    return Object.entries(raw)
      .filter(([, cfg]) => {
        if (!showProfiles || !cfg.profiles?.length) return true
        return cfg.profiles.includes(profile)
      })
      .map(([name, cfg]) => {
        let deps: string[] = []
        if (Array.isArray(cfg.depends_on)) deps = cfg.depends_on
        else if (cfg.depends_on) deps = Object.keys(cfg.depends_on)
        return {
          name,
          status: 'down' as const,
          deps,
          hasHealth: Boolean(cfg.healthcheck),
        }
      })
  } catch {
    return null
  }
}

function resolveStatus(services: Svc[], up: boolean, requireHealthy: boolean): Svc[] {
  if (!up) return services.map((s) => ({ ...s, status: 'down' as const }))
  const status = new Map<string, Svc['status']>()
  for (const s of services) status.set(s.name, 'down')

  let changed = true
  for (let tick = 0; tick < 12 && changed; tick += 1) {
    changed = false
    for (const s of services) {
      const cur = status.get(s.name)!
      const depsOk = s.deps.every((d) => {
        const ds = status.get(d)
        if (!requireHealthy) return ds === 'up' || ds === 'healthy'
        return ds === 'healthy'
      })
      if (s.deps.length > 0 && !depsOk) {
        if (s.deps.some((d) => status.get(d) === 'up' || status.get(d) === 'healthy') && cur === 'down') {
          status.set(s.name, 'starting')
          changed = true
        }
        continue
      }
      if (cur === 'down' || cur === 'starting') {
        status.set(s.name, s.hasHealth && requireHealthy ? 'up' : 'up')
        changed = true
      } else if (s.hasHealth && requireHealthy && cur === 'up' && tick > 0) {
        status.set(s.name, 'healthy')
        changed = true
      }
    }
  }
  return services.map((s) => ({ ...s, status: status.get(s.name) ?? 'down' }))
}

export function ComposeSim({
  showProfiles = false,
  showHealthchecks = false,
}: {
  showProfiles?: boolean
  showHealthchecks?: boolean
}) {
  const [yaml, setYaml] = useState(DEFAULT)
  const [profile, setProfile] = useState<'default' | 'debug'>('default')
  const [up, setUp] = useState(false)

  const services = useMemo(
    () => parseServices(yaml, profile, showProfiles),
    [yaml, profile, showProfiles],
  )

  const running = useMemo(
    () => (services ? resolveStatus(services, up, showHealthchecks) : []),
    [services, up, showHealthchecks],
  )

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
      <textarea className="code-input" rows={14} value={yaml} onChange={(e) => setYaml(e.target.value)} spellCheck={false} />
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
                <td>
                  {s.name}
                  {s.hasHealth && <span className="badge badge--muted"> healthcheck</span>}
                </td>
                <td>{s.deps.join(', ') || '—'}</td>
                <td>
                  <span className={`badge badge--${s.status === 'down' ? 'muted' : 'beginner'}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="panel-hint">Invalid YAML</p>
      )}
      {showHealthchecks && (
        <p className="panel-hint">
          Services with healthchecks become <code>healthy</code> after <code>up</code>; dependents with{' '}
          <code>condition: service_healthy</code> wait.
        </p>
      )}
    </div>
  )
}

import { useState } from 'react'

const PATHS = [
  { method: 'GET', path: '/users', summary: 'List users', tag: 'users' },
  { method: 'POST', path: '/users', summary: 'Create user', tag: 'users' },
  { method: 'GET', path: '/users/{id}', summary: 'Get user', tag: 'users' },
  { method: 'GET', path: '/health', summary: 'Health check', tag: 'system' },
]

export function OpenApiSim() {
  const [selected, setSelected] = useState(0)
  const route = PATHS[selected]!
  return (
    <div className="panel web-lab">
      <div className="panel-title">OpenAPI /docs explorer (mock)</div>
      <p className="panel-hint">FastAPI auto-generates this from your route decorators and type hints.</p>
      <div className="ref-snippets">
        {PATHS.map((p, i) => (
          <button key={p.path + p.method} type="button" className="chip" onClick={() => setSelected(i)}>
            {p.method} {p.path}
          </button>
        ))}
      </div>
      <pre className="flow-diagram">{`${route.method} ${route.path}
Tag: ${route.tag}
Summary: ${route.summary}
Try it → Execute → see JSON response`}</pre>
    </div>
  )
}

export function FastApiStackSim() {
  const layers = ['React (Vite)', 'FastAPI', 'SQLAlchemy / driver', 'PostgreSQL']
  const [active, setActive] = useState(0)
  return (
    <div className="panel web-lab">
      <div className="panel-title">Full-stack request path</div>
      <div className="waterfall">
        {layers.map((layer, i) => (
          <button
            key={layer}
            type="button"
            className={`waterfall-row${active === i ? ' waterfall-row--active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="waterfall-label">{layer}</span>
          </button>
        ))}
      </div>
      <p className="panel-hint">
        {active === 0 && 'Browser fetch() → JSON over HTTP'}
        {active === 1 && 'FastAPI validates body, runs handler, returns JSON'}
        {active === 2 && 'Dependency injects DB session; ORM builds SQL'}
        {active === 3 && 'Database commits transaction; rows durable on disk'}
      </p>
    </div>
  )
}

import { useState } from 'react'

const STEPS = ['FROM node:20-alpine', 'WORKDIR /app', 'COPY package.json .', 'RUN npm ci', 'COPY . .', 'CMD ["node","server.js"]']

export function ImageLayersSim() {
  const [built, setBuilt] = useState(0)

  return (
    <div className="panel">
      <div className="panel-title">Image layers</div>
      <p className="panel-hint">Each Dockerfile instruction can create a cached layer. Rebuild skips unchanged layers.</p>
      <button type="button" className="btn" onClick={() => setBuilt((n) => Math.min(n + 1, STEPS.length))}>
        docker build -t myapp:latest .
      </button>
      <ul className="prose-list" style={{ marginTop: '0.75rem' }}>
        {STEPS.map((step, i) => (
          <li key={step} style={{ opacity: i < built ? 1 : 0.35 }}>
            <code>{step}</code>
            {i < built && <span className="badge badge--muted" style={{ marginLeft: '0.5rem' }}>cached</span>}
          </li>
        ))}
      </ul>
      {built === STEPS.length && (
        <p className="panel-hint">
          Image <code>myapp:latest</code> ready — push to a registry with <code>docker push</code>.
        </p>
      )}
    </div>
  )
}

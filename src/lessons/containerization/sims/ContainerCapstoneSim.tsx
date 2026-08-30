import { useState } from 'react'

const STEPS = [
  {
    title: 'Dockerfile built',
    command: 'docker build -t registry.example.com/myapp:$GIT_SHA . && docker push registry.example.com/myapp:$GIT_SHA',
    detail: 'CI pipeline builds and pushes an immutable image tag.',
  },
  {
    title: 'Compose stack up',
    command: 'docker compose -f compose.test.yaml up -d && docker compose run api npm test',
    detail: 'Integration tests hit real postgres and api services on the compose network.',
  },
  {
    title: 'Manifest applied',
    command: 'kubectl apply -f k8s/deploy.yaml',
    detail: 'Deployment spec references the new image digest; controller starts rolling update.',
  },
  {
    title: 'Rollout complete',
    command: 'kubectl rollout status deploy/web && curl -f https://app.example.com/health',
    detail: 'Readiness probes gate traffic; smoke test confirms the release.',
  },
]

export function ContainerCapstoneSim() {
  const [step, setStep] = useState(0)
  const current = STEPS[Math.min(step, STEPS.length - 1)]

  return (
    <div className="panel">
      <div className="panel-title">Ship a small stack</div>
      <ol className="prose-list">
        {STEPS.map((s, i) => (
          <li key={s.title} style={{ opacity: i <= step ? 1 : 0.4 }}>
            <strong>{s.title}</strong> {i < step && '✓'}
            {i === step && (
              <>
                <pre className="terminal-output" style={{ marginTop: '0.5rem' }}>
                  {s.command}
                </pre>
                <p className="panel-hint">{s.detail}</p>
              </>
            )}
          </li>
        ))}
      </ol>
      <button type="button" className="btn" disabled={step >= STEPS.length} onClick={() => setStep((s) => s + 1)}>
        {step >= STEPS.length ? 'Done' : `Next: ${STEPS[step]?.title ?? 'Done'}`}
      </button>
      {step >= STEPS.length && (
        <p className="panel-hint">
          Vertical slice complete: image → compose test → cluster deploy → rollout verify. Practice the same flow in
          the shell below.
        </p>
      )}
      {step < STEPS.length && (
        <p className="panel-hint">
          Step {step + 1}/{STEPS.length}: <code>{current.command.split(' ').slice(0, 3).join(' ')}…</code>
        </p>
      )}
    </div>
  )
}

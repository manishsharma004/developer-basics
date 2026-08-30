import { useState } from 'react'

const STEPS = ['Dockerfile built', 'Compose stack up', 'Manifest applied', 'Rollout complete']

export function ContainerCapstoneSim() {
  const [step, setStep] = useState(0)

  return (
    <div className="panel">
      <div className="panel-title">Ship a small stack</div>
      <ol className="prose-list">
        {STEPS.map((s, i) => (
          <li key={s} style={{ opacity: i <= step ? 1 : 0.4 }}>
            {s} {i <= step && '✓'}
          </li>
        ))}
      </ol>
      <button type="button" className="btn" disabled={step >= STEPS.length} onClick={() => setStep((s) => s + 1)}>
        {step >= STEPS.length ? 'Done' : 'Next step'}
      </button>
      {step >= STEPS.length && (
        <p className="panel-hint">Vertical slice: image → local compose → cluster deploy → rolling update.</p>
      )}
    </div>
  )
}

import { useState } from 'react'

type Stage = 'lint' | 'test' | 'build' | 'deploy'

const STAGES: { id: Stage; label: string; icon: string }[] = [
  { id: 'lint', label: 'Lint', icon: '🔍' },
  { id: 'test', label: 'Test', icon: '✅' },
  { id: 'build', label: 'Build', icon: '📦' },
  { id: 'deploy', label: 'Deploy', icon: '🚀' },
]

const DEFAULT_FAIL: Record<Stage, boolean> = {
  lint: false,
  test: false,
  build: false,
  deploy: false,
}

export function PipelineSimulator() {
  const [fail, setFail] = useState(DEFAULT_FAIL)
  const [running, setRunning] = useState(false)
  const [step, setStep] = useState(-1)
  const [log, setLog] = useState<string[]>([])
  const [done, setDone] = useState<'idle' | 'pass' | 'fail'>('idle')

  const toggleFail = (id: Stage) => {
    if (running) return
    setFail((f) => ({ ...f, [id]: !f[id] }))
    setDone('idle')
    setLog([])
    setStep(-1)
  }

  const run = async () => {
    setRunning(true)
    setDone('idle')
    setLog([])
    setStep(-1)

    for (let i = 0; i < STAGES.length; i++) {
      const s = STAGES[i]
      setStep(i)
      setLog((l) => [...l, `▶ ${s.label}…`])
      await new Promise((r) => setTimeout(r, 600))

      if (fail[s.id]) {
        setLog((l) => [...l, `✗ ${s.label} failed — pipeline stopped.`])
        setDone('fail')
        setRunning(false)
        return
      }
      setLog((l) => [...l, `✓ ${s.label} passed`])
    }

    setLog((l) => [...l, '✓ All stages green — artifact deployed.'])
    setDone('pass')
    setRunning(false)
  }

  return (
    <div className="panel">
      <p className="panel-hint">
        Toggle a stage to simulate failure. CI runs stages in order — the first
        failure blocks everything after it.
      </p>

      <div className="pipeline-stages">
        {STAGES.map((s, i) => {
          const active = step === i
          const passed = step > i
          const failed = done === 'fail' && step === i
          return (
            <div
              key={s.id}
              className={`pipeline-stage${active ? ' pipeline-stage--active' : ''}${passed ? ' pipeline-stage--pass' : ''}${failed ? ' pipeline-stage--fail' : ''}`}
            >
              <span className="pipeline-icon">{s.icon}</span>
              <span>{s.label}</span>
              <label className="lock-toggle pipeline-fail-toggle">
                <input
                  type="checkbox"
                  checked={fail[s.id]}
                  disabled={running}
                  onChange={() => toggleFail(s.id)}
                />
                fail
              </label>
            </div>
          )
        })}
      </div>

      <div className="ref-run-row">
        <button className="btn" disabled={running} onClick={() => void run()}>
          {running ? 'Running…' : '▶ Run pipeline'}
        </button>
        <button
          className="btn btn--ghost"
          disabled={running}
          onClick={() => {
            setFail(DEFAULT_FAIL)
            setLog([])
            setStep(-1)
            setDone('idle')
          }}
        >
          Reset
        </button>
      </div>

      {log.length > 0 && (
        <pre className="term-output pipeline-log">{log.join('\n')}</pre>
      )}

      {done === 'pass' && (
        <div className="race-verdict race-verdict--ok">
          ✓ Pipeline succeeded — this is what runs on every push to main.
        </div>
      )}
      {done === 'fail' && (
        <div className="race-verdict race-verdict--bad">
          ✗ Fix the failing stage locally before merging — CI protects main.
        </div>
      )}
    </div>
  )
}

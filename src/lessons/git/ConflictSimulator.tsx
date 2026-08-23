import { useState } from 'react'

const OUR = `function greet() {
  return "Hello";
}`
const THEIRS = `function greet() {
  return "Hello, world!";
}`

export function ConflictSimulator() {
  const [stage, setStage] = useState<'clean' | 'conflict' | 'resolved'>('clean')
  const [useOurs, setUseOurs] = useState(true)

  const file =
    stage === 'clean'
      ? OUR
      : stage === 'conflict'
        ? `<<<<<<< HEAD\n${OUR}\n=======\n${THEIRS}\n>>>>>>> feature`
        : useOurs
          ? OUR
          : THEIRS

  return (
    <div className="panel">
      <div className="panel-title">Merge conflict simulator</div>
      <div className="ref-run-row">
        <button type="button" className="btn btn--ghost" onClick={() => setStage('clean')}>Clean branch</button>
        <button type="button" className="btn btn--ghost" onClick={() => setStage('conflict')}>Simulate conflict</button>
        {stage === 'conflict' && (
          <>
            <button type="button" className="btn" onClick={() => { setUseOurs(true); setStage('resolved') }}>Keep ours</button>
            <button type="button" className="btn" onClick={() => { setUseOurs(false); setStage('resolved') }}>Keep theirs</button>
          </>
        )}
      </div>
      <pre className="term-output code-block">{file}</pre>
      {stage === 'resolved' && (
        <p className="quiz-feedback quiz-feedback--ok">Conflict resolved — ready to commit merge.</p>
      )}
      <p className="panel-hint">
        PR workflow: branch → push → open PR → review → merge (or rebase onto main first).
        Never force-push shared branches without team agreement.
      </p>
    </div>
  )
}

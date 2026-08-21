import { useMemo, useState } from 'react'

function isClose(a: number, b: number, rel = 1e-9, abs = 0): boolean {
  if (a === b) return true
  const diff = Math.abs(a - b)
  return diff <= Math.max(rel * Math.max(Math.abs(a), Math.abs(b)), abs)
}

export function IsCloseDemo() {
  const [a, setA] = useState(0.1)
  const [b, setB] = useState(0.2)
  const [target, setTarget] = useState(0.3)
  const [relTol, setRelTol] = useState(1e-9)

  const sum = useMemo(() => a + b, [a, b])
  const exactEq = sum === target
  const close = isClose(sum, target, relTol)

  return (
    <div className="panel float-lab">
      <div className="panel-title">Compare with tolerance</div>
      <div className="float-inputs">
        <label className="conv-field">
          <span>a = {a}</span>
          <input type="range" min={0} max={1} step={0.01} value={a} onChange={(e) => setA(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>b = {b}</span>
          <input type="range" min={0} max={1} step={0.01} value={b} onChange={(e) => setB(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>target = {target}</span>
          <input type="range" min={0} max={1} step={0.01} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>rel_tol = 10<sup>{Math.log10(relTol).toFixed(0)}</sup></span>
          <input type="range" min={-15} max={-3} step={1} value={Math.log10(relTol)} onChange={(e) => setRelTol(10 ** Number(e.target.value))} />
        </label>
      </div>
      <pre className="term-output">{`a + b = ${sum}
stored: ${sum.toFixed(17)}
target: ${target}
a + b == target → ${exactEq}
isclose(a + b, target) → ${close}`}</pre>
      <p className="panel-hint">
        Default preset 0.1 + 0.2 vs 0.3: <code>==</code> is false; widen tolerance or use{' '}
        <code>math.isclose</code> for sensible comparisons.
      </p>
    </div>
  )
}

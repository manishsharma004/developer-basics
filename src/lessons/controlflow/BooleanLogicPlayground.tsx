import { useMemo, useState } from 'react'

type Preset = {
  label: string
  expr: string
  eval: (a: boolean, b: boolean, c: boolean) => boolean
  note: string | ((a: boolean) => string)
}

const PRESETS: Preset[] = [
  {
    label: 'and binds tighter',
    expr: 'True and False or True',
    eval: () => (true && false) || true,
    note: '(True and False) or True → False or True → True',
  },
  {
    label: 'not + and',
    expr: 'not a and b',
    eval: (a, b) => !a && b,
    note: '(!a) and b — not applies to a first',
  },
  {
    label: 'not (a and b)',
    expr: 'not (a and b)',
    eval: (a, b) => !(a && b),
    note: 'Negates the whole and expression',
  },
  {
    label: 'short-circuit and',
    expr: 'a and expensive()',
    eval: (a) => a && false,
    note: (a) => (a ? 'Right side runs when a is True' : 'Right side skipped when a is False'),
  },
  {
    label: 'De Morgan',
    expr: 'not (a or b)',
    eval: (a, b) => !(a || b),
    note: 'Same as (not a) and (not b)',
  },
  {
    label: 'or short-circuit',
    expr: 'False or b',
    eval: (_a, b) => false || b,
    note: 'Left side False → right side b decides the result',
  },
]

export function BooleanLogicPlayground() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  const [c, setC] = useState(true)

  const preset = PRESETS[presetIdx]
  const result = useMemo(() => preset.eval(a, b, c), [preset, a, b, c])

  return (
    <div className="panel logic-lab">
      <div className="panel-title">Boolean logic playground</div>
      <div className="logic-snippets">
        {PRESETS.map((p, i) => (
          <button key={p.label} type="button" className={`chip${i === presetIdx ? ' chip--active' : ''}`} onClick={() => setPresetIdx(i)}>
            {p.label}
          </button>
        ))}
      </div>
      <pre className="logic-expr">{preset.expr}</pre>
      <div className="logic-toggles">
        <label className="lock-toggle">
          <input type="checkbox" checked={a} onChange={(e) => setA(e.target.checked)} />
          a = {String(a)}
        </label>
        <label className="lock-toggle">
          <input type="checkbox" checked={b} onChange={(e) => setB(e.target.checked)} />
          b = {String(b)}
        </label>
        <label className="lock-toggle">
          <input type="checkbox" checked={c} onChange={(e) => setC(e.target.checked)} />
          c = {String(c)}
        </label>
      </div>
      <div className={`logic-result logic-result--${result ? 'true' : 'false'}`}>
        Result: <strong>{String(result)}</strong>
      </div>
      <p className="panel-hint">{typeof preset.note === 'function' ? preset.note(a) : preset.note}</p>
    </div>
  )
}

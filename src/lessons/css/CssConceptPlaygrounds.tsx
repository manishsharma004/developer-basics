import { useState } from 'react'

interface Rule {
  id: string
  label: string
  selector: string
  color: string
}

const RULES: Rule[] = [
  { id: 'p', label: 'p', selector: 'p', color: '#94a3b8' },
  { id: 'btn', label: '.btn', selector: '.btn', color: '#38bdf8' },
  { id: 'save', label: '#save', selector: '#save', color: '#f472b6' },
]

export function CascadePlayground() {
  const [activeRules, setActiveRules] = useState<string[]>(['p', 'btn', 'save'])
  const [inline, setInline] = useState(false)

  const toggle = (id: string) => {
    setActiveRules((r) => (r.includes(id) ? r.filter((x) => x !== id) : [...r, id]))
  }

  const score = (id: string) => ({ p: 1, btn: 10, save: 100 }[id] ?? 0)
  const winner = [...activeRules].sort((a, b) => score(b) - score(a) || RULES.findIndex((r) => r.id === b) - RULES.findIndex((r) => r.id === a))[0]
  const winnerRule = RULES.find((r) => r.id === winner)

  const color =
    inline ? '#fbbf24' : winnerRule?.color ?? '#94a3b8'

  return (
    <div className="panel css-lab">
      <div className="panel-title">Specificity calculator</div>
      <p className="panel-hint">Toggle rules on/off — highest specificity wins (inline beats all).</p>
      <div className="ref-snippets">
        {RULES.map((r) => (
          <button key={r.id} type="button" className={`chip${activeRules.includes(r.id) ? '' : ' btn--ghost'}`} onClick={() => toggle(r.id)}>
            {r.label} ({score(r.id)})
          </button>
        ))}
      </div>
      <label className="conv-field">
        <span>Inline style</span>
        <input type="checkbox" checked={inline} onChange={(e) => setInline(e.target.checked)} />
      </label>
      <div className="css-cascade-demo">
        <button type="button" id="save" className="btn css-cascade-target" style={inline ? { color: '#fbbf24' } : undefined}>
          Save button
        </button>
        <p className="css-cascade-target" style={{ color: activeRules.includes('p') && !inline && winner === 'p' ? color : undefined }}>
          Computed color: <strong style={{ color }}>{color}</strong>
        </p>
      </div>
      <p className="panel-hint">
        Winner: <code>{inline ? 'inline style' : winnerRule?.selector ?? 'none'}</code>
      </p>
    </div>
  )
}

export function CssIntroPlayground() {
  const [parentColor, setParentColor] = useState('#38bdf8')
  const [parentFont, setParentFont] = useState(16)
  const [overrideMargin, setOverrideMargin] = useState(false)

  return (
    <div className="panel css-lab">
      <div className="panel-title">Cascade & inheritance</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>Parent color</span>
          <input type="color" value={parentColor} onChange={(e) => setParentColor(e.target.value)} />
        </label>
        <label className="conv-field">
          <span>Parent font {parentFont}px</span>
          <input type="range" min={12} max={24} value={parentFont} onChange={(e) => setParentFont(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>Child sets margin</span>
          <input type="checkbox" checked={overrideMargin} onChange={(e) => setOverrideMargin(e.target.checked)} />
        </label>
      </div>
      <div className="css-inherit-parent" style={{ color: parentColor, fontSize: parentFont }}>
        <p>Parent text — <code>color</code> and <code>font-size</code> inherit.</p>
        <p className="css-inherit-child" style={overrideMargin ? { marginTop: 24 } : undefined}>
          Child paragraph {overrideMargin ? '(margin set locally — does not inherit)' : '(inherits color & font)'}
        </p>
      </div>
    </div>
  )
}

export function HackFixPlayground() {
  const [mode, setMode] = useState<'hack' | 'fix'>('hack')
  return (
    <div className="panel css-lab">
      <div className="panel-title">Hack vs proper fix — centering</div>
      <div className="proc-actions">
        <button type="button" className={`btn${mode === 'hack' ? '' : ' btn--ghost'}`} onClick={() => setMode('hack')}>Float hack</button>
        <button type="button" className={`btn${mode === 'fix' ? '' : ' btn--ghost'}`} onClick={() => setMode('fix')}>Flex fix</button>
      </div>
      <div className={`css-hack-stage css-hack-stage--${mode}`}>
        <div className="css-hack-box">Center me</div>
      </div>
      <p className="panel-hint">
        {mode === 'hack'
          ? 'Legacy: float + clearfix + magic negative margins — fragile.'
          : 'Modern: display:flex; justify-content:center; align-items:center;'}
      </p>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { CodePreview } from '../components/blocks.tsx'

export function EventsDemo() {
  const [name, setName] = useState('Ada')
  const [clicks, setClicks] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const addLog = (msg: string) => setLog((l) => [...l.slice(-4), msg])

  return (
    <div className="panel react-lab">
      <div className="panel-title">Events → state → re-render</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>name (onChange)</span>
          <input value={name} onChange={(e) => { setName(e.target.value); addLog(`onChange → "${e.target.value}"`) }} />
        </label>
        <button className="btn" type="button" onClick={() => { setClicks((c) => c + 1); addLog(`onClick → count ${clicks + 1}`) }}>
          Click me ({clicks})
        </button>
      </div>
      <p className="panel-hint">Hello, <strong>{name}</strong> — handlers call setters; React re-renders.</p>
      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}

export function EffectsDemo() {
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState('React effects demo')
  const [syncTitle, setSyncTitle] = useState(true)
  const [runs, setRuns] = useState(0)

  useEffect(() => {
    if (!syncTitle) return
    setRuns((r) => r + 1)
  }, [count, syncTitle, title])

  return (
    <div className="panel react-lab">
      <div className="panel-title">useEffect dependency array</div>
      <label className="conv-field">
        <span>document.title (simulated)</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <div className="proc-actions">
        <button className="btn" type="button" onClick={() => setCount((c) => c + 1)}>Bump count ({count})</button>
        <label className="conv-field">
          <span>Sync on count change</span>
          <input type="checkbox" checked={syncTitle} onChange={(e) => setSyncTitle(e.target.checked)} />
        </label>
      </div>
      <p className="panel-hint">
        Effect ran <strong>{runs}</strong> time(s). Toggle sync off — changing count won&apos;t re-run the effect.
      </p>
      <p className="panel-hint">Simulated title: <code>{title} ({count})</code></p>
    </div>
  )
}

function Display({ value }: { value: number }) {
  return <div className="react-lift-child">Display: <strong>{value}</strong></div>
}

function Controls({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="react-lift-child proc-actions">
      <button className="btn btn--ghost" type="button" onClick={() => onChange(value - 1)}>−</button>
      <button className="btn btn--ghost" type="button" onClick={() => onChange(value + 1)}>+</button>
    </div>
  )
}

export function LiftStateDemo() {
  const [value, setValue] = useState(0)
  return (
    <div className="panel react-lab">
      <div className="panel-title">Lifted state — siblings share one value</div>
      <p className="panel-hint">State lives in the parent; both children receive props — no prop drilling through many levels yet.</p>
      <div className="react-lift-wrap">
        <Controls value={value} onChange={setValue} />
        <Display value={value} />
      </div>
    </div>
  )
}

export function JsxRulesDemo() {
  const [mode, setMode] = useState<'broken' | 'fixed'>('broken')
  return (
    <div className="panel react-lab">
      <div className="panel-title">JSX rules — spot the fix</div>
      <div className="proc-actions">
        <button className={`btn${mode === 'broken' ? '' : ' btn--ghost'}`} type="button" onClick={() => setMode('broken')}>Broken</button>
        <button className={`btn${mode === 'fixed' ? '' : ' btn--ghost'}`} type="button" onClick={() => setMode('fixed')}>Fixed</button>
      </div>
      <CodePreview
        language="javascript"
        code={mode === 'broken'
          ? `<div class="card">          // ❌ class not className
  {if (ok) <span>yes</span>}   // ❌ if inside JSX braces
  <img src="x.png">            // ❌ not self-closing
</div>`
          : `<div className="card">       // ✓ className
  {ok && <span>yes</span>}     // ✓ expression, not statement
  <img src="x.png" />          // ✓ self-closing
</div>`}
      />
    </div>
  )
}

export function VdomDiffDemo() {
  const [version, setVersion] = useState(0)
  const items = version === 0 ? ['Home', 'About', 'Contact'] : ['Home', 'Pricing', 'About', 'Contact']
  return (
    <div className="panel react-lab">
      <div className="panel-title">Reconciliation — minimal DOM updates</div>
      <button className="btn" type="button" onClick={() => setVersion((v) => (v === 0 ? 1 : 0))}>
        {version === 0 ? 'Insert "Pricing"' : 'Remove "Pricing"'}
      </button>
      <ul className="react-vdom-list">
        {items.map((item) => (
          <li key={item} className={item === 'Pricing' ? 'react-vdom-new' : ''}>{item}</li>
        ))}
      </ul>
      <p className="panel-hint">Stable <code>key</code> values let React insert one node instead of re-rendering the whole list.</p>
    </div>
  )
}

const HOOK_SCENARIOS = [
  { id: 'valid', label: 'Valid', ok: true, code: `function App() {
  const [a, setA] = useState(0)
  useEffect(() => {}, [a])
  return <button onClick={() => setA(a+1)}>{a}</button>
}` },
  { id: 'conditional', label: 'Inside if', ok: false, code: `function App({ show }) {
  if (show) {
    const [a, setA] = useState(0) // ❌ conditional hook
  }
}` },
  { id: 'loop', label: 'Inside loop', ok: false, code: `function App({ items }) {
  items.forEach(() => {
    useState(0) // ❌ hook in loop
  })
}` },
]

export function HooksRulesDemo() {
  const [scenario, setScenario] = useState(HOOK_SCENARIOS[0]!)
  return (
    <div className="panel react-lab">
      <div className="panel-title">Rules of hooks</div>
      <div className="ref-snippets">
        {HOOK_SCENARIOS.map((s) => (
          <button key={s.id} type="button" className="chip" onClick={() => setScenario(s)}>{s.label}</button>
        ))}
      </div>
      <CodePreview language="javascript" code={scenario.code} />
      <p className={`panel-hint${scenario.ok ? '' : ' overflow-warn'}`}>
        {scenario.ok ? '✓ Hooks at top level — order stable every render.' : '✗ Hook order would change between renders — React breaks.'}
      </p>
    </div>
  )
}

const ECOSYSTEM = [
  { name: 'React Router', role: 'URL → pages', pairs: 'FastAPI routes' },
  { name: 'TanStack Query', role: 'Cache API data', pairs: 'GET /api/*' },
  { name: 'Vite', role: 'Dev server + build', pairs: 'localhost:5173' },
  { name: 'TypeScript', role: 'Typed props & API', pairs: 'OpenAPI types' },
]

export function EcosystemMap() {
  const [selected, setSelected] = useState(0)
  const item = ECOSYSTEM[selected]!
  return (
    <div className="panel react-lab">
      <div className="panel-title">React in a full stack</div>
      <div className="ref-snippets">
        {ECOSYSTEM.map((e, i) => (
          <button key={e.name} type="button" className={`chip${selected === i ? ' chip--active' : ''}`} onClick={() => setSelected(i)}>{e.name}</button>
        ))}
      </div>
      <p className="panel-hint"><strong>{item.name}</strong> — {item.role}. Often pairs with <strong>{item.pairs}</strong>.</p>
    </div>
  )
}

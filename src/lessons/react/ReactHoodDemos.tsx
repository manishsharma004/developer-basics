import { memo, useEffect, useRef, useState } from 'react'
import { CodePreview } from '../components/blocks.tsx'

type Todo = { id: number; text: string; done: boolean }

const INITIAL: Todo[] = [
  { id: 1, text: 'Learn keys', done: false },
  { id: 2, text: 'Avoid index keys', done: true },
  { id: 3, text: 'Reorder safely', done: false },
]

function TodoColumn({
  title,
  useIndexKey,
  todos,
  onToggle,
  onReverse,
}: {
  title: string
  useIndexKey: boolean
  todos: Todo[]
  onToggle: (id: number) => void
  onReverse: () => void
}) {
  return (
    <div className="react-hood-col">
      <div className="panel-title">{title}</div>
      <ul className="react-vdom-list">
        {todos.map((todo, index) => (
          <li key={useIndexKey ? index : todo.id}>
            <label className="react-hood-todo">
              <input type="checkbox" checked={todo.done} onChange={() => onToggle(todo.id)} />
              <span className={todo.done ? 'store-todo-done' : ''}>{todo.text}</span>
            </label>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn--ghost" onClick={onReverse}>Reverse order</button>
    </div>
  )
}

export function ReconciliationKeyDemo() {
  const [todos, setTodos] = useState(INITIAL)

  const toggle = (id: number) =>
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const reverse = () => setTodos((list) => [...list].reverse())

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">Keys & reconciliation — index vs stable id</div>
      <p className="panel-hint">
        Check boxes, then reverse. With <code>key=&#123;index&#125;</code>, React reuses the wrong DOM nodes —
        checkbox state jumps to the wrong row.
      </p>
      <div className="react-hood-split">
        <TodoColumn
          title="❌ key={index}"
          useIndexKey
          todos={todos}
          onToggle={toggle}
          onReverse={reverse}
        />
        <TodoColumn
          title="✓ key={todo.id}"
          useIndexKey={false}
          todos={todos}
          onToggle={toggle}
          onReverse={reverse}
        />
      </div>
    </div>
  )
}

const RECON_STEPS = [
  { phase: 'Render', detail: 'setState schedules a render — React calls your component, builds a new element tree (virtual DOM).' },
  { phase: 'Diff', detail: 'Reconciler compares new tree to previous — same component type? same key? props changed?' },
  { phase: 'Commit', detail: 'Only changed nodes are patched in the real DOM — text updates, inserts, moves, unmounts.' },
  { phase: 'Paint', detail: 'Browser paints pixels. useEffect runs after commit (not shown in the diff itself).' },
]

export function ReconciliationPipelineDemo() {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!running) return
    if (step >= RECON_STEPS.length - 1) {
      setRunning(false)
      return
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 900)
    return () => window.clearTimeout(t)
  }, [running, step])

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">Render → reconcile → commit</div>
      <button type="button" className="btn" onClick={() => { setCount((c) => c + 1); setStep(0); setRunning(true) }}>
        setCount({count + 1}) — trace the pipeline
      </button>
      <p className="panel-hint">Current count in UI: <strong>{count}</strong></p>
      <div className="store-redux-flow">
        {RECON_STEPS.map((s, i) => (
          <div key={s.phase} className={`store-redux-step${i <= step ? ' store-redux-step--on' : ''}`}>
            <span className="store-redux-label">{s.phase}</span>
            <span>{s.detail}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

let memoChildRendersUnmemo = 0

function MemoChildUnmemo({ label, parentCount }: { label: string; parentCount: number }) {
  memoChildRendersUnmemo += 1
  return (
    <div className="store-panel">
      <span className="store-render-badge">child renders: {memoChildRendersUnmemo}</span>
      <span>label=&quot;{label}&quot; · parent count={parentCount}</span>
    </div>
  )
}

const MemoChildMemoized = memo(function MemoChildMemoized({ label }: { label: string }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="store-panel">
      <span className="store-render-badge">child renders: {renders.current}</span>
      <span>label=&quot;{label}&quot;</span>
    </div>
  )
})

export function MemoSkipDemo() {
  const [count, setCount] = useState(0)
  const [label, setLabel] = useState('static')
  const [memoOn, setMemoOn] = useState(true)

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">React.memo — skip re-render when props unchanged</div>
      <label className="lock-toggle">
        <input type="checkbox" checked={memoOn} onChange={(e) => setMemoOn(e.target.checked)} />
        Wrap child in React.memo
      </label>
      <div className="proc-actions">
        <button type="button" className="btn" onClick={() => setCount((c) => c + 1)}>Parent count++ ({count})</button>
        <label className="conv-field">
          <span>child label prop</span>
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
      </div>
      {memoOn ? <MemoChildMemoized label={label} /> : <MemoChildUnmemo label={label} parentCount={count} />}
      <p className="panel-hint">
        With memo on, incrementing parent count alone should <em>not</em> bump the child render badge if{' '}
        <code>label</code> did not change.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Hooks demos                                                        */
/* ------------------------------------------------------------------ */

const HOOK_SCENARIOS = [
  {
    id: 'valid',
    label: 'Valid top-level',
    ok: true,
    explain: 'Same hooks in the same order every render — React maps slot 0 → useState, slot 1 → useEffect.',
    code: `function App() {
  const [count, setCount] = useState(0)
  useEffect(() => { document.title = String(count) }, [count])
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}`,
  },
  {
    id: 'conditional',
    label: 'Inside if',
    ok: false,
    explain: 'When show flips, hook count/order changes — state from slot 0 may attach to the wrong hook.',
    code: `function App({ show }) {
  if (show) {
    const [a, setA] = useState(0) // ❌ conditional
  }
  const [b, setB] = useState(0)   // slot index shifts!
}`,
  },
  {
    id: 'loop',
    label: 'Inside loop',
    ok: false,
    explain: 'Loop length can change between renders — hook order is not stable.',
    code: `function App({ n }) {
  for (let i = 0; i < n; i++) {
    useState(0) // ❌ hook in loop
  }
}`,
  },
  {
    id: 'early',
    label: 'After early return',
    ok: false,
    explain: 'Early return skips hooks on some renders — order breaks.',
    code: `function App({ loading }) {
  if (loading) return <Spinner />
  const [data, setData] = useState(null) // ❌ not always called
}`,
  },
  {
    id: 'custom',
    label: 'Custom hook ✓',
    ok: true,
    explain: 'useWindowWidth is a custom hook — same top-level rules, reusable logic.',
    code: `function useWindowWidth() {
  const [w, setW] = useState(window.innerWidth)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

function App() {
  const width = useWindowWidth()
  return <p>Width: {width}</p>
}`,
  },
]

export function HooksRulesExpandedDemo() {
  const [scenario, setScenario] = useState(HOOK_SCENARIOS[0]!)
  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">Rules of hooks — five patterns</div>
      <div className="ref-snippets">
        {HOOK_SCENARIOS.map((s) => (
          <button key={s.id} type="button" className={`chip${scenario.id === s.id ? ' chip--active' : ''}`} onClick={() => setScenario(s)}>{s.label}</button>
        ))}
      </div>
      <CodePreview language="javascript" code={scenario.code} />
      <p className={`panel-hint${scenario.ok ? ' store-hint--ok' : ''}`}>
        {scenario.ok ? '✓' : '✗'} {scenario.explain}
      </p>
    </div>
  )
}

export function HooksSlotDemo() {
  const [conditional, setConditional] = useState(false)

  const slots: { name: string; active: boolean }[] = conditional
    ? [{ name: 'useState(A)', active: true }, { name: 'useState(B)', active: true }]
    : [{ name: 'useState(B) only', active: true }]

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">Hook slots — why order must be fixed</div>
      <label className="lock-toggle">
        <input type="checkbox" checked={conditional} onChange={(e) => setConditional(e.target.checked)} />
        Toggle conditional hook (simulate show prop)
      </label>
      <div className="react-hook-slots">
        {slots.map((s, i) => (
          <div key={i} className={`react-hook-slot${s.active ? ' react-hook-slot--on' : ''}`}>
            Slot {i}: {s.name}
          </div>
        ))}
      </div>
      <p className="panel-hint">
        React stores hook state in an array per component. When slot count changes, values slide to the wrong hook —
        classic &quot;Cannot read property of undefined&quot; or stale state bugs.
      </p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Ecosystem / stack                                                  */
/* ------------------------------------------------------------------ */

const STACK_LAYERS = [
  { id: 'browser', label: 'Browser', desc: 'User clicks, sees HTML/CSS' },
  { id: 'vite', label: 'Vite', desc: 'Dev server, HMR, bundles JSX → JS' },
  { id: 'react', label: 'React', desc: 'Components, state, reconciliation' },
  { id: 'router', label: 'React Router', desc: 'URL → page components' },
  { id: 'query', label: 'TanStack Query', desc: 'fetch, cache, stale, refetch' },
  { id: 'api', label: 'FastAPI', desc: 'JSON REST API, validation, OpenAPI' },
  { id: 'db', label: 'PostgreSQL / MongoDB', desc: 'Source of truth for durable data' },
]

const ECOSYSTEM_TOOLS = [
  { name: 'Vite', layer: 'Build', role: 'Dev server + production bundle', pairs: 'Compiles this course app' },
  { name: 'React Router', layer: 'Routing', role: 'Client-side URL → pages', pairs: 'Like FastAPI path routes' },
  { name: 'TanStack Query', layer: 'Server state', role: 'Cache & sync API data', pairs: 'GET /api/* from FastAPI' },
  { name: 'TypeScript', layer: 'Types', role: 'Props, hooks, API shapes', pairs: 'OpenAPI → typed clients' },
  { name: 'React Hook Form', layer: 'Forms', role: 'Validation & performance', pairs: 'POST body to API' },
  { name: 'Zustand / Redux', layer: 'Client state', role: 'Cart, UI flags', pairs: 'Not for server lists' },
  { name: 'FastAPI', layer: 'Backend', role: 'JSON APIs + auth', pairs: 'React fetch in browser' },
  { name: 'Vitest + RTL', layer: 'Testing', role: 'Unit & component tests', pairs: 'CI before deploy' },
]

export function StackFlowDemo() {
  const [active, setActive] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const run = () => {
    setRunning(true)
    setActive([])
    STACK_LAYERS.forEach((layer, i) => {
      window.setTimeout(() => {
        setActive((prev) => [...prev, layer.id])
        if (i === STACK_LAYERS.length - 1) setRunning(false)
      }, i * 450)
    })
  }

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">Full-stack request flow</div>
      <button type="button" className="btn" disabled={running} onClick={run}>
        {running ? 'Tracing…' : '▶ User loads /products page'}
      </button>
      <div className="react-stack-flow">
        {STACK_LAYERS.map((layer) => (
          <div key={layer.id} className={`react-stack-layer${active.includes(layer.id) ? ' react-stack-layer--on' : ''}`}>
            <span className="react-stack-name">{layer.label}</span>
            <span className="react-stack-desc">{layer.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function EcosystemExpandedDemo() {
  const [selected, setSelected] = useState(0)
  const item = ECOSYSTEM_TOOLS[selected]!

  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">React ecosystem map</div>
      <div className="ref-snippets">
        {ECOSYSTEM_TOOLS.map((e, i) => (
          <button key={e.name} type="button" className={`chip${selected === i ? ' chip--active' : ''}`} onClick={() => setSelected(i)}>{e.name}</button>
        ))}
      </div>
      <div className="react-eco-card">
        <div><strong>{item.name}</strong> · {item.layer}</div>
        <p>{item.role}</p>
        <p className="panel-hint">Pairs with: {item.pairs}</p>
      </div>
      <CodePreview
        language="javascript"
        code={`// Typical modern React app (simplified)
// vite.config.ts — dev + build
// src/main.tsx — createRoot, Router, QueryClientProvider
// src/routes/Products.tsx — useQuery({ queryKey: ['products'], queryFn: () => fetch('/api/products') })
// backend/main.py — @app.get("/api/products")`}
      />
    </div>
  )
}

export function StackCompareDemo() {
  const [view, setView] = useState<'spa' | 'ssr'>('spa')
  return (
    <div className="panel react-lab react-hood">
      <div className="panel-title">SPA vs SSR (where React runs)</div>
      <div className="proc-actions">
        <button type="button" className={`btn${view === 'spa' ? '' : ' btn--ghost'}`} onClick={() => setView('spa')}>SPA (Vite + client router)</button>
        <button type="button" className={`btn${view === 'ssr' ? '' : ' btn--ghost'}`} onClick={() => setView('ssr')}>SSR (Next.js / Remix)</button>
      </div>
      <pre className="flow-diagram">{view === 'spa'
        ? `Browser downloads bundle.js
  → React mounts into #root
  → Router reads URL client-side
  → TanStack Query fetches /api/* after paint`
        : `Server runs React → HTML string
  → Browser shows HTML fast (SEO)
  → JS hydrates — React attaches events
  → Still uses Router + Query on client`}
      </pre>
    </div>
  )
}

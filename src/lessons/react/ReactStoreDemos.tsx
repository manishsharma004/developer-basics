import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { CodePreview } from '../components/blocks.tsx'

function useRenderCount() {
  const count = useRef(0)
  count.current += 1
  return count.current
}

function RenderBadge({ label }: { label?: string }) {
  const n = useRenderCount()
  return <span className="store-render-badge">{label ? `${label} · ` : ''}renders: {n}</span>
}

/* ------------------------------------------------------------------ */
/* Prop drilling visualization                                        */
/* ------------------------------------------------------------------ */

function DrillLeaf({ user }: { user: string }) {
  return (
    <div className="store-tree-node store-tree-node--leaf">
      <RenderBadge label="leaf" />
      <span>Deep child reads: <b>{user}</b></span>
    </div>
  )
}

function DrillMiddle({ user }: { user: string }) {
  return (
    <div className="store-tree-node store-tree-node--pass">
      <RenderBadge label="middle" />
      <span className="store-tree-pass">passes user ↓ (does not use it)</span>
      <DrillLeaf user={user} />
    </div>
  )
}

function DrillRoot({ user }: { user: string }) {
  return (
    <div className="store-tree-node store-tree-node--root">
      <RenderBadge label="root" />
      <span>App owns state</span>
      <DrillMiddle user={user} />
    </div>
  )
}

const DrillUserContext = createContext<string>('Ada')

function ContextLeaf() {
  const user = useContext(DrillUserContext)
  return (
    <div className="store-tree-node store-tree-node--leaf">
      <RenderBadge label="leaf" />
      <span>Deep child reads: <b>{user}</b></span>
    </div>
  )
}

function ContextMiddle() {
  return (
    <div className="store-tree-node store-tree-node--skip">
      <RenderBadge label="middle" />
      <span className="store-tree-pass">no user prop — Context skips this layer</span>
      <ContextLeaf />
    </div>
  )
}

export function PropDrillingViz() {
  const [mode, setMode] = useState<'drill' | 'context'>('drill')
  const [user, setUser] = useState('Ada')

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Prop drilling vs Context</div>
      <div className="proc-actions">
        <button type="button" className={`btn${mode === 'drill' ? '' : ' btn--ghost'}`} onClick={() => setMode('drill')}>
          Prop drilling
        </button>
        <button type="button" className={`btn${mode === 'context' ? '' : ' btn--ghost'}`} onClick={() => setMode('context')}>
          Context
        </button>
      </div>
      <label className="conv-field">
        <span>user name</span>
        <input value={user} onChange={(e) => setUser(e.target.value)} />
      </label>
      {mode === 'drill' ? (
        <>
          <DrillRoot user={user} />
          <p className="panel-hint">Middle re-renders even though it only passes <code>user</code> down — wasted work in deep trees.</p>
        </>
      ) : (
        <>
          <DrillUserContext.Provider value={user}>
            <div className="store-tree-node store-tree-node--root">
              <RenderBadge label="provider" />
              <span>Provider at top</span>
              <ContextMiddle />
            </div>
          </DrillUserContext.Provider>
          <p className="panel-hint">Middle still re-renders when Provider value changes, but no props are threaded through it.</p>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Theme Context                                                      */
/* ------------------------------------------------------------------ */

type Theme = 'light' | 'dark'
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null)

function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme outside provider')
  return ctx
}

function ThemedPanel({ title, children }: { title: string; children: ReactNode }) {
  const { theme } = useTheme()
  return (
    <div className={`store-themed-panel store-themed-panel--${theme}`}>
      <RenderBadge label={title} />
      <span className="store-label">{title}</span>
      {children}
    </div>
  )
}

export function ThemeContextDemo() {
  const [theme, setTheme] = useState<Theme>('dark')
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Theme Context — one Provider, many consumers</div>
      <ThemeContext.Provider value={value}>
        <div className="store-grid">
          <ThemedPanel title="Header">
            <button type="button" className="btn btn--ghost" onClick={toggle}>
              Toggle theme (now {theme})
            </button>
          </ThemedPanel>
          <ThemedPanel title="Sidebar">
            <p>Navigation uses <code>{theme}</code> palette tokens.</p>
          </ThemedPanel>
          <ThemedPanel title="Content">
            <p>Cards and text inherit the same theme without props.</p>
          </ThemedPanel>
        </div>
      </ThemeContext.Provider>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* useReducer + split Context (state / dispatch)                      */
/* ------------------------------------------------------------------ */

type Todo = { id: number; text: string; done: boolean }
type TodoAction =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }

function todosReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle':
      return state.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t))
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    default:
      return state
  }
}

const TodosStateContext = createContext<Todo[]>([])
const TodosDispatchContext = createContext<React.Dispatch<TodoAction> | null>(null)

function useTodosState() {
  return useContext(TodosStateContext)
}

function useTodosDispatch() {
  const d = useContext(TodosDispatchContext)
  if (!d) throw new Error('outside dispatch provider')
  return d
}

function TodoListView() {
  const todos = useTodosState()
  const dispatch = useTodosDispatch()
  return (
    <div className="store-panel">
      <RenderBadge label="list" />
      <span className="store-label">TodoList (reads state + dispatch)</span>
      <ul className="store-cart-list">
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: 'toggle', id: t.id })} />
              <span className={t.done ? 'store-todo-done' : ''}>{t.text}</span>
            </label>
            <button type="button" className="icon-btn" onClick={() => dispatch({ type: 'remove', id: t.id })} aria-label="remove">×</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TodoCountBadge() {
  const todos = useTodosState()
  const open = todos.filter((t) => !t.done).length
  return (
    <div className="store-panel">
      <RenderBadge label="badge" />
      <span className="store-label">Badge (reads state only)</span>
      <span><b>{open}</b> open todo{open !== 1 ? 's' : ''}</span>
    </div>
  )
}

function TodoAddForm() {
  const dispatch = useTodosDispatch()
  const [text, setText] = useState('')
  return (
    <div className="store-panel store-panel--editor">
      <RenderBadge label="form" />
      <span className="store-label">Add form (dispatch only)</span>
      <div className="class-create">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              dispatch({ type: 'add', text: text.trim() })
              setText('')
            }
          }}
        />
        <button type="button" className="btn" onClick={() => { if (text.trim()) { dispatch({ type: 'add', text: text.trim() }); setText('') } }}>
          Add
        </button>
      </div>
      <p className="panel-hint">Split contexts: components that only call dispatch do not re-render when todo list data changes (in real apps with stable dispatch ref).</p>
    </div>
  )
}

export function ContextReducerDemo() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 1, text: 'Learn useReducer', done: false },
    { id: 2, text: 'Split state and dispatch contexts', done: false },
  ])

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Context + useReducer pattern</div>
      <TodosStateContext.Provider value={todos}>
        <TodosDispatchContext.Provider value={dispatch}>
          <div className="store-grid">
            <TodoCountBadge />
            <TodoAddForm />
            <TodoListView />
          </div>
        </TodosDispatchContext.Provider>
      </TodosStateContext.Provider>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Context re-render problem + single vs split                        */
/* ------------------------------------------------------------------ */

type CounterCtx = { count: number; setCount: (n: number) => void; label: string; setLabel: (s: string) => void }

const MonoContext = createContext<CounterCtx | null>(null)

function MonoConsumerA() {
  const ctx = useContext(MonoContext)!
  return (
    <div className="store-panel">
      <RenderBadge label="A-reads-count" />
      <span>Count: <b>{ctx.count}</b></span>
    </div>
  )
}

function MonoConsumerB() {
  const ctx = useContext(MonoContext)!
  return (
    <div className="store-panel store-panel--editor">
      <RenderBadge label="B-reads-label" />
      <label className="conv-field">
        <span>label (unrelated to count)</span>
        <input value={ctx.label} onChange={(e) => ctx.setLabel(e.target.value)} />
      </label>
    </div>
  )
}

export function ContextRerenderDemo() {
  const [count, setCount] = useState(0)
  const [label, setLabel] = useState('draft')
  const value = useMemo(() => ({ count, setCount, label, setLabel }), [count, label])

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Context re-render trap</div>
      <p className="panel-hint">One Context value object holds both count and label. Incrementing count re-renders <em>every</em> consumer — even B, which only displays label.</p>
      <MonoContext.Provider value={value}>
        <div className="store-grid">
          <div className="store-panel store-panel--editor">
            <RenderBadge label="controls" />
            <button type="button" className="btn" onClick={() => setCount((c) => c + 1)}>count++ ({count})</button>
          </div>
          <MonoConsumerA />
          <MonoConsumerB />
        </div>
      </MonoContext.Provider>
      <CalloutFix />
    </div>
  )
}

function CalloutFix() {
  return (
    <p className="panel-hint store-fix-hint">
      <strong>Fixes:</strong> split into separate contexts, memoize consumers with <code>React.memo</code>, select slices with a store library, or keep fast-updating state local.
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* State placement chooser                                            */
/* ------------------------------------------------------------------ */

type Choice = 'local' | 'lift' | 'context' | 'store' | 'query'

const CHOOSER: { id: Choice; prompt: string; answer: Choice; why: string }[] = [
  {
    id: 'local',
    prompt: 'A modal open/closed flag used only inside one component',
    answer: 'local',
    why: 'No other component needs it — useState in the owner is simplest.',
  },
  {
    id: 'lift',
    prompt: 'Two sibling buttons share a selected tab index',
    answer: 'lift',
    why: 'Lift to the parent that renders both siblings — no Context needed yet.',
  },
  {
    id: 'context',
    prompt: 'Logged-in user + theme needed in header, sidebar, and settings deep in the tree',
    answer: 'context',
    why: 'Slow-changing global-ish data — Provider once, useContext below.',
  },
  {
    id: 'store',
    prompt: 'Shopping cart updated from product grid, mini badge, and checkout panel',
    answer: 'store',
    why: 'Frequent updates across distant branches — external store with selective subscriptions.',
  },
  {
    id: 'query',
    prompt: 'Product catalog fetched from GET /api/products with cache and refetch',
    answer: 'query',
    why: 'Server state belongs in TanStack Query (or similar), not Redux/Zustand.',
  },
]

export function StateChooserSim() {
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<Choice | null>(null)
  const scenario = CHOOSER[idx]!
  const correct = picked === scenario.answer

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Where should this state live?</div>
      <p className="store-scenario">{scenario.prompt}</p>
      <div className="store-chooser-grid">
        {(['local', 'lift', 'context', 'store', 'query'] as Choice[]).map((c) => (
          <button
            key={c}
            type="button"
            className={`btn${picked === c ? (correct ? '' : ' store-btn-wrong') : ' btn--ghost'}`}
            onClick={() => setPicked(c)}
          >
            {c === 'query' ? 'TanStack Query' : c}
          </button>
        ))}
      </div>
      {picked && (
        <p className={`panel-hint${correct ? ' store-hint--ok' : ''}`}>
          {correct ? '✓ ' : '✗ '}{scenario.why}
        </p>
      )}
      <button type="button" className="btn btn--ghost" onClick={() => { setIdx((i) => (i + 1) % CHOOSER.length); setPicked(null) }}>
        Next scenario
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Redux unidirectional flow                                          */
/* ------------------------------------------------------------------ */

const REDUX_STEPS = [
  { step: 'UI', text: 'User clicks "Add Keyboard"' },
  { step: 'Action', text: 'dispatch({ type: "cart/add", payload: { name: "Keyboard" } })' },
  { step: 'Reducer', text: 'reducer returns new immutable state: { items: [...prev, item] }' },
  { step: 'Store', text: 'Store saves next state and notifies subscribers' },
  { step: 'View', text: 'CartBadge and CartPanel re-render with new item count' },
]

export function ReduxFlowDemo() {
  const [active, setActive] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    if (active >= REDUX_STEPS.length - 1) {
      setRunning(false)
      return
    }
    const t = window.setTimeout(() => setActive((a) => a + 1), 900)
    return () => window.clearTimeout(t)
  }, [running, active])

  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Redux data flow (unidirectional)</div>
      <div className="store-redux-flow">
        {REDUX_STEPS.map((s, i) => (
          <div key={s.step} className={`store-redux-step${i <= active ? ' store-redux-step--on' : ''}`}>
            <span className="store-redux-label">{s.step}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
      <div className="proc-actions">
        <button type="button" className="btn" onClick={() => { setActive(0); setRunning(true) }} disabled={running}>
          {running ? 'Playing…' : '▶ Animate flow'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => { setRunning(false); setActive((a) => Math.min(a + 1, REDUX_STEPS.length - 1)) }}>
          Step
        </button>
      </div>
      <CodePreview
        language="javascript"
        code={`// Redux Toolkit slice (conceptual)
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, action) {
      state.items.push(action.payload) // Immer makes this safe
    },
  },
})
dispatch(cartSlice.actions.addItem({ name: 'Keyboard' }))`}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Zustand selector pattern (minimal external store)                  */
/* ------------------------------------------------------------------ */

type CartState = { items: { id: number; name: string }[]; add: (name: string) => void }

let zustandCart: CartState = {
  items: [{ id: 1, name: 'Mouse' }],
  add: (name) => {
    zustandCart = {
      ...zustandCart,
      items: [...zustandCart.items, { id: Date.now(), name }],
    }
    zustandListeners.forEach((l) => l())
  },
}
const zustandListeners = new Set<() => void>()

function useZustandSelector<T>(selector: (s: CartState) => T): T {
  const [, bump] = useState(0)
  useEffect(() => {
    const l = () => bump((n) => n + 1)
    zustandListeners.add(l)
    return () => { zustandListeners.delete(l) }
  }, [])
  return selector(zustandCart)
}

function ZustandCountOnly() {
  const count = useZustandSelector((s) => s.items.length)
  return (
    <div className="store-panel">
      <RenderBadge label="selector-count" />
      <span>Item count: <b>{count}</b> (selector: length only)</span>
    </div>
  )
}

function ZustandAddOnly() {
  const add = useZustandSelector((s) => s.add)
  return (
    <div className="store-panel store-panel--editor">
      <RenderBadge label="selector-add" />
      <button type="button" className="btn" onClick={() => add(`Item ${Date.now() % 100}`)}>Add via store</button>
    </div>
  )
}

function ZustandItemList() {
  const items = useZustandSelector((s) => s.items)
  return (
    <div className="store-panel">
      <RenderBadge label="selector-list" />
      <ul className="store-cart-list">
        {items.map((i) => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
    </div>
  )
}

export function ZustandSelectorDemo() {
  return (
    <div className="panel react-lab store-viz">
      <div className="panel-title">Zustand-style selectors</div>
      <p className="panel-hint">Real Zustand re-renders only when the selected slice changes. This demo shows the pattern — add items and watch render badges.</p>
      <div className="store-grid">
        <ZustandCountOnly />
        <ZustandAddOnly />
        <ZustandItemList />
      </div>
    </div>
  )
}

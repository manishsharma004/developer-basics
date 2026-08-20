import { useEffect, useMemo, useRef, useState } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { RUNNER_PROGRAM } from '../../lib/pyRunner.ts'
import { PATTERNS, type PatternCategory } from './patterns.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const CATEGORIES: (PatternCategory | 'All')[] = ['All', 'Creational', 'Structural', 'Behavioral', 'Industry']

export function PatternsCatalog() {
  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [category, setCategory] = useState<PatternCategory | 'All'>('All')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [outputs, setOutputs] = useState<Record<string, string>>({})
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(RUNNER_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_snippet') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PATTERNS.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (q === '' || p.name.toLowerCase().includes(q) || p.intent.toLowerCase().includes(q)),
    )
  }, [category, query])

  const run = (name: string, code: string) => {
    if (!runRef.current) return
    setOutputs((o) => ({ ...o, [name]: (runRef.current!(code) as string) || '(no output)' }))
  }

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} />
      <div className="panel">
        <div className="patterns-controls">
          <div className="algo-picker">
            {CATEGORIES.map((c) => (
              <button key={c} className={`algo-btn${category === c ? ' algo-btn--active' : ''}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <input
            className="conv-text patterns-search"
            placeholder="Search patterns…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="search patterns"
          />
        </div>
        <p className="panel-hint">{filtered.length} pattern{filtered.length === 1 ? '' : 's'}</p>

        <div className="pattern-list">
          {filtered.map((p) => {
            const isOpen = open === p.name
            return (
              <div key={p.name} className={`pattern-card${isOpen ? ' pattern-card--open' : ''}`}>
                <button className="pattern-head" onClick={() => setOpen(isOpen ? null : p.name)} aria-expanded={isOpen}>
                  <span className="pattern-caret">{isOpen ? '▾' : '▸'}</span>
                  <span className="pattern-name">{p.name}</span>
                  <span className={`pattern-cat pattern-cat--${p.category.toLowerCase()}`}>{p.category}</span>
                </button>
                {isOpen && (
                  <div className="pattern-body">
                    <p className="prose"><b>Intent.</b> {p.intent}</p>
                    <p className="prose"><b>When to use.</b> {p.whenToUse}</p>
                    <p className="prose"><b>In the wild.</b> {p.realWorld}</p>
                    <pre className="term-output pattern-code">{p.example}</pre>
                    <div className="ref-run-row">
                      <button className="btn" disabled={!ready} onClick={() => run(p.name, p.example)}>
                        {ready ? '▶ Run example' : 'starting Python…'}
                      </button>
                    </div>
                    {outputs[p.name] && <pre className="term-output">{outputs[p.name]}</pre>}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

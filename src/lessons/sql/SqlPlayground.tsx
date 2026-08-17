import { useEffect, useRef, useState } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { SQL_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

interface SqlResult {
  columns?: string[]
  rows?: (string | number)[][]
  error?: string
}

const SAMPLES = [
  'SELECT * FROM customers;',
  'SELECT product, amount FROM orders WHERE amount > 100 ORDER BY amount DESC;',
  `SELECT c.name, o.product, o.amount
FROM orders o
JOIN customers c ON c.id = o.customer_id;`,
  `SELECT c.city, COUNT(*) AS orders, SUM(o.amount) AS total
FROM orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.city
ORDER BY total DESC;`,
]

export function SqlPlayground() {
  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState(SAMPLES[0])
  const [result, setResult] = useState<SqlResult | null>(null)
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(SQL_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_sql') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const run = () => {
    if (!runRef.current) return
    setResult(JSON.parse(runRef.current(query) as string) as SqlResult)
  }

  useEffect(() => {
    if (ready) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} />
      <div className="panel">
        <div className="panel-title">Query</div>
        <textarea className="code-editor" rows={Math.max(3, query.split('\n').length)} value={query} spellCheck={false} onChange={(e) => setQuery(e.target.value)} aria-label="SQL query" />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>{ready ? '▶ Run query' : 'starting database…'}</button>
        </div>
        <div className="quick-commands">
          {SAMPLES.map((s, i) => (
            <button key={i} className="chip" disabled={!ready} onClick={() => setQuery(s)}>
              {s.split('\n')[0].slice(0, 32)}{s.length > 32 ? '…' : ''}
            </button>
          ))}
        </div>

        {result?.error && <div className="overflow-warn">{result.error}</div>}
        {result?.columns && (
          <div className="sql-result">
            <table className="metrics-table">
              <thead>
                <tr>{result.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {result.rows?.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{String(cell)}</td>)}</tr>
                ))}
              </tbody>
            </table>
            <p className="panel-hint">{result.rows?.length ?? 0} row(s)</p>
          </div>
        )}
      </div>
    </>
  )
}

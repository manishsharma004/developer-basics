import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { SQL_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

interface SqlResult {
  columns?: string[]
  rows?: (string | number)[][]
  error?: string
}

const SAMPLES: { label: string; query: string }[] = [
  {
    label: 'All customers',
    query: 'SELECT * FROM customers;',
  },
  {
    label: 'Filter & sort',
    query: `SELECT name, city, email
FROM customers
WHERE city = 'New York'
ORDER BY name;`,
  },
  {
    label: 'Inner join',
    query: `SELECT c.name, p.name AS product, o.amount, o.status
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN products p ON p.id = o.product_id
ORDER BY o.amount DESC;`,
  },
  {
    label: 'Left join (all customers)',
    query: `SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY order_count DESC;`,
  },
  {
    label: 'Aggregate + HAVING',
    query: `SELECT c.city, COUNT(*) AS orders, ROUND(SUM(o.amount), 2) AS revenue
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'shipped'
GROUP BY c.city
HAVING revenue > 100
ORDER BY revenue DESC;`,
  },
  {
    label: 'Subquery',
    query: `SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products)
ORDER BY price DESC;`,
  },
  {
    label: 'Insert row',
    query: `INSERT INTO orders (customer_id, product_id, quantity, amount, status)
VALUES (3, 5, 1, 60.0, 'pending');

SELECT * FROM orders WHERE customer_id = 3;`,
  },
  {
    label: 'Update & delete',
    query: `UPDATE orders SET status = 'shipped' WHERE status = 'pending' AND amount < 100;
DELETE FROM orders WHERE status = 'cancelled';
SELECT status, COUNT(*) FROM orders GROUP BY status;`,
  },
]

export interface SqlPlaygroundProps {
  /** Show only samples whose labels are in this list */
  sampleLabels?: string[]
  defaultLabel?: string
  title?: string
}

export function SqlPlayground({ sampleLabels, defaultLabel, title = 'Query' }: SqlPlaygroundProps = {}) {
  const samples = sampleLabels?.length
    ? SAMPLES.filter((s) => sampleLabels.includes(s.label))
    : SAMPLES
  const initial = samples.find((s) => s.label === defaultLabel) ?? samples[0]!

  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState(initial.query)
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
        <div className="panel-title">{title}</div>
        <MonacoEditor value={query} onChange={setQuery} language="sql" minLines={4} ariaLabel="SQL query" />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>
            {ready ? '▶ Run query' : 'starting database…'}
          </button>
        </div>
        <div className="quick-commands">
          {samples.map((s) => (
            <button key={s.label} className="chip" disabled={!ready} onClick={() => setQuery(s.query)}>
              {s.label}
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

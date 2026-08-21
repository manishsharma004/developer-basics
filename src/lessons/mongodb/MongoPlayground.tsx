import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { MONGO_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

interface MongoResult {
  kind?: string
  count?: number
  documents?: Record<string, unknown>[]
  insertedId?: number
  modifiedCount?: number
  deletedCount?: number
  error?: string
}

const SAMPLES: { label: string; query: string }[] = [
  {
    label: 'Find all orders',
    query: 'db.orders.find({})',
  },
  {
    label: 'Filter by city',
    query: 'db.orders.find({ "city": "London" })',
  },
  {
    label: 'Comparison operators',
    query: 'db.orders.find({ "amount": { "$gt": 100 } })',
  },
  {
    label: 'Array membership',
    query: 'db.customers.find({ "tags": { "$in": ["vip"] } })',
  },
  {
    label: 'Aggregate revenue',
    query: `db.orders.aggregate([
  { "$match": { "status": "shipped" } },
  { "$group": { "_id": "$city", "orders": { "$sum": 1 }, "revenue": { "$sum": "$amount" } } },
  { "$sort": { "revenue": -1 } }
])`,
  },
  {
    label: 'Average price by category',
    query: `db.products.aggregate([
  { "$group": { "_id": "$category", "avgPrice": { "$avg": "$price" }, "items": { "$sum": 1 } } },
  { "$sort": { "avgPrice": -1 } }
])`,
  },
  {
    label: 'Insert document',
    query: 'db.orders.insertOne({ "customer_id": 3, "product": "Webcam", "amount": 45.0, "status": "pending", "city": "Helsinki" })',
  },
  {
    label: 'Update many',
    query: 'db.orders.updateMany({ "status": "pending", "amount": { "$lt": 100 } }, { "$set": { "status": "shipped" } })',
  },
  {
    label: 'Delete cancelled',
    query: 'db.orders.deleteMany({ "status": "cancelled" })',
  },
]

export function MongoPlayground() {
  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [query, setQuery] = useState(SAMPLES[0].query)
  const [result, setResult] = useState<MongoResult | null>(null)
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(MONGO_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_mongo') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const run = () => {
    if (!runRef.current) return
    setResult(JSON.parse(runRef.current(query) as string) as MongoResult)
  }

  useEffect(() => {
    if (ready) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} />
      <div className="panel">
        <div className="panel-title">MongoDB shell command</div>
        <MonacoEditor value={query} onChange={setQuery} language="javascript" minLines={4} ariaLabel="MongoDB query" />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>
            {ready ? '▶ Run command' : 'starting database…'}
          </button>
        </div>
        <div className="quick-commands">
          {SAMPLES.map((s) => (
            <button key={s.label} className="chip" disabled={!ready} onClick={() => setQuery(s.query)}>
              {s.label}
            </button>
          ))}
        </div>

        {result?.error && <div className="overflow-warn">{result.error}</div>}

        {result && !result.error && (
          <div className="mongo-result">
            {result.kind === 'insert' && (
              <p className="panel-hint">Inserted document with _id {result.insertedId}</p>
            )}
            {result.kind === 'update' && (
              <p className="panel-hint">Modified {result.modifiedCount} document(s)</p>
            )}
            {result.kind === 'delete' && (
              <p className="panel-hint">Deleted {result.deletedCount} document(s)</p>
            )}
            {(result.kind === 'find' || result.kind === 'aggregate') && (
              <p className="panel-hint">{result.count} document(s)</p>
            )}
            {result.documents && result.documents.length > 0 && (
              <pre className="term-output">{JSON.stringify(result.documents, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </>
  )
}

import { useMemo, useState } from 'react'

const ROWS = 100_000

export function IndexScanSim() {
  const [hasIndex, setHasIndex] = useState(false)
  const [filter, setFilter] = useState('customer_id = 42')

  const { steps, ms } = useMemo(() => {
    const selective = filter.includes('customer_id')
    if (hasIndex && selective) return { steps: Math.ceil(Math.log2(ROWS)), ms: 2 }
    return { steps: ROWS, ms: 120 }
  }, [hasIndex, filter])

  return (
    <div className="panel">
      <div className="panel-title">Index vs full table scan</div>
      <p className="panel-hint">Table: orders ({ROWS.toLocaleString()} rows)</p>
      <label className="modal-check">
        <input type="checkbox" checked={hasIndex} onChange={(e) => setHasIndex(e.target.checked)} />
        Index on customer_id (B-tree)
      </label>
      <label className="modal-field">
        <span>WHERE clause</span>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </label>
      <div className="metrics-table-wrap">
        <table className="metrics-table">
          <tbody>
            <tr><th>Strategy</th><td>{hasIndex && filter.includes('customer_id') ? 'Index seek' : 'Sequential scan'}</td></tr>
            <tr><th>Rows examined (sim)</th><td>{steps.toLocaleString()}</td></tr>
            <tr><th>Est. time</th><td>{ms} ms</td></tr>
          </tbody>
        </table>
      </div>
      <p className="panel-hint">
        Indexes help selective lookups; low-selectivity filters or leading-wildcard LIKE may still scan.
        Writes pay a cost to maintain the index.
      </p>
    </div>
  )
}

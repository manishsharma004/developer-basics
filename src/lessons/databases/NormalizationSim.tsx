import { useState } from 'react'
import { Callout } from '../components/blocks.tsx'

export function NormalizationSim() {
  const [normalized, setNormalized] = useState(true)
  const [customerName, setCustomerName] = useState('Ada')

  return (
    <div className="panel db-lab norm-lab">
      <div className="panel-title">Normalization vs duplication</div>
      <label className="conv-field">
        <span>Schema</span>
        <select value={normalized ? 'norm' : 'denorm'} onChange={(e) => setNormalized(e.target.value === 'norm')}>
          <option value="norm">Normalized (customers + orders)</option>
          <option value="denorm">Denormalized (name on every order row)</option>
        </select>
      </label>
      <label className="conv-field">
        <span>Update customer name to</span>
        <input value={customerName} onChange={(e) => setCustomerName(e.target.value || 'Ada')} />
      </label>

      {normalized ? (
        <div className="norm-tables">
          <pre className="flow-diagram">{`customers
+----+--------+
| id | name   |
+----+--------+
| 1  | ${customerName.padEnd(6)} |
+----+--------+

orders
+----+-------------+-----------+
| id | customer_id | product   |
+----+-------------+-----------+
| 1  | 1           | Keyboard  |
| 2  | 1           | Mouse     |
+----+-------------+-----------+`}</pre>
          <p className="panel-hint">One row in <strong>customers</strong> — every order sees the update via join.</p>
        </div>
      ) : (
        <div className="norm-tables">
          <pre className="flow-diagram">{`orders (customer name duplicated)
+----+${'-'.repeat(Math.max(8, customerName.length + 2))}+-----------+
| id | customer${' '.repeat(Math.max(0, customerName.length - 6))} | product   |
+----+${'-'.repeat(Math.max(8, customerName.length + 2))}+-----------+
| 1  | ${customerName.padEnd(Math.max(8, customerName.length))} | Keyboard  |
| 2  | ${customerName.padEnd(Math.max(8, customerName.length))} | Mouse     |
+----+${'-'.repeat(Math.max(8, customerName.length + 2))}+-----------+`}</pre>
          <p className="panel-hint">
            Typing above updates both rows together in this demo — in real denormalized DBs you must update{' '}
            <em>every</em> copy or reports disagree.
          </p>
        </div>
      )}

      <Callout kind="note" title="Update anomaly">
        {normalized
          ? 'Normalized: change the name once; JOINs always agree.'
          : 'Denormalized: miss one row and copies disagree — normalization stores each fact once.'}
      </Callout>
    </div>
  )
}

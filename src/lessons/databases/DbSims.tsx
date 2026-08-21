import { useState } from 'react'
import { MermaidDiagram } from '../../components/MermaidDiagram.tsx'
import { useFlowAnimation } from '../../components/useFlowAnimation.ts'

export function RamVsDbSim() {
  const [storedInDb, setStoredInDb] = useState(false)
  const [processUp, setProcessUp] = useState(true)

  const [ramData, setRamData] = useState(true)
  const crash = () => {
    setProcessUp(false)
    if (!storedInDb) setRamData(false)
    setTimeout(() => setProcessUp(true), 500)
  }

  const showData = storedInDb ? true : ramData && processUp

  return (
    <div className="panel db-lab">
      <div className="panel-title">RAM vs database — durability</div>
      <label className="conv-field">
        <span>Persist to database</span>
        <input type="checkbox" checked={storedInDb} onChange={(e) => { setStoredInDb(e.target.checked); if (e.target.checked) setRamData(true) }} />
      </label>
      <div className="proc-actions">
        <button className="btn" type="button" onClick={crash}>Simulate process crash</button>
        <button className="btn btn--ghost" type="button" onClick={() => { setRamData(true); setProcessUp(true) }}>Save user to {storedInDb ? 'DB' : 'RAM'}</button>
      </div>
      <p className="panel-hint">
        Process: <strong>{processUp ? 'running' : 'restarting…'}</strong> · User &quot;Ada&quot;:{' '}
        <strong>{showData ? 'available ✓' : 'gone ✗'}</strong>
      </p>
    </div>
  )
}

const ARCH_DIAGRAM = `flowchart LR
  app["Your app"] --> driver["Driver / ORM"]
  driver --> engine["Database engine"]
  engine --> disk["Disk"]`

export function DbArchitectureSim() {
  const [embedded, setEmbedded] = useState(true)
  const { running, log, reset, runSteps, activeNodes } = useFlowAnimation()
  const steps = embedded
    ? [
        { nodes: ['app'], message: 'App calls sqlite3 in-process' },
        { nodes: ['driver'], message: 'Driver is a library — no TCP' },
        { nodes: ['engine'], message: 'SQLite engine inside your process' },
        { nodes: ['disk'], message: 'Writes to app.db file' },
      ]
    : [
        { nodes: ['app'], message: 'App opens TCP connection' },
        { nodes: ['driver'], message: 'psycopg2 sends wire protocol messages' },
        { nodes: ['engine'], message: 'Postgres server handles many clients' },
        { nodes: ['disk'], message: 'Server persists to its storage' },
      ]

  return (
    <div className="panel db-lab">
      <div className="panel-title">App → driver → engine → disk</div>
      <label className="conv-field">
        <span>Mode</span>
        <select value={embedded ? 'sqlite' : 'postgres'} onChange={(e) => setEmbedded(e.target.value === 'sqlite')}>
          <option value="sqlite">Embedded (SQLite)</option>
          <option value="postgres">Client-server (Postgres)</option>
        </select>
      </label>
      <MermaidDiagram code={ARCH_DIAGRAM} activeNodes={activeNodes(steps)} />
      <button className="btn" type="button" disabled={running} onClick={() => { reset(); void runSteps(steps) }}>
        {running ? 'Tracing…' : '▶ Trace a query'}
      </button>
      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}

export function DataModelSim({ title = 'Data shape explorer', hint }: { title?: string; hint?: string }) {
  const [mode, setMode] = useState<'relational' | 'document'>('relational')
  return (
    <div className="panel db-lab">
      <div className="panel-title">{title}</div>
      {hint && <p className="panel-hint">{hint}</p>}
      <div className="proc-actions">
        <button type="button" className={`btn${mode === 'relational' ? '' : ' btn--ghost'}`} onClick={() => setMode('relational')}>Relational</button>
        <button type="button" className={`btn${mode === 'document' ? '' : ' btn--ghost'}`} onClick={() => setMode('document')}>Document</button>
      </div>
      <pre className="flow-diagram">{mode === 'relational'
        ? `customers          orders
+----+-------+     +----+-------------+
| id | name  |     | id | customer_id |
+----+-------+     +----+-------------+
| 1  | Ada   |     | 1  | 1           |
+----+-------+     +----+-------------+`
        : `{ "_id": 1, "name": "Ada",
  "orders": [
    { "product": "Keyboard", "amount": 79 }
  ] }`}</pre>
    </div>
  )
}

export function AcidSim() {
  const [balanceA, setBalanceA] = useState(500)
  const [balanceB, setBalanceB] = useState(200)
  const [log, setLog] = useState<string[]>([])
  const amount = 150

  const transfer = (commit: boolean) => {
    const a = balanceA - amount
    const b = balanceB + amount
    if (!commit) {
      setLog((l) => [...l, `BEGIN transfer $${amount}`, 'Debit A…', 'ERROR: network fail', 'ROLLBACK — balances unchanged'])
      return
    }
    setBalanceA(a)
    setBalanceB(b)
    setLog((l) => [...l, `COMMIT transfer $${amount} — A=${a}, B=${b}`])
  }

  return (
    <div className="panel db-lab">
      <div className="panel-title">ACID transfer</div>
      <p className="panel-hint">Account A: ${balanceA} · Account B: ${balanceB}</p>
      <div className="proc-actions">
        <button className="btn" type="button" onClick={() => transfer(true)}>Commit transfer</button>
        <button className="btn btn--ghost" type="button" onClick={() => transfer(false)}>Fail & rollback</button>
      </div>
      {log.length > 0 && <pre className="term-output">{log.slice(-4).join('\n')}</pre>}
    </div>
  )
}

export function DbChooserSim() {
  const [joins, setJoins] = useState(false)
  const [schema, setSchema] = useState<'fixed' | 'flex'>('fixed')
  const pick =
    joins && schema === 'fixed' ? 'PostgreSQL (relational + joins)'
      : !joins && schema === 'flex' ? 'MongoDB (flexible documents)'
      : joins ? 'PostgreSQL or MongoDB with references'
      : 'SQLite for simple apps, MongoDB for flexible docs'

  return (
    <div className="panel db-lab">
      <div className="panel-title">Pick a database</div>
      <label className="conv-field"><span>Need JOINs across entities?</span><input type="checkbox" checked={joins} onChange={(e) => setJoins(e.target.checked)} /></label>
      <label className="conv-field">
        <span>Schema</span>
        <select value={schema} onChange={(e) => setSchema(e.target.value as 'fixed' | 'flex')}>
          <option value="fixed">Fixed / migrations OK</option>
          <option value="flex">Flexible / evolving fields</option>
        </select>
      </label>
      <p className="panel-hint web-lab-step">Suggestion: <strong>{pick}</strong></p>
    </div>
  )
}

export function ReplicationSim() {
  const [primary, setPrimary] = useState('orders v42')
  const [replicaLag, setReplicaLag] = useState(true)
  const [failover, setFailover] = useState(false)

  const replicaValue = replicaLag && !failover ? 'orders v41 (stale)' : primary

  return (
    <div className="panel db-lab">
      <div className="panel-title">Replication & failover</div>
      <button className="btn btn--ghost" type="button" onClick={() => setPrimary(`orders v${43 + Math.floor(Math.random() * 5)}`)}>Write on primary</button>
      <label className="conv-field"><span>Replica lagging</span><input type="checkbox" checked={replicaLag} onChange={(e) => setReplicaLag(e.target.checked)} /></label>
      <button className="btn" type="button" onClick={() => setFailover(true)}>Promote replica</button>
      <p className="panel-hint">Primary: <strong>{primary}</strong></p>
      <p className="panel-hint">Replica read: <strong>{replicaValue}</strong></p>
    </div>
  )
}

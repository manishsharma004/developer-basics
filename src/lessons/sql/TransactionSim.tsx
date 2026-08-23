import { useState } from 'react'

export function TransactionSim() {
  const [balance, setBalance] = useState(1000)
  const [sessionA, setSessionA] = useState<number | null>(null)
  const [log, setLog] = useState<string[]>([])
  const [useTx, setUseTx] = useState(true)

  const push = (msg: string) => setLog((l) => [...l, msg])

  const transfer = async () => {
    setLog([])
    const amount = 200
    if (!useTx) {
      push('Session A: read balance = ' + balance)
      const readA = balance
      push('Session B: read balance = ' + balance)
      const readB = balance
      await new Promise((r) => setTimeout(r, 300))
      setBalance(readA - amount)
      push('Session A: write balance = ' + (readA - amount))
      await new Promise((r) => setTimeout(r, 300))
      setBalance(readB - amount)
      push('Session B: write balance = ' + (readB - amount) + ' ← lost update!')
      return
    }
    push('BEGIN')
    setSessionA(balance)
    push('Session A: read balance = ' + balance)
    await new Promise((r) => setTimeout(r, 200))
    const next = balance - amount
    setBalance(next)
    setSessionA(next)
    push('Session A: write balance = ' + next)
    push('COMMIT — atomic transfer complete')
    setSessionA(null)
  }

  const rollback = () => {
    if (sessionA !== null) {
      setBalance(sessionA)
      push('ROLLBACK — restored balance to ' + sessionA)
      setSessionA(null)
    }
  }

  const reset = () => {
    setBalance(1000)
    setSessionA(null)
    setLog([])
  }

  return (
    <div className="panel">
      <div className="panel-title">Transaction simulator</div>
      <p className="panel-hint">Balance: <strong>${balance}</strong></p>
      <label className="modal-check">
        <input type="checkbox" checked={useTx} onChange={(e) => setUseTx(e.target.checked)} />
        Use transaction (BEGIN/COMMIT)
      </label>
      <div className="ref-run-row">
        <button type="button" className="btn" onClick={() => void transfer()}>Transfer $200</button>
        <button type="button" className="btn btn--ghost" onClick={rollback}>ROLLBACK</button>
        <button type="button" className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>
      <pre className="term-output">{log.join('\n') || 'Run a transfer to see isolation…'}</pre>
      <p className="panel-hint">
        Without a transaction, concurrent reads can cause lost updates. Isolation levels
        (READ COMMITTED, REPEATABLE READ) control what each session sees.
      </p>
    </div>
  )
}

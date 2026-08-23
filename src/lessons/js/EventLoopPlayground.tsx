import { useState } from 'react'

type Task = { id: number; kind: 'sync' | 'macro' | 'micro'; label: string }

export function EventLoopPlayground() {
  const [stack, setStack] = useState<string[]>([])
  const [macro, setMacro] = useState<Task[]>([])
  const [micro, setMicro] = useState<Task[]>([])
  const [log, setLog] = useState<string[]>([])
  const [nextId, setNextId] = useState(1)

  const pushLog = (msg: string) => setLog((l) => [...l, msg])

  const runSync = () => {
    pushLog('sync: runs immediately on the call stack')
    setStack(['sync fn'])
    setTimeout(() => setStack([]), 400)
  }

  const queueMacro = () => {
    const id = nextId
    setNextId((n) => n + 1)
    setMacro((q) => [...q, { id, kind: 'macro', label: `setTimeout #${id}` }])
    pushLog(`queued macro task #${id} (setTimeout)`)
  }

  const queueMicro = () => {
    const id = nextId
    setNextId((n) => n + 1)
    setMicro((q) => [...q, { id, kind: 'micro', label: `Promise #${id}` }])
    pushLog(`queued microtask #${id} (Promise.then)`)
  }

  const tick = () => {
    if (micro.length > 0) {
      const [task, ...rest] = micro
      setMicro(rest)
      setStack([task.label])
      pushLog(`ran microtask: ${task.label}`)
      setTimeout(() => setStack([]), 300)
      return
    }
    if (macro.length > 0) {
      const [task, ...rest] = macro
      setMacro(rest)
      setStack([task.label])
      pushLog(`ran macro task: ${task.label}`)
      setTimeout(() => setStack([]), 300)
      return
    }
    pushLog('queues empty — event loop idle')
  }

  const reset = () => {
    setStack([])
    setMacro([])
    setMicro([])
    setLog([])
    setNextId(1)
  }

  return (
    <div className="panel">
      <div className="panel-title">Event loop simulator</div>
      <p className="panel-hint">
        Queue tasks, then press <strong>Run one tick</strong>. Microtasks (Promise) drain before the next macro task (setTimeout).
      </p>
      <div className="demo-split">
        <div>
          <div className="metrics-table-wrap">
            <table className="metrics-table">
              <tbody>
                <tr><th>Call stack</th><td>{stack.length ? stack.join(' → ') : '(empty)'}</td></tr>
                <tr><th>Microtask queue</th><td>{micro.map((t) => t.label).join(', ') || '(empty)'}</td></tr>
                <tr><th>Macrotask queue</th><td>{macro.map((t) => t.label).join(', ') || '(empty)'}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ref-run-row">
            <button type="button" className="btn" onClick={runSync}>Run sync</button>
            <button type="button" className="btn btn--ghost" onClick={queueMicro}>Queue Promise</button>
            <button type="button" className="btn btn--ghost" onClick={queueMacro}>Queue setTimeout</button>
            <button type="button" className="btn" onClick={tick}>Run one tick</button>
            <button type="button" className="btn btn--ghost" onClick={reset}>Reset</button>
          </div>
        </div>
        <pre className="term-output event-loop-log">{log.join('\n') || 'Log will appear here…'}</pre>
      </div>
    </div>
  )
}

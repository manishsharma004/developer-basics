import { useEffect, useState } from 'react'

const TASKS = [
  { name: 'A', ms: 200 },
  { name: 'B', ms: 100 },
  { name: 'C', ms: 150 },
]

const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

export function AsyncParallelSim() {
  const [mode, setMode] = useState<'sequential' | 'concurrent'>('sequential')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [active, setActive] = useState<Set<string>>(new Set())
  const [done, setDone] = useState<Set<string>>(new Set())

  const totalMs = mode === 'sequential' ? TASKS.reduce((s, t) => s + t.ms, 0) : Math.max(...TASKS.map((t) => t.ms))

  useEffect(() => {
    if (!running) return
    setElapsed(0)
    setActive(new Set())
    setDone(new Set())

    let cancelled = false
    let pollId = 0

    const run = async () => {
      if (mode === 'sequential') {
        let t = 0
        for (const task of TASKS) {
          if (cancelled) return
          setActive(new Set([task.name]))
          await delay(task.ms)
          if (cancelled) return
          t += task.ms
          setElapsed(t)
          setDone((d) => new Set([...d, task.name]))
        }
      } else {
        setActive(new Set(TASKS.map((t) => t.name)))
        const start = performance.now()
        pollId = window.setInterval(() => {
          if (!cancelled) setElapsed(Math.min(totalMs, Math.round(performance.now() - start)))
        }, 30)
        await Promise.all(
          TASKS.map(async (task) => {
            await delay(task.ms)
            if (!cancelled) setDone((d) => new Set([...d, task.name]))
          }),
        )
        window.clearInterval(pollId)
        setElapsed(totalMs)
      }
      setActive(new Set())
      setRunning(false)
    }

    void run()

    return () => {
      cancelled = true
      if (pollId) window.clearInterval(pollId)
    }
  }, [running, mode, totalMs])

  return (
    <div className="panel async-lab">
      <div className="panel-title">Sequential vs concurrent I/O</div>
      <div className="proc-actions">
        <button type="button" className={`btn${mode === 'sequential' ? '' : ' btn--ghost'}`} onClick={() => setMode('sequential')}>
          Sequential (await one by one)
        </button>
        <button type="button" className={`btn${mode === 'concurrent' ? '' : ' btn--ghost'}`} onClick={() => setMode('concurrent')}>
          Concurrent (asyncio.gather)
        </button>
      </div>
      <div className="async-timeline">
        {TASKS.map((t) => (
          <div key={t.name} className="async-row">
            <span className="async-name">{t.name}</span>
            <div className="async-bar-wrap">
              <div
                className={`async-bar${active.has(t.name) ? ' async-bar--active' : ''}${done.has(t.name) ? ' async-bar--done' : ''}`}
                style={{ width: `${(t.ms / totalMs) * 100}%` }}
              />
            </div>
            <span className="async-ms">{t.ms}ms</span>
          </div>
        ))}
      </div>
      <button type="button" className="btn" disabled={running} onClick={() => setRunning(true)}>
        {running ? 'Running…' : '▶ Run simulation'}
      </button>
      <p className="panel-hint">
        Elapsed: <strong>{elapsed}ms</strong> · Expected total: <strong>{totalMs}ms</strong>
        {mode === 'concurrent' && ' — tasks overlap while waiting on I/O.'}
        {mode === 'sequential' && ' — each task blocks until the previous finishes.'}
      </p>
    </div>
  )
}

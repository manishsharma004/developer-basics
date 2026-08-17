import { useEffect, useMemo, useRef, useState } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { PROCESS_PROGRAM } from './program.ts'

interface Proc {
  pid: string
  arrival: number
  burst: number
}

interface Slice {
  pid: string
  start: number
  end: number
}

interface Metric {
  pid: string
  arrival: number
  burst: number
  completion: number
  turnaround: number
  waiting: number
}

interface SimResult {
  timeline: Slice[]
  metrics: Metric[]
  avg_waiting: number
  avg_turnaround: number
  makespan: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

type Algo = 'fcfs' | 'sjf' | 'rr'

const ALGOS: { id: Algo; label: string; blurb: string }[] = [
  { id: 'fcfs', label: 'FCFS', blurb: 'First come, first served — run in arrival order.' },
  { id: 'sjf', label: 'SJF', blurb: 'Shortest job first (non-preemptive).' },
  { id: 'rr', label: 'Round Robin', blurb: 'Each process gets a fixed time quantum in turn.' },
]

const PALETTE = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb7185', '#22d3ee', '#c084fc']

const DEFAULT_PROCS: Proc[] = [
  { pid: 'P1', arrival: 0, burst: 5 },
  { pid: 'P2', arrival: 1, burst: 3 },
  { pid: 'P3', arrival: 2, burst: 6 },
  { pid: 'P4', arrival: 4, burst: 2 },
]

export function SchedulerPlayground() {
  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [procs, setProcs] = useState<Proc[]>(DEFAULT_PROCS)
  const [algo, setAlgo] = useState<Algo>('rr')
  const [quantum, setQuantum] = useState(2)
  const [result, setResult] = useState<SimResult | null>(null)
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(false)

  const simRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(PROCESS_PROGRAM)
      if (cancelled) return
      simRef.current = pyodide.globals.get('simulate') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  useEffect(() => {
    if (!ready || !simRef.current) return
    const json = simRef.current(JSON.stringify(procs), algo, quantum) as string
    const r = JSON.parse(json) as SimResult
    setResult(r)
    setCursor(r.makespan)
    setPlaying(false)
  }, [ready, procs, algo, quantum])

  useEffect(() => {
    if (!playing || !result) return
    if (cursor >= result.makespan) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setCursor((c) => Math.min(result.makespan, c + 1)), 450)
    return () => clearTimeout(id)
  }, [playing, cursor, result])

  const colorFor = useMemo(() => {
    const map = new Map<string, string>()
    procs.forEach((p, i) => map.set(p.pid, PALETTE[i % PALETTE.length]))
    return (pid: string) => (pid === 'idle' ? '#334155' : map.get(pid) ?? '#64748b')
  }, [procs])

  const makespan = result?.makespan ?? 0
  const runningPid = result?.timeline.find((s) => cursor >= s.start && cursor < s.end)?.pid ?? null
  const showMask = playing || cursor < makespan

  const updateProc = (index: number, field: 'arrival' | 'burst', value: number) => {
    setProcs((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: Math.max(field === 'burst' ? 1 : 0, value) } : p)),
    )
  }

  const addProc = () => {
    setProcs((prev) => {
      const n = prev.length + 1
      return [...prev, { pid: `P${n}`, arrival: prev.length, burst: 3 }]
    })
  }

  const removeProc = (index: number) => {
    setProcs((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev))
  }

  const ticks = makespan > 0 ? Array.from({ length: makespan + 1 }, (_, i) => i) : []
  const tickStep = makespan > 24 ? Math.ceil(makespan / 24) : 1

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} />

      <div className="demo-split demo-split--wide">
        <div className="panel">
          <div className="panel-title">Processes</div>
          <table className="proc-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Arrival</th>
                <th>Burst</th>
                <th aria-label="remove" />
              </tr>
            </thead>
            <tbody>
              {procs.map((p, i) => (
                <tr key={p.pid}>
                  <td><span className="proc-chip" style={{ background: colorFor(p.pid) }}>{p.pid}</span></td>
                  <td>
                    <input type="number" min={0} value={p.arrival} onChange={(e) => updateProc(i, 'arrival', Number(e.target.value))} />
                  </td>
                  <td>
                    <input type="number" min={1} value={p.burst} onChange={(e) => updateProc(i, 'burst', Number(e.target.value))} />
                  </td>
                  <td>
                    <button className="icon-btn" onClick={() => removeProc(i)} aria-label={`remove ${p.pid}`}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="proc-actions">
            <button className="btn btn--ghost" onClick={addProc}>+ Add process</button>
            <button className="btn btn--ghost" onClick={() => setProcs(DEFAULT_PROCS)}>Reset</button>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Scheduling algorithm</div>
          <div className="algo-picker">
            {ALGOS.map((a) => (
              <button key={a.id} className={`algo-btn${algo === a.id ? ' algo-btn--active' : ''}`} onClick={() => setAlgo(a.id)}>
                {a.label}
              </button>
            ))}
          </div>
          <p className="algo-blurb">{ALGOS.find((a) => a.id === algo)?.blurb}</p>

          {algo === 'rr' && (
            <label className="quantum">
              Time quantum
              <input type="number" min={1} value={quantum} onChange={(e) => setQuantum(Math.max(1, Number(e.target.value)))} />
            </label>
          )}

          <div className="sim-averages">
            <div>
              <span className="avg-label">Avg waiting</span>
              <span className="avg-value">{result?.avg_waiting ?? '—'}</span>
            </div>
            <div>
              <span className="avg-label">Avg turnaround</span>
              <span className="avg-value">{result?.avg_turnaround ?? '—'}</span>
            </div>
            <div>
              <span className="avg-label">Makespan</span>
              <span className="avg-value">{makespan}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title-row">
          <div className="panel-title">Gantt chart</div>
          <div className="playback">
            {runningPid && showMask && (
              <span className="now-running">
                t={Math.floor(cursor)} · running <b style={{ color: colorFor(runningPid) }}>{runningPid === 'idle' ? 'idle' : runningPid}</b>
              </span>
            )}
            <button
              className="btn"
              disabled={!result || makespan === 0}
              onClick={() => {
                if (playing) setPlaying(false)
                else {
                  setCursor(0)
                  setPlaying(true)
                }
              }}
            >
              {playing ? '❚❚ Pause' : '▶ Play'}
            </button>
            <button className="btn btn--ghost" disabled={!result} onClick={() => { setPlaying(false); setCursor(makespan) }}>
              Show all
            </button>
          </div>
        </div>

        {result && makespan > 0 ? (
          <div className="gantt-wrap">
            <div className="gantt">
              {result.timeline.map((s, i) => (
                <div
                  key={i}
                  className={`gantt-slice${s.pid === 'idle' ? ' gantt-slice--idle' : ''}`}
                  style={{
                    left: `${(s.start / makespan) * 100}%`,
                    width: `${((s.end - s.start) / makespan) * 100}%`,
                    background: colorFor(s.pid),
                  }}
                  title={`${s.pid}: ${s.start} → ${s.end}`}
                >
                  <span className="gantt-label">{s.pid === 'idle' ? '' : s.pid}</span>
                </div>
              ))}
              {showMask && (
                <div className="gantt-mask" style={{ left: `${(cursor / makespan) * 100}%`, width: `${((makespan - cursor) / makespan) * 100}%` }} />
              )}
              {showMask && <div className="gantt-playhead" style={{ left: `${(cursor / makespan) * 100}%` }} />}
            </div>
            <div className="gantt-axis">
              {ticks.map((t) =>
                t % tickStep === 0 ? (
                  <span key={t} className="gantt-tick" style={{ left: `${(t / makespan) * 100}%` }}>{t}</span>
                ) : null,
              )}
            </div>
          </div>
        ) : (
          <p className="panel-hint">{ready ? 'Add a process to see the schedule.' : 'Waiting for the Python runtime…'}</p>
        )}
      </div>

      {result && result.metrics.length > 0 && (
        <div className="panel">
          <div className="panel-title">Per-process metrics</div>
          <table className="metrics-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Arrival</th>
                <th>Burst</th>
                <th>Completion</th>
                <th>Turnaround</th>
                <th>Waiting</th>
              </tr>
            </thead>
            <tbody>
              {result.metrics.map((m) => (
                <tr key={m.pid}>
                  <td><span className="proc-chip" style={{ background: colorFor(m.pid) }}>{m.pid}</span></td>
                  <td>{m.arrival}</td>
                  <td>{m.burst}</td>
                  <td>{m.completion}</td>
                  <td>{m.turnaround}</td>
                  <td>{m.waiting}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>Average</td>
                <td>{result.avg_turnaround}</td>
                <td>{result.avg_waiting}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </>
  )
}

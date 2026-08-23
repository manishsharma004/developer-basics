import { useEffect, useRef, useState } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { CONCURRENCY_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

interface RaceResult {
  expected: number
  min: number
  max: number
  correct: number
  trials: number
  sample: number
}

export function RacePlayground() {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [threads, setThreads] = useState(4)
  const [iters, setIters] = useState(20)
  const [useLock, setUseLock] = useState(false)
  const [result, setResult] = useState<RaceResult | null>(null)
  const raceRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(CONCURRENCY_PROGRAM)
      if (cancelled) return
      raceRef.current = pyodide.globals.get('race') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  useEffect(() => {
    if (!ready || !raceRef.current) return
    const json = raceRef.current(threads, iters, useLock) as string
    setResult(JSON.parse(json) as RaceResult)
  }, [ready, threads, iters, useLock])

  const pct = result ? Math.round((result.correct / result.trials) * 100) : 0

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} onSkip={skip} skipped={skipped} />
      <div className="panel">
        <div className="race-controls">
          <label className="conv-field">
            <span>Threads</span>
            <input type="number" min={1} max={8} value={threads} onChange={(e) => setThreads(Math.max(1, Number(e.target.value)))} />
          </label>
          <label className="conv-field">
            <span>Increments per thread</span>
            <input type="number" min={1} max={200} value={iters} onChange={(e) => setIters(Math.max(1, Number(e.target.value)))} />
          </label>
          <label className="lock-toggle">
            <input type="checkbox" checked={useLock} onChange={(e) => setUseLock(e.target.checked)} />
            Use a lock (make increments atomic)
          </label>
        </div>

        {result && (
          <div className="race-result">
            <div className="race-nums">
              <div className="race-stat">
                <span className="avg-label">Expected</span>
                <span className="avg-value">{result.expected}</span>
              </div>
              <div className="race-stat">
                <span className="avg-label">A single run gave</span>
                <span className={`avg-value ${result.sample === result.expected ? 'race-ok' : 'race-bad'}`}>{result.sample}</span>
              </div>
              <div className="race-stat">
                <span className="avg-label">Range over {result.trials} runs</span>
                <span className="avg-value">{result.min}–{result.max}</span>
              </div>
              <div className="race-stat">
                <span className="avg-label">Correct runs</span>
                <span className={`avg-value ${pct === 100 ? 'race-ok' : 'race-bad'}`}>{pct}%</span>
              </div>
            </div>
            <div className={`race-verdict ${pct === 100 ? 'race-verdict--ok' : 'race-verdict--bad'}`}>
              {pct === 100
                ? '✓ Every run is correct — the lock makes each increment atomic.'
                : `✗ Race condition: ${result.trials - result.correct} of ${result.trials} runs lost updates because threads interleaved on the shared counter.`}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

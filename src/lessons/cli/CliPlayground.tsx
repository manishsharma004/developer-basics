import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { CLI_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const SAMPLE = `2024-01-01 INFO start
2024-01-01 ERROR disk full
2024-01-01 INFO retry
2024-01-01 ERROR disk full
2024-01-01 WARN slow query
2024-01-01 ERROR timeout
2024-01-01 INFO ok`

const PRESETS = [
  'grep ERROR',
  'grep ERROR | sort | uniq -c',
  'grep -v INFO | wc -l',
  'sort | uniq -c | sort -rn',
]

export function CliPlayground() {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [text, setText] = useState(SAMPLE)
  const [pipeline, setPipeline] = useState('grep ERROR | sort | uniq -c')
  const [output, setOutput] = useState('')
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(CLI_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_pipeline') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const run = () => {
    if (!runRef.current) return
    setOutput((runRef.current(text, pipeline) as string) || '(no output)')
  }

  useEffect(() => {
    if (ready) run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} onSkip={skip} skipped={skipped} />
      <div className="panel">
        <div className="panel-title">Input (stdin)</div>
        <MonacoEditor value={text} onChange={setText} language="plaintext" minLines={7} ariaLabel="input text" />
        <div className="panel-title" style={{ marginTop: 14 }}>Pipeline</div>
        <div className="cli-row">
          <span className="term-prompt">$</span>
          <input className="term-input cli-input" value={pipeline} spellCheck={false} onChange={(e) => setPipeline(e.target.value)} aria-label="pipeline" />
          <button className="btn" disabled={!ready} onClick={run}>{ready ? 'Run' : '…'}</button>
        </div>
        <div className="quick-commands">
          {PRESETS.map((p) => (
            <button key={p} className="chip" disabled={!ready} onClick={() => setPipeline(p)}>{p}</button>
          ))}
        </div>
        <div className="panel-title" style={{ marginTop: 14 }}>Output (stdout)</div>
        <pre className="term-output">{output}</pre>
      </div>
    </>
  )
}

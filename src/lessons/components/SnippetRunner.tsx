import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RUNNER_PROGRAM } from '../../lib/pyRunner.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

export interface Snippet {
  label: string
  code: string
}

// A reusable "pick a snippet, edit it, run it" panel backed by real in-browser
// Python (Pyodide). Each snippet runs in a fresh namespace and its stdout / any
// traceback is captured. Chapters supply their own snippets.
export function SnippetRunner({ snippets }: { snippets: Snippet[] }) {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [code, setCode] = useState(snippets[0].code)
  const [output, setOutput] = useState('')
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(RUNNER_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_snippet') as PyCallable
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const run = () => {
    if (!runRef.current) return
    setOutput((runRef.current(code) as string) || '(no output)')
  }

  const isTraceback = output.includes('Traceback (most recent call last)')

  return (
    <>
      <RuntimeBanner
        phase={phase}
        message={message}
        error={error}
        onRetry={retry}
        onSkip={skip}
        skipped={skipped}
      />
      {!skipped && (
      <div className="panel">
        <div className="ref-snippets">
          {snippets.map((s) => (
            <button
              key={s.label}
              className="chip"
              onClick={() => {
                setCode(s.code)
                setOutput('')
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <MonacoEditor
          value={code}
          onChange={setCode}
          language="python"
          minLines={4}
          ariaLabel="Python code"
        />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>
            {ready ? '▶ Run' : 'starting Python…'}
          </button>
        </div>
        {output && <pre className={`term-output${isTraceback ? ' error-trace' : ''}`}>{output}</pre>}
      </div>
      )}
    </>
  )
}

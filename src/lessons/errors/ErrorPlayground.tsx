import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { ERRORS_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const SNIPPETS: { label: string; code: string }[] = [
  {
    label: 'Uncaught error',
    code: `def parse(x):
    return int(x)

print(parse("42"))
print(parse("oops"))   # ValueError — uncaught, so a traceback prints`,
  },
  {
    label: 'try / except',
    code: `try:
    n = int("oops")
except ValueError as e:
    print("caught:", e)
    n = 0
print("n =", n)`,
  },
  {
    label: 'finally always runs',
    code: `data = {"a": 1}
try:
    print(data["b"])       # KeyError
except KeyError:
    print("no such key")
finally:
    print("cleanup always runs")`,
  },
  {
    label: 'raising your own',
    code: `def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("insufficient funds")
    return balance - amount

print(withdraw(100, 30))
print(withdraw(100, 500))   # raises`,
  },
]

export function ErrorPlayground() {
  const { pyodide, phase, message, error } = usePyodide()
  const [ready, setReady] = useState(false)
  const [code, setCode] = useState(SNIPPETS[0].code)
  const [output, setOutput] = useState('')
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(ERRORS_PROGRAM)
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
      <RuntimeBanner phase={phase} message={message} error={error} />
      <div className="panel">
        <div className="ref-snippets">
          {SNIPPETS.map((s) => (
            <button key={s.label} className="chip" onClick={() => { setCode(s.code); setOutput('') }}>{s.label}</button>
          ))}
        </div>
        <MonacoEditor value={code} onChange={setCode} language="python" minLines={4} ariaLabel="Python code" />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>{ready ? '▶ Run' : 'starting Python…'}</button>
        </div>
        {output && <pre className={`term-output${isTraceback ? ' error-trace' : ''}`}>{output}</pre>}
      </div>
    </>
  )
}

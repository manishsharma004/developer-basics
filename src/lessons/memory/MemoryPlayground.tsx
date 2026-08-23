import { useEffect, useRef, useState } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { handleEditorTab } from '../../lib/editorKeys.ts'
import { MEMORY_PROGRAM } from './program.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const SNIPPETS: { label: string; code: string }[] = [
  {
    label: 'Aliasing (same object)',
    code: `a = [1, 2, 3]
b = a            # b points to the SAME list
b.append(4)
print("a =", a)
print("b =", b)
print("same object?", a is b)`,
  },
  {
    label: 'Copy (new object)',
    code: `a = [1, 2, 3]
b = a.copy()     # b is a NEW list
b.append(4)
print("a =", a)
print("b =", b)
print("same object?", a is b)`,
  },
  {
    label: 'Numbers are immutable',
    code: `x = 10
y = x
y += 5           # rebinds y, doesn't change x
print("x =", x, " y =", y)`,
  },
  {
    label: 'Equal vs identical',
    code: `a = [1, 2]
b = [1, 2]
print("equal?    ", a == b)   # same contents
print("identical?", a is b)   # different objects`,
  },
  {
    label: 'Shallow vs deep',
    code: `import copy
a = [[1]]
b = a.copy()           # shallow: inner list is shared
b[0].append(2)
print("after shallow:", a)

a = [[1]]
c = copy.deepcopy(a)   # deep: fully independent
c[0].append(99)
print("after deep:   ", a, c)`,
  },
  {
    label: 'Mutable default trap',
    code: `def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))   # surprise: both calls share one list!`,
  },
  {
    label: 'Break the default trap',
    code: `def add_item(item, bucket=None):
    if bucket is None:
        bucket = []
    bucket.append(item)
    return bucket

print(add_item("a"))
print(add_item("b"))   # each call gets its own list`,
  },
]

export function ReferencePlayground() {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [code, setCode] = useState(SNIPPETS[0].code)
  const [output, setOutput] = useState('')
  const runRef = useRef<PyCallable | null>(null)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(MEMORY_PROGRAM)
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

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} onSkip={skip} skipped={skipped} />
      <div className="ref-play">
        <div className="ref-snippets">
          {SNIPPETS.map((s) => (
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
        <textarea
          className="code-editor"
          value={code}
          spellCheck={false}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => handleEditorTab(e, code, setCode)}
          rows={code.split('\n').length + 1}
          aria-label="Python code"
        />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>
            {ready ? '▶ Run' : 'starting Python…'}
          </button>
        </div>
        {output && <pre className="term-output ref-output">{output}</pre>}
      </div>
    </>
  )
}

interface Frame {
  id: number
  fn: string
  local: string
  refId: number | null
}

interface HeapObj {
  id: number
  label: string
}

const MAX_DEPTH = 7

// A pure-React visualization of how the call stack grows/shrinks and how heap
// objects are allocated and referenced.
export function StackHeapVisualizer() {
  const [frames, setFrames] = useState<Frame[]>([{ id: 1, fn: 'main()', local: 'start', refId: null }])
  const [heap, setHeap] = useState<HeapObj[]>([])
  const [nextFrame, setNextFrame] = useState(2)
  const [nextObj, setNextObj] = useState(1)
  const [overflow, setOverflow] = useState(false)

  const callFn = () => {
    if (frames.length >= MAX_DEPTH) {
      setOverflow(true)
      return
    }
    setFrames((f) => [...f, { id: nextFrame, fn: `work(${f.length})`, local: `n=${f.length}`, refId: null }])
    setNextFrame((n) => n + 1)
  }

  const returnFn = () => {
    setOverflow(false)
    setFrames((f) => (f.length > 1 ? f.slice(0, -1) : f))
  }

  const allocate = () => {
    setHeap((h) => [...h, { id: nextObj, label: `obj #${nextObj}` }])
    setNextObj((n) => n + 1)
  }

  const pointTopAt = () => {
    if (heap.length === 0) return
    const latest = heap[heap.length - 1].id
    setFrames((f) => f.map((fr, i) => (i === f.length - 1 ? { ...fr, refId: latest } : fr)))
  }

  const referenced = new Set(frames.map((f) => f.refId).filter((id): id is number => id !== null))

  const reset = () => {
    setFrames([{ id: 1, fn: 'main()', local: 'start', refId: null }])
    setHeap([])
    setNextFrame(2)
    setNextObj(1)
    setOverflow(false)
  }

  return (
    <div className="demo-split demo-split--wide">
      <div className="panel">
        <div className="panel-title">The call stack</div>
        <p className="panel-hint">Grows as functions call each other; shrinks as they return.</p>
        <div className="stack-viz">
          {[...frames].reverse().map((fr, i) => (
            <div key={fr.id} className={`stack-frame${i === 0 ? ' stack-frame--top' : ''}`}>
              <span className="frame-fn">{fr.fn}</span>
              <span className="frame-local">
                {fr.local}
                {fr.refId !== null && <span className="frame-ref"> → obj #{fr.refId}</span>}
              </span>
            </div>
          ))}
        </div>
        {overflow && <div className="overflow-warn">⚠ Stack overflow! Too many nested calls — this is what infinite recursion does.</div>}
        <div className="proc-actions">
          <button className="btn" onClick={callFn}>Call function</button>
          <button className="btn btn--ghost" onClick={returnFn}>Return</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">The heap</div>
        <p className="panel-hint">Longer-lived objects live here; the stack holds references to them.</p>
        <div className="heap-viz">
          {heap.length === 0 && <div className="heap-empty">No objects yet — allocate one.</div>}
          {heap.map((o) => (
            <div key={o.id} className={`heap-obj${referenced.has(o.id) ? ' heap-obj--ref' : ''}`}>
              <span className="heap-obj-label">{o.label}</span>
              <span className="heap-obj-tag">{referenced.has(o.id) ? 'referenced' : 'unreferenced (garbage)'}</span>
            </div>
          ))}
        </div>
        <div className="proc-actions">
          <button className="btn" onClick={allocate}>Allocate object</button>
          <button className="btn btn--ghost" onClick={pointTopAt} disabled={heap.length === 0}>
            Point top frame → newest
          </button>
          <button className="btn btn--ghost" onClick={reset}>Reset</button>
        </div>
      </div>
    </div>
  )
}

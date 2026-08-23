import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RUNNER_PROGRAM } from '../../lib/pyRunner.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const SNIPPETS: { label: string; code: string }[] = [
  {
    label: 'Encapsulation',
    code: `class Account:
    def __init__(self):
        self._balance = 0          # "_" signals internal state

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount

    def balance(self):
        return self._balance

a = Account()
a.deposit(100)
print("balance:", a.balance())`,
  },
  {
    label: 'Inheritance',
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):            # Dog IS-A Animal
    def speak(self):
        return "woof"

d = Dog("Rex")
print(d.name, "says", d.speak())`,
  },
  {
    label: 'Polymorphism',
    code: `class Circle:
    def __init__(self, r): self.r = r
    def area(self): return 3.14159 * self.r * self.r

class Square:
    def __init__(self, s): self.s = s
    def area(self): return self.s * self.s

# Same call, different behavior — no if/else on type:
for shape in [Circle(2), Square(3)]:
    print(type(shape).__name__, "area =", round(shape.area(), 2))`,
  },
  {
    label: 'Abstraction',
    code: `from abc import ABC, abstractmethod

class Notifier(ABC):
    @abstractmethod
    def send(self, msg): ...

class EmailNotifier(Notifier):
    def send(self, msg):
        print("EMAIL:", msg)

# Callers depend on the abstract Notifier, not the concrete class:
def alert(n: Notifier, msg): n.send(msg)
alert(EmailNotifier(), "server down")`,
  },
]

export function OopPlayground() {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [code, setCode] = useState(SNIPPETS[0].code)
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

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} onSkip={skip} skipped={skipped} />
      <div className="panel">
        <div className="ref-snippets">
          {SNIPPETS.map((s) => (
            <button key={s.label} className="chip" onClick={() => { setCode(s.code); setOutput('') }}>{s.label}</button>
          ))}
        </div>
        <MonacoEditor value={code} onChange={setCode} language="python" minLines={6} ariaLabel="Python code" />
        <div className="ref-run-row">
          <button className="btn" disabled={!ready} onClick={run}>{ready ? '▶ Run' : 'starting Python…'}</button>
        </div>
        {output && <pre className="term-output">{output}</pre>}
      </div>
    </>
  )
}

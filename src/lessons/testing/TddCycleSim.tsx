import { useState } from 'react'

type Phase = 'red' | 'green' | 'refactor'

const PHASES: Record<
  Phase,
  { title: string; code: string; output: string; ok: boolean }
> = {
  red: {
    title: 'Red — failing test',
    code: `def add(a, b):
    return a - b        # bug

def test_add():
    assert add(2, 3) == 5

test_add()`,
    output: 'AssertionError: expected 5, got -1',
    ok: false,
  },
  green: {
    title: 'Green — minimal fix',
    code: `def add(a, b):
    return a + b        # fixed

def test_add():
    assert add(2, 3) == 5

test_add()
print("passed")`,
    output: 'passed',
    ok: true,
  },
  refactor: {
    title: 'Refactor — clean up safely',
    code: `def add(a: int, b: int) -> int:
    """Sum two integers."""
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0

test_add()
print("still passing after refactor")`,
    output: 'still passing after refactor',
    ok: true,
  },
}

export function TddCycleSim() {
  const [phase, setPhase] = useState<Phase>('red')
  const p = PHASES[phase]

  return (
    <div className="panel tdd-lab">
      <div className="panel-title">TDD cycle — click each phase</div>
      <div className="tdd-cycle">
        {(['red', 'green', 'refactor'] as Phase[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`tdd-phase tdd-phase--${key}${phase === key ? ' tdd-phase--active' : ''}`}
            onClick={() => setPhase(key)}
          >
            {key}
          </button>
        ))}
        <span className="tdd-cycle-arrow">→</span>
      </div>
      <p className="panel-hint">{p.title}</p>
      <pre className="term-output">{p.code}</pre>
      <div className={`tdd-output tdd-output--${p.ok ? 'pass' : 'fail'}`}>
        ▶ {p.output}
      </div>
    </div>
  )
}

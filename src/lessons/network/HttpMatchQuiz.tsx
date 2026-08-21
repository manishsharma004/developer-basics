import { useMemo, useState } from 'react'

type Pair = { left: string; right: string; leftLabel: string; rightLabel: string }

const PAIRS: Pair[] = [
  { left: 'GET', right: 'read', leftLabel: 'GET', rightLabel: 'Read a resource (no side effects)' },
  { left: 'POST', right: 'create', leftLabel: 'POST', rightLabel: 'Create or submit data' },
  { left: 'DELETE', right: 'remove', leftLabel: 'DELETE', rightLabel: 'Remove a resource' },
  { left: '404', right: '4xx', leftLabel: '404 Not Found', rightLabel: '4xx — client/request problem' },
  { left: '500', right: '5xx', leftLabel: '500 Internal Error', rightLabel: '5xx — server failed' },
  { left: '201', right: '2xx', leftLabel: '201 Created', rightLabel: '2xx — success' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function HttpMatchQuiz() {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrong, setWrong] = useState(false)
  const [seed, setSeed] = useState(0)

  const leftItems = useMemo(
    () => shuffle(PAIRS.map((p) => ({ id: p.left, label: p.leftLabel }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )
  const rightItems = useMemo(
    () => shuffle(PAIRS.map((p) => ({ id: p.right, label: p.rightLabel }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  )

  const pairMap = useMemo(() => {
    const m = new Map<string, string>()
    PAIRS.forEach((p) => m.set(p.left, p.right))
    return m
  }, [])

  const pickLeft = (id: string) => {
    if (matched.has(id)) return
    setWrong(false)
    setSelectedLeft(id)
  }

  const pickRight = (id: string) => {
    if (!selectedLeft) return
    const expected = pairMap.get(selectedLeft)
    if (expected === id) {
      setMatched((prev) => new Set([...prev, selectedLeft]))
      setSelectedLeft(null)
      setWrong(false)
    } else {
      setWrong(true)
      setSelectedLeft(null)
    }
  }

  const done = matched.size === PAIRS.length

  return (
    <div className="panel match-lab">
      <div className="panel-title">Match methods & status codes</div>
      <p className="panel-hint">Click a method or code on the left, then its meaning on the right.</p>
      <div className="match-columns">
        <div className="match-col">
          <div className="match-col-title">Methods / codes</div>
          {leftItems.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={matched.has(item.id)}
              className={`match-item${selectedLeft === item.id ? ' match-item--selected' : ''}${matched.has(item.id) ? ' match-item--done' : ''}`}
              onClick={() => pickLeft(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="match-col">
          <div className="match-col-title">Intent / family</div>
          {rightItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="match-item match-item--right"
              onClick={() => pickRight(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {wrong && <p className="match-wrong">Not a match — try again.</p>}
      {done && <p className="match-done">All matched ✓</p>}
      <button type="button" className="btn btn--ghost" onClick={() => { setSeed((s) => s + 1); setMatched(new Set()); setSelectedLeft(null); setWrong(false) }}>
        Shuffle & reset
      </button>
    </div>
  )
}

import { useState } from 'react'

const KEYS = ['A', 'B', 'C', 'D', 'E']
const SAMPLE = ['A', 'B', 'C', 'A', 'D', 'B', 'E', 'A', 'B']

export function LruCacheViz() {
  const [capacity, setCapacity] = useState(3)
  const [cache, setCache] = useState<string[]>([])
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const access = (key: string, cap = capacity) => {
    setCache((prev) => {
      const hit = prev.includes(key)
      if (hit) {
        setHits((h) => h + 1)
        setLog((l) => [`${key} → HIT`, ...l].slice(0, 8))
        return [key, ...prev.filter((k) => k !== key)]
      }
      setMisses((m) => m + 1)
      let next = [key, ...prev.filter((k) => k !== key)]
      let evicted: string | null = null
      if (next.length > cap) {
        evicted = next[next.length - 1]
        next = next.slice(0, cap)
      }
      setLog((l) => [`${key} → MISS${evicted ? `, evict ${evicted}` : ''}`, ...l].slice(0, 8))
      return next
    })
  }

  const runSample = () => {
    reset()
    let i = 0
    const step = () => {
      if (i >= SAMPLE.length) return
      access(SAMPLE[i])
      i++
      setTimeout(step, 550)
    }
    setTimeout(step, 150)
  }

  const reset = () => {
    setCache([])
    setHits(0)
    setMisses(0)
    setLog([])
  }

  const changeCapacity = (c: number) => {
    setCapacity(c)
    setCache((prev) => prev.slice(0, c))
  }

  const total = hits + misses
  const rate = total ? Math.round((hits / total) * 100) : 0

  return (
    <div className="panel">
      <div className="race-controls">
        <label className="conv-field" style={{ maxWidth: 220 }}>
          <span>Capacity: {capacity}</span>
          <input type="range" min={1} max={5} value={capacity} onChange={(e) => changeCapacity(Number(e.target.value))} />
        </label>
        <div className="lru-keys">
          <span className="git-label">Access</span>
          {KEYS.map((k) => (
            <button key={k} className="chip" onClick={() => access(k)}>{k}</button>
          ))}
        </div>
        <button className="btn" onClick={runSample}>Run sample</button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
      </div>

      <div className="lru-cache">
        <span className="git-label">Cache (most-recent first)</span>
        <div className="lru-slots">
          {Array.from({ length: capacity }, (_, i) => (
            <div key={i} className={`lru-slot${cache[i] ? ' lru-slot--full' : ''}${i === 0 && cache[0] ? ' lru-slot--mru' : ''}`}>
              {cache[i] ?? '·'}
            </div>
          ))}
        </div>
      </div>

      <div className="sim-averages">
        <div><span className="avg-label">Hits</span><span className="avg-value race-ok">{hits}</span></div>
        <div><span className="avg-label">Misses</span><span className="avg-value race-bad">{misses}</span></div>
        <div><span className="avg-label">Hit rate</span><span className="avg-value">{rate}%</span></div>
      </div>

      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}

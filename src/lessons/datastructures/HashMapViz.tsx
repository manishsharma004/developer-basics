import { useState } from 'react'

interface Entry {
  key: string
  value: string
}

const BUCKETS = 8

function hash(key: string): number {
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return h % BUCKETS
}

const INITIAL: Entry[][] = (() => {
  const b: Entry[][] = Array.from({ length: BUCKETS }, () => [])
  for (const [k, v] of [['red', '#f00'], ['green', '#0f0'], ['blue', '#00f'], ['cyan', '#0ff']] as const) {
    b[hash(k)].push({ key: k, value: v })
  }
  return b
})()

export function HashMapViz() {
  const [buckets, setBuckets] = useState<Entry[][]>(INITIAL)
  const [key, setKey] = useState('orange')
  const [value, setValue] = useState('#f80')
  const [highlight, setHighlight] = useState<number | null>(null)
  const [note, setNote] = useState<string>('')

  const count = buckets.reduce((n, b) => n + b.length, 0)

  const insert = () => {
    const k = key.trim()
    if (!k) return
    const idx = hash(k)
    setBuckets((prev) => {
      const next = prev.map((b) => [...b])
      const existing = next[idx].find((e) => e.key === k)
      if (existing) existing.value = value
      else next[idx].push({ key: k, value })
      return next
    })
    setHighlight(idx)
    const collide = buckets[idx].length > 0 && !buckets[idx].some((e) => e.key === k)
    setNote(`hash("${k}") → bucket ${idx}${collide ? ' — collision! chained in the same bucket.' : ''}`)
  }

  const lookup = () => {
    const k = key.trim()
    const idx = hash(k)
    setHighlight(idx)
    const found = buckets[idx].find((e) => e.key === k)
    setNote(found ? `Found "${k}" in bucket ${idx} → ${found.value}` : `"${k}" not present (checked bucket ${idx}).`)
  }

  const remove = () => {
    const k = key.trim()
    const idx = hash(k)
    setBuckets((prev) => prev.map((b, i) => (i === idx ? b.filter((e) => e.key !== k) : b)))
    setHighlight(idx)
    setNote(`Removed "${k}" from bucket ${idx} (if present).`)
  }

  return (
    <div className="panel">
      <div className="ds-controls">
        <label className="conv-field"><span>key</span><input value={key} onChange={(e) => setKey(e.target.value)} /></label>
        <label className="conv-field"><span>value</span><input value={value} onChange={(e) => setValue(e.target.value)} /></label>
        <button className="btn" onClick={insert}>Insert / update</button>
        <button className="btn btn--ghost" onClick={lookup}>Look up</button>
        <button className="btn btn--ghost" onClick={remove}>Remove</button>
      </div>
      {note && <div className="ds-note">{note}</div>}
      <p className="panel-hint">Load factor: {(count / BUCKETS).toFixed(2)} ({count} entries / {BUCKETS} buckets)</p>
      <div className="buckets">
        {buckets.map((b, i) => (
          <div key={i} className={`bucket${highlight === i ? ' bucket--hot' : ''}`}>
            <span className="bucket-idx">{i}</span>
            <div className="bucket-entries">
              {b.length === 0 && <span className="bucket-empty">·</span>}
              {b.map((e) => (
                <span key={e.key} className={`bucket-entry${b.length > 1 ? ' bucket-entry--collision' : ''}`}>
                  {e.key}: {e.value}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'

type Algo = 'bubble' | 'insertion' | 'selection'

interface Frame {
  arr: number[]
  a: number
  b: number
  kind: 'compare' | 'swap'
}

const ALGOS: { id: Algo; label: string; big: string }[] = [
  { id: 'bubble', label: 'Bubble sort', big: 'O(n²)' },
  { id: 'insertion', label: 'Insertion sort', big: 'O(n²)' },
  { id: 'selection', label: 'Selection sort', big: 'O(n²)' },
]

function buildFrames(input: number[], algo: Algo): { frames: Frame[]; comparisons: number } {
  const a = [...input]
  const frames: Frame[] = []
  let comps = 0
  const swap = (i: number, j: number) => {
    const t = a[i]
    a[i] = a[j]
    a[j] = t
  }
  if (algo === 'bubble') {
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - 1 - i; j++) {
        comps++
        frames.push({ arr: [...a], a: j, b: j + 1, kind: 'compare' })
        if (a[j] > a[j + 1]) {
          swap(j, j + 1)
          frames.push({ arr: [...a], a: j, b: j + 1, kind: 'swap' })
        }
      }
    }
  } else if (algo === 'insertion') {
    for (let i = 1; i < a.length; i++) {
      let j = i
      while (j > 0) {
        comps++
        frames.push({ arr: [...a], a: j - 1, b: j, kind: 'compare' })
        if (a[j - 1] > a[j]) {
          swap(j - 1, j)
          frames.push({ arr: [...a], a: j - 1, b: j, kind: 'swap' })
          j--
        } else break
      }
    }
  } else {
    for (let i = 0; i < a.length - 1; i++) {
      let min = i
      for (let j = i + 1; j < a.length; j++) {
        comps++
        frames.push({ arr: [...a], a: min, b: j, kind: 'compare' })
        if (a[j] < a[min]) min = j
      }
      if (min !== i) {
        swap(i, min)
        frames.push({ arr: [...a], a: i, b: min, kind: 'swap' })
      }
    }
  }
  return { frames, comparisons: comps }
}

const randomArray = (n = 16) => Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 8)

export function SortViz() {
  const [base, setBase] = useState<number[]>(randomArray)
  const [algo, setAlgo] = useState<Algo>('bubble')
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(false)

  const { frames, comparisons } = useMemo(() => buildFrames(base, algo), [base, algo])

  useEffect(() => {
    setIdx(0)
    setPlaying(false)
  }, [base, algo])

  useEffect(() => {
    if (!playing) return
    if (idx >= frames.length - 1) {
      setPlaying(false)
      return
    }
    const id = setTimeout(() => setIdx((i) => Math.min(frames.length - 1, i + 1)), 120)
    return () => clearTimeout(id)
  }, [playing, idx, frames])

  const frame = frames[idx]
  const arr = frame ? frame.arr : base
  const max = Math.max(...arr)
  const compsSoFar = frames.slice(0, idx + 1).filter((f) => f.kind === 'compare').length
  const done = idx >= frames.length - 1

  return (
    <div className="panel">
      <div className="algo-picker">
        {ALGOS.map((a) => (
          <button key={a.id} className={`algo-btn${algo === a.id ? ' algo-btn--active' : ''}`} onClick={() => setAlgo(a.id)}>
            {a.label} <span className="algo-big">{a.big}</span>
          </button>
        ))}
      </div>

      <div className="sort-bars">
        {arr.map((v, i) => {
          const active = frame && (i === frame.a || i === frame.b)
          const cls = active ? (frame.kind === 'swap' ? ' bar--swap' : ' bar--compare') : ''
          return <div key={i} className={`bar${cls}`} style={{ height: `${(v / max) * 100}%` }} />
        })}
      </div>

      <div className="sort-controls">
        <button
          className="btn"
          onClick={() => {
            if (playing) setPlaying(false)
            else {
              if (done) setIdx(0)
              setPlaying(true)
            }
          }}
        >
          {playing ? '❚❚ Pause' : done ? '▶ Replay' : '▶ Play'}
        </button>
        <button className="btn btn--ghost" onClick={() => setBase(randomArray())}>New array</button>
        <span className="sort-stat">comparisons: <b>{compsSoFar}</b> / {comparisons}</span>
        <span className="sort-stat">step {Math.min(idx + 1, frames.length)} / {frames.length}</span>
      </div>
    </div>
  )
}

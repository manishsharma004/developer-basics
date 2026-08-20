import { useState } from 'react'

interface CarObject {
  id: number
  make: string
  color: string
  speed: number
}

const COLORS = ['#38bdf8', '#f472b6', '#34d399', '#fbbf24', '#a78bfa', '#fb7185']

export function ClassBuilder() {
  const [objects, setObjects] = useState<CarObject[]>([
    { id: 1, make: 'Tesla', color: '#38bdf8', speed: 0 },
  ])
  const [make, setMake] = useState('Toyota')
  const [nextId, setNextId] = useState(2)

  const create = () => {
    setObjects((o) => [...o, { id: nextId, make: make.trim() || `Car${nextId}`, color: COLORS[nextId % COLORS.length], speed: 0 }])
    setNextId((n) => n + 1)
  }

  const accelerate = (id: number) => setObjects((o) => o.map((c) => (c.id === id ? { ...c, speed: c.speed + 10 } : c)))
  const brake = (id: number) => setObjects((o) => o.map((c) => (c.id === id ? { ...c, speed: Math.max(0, c.speed - 10) } : c)))
  const remove = (id: number) => setObjects((o) => o.filter((c) => c.id !== id))

  return (
    <div className="demo-split demo-split--wide">
      <div className="panel">
        <div className="panel-title">The class (blueprint)</div>
        <pre className="term-output class-src">{`class Car:
    def __init__(self, make, color):
        self.make = make      # field (per-object state)
        self.color = color    # field
        self.speed = 0        # field

    def accelerate(self):     # method (shared behavior)
        self.speed += 10

    def brake(self):
        self.speed = max(0, self.speed - 10)`}</pre>
        <div className="class-create">
          <label className="conv-field"><span>make</span><input value={make} onChange={(e) => setMake(e.target.value)} /></label>
          <button className="btn" onClick={create}>new Car(make)</button>
        </div>
        <p className="panel-hint">Objects created: {objects.length} — each has its own state, all share the methods above.</p>
      </div>

      <div className="panel">
        <div className="panel-title">The objects (instances)</div>
        <div className="obj-grid">
          {objects.length === 0 && <div className="heap-empty">No objects — create one.</div>}
          {objects.map((c) => (
            <div key={c.id} className="obj-card" style={{ borderColor: c.color }}>
              <div className="obj-head">
                <span className="obj-badge" style={{ background: c.color }}>#{c.id}</span>
                <span className="obj-make">{c.make}</span>
                <button className="icon-btn" onClick={() => remove(c.id)} aria-label="delete">×</button>
              </div>
              <div className="obj-fields">
                <div>make = <b>{c.make}</b></div>
                <div>speed = <b>{c.speed}</b> km/h</div>
              </div>
              <div className="obj-actions">
                <button className="btn btn--ghost" onClick={() => accelerate(c.id)}>accelerate()</button>
                <button className="btn btn--ghost" onClick={() => brake(c.id)}>brake()</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

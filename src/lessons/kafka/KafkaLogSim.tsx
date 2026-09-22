import { useMemo, useState } from 'react'

type Record = { id: number; key: string; partition: number; offset: number }

function partitionForKey(key: string, partitionCount: number): number {
  if (!key.trim()) return Math.floor(Math.random() * partitionCount)
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return h % partitionCount
}

export function KafkaLogSim() {
  const [partitions, setPartitions] = useState(3)
  const [key, setKey] = useState('user-42')
  const [value, setValue] = useState('clicked checkout')
  const [records, setRecords] = useState<Record[]>([])
  const [consumers, setConsumers] = useState(2)
  const [nextId, setNextId] = useState(1)

  const byPartition = useMemo(() => {
    const map: Record[][] = Array.from({ length: partitions }, () => [])
    for (const r of records) map[r.partition].push(r)
    return map
  }, [records, partitions])

  const assignments = useMemo(() => {
    const out: number[][] = Array.from({ length: consumers }, () => [])
    for (let p = 0; p < partitions; p++) {
      out[p % consumers].push(p)
    }
    return out
  }, [consumers, partitions])

  const lagPerConsumer = useMemo(() => {
    return assignments.map((parts) => {
      let unread = 0
      for (const p of parts) unread += byPartition[p].length
      return unread
    })
  }, [assignments, byPartition])

  const produce = () => {
    const p = partitionForKey(key, partitions)
    const offset = byPartition[p].length
    const rec: Record = { id: nextId, key: key.trim() || '(none)', partition: p, offset }
    setRecords((prev) => [...prev, rec])
    setNextId((n) => n + 1)
  }

  const consumeOne = (consumerIndex: number) => {
    const parts = assignments[consumerIndex]
    for (const p of parts) {
      const idx = records.findIndex((r) => r.partition === p)
      if (idx >= 0) {
        setRecords((prev) => prev.filter((_, i) => i !== idx))
        return
      }
    }
  }

  return (
    <div className="kafka-sim">
      <div className="kafka-sim-controls">
        <label>
          Partitions
          <input
            type="range"
            min={1}
            max={6}
            value={partitions}
            onChange={(e) => {
              setPartitions(Number(e.target.value))
              setRecords([])
              setNextId(1)
            }}
          />
          <span>{partitions}</span>
        </label>
        <label>
          Consumers in group
          <input
            type="range"
            min={1}
            max={6}
            value={consumers}
            onChange={(e) => setConsumers(Number(e.target.value))}
          />
          <span>{consumers}</span>
        </label>
      </div>

      <div className="kafka-sim-produce">
        <input
          className="kafka-sim-input"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Record key (optional)"
          aria-label="Record key"
        />
        <input
          className="kafka-sim-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Payload (demo only)"
          aria-label="Record value"
        />
        <button type="button" className="btn" onClick={produce}>Produce</button>
      </div>

      <div className="kafka-sim-grid">
        {byPartition.map((partRecords, p) => (
          <div key={p} className="kafka-sim-partition">
            <div className="kafka-sim-partition-title">Partition {p}</div>
            <div className="kafka-sim-log">
              {partRecords.length === 0 && <span className="kafka-sim-empty">empty log</span>}
              {partRecords.map((r) => (
                <div key={r.id} className="kafka-sim-record" title={`offset ${r.offset}`}>
                  <span className="kafka-sim-off">{r.offset}</span>
                  <span className="kafka-sim-key">{r.key}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="kafka-sim-consumers">
        <p className="prose kafka-sim-note">
          Each consumer in the group owns a fair share of partitions (demo assignment). Lag ≈ unread records on assigned partitions.
        </p>
        <div className="kafka-sim-consumer-row">
          {assignments.map((parts, i) => (
            <div key={i} className="kafka-sim-consumer">
              <strong>Consumer {i + 1}</strong>
              <div className="kafka-sim-assign">Partitions: {parts.join(', ') || '—'}</div>
              <div className="kafka-sim-lag">Lag: {lagPerConsumer[i]}</div>
              <button type="button" className="btn btn--small" onClick={() => consumeOne(i)}>
                Poll once
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

const MAX_BLOCKS = 48
const TICK_MS = 400

export function QueueSimulator() {
  const [producerRate, setProducerRate] = useState(6) // msgs/sec
  const [consumers, setConsumers] = useState(2)
  const [consumerRate, setConsumerRate] = useState(2) // msgs/sec each
  const [running, setRunning] = useState(false)
  const [depth, setDepth] = useState(0)
  const [produced, setProduced] = useState(0)
  const [processed, setProcessed] = useState(0)
  const carry = useRef({ prod: 0, cons: 0 })

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      const dt = TICK_MS / 1000
      carry.current.prod += producerRate * dt
      carry.current.cons += consumers * consumerRate * dt
      const inMsgs = Math.floor(carry.current.prod)
      carry.current.prod -= inMsgs
      setProduced((p) => p + inMsgs)
      setDepth((d) => {
        let next = d + inMsgs
        const canConsume = Math.floor(carry.current.cons)
        const actuallyConsumed = Math.min(canConsume, next)
        carry.current.cons -= actuallyConsumed
        next -= actuallyConsumed
        if (actuallyConsumed > 0) setProcessed((p) => p + actuallyConsumed)
        return next
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [running, producerRate, consumers, consumerRate])

  const reset = () => {
    setRunning(false)
    setDepth(0)
    setProduced(0)
    setProcessed(0)
    carry.current = { prod: 0, cons: 0 }
  }

  const consumeCapacity = consumers * consumerRate
  const status =
    producerRate > consumeCapacity ? 'growing' : producerRate < consumeCapacity ? 'draining' : 'balanced'
  const blocks = Math.min(depth, MAX_BLOCKS)

  return (
    <div className="panel">
      <div className="queue-controls">
        <label className="conv-field">
          <span>Producer rate: {producerRate}/s</span>
          <input type="range" min={0} max={20} value={producerRate} onChange={(e) => setProducerRate(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>Consumers: {consumers}</span>
          <input type="range" min={0} max={8} value={consumers} onChange={(e) => setConsumers(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>Each consumes: {consumerRate}/s</span>
          <input type="range" min={1} max={8} value={consumerRate} onChange={(e) => setConsumerRate(Number(e.target.value))} />
        </label>
      </div>

      <div className="proc-actions">
        <button className="btn" onClick={() => setRunning((r) => !r)}>{running ? '❚❚ Pause' : '▶ Run'}</button>
        <button className="btn btn--ghost" onClick={reset}>Reset</button>
        <span className={`queue-status queue-status--${status}`}>
          producer {producerRate}/s vs consumers {consumeCapacity}/s — {status}
        </span>
      </div>

      <div className="queue-flow">
        <div className="queue-end">🏭 producer</div>
        <div className="queue-pipe">
          {Array.from({ length: MAX_BLOCKS }, (_, i) => (
            <span key={i} className={`queue-msg${i < blocks ? ' queue-msg--on' : ''}`} />
          ))}
          {depth > MAX_BLOCKS && <span className="queue-overflow">+{depth - MAX_BLOCKS}</span>}
        </div>
        <div className="queue-end">
          {Array.from({ length: Math.max(1, consumers) }, (_, i) => <span key={i}>⚙️</span>)}
          <div className="queue-end-label">{consumers} consumer{consumers === 1 ? '' : 's'}</div>
        </div>
      </div>

      <div className="sim-averages">
        <div><span className="avg-label">Queue depth</span><span className={`avg-value ${status === 'growing' ? 'race-bad' : 'race-ok'}`}>{depth}</span></div>
        <div><span className="avg-label">Produced</span><span className="avg-value">{produced}</span></div>
        <div><span className="avg-label">Processed</span><span className="avg-value">{processed}</span></div>
      </div>

      {status === 'growing' && running && (
        <div className="race-verdict race-verdict--bad">
          ✗ Producers are outrunning consumers, so the backlog keeps growing. In a
          real system this is <b>backpressure</b> — add consumers, speed them up, or
          slow producers.
        </div>
      )}
    </div>
  )
}

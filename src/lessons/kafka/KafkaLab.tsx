import { useCallback, useEffect, useState } from 'react'
import {
  kafkaLabConsume,
  kafkaLabHealth,
  kafkaLabMessages,
  kafkaLabProduce,
  type KafkaLabHealth,
  type KafkaLabMessage,
} from '../../lib/kafkaLab.ts'

export function KafkaLab() {
  const [health, setHealth] = useState<KafkaLabHealth | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [key, setKey] = useState('user-42')
  const [value, setValue] = useState('order placed')
  const [messages, setMessages] = useState<KafkaLabMessage[]>([])
  const [groupId, setGroupId] = useState('devbasics-lab-group')
  const [lastConsume, setLastConsume] = useState<KafkaLabMessage[]>([])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const h = await kafkaLabHealth()
      setHealth(h)
      setGroupId(h.defaultGroup)
      const { messages: msgs } = await kafkaLabMessages(h.defaultTopic)
      setMessages(msgs)
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Kafka lab API unreachable. Run `bun run kafka:broker` and `bun run kafka:lab` (or `bun run dev:kafka`).',
      )
      setHealth(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const produce = async () => {
    if (!health) return
    setError(null)
    try {
      const res = await kafkaLabProduce({ key, value, topic: health.defaultTopic })
      setMessages(res.messages)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Produce failed')
    }
  }

  const consume = async () => {
    if (!health) return
    setError(null)
    try {
      const res = await kafkaLabConsume({
        groupId,
        topic: health.defaultTopic,
        maxMessages: 5,
      })
      setLastConsume(res.messages)
      const { messages: msgs } = await kafkaLabMessages(health.defaultTopic)
      setMessages(msgs)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Consume failed')
    }
  }

  const byPartition = (msgs: KafkaLabMessage[]) => {
    const map = new Map<number, KafkaLabMessage[]>()
    for (const m of msgs) {
      const list = map.get(m.partition) ?? []
      list.push(m)
      map.set(m.partition, list)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }

  if (loading && !health && !error) {
    return <p className="prose">Connecting to Kafka lab broker…</p>
  }

  return (
    <div className="kafka-lab">
      {error && (
        <div className="callout callout--note kafka-lab-error">
          <p className="prose">{error}</p>
        </div>
      )}

      {health && (
        <>
          <p className="prose kafka-lab-meta">
            Broker <code>{health.broker}</code> · topic <code>{health.defaultTopic}</code> ·{' '}
            {health.fullProtocol ? (
              <strong>full protocol</strong>
            ) : (
              <strong>embedded broker</strong>
            )}
            {health.note ? <> — {health.note}</> : null}
          </p>

          <div className="kafka-sim-produce">
            <input
              className="kafka-sim-input"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Record key"
              aria-label="Record key"
            />
            <input
              className="kafka-sim-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Record value"
              aria-label="Record value"
            />
            <button type="button" className="btn" onClick={() => void produce()}>Produce (kafkajs)</button>
          </div>

          <div className="kafka-lab-consume-row">
            <input
              className="kafka-sim-input"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Consumer group id"
              aria-label="Consumer group id"
            />
            <button type="button" className="btn" onClick={() => void consume()}>Consume (poll)</button>
            <button type="button" className="btn btn--small" onClick={() => void refresh()}>Refresh log</button>
          </div>

          <div className="kafka-sim-grid">
            {byPartition(messages).map(([p, partMsgs]) => (
              <div key={p} className="kafka-sim-partition">
                <div className="kafka-sim-partition-title">Partition {p}</div>
                <div className="kafka-sim-log">
                  {partMsgs.length === 0 && <span className="kafka-sim-empty">empty</span>}
                  {partMsgs.map((r, i) => (
                    <div key={`${r.offset}-${i}`} className="kafka-sim-record">
                      <span className="kafka-sim-off">{r.offset}</span>
                      <span className="kafka-sim-key">{r.key ?? '(none)'}</span>
                      <span className="kafka-sim-val">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {lastConsume.length > 0 && (
            <div className="kafka-lab-last-consume">
              <h3 className="kafka-lab-subhead">Last consume batch</h3>
              <ul className="prose-list">
                {lastConsume.map((m, i) => (
                  <li key={i}>
                    <code>p{m.partition}@{m.offset}</code> {m.key ?? '∅'} → {m.value}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  )
}

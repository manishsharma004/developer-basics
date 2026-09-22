import { useCallback, useEffect, useState } from 'react'
import {
  consumeRecords,
  getLabInfo,
  groupLag,
  listTopicRecords,
  produceRecord,
  resetKafkaLab,
  subscribeKafkaLab,
  type LabRecord,
} from './kafkaLabEngine.ts'

export function KafkaLab() {
  const info = getLabInfo()
  const [key, setKey] = useState('user-42')
  const [value, setValue] = useState('order placed')
  const [messages, setMessages] = useState<LabRecord[]>(() => listTopicRecords())
  const [groupId, setGroupId] = useState(info.defaultGroup)
  const [lastConsume, setLastConsume] = useState<LabRecord[]>([])
  const [lag, setLag] = useState(() => groupLag(info.defaultGroup))

  const refresh = useCallback(() => {
    setMessages(listTopicRecords())
    setLag(groupLag(groupId))
  }, [groupId])

  useEffect(() => {
    refresh()
    const unsub = subscribeKafkaLab(refresh)
    return unsub
  }, [refresh])

  const produce = () => {
    produceRecord({ key, value, topic: info.topic })
    refresh()
  }

  const consume = () => {
    const batch = consumeRecords({ groupId, topic: info.topic, maxMessages: 5 })
    setLastConsume(batch)
    refresh()
  }

  const byPartition = (msgs: LabRecord[]) => {
    const map = new Map<number, LabRecord[]>()
    for (const m of msgs) {
      const list = map.get(m.partition) ?? []
      list.push(m)
      map.set(m.partition, list)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }

  return (
    <div className="kafka-lab">
      <p className="prose kafka-lab-meta">
        <strong>In-browser lab</strong> · topic <code>{info.topic}</code> · {info.partitionCount} partitions ·{' '}
        {info.note}
      </p>

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
          placeholder="Record value"
          aria-label="Record value"
        />
        <button type="button" className="btn" onClick={produce}>Produce</button>
      </div>

      <div className="kafka-lab-consume-row">
        <input
          className="kafka-sim-input"
          value={groupId}
          onChange={(e) => {
            setGroupId(e.target.value)
            setLag(groupLag(e.target.value.trim() || info.defaultGroup))
          }}
          placeholder="Consumer group id"
          aria-label="Consumer group id"
        />
        <button type="button" className="btn" onClick={consume}>Consume (poll)</button>
        <button type="button" className="btn btn--small" onClick={refresh}>Refresh</button>
        <button
          type="button"
          className="btn btn--small"
          onClick={() => {
            resetKafkaLab()
            setLastConsume([])
            refresh()
          }}
        >
          Reset lab
        </button>
      </div>

      <p className="prose kafka-lab-lag">
        Consumer lag:{' '}
        {lag.map((l) => (
          <span key={l.partition}>
            p{l.partition}={l.lag}{' '}
          </span>
        ))}
      </p>

      <div className="kafka-sim-grid">
        {byPartition(messages).map(([p, partMsgs]) => (
          <div key={p} className="kafka-sim-partition">
            <div className="kafka-sim-partition-title">Partition {p}</div>
            <div className="kafka-sim-log">
              {partMsgs.length === 0 && <span className="kafka-sim-empty">empty log</span>}
              {partMsgs.map((r) => (
                <div key={r.id} className="kafka-sim-record">
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
            {lastConsume.map((m) => (
              <li key={m.id}>
                <code>p{m.partition}@{m.offset}</code> {m.key ?? '∅'} → {m.value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

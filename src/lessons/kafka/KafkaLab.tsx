import { useCallback, useEffect, useMemo, useState } from 'react'
import { KafkaProducer, getLabInfo, resetKafkaLab, subscribeKafkaLab } from './kafkaApi.ts'
import {
  assignPartitionsToConsumers,
  committedOffset,
  consumeRecords,
  getPartitionCount,
  groupLag,
  lagForPartitions,
  listTopicRecords,
  setPartitionCount,
  type LabRecord,
} from './kafkaLabEngine.ts'

export function KafkaLab() {
  const info = getLabInfo()
  const [partitionCount, setPartitionCountUi] = useState(() => getPartitionCount())
  const [consumers, setConsumers] = useState(2)
  const [key, setKey] = useState('user-42')
  const [value, setValue] = useState('order placed')
  const [groupId, setGroupId] = useState(info.defaultGroup)
  const [messages, setMessages] = useState<LabRecord[]>(() => listTopicRecords())
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [lastConsume, setLastConsume] = useState<{ consumer: number; records: LabRecord[] } | null>(null)

  const gid = groupId.trim() || info.defaultGroup

  const refresh = useCallback(() => {
    setMessages(listTopicRecords())
    setPartitionCountUi(getPartitionCount())
  }, [])

  useEffect(() => {
    refresh()
    return subscribeKafkaLab(refresh)
  }, [refresh])

  const assignments = useMemo(
    () => assignPartitionsToConsumers(consumers),
    [consumers, partitionCount, messages],
  )

  const onPartitionCountChange = (n: number) => {
    setPartitionCount(n)
    setPartitionCountUi(n)
    setLastConsume(null)
    setHighlightId(null)
    refresh()
  }

  const produce = () => {
    const producer = new KafkaProducer()
    const rec = producer.send(info.topic, value, key.trim() || null)
    setHighlightId(rec.id)
    setLastConsume(null)
    refresh()
  }

  const pollConsumer = (consumerIndex: number) => {
    const parts = assignments[consumerIndex] ?? []
    const batch = consumeRecords({
      groupId: gid,
      topic: info.topic,
      maxMessages: 1,
      partitionFilter: parts,
    })
    if (batch.length > 0) {
      setHighlightId(batch[0].id)
      setLastConsume({ consumer: consumerIndex, records: batch })
    }
    refresh()
  }

  const partitionSlots = useMemo(() => {
    return Array.from({ length: partitionCount }, (_, p) => {
      const partMsgs = messages.filter((m) => m.partition === p)
      return { p, partMsgs }
    })
  }, [messages, partitionCount])

  return (
    <div className="kafka-lab">
      <p className="prose kafka-lab-meta">
        <strong>In-browser lab</strong> · topic <code>{info.topic}</code> · {info.note}
      </p>

      <div className="kafka-sim-controls">
        <label>
          Partitions
          <input
            type="range"
            min={1}
            max={6}
            value={partitionCount}
            onChange={(e) => onPartitionCountChange(Number(e.target.value))}
          />
          <span>{partitionCount}</span>
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
          placeholder="Record value"
          aria-label="Record value"
        />
        <button type="button" className="btn" onClick={produce}>Produce</button>
      </div>

      <div className="kafka-lab-consume-row">
        <input
          className="kafka-sim-input"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Consumer group id"
          aria-label="Consumer group id"
        />
        <button type="button" className="btn btn--small" onClick={refresh}>Refresh</button>
        <button
          type="button"
          className="btn btn--small"
          onClick={() => {
            resetKafkaLab(partitionCount)
            setLastConsume(null)
            setHighlightId(null)
            refresh()
          }}
        >
          Reset topic
        </button>
      </div>

      <p className="prose kafka-lab-legend">
        <span className="kafka-sim-record kafka-sim-record--sample-unread">unread</span>
        <span className="kafka-sim-record kafka-sim-record--sample-read">read by group</span>
        <span className="kafka-sim-record kafka-sim-record--highlight">last action</span>
      </p>

      <div className="kafka-sim-grid">
        {partitionSlots.map(({ p, partMsgs }) => (
          <div key={p} className="kafka-sim-partition">
            <div className="kafka-sim-partition-title">
              Partition {p}
              <span className="kafka-sim-hwm">log end: {partMsgs.length}</span>
            </div>
            <div className="kafka-sim-log">
              {partMsgs.length === 0 && <span className="kafka-sim-empty">empty log</span>}
              {partMsgs.map((r) => {
                const read = r.offset < committedOffset(gid, p)
                const highlight = r.id === highlightId
                return (
                  <div
                    key={r.id}
                    className={`kafka-sim-record${read ? ' kafka-sim-record--read' : ''}${highlight ? ' kafka-sim-record--highlight' : ''}`}
                    title={read ? 'Read by this consumer group' : 'Not yet read by this group'}
                  >
                    <span className="kafka-sim-off">{r.offset}</span>
                    <span className="kafka-sim-key">{r.key ?? '(none)'}</span>
                    <span className="kafka-sim-val">{r.value}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="kafka-sim-consumers">
        <p className="prose kafka-sim-note">
          Group <code>{gid}</code> — each consumer owns a share of partitions.{' '}
          <strong>Poll once</strong> reads the next unread record on its partitions (advances offset).
        </p>
        <div className="kafka-sim-consumer-row">
          {assignments.map((parts, i) => (
            <div key={i} className="kafka-sim-consumer">
              <strong>Consumer {i + 1}</strong>
              <div className="kafka-sim-assign">Partitions: {parts.join(', ') || '—'}</div>
              <div className="kafka-sim-lag">Lag: {lagForPartitions(gid, parts)}</div>
              <button type="button" className="btn btn--small" onClick={() => pollConsumer(i)}>
                Poll once
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="prose kafka-lab-lag">
        Group lag by partition:{' '}
        {groupLag(gid).map((l) => (
          <span key={l.partition}>
            p{l.partition}={l.lag}{' '}
          </span>
        ))}
      </p>

      {lastConsume && lastConsume.records.length > 0 && (
        <div className="kafka-lab-last-consume">
          <h3 className="kafka-lab-subhead">
            Consumer {lastConsume.consumer + 1} polled
          </h3>
          <ul className="prose-list">
            {lastConsume.records.map((m) => (
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

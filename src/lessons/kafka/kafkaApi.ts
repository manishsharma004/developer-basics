/**
 * Browser Kafka client API (kafka-python / KafkaJS shaped) backed by kafkaLabEngine.
 */
import {
  LAB_DEFAULT_GROUP,
  LAB_TOPIC,
  consumeRecords,
  getLabInfo,
  listTopicRecords,
  produceRecord,
  resetKafkaLab,
  subscribeKafkaLab,
  type LabRecord,
} from './kafkaLabEngine.ts'

export { LAB_TOPIC, LAB_DEFAULT_GROUP, getLabInfo, listTopicRecords, resetKafkaLab, subscribeKafkaLab }

export type ConsumerRecord = {
  topic: string
  partition: number
  offset: number
  key: string | null
  value: string
  timestamp: number
}

function toConsumerRecord(topic: string, r: LabRecord): ConsumerRecord {
  return {
    topic,
    partition: r.partition,
    offset: r.offset,
    key: r.key,
    value: r.value,
    timestamp: r.timestamp,
  }
}

/** Minimal producer — `send()` appends to the in-browser log. */
export class KafkaProducer {
  clientId: string

  constructor(config: { client_id?: string } = {}) {
    this.clientId = config.client_id ?? 'browser-producer'
  }

  send(topic: string, value: string, key: string | null = null): ConsumerRecord {
    const rec = produceRecord({
      topic,
      value,
      key: key ?? undefined,
    })
    return toConsumerRecord(topic, rec)
  }

  flush(): void {
    /* no-op; sends are synchronous in the lab */
  }
}

/** Minimal consumer — `poll()` returns the next batch for this group. */
export class KafkaConsumer {
  private groupId: string
  private topic: string

  constructor(config: { group_id: string; topic?: string }) {
    this.groupId = config.group_id
    this.topic = config.topic ?? LAB_TOPIC
  }

  poll(maxRecords = 10, _timeoutMs = 1000): ConsumerRecord[] {
    return consumeRecords({
      groupId: this.groupId,
      topic: this.topic,
      maxMessages: maxRecords,
    }).map((r) => toConsumerRecord(this.topic, r))
  }

  commit(): void {
    /* offsets committed on poll in the lab engine */
  }
}

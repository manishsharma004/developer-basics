import type { PyodideInterface } from 'pyodide'
import { consumeRecords, listTopicRecords, produceRecord, resetKafkaLab } from './kafkaLabEngine.ts'

export function registerKafkaPyodideBridge(pyodide: PyodideInterface) {
  pyodide.registerJsModule('kafka_bridge', {
    produce(topic: string, value: string, key: string | null) {
      const rec = produceRecord({
        topic,
        value,
        key: key ?? undefined,
      })
      return {
        partition: rec.partition,
        offset: rec.offset,
        key: rec.key,
        value: rec.value,
      }
    },
    consume(groupId: string, topic: string, maxRecords: number) {
      return consumeRecords({
        groupId,
        topic,
        maxMessages: maxRecords,
      }).map((r) => ({
        partition: r.partition,
        offset: r.offset,
        key: r.key,
        value: r.value,
      }))
    },
    list(topic: string) {
      return listTopicRecords(topic).map((r) => ({
        partition: r.partition,
        offset: r.offset,
        key: r.key,
        value: r.value,
      }))
    },
    reset() {
      resetKafkaLab()
    },
  })
}

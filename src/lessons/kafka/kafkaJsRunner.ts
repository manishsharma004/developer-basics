import { KafkaConsumer, KafkaProducer, LAB_TOPIC, resetKafkaLab } from './kafkaApi.ts'

export function runKafkaJavaScript(code: string): string {
  const lines: string[] = []
  const fakeConsole = {
    log: (...args: unknown[]) => {
      lines.push(
        args
          .map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
          .join(' '),
      )
    },
  }

  try {
    const runner = new Function(
      'KafkaProducer',
      'KafkaConsumer',
      'LAB_TOPIC',
      'resetKafkaLab',
      'console',
      `"use strict";\n${code}`,
    )
    runner(
      KafkaProducer,
      KafkaConsumer,
      LAB_TOPIC,
      resetKafkaLab,
      fakeConsole,
    )
  } catch (err) {
    const message = err instanceof Error ? err.stack ?? err.message : String(err)
    lines.push(message)
  }

  const text = lines.join('\n').trimEnd()
  return text || '(no output)'
}

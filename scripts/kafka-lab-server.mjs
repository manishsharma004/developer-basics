#!/usr/bin/env bun
/**
 * HTTP API for Kafka labs — all traffic goes through kafkajs to a real broker
 * (Redpanda via Docker, or embedded tiny-kafka fallback).
 */
import { Kafka, logLevel } from 'kafkajs'

const BROKER = process.env.KAFKA_LAB_BROKERS ?? `127.0.0.1:${process.env.KAFKA_LAB_BROKER_PORT ?? 9092}`
const HTTP_PORT = Number(process.env.KAFKA_LAB_HTTP_PORT ?? 9094)
const LAB_TOPIC = 'devbasics.lab.events'
const LAB_GROUP = 'devbasics-lab-group'

/** @type {{ topic: string, partition: number, offset: string, key: string | null, value: string, timestamp?: string }[]} */
const produceJournal = []
let fullProtocol = false

function kafkaClient() {
  return new Kafka({
    clientId: 'developer-basics-lab',
    brokers: [BROKER],
    logLevel: logLevel.ERROR,
    connectionTimeout: 8000,
    requestTimeout: 15000,
  })
}

async function detectCapabilities() {
  const groupId = `lab-probe-${Date.now()}`
  const consumer = kafkaClient().consumer({ groupId })
  try {
    await consumer.connect()
    await consumer.subscribe({ topic: LAB_TOPIC, fromBeginning: true })
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('coordinator timeout')), 2500)
      consumer
        .run({
          eachMessage: async () => {
            clearTimeout(timer)
            resolve()
          },
        })
        .catch(reject)
    })
    fullProtocol = true
  } catch {
    fullProtocol = false
  } finally {
    await consumer.stop().catch(() => {})
    await consumer.disconnect().catch(() => {})
  }
}

async function ensureLabTopic() {
  const admin = kafkaClient().admin()
  await admin.connect()
  const existing = await admin.listTopics()
  if (!existing.includes(LAB_TOPIC)) {
    await admin.createTopics({
      topics: [{ topic: LAB_TOPIC, numPartitions: 3, replicationFactor: 1 }],
    })
  }
  await admin.disconnect()
}

async function produceRecord({ topic, key, value }) {
  await ensureLabTopic()
  const producer = kafkaClient().producer()
  await producer.connect()
  const result = await producer.send({
    topic: topic || LAB_TOPIC,
    messages: [{ key: key ?? null, value: value ?? '' }],
  })
  await producer.disconnect()

  const t = topic || LAB_TOPIC
  for (const rec of result) {
    produceJournal.push({
      topic: t,
      partition: rec.partition,
      offset: String(rec.baseOffset ?? rec.offset ?? produceJournal.length),
      key: key ?? null,
      value: value ?? '',
    })
  }

  return result
}

async function fetchViaConsumer(topic, limit) {
  const groupId = `lab-peek-${Date.now()}`
  const consumer = kafkaClient().consumer({ groupId })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })

  const collected = []
  await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(), 4000)
    consumer
      .run({
        eachMessage: async ({ partition, message }) => {
          collected.push({
            partition,
            offset: message.offset,
            key: message.key?.toString() ?? null,
            value: message.value?.toString() ?? '',
            timestamp: message.timestamp,
          })
          if (collected.length >= limit) {
            clearTimeout(timer)
            resolve()
          }
        },
      })
      .catch(() => resolve())
  })

  await consumer.stop().catch(() => {})
  await consumer.disconnect().catch(() => {})
  return collected.sort((a, b) => Number(a.offset) - Number(b.offset))
}

async function fetchMessages(topic, limit = 40) {
  await ensureLabTopic()
  if (fullProtocol) {
    return fetchViaConsumer(topic, limit)
  }
  return produceJournal
    .filter((m) => m.topic === topic)
    .slice(-limit)
    .map((m) => ({
      partition: m.partition,
      offset: m.offset,
      key: m.key,
      value: m.value,
      timestamp: m.timestamp,
    }))
}

async function consumeWithGroup({ topic, groupId, maxMessages }) {
  await ensureLabTopic()
  const gid = groupId || LAB_GROUP
  if (!fullProtocol) {
    const slice = produceJournal.filter((m) => m.topic === topic).slice(0, maxMessages)
    produceJournal.splice(0, slice.length)
    return slice.map((m) => ({
      partition: m.partition,
      offset: m.offset,
      key: m.key,
      value: m.value,
    }))
  }

  const consumer = kafkaClient().consumer({ groupId: gid })
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: false })

  const collected = []
  await new Promise((resolve) => {
    const timer = setTimeout(() => resolve(), 5000)
    consumer
      .run({
        eachMessage: async ({ partition, message }) => {
          collected.push({
            partition,
            offset: message.offset,
            key: message.key?.toString() ?? null,
            value: message.value?.toString() ?? '',
          })
          if (collected.length >= maxMessages) {
            clearTimeout(timer)
            resolve()
          }
        },
      })
      .catch(() => resolve())
  })

  await consumer.stop().catch(() => {})
  await consumer.disconnect().catch(() => {})
  return collected
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  })
}

async function handleRequest(req) {
  if (req.method === 'OPTIONS') return json({ ok: true })

  const url = new URL(req.url, `http://127.0.0.1:${HTTP_PORT}`)
  const path = url.pathname

  try {
    if (path === '/api/kafka/health' && req.method === 'GET') {
      await ensureLabTopic()
      return json({
        ok: true,
        broker: BROKER,
        defaultTopic: LAB_TOPIC,
        defaultGroup: LAB_GROUP,
        fullProtocol,
        note: fullProtocol
          ? 'Connected to a full Kafka-compatible broker (e.g. Redpanda).'
          : 'Embedded broker: Produce uses the real Kafka protocol; reads use produce acknowledgements until you start Docker Redpanda (`bun run kafka:up`).',
      })
    }

    if (path === '/api/kafka/messages' && req.method === 'GET') {
      const topic = url.searchParams.get('topic') ?? LAB_TOPIC
      const limit = Number(url.searchParams.get('limit') ?? 40)
      const messages = await fetchMessages(topic, limit)
      return json({ topic, messages, fullProtocol })
    }

    if (path === '/api/kafka/produce' && req.method === 'POST') {
      const body = await req.json()
      const topic = body.topic ?? LAB_TOPIC
      await produceRecord({ topic, key: body.key, value: body.value })
      const messages = await fetchMessages(topic, 40)
      return json({ topic, messages, fullProtocol })
    }

    if (path === '/api/kafka/consume' && req.method === 'POST') {
      const body = await req.json()
      const topic = body.topic ?? LAB_TOPIC
      const messages = await consumeWithGroup({
        topic,
        groupId: body.groupId,
        maxMessages: body.maxMessages ?? 5,
      })
      return json({ topic, groupId: body.groupId ?? LAB_GROUP, messages, fullProtocol })
    }

    return json({ error: 'not_found' }, 404)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return json({ ok: false, error: message }, 500)
  }
}

const ready = await waitForBroker()
if (!ready) {
  console.error(`Kafka broker not reachable at ${BROKER}. Run: bun run kafka:broker`)
  process.exit(1)
}

await detectCapabilities()
console.log(`Kafka lab API on http://127.0.0.1:${HTTP_PORT} (broker ${BROKER}, fullProtocol=${fullProtocol})`)

Bun.serve({
  hostname: '127.0.0.1',
  port: HTTP_PORT,
  fetch: handleRequest,
})

async function waitForBroker() {
  const net = await import('node:net')
  const [host, portStr] = BROKER.split(':')
  const port = Number(portStr)
  for (let i = 0; i < 60; i++) {
    try {
      await new Promise((resolve, reject) => {
        const s = net.connect(port, host, () => {
          s.end()
          resolve()
        })
        s.on('error', reject)
      })
      return true
    } catch {
      await Bun.sleep(500)
    }
  }
  return false
}

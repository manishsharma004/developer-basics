#!/usr/bin/env bun
/**
 * Start a real Kafka-protocol broker for local labs.
 * Prefers Docker Compose (Redpanda). Falls back to embedded tiny-kafka.
 */
import { spawn, spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const COMPOSE_FILE = path.join(root, 'compose/kafka-lab.yaml')
const BROKER_PORT = Number(process.env.KAFKA_LAB_BROKER_PORT ?? 9092)
const BROKER_HOST = process.env.KAFKA_LAB_BROKER_HOST ?? '127.0.0.1'

const require = createRequire(import.meta.url)

function hasDocker() {
  const r = spawnSync('docker', ['info'], { stdio: 'ignore' })
  return r.status === 0
}

async function waitForPort(host, port, timeoutMs = 60_000) {
  const net = await import('node:net')
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const socket = net.connect(port, host, () => {
          socket.end()
          resolve()
        })
        socket.on('error', reject)
      })
      return true
    } catch {
      await Bun.sleep(500)
    }
  }
  return false
}

async function startDockerRedpanda() {
  if (!existsSync(COMPOSE_FILE)) throw new Error(`Missing ${COMPOSE_FILE}`)
  console.log('Starting Redpanda via Docker Compose…')
  const up = spawnSync('docker', ['compose', '-f', COMPOSE_FILE, 'up', '-d'], {
    cwd: root,
    stdio: 'inherit',
  })
  if (up.status !== 0) throw new Error('docker compose up failed')
  const ok = await waitForPort(BROKER_HOST, BROKER_PORT)
  if (!ok) throw new Error(`Redpanda did not open ${BROKER_HOST}:${BROKER_PORT} in time`)
  return { kind: 'redpanda', brokers: `${BROKER_HOST}:${BROKER_PORT}` }
}

async function startTinyKafka() {
  const TinyKafkaServer = require('tiny-kafka/src/server')
  const broker = new TinyKafkaServer({ host: BROKER_HOST, port: BROKER_PORT })
  await broker.listen()
  console.log(`Embedded tiny-kafka broker at ${BROKER_HOST}:${BROKER_PORT}`)
  process.on('SIGINT', async () => {
    await broker.close()
    process.exit(0)
  })
  return { kind: 'tiny-kafka', brokers: `${BROKER_HOST}:${BROKER_PORT}`, broker }
}

async function main() {
  if (hasDocker()) {
    try {
      const info = await startDockerRedpanda()
      console.log(JSON.stringify({ ok: true, ...info }))
      return
    } catch (e) {
      console.warn('Docker Redpanda failed, falling back to tiny-kafka:', e.message)
    }
  } else {
    console.log('Docker not available — using embedded tiny-kafka (Produce-focused; use Docker for full Fetch/consumer labs).')
  }

  const info = await startTinyKafka()
  console.log(JSON.stringify({ ok: true, ...info }))
  // Keep process alive for tiny-kafka
  await new Promise(() => {})
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

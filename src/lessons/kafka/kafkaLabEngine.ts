/**
 * In-browser Kafka lab — commit-log semantics for teaching (no TCP broker).
 * Safe for static GitHub Pages deploy; state persists in localStorage.
 */

export const LAB_TOPIC = 'devbasics.lab.events'
export const LAB_DEFAULT_GROUP = 'devbasics-lab-group'
export const LAB_PARTITION_COUNT = 3
const STORAGE_KEY = 'devbasics:kafka-lab:v1'

export type LabRecord = {
  id: string
  partition: number
  offset: number
  key: string | null
  value: string
  timestamp: number
}

type PartitionLog = LabRecord[]

type LabState = {
  partitions: PartitionLog[]
  /** groupId -> partition -> next offset to read */
  groupOffsets: Record<string, Record<number, number>>
}

function emptyState(): LabState {
  return {
    partitions: Array.from({ length: LAB_PARTITION_COUNT }, () => []),
    groupOffsets: {},
  }
}

function loadState(): LabState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as LabState
    if (!Array.isArray(parsed.partitions) || parsed.partitions.length !== LAB_PARTITION_COUNT) {
      return emptyState()
    }
    parsed.groupOffsets ??= {}
    return parsed
  } catch {
    return emptyState()
  }
}

function saveState(state: LabState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode */
  }
}

export function partitionForKey(key: string, partitionCount = LAB_PARTITION_COUNT): number {
  const trimmed = key.trim()
  if (!trimmed) return Math.floor(Math.random() * partitionCount)
  let h = 0
  for (let i = 0; i < trimmed.length; i++) h = (h * 31 + trimmed.charCodeAt(i)) >>> 0
  return h % partitionCount
}

let state = loadState()
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((fn) => fn())
}

export function subscribeKafkaLab(fn: () => void): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function resetKafkaLab() {
  state = emptyState()
  saveState(state)
  notify()
}

export function getLabInfo() {
  return {
    mode: 'in-browser' as const,
    topic: LAB_TOPIC,
    defaultGroup: LAB_DEFAULT_GROUP,
    partitionCount: LAB_PARTITION_COUNT,
    note:
      'Simulated commit log in your browser (IndexedDB/localStorage). Same ideas as Kafka — partitions, offsets, consumer groups — without a network broker.',
  }
}

export function listTopicRecords(topic: string = LAB_TOPIC): LabRecord[] {
  if (topic !== LAB_TOPIC) return []
  const all: LabRecord[] = []
  for (const log of state.partitions) all.push(...log)
  return all.sort((a, b) => a.partition - b.partition || a.offset - b.offset)
}

export function produceRecord(input: {
  key?: string
  value: string
  topic?: string
}): LabRecord {
  const topic = input.topic ?? LAB_TOPIC
  if (topic !== LAB_TOPIC) throw new Error(`Unknown topic: ${topic}`)

  const key = input.key?.trim() ? input.key.trim() : null
  const partition = partitionForKey(key ?? '', LAB_PARTITION_COUNT)
  const log = state.partitions[partition]
  const offset = log.length
  const record: LabRecord = {
    id: `${partition}-${offset}-${Date.now()}`,
    partition,
    offset,
    key,
    value: input.value,
    timestamp: Date.now(),
  }
  log.push(record)
  saveState(state)
  notify()
  return record
}

function groupOffsetTable(groupId: string): Record<number, number> {
  if (!state.groupOffsets[groupId]) {
    state.groupOffsets[groupId] = {}
    for (let p = 0; p < LAB_PARTITION_COUNT; p++) state.groupOffsets[groupId][p] = 0
  }
  return state.groupOffsets[groupId]
}

export function consumeRecords(input: {
  groupId?: string
  topic?: string
  maxMessages?: number
}): LabRecord[] {
  const topic = input.topic ?? LAB_TOPIC
  const groupId = input.groupId?.trim() || LAB_DEFAULT_GROUP
  const max = input.maxMessages ?? 5
  if (topic !== LAB_TOPIC) return []

  const offsets = groupOffsetTable(groupId)
  const batch: LabRecord[] = []

  for (let p = 0; p < LAB_PARTITION_COUNT && batch.length < max; p++) {
    const log = state.partitions[p]
    let pos = offsets[p] ?? 0
    while (pos < log.length && batch.length < max) {
      batch.push(log[pos])
      pos++
    }
    offsets[p] = pos
  }

  saveState(state)
  notify()
  return batch
}

/** Per-partition lag for a consumer group (unread records). */
export function groupLag(groupId: string): { partition: number; lag: number }[] {
  const offsets = groupOffsetTable(groupId)
  return state.partitions.map((log, p) => ({
    partition: p,
    lag: Math.max(0, log.length - (offsets[p] ?? 0)),
  }))
}

/**
 * In-browser Kafka lab — commit-log semantics for teaching (no TCP broker).
 * Safe for static GitHub Pages deploy; state persists in localStorage.
 */

export const LAB_TOPIC = 'devbasics.lab.events'
export const LAB_DEFAULT_GROUP = 'devbasics-lab-group'
export const LAB_PARTITION_MIN = 1
export const LAB_PARTITION_MAX = 6
const STORAGE_KEY = 'devbasics:kafka-lab:v2'

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

function emptyState(partitionCount = 3): LabState {
  const n = clampPartitions(partitionCount)
  return {
    partitions: Array.from({ length: n }, () => []),
    groupOffsets: {},
  }
}

function clampPartitions(n: number) {
  return Math.min(LAB_PARTITION_MAX, Math.max(LAB_PARTITION_MIN, Math.floor(n)))
}

function loadState(): LabState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as LabState
    if (!Array.isArray(parsed.partitions) || parsed.partitions.length < LAB_PARTITION_MIN) {
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

export function getPartitionCount(): number {
  return state.partitions.length
}

export function setPartitionCount(count: number) {
  const n = clampPartitions(count)
  if (n === state.partitions.length) return
  state = emptyState(n)
  saveState(state)
  notify()
}

export function partitionForKey(key: string, partitionCount?: number): number {
  const n = partitionCount ?? state.partitions.length
  const trimmed = key.trim()
  if (!trimmed) return Math.floor(Math.random() * n)
  let h = 0
  for (let i = 0; i < trimmed.length; i++) h = (h * 31 + trimmed.charCodeAt(i)) >>> 0
  return h % n
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

export function resetKafkaLab(partitionCount?: number) {
  state = emptyState(partitionCount ?? state.partitions.length)
  saveState(state)
  notify()
}

export function getLabInfo() {
  return {
    mode: 'in-browser' as const,
    topic: LAB_TOPIC,
    defaultGroup: LAB_DEFAULT_GROUP,
    partitionCount: state.partitions.length,
    note:
      'Simulated commit log in your browser. Partitions hold every record; consumer groups track read progress (offsets).',
  }
}

export function listTopicRecords(topic: string = LAB_TOPIC): LabRecord[] {
  if (topic !== LAB_TOPIC) return []
  const all: LabRecord[] = []
  for (const log of state.partitions) all.push(...log)
  return all.sort((a, b) => a.partition - b.partition || a.offset - b.offset)
}

/** Next offset this group will read on a partition (0 = nothing read yet). */
export function committedOffset(groupId: string, partition: number): number {
  const offsets = groupOffsetTable(groupId)
  return offsets[partition] ?? 0
}

export function produceRecord(input: {
  key?: string
  value: string
  topic?: string
}): LabRecord {
  const topic = input.topic ?? LAB_TOPIC
  if (topic !== LAB_TOPIC) throw new Error(`Unknown topic: ${topic}`)

  const key = input.key?.trim() ? input.key.trim() : null
  const partition = partitionForKey(key ?? '')
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
  const gid = groupId.trim() || LAB_DEFAULT_GROUP
  if (!state.groupOffsets[gid]) {
    state.groupOffsets[gid] = {}
    for (let p = 0; p < state.partitions.length; p++) state.groupOffsets[gid][p] = 0
  }
  return state.groupOffsets[gid]
}

export function consumeRecords(input: {
  groupId?: string
  topic?: string
  maxMessages?: number
  partitionFilter?: number[]
}): LabRecord[] {
  const topic = input.topic ?? LAB_TOPIC
  const groupId = input.groupId?.trim() || LAB_DEFAULT_GROUP
  const max = input.maxMessages ?? 5
  if (topic !== LAB_TOPIC) return []

  const partitions =
    input.partitionFilter?.length
      ? input.partitionFilter
      : state.partitions.map((_, i) => i)

  const offsets = groupOffsetTable(groupId)
  const batch: LabRecord[] = []

  for (const p of partitions) {
    if (batch.length >= max) break
    const log = state.partitions[p]
    if (!log) continue
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

export function assignPartitionsToConsumers(consumerCount: number): number[][] {
  const n = Math.max(1, Math.min(6, consumerCount))
  const out: number[][] = Array.from({ length: n }, () => [])
  for (let p = 0; p < state.partitions.length; p++) {
    out[p % n].push(p)
  }
  return out
}

export function lagForPartitions(groupId: string, partitions: number[]): number {
  const table = groupLag(groupId)
  let sum = 0
  for (const p of partitions) {
    sum += table.find((r) => r.partition === p)?.lag ?? 0
  }
  return sum
}

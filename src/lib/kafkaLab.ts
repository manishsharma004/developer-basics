export type KafkaLabHealth = {
  ok: boolean
  broker: string
  defaultTopic: string
  defaultGroup: string
  fullProtocol: boolean
  note?: string
}

export type KafkaLabMessage = {
  partition: number
  offset: string
  key: string | null
  value: string
  timestamp?: string
}

const API = '/api/kafka'

async function parseJson<T>(res: Response): Promise<T> {
  const data = (await res.json()) as T & { error?: string; ok?: boolean }
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? res.statusText)
  }
  return data
}

export async function kafkaLabHealth(): Promise<KafkaLabHealth> {
  const res = await fetch(`${API}/health`)
  return parseJson(res)
}

export async function kafkaLabProduce(input: {
  key?: string
  value: string
  topic?: string
}): Promise<{ topic: string; messages: KafkaLabMessage[]; fullProtocol: boolean }> {
  const res = await fetch(`${API}/produce`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseJson(res)
}

export async function kafkaLabMessages(topic?: string): Promise<{
  topic: string
  messages: KafkaLabMessage[]
  fullProtocol: boolean
}> {
  const params = new URLSearchParams()
  if (topic) params.set('topic', topic)
  const res = await fetch(`${API}/messages?${params}`)
  return parseJson(res)
}

export async function kafkaLabConsume(input: {
  groupId?: string
  topic?: string
  maxMessages?: number
}): Promise<{ topic: string; groupId: string; messages: KafkaLabMessage[]; fullProtocol: boolean }> {
  const res = await fetch(`${API}/consume`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  })
  return parseJson(res)
}

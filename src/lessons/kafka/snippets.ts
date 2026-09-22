import type { Snippet } from '../components/SnippetRunner.tsx'

export function snippets(label: string): Snippet[] {
  return SNIPPETS.filter((snippet) => snippet.label === label)
}

const SNIPPETS: Snippet[] = [
  {
    label: 'Partition by key',
    code: `def partition_for_key(key: str, n: int) -> int:
    h = 0
    for ch in key:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % n

for key in ["user-1", "user-2", "user-1", "order-9"]:
    print(key, "-> partition", partition_for_key(key, 3))`,
  },
  {
    label: 'Producer acks',
    code: `# Durability vs latency (conceptual)
ACKS = {
    0: "fire-and-forget — fastest, may lose data",
    1: "leader ack — balanced default",
    "all": "all in-sync replicas — strongest durability",
}

for ack, meaning in ACKS.items():
    print(f"acks={ack}: {meaning}")`,
  },
  {
    label: 'Consumer group assignment',
    code: `partitions = list(range(6))
consumers = 3
assign = [[] for _ in range(consumers)]
for p in partitions:
    assign[p % consumers].append(p)

for i, parts in enumerate(assign):
    print(f"consumer-{i}:", parts)`,
  },
]

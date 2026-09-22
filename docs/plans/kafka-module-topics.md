# Kafka module — topic plan

Research sources: [Apache Kafka introduction](https://kafka.apache.org/43/getting-started/introduction/), [Confluent Kafka intro](https://docs.confluent.io/kafka/introduction.html), [Kafka Streams quickstart](https://kafka.apache.org/43/streams/quickstart/), [Kafka Connect pipelines](https://docs.confluent.io/platform/current/streams/connect-streams-pipeline.html).

## Module goal

Give developers a **full mental model** of Kafka as a **distributed commit log / event streaming platform** — not just “another message queue” — and connect concepts to production concerns (ordering, replication, consumer lag, schemas, stream processing).

## Chapter track (13 lessons)

| # | Lesson id | Title | Subsections / depth |
|---|-----------|-------|---------------------|
| 1 | `kafka-event-streaming` | Event streaming platform | Pub/sub vs work queues; durable log vs transient MQ; event vs command; typical use cases (pipelines, CDC, metrics, decoupling); Kafka vs RabbitMQ/SQS at a glance |
| 2 | `kafka-topics-log` | Topics & the commit log | Topic as category; records/events; append-only segments; offsets; retention (`retention.ms` / size); delete vs compact policy preview; multi-producer / multi-subscriber |
| 3 | `kafka-partitions` | Partitions & keys | Sharding a topic; partition = ordered sub-log; key → same partition → per-key ordering; round-robin without key; throughput vs ordering tradeoff |
| 4 | `kafka-producers` | Producers | Client responsibilities; `acks` (0/1/all); batching & linger; compression; headers; idempotent producer (`enable.idempotence`); partitioning APIs |
| 5 | `kafka-consumers` | Consumers & offsets | Poll loop; `subscribe` / `assign`; auto vs manual commit; `read_committed` vs `read_uncommitted`; replay & reset offsets |
| 6 | `kafka-consumer-groups` | Consumer groups | Group id; one consumer per partition per group; static vs dynamic membership; rebalance protocols; `__consumer_offsets`; consumer lag |
| 7 | `kafka-brokers-replication` | Brokers & replication | Cluster, broker id; partition leaders/followers; ISR; min ISR & unclean leader election risk; KRaft vs ZooKeeper (historical note); rack awareness (brief) |
| 8 | `kafka-reliability` | Durability & availability | End-to-end latency vs durability; `min.insync.replicas`; producer `acks=all`; broker disk & fsync; rack/zone placement |
| 9 | `kafka-delivery-semantics` | Delivery guarantees | At-most / at-least / exactly-once; idempotent consumers; transactions (read-process-write); Kafka Streams `exactly_once_v2`; limitations |
| 10 | `kafka-compaction` | Log compaction | Changelog topics; tombstones; keyed retention; relation to Kafka Streams state; when compaction beats time retention |
| 11 | `kafka-serialization` | Serialization & Schema Registry | JSON vs Avro vs Protobuf; schema evolution (backward/forward); Confluent Schema Registry role; subject naming strategies |
| 12 | `kafka-connect` | Kafka Connect | Source vs sink connectors; SMTs; JDBC/Debezium CDC pattern; error handling & DLQ connectors |
| 13 | `kafka-streams` | Stream processing | Kafka Streams vs external processors; KStream vs KTable; state stores; joins & windowing; ksqlDB as SQL layer; stream-table duality |
| 14 | `kafka-operations` | Operations & security | Metrics (lag, under-replicated partitions); quotas; ACLs (SASL/SSL overview); topic design checklist; capacity planning |

## Interactive labs

- **Partition log simulator** (chapters 3, 6): produce keyed events, watch partition assignment and consumer group lag.
- **Producer acks / ISR** (chapter 4/7): toggle acks and replica count — qualitative latency/durability.
- Code snippets: `kafka-console-producer/consumer`, minimal Java/Python producer config (text only).

## Placement in course

New group **Apache Kafka** after **Caching & Queues** — extends the queues chapter without replacing it.

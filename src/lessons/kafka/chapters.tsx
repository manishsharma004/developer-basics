import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, FlowDiagram, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { KafkaPlayground } from './KafkaPlayground.tsx'

const kafkaEventStreaming = createChapterLesson({
  id: 'kafka-event-streaming',
  modelTitle: 'Logs, events & use cases',
  intro: (
    <p className="prose">
      <strong>Apache Kafka</strong> is a distributed <strong>event streaming platform</strong>: producers
      append records to durable <strong>topics</strong>, and many independent consumers read those logs at
      their own pace. Unlike a classic work queue that deletes a message after one worker handles it, Kafka
      keeps an ordered, replayable history — which makes it a strong fit for pipelines, analytics, and
      event-driven architectures.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Kafka is an <strong>append-only commit log</strong> with many readers. Producers and consumers stay
        decoupled in time; you can add consumers later and replay from any offset.
      </Callout>
      <ul className="prose-list">
        <li><strong>Event</strong> — an immutable fact that happened (order placed, sensor reading, audit row).</li>
        <li><strong>Topic</strong> — named log category (like <code>payments</code> or <code>clicks</code>).</li>
        <li><strong>Broker cluster</strong> — Kafka servers that persist and replicate partitions.</li>
        <li><strong>Stream processing</strong> — derive new topics with Kafka Streams, ksqlDB, or Flink.</li>
      </ul>
      <FlowDiagram code={`Services -->|produce| Kafka topics -->|consume| Apps
                         |                    |
                         +---- Connect -------+----> warehouses / DBs`} />
    </>
  ),
  extraSections: [
    {
      id: 'compare',
      title: 'Kafka vs message queues',
      content: (
        <>
          <p className="prose">
            RabbitMQ, Amazon SQS, and similar systems excel at <strong>task queues</strong> and{' '}
            <strong>competing consumers</strong> where each message should be handled once and removed.
            Kafka optimizes for <strong>high-throughput logs</strong> retained for days or years, with many
            subscribers reading the same data (metrics, audit, ML features, CDC).
          </p>
          <ul className="prose-list">
            <li><strong>Retention</strong> — Kafka time/size policies; MQs often delete after ack.</li>
            <li><strong>Replay</strong> — reset offsets to reprocess history; rare in classic MQ.</li>
            <li><strong>Ordering</strong> — per-partition ordering in Kafka; global order only with one partition.</li>
            <li><strong>Push vs pull</strong> — consumers poll Kafka; backpressure is consumer-driven.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'cases',
      title: 'Where teams use Kafka',
      content: (
        <ul className="prose-list">
          <li><strong>Activity tracking</strong> — clickstreams, product analytics, funnel metrics.</li>
          <li><strong>Operational pipelines</strong> — microservice integration without synchronous chains.</li>
          <li><strong>Change data capture (CDC)</strong> — database changelogs into Kafka via Debezium/Connect.</li>
          <li><strong>Stream processing</strong> — aggregates, joins, fraud detection in near real time.</li>
          <li><strong>Event sourcing / CQRS</strong> — system of record as an ordered event log.</li>
          <li><strong>Log aggregation</strong> — centralized application and infra logs (often with compaction).</li>
        </ul>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Why the log abstraction scales">
      <p className="prose">
        Sequential disk writes and partitioned parallelism let Kafka hold terabytes while serving many readers.
        Consumer groups scale read throughput; replication tolerates broker loss. The hard parts move to{' '}
        <strong>schema design</strong>, <strong>key choice</strong>, and <strong>operational monitoring</strong> — not
        wiring services point-to-point.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'event streaming', def: 'Processing and storing streams of events in real time with replay.' },
    { term: 'topic', def: 'Named category for records; implemented as a partitioned log.' },
    { term: 'broker', def: 'Kafka server that stores partition replicas.' },
    { term: 'offset', def: 'Monotonic position of a record within a partition.' },
  ],
  quiz: [
    {
      q: 'Kafka is best described as:',
      options: ['A relational database', 'A distributed commit log / event streaming platform', 'A DNS server', 'A CSS framework'],
      answer: 1,
    },
    {
      q: 'Compared to a classic work queue, Kafka typically:',
      options: ['Deletes messages immediately after one consumer reads them', 'Retains messages for a configurable period for replay', 'Only allows one consumer total', 'Cannot scale horizontally'],
      answer: 1,
    },
    {
      q: 'Decoupling in Kafka means:',
      options: ['Producers block until consumers finish', 'Producers and consumers evolve independently via the log', 'Consumers push data to producers', 'Topics are encrypted by default'],
      answer: 1,
    },
  ],
  recap: [
    <>Kafka is a <strong>durable, replayable log</strong>, not just a transient mailbox.</>,
    <>Use it when many systems need the <strong>same stream of facts</strong> over time.</>,
    <>Pair it with Connect and Streams for ingestion and transformation.</>,
  ],
})

const kafkaTopicsLog = createChapterLesson({
  id: 'kafka-topics-log',
  modelTitle: 'Topic anatomy',
  intro: (
    <p className="prose">
      A <strong>topic</strong> is Kafka&apos;s unit of organization — like a folder of immutable files. Each
      record has a <strong>key</strong>, <strong>value</strong>, <strong>timestamp</strong>, and optional{' '}
      <strong>headers</strong>. Records are appended; they are not updated in place.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Append-only</strong> — new data goes at the end of each partition log.</li>
        <li><strong>Offset</strong> — 0-based index within a partition; consumers track progress with offsets.</li>
        <li><strong>Segments</strong> — logs are stored as segment files on disk for efficient retention.</li>
        <li><strong>Multi-subscriber</strong> — many consumer groups read the same topic independently.</li>
      </ul>
      <CodePreview
        code={`# CLI peek (local dev)
kafka-console-producer --topic orders --bootstrap-server localhost:9092
kafka-console-consumer --topic orders --from-beginning --bootstrap-server localhost:9092`}
      />
    </>
  ),
  extraSections: [
    {
      id: 'retention',
      title: 'Retention & cleanup',
      content: (
        <>
          <p className="prose">
            Per-topic policies decide how long data remains. <code>retention.ms</code> and{' '}
            <code>retention.bytes</code> drop old segments. <strong>Delete</strong> policy removes data by time/size;{' '}
            <strong>compact</strong> policy keeps the latest record per key (covered in the compaction chapter).
          </p>
          <Callout kind="note">
            Long retention is normal — Kafka throughput stays roughly constant as data grows, until disks fill.
            Plan capacity and tiered storage if you keep months of history.
          </Callout>
        </>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Immutability enables caching and replication">
      <p className="prose">
        Because records never change, followers can replicate by tailing the leader log, and consumers can
        reread without corrupting shared state. Mutations belong in <em>new</em> events (or compacted keys), not
        in-place edits.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'record', def: 'A single key-value event with metadata in a partition log.' },
    { term: 'segment', def: 'On-disk chunk of a partition log rotated by size or time.' },
    { term: 'retention', def: 'Policy controlling how long records are kept before deletion or compaction.' },
  ],
  quiz: [
    { q: 'Records in a Kafka partition are:', options: ['Updated in place', 'Append-only and immutable', 'Deleted on first read', 'Stored only in RAM'], answer: 1 },
    { q: 'An offset identifies:', options: ['A broker hostname', 'Position of a record within one partition', 'TLS cipher suite', 'Consumer group name'], answer: 1 },
    { q: 'Multiple consumer groups on one topic:', options: ['Are forbidden', 'Each read independently at their own offsets', 'Share one offset cursor', 'Must have the same name'], answer: 1 },
  ],
  recap: [
    <>Topics are <strong>partitioned logs</strong> with per-partition offsets.</>,
    <>Retention is a <strong>product decision</strong> — replay vs disk cost.</>,
    <>Immutability simplifies replication and reprocessing.</>,
  ],
})

const kafkaPartitions = createChapterLesson({
  id: 'kafka-partitions',
  modelTitle: 'Sharding & ordering',
  intro: (
    <p className="prose">
      One machine cannot hold every event forever at web scale. Kafka <strong>shards</strong> a topic into{' '}
      <strong>partitions</strong> — each an ordered sub-log on a broker. More partitions mean more parallel
      writers and readers, but only <strong>per-partition</strong> ordering is guaranteed.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>With key</strong> — default partitioner hashes the key so all events for <code>user-42</code> land on the same partition (ordered per user).</li>
        <li><strong>Without key</strong> — round-robin or sticky batching spreads load; no key-based ordering.</li>
        <li><strong>Manual partition</strong> — producer chooses partition explicitly for advanced control.</li>
        <li><strong>Hot partitions</strong> — skewed keys can bottleneck one partition; monitor per-partition bytes in.</li>
      </ul>
      <FlowDiagram code={`Topic "rides"
  P0: [u1][u4][u7]   broker-a
  P1: [u2][u5]       broker-b
  P2: [u3][u6]       broker-c`} />
    </>
  ),
  playground: (
    <>
      <KafkaPlayground />
      <TryThis>
        Produce from the buttons or from the <strong>Code lab</strong> (Python/JS), then consume with a group id and watch{' '}
        <strong>lag</strong> drop. Same topic for UI and your code.
      </TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Ordering vs parallelism">
      <p className="prose">
        Need global order? Use one partition (limits throughput). Need scale? Use many partitions and design keys
        so related events share a partition. Cross-partition ordering is undefined — plan for that in consumers.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'partition', def: 'Ordered, immutable sub-log of a topic; unit of parallelism.' },
    { term: 'record key', def: 'Optional; routes related events to the same partition.' },
    { term: 'hot partition', def: 'Partition receiving disproportionate traffic due to key skew.' },
  ],
  quiz: [
    { q: 'Ordering in Kafka is guaranteed:', options: ['Globally across the topic', 'Only within a single partition', 'Never', 'Only for compacted topics'], answer: 1 },
    { q: 'Same key on every record typically means:', options: ['Random partitions', 'Same partition for that key', 'No replication', 'Automatic deletion'], answer: 1 },
    { q: 'More partitions generally enable:', options: ['Less parallelism', 'Higher parallel read/write throughput', 'Stronger global ordering', 'Smaller disks only'], answer: 1 },
  ],
  recap: [
    <>Partitions are the <strong>unit of scale</strong> and <strong>unit of ordering</strong>.</>,
    <>Pick keys to keep related events <strong>ordered together</strong>.</>,
    <>Watch for <strong>hot partitions</strong> when keys skew.</>,
  ],
})

const kafkaProducers = createChapterLesson({
  id: 'kafka-producers',
  modelTitle: 'Writing events',
  intro: (
    <p className="prose">
      <strong>Producers</strong> are client applications that publish records. They choose topic, optional key,
      partition, and serialization format. Producer settings trade <strong>latency</strong>,{' '}
      <strong>throughput</strong>, and <strong>durability</strong>.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>acks=0</strong> — fire-and-forget; fastest, can lose data on broker crash.</li>
        <li><strong>acks=1</strong> — leader acknowledges; followers may lag briefly.</li>
        <li><strong>acks=all</strong> — wait for all in-sync replicas; strongest with <code>min.insync.replicas</code>.</li>
        <li><strong>Batching</strong> — <code>linger.ms</code> and <code>batch.size</code> improve throughput at slight latency cost.</li>
        <li><strong>Compression</strong> — lz4, zstd, gzip reduce network/disk; CPU tradeoff.</li>
        <li><strong>Idempotent producer</strong> — deduplicates retries per producer id + sequence (per partition).</li>
      </ul>
    </>
  ),
  extraSections: [
    {
      id: 'config',
      title: 'Important producer settings',
      content: (
        <CodePreview
          code={`# Conceptual producer properties
bootstrap.servers=broker1:9092,broker2:9092
acks=all
enable.idempotence=true
compression.type=lz4
linger.ms=5
max.in.flight.requests.per.connection=5  # keep ≤5 with idempotence`}
        />
      ),
    },
  ],
  playground: <KafkaPlayground />,
  hood: (
    <UnderTheHood title="Retries and ordering">
      <p className="prose">
        Retries without idempotence can create duplicates (at-least-once). Idempotent producers fix duplicate
        sequence numbers but do not replace consumer idempotency for end-to-end exactly-once. Transactions cover
        atomic write to multiple partitions.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'acks', def: 'How many replicas must acknowledge before the producer considers a write successful.' },
    { term: 'linger.ms', def: 'Wait time to batch more records before sending a request.' },
    { term: 'idempotent producer', def: 'Broker-side dedup of producer retries using PID and sequence numbers.' },
  ],
  quiz: [
    { q: 'acks=all is strongest when combined with:', options: ['acks=0', 'min.insync.replicas ≥ 2', 'No replication', 'Deleting topics'], answer: 1 },
    { q: 'Idempotent producer mainly prevents:', options: ['Consumer lag', 'Duplicate records from producer retries', 'Network partitions forever', 'Schema drift'], answer: 1 },
    { q: 'Compression on the producer reduces:', options: ['CPU only', 'Network and disk usage', 'Partition count', 'Consumer groups'], answer: 1 },
  ],
  recap: [
    <>Tune <strong>acks</strong> and <strong>min ISR</strong> for your durability SLA.</>,
    <>Batch and compress for <strong>throughput</strong>.</>,
    <>Enable <strong>idempotence</strong> when retries matter.</>,
  ],
})

const kafkaConsumers = createChapterLesson({
  id: 'kafka-consumers',
  modelTitle: 'Reading the log',
  playground: <KafkaPlayground />,
  intro: (
    <p className="prose">
      <strong>Consumers</strong> poll brokers for records, deserialize values, and commit offsets when work is
      done. Because the log remains, you can <strong>rewind</strong> or <strong>reprocess</strong> — powerful for
      fixes and new features, dangerous without idempotent handlers.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>poll()</strong> — heartbeats and fetches records; must be called regularly in the loop.</li>
        <li><strong>subscribe vs assign</strong> — dynamic group membership vs fixed partition assignment.</li>
        <li><strong>isolation.level</strong> — <code>read_committed</code> hides aborted transactional writes.</li>
        <li><strong>Deserializer</strong> — must match producer format (String, Avro, JSON, etc.).</li>
      </ul>
    </>
  ),
  extraSections: [
    {
      id: 'commits',
      title: 'Commit strategies',
      content: (
        <ul className="prose-list">
          <li><strong>Auto commit</strong> — simple; can ack before side effects finish (risk on crash).</li>
          <li><strong>Sync commit</strong> — after processing; slower, clearer failure modes.</li>
          <li><strong>Async commit</strong> — higher throughput; handle commit failures explicitly.</li>
          <li><strong>Store offsets in DB</strong> — tie offset to business transaction for stronger guarantees.</li>
        </ul>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Why poll loop discipline matters">
      <p className="prose">
        Long processing without pausing polls can miss heartbeats and trigger rebalance storms. Use pause/resume,
        decouple processing with worker threads, or scale consumers/partitions.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'poll', def: 'Consumer API call that fetches records and sends heartbeats.' },
    { term: 'offset commit', def: 'Persisting how far a consumer has read in each partition.' },
    { term: 'read_committed', def: 'Consumer isolation that skips uncommitted transactional records.' },
  ],
  quiz: [
    { q: 'After a consumer commits an offset, a restart typically:', options: ['Loses all data', 'Resumes after the committed position', 'Deletes the topic', 'Changes partition count'], answer: 1 },
    { q: 'read_committed is used with:', options: ['Transactional producers', 'DNS only', 'CSS themes', 'Git hooks'], answer: 0 },
    { q: 'Reprocessing old events is possible because:', options: ['Kafka deletes on read', 'The log is retained and offsets are movable', 'Consumers push to producers', 'Topics are RAM-only'], answer: 1 },
  ],
  recap: [
    <>Consumers are <strong>pull-based</strong> and track <strong>offsets</strong>.</>,
    <>Choose commit timing to match <strong>failure tolerance</strong>.</>,
    <>Replay requires <strong>idempotent</strong> handlers.</>,
  ],
})

const kafkaConsumerGroups = createChapterLesson({
  id: 'kafka-consumer-groups',
  modelTitle: 'Group mechanics',
  intro: (
    <p className="prose">
      A <strong>consumer group</strong> is a set of consumers sharing one <code>group.id</code>. Kafka assigns
      each partition to at most <strong>one</strong> consumer in the group so messages are not duplicated within
      the group — while other groups can read the same topic independently.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Coordinator broker</strong> — manages membership and partition assignment for the group.</li>
        <li><strong>Rebalance</strong> — triggered when consumers join, leave, or miss heartbeats.</li>
        <li><strong>__consumer_offsets</strong> — internal compacted topic storing committed offsets.</li>
        <li><strong>Consumer lag</strong> — difference between log end offset and committed offset (per partition).</li>
      </ul>
      <Callout kind="note">
        Max consumers in a group ≈ partition count for full parallelism. Extra consumers sit idle.
      </Callout>
    </>
  ),
  playground: <KafkaPlayground />,
  hood: (
    <UnderTheHood title="Rebalance cost">
      <p className="prose">
        During rebalance, consumption stops briefly — painful for latency-sensitive jobs. Static membership,
        cooperative sticky assignors, and right-sized sessions reduce churn. Design partition count with expected
        consumer scale in mind.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'consumer group', def: 'Consumers cooperating to read a topic; partitions split among members.' },
    { term: 'rebalance', def: 'Redistribution of partitions when group membership changes.' },
    { term: 'consumer lag', def: 'How far behind a consumer is vs the log end.' },
  ],
  quiz: [
    { q: 'Two consumers in the same group reading one partition:', options: ['Both get every message', 'Only one is active for that partition', 'Kafka duplicates to both', 'Topic is deleted'], answer: 1 },
    { q: 'Consumer lag measures:', options: ['CPU temperature', 'How behind processing is vs newest records', 'TLS version', 'Git branch age'], answer: 1 },
    { q: 'Offsets for groups are stored in:', options: ['Random files', 'The internal __consumer_offsets topic', 'DNS TXT records', 'Browser localStorage'], answer: 1 },
  ],
  recap: [
    <>Groups <strong>divide partitions</strong> for scale without duplicate work in-group.</>,
    <>Monitor <strong>lag</strong> and rebalance frequency.</>,
    <>Match <strong>partition count</strong> to expected consumer parallelism.</>,
  ],
})

const kafkaBrokersReplication = createChapterLesson({
  id: 'kafka-brokers-replication',
  modelTitle: 'Cluster layout',
  intro: (
    <p className="prose">
      A Kafka <strong>cluster</strong> is multiple <strong>brokers</strong>. Each partition has one{' '}
      <strong>leader</strong> handling reads/writes and <strong>followers</strong> replicating data for fault
      tolerance. Replication factor (RF) is chosen per topic.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>ISR (in-sync replicas)</strong> — followers caught up enough to be eligible leaders.</li>
        <li><strong>Leader election</strong> — if leader dies, a broker from ISR becomes leader.</li>
        <li><strong>Unclean election</strong> — allowing non-ISR leaders risks data loss; usually disabled in prod.</li>
        <li><strong>Controller</strong> — broker responsible for administrative actions (leader changes, etc.).</li>
      </ul>
      <FlowDiagram code={`Partition P (RF=3)
  Leader: broker-1  <-- producers / consumers
  Follower: broker-2
  Follower: broker-3`} />
    </>
  ),
  extraSections: [
    {
      id: 'kraft',
      title: 'KRaft metadata quorum',
      content: (
        <p className="prose">
          Modern Kafka uses <strong>KRaft</strong> (Kafka Raft) for cluster metadata instead of ZooKeeper: a small
          quorum of controller nodes stores topic/broker state. Operators still manage brokers, topics, and ACLs —
          but one less external dependency to run.
        </p>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Rack awareness">
      <p className="prose">
        <code>broker.rack</code> lets Kafka spread replicas across racks or availability zones so a single
        failure domain does not wipe all copies of a partition.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'replication factor', def: 'Number of replicas (leader + followers) per partition.' },
    { term: 'ISR', def: 'Replicas sufficiently caught up to participate in leader election safely.' },
    { term: 'KRaft', def: 'Built-in Raft-based metadata quorum replacing ZooKeeper.' },
  ],
  quiz: [
    { q: 'All produce/consume requests for a partition go to:', options: ['Any random broker', 'The current leader replica', 'ZooKeeper', 'Consumers only'], answer: 1 },
    { q: 'ISR stands for:', options: ['Internet Service Router', 'In-sync replicas', 'Inline Schema Registry', 'Integrated Stream Router'], answer: 1 },
    { q: 'Higher replication factor generally:', options: ['Reduces durability', 'Increases fault tolerance and disk use', 'Removes partitions', 'Disables consumers'], answer: 1 },
  ],
  recap: [
    <>Leaders serve traffic; <strong>followers replicate</strong>.</>,
    <>Protect data with <strong>ISR</strong> and careful leader election policy.</>,
    <>Plan <strong>rack/zone</strong> placement for replicas.</>,
  ],
})

const kafkaReliability = createChapterLesson({
  id: 'kafka-reliability',
  modelTitle: 'Replication guarantees',
  intro: (
    <p className="prose">
      Durability is a <strong>system property</strong>: producer acks, replication factor, broker storage,
      and consumer commits must align. There is no free lunch — stronger guarantees add latency and operational
      rigor.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><code>min.insync.replicas</code> — minimum replicas that must acknowledge for <code>acks=all</code> to succeed.</li>
        <li><code>unclean.leader.election.enable=false</code> — avoid promoting out-of-sync replicas.</li>
        <li><strong>Disk & fsync</strong> — OS page cache absorbs writes; monitor disk latency and free space.</li>
        <li><strong>Producer retries</strong> — improve availability; pair with idempotence to limit duplicates.</li>
      </ul>
    </>
  ),
  hood: (
    <UnderTheHood title="End-to-end durability">
      <p className="prose">
        Even with <code>acks=all</code>, a consumer that commits before finishing work can lose messages on crash.
        Align offset commits with side effects (database writes, payments) for true end-to-end safety.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'min.insync.replicas', def: 'Broker setting enforcing minimum live replicas for a write.' },
    { term: 'durability', def: 'Surviving broker or producer failures without losing acknowledged data.' },
  ],
  quiz: [
    { q: 'acks=all fails if:', options: ['Too many consumers', 'Not enough replicas are in-sync', 'Topic name is long', 'Compression is on'], answer: 1 },
    { q: 'Unclean leader election can cause:', options: ['Faster GPUs', 'Data loss from promoting lagging replicas', 'More partitions automatically', 'Free TLS'], answer: 1 },
  ],
  recap: [
    <>Tune <strong>RF + min ISR + acks</strong> together.</>,
    <>Durability spans <strong>broker, producer, and consumer</strong>.</>,
  ],
})

const kafkaDeliverySemantics = createChapterLesson({
  id: 'kafka-delivery-semantics',
  modelTitle: 'End-to-end guarantees',
  intro: (
    <p className="prose">
      Messaging systems are described by <strong>delivery semantics</strong>: whether messages can be lost,
      duplicated, or processed exactly once from source to sink.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>At-most-once</strong> — commit offset before processing; loss possible, no duplicates.</li>
        <li><strong>At-least-once</strong> — process then commit; duplicates on retry unless idempotent.</li>
        <li><strong>Exactly-once</strong> — Kafka transactions + idempotent producer + read_committed consumers (bounded scope).</li>
      </ul>
      <Callout kind="why">
        Exactly-once in Kafka means <strong>no duplicate effect within the transactional guarantees</strong> — your
        business logic still needs deterministic, idempotent side effects for external systems.
      </Callout>
    </>
  ),
  extraSections: [
    {
      id: 'eos',
      title: 'Exactly-once in practice',
      content: (
        <ul className="prose-list">
          <li><strong>Transactional producer</strong> — atomic writes across multiple partitions.</li>
          <li><strong>Kafka Streams</strong> — <code>processing.guarantee=exactly_once_v2</code>.</li>
          <li><strong>ksqlDB</strong> — similar EOS settings for stream queries.</li>
          <li><strong>External DB</strong> — use outbox pattern or idempotent upserts; EOS stops at the cluster boundary.</li>
        </ul>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Idempotent consumers">
      <p className="prose">
        Store processed event ids, use natural keys in upserts, or rely on compacted state. Payment systems often
        choose at-least-once plus strong idempotency keys rather than full Kafka transactions.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'at-least-once', def: 'Messages may be redelivered; consumers must tolerate duplicates.' },
    { term: 'exactly-once semantics', def: 'Framework-level avoidance of duplicate writes within Kafka processing.' },
    { term: 'idempotent consumer', def: 'Processing the same record twice has the same effect as once.' },
  ],
  quiz: [
    { q: 'At-least-once delivery usually requires:', options: ['No offsets', 'Idempotent or deduplicating consumers', 'One partition only', 'No producers'], answer: 1 },
    { q: 'read_committed consumers pair with:', options: ['Transactional producers', 'HTTP caching', 'CSS grid', 'Git rebase'], answer: 0 },
  ],
  recap: [
    <>Pick semantics deliberately — <strong>duplicates are normal</strong> unless you invest in EOS.</>,
    <>EOS in Kafka does not magically fix <strong>external side effects</strong>.</>,
  ],
})

const kafkaCompaction = createChapterLesson({
  id: 'kafka-compaction',
  modelTitle: 'Compaction model',
  intro: (
    <p className="prose">
      <strong>Log compaction</strong> retains the <em>latest</em> record per key and drops older versions — turning
      a topic into a <strong>changelog</strong> of current state rather than full history.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><code>cleanup.policy=compact</code> (often plus delete for tombstone cleanup timing).</li>
        <li><strong>Tombstone</strong> — record with null value deletes a key after compaction runs.</li>
        <li><strong>Use cases</strong> — config snapshots, KV stores, Kafka Streams state changelog topics.</li>
        <li><strong>Not for</strong> unkeyed clickstreams where every event matters historically.</li>
      </ul>
    </>
  ),
  hood: (
    <UnderTheHood title="Compaction vs retention">
      <p className="prose">
        Compaction reclaims disk by key; time retention still applies for delete policy topics. Many deployments
        use compacted topics for metadata and delete policy for high-volume telemetry.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'compacted topic', def: 'Topic keeping latest value per key via log compaction.' },
    { term: 'tombstone', def: 'Null-valued record marking key deletion for compaction.' },
    { term: 'changelog', def: 'Stream of updates that can rebuild state by replay.' },
  ],
  quiz: [
    { q: 'Compaction is ideal when:', options: ['Every event must be kept forever', 'You need latest state per key', 'Topics have no keys', 'Consumers are forbidden'], answer: 1 },
    { q: 'A tombstone record has:', options: ['Null value to mark key deletion', 'Maximum size only', 'No key', 'Two leaders'], answer: 0 },
  ],
  recap: [
    <>Compaction builds <strong>keyed snapshots</strong> from the log.</>,
    <>Pair with <strong>Streams state</strong> and config use cases.</>,
  ],
})

const kafkaSerialization = createChapterLesson({
  id: 'kafka-serialization',
  modelTitle: 'Contracts on the wire',
  intro: (
    <p className="prose">
      Kafka moves bytes; applications agree on <strong>serialization</strong>. JSON is easy but weak on evolution;
      <strong>Avro</strong> and <strong>Protobuf</strong> shine with explicit schemas and compact payloads.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Confluent Schema Registry</strong> — central store for Avro/Protobuf/JSON schemas with version history.</li>
        <li><strong>Wire format</strong> — often magic byte + schema id + payload for registry-integrated serializers.</li>
        <li><strong>Subject naming</strong> — per topic-value vs record strategies affect compatibility checks.</li>
        <li><strong>ksqlDB / Connect</strong> — expect compatible schemas for Avro-based pipelines.</li>
      </ul>
    </>
  ),
  extraSections: [
    {
      id: 'evolution',
      title: 'Schema evolution',
      content: (
        <ul className="prose-list">
          <li><strong>Backward compatible</strong> — new consumers read old data (add optional fields).</li>
          <li><strong>Forward compatible</strong> — old consumers read new data (rarely relied on alone).</li>
          <li><strong>Breaking change</strong> — removing required fields or changing types; needs new topic or migration.</li>
        </ul>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Schema governance">
      <p className="prose">
        Treat schemas like API contracts: review in CI, forbid incompatible changes on hot topics, and document
        ownership per subject.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'Schema Registry', def: 'Service storing versioned schemas for Kafka serializers.' },
    { term: 'Avro', def: 'Row-oriented format with embedded schema evolution rules.' },
    { term: 'backward compatibility', def: 'New schema can read data written with older schema.' },
  ],
  quiz: [
    { q: 'Schema Registry helps with:', options: ['CSS theming', 'Compatible evolution of event formats', 'DNS TTL', 'Git merges'], answer: 1 },
    { q: 'Adding an optional field is usually:', options: ['Always breaking', 'Backward compatible', 'Forbidden', 'A tombstone'], answer: 1 },
  ],
  recap: [
    <>Pick a format with <strong>evolution rules</strong>, not ad-hoc JSON forever.</>,
    <>Registry integrates with <strong>Connect, Streams, and ksqlDB</strong>.</>,
  ],
})

const kafkaConnect = createChapterLesson({
  id: 'kafka-connect',
  modelTitle: 'Connect architecture',
  intro: (
    <p className="prose">
      <strong>Kafka Connect</strong> is a framework for streaming data between Kafka and external systems using{' '}
      <strong>connectors</strong> — JDBC databases, object storage, search indexes, SaaS APIs — without rewriting
      bespoke producers for each sink.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Source connector</strong> — ingests external data into Kafka topics.</li>
        <li><strong>Sink connector</strong> — exports Kafka topics to external systems.</li>
        <li><strong>Workers</strong> — JVM processes running connector tasks (scale tasks for parallelism).</li>
        <li><strong>SMTs</strong> — single message transforms (rename fields, route topics) inline.</li>
        <li><strong>CDC</strong> — Debezium reads DB transaction logs into change events.</li>
      </ul>
      <FlowDiagram code={`Postgres --Debezium source--> Kafka topic --Jdbc sink--> Warehouse`} />
    </>
  ),
  hood: (
    <UnderTheHood title="Errors and DLQ">
      <p className="prose">
        Connectors should route poison pills to dead-letter topics or quarantine tables. Monitor task failures and
        lag per connector — a stuck JDBC poll stalls the whole pipeline.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'connector', def: 'Plugin implementing source or sink integration for Connect.' },
    { term: 'SMT', def: 'Lightweight per-record transform in the Connect pipeline.' },
    { term: 'CDC', def: 'Capture database changes as a stream of events.' },
  ],
  quiz: [
    { q: 'A source connector:', options: ['Writes Kafka to S3 only', 'Brings external data into Kafka', 'Replaces brokers', 'Deletes topics'], answer: 1 },
    { q: 'Debezium is commonly used for:', options: ['CSS layout', 'Database CDC into Kafka', 'TLS certificates', 'Unit tests'], answer: 1 },
  ],
  recap: [
    <>Connect standardizes <strong>ingress/egress</strong> to Kafka.</>,
    <>Combine with <strong>Schema Registry</strong> for typed Avro pipelines.</>,
  ],
})

const kafkaStreams = createChapterLesson({
  id: 'kafka-streams',
  modelTitle: 'Stream processing',
  intro: (
    <p className="prose">
      <strong>Kafka Streams</strong> is a Java library (and ecosystem) for stateful processing of topics: map,
      filter, aggregate, join, and window — with local <strong>state stores</strong> backed by changelog topics.
      <strong>ksqlDB</strong> exposes similar ideas through SQL.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>KStream</strong> — stream of events (inserts).</li>
        <li><strong>KTable</strong> — changelog stream interpreted as a table (upserts).</li>
        <li><strong>Windowing</strong> — tumbling, hopping, session windows for time-bound aggregates.</li>
        <li><strong>Joins</strong> — stream-stream, stream-table; require co-partitioning for many join types.</li>
        <li><strong>exactly_once_v2</strong> — transactional processing guarantee within Streams apps.</li>
      </ul>
    </>
  ),
  extraSections: [
    {
      id: 'duality',
      title: 'Stream–table duality',
      content: (
        <p className="prose">
          Every table change can be emitted as a stream; replaying a changelog stream rebuilds the table. WordCount
          in the official quickstart emits updated counts as a stream of updates — classic illustration of table
          state driving downstream events.
        </p>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Stateful tasks">
      <p className="prose">
        Stream threads own partition tasks with embedded RocksDB state. Rebalances migrate state — expensive if
        stores are huge. Size partitions and commit intervals for recovery time targets.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'KStream', def: 'Unbounded sequence of event records for map/filter/aggregate operations.' },
    { term: 'KTable', def: 'Materialized view / table derived from a changelog topic.' },
    { term: 'state store', def: 'Local durable store backing aggregations and joins.' },
  ],
  quiz: [
    { q: 'KTable represents:', options: ['Only HTTP routes', 'Changelog-as-table semantics', 'DNS zones', 'Docker layers'], answer: 1 },
    { q: 'Kafka Streams apps are:', options: ['Only SQL', 'JVM applications consuming/producing Kafka topics', 'Browser-only', 'Git hooks'], answer: 1 },
  ],
  recap: [
    <>Model computation as <strong>topologies</strong> over streams and tables.</>,
    <>Understand <strong>changelog + state stores</strong> for recovery.</>,
    <>Use <strong>ksqlDB</strong> when SQL fits your team skills.</>,
  ],
})

const kafkaOperations = createChapterLesson({
  id: 'kafka-operations',
  modelTitle: 'Running Kafka in production',
  intro: (
    <p className="prose">
      Operating Kafka means watching <strong>lag</strong>, <strong>disk</strong>, and <strong>leader balance</strong>,
      plus securing the cluster and designing topics so teams do not paint themselves into corners.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Metrics</strong> — under-replicated partitions, offline replicas, request latency, consumer lag.</li>
        <li><strong>Quotas</strong> — throttle misbehaving clients (produce/fetch byte rates).</li>
        <li><strong>Security</strong> — TLS encryption, SASL (SCRAM, OAuth), ACLs on topics and groups.</li>
        <li><strong>Upgrades</strong> — rolling broker upgrades; watch inter-broker protocol versions.</li>
      </ul>
    </>
  ),
  extraSections: [
    {
      id: 'checklist',
      title: 'Topic design checklist',
      content: (
        <ul className="prose-list">
          <li>Name by domain event (<code>billing.invoice.v1</code>) not by team alone.</li>
          <li>Choose partition count up front — hard to change without rekeying.</li>
          <li>Set retention/compaction policy per use case.</li>
          <li>Document key schema, compatibility mode, and owning team.</li>
          <li>Alert on lag, disk usage, and ISR shrink events.</li>
        </ul>
      ),
    },
  ],
  hood: (
    <UnderTheHood title="Managed vs self-hosted">
      <p className="prose">
        Confluent Cloud, Amazon MSK, Redpanda Cloud, and others offload broker patching and sizing. You still own
        topic design, schemas, consumer correctness, and cost of egress/retention.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'consumer lag', def: 'Operational signal that processing cannot keep up with production.' },
    { term: 'ACL', def: 'Kafka access control entry restricting clients to topics/groups.' },
    { term: 'under-replicated partition', def: 'Partition whose ISR count is below replication factor.' },
  ],
  quiz: [
    { q: 'Rising consumer lag usually means:', options: ['Consumers are faster than producers', 'Processing cannot keep up or consumers are down', 'Topic was deleted', 'TLS expired only'], answer: 1 },
    { q: 'ACLs in Kafka control:', options: ['CSS colors', 'Which principals can read/write which resources', 'Git branches', 'CPU governor'], answer: 1 },
  ],
  recap: [
    <>Operate with <strong>lag + replication + disk</strong> dashboards.</>,
    <>Invest in <strong>topic & schema governance</strong> early.</>,
  ],
})

export const KAFKA_CHAPTERS: Record<string, ComponentType> = {
  'kafka-event-streaming': kafkaEventStreaming,
  'kafka-topics-log': kafkaTopicsLog,
  'kafka-partitions': kafkaPartitions,
  'kafka-producers': kafkaProducers,
  'kafka-consumers': kafkaConsumers,
  'kafka-consumer-groups': kafkaConsumerGroups,
  'kafka-brokers-replication': kafkaBrokersReplication,
  'kafka-reliability': kafkaReliability,
  'kafka-delivery-semantics': kafkaDeliverySemantics,
  'kafka-compaction': kafkaCompaction,
  'kafka-serialization': kafkaSerialization,
  'kafka-connect': kafkaConnect,
  'kafka-streams': kafkaStreams,
  'kafka-operations': kafkaOperations,
}

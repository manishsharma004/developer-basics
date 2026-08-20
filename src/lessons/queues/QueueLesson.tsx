import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { QueueSimulator } from './QueueSimulator.tsx'

export default function QueueLesson() {
  return (
    <Lesson id="queues">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          When one part of a system produces work faster than another can handle
          it, wiring them together directly means the fast side waits (or crashes)
          on the slow side. A <strong>message queue</strong> sits between them as a
          buffer, letting each run at its own pace. Queues are how systems absorb
          spikes, decouple services, and survive downstream slowdowns.
        </p>
        <Callout kind="why" title="The one idea">
          A queue decouples <strong>producers</strong> from <strong>consumers</strong>.
          Producers append messages; consumers pull and process them independently —
          so a burst gets buffered instead of dropped.
        </Callout>
      </Section>

      <Section id="model" title="Producers, consumers, brokers">
        <ul className="prose-list">
          <li><strong>Producer</strong> — puts messages onto the queue.</li>
          <li><strong>Broker / queue</strong> — stores messages durably until they're handled (e.g. RabbitMQ, SQS, Kafka).</li>
          <li><strong>Consumer / worker</strong> — pulls messages and does the work; add more workers to go faster.</li>
          <li><strong>Backpressure</strong> — the signal/strategy when producers outrun consumers and the backlog grows.</li>
        </ul>
        <Callout kind="note">
          Two big patterns: a <strong>work queue</strong> (each message handled by
          one worker — for tasks) and <strong>pub/sub</strong> (each message
          delivered to many subscribers — for events).
        </Callout>
      </Section>

      <Section id="playground" title="Run a live queue">
        <p className="prose">
          Set the producer rate and the number/speed of consumers, then run it.
          When producers outpace consumers, the backlog grows; add consumers to
          drain it.
        </p>
        <QueueSimulator />
        <TryThis>
          Start with a producer rate higher than the consumers can handle and watch
          the queue depth climb (backpressure). Then add consumers or increase their
          speed until the status reads "draining" and the backlog clears.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why queues make systems resilient">
          <p className="prose">
            If a downstream service is briefly slow or down, a direct call fails.
            With a queue, messages simply wait and are processed when the consumer
            recovers — the spike is absorbed. This decoupling is why queues are
            central to reliable, scalable architectures.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Delivery guarantees & idempotency">
          <p className="prose">
            Most brokers offer <strong>at-least-once</strong> delivery — a message
            may be delivered more than once (e.g. after a retry). So consumers should
            be <strong>idempotent</strong>: processing the same message twice has the
            same effect as once. Failed messages often go to a{' '}
            <strong>dead-letter queue</strong> for inspection.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'producer', def: 'Component that puts messages on the queue.' },
            { term: 'consumer / worker', def: 'Component that pulls and processes messages.' },
            { term: 'broker', def: 'The system that stores and delivers messages.' },
            { term: 'backpressure', def: 'What happens when producers outrun consumers; the backlog grows.' },
            { term: 'pub/sub', def: 'Delivery of each message to many subscribers (events).' },
            { term: 'idempotency', def: 'Processing a message twice has the same effect as once.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is the main benefit of putting a queue between two services?',
              options: ['It makes messages smaller', 'It decouples them so each runs at its own pace and spikes are buffered', 'It encrypts traffic', 'It removes the need for a database'],
              answer: 1,
              explain: 'Queues decouple producers and consumers, absorbing bursts and downstream slowdowns.',
            },
            {
              q: 'The queue depth keeps growing without bound. This means:',
              options: ['Consumers are too fast', 'Producers are outrunning consumers (backpressure)', 'The broker is empty', 'Messages are idempotent'],
              answer: 1,
              explain: 'A steadily growing backlog means the arrival rate exceeds processing capacity.',
            },
            {
              q: 'Because brokers often deliver at-least-once, consumers should be:',
              options: ['Stateful', 'Idempotent', 'Single-threaded', 'Encrypted'],
              answer: 1,
              explain: 'Idempotent consumers handle duplicate deliveries safely.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A queue buffers work between <strong>producers</strong> and <strong>consumers</strong>.</>,
            <>Scale throughput by adding consumers; watch for <strong>backpressure</strong>.</>,
            <>Queues add resilience — spikes and outages are absorbed, not dropped.</>,
            <>Expect at-least-once delivery, so make consumers <strong>idempotent</strong>.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

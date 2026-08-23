import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { FetchPlayground } from './FetchPlayground.tsx'

export default function HttpClientsLesson() {
  return (
    <Lesson id="http-clients">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Most apps spend more time <em>calling</em> APIs than designing them. You need
          to handle status codes, parse JSON, set timeouts, and retry safely.
        </p>
        <Callout kind="why" title="The one idea">
          Treat HTTP as unreliable: check <code>response.ok</code>, handle errors, and
          retry only <strong>idempotent</strong> requests on transient failures.
        </Callout>
      </Section>

      <Section id="model" title="Client essentials">
        <ul className="prose-list">
          <li><code>fetch(url, {`{ method, headers, body }`})</code> — browser standard.</li>
          <li><strong>Status codes</strong> — 2xx success, 4xx client fault, 5xx server fault.</li>
          <li><strong>Timeouts</strong> — use <code>AbortController</code> to cancel slow requests.</li>
          <li><strong>Retries</strong> — exponential backoff for 5xx/timeouts; avoid retrying POST blindly.</li>
        </ul>
      </Section>

      <Section id="playground" title="Simulate fetch">
        <FetchPlayground />
        <TryThis>
          Try 500 — watch exponential backoff retries. Try 404 — no retry. Try timeout — discuss AbortController.
        </TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'idempotent', def: 'Repeating the request has the same effect (GET, PUT).' },
          { term: 'AbortController', def: 'API to cancel an in-flight fetch.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'Should you retry a 404?', options: ['Yes always', 'No — client error', 'Only on Tuesdays', 'Only with POST'], answer: 1 },
          { q: '5xx errors often mean:', options: ['Bad URL', 'Server-side failure — maybe retry', 'Success', 'CORS only'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Always inspect status; parse errors from response bodies.</>,
          <>Retry transient 5xx with backoff; set timeouts.</>,
        ]} />
      </Section>
    </Lesson>
  )
}

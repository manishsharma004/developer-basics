import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, SimReality, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { RequestTracer, UrlAnatomy } from './RequestTracer.tsx'
import { HttpMatchQuiz } from './HttpMatchQuiz.tsx'

const METHODS = [
  { m: 'GET', d: 'read a resource (no side effects)' },
  { m: 'POST', d: 'create something / submit data' },
  { m: 'PUT', d: 'replace a resource' },
  { m: 'PATCH', d: 'partially update a resource' },
  { m: 'DELETE', d: 'remove a resource' },
]

const STATUS = [
  { c: '2xx', d: 'success', ex: '200 OK, 201 Created' },
  { c: '3xx', d: 'redirect', ex: '301 Moved, 304 Not Modified' },
  { c: '4xx', d: 'your request was wrong', ex: '400 Bad Request, 404 Not Found' },
  { c: '5xx', d: 'the server failed', ex: '500 Internal Error, 503 Unavailable' },
]

export default function NetworkLesson() {
  return (
    <Lesson id="network">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Almost every app talks to something over the network — an API, a
          database, a CDN. When you type a URL and hit enter, a surprising amount
          happens before a single byte of the page arrives. Knowing the steps
          tells you where time goes and why "the API is slow" often isn't the API
          at all.
        </p>
        <Callout kind="why" title="The one idea">
          A request is a sequence of hops: <strong>find the server (DNS)</strong>,{' '}
          <strong>connect (TCP)</strong>, <strong>secure it (TLS)</strong>, then{' '}
          <strong>ask and answer (HTTP)</strong>. Each hop costs a round trip.
        </Callout>
        <SimReality
          inSim={
            <>
              A stylized timeline with adjustable RTT and toggles for DNS cache and
              keep-alive. No real packets leave your browser.
            </>
          }
          inReality={
            <>
              Real requests hit CDNs, load balancers, retries, HTTP/2 multiplexing,
              and variable congestion. Latency is measured in percentiles, not one
              fixed RTT slider — but the <em>stages</em> are the same.
            </>
          }
        />
      </Section>

      <Section id="url" title="Anatomy of a URL">
        <p className="prose">
          Before anything travels, the browser splits the URL into parts that tell
          it <em>who</em> to talk to and <em>what</em> to ask for.
        </p>
        <UrlAnatomy />
        <ul className="prose-list">
          <li><strong>scheme</strong> — the protocol (<code>https</code> means encrypted).</li>
          <li><strong>host</strong> — the server's name, resolved to an IP via DNS.</li>
          <li><strong>port</strong> — which service on that host (443 for HTTPS, 80 for HTTP).</li>
          <li><strong>path</strong> &amp; <strong>query</strong> — which resource, and parameters for it.</li>
        </ul>
      </Section>

      <Section id="playground" title="Trace a request">
        <p className="prose">
          Watch a request move through each stage. Adjust the network round-trip
          time and the toggles to see what dominates the total — and how caching
          and connection reuse cut it down.
        </p>
        <RequestTracer />
        <TryThis>
          Send a request, then enable <strong>DNS cached</strong> and{' '}
          <strong>keep-alive</strong> and send again — notice how much of the time
          was just <em>setting up</em> the connection. Now drag the round-trip up
          to 200 ms (like a far-away server) and see every hop stretch.
        </TryThis>
      </Section>

      <Section id="http" title="Methods & status codes">
        <p className="prose">
          Once connected, the client sends an HTTP <strong>method</strong> naming
          the intent, and the server replies with a <strong>status code</strong>{' '}
          summarizing the outcome. Learning these two vocabularies makes API work
          and log-reading far easier.
        </p>
        <div className="demo-split">
          <div className="panel">
            <div className="panel-title">Common methods</div>
            <table className="metrics-table">
              <tbody>
                {METHODS.map((x) => (
                  <tr key={x.m}>
                    <td><code>{x.m}</code></td>
                    <td>{x.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="panel">
            <div className="panel-title">Status code families</div>
            <table className="metrics-table">
              <tbody>
                {STATUS.map((x) => (
                  <tr key={x.c}>
                    <td><code>{x.c}</code></td>
                    <td>{x.d}<br /><span className="panel-hint">{x.ex}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Callout kind="tip">
          A quick triage rule: <code>4xx</code> means "fix your request",{' '}
          <code>5xx</code> means "the server broke". Only <code>5xx</code> (and
          timeouts) are truly the server's problem.
        </Callout>
        <HttpMatchQuiz />
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why each hop is a 'round trip'">
          <p className="prose">
            DNS, the TCP handshake, and TLS each require messages to travel to the
            server and back before the next step can start. That out-and-back is a{' '}
            <strong>round trip</strong>, and its time is set by physical distance
            and network quality — you can't code your way under the speed of light.
            This is why CDNs put servers physically closer to users.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Why keep-alive and caching matter so much">
          <p className="prose">
            The first request to a host pays for DNS + TCP + TLS. If the connection
            is kept alive, later requests skip straight to HTTP — often saving two
            or three round trips each. Caching DNS and responses avoids the work
            entirely. Most "make it faster" wins are about <em>avoiding</em> hops,
            not speeding them up.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'DNS', def: 'The system that resolves a hostname to an IP address.' },
            { term: 'TCP handshake', def: 'The SYN/SYN-ACK/ACK exchange that establishes a connection.' },
            { term: 'TLS', def: 'The negotiation that encrypts an HTTPS connection.' },
            { term: 'round trip (RTT)', def: 'The time for a message to reach the server and come back.' },
            { term: 'HTTP method', def: 'The verb (GET, POST, …) stating the intent of a request.' },
            { term: 'status code', def: 'The 3-digit result (2xx/3xx/4xx/5xx) the server returns.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'A page loads slowly on the first visit but is fast afterward. The most likely reason is:',
              options: [
                'The server got faster',
                'DNS, TCP, and TLS setup was paid once, then reused/cached',
                'The CPU warmed up',
                'HTTP switched to GET',
              ],
              answer: 1,
              explain: 'Connection setup and caching costs are paid up front; subsequent requests skip them.',
            },
            {
              q: <>You get a <code>404</code>. Whose problem is it, usually?</>,
              options: ['The server crashed', 'The request asked for something that isn\'t there', 'DNS failed', 'TLS expired'],
              answer: 1,
              explain: '4xx codes indicate a problem with the request — here, the resource was not found.',
            },
            {
              q: 'Which action is safe to retry because it should have no side effects?',
              options: ['POST', 'DELETE', 'GET', 'PATCH'],
              answer: 2,
              explain: 'GET is meant to read without side effects, so it is safe to repeat.',
            },

            {
              q: 'A network timeout usually means:',
              options: [
                '404 Not Found',
              'No response arrived within the deadline',
              'TLS succeeded',
              'DNS cached',
              ],
              answer: 1,
              explain: 'Timeouts are often connectivity, overload, or hung servers — not always 4xx/5xx.',
            },
            {
              q: 'HTTP/2 can improve performance by:',
              options: [
                'Removing TLS',
              'Multiplexing many requests on one connection',
              'Using only GET',
              'Disabling caching',
              ],
              answer: 1,
              explain: 'One TCP connection carries parallel streams, cutting setup overhead.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A URL encodes the scheme, host, port, path, and query.</>,
            <>A request flows through <strong>DNS → TCP → TLS → HTTP</strong>, each costing a round trip.</>,
            <>Methods state intent (GET/POST/…); status codes state the result (2xx–5xx).</>,
            <>Keep-alive and caching win by <strong>avoiding</strong> hops, not speeding them up.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

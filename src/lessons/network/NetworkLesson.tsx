import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap } from '../components/blocks.tsx'
import { RequestTracer, UrlAnatomy } from './RequestTracer.tsx'

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
        <Callout kind="note">
          The HTTP status code summarizes the outcome: <code>2xx</code> success,{' '}
          <code>3xx</code> redirect, <code>4xx</code> you sent something wrong,{' '}
          <code>5xx</code> the server failed.
        </Callout>
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A URL encodes the scheme, host, port, path, and query.</>,
            <>A request flows through <strong>DNS → TCP → TLS → HTTP</strong>, each costing a round trip.</>,
            <>Latency is dominated by round trips, which physical distance sets.</>,
            <>Keep-alive and caching win by <strong>avoiding</strong> hops, not speeding them up.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

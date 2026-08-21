import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { LoadBalancerSim } from './LoadBalancerSim.tsx'

export default function LoadBalancingLesson() {
  return (
    <Lesson id="loadbalancing">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          One server cannot serve the whole internet. A{' '}
          <strong>load balancer</strong> sits in front of many identical backends,
          spreading traffic so no single machine melts down and others sit idle.
        </p>
        <Callout kind="why" title="The one idea">
          Clients talk to the balancer; the balancer picks a healthy backend for
          each request.
        </Callout>
      </Section>

      <Section id="model" title="Algorithms">
        <ul className="prose-list">
          <li>
            <strong>Round robin</strong> — rotate through backends in order; simple
            and fair when work is similar.
          </li>
          <li>
            <strong>Least connections</strong> — send to the backend with the
            fewest in-flight requests; good when requests vary in duration.
          </li>
          <li>
            <strong>Random</strong> — pick any backend; statistically even at high
            volume but spiky at low volume.
          </li>
          <li>
            Health checks remove dead backends from rotation until they recover.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Balance traffic live">
        <p className="prose">
          Send requests to three backends with limited capacity. Switch algorithms,
          burst traffic, then click <strong>Complete work</strong> to free slots.
          Watch least-connections steer away from busy servers.
        </p>
        <LoadBalancerSim />
        <TryThis>
          Set <strong>Round robin</strong>, send five requests one by one — note
          even rotation. Switch to <strong>Least connections</strong>, burst ×5
          without ticking — then tick until idle and burst again; compare the
          distribution.
        </TryThis>
      </Section>

      <Section id="layers" title="Layer 4 vs layer 7">
        <p className="prose">
          <strong>L4</strong> balancers route by IP/port (fast, opaque to HTTP).{' '}
          <strong>L7</strong> balancers understand URLs, headers, and cookies —
          route <code>/api</code> to one pool and static files to another.
        </p>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Sticky sessions">
          <p className="prose">
            Some apps store session state on one server. Balancers can pin a user
            to the same backend (cookie or IP hash) — simpler but uneven load if
            users differ in activity.
          </p>
        </UnderTheHood>
        <UnderTheHood title="When the balancer becomes the bottleneck">
          <p className="prose">
            High-traffic sites run many balancer instances behind anycast DNS or
            cloud-managed load balancers that scale horizontally too.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'load balancer', def: 'Front door that distributes requests across backends.' },
            { term: 'backend / upstream', def: 'A server pool member handling actual work.' },
            { term: 'health check', def: 'Probe that marks backends up or down.' },
            { term: 'round robin', def: 'Cyclic assignment across healthy backends.' },
            { term: 'L7 routing', def: 'HTTP-aware balancing using paths, headers, or cookies.' },
            { term: 'sticky session', def: 'Pinning a client to one backend for stateful apps.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Least-connections helps most when:',
              options: [
                'All requests take the same time',
                'Request duration varies a lot',
                'There is only one backend',
                'DNS is misconfigured',
              ],
              answer: 1,
              explain: 'Steering away from busy servers avoids piling onto slow work.',
            },
            {
              q: 'An L7 balancer can route by:',
              options: ['TCP port only', 'URL path and HTTP headers', 'CPU temperature', 'Git branch name'],
              answer: 1,
              explain: 'Application-layer balancers inspect HTTP, not just packets.',
            },
            {
              q: 'If every backend is at max connections, the balancer should:',
              options: [
                'Silently drop users forever',
                'Queue, retry, scale out, or return 503',
                'Delete user cookies',
                'Disable TLS',
              ],
              answer: 1,
              explain: 'Overload needs backpressure or more capacity — not infinite accepts.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Load balancers spread traffic and hide individual server failures.</>,
            <>Pick an algorithm for your workload — RR, least-conn, or random.</>,
            <>L7 balancers route on HTTP; L4 balancers route on IP/port.</>,
            <>Health checks and autoscaling keep the pool matched to demand.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

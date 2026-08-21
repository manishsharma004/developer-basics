import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { SnippetRunner } from '../components/SnippetRunner.tsx'
import { RouteSim } from './RouteSim.tsx'
import { RateLimitSim } from './RateLimitSim.tsx'
import { snippets } from './snippets.ts'

const webReverseProxy = createChapterLesson({
  id: 'web-reverse-proxy',
  modelTitle: 'Reverse proxy basics',
  intro: (
    <p className="prose">
      Clients on the internet should not talk to your app servers directly. A{' '}
      <strong>reverse proxy</strong> (often <strong>nginx</strong>, Caddy, or a cloud
      load balancer) sits at the edge: it terminates TLS, serves static files, and
      forwards API requests to private backends.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        The client sees <em>one</em> public host; the proxy decides which internal
        service handles each request.
      </Callout>
      <ul className="prose-list">
        <li>
          <strong>Forward proxy</strong> — client-side (VPN, corporate proxy); hides
          the client from servers.
        </li>
        <li>
          <strong>Reverse proxy</strong> — server-side; hides backends from clients.
        </li>
        <li>
          <strong>nginx</strong> — high-performance reverse proxy + static file server;
          common front door for Node, Python, and Go APIs.
        </li>
        <li>
          Handles <strong>SSL/TLS termination</strong> so app code can speak plain HTTP
          on a trusted internal network.
        </li>
      </ul>
      <pre className="term-output">{`Client  --HTTPS-->  nginx (443)  --HTTP-->  api:8000
                              |
                              +--HTTP-->  frontend:3000`}</pre>
    </>
  ),
  terms: [
    { term: 'reverse proxy', def: 'Server that receives client requests and forwards them to upstream apps.' },
    { term: 'upstream', def: 'The backend server pool nginx forwards to.' },
    { term: 'TLS termination', def: 'Decrypting HTTPS at the edge so backends see plain HTTP internally.' },
  ],
  quiz: [
    {
      q: 'A reverse proxy sits:',
      options: ['On the client laptop only', 'In front of your servers facing clients', 'Inside the database', 'Only in DNS'],
      answer: 1,
    },
    {
      q: 'TLS termination at nginx means:',
      options: ['Backends never use encryption', 'HTTPS is decrypted at the edge; backends may use HTTP internally', 'Clients send plain HTTP only', 'DNS is encrypted'],
      answer: 1,
    },
    {
      q: 'nginx is commonly used as:',
      options: ['A spreadsheet tool', 'A reverse proxy and static file server', 'A Git client', 'A CSS preprocessor'],
      answer: 1,
    },
  ],
  recap: [
    <>A <strong>reverse proxy</strong> is the public entry point; backends stay private.</>,
    <><strong>nginx</strong> terminates TLS and forwards to upstream apps.</>,
    <>Do not confuse forward proxies (client-side) with reverse proxies (server-side).</>,
  ],
})

const webNginxRouting = createChapterLesson({
  id: 'web-nginx-routing',
  modelTitle: 'Path & upstream routing',
  intro: (
    <p className="prose">
      One hostname often serves many services: <code>/api</code> to your FastAPI app,{' '}
      <code>/</code> to React static files, <code>/admin</code> to an internal tool.
      <strong> API routing at the edge</strong> maps URL paths (and sometimes hostnames)
      to different upstream pools — before traffic hits application code.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        nginx uses <code>location</code> blocks and <code>proxy_pass</code> to route
        requests. Longest prefix match wins — order matters when paths overlap.
      </p>
      <pre className="term-output">{`upstream api { server api:8000; }
upstream web { server frontend:80; }

server {
  location /api/ {
    proxy_pass http://api;
  }
  location / {
    proxy_pass http://web;
  }
}`}</pre>
      <Callout kind="note">
        This complements the <strong>Load Balancing</strong> chapter: an upstream block
        can list multiple servers; nginx balances between them while routing by path.
      </Callout>
    </>
  ),
  playground: (
    <>
      <RouteSim />
      <SnippetRunner snippets={snippets('Route table')} />
      <TryThis>
        Route <code>/api/orders/42</code> and <code>/admin/dashboard</code> — notice
        longest-prefix matching.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'location block', def: 'nginx rule matching a URL prefix or pattern.' },
    { term: 'proxy_pass', def: 'Directive forwarding a matched request to an upstream.' },
    { term: 'path-based routing', def: 'Sending /api to one service and / to another.' },
  ],
  quiz: [
    {
      q: 'In nginx, /api/ and / both match /api/users. Which wins?',
      options: ['Always /', 'Longest matching prefix (/api/)', 'Random choice', 'Neither — 500 error'],
      answer: 1,
    },
    {
      q: 'proxy_pass sends matched requests to:',
      options: ['The client browser', 'An upstream backend pool', 'DNS servers', 'A SQL database directly'],
      answer: 1,
    },
    {
      q: 'Routing /api to api:8000 and / to frontend is called:',
      options: ['Path-based routing at the edge', 'Binary search', 'Memoization', 'Normalization'],
      answer: 0,
    },
  ],
  recap: [
    <><strong>location</strong> + <strong>proxy_pass</strong> route paths to upstreams.</>,
    <>Longest prefix match resolves overlapping paths.</>,
    <>Edge routing keeps apps focused — nginx handles the front door.</>,
  ],
})

const webApiGateway = createChapterLesson({
  id: 'web-api-gateway',
  modelTitle: 'Gateway responsibilities',
  intro: (
    <p className="prose">
      A reverse proxy forwards traffic. An <strong>API gateway</strong> adds API-specific
      policies: authentication, API keys, rate quotas, request/response transformation,
      and a single public surface for many microservices (Kong, AWS API Gateway, Apigee,
      cloud load balancers with policies).
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>Centralized auth</strong> — validate JWT or API keys once at the
          gateway instead of in every service.
        </li>
        <li>
          <strong>Routing &amp; aggregation</strong> — map <code>/billing</code> and{' '}
          <code>/users</code> to different internal services; optionally combine responses.
        </li>
        <li>
          <strong>Throttling &amp; quotas</strong> — enforce per-client limits before
          backends see traffic (often with Redis counters).
        </li>
        <li>
          <strong>Observability</strong> — consistent access logs, metrics, and trace IDs
          across all APIs.
        </li>
      </ul>
      <Callout kind="why" title="Gateway vs nginx">
        nginx <em>can</em> do auth and rate limits with modules/Lua — gateways package
        these as product features with dashboards and developer portals. Many teams use
        nginx/Envoy at L7 plus a gateway layer for API products.
      </Callout>
    </>
  ),
  terms: [
    { term: 'API gateway', def: 'Edge layer with API policies: auth, keys, routing, limits, docs.' },
    { term: 'API key', def: 'Client identifier used for auth and quota tracking at the gateway.' },
    { term: 'BFF', def: 'Backend-for-frontend — tailored API surface for a specific client app.' },
  ],
  quiz: [
    {
      q: 'An API gateway typically adds over plain reverse proxy:',
      options: ['Only DNS lookup', 'API keys, quotas, and centralized auth', 'CSS bundling', 'Git merges'],
      answer: 1,
    },
    {
      q: 'Validating a JWT at the gateway means microservices:',
      options: ['Never see user identity', 'Can trust headers the gateway sets after verification', 'Must re-parse TLS', 'Cannot use HTTPS'],
      answer: 1,
    },
    {
      q: 'Routing /users to service A and /orders to service B at the gateway is:',
      options: ['Multi-service API routing', 'Database normalization', 'Garbage collection', 'Recursion'],
      answer: 0,
    },
  ],
  recap: [
    <>Gateways add <strong>API policies</strong> on top of routing.</>,
    <>Centralize auth, keys, and quotas at the edge when possible.</>,
    <>nginx handles transport; gateways often handle API product concerns.</>,
  ],
})

const webRateLimiting = createChapterLesson({
  id: 'web-rate-limiting',
  modelTitle: 'Throttling patterns',
  intro: (
    <p className="prose">
      Without limits, one client can overwhelm your API — accidentally (retry storms)
      or deliberately (abuse). <strong>Rate limiting</strong> and{' '}
      <strong>throttling</strong> cap how many requests a client may send in a time
      window, returning <strong>429 Too Many Requests</strong> when exceeded.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>Fixed window</strong> — N requests per minute; simple but allows bursts
          at window boundaries.
        </li>
        <li>
          <strong>Token bucket</strong> — refill tokens at a steady rate; allows controlled
          bursts up to bucket size.
        </li>
        <li>
          <strong>Leaky bucket</strong> — smooth output rate; excess requests queue or drop.
        </li>
        <li>
          Limits can be <strong>per IP</strong>, <strong>per API key</strong>, or{' '}
          <strong>per user</strong> — keys are fairer behind NAT.
        </li>
      </ul>
      <Callout kind="warning" title="429 responses">
        Return <code>Retry-After</code> headers when possible so clients back off instead
        of hammering harder.
      </Callout>
    </>
  ),
  playground: (
    <>
      <RateLimitSim />
      <SnippetRunner snippets={snippets('Token bucket')} />
      <TryThis>
        Set limit to 3, burst ×8 — count 429s. Wait for the window to refill and send again.
      </TryThis>
    </>
  ),
  hood: (
    <UnderTheHood title="Where limits run">
      <ul className="prose-list">
        <li>
          <strong>Edge (nginx, gateway, CDN)</strong> — cheap rejection before backends;
          use for DDoS-ish volume and coarse per-IP caps.
        </li>
        <li>
          <strong>App middleware</strong> — fine-grained per-user limits with business
          rules (e.g. free vs paid tier).
        </li>
        <li>
          <strong>Shared store (Redis)</strong> — counters synchronized across many gateway
          instances; avoid per-process memory limits in clusters.
        </li>
      </ul>
    </UnderTheHood>
  ),
  terms: [
    { term: 'rate limiting', def: 'Capping requests per client in a time window.' },
    { term: '429', def: 'HTTP status: Too Many Requests — client exceeded quota.' },
    { term: 'token bucket', def: 'Algorithm refilling spendable tokens at a steady rate.' },
  ],
  quiz: [
    {
      q: 'HTTP 429 means:',
      options: ['Success', 'Client exceeded rate limit', 'Server crashed permanently', 'Redirect'],
      answer: 1,
    },
    {
      q: 'Per-API-key limits are often better than per-IP because:',
      options: ['IPs never change', 'Many users can share one NAT IP', 'Keys are slower', 'IPs are encrypted'],
      answer: 1,
    },
    {
      q: 'Token buckets allow:',
      options: ['Unlimited traffic always', 'Controlled bursts up to bucket capacity', 'Only one request ever', 'SQL joins'],
      answer: 1,
    },
  ],
  recap: [
    <>Use <strong>rate limits</strong> to protect APIs from overload and abuse.</>,
    <>Return <strong>429</strong> with backoff hints when limits hit.</>,
    <>Enforce at edge for volume; use Redis-backed counters in clusters.</>,
  ],
})

const webEdgeStack = createChapterLesson({
  id: 'web-edge-stack',
  modelTitle: 'Production edge flow',
  intro: (
    <p className="prose">
      Production APIs rarely expose a single Python process on port 8000 to the internet.
      Traffic flows through several layers — each adding routing, security, or scale.
    </p>
  ),
  model: (
    <>
      <pre className="term-output">{`Client
  → DNS
  → Global / regional load balancer
  → Reverse proxy (nginx) — TLS, path routing
  → API gateway — keys, auth, quotas (optional)
  → Rate limiter — 429 before overload
  → App servers (FastAPI, etc.)
  → Database / cache`}</pre>
      <Callout kind="note">
        Small projects may collapse layers (nginx alone). Growth adds gateways, WAFs,
        and CDN caching for static assets — add complexity only when needed.
      </Callout>
    </>
  ),
  hood: (
    <>
      <UnderTheHood title="Common nginx + API patterns">
        <ul className="prose-list">
          <li>
            <code>/api/</code> → upstream FastAPI pool; <code>/</code> → static React build.
          </li>
          <li>
            WebSocket upgrades proxied with <code>Upgrade</code> headers to a dedicated
            upstream.
          </li>
          <li>
            Health checks on <code>/health</code> bypass auth for load balancer probes.
          </li>
        </ul>
      </UnderTheHood>
      <UnderTheHood title="When to add an API gateway">
        <p className="prose">
          Multiple teams shipping microservices, external developers consuming public APIs,
          or strict SLA tiers (free vs pro quotas) — gateways pay off. A monolith behind
          nginx is fine until those pressures appear.
        </p>
      </UnderTheHood>
    </>
  ),
  terms: [
    { term: 'WAF', def: 'Web Application Firewall — filters malicious HTTP at the edge.' },
    { term: 'CDN', def: 'Cached edge nodes serving static assets close to users.' },
    { term: 'health check', def: 'Probe URL load balancers use to drop unhealthy backends.' },
  ],
  quiz: [
    {
      q: 'Typical first edge component after DNS for a public API:',
      options: ['Database primary', 'Load balancer / reverse proxy', 'Cron scheduler', 'Git hook'],
      answer: 1,
    },
    {
      q: 'Rate limiting before app servers helps because:',
      options: ['It speeds SQL joins', 'Cheap rejection saves backend capacity', 'It replaces auth', 'It removes TLS'],
      answer: 1,
    },
    {
      q: 'A monolith behind nginx often skips:',
      options: ['HTTP entirely', 'A separate API gateway until scale/complexity grows', 'All routing', 'DNS'],
      answer: 1,
    },
  ],
  recap: [
    <>Production traffic flows through <strong>LB → proxy → (gateway) → app</strong>.</>,
    <>nginx handles TLS and path routing; gateways add API product policies.</>,
    <>Add layers when scale, security, or multi-team needs justify them.</>,
  ],
})

export const WEB_CHAPTERS: Record<string, ComponentType> = {
  'web-reverse-proxy': webReverseProxy,
  'web-nginx-routing': webNginxRouting,
  'web-api-gateway': webApiGateway,
  'web-rate-limiting': webRateLimiting,
  'web-edge-stack': webEdgeStack,
}

/** Shared Mermaid flowcharts for web edge lessons. Node ids must match simulators. */

export const REVERSE_PROXY_DIAGRAM = `flowchart LR
  client([Client]) -->|HTTPS :443| nginx["nginx reverse proxy"]
  nginx -->|HTTP| api["API upstream :8000"]
  nginx -->|HTTP| web["Frontend upstream :3000"]`

export const NGINX_ROUTING_DIAGRAM = `flowchart LR
  req([Request path]) --> nginx["nginx location match"]
  nginx -->|"/api/"| api["api:8000"]
  nginx -->|"/admin/"| admin["admin:9000"]
  nginx -->|"/static/"| cdn["cdn:443"]
  nginx -->|no match| err["404"]`

export const API_GATEWAY_DIAGRAM = `flowchart LR
  client([Client + API key]) --> gw["API gateway"]
  gw --> auth{Valid key?}
  auth -->|no| r401["401 Unauthorized"]
  auth -->|yes| route{Path?}
  route -->|"/users"| users["Users service"]
  route -->|"/orders"| orders["Orders service"]`

export const RATE_LIMIT_DIAGRAM = `flowchart LR
  client([Client]) --> edge["Edge / gateway"]
  edge --> bucket{Tokens left?}
  bucket -->|yes| app["App server 200"]
  bucket -->|no| r429["429 Too Many Requests"]`

export const EDGE_STACK_DIAGRAM = `flowchart TD
  client([Client]) --> dns["DNS"]
  dns --> lb["Load balancer"]
  lb --> nginx["Reverse proxy / nginx"]
  nginx --> gw["API gateway optional"]
  gw --> limit["Rate limiter"]
  limit --> app["App servers"]
  app --> data["Database / cache"]`

export const WEB_NODE_META = {
  client: { label: 'Client', description: 'Browser or mobile app on the public internet.' },
  nginx: { label: 'Reverse proxy (nginx)', description: 'Public entry point — TLS termination, routing, static files.' },
  api: { label: 'API upstream', description: 'Private FastAPI/Node service the client never talks to directly.' },
  web: { label: 'Frontend upstream', description: 'Static React build or SSR server behind the proxy.' },
  req: { label: 'Request', description: 'URL path the client sends — nginx matches longest prefix.' },
  admin: { label: 'Admin upstream', description: 'Internal tools routed by /admin/ prefix.' },
  cdn: { label: 'CDN / static', description: 'Cached assets served from /static/ or a CDN.' },
  err: { label: '404', description: 'No location block matched — nginx returns not found.' },
  gw: { label: 'API gateway', description: 'Central auth, API keys, quotas, and multi-service routing.' },
  auth: { label: 'Auth check', description: 'Validate JWT or API key before forwarding to backends.' },
  route: { label: 'Path router', description: 'Send /users and /orders to different microservices.' },
  r401: { label: '401 Unauthorized', description: 'Missing or invalid credentials — rejected at the edge.' },
  users: { label: 'Users service', description: 'Microservice handling user resources.' },
  orders: { label: 'Orders service', description: 'Microservice handling order resources.' },
  edge: { label: 'Edge layer', description: 'nginx, CDN, or gateway — cheap place to reject overload.' },
  bucket: { label: 'Token bucket', description: 'Counts requests per window; extras get 429.' },
  app: { label: 'App server', description: 'Your FastAPI/Node process doing real work.' },
  r429: { label: '429 Too Many Requests', description: 'Client exceeded quota — should back off.' },
  dns: { label: 'DNS', description: 'Resolves hostname to IP before any TCP connection.' },
  lb: { label: 'Load balancer', description: 'Spreads traffic across healthy proxy/app instances.' },
  limit: { label: 'Rate limiter', description: 'Protects backends from bursts and abuse.' },
  data: { label: 'Database / cache', description: 'Persistence layer apps query after passing the edge.' },
} as const

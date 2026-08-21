import type { Snippet } from '../components/SnippetRunner.tsx'

export function snippets(label: string): Snippet[] {
  return SNIPPETS.filter((snippet) => snippet.label === label)
}

const SNIPPETS: Snippet[] = [
  {
    label: 'Route table',
    code: `ROUTES = [
    ("/api/", "api:8000"),
    ("/admin/", "admin:9000"),
    ("/static/", "cdn:443"),
]

def route(path):
    for prefix, upstream in sorted(ROUTES, key=lambda r: -len(r[0])):
        if path.startswith(prefix):
            return 200, upstream
    return 404, None

for path in ["/api/users", "/admin/login", "/static/app.js", "/unknown"]:
    code, upstream = route(path)
    print(path, "->", code, upstream)`,
  },
  {
    label: 'Token bucket',
    code: `class TokenBucket:
    def __init__(self, limit, window_sec):
        self.limit = limit
        self.window = window_sec
        self.tokens = limit
        self.window_start = 0.0

    def allow(self, now):
        if now - self.window_start >= self.window:
            self.window_start = now
            self.tokens = self.limit
        if self.tokens <= 0:
            return False, 429
        self.tokens -= 1
        return True, 200

bucket = TokenBucket(limit=3, window_sec=1.0)
for t in [0.0, 0.1, 0.2, 0.3, 1.1, 1.2]:
    ok, status = bucket.allow(t)
    print(f"t={t:.1f}s allow={ok} status={status}")`,
  },
  {
    label: 'nginx location',
    code: `# Simplified nginx routing idea (not real config syntax check)
routes = {
    "/api/": "http://api_upstream",
    "/": "http://frontend_upstream",
}

request_path = "/api/orders"
for prefix, upstream in routes.items():
    if request_path.startswith(prefix):
        print("proxy_pass", upstream)
        break`,
  },
]

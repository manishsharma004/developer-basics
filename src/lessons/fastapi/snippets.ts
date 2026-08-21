import type { Snippet } from '../components/SnippetRunner.tsx'

export const FASTAPI_SNIPPETS: Snippet[] = [
  {
    label: 'Hello FastAPI',
    code: `# Minimal API idea — type hints drive validation + OpenAPI
routes = {}

def get(path):
    def decorator(fn):
        routes[("GET", path)] = fn
        return fn
    return decorator

@get("/")
def root():
    return {"message": "Hello API"}

@get("/health")
def health():
    return {"status": "ok"}

for (method, path), fn in routes.items():
    print(method, path, "->", fn())`,
  },
  {
    label: 'CRUD routes',
    code: `users = {1: {"name": "Ada"}, 2: {"name": "Linus"}}
next_id = 3

def create(body):
    global next_id
    uid = next_id
    next_id += 1
    users[uid] = body
    return 201, {"id": uid, **body}

def update(uid, body):
    if uid not in users:
        return 404, {"detail": "not found"}
    users[uid].update(body)
    return 200, users[uid]

def delete(uid):
    if uid not in users:
        return 404, {"detail": "not found"}
    del users[uid]
    return 204, None

print("POST ->", create({"name": "Grace"}))
print("PUT  ->", update(1, {"name": "Ada L."}))
print("DEL  ->", delete(2))`,
  },
  {
    label: 'Response models',
    code: `def user_out(raw):
    # response_model hides internal fields
    return {"id": raw["id"], "name": raw["name"]}

def get_user(user_id):
    db = {1: {"id": 1, "name": "Ada", "password_hash": "secret"}}
    row = db.get(user_id)
    if not row:
        return 404, {"detail": "not found"}
    return 200, user_out(row)

print(get_user(1))   # password_hash stripped from response`,
  },
  {
    label: 'Path parameters',
    code: `def get_item(item_id: int, version: int = 1):
    if item_id < 1:
        return 422, {"detail": "invalid id"}
    return 200, {"item_id": item_id, "version": version}

print(get_item(42))
print(get_item(0))
print(get_item(7, version=3))`,
  },
  {
    label: 'Request body',
    code: `def create_order(body, customer_id: int):
    # body from JSON POST, customer_id from path
    if body.get("amount", 0) <= 0:
        return 422, {"detail": "amount must be positive"}
    return 201, {"customer_id": customer_id, **body}

print(create_order({"product": "Keyboard", "amount": 79}, customer_id=3))`,
  },
  {
    label: 'Route handlers',
    code: `# FastAPI maps HTTP method + path -> Python function
routes = {}

def get(path):
    def decorator(fn):
        routes[("GET", path)] = fn
        return fn
    return decorator

@get("/users")
def list_users():
    return [{"id": 1, "name": "Ada"}, {"id": 2, "name": "Linus"}]

@get("/users/{user_id}")
def get_user(user_id: int):
    users = {1: "Ada", 2: "Linus"}
    if user_id not in users:
        return 404, {"detail": "not found"}
    return 200, {"id": user_id, "name": users[user_id]}

print("GET /users     ->", list_users())
print("GET /users/1   ->", get_user(1))
print("GET /users/99  ->", get_user(99))`,
  },
  {
    label: 'Pydantic-style validation',
    code: `def validate_user(data):
    errors = []
    if "name" not in data or not str(data["name"]).strip():
        errors.append("name is required")
    if "email" in data and "@" not in str(data["email"]):
        errors.append("invalid email")
    if errors:
        return None, errors
    return {"name": data["name"].strip(), "email": data.get("email", "")}, []

# Simulates POST /users body validation
for body in [{"name": "Ada"}, {"name": ""}, {"name": "Bob", "email": "bad"}]:
    user, errs = validate_user(body)
    print(body, "->", user or errs)`,
  },
  {
    label: 'Path & query parameters',
    code: `def search_items(q: str = "", limit: int = 10, skip: int = 0):
    items = ["keyboard", "monitor", "mouse", "webcam", "headset"]
    filtered = [i for i in items if q.lower() in i]
    page = filtered[skip : skip + limit]
    return {"q": q, "total": len(filtered), "items": page}

print(search_items())
print(search_items(q="mo", limit=2))
print(search_items(q="e", skip=1, limit=3))`,
  },
  {
    label: 'Dependency injection',
    code: `# Dependencies are callables FastAPI runs before your route handler
def get_db():
    return {"conn": "sqlite://app.db"}  # fake connection

def get_current_user(db):
    return {"id": 7, "name": "Ada", "db": db["conn"]}

def read_profile(user= None):
    user = user or get_current_user(get_db())
    return {"user": user["name"], "via": user["db"]}

print(read_profile())
print("DI keeps routes thin and testable — swap get_db in tests")`,
  },
  {
    label: 'Status codes & errors',
    code: `class HTTPException(Exception):
    def __init__(self, status, detail):
        self.status = status
        self.detail = detail

def delete_user(user_id: int):
    users = {1: "Ada", 2: "Linus"}
    if user_id not in users:
        raise HTTPException(404, "User not found")
    del users[user_id]
    return 204, None  # No Content

try:
    print("delete 1:", delete_user(1))
    print("delete 9:", delete_user(9))
except HTTPException as e:
    print(f"error {e.status}: {e.detail}")`,
  },
  {
    label: 'Auth dependency',
    code: `class HTTPException(Exception):
    def __init__(self, status, detail):
        self.status, self.detail = status, detail

def get_current_user(token="Bearer demo"):
    if not token.startswith("Bearer "):
        raise HTTPException(401, "Missing bearer token")
    key = token.split(" ", 1)[1]
    users = {"demo": {"id": 1, "name": "Ada"}}
    if key not in users:
        raise HTTPException(401, "Invalid token")
    return users[key]

# Route would be: def me(user = Depends(get_current_user)): ...
print(get_current_user())`,
  },
  {
    label: 'Async route handler',
    code: `import asyncio

async def fetch_user(user_id: int):
    await asyncio.sleep(0.1)   # simulate DB/network
    return {"id": user_id, "name": "Ada"}

async def handler(user_id: int):
    user = await fetch_user(user_id)
    return user

asyncio.run(handler(1))
print("async def + await keeps the server responsive during I/O")`,
  },
  {
    label: 'CORS for React frontend',
    code: `# Browser blocks cross-origin fetch unless the API sends CORS headers
# FastAPI: app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"])

allowed_origins = ["http://localhost:5173"]  # Vite dev server
request_origin = "http://localhost:5173"
request_method = "GET"

if request_origin in allowed_origins:
    headers = {
        "Access-Control-Allow-Origin": request_origin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    }
    print("CORS ok:", headers)
else:
    print("browser would block the React fetch")`,
  },
]

export function snippets(...labels: string[]) {
  return FASTAPI_SNIPPETS.filter((s) => labels.includes(s.label))
}

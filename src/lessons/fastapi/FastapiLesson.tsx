import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
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

export default function FastapiLesson() {
  return (
    <Lesson id="fastapi">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          You've seen REST APIs in theory — now build one in Python.{' '}
          <strong>FastAPI</strong> is a modern framework for writing HTTP APIs with
          automatic validation, interactive docs, and excellent performance. It's built
          on the same ideas as the APIs &amp; REST chapter, but with far less boilerplate.
        </p>
        <Callout kind="why" title="The one idea">
          Declare your <strong>routes</strong>, your <strong>data shapes</strong> (with
          Pydantic models), and FastAPI handles parsing, validation, and OpenAPI docs for you.
        </Callout>
      </Section>

      <Section id="routes-basics" title="GET routes & JSON responses">
        <p className="prose">
          A FastAPI app starts with <code>FastAPI()</code> and route handlers decorated
          with HTTP methods. <code>@app.get</code> reads a resource and typically returns
          JSON — a Python <code>dict</code> or list serializes automatically.
        </p>
        <pre className="term-output">{`from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def list_users():
    return [{"id": 1, "name": "Ada"}]

@app.get("/users/{user_id}")
def get_user(user_id: int):
    ...`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Route handlers')} />
        <TryThis>
          Trace <code>get_user(1)</code> vs <code>get_user(99)</code> — note the 404 response shape.
        </TryThis>
      </Section>

      <Section id="routes-crud" title="POST, PUT & DELETE">
        <p className="prose">
          REST maps verbs to actions: <code>POST</code> creates, <code>PUT</code>/
          <code>PATCH</code> updates, <code>DELETE</code> removes. Set{' '}
          <code>status_code=201</code> on creation and return the new resource (or its id).
        </p>
        <ul className="prose-list">
          <li><code>@app.post("/users", status_code=201)</code> — create</li>
          <li><code>@app.put("/users/{'{id}'}")</code> — replace</li>
          <li><code>@app.delete("/users/{'{id}'}", status_code=204)</code> — delete, often no body</li>
        </ul>
        <Callout kind="note" title="Idempotency reminder">
          From the APIs lesson: GET/PUT/DELETE should be safe to retry; POST creates a new
          resource each time unless you add idempotency keys.
        </Callout>
      </Section>

      <Section id="models-request" title="Request models (Pydantic)">
        <p className="prose">
          <strong>Pydantic</strong> models describe the shape of JSON bodies and validate
          incoming data before your handler runs. Invalid requests get a{' '}
          <code>422 Unprocessable Entity</code> with details — for free.
        </p>
        <pre className="term-output">{`from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr

@app.post("/users", status_code=201)
def create_user(body: UserCreate):
    return {"id": 1, **body.model_dump()}`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Pydantic-style validation')} />
        <Callout kind="tip" title="Types are documentation">
          Type hints on parameters aren't just for mypy — FastAPI uses them to parse query
          strings, path segments, and JSON bodies correctly.
        </Callout>
      </Section>

      <Section id="models-response" title="Response models & status codes">
        <p className="prose">
          Declare what leaves your API with a <strong>response model</strong> — FastAPI
          filters fields and documents the shape in OpenAPI. Pair with explicit status codes
          for create (<code>201</code>) and delete (<code>204</code>).
        </p>
        <pre className="term-output">{`class UserOut(BaseModel):
    id: int
    name: str

@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    return UserOut(id=user_id, name="Ada")`}</pre>
      </Section>

      <Section id="params-path" title="Path parameters">
        <p className="prose">
          Segments in the URL like <code>/users/{'{user_id}'}</code> become typed function
          arguments. FastAPI validates types before your handler runs — pass a string where
          an <code>int</code> is expected and you get a <code>422</code> validation error.
        </p>
      </Section>

      <Section id="params-query" title="Query parameters">
        <p className="prose">
          Values after <code>?</code> in the URL — <code>?q=keyboard&amp;limit=10</code> — map
          to function parameters with defaults. FastAPI treats undecorated parameters with
          defaults as query params.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Path & query parameters')} />
      </Section>

      <Section id="params-body" title="Request body">
        <p className="prose">
          JSON POST/PUT payloads map to a Pydantic model parameter. Only one body model per
          handler; combine with path and query params in the same function signature.
        </p>
        <pre className="term-output">{`@app.post("/users")
def create_user(body: UserCreate, active: bool = True):
    # body from JSON, active from ?active=true
    ...`}</pre>
      </Section>

      <Section id="deps-database" title="Database dependencies">
        <p className="prose">
          Shared logic — database connections, auth, pagination — belongs in{' '}
          <strong>dependencies</strong> that FastAPI injects into route handlers:
        </p>
        <pre className="term-output">{`from fastapi import Depends

def get_db():
    db = connect()
    try:
        yield db
    finally:
        db.close()

@app.get("/me")
def read_me(user = Depends(get_current_user)):
    return user`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Dependency injection')} />
        <UnderTheHood title="Testability">
          <p className="prose">
            In tests, override <code>Depends(get_db)</code> with a fake in-memory database.
            Your route handlers stay unchanged — only the wiring changes.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="deps-auth" title="Auth dependencies">
        <p className="prose">
          Authentication fits the same <code>Depends</code> pattern — read a bearer token,
          validate it, return the current user. Unauthorized requests raise{' '}
          <code>HTTPException(401)</code> before your handler runs.
        </p>
        <pre className="term-output">{`@app.get("/me")
def read_me(user = Depends(get_current_user)):
    return user`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Auth dependency')} />
      </Section>

      <Section id="errors" title="Errors & HTTPException">
        <p className="prose">
          APIs must fail clearly. Raise <code>HTTPException</code> for expected errors;
          return the right status code (404, 400, 401) so clients can react.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Status codes & errors')} />
      </Section>

      <Section id="hood-asgi" title="ASGI & async handlers">
        <p className="prose">
          FastAPI runs on <strong>ASGI</strong>. Use <code>async def</code> handlers when
          you <code>await</code> database or HTTP calls — the event loop serves other
          requests while waiting.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Async route handler')} />
      </Section>

      <Section id="hood-openapi" title="OpenAPI & /docs">
        <p className="prose">
          FastAPI generates an <strong>OpenAPI</strong> schema from your type hints and
          serves interactive docs at <code>/docs</code> (Swagger UI) and{' '}
          <code>/redoc</code>. Frontend teams explore endpoints without reading source.
        </p>
      </Section>

      <Section id="hood-cors" title="CORS & React integration">
        <p className="prose">
          A React app on <code>localhost:5173</code> calling an API on{' '}
          <code>localhost:8000</code> is a <strong>cross-origin</strong> request. Browsers
          block it unless the API sends CORS headers — configure{' '}
          <code>CORSMiddleware</code> in FastAPI for dev and production origins.
        </p>
        <pre className="term-output">{`// React frontend
const res = await fetch("http://localhost:8000/users")
const users = await res.json()`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'CORS for React frontend')} />
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Full-stack stack">
          <p className="prose">
            Typical app: React UI → FastAPI JSON API → PostgreSQL/MongoDB via connector
            libraries from the persistence lessons. FastAPI validates at the edge; databases
            store authoritative state.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'path operation', def: 'A route handler tied to an HTTP method and URL path.' },
            { term: 'Pydantic model', def: 'A class that validates and serializes request/response data.' },
            { term: 'dependency injection', def: 'Shared callables FastAPI runs before your handler.' },
            { term: 'HTTPException', def: 'Raised to return an error status and JSON detail body.' },
            { term: 'ASGI', def: 'The async interface between Python web apps and servers like Uvicorn.' },
            { term: 'OpenAPI', def: 'A machine-readable API description; powers /docs in FastAPI.' },
            { term: 'CORS', def: 'Browser policy; APIs must send Access-Control headers for cross-origin fetch.' },
            { term: 'Bearer token', def: 'Common auth scheme: Authorization: Bearer <token>.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: '@app.get("/items/{item_id}") makes item_id a:',
              options: ['Query parameter', 'Path parameter', 'Request header', 'Cookie'],
              answer: 1,
            },
            {
              q: 'Invalid JSON body fields typically return status:',
              options: ['200 OK', '404 Not Found', '422 Unprocessable Entity', '500 always'],
              answer: 2,
            },
            {
              q: 'Depends(get_db) is used for:',
              options: ['CSS styling', 'Injecting shared setup like a DB session', 'Compiling TypeScript', 'React rendering'],
              answer: 1,
            },
            {
              q: 'FastAPI automatically generates:',
              options: ['React components', 'OpenAPI docs from type hints', 'SQL migrations', 'Git commits'],
              answer: 1,
            },
            {
              q: 'Returning a Python dict from a route handler:',
              options: ['Crashes the server', 'Gets serialized to JSON in the response', 'Requires manual json.dumps always', 'Only works for GET'],
              answer: 1,
            },
            {
              q: 'async def handlers help when the route:',
              options: ['Only does math', 'Awaits I/O like database or HTTP calls', 'Returns HTML only', 'Has no parameters'],
              answer: 1,
            },
            {
              q: 'A React app on localhost:5173 calling localhost:8000 needs:',
              options: ['Same port on both', 'CORS headers from the API', 'No HTTP at all', 'GraphQL only'],
              answer: 1,
            },
            {
              q: 'HTTP 401 from get_current_user means:',
              options: ['Server crashed', 'Missing or invalid authentication', 'Validation failed on JSON body', 'Resource not found'],
              answer: 1,
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>FastAPI maps <strong>decorators + functions</strong> to HTTP endpoints.</>,
            <><strong>Pydantic models</strong> validate bodies; type hints drive query/path parsing.</>,
            <><strong>Depends</strong> injects shared logic — great for DB and auth.</>,
            <>Raise <strong>HTTPException</strong> for errors; OpenAPI docs come free at <code>/docs</code>.</>,
            <><strong>CORS</strong> lets your React frontend fetch the API from a different origin.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

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

      <Section id="routes" title="Routes & path operations">
        <p className="prose">
          Each endpoint is a Python function decorated with the HTTP method and path.
          Real FastAPI code looks like:
        </p>
        <pre className="term-output">{`from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def list_users():
    return [{"id": 1, "name": "Ada"}]

@app.get("/users/{user_id}")
def get_user(user_id: int):
    ...`}</pre>
        <ul className="prose-list">
          <li><code>@app.get</code>, <code>@app.post</code>, <code>@app.put</code>, <code>@app.delete</code> map to HTTP verbs.</li>
          <li><code>{'{user_id}'}</code> in the path becomes a typed function parameter.</li>
          <li>Return a dict or Pydantic model — FastAPI serializes it to JSON automatically.</li>
        </ul>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Route handlers')} />
      </Section>

      <Section id="models" title="Request & response models">
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

      <Section id="params" title="Path, query & body">
        <p className="prose">
          FastAPI distinguishes three parameter sources automatically from type hints and
          defaults:
        </p>
        <ul className="prose-list">
          <li><strong>Path</strong> — <code>/items/{'{item_id}'}</code> → function arg <code>item_id</code>.</li>
          <li><strong>Query</strong> — <code>?q=keyboard&amp;limit=10</code> → args with defaults.</li>
          <li><strong>Body</strong> — JSON POST payload → a Pydantic model parameter.</li>
        </ul>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Path & query parameters')} />
      </Section>

      <Section id="deps" title="Dependencies">
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

      <Section id="playground" title="Error handling lab">
        <p className="prose">
          APIs must fail clearly. Raise <code>HTTPException</code> for expected errors;
          return the right status code (404, 400, 401) so clients can react.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Status codes & errors')} />
        <TryThis>
          In <strong>Route handlers</strong>, trace what <code>get_user(99)</code> returns
          vs <code>get_user(1)</code>. In <strong>Pydantic-style validation</strong>, add a
          valid user with email and confirm no errors.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="ASGI & async">
          <p className="prose">
            FastAPI runs on <strong>ASGI</strong> (Asynchronous Server Gateway Interface).
            Route handlers can be <code>async def</code> and <code>await</code> I/O without
            blocking threads — the same concurrency idea from the Concurrency chapter, applied
            to web servers.
          </p>
        </UnderTheHood>
        <UnderTheHood title="OpenAPI / Swagger UI">
          <p className="prose">
            FastAPI generates an <strong>OpenAPI</strong> schema from your type hints and
            serves interactive docs at <code>/docs</code>. Clients (and frontend teams) can
            explore every endpoint, parameter, and response shape without reading source code.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Stack with React">
          <p className="prose">
            A typical full-stack app: React frontend calls FastAPI endpoints with{' '}
            <code>fetch</code>, FastAPI validates input and talks to PostgreSQL or MongoDB,
            returns JSON. CORS middleware lets the browser call a different origin during
            development.
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
          ]}
        />
      </Section>
    </Lesson>
  )
}

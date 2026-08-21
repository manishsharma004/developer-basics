import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { SnippetRunner } from '../components/SnippetRunner.tsx'
import { OpenApiSim, FastApiStackSim } from './FastApiSims.tsx'
import { snippets } from './snippets.ts'

const fastapiIntro = createChapterLesson({
  id: 'fastapi-intro',
  modelTitle: 'Why FastAPI',
  intro: (
    <>
      <p className="prose">
        You've seen REST APIs in theory — now build one in Python.{' '}
        <strong>FastAPI</strong> is a modern framework for writing HTTP APIs with
        automatic validation, interactive docs, and excellent performance. It's built
        on the same ideas as the APIs &amp; REST chapter, but with far less boilerplate.
      </p>
    </>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Declare your <strong>routes</strong>, your <strong>data shapes</strong> (with
        Pydantic models), and FastAPI handles parsing, validation, and OpenAPI docs for you.
      </Callout>
      <p className="prose">
        FastAPI sits on <strong>Starlette</strong> and <strong>Pydantic</strong>, so you
        get async support, automatic request parsing, and machine-readable API docs without
        maintaining a separate spec file.
      </p>
    </>
  ),
  playground: (
    <>
      <SnippetRunner snippets={snippets('Hello FastAPI')} />
      <TryThis>
        Run the snippet and trace how each <code>@get</code> decorator registers a route handler.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'FastAPI', def: 'A Python web framework for building APIs with type hints and automatic validation.' },
    { term: 'OpenAPI', def: 'A machine-readable API description; powers /docs in FastAPI.' },
    { term: 'Pydantic model', def: 'A class that validates and serializes request/response data.' },
  ],
  quiz: [
    {
      q: 'FastAPI automatically generates:',
      options: ['React components', 'OpenAPI docs from type hints', 'SQL migrations', 'Git commits'],
      answer: 1,
    },
    {
      q: 'The core FastAPI workflow is:',
      options: ['Write HTML templates only', 'Declare routes + data shapes, let the framework handle parsing', 'Configure nginx manually for every endpoint', 'Compile Python to C first'],
      answer: 1,
    },
    {
      q: 'FastAPI is built on top of:',
      options: ['Django ORM only', 'Starlette and Pydantic', 'Ruby on Rails', 'Express.js'],
      answer: 1,
    },
  ],
  recap: [
    <>FastAPI turns <strong>Python type hints</strong> into validated HTTP endpoints.</>,
    <>Interactive <strong>OpenAPI docs</strong> come free at <code>/docs</code>.</>,
    <>Less boilerplate than hand-rolling validation and routing yourself.</>,
  ],
})

const fastapiRoutesBasics = createChapterLesson({
  id: 'fastapi-routes-basics',
  modelTitle: 'GET routes & JSON',
  intro: (
    <p className="prose">
      Every API starts with routes — functions that answer HTTP requests. GET handlers
      read data and return JSON; FastAPI maps decorators like <code>@app.get</code> to
      URL paths so clients know where to fetch resources.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        A FastAPI app starts with <code>FastAPI()</code> and route handlers decorated
        with HTTP methods. <code>@app.get</code> reads a resource and typically returns
        JSON — a Python <code>dict</code> or list serializes automatically.
      </p>
      <CodePreview
        language="python"
        code={`from fastapi import FastAPI

app = FastAPI()

@app.get("/users")
def list_users():
    return [{"id": 1, "name": "Ada"}]

@app.get("/users/{user_id}")
def get_user(user_id: int):
    ...`}
      />
    </>
  ),
  playground: (
    <>
      <SnippetRunner snippets={snippets('Route handlers')} />
      <TryThis>
        Trace <code>get_user(1)</code> vs <code>get_user(99)</code> — note the 404 response shape.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'path operation', def: 'A route handler tied to an HTTP method and URL path.' },
    { term: 'route handler', def: 'A Python function FastAPI calls when a matching HTTP request arrives.' },
    { term: 'JSON response', def: 'Structured data returned to the client; Python dicts serialize automatically.' },
  ],
  quiz: [
    {
      q: 'Returning a Python dict from a route handler:',
      options: ['Crashes the server', 'Gets serialized to JSON in the response', 'Requires manual json.dumps always', 'Only works for GET'],
      answer: 1,
    },
    {
      q: '@app.get("/users/{item_id}") makes item_id a:',
      options: ['Query parameter', 'Path parameter', 'Request header', 'Cookie'],
      answer: 1,
    },
    {
      q: 'Which decorator reads a resource without changing server state?',
      options: ['@app.post', '@app.get', '@app.delete', '@app.put'],
      answer: 1,
    },
  ],
  recap: [
    <><code>@app.get</code> maps a URL path to a Python function.</>,
    <>Return a <code>dict</code> or list — FastAPI serializes it to JSON.</>,
    <>Path segments like <code>/users/{'{user_id}'}</code> become typed arguments.</>,
  ],
})

const fastapiRoutesCrud = createChapterLesson({
  id: 'fastapi-routes-crud',
  modelTitle: 'POST, PUT & DELETE',
  intro: (
    <p className="prose">
      REST maps HTTP verbs to actions on resources. Beyond reading with GET, you create,
      update, and delete — each verb has conventions for status codes and response bodies
      that clients rely on.
    </p>
  ),
  model: (
    <>
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
    </>
  ),
  playground: <SnippetRunner snippets={snippets('CRUD routes')} />,
  terms: [
    { term: 'POST', def: 'HTTP method to create a new resource; typically returns 201 Created.' },
    { term: 'PUT', def: 'HTTP method to replace an entire resource at a known URL.' },
    { term: '204 No Content', def: 'Success status often used for DELETE when no body is returned.' },
    { term: 'idempotency', def: 'Repeating the same request has the same effect — true for PUT and DELETE.' },
  ],
  quiz: [
    {
      q: 'Which status code is conventional for a successful POST that creates a resource?',
      options: ['200 OK', '201 Created', '204 No Content', '404 Not Found'],
      answer: 1,
    },
    {
      q: "DELETE /users/{id} typically returns:",
      options: ['201 with the deleted object', '204 with no body', '422 validation error', '500 always'],
      answer: 1,
    },
    {
      q: 'Which verb creates a new resource each time it succeeds?',
      options: ['GET', 'PUT', 'POST', 'DELETE'],
      answer: 2,
    },
  ],
  recap: [
    <><code>POST</code> creates (201), <code>PUT</code> replaces, <code>DELETE</code> removes (204).</>,
    <>Return the new resource (or its id) after creation so clients can use it immediately.</>,
    <>GET/PUT/DELETE are idempotent; POST is not unless you add idempotency keys.</>,
  ],
})

const fastapiModelsRequest = createChapterLesson({
  id: 'fastapi-models-request',
  modelTitle: 'Request models',
  intro: (
    <p className="prose">
      Incoming JSON must match the shape your handler expects. Without validation, bad
      data crashes handlers or corrupts your database — request models catch problems at
      the edge before your business logic runs.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        <strong>Pydantic</strong> models describe the shape of JSON bodies and validate
        incoming data before your handler runs. Invalid requests get a{' '}
        <code>422 Unprocessable Entity</code> with details — for free.
      </p>
      <CodePreview
        language="python"
        code={`from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    email: EmailStr

@app.post("/users", status_code=201)
def create_user(body: UserCreate):
    return {"id": 1, **body.model_dump()}`}
      />
      <Callout kind="tip" title="Types are documentation">
        Type hints on parameters aren't just for mypy — FastAPI uses them to parse query
        strings, path segments, and JSON bodies correctly.
      </Callout>
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Pydantic-style validation')} />,
  terms: [
    { term: 'Pydantic model', def: 'A class that validates and serializes request/response data.' },
    { term: '422 Unprocessable Entity', def: 'Status returned when request body fails validation.' },
    { term: 'BaseModel', def: 'Pydantic base class; fields and types define the expected JSON shape.' },
  ],
  quiz: [
    {
      q: 'Invalid JSON body fields typically return status:',
      options: ['200 OK', '404 Not Found', '422 Unprocessable Entity', '500 always'],
      answer: 2,
    },
    {
      q: 'A Pydantic model on a POST handler validates:',
      options: ['CSS files', 'The incoming JSON request body', 'Database indexes', 'Git commits'],
      answer: 1,
    },
    {
      q: 'Type hints on route parameters help FastAPI:',
      options: ['Compile to JavaScript', 'Parse and validate query, path, and body data', 'Generate SQL migrations', 'Render HTML templates'],
      answer: 1,
    },
  ],
  recap: [
    <>Define a <strong>Pydantic model</strong> for JSON bodies — validation runs before your handler.</>,
    <>Invalid bodies return <code>422</code> with field-level error details.</>,
    <>Type hints drive parsing for paths, queries, and bodies alike.</>,
  ],
})

const fastapiModelsResponse = createChapterLesson({
  id: 'fastapi-models-response',
  modelTitle: 'Response models',
  intro: (
    <p className="prose">
      APIs are contracts — clients depend on a stable response shape. Response models
      document what leaves your API, filter sensitive fields, and keep OpenAPI accurate.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Declare what leaves your API with a <strong>response model</strong> — FastAPI
        filters fields and documents the shape in OpenAPI. Pair with explicit status codes
        for create (<code>201</code>) and delete (<code>204</code>).
      </p>
      <CodePreview
        language="python"
        code={`class UserOut(BaseModel):
    id: int
    name: str

@app.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int):
    return UserOut(id=user_id, name="Ada")`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Response models')} />,
  terms: [
    { term: 'response model', def: 'Declares and filters the JSON shape returned to clients.' },
    { term: 'response_model', def: 'FastAPI parameter that validates and documents outgoing data.' },
    { term: '201 Created', def: 'Status code for successful resource creation via POST.' },
  ],
  quiz: [
    {
      q: 'response_model on a route handler:',
      options: ['Changes the HTTP method', 'Filters and documents the response JSON shape', 'Connects to PostgreSQL', 'Enables CORS'],
      answer: 1,
    },
    {
      q: 'Why use a response model instead of returning a raw dict?',
      options: ['Dicts cannot be JSON', 'It hides extra fields and documents the contract in OpenAPI', 'It makes routes async automatically', 'It replaces Pydantic entirely'],
      answer: 1,
    },
    {
      q: 'A successful DELETE often uses status:',
      options: ['200 with full object', '204 No Content', '422 Unprocessable Entity', '301 Moved Permanently'],
      answer: 1,
    },
  ],
  recap: [
    <><code>response_model</code> filters outgoing fields and updates OpenAPI docs.</>,
    <>Pair explicit status codes with the right verb — 201 for create, 204 for delete.</>,
    <>Response models keep your API contract stable as handlers evolve.</>,
  ],
})

const fastapiParamsPath = createChapterLesson({
  id: 'fastapi-params-path',
  modelTitle: 'Path parameters',
  intro: (
    <p className="prose">
      URLs identify resources — <code>/users/42</code> means user 42. Path parameters
      extract those segments and validate their types before your handler executes.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Segments in the URL like <code>/users/{'{user_id}'}</code> become typed function
        arguments. FastAPI validates types before your handler runs — pass a string where
        an <code>int</code> is expected and you get a <code>422</code> validation error.
      </p>
      <CodePreview
        language="python"
        code={`@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id, "name": "Ada"}`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Path parameters')} />,
  terms: [
    { term: 'path parameter', def: 'A URL segment like /users/{id} mapped to a typed function argument.' },
    { term: '422 validation error', def: 'Returned when a path value cannot be coerced to the declared type.' },
    { term: 'path operation', def: 'A route handler tied to an HTTP method and URL path.' },
  ],
  quiz: [
    {
      q: '@app.get("/items/{item_id}") makes item_id a:',
      options: ['Query parameter', 'Path parameter', 'Request header', 'Cookie'],
      answer: 1,
    },
    {
      q: 'If /users/abc hits a handler expecting user_id: int, FastAPI returns:',
      options: ['200 with abc', '404 Not Found', '422 validation error', '500 server error always'],
      answer: 2,
    },
    {
      q: 'Path parameters are declared in:',
      options: ['The URL path template', 'The Authorization header', 'The response body', 'CORS middleware'],
      answer: 0,
    },
  ],
  recap: [
    <>URL segments in curly braces become typed function arguments.</>,
    <>Wrong types fail with <code>422</code> before your handler runs.</>,
    <>Use path params to identify a specific resource by id or slug.</>,
  ],
})

const fastapiParamsQuery = createChapterLesson({
  id: 'fastapi-params-query',
  modelTitle: 'Query parameters',
  intro: (
    <p className="prose">
      Lists and searches need filtering — <code>?q=keyboard&amp;limit=10</code> passes
      options without changing the URL path. Query parameters power pagination, search,
      and optional flags on the same endpoint.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Values after <code>?</code> in the URL — <code>?q=keyboard&amp;limit=10</code> — map
        to function parameters with defaults. FastAPI treats undecorated parameters with
        defaults as query params.
      </p>
      <CodePreview
        language="python"
        code={`@app.get("/items")
def search_items(q: str = "", limit: int = 10, skip: int = 0):
    ...`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Path & query parameters')} />,
  terms: [
    { term: 'query parameter', def: 'A key=value pair after ? in the URL, mapped to function args with defaults.' },
    { term: 'pagination', def: 'Splitting large result sets using limit and skip (or offset) query params.' },
    { term: 'default value', def: 'Signals to FastAPI that a parameter comes from the query string, not the path.' },
  ],
  quiz: [
    {
      q: 'A parameter like limit: int = 10 in a GET handler is treated as:',
      options: ['Path parameter', 'Query parameter', 'Request body', 'Response header'],
      answer: 1,
    },
    {
      q: 'Query parameters appear in the URL:',
      options: ['Before the domain name', 'After the ? character', 'In the Authorization header', 'In the response body'],
      answer: 1,
    },
    {
      q: 'skip=20&limit=10 typically means:',
      options: ['Delete 20 items', 'Return items 21–30 of a filtered list', 'Skip authentication', 'Return 20 errors'],
      answer: 1,
    },
  ],
  recap: [
    <>Parameters with defaults become query params — <code>?q=mo&amp;limit=2</code>.</>,
    <>Use <code>limit</code> and <code>skip</code> for pagination on list endpoints.</>,
    <>Same path, different queries — one handler, many filter combinations.</>,
  ],
})

const fastapiParamsBody = createChapterLesson({
  id: 'fastapi-params-body',
  modelTitle: 'Request body',
  intro: (
    <p className="prose">
      POST and PUT carry JSON payloads in the request body. FastAPI maps that JSON to a
      Pydantic model so you work with typed Python objects instead of raw dictionaries.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        JSON POST/PUT payloads map to a Pydantic model parameter. Only one body model per
        handler; combine with path and query params in the same function signature.
      </p>
      <CodePreview
        language="python"
        code={`@app.post("/users")
def create_user(body: UserCreate, active: bool = True):
    # body from JSON, active from ?active=true
    ...`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Request body')} />,
  terms: [
    { term: 'request body', def: 'JSON payload sent with POST/PUT; mapped to a Pydantic model parameter.' },
    { term: 'UserCreate', def: 'Example input model — fields define required and optional JSON properties.' },
    { term: 'model_dump()', def: 'Pydantic method to convert a model instance back to a plain dict.' },
  ],
  quiz: [
    {
      q: 'How many body models can a single route handler declare?',
      options: ['Zero', 'One', 'Unlimited', 'Exactly two'],
      answer: 1,
    },
    {
      q: 'In create_user(body: UserCreate, active: bool = True), active comes from:',
      options: ['The JSON body', 'A query parameter', 'A path segment', 'A response header'],
      answer: 1,
    },
    {
      q: 'Request bodies are typical for:',
      options: ['GET /users', 'POST /users', 'DELETE /users/{id} with 204', 'HEAD requests only'],
      answer: 1,
    },
  ],
  recap: [
    <>One Pydantic model per handler receives the JSON body.</>,
    <>Combine body, path, and query params in a single function signature.</>,
    <>FastAPI parses each parameter from the right source automatically.</>,
  ],
})

const fastapiDepsDatabase = createChapterLesson({
  id: 'fastapi-deps-database',
  modelTitle: 'Database dependencies',
  intro: (
    <p className="prose">
      Database connections, sessions, and cleanup belong outside route handlers.
      Dependencies inject shared setup so routes stay thin and tests can swap in fakes.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Shared logic — database connections, auth, pagination — belongs in{' '}
        <strong>dependencies</strong> that FastAPI injects into route handlers:
      </p>
      <CodePreview
        language="python"
        code={`from fastapi import Depends

def get_db():
    db = connect()
    try:
        yield db
    finally:
        db.close()

@app.get("/me")
def read_me(user = Depends(get_current_user)):
    return user`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Dependency injection')} />,
  hood: (
    <UnderTheHood title="Testability">
      <p className="prose">
        In tests, override <code>Depends(get_db)</code> with a fake in-memory database.
        Your route handlers stay unchanged — only the wiring changes.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'dependency injection', def: 'Shared callables FastAPI runs before your handler.' },
    { term: 'Depends', def: 'FastAPI helper that declares an injectable dependency on a route parameter.' },
    { term: 'yield dependency', def: 'A generator dependency that runs cleanup code after the handler finishes.' },
  ],
  quiz: [
    {
      q: 'Depends(get_db) is used for:',
      options: ['CSS styling', 'Injecting shared setup like a DB session', 'Compiling TypeScript', 'React rendering'],
      answer: 1,
    },
    {
      q: 'A yield-based get_db() dependency lets you:',
      options: ['Skip authentication', 'Open a connection and close it after the handler', 'Return HTML', 'Disable CORS'],
      answer: 1,
    },
    {
      q: 'In tests, overriding Depends(get_db) means:',
      options: ['Rewriting every route handler', 'Swapping the DB wiring without changing handler code', 'Deleting OpenAPI docs', 'Disabling validation'],
      answer: 1,
    },
  ],
  recap: [
    <><strong>Depends</strong> injects shared setup — DB sessions, auth, pagination.</>,
    <>Use <code>yield</code> in dependencies for open/close lifecycle management.</>,
    <>Override dependencies in tests to keep handlers unchanged.</>,
  ],
})

const fastapiDepsAuth = createChapterLesson({
  id: 'fastapi-deps-auth',
  modelTitle: 'Auth dependencies',
  intro: (
    <p className="prose">
      Protected routes need to know who is calling. Auth dependencies read tokens, validate
      credentials, and reject unauthorized requests before your business logic runs.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Authentication fits the same <code>Depends</code> pattern — read a bearer token,
        validate it, return the current user. Unauthorized requests raise{' '}
        <code>HTTPException(401)</code> before your handler runs.
      </p>
      <CodePreview
        language="python"
        code={`@app.get("/me")
def read_me(user = Depends(get_current_user)):
    return user`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Auth dependency')} />,
  terms: [
    { term: 'Bearer token', def: 'Common auth scheme: Authorization: Bearer <token>.' },
    { term: 'get_current_user', def: 'A dependency that validates credentials and returns the authenticated user.' },
    { term: '401 Unauthorized', def: 'Status returned when authentication is missing or invalid.' },
  ],
  quiz: [
    {
      q: 'HTTP 401 from get_current_user means:',
      options: ['Server crashed', 'Missing or invalid authentication', 'Validation failed on JSON body', 'Resource not found'],
      answer: 1,
    },
    {
      q: 'Bearer tokens are sent in the:',
      options: ['Response body', 'Authorization header', 'URL path', 'Query string only'],
      answer: 1,
    },
    {
      q: 'Auth as a dependency means unauthorized requests:',
      options: ['Reach the handler anyway', 'Fail with 401 before the handler runs', 'Always return 200', 'Skip CORS checks'],
      answer: 1,
    },
  ],
  recap: [
    <>Reuse <code>Depends(get_current_user)</code> on any route that needs authentication.</>,
    <>Raise <code>HTTPException(401)</code> for missing or invalid tokens.</>,
    <>Same DI pattern as database dependencies — thin routes, shared auth logic.</>,
  ],
})

const fastapiErrors = createChapterLesson({
  id: 'fastapi-errors',
  modelTitle: 'Errors & HTTPException',
  intro: (
    <p className="prose">
      Clients need predictable failures — a 404 means "not found," a 400 means "bad
      request." Clear error responses let frontends show the right message instead of
      guessing what went wrong.
    </p>
  ),
  model: (
    <p className="prose">
      APIs must fail clearly. Raise <code>HTTPException</code> for expected errors;
      return the right status code (404, 400, 401) so clients can react.
    </p>
  ),
  playground: <SnippetRunner snippets={snippets('Status codes & errors')} />,
  terms: [
    { term: 'HTTPException', def: 'Raised to return an error status and JSON detail body.' },
    { term: '404 Not Found', def: 'Resource at the requested URL does not exist.' },
    { term: '204 No Content', def: 'Success with no response body — common for DELETE.' },
  ],
  quiz: [
    {
      q: 'HTTPException is used for:',
      options: ['Unexpected server crashes only', 'Expected errors with a specific status code', 'Successful responses', 'Database migrations'],
      answer: 1,
    },
    {
      q: 'delete_user returns 204 when:',
      options: ['The user was not found', 'The delete succeeded with no body', 'Validation failed', 'Auth is missing'],
      answer: 1,
    },
    {
      q: 'Raising HTTPException(404, "User not found") produces:',
      options: ['A 200 OK with empty body', 'A 404 response with a JSON detail message', 'A redirect to /docs', 'A Python traceback to the client'],
      answer: 1,
    },
  ],
  recap: [
    <>Raise <strong>HTTPException</strong> for expected failures — 404, 400, 401.</>,
    <>Match status codes to the situation so clients can handle errors programmatically.</>,
    <>Use 204 for successful deletes that return no body.</>,
  ],
})

const fastapiHoodAsgi = createChapterLesson({
  id: 'fastapi-hood-asgi',
  modelTitle: 'ASGI & async',
  intro: (
    <p className="prose">
      APIs spend most of their time waiting — on databases, other services, disk I/O.
      Async handlers let the server serve other requests while one route awaits a slow
      operation.
    </p>
  ),
  model: (
    <p className="prose">
      FastAPI runs on <strong>ASGI</strong>. Use <code>async def</code> handlers when
      you <code>await</code> database or HTTP calls — the event loop serves other
      requests while waiting.
    </p>
  ),
  playground: <SnippetRunner snippets={snippets('Async route handler')} />,
  terms: [
    { term: 'ASGI', def: 'The async interface between Python web apps and servers like Uvicorn.' },
    { term: 'async def', def: 'Declares a coroutine handler that can await I/O without blocking the server.' },
    { term: 'await', def: 'Pauses the handler until an async operation completes, freeing the event loop.' },
  ],
  quiz: [
    {
      q: 'async def handlers help when the route:',
      options: ['Only does math', 'Awaits I/O like database or HTTP calls', 'Returns HTML only', 'Has no parameters'],
      answer: 1,
    },
    {
      q: 'FastAPI runs on:',
      options: ['CGI', 'ASGI', 'FTP', 'SMTP'],
      answer: 1,
    },
    {
      q: 'While await fetch_user() is waiting, the ASGI server can:',
      options: ['Only crash', 'Handle other incoming requests', 'Skip validation', 'Disable OpenAPI'],
      answer: 1,
    },
  ],
  recap: [
    <>Use <code>async def</code> + <code>await</code> when handlers wait on I/O.</>,
    <>ASGI (via Uvicorn) keeps the server responsive under concurrent load.</>,
    <>CPU-bound work still blocks — async helps with I/O, not heavy computation.</>,
  ],
})

const fastapiHoodOpenapi = createChapterLesson({
  id: 'fastapi-hood-openapi',
  modelTitle: 'OpenAPI & /docs',
  intro: (
    <p className="prose">
      API consumers need to discover endpoints, parameters, and response shapes without
      reading your source code. OpenAPI turns your type hints into interactive
      documentation automatically.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        FastAPI generates an <strong>OpenAPI</strong> schema from your type hints and
        serves interactive docs at <code>/docs</code> (Swagger UI) and{' '}
        <code>/redoc</code>. Frontend teams explore endpoints without reading source.
      </p>
      <Callout kind="tip" title="Try it locally">
        Run <code>uvicorn main:app --reload</code> and open <code>http://localhost:8000/docs</code>{' '}
        — every route, model, and status code is listed and testable from the browser.
      </Callout>
    </>
  ),
  playground: <OpenApiSim />,
  terms: [
    { term: 'OpenAPI', def: 'A machine-readable API description; powers /docs in FastAPI.' },
    { term: 'Swagger UI', def: 'Interactive docs at /docs where you can try endpoints in the browser.' },
    { term: 'ReDoc', def: 'Alternative documentation UI served at /redoc.' },
  ],
  quiz: [
    {
      q: 'FastAPI automatically generates:',
      options: ['React components', 'OpenAPI docs from type hints', 'SQL migrations', 'Git commits'],
      answer: 1,
    },
    {
      q: 'Interactive Swagger UI is available at:',
      options: ['/users', '/docs', '/admin', '/static'],
      answer: 1,
    },
    {
      q: 'OpenAPI schema is derived from:',
      options: ['Hand-written YAML only', 'Route decorators, type hints, and Pydantic models', 'Database tables alone', 'nginx config'],
      answer: 1,
    },
  ],
  recap: [
    <>OpenAPI schema is generated from your routes and type hints — no separate spec file.</>,
    <><code>/docs</code> and <code>/redoc</code> let teams explore and test endpoints in the browser.</>,
    <>Response models and status codes appear in the docs automatically.</>,
  ],
})

const fastapiHoodCors = createChapterLesson({
  id: 'fastapi-hood-cors',
  modelTitle: 'CORS & React',
  intro: (
    <p className="prose">
      Your React dev server and FastAPI API run on different ports — that is a
      cross-origin request. Browsers block those calls unless the API explicitly allows
      them with CORS headers.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        A React app on <code>localhost:5173</code> calling an API on{' '}
        <code>localhost:8000</code> is a <strong>cross-origin</strong> request. Browsers
        block it unless the API sends CORS headers — configure{' '}
        <code>CORSMiddleware</code> in FastAPI for dev and production origins.
      </p>
      <CodePreview
        language="javascript"
        code={`// React frontend
const res = await fetch("http://localhost:8000/users")
const users = await res.json()`}
      />
    </>
  ),
  playground: <SnippetRunner snippets={snippets('CORS for React frontend')} />,
  terms: [
    { term: 'CORS', def: 'Browser policy; APIs must send Access-Control headers for cross-origin fetch.' },
    { term: 'CORSMiddleware', def: 'FastAPI middleware that adds the headers browsers require for cross-origin requests.' },
    { term: 'cross-origin', def: 'A request from one host/port/scheme to a different one — blocked by default in browsers.' },
  ],
  quiz: [
    {
      q: 'A React app on localhost:5173 calling localhost:8000 needs:',
      options: ['Same port on both', 'CORS headers from the API', 'No HTTP at all', 'GraphQL only'],
      answer: 1,
    },
    {
      q: 'CORSMiddleware is configured on:',
      options: ['The React app only', 'The FastAPI server', 'The database', 'The browser settings panel'],
      answer: 1,
    },
    {
      q: 'Without CORS headers, a browser fetch from React to FastAPI:',
      options: ['Works silently', 'Is blocked by the browser', 'Returns 404 always', 'Skips authentication'],
      answer: 1,
    },
  ],
  recap: [
    <>React (5173) + FastAPI (8000) is cross-origin — configure <code>CORSMiddleware</code>.</>,
    <>Allow your frontend origin in dev and production explicitly.</>,
    <>CORS is a browser policy — server-to-server calls are not affected.</>,
  ],
})

const fastapiHoodStack = createChapterLesson({
  id: 'fastapi-hood-stack',
  modelTitle: 'Full-stack stack',
  intro: (
    <p className="prose">
      A production app combines a UI, an API layer, and persistent storage. FastAPI
      validates and serves JSON at the edge; databases hold authoritative state from
      the persistence lessons.
    </p>
  ),
  model: (
    <p className="prose">
      Understanding where each layer fits helps you debug end-to-end: the React app
      renders UI and calls HTTP endpoints; FastAPI validates requests and orchestrates
      business logic; PostgreSQL or MongoDB stores durable data.
    </p>
  ),
  playground: <FastApiStackSim />,
  hood: (
    <UnderTheHood title="Full-stack stack">
      <p className="prose">
        Typical app: React UI → FastAPI JSON API → PostgreSQL/MongoDB via connector
        libraries from the persistence lessons. FastAPI validates at the edge; databases
        store authoritative state.
      </p>
    </UnderTheHood>
  ),
  terms: [
    { term: 'API layer', def: 'FastAPI sits between the frontend and database, validating and routing requests.' },
    { term: 'authoritative state', def: 'The database holds the source of truth; the API reads and writes it.' },
    { term: 'connector library', def: 'Driver or ORM (e.g. psycopg, Motor) that talks to PostgreSQL or MongoDB.' },
  ],
  quiz: [
    {
      q: 'In a typical React + FastAPI + PostgreSQL app, validation happens:',
      options: ['Only in React', 'At the FastAPI edge before business logic', 'Only in the browser cache', 'In nginx exclusively'],
      answer: 1,
    },
    {
      q: 'Authoritative state is stored in:',
      options: ['React component state only', 'The database', 'OpenAPI docs', 'CORS headers'],
      answer: 1,
    },
    {
      q: 'The data flow for a user action is:',
      options: ['DB → React → FastAPI', 'React → FastAPI → database', 'FastAPI → React → DB with no HTTP', 'OpenAPI → CORS → SQL directly'],
      answer: 1,
    },
  ],
  recap: [
    <>React UI → FastAPI JSON API → PostgreSQL/MongoDB is a common production stack.</>,
    <>FastAPI validates at the edge; the database stores authoritative state.</>,
    <>Each layer has a clear job — UI, API contract, persistence.</>,
  ],
})

export const FASTAPI_CHAPTERS: Record<string, ComponentType> = {
  'fastapi-intro': fastapiIntro,
  'fastapi-routes-basics': fastapiRoutesBasics,
  'fastapi-routes-crud': fastapiRoutesCrud,
  'fastapi-models-request': fastapiModelsRequest,
  'fastapi-models-response': fastapiModelsResponse,
  'fastapi-params-path': fastapiParamsPath,
  'fastapi-params-query': fastapiParamsQuery,
  'fastapi-params-body': fastapiParamsBody,
  'fastapi-deps-database': fastapiDepsDatabase,
  'fastapi-deps-auth': fastapiDepsAuth,
  'fastapi-errors': fastapiErrors,
  'fastapi-hood-asgi': fastapiHoodAsgi,
  'fastapi-hood-openapi': fastapiHoodOpenapi,
  'fastapi-hood-cors': fastapiHoodCors,
  'fastapi-hood-stack': fastapiHoodStack,
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'JSON in & out',
    code: `import json

# A resource is just data. JSON is how it travels over the wire.
user = {"id": 7, "name": "Ada", "roles": ["admin", "user"]}

body = json.dumps(user)          # object -> JSON text (what a server sends)
print("wire:", body)

parsed = json.loads(body)        # JSON text -> object (what a client reads)
print("name:", parsed["name"])
print("is admin:", "admin" in parsed["roles"])`,
  },
  {
    label: 'A tiny REST router',
    code: `# REST maps (method, path) to an action on a resource.
users = {1: "Ada", 2: "Linus"}

def handle(method, path):
    if method == "GET" and path == "/users":
        return 200, list(users.values())
    if method == "GET" and path.startswith("/users/"):
        uid = int(path.split("/")[-1])
        if uid in users:
            return 200, users[uid]
        return 404, {"error": "not found"}
    if method == "POST" and path == "/users":
        return 201, {"created": True}
    return 405, {"error": "method not allowed"}

for req in [("GET", "/users"), ("GET", "/users/2"), ("GET", "/users/9"), ("DELETE", "/users")]:
    print(req, "->", handle(*req))`,
  },
  {
    label: 'Status code families',
    code: `def family(code):
    return {
        2: "Success",
        3: "Redirect",
        4: "Client error (your request)",
        5: "Server error (their fault)",
    }[code // 100]

for code in [200, 201, 301, 400, 404, 500]:
    print(code, "->", family(code))`,
  },
  {
    label: 'Status code meanings',
    code: `    STATUS = {
        200: "OK",
        201: "Created",
        400: "Bad Request",
        401: "Unauthorized",
        404: "Not Found",
        500: "Server Error",
    }
    
    def describe(code):
        return STATUS.get(code, "unknown")
    
    for code in [200, 404, 418]:
        print(code, describe(code))`,
  },

]

export default function ApisLesson() {
  return (
    <Lesson id="apis">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Almost every app is really several programs talking to each other: a
          browser to a backend, a backend to a payment provider, a mobile app to a
          server. An <strong>API</strong> is the contract for those conversations,
          and <strong>REST over HTTP with JSON</strong> is the most common shape it
          takes.
        </p>
        <Callout kind="why" title="The one idea">
          REST models your system as <strong>resources</strong> (nouns, like{' '}
          <code>/users/7</code>) and uses HTTP <strong>methods</strong> (verbs, like{' '}
          <code>GET</code> or <code>POST</code>) to act on them. The response's{' '}
          <strong>status code</strong> says what happened.
        </Callout>
      </Section>

      <Section id="model" title="Resources, verbs & JSON">
        <ul className="prose-list">
          <li>
            A <strong>resource</strong> is a thing you can name with a URL:{' '}
            <code>/articles</code> (a collection) or <code>/articles/42</code> (one
            item).
          </li>
          <li>
            The <strong>method</strong> states intent:{' '}
            <code>GET</code> (read), <code>POST</code> (create), <code>PUT</code>/
            <code>PATCH</code> (update), <code>DELETE</code> (remove). GET should be{' '}
            <strong>safe</strong> (no side effects).
          </li>
          <li>
            <strong>JSON</strong> is the body format both sides agree on — a
            language-neutral way to serialize objects into text and back.
          </li>
          <li>
            The <strong>status code</strong> summarizes the result: 2xx success, 3xx
            redirect, 4xx you messed up, 5xx the server did.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Build a JSON API">
        <p className="prose">
          Run these to see the three pieces in action: JSON serialization, a
          request router that maps method + path to a status and body, and how status
          codes group into families.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>A tiny REST router</strong>, add a request{' '}
          <code>("GET", "/users/1")</code> to the loop and run it. Then change a user
          id to one that doesn't exist and watch the status become <code>404</code>.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Idempotency: why the verb matters">
          <p className="prose">
            <code>GET</code>, <code>PUT</code>, and <code>DELETE</code> are{' '}
            <strong>idempotent</strong> — doing them twice has the same effect as
            once. <code>POST</code> is not: submit a payment twice and you may be
            charged twice. This is why browsers warn before re-submitting a form, and
            why clients can safely retry a failed <code>GET</code> but not a{' '}
            <code>POST</code>.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Stateless requests">
          <p className="prose">
            REST is <strong>stateless</strong>: each request carries everything the
            server needs (URL, headers, body, auth token). The server keeps no memory
            of previous requests. That's what lets you run many identical servers
            behind a load balancer — any of them can handle any request (the same
            idea from the Compute Instances chapter).
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'API', def: 'A contract describing how programs request and exchange data.' },
            { term: 'REST', def: 'An architectural style: resources named by URLs, acted on with HTTP verbs.' },
            { term: 'resource', def: 'A named thing you can address with a URL.' },
            { term: 'JSON', def: 'A text format for serializing objects; the common API body format.' },
            { term: 'endpoint', def: 'A specific method + path the API responds to.' },
            { term: 'status code', def: 'A number summarizing the outcome (2xx/3xx/4xx/5xx).' },
            { term: 'idempotent', def: 'An operation that has the same effect whether done once or many times.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which HTTP method should be safe (cause no side effects)?',
              options: ['POST', 'DELETE', 'GET', 'PATCH'],
              answer: 2,
              explain: 'GET only reads; it should never change server state.',
            },
            {
              q: 'A response with status 404 means:',
              options: ['Success', 'The server crashed', 'The requested resource was not found (client error)', 'Redirect'],
              answer: 2,
              explain: '4xx codes are client errors; 404 specifically means "not found".',
            },
            {
              q: 'What does "stateless" mean for a REST API?',
              options: [
                'It cannot store data anywhere',
                'Each request carries everything needed; the server keeps no per-client memory',
                'It has no database',
                'It only supports GET',
              ],
              answer: 1,
              explain: 'Statelessness lets any server instance handle any request.',
            },

            {
              q: 'REST POST to `/users` typically:',
              options: [
                'Deletes a user',
              'Creates a new user resource',
              'Lists all users',
              'Returns 404',
              ],
              answer: 1,
              explain: 'POST on a collection URL usually creates a new item.',
            },
            {
              q: 'HTTP 201 Created often means:',
              options: [
                'Server error',
              'Resource was created successfully',
              'Redirect',
              'Unauthorized',
              ],
              answer: 1,
              explain: '201 is the standard success response after creation.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>An <strong>API</strong> is the contract for programs talking to each other.</>,
            <><strong>REST</strong> = resources (URLs) acted on by HTTP verbs, with JSON bodies.</>,
            <><strong>Status codes</strong> group into 2xx/3xx/4xx/5xx families.</>,
            <>REST is <strong>stateless</strong>, so requests scale horizontally.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

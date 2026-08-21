import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { MongoPlayground } from './MongoPlayground.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Documents as dicts',
    code: `order = {
    "_id": 1,
    "customer_id": 1,
    "product": "Keyboard",
    "amount": 80.0,
    "status": "shipped",
    "tags": ["hardware", "peripherals"],
}

print(order["product"])
print("shipped?", order["status"] == "shipped")
print("tags:", order["tags"])`,
  },
  {
    label: 'Filter documents',
    code: `orders = [
    {"_id": 1, "city": "London", "amount": 80, "status": "shipped"},
    {"_id": 2, "city": "London", "amount": 220, "status": "shipped"},
    {"_id": 3, "city": "New York", "amount": 50, "status": "pending"},
]

def find(docs, filt):
    out = []
    for doc in docs:
        ok = True
        for key, val in filt.items():
            if isinstance(val, dict):
                if "$gt" in val and not doc[key] > val["$gt"]:
                    ok = False
            elif doc.get(key) != val:
                ok = False
        if ok:
            out.append(doc)
    return out

print(find(orders, {"city": "London"}))
print(find(orders, {"amount": {"$gt": 100}}))`,
  },
  {
    label: 'Group & sum (aggregation)',
    code: `orders = [
    {"city": "London", "amount": 80, "status": "shipped"},
    {"city": "London", "amount": 220, "status": "shipped"},
    {"city": "New York", "amount": 50, "status": "pending"},
    {"city": "New York", "amount": 1300, "status": "shipped"},
]

totals = {}
for o in orders:
    if o["status"] != "shipped":
        continue
    bucket = totals.setdefault(o["city"], {"orders": 0, "revenue": 0})
    bucket["orders"] += 1
    bucket["revenue"] += o["amount"]

for city, stats in sorted(totals.items(), key=lambda x: -x[1]["revenue"]):
    print(city, stats)`,
  },
  {
    label: 'PyMongo-style client',
    code: `# pymongo — synchronous Python driver
# mongodb://user:pass@host:27017/mydb

class FakeCollection:
    def __init__(self, name, docs):
        self.name = name
        self.docs = docs
    def find_one(self, filt):
        for d in self.docs:
            if all(d.get(k) == v for k, v in filt.items()):
                return d
        return None
    def insert_one(self, doc):
        doc = dict(doc)
        doc.setdefault("_id", len(self.docs) + 1)
        self.docs.append(doc)
        return doc["_id"]

db = {"orders": FakeCollection("orders", [
    {"_id": 1, "city": "London", "amount": 80},
])}
oid = db["orders"].insert_one({"city": "Paris", "amount": 120})
print("inserted id:", oid)
print("find:", db["orders"].find_one({"city": "Paris"}))`,
  },
  {
    label: 'Connection URI & options',
    code: `def parse_mongo_uri(uri):
    # mongodb+srv://user:pass@cluster.example.mongodb.net/app?retryWrites=true
    scheme, rest = uri.split("://", 1)
    creds_host, db_part = rest.split("/", 1)
    user, host = creds_host.split("@")
    user, password = user.split(":")
    db, _, opts = db_part.partition("?")
    options = dict(p.split("=") for p in opts.split("&") if p)
    return {
        "scheme": scheme, "user": user, "host": host,
        "database": db, "options": options,
    }

uri = "mongodb+srv://app:secret@cluster0.abc.mongodb.net/shop?retryWrites=true&w=majority"
print(parse_mongo_uri(uri))`,
  },
  {
    label: 'Motor async pattern',
    code: `# Motor wraps PyMongo for asyncio — same API, non-blocking I/O
import asyncio

class AsyncCollection:
    async def find_one(self, filt):
        await asyncio.sleep(0.05)   # simulate network wait
        return {"_id": 1, "name": "Ada"}

async def handler():
    coll = AsyncCollection()
    doc = await coll.find_one({"_id": 1})
    print("fetched:", doc)

asyncio.run(handler())
print("async driver frees the event loop during I/O")`,
  },
]

export default function MongodbLesson() {
  return (
    <Lesson id="mongodb">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Not every problem fits neatly into rows and columns. <strong>MongoDB</strong>{' '}
          is a popular <strong>document database</strong> — it stores flexible JSON-like
          records called <strong>documents</strong> grouped into{' '}
          <strong>collections</strong>. Startups and large teams use it when schemas
          evolve quickly or when nested data is the natural shape.
        </p>
        <Callout kind="why" title="The one idea">
          Instead of joining tables, you often embed related data in one document —
          or reference another document's <code>_id</code> when sharing is needed.
        </Callout>
      </Section>

      <Section id="model" title="Documents & collections">
        <p className="prose">
          A <strong>document</strong> is a JSON object with fields of mixed types —
          strings, numbers, arrays, nested objects. A <strong>collection</strong> is
          like a table, but every document in it need not share the same fields.
        </p>
        <ul className="prose-list">
          <li><code>_id</code> — unique identifier for each document (like a primary key).</li>
          <li><strong>Flexible schema</strong> — new fields can appear on some documents only.</li>
          <li><strong>Embedded arrays</strong> — e.g. <code>tags: ["vip", "eu"]</code> inside a customer.</li>
          <li><strong>References</strong> — e.g. <code>customer_id: 2</code> pointing at another document.</li>
        </ul>
        <Callout kind="tip" title="SQL vs MongoDB">
          SQL normalizes data across tables; MongoDB often denormalizes for read speed.
          Neither is "better" — pick based on access patterns, team skills, and how
          often the shape of your data changes.
        </Callout>
      </Section>

      <Section id="queries" title="Finding documents">
        <p className="prose">
          MongoDB queries are JSON filters, not SQL strings. A plain match means equality;
          operators like <code>$gt</code>, <code>$in</code>, and <code>$regex</code>{' '}
          express richer conditions.
        </p>
        <ul className="prose-list">
          <li><code>db.orders.find(&#123; "city": "London" &#125;)</code></li>
          <li><code>db.orders.find(&#123; "amount": &#123; "$gt": 100 &#125; &#125;)</code></li>
          <li><code>db.customers.find(&#123; "tags": &#123; "$in": ["vip"] &#125; &#125;)</code></li>
        </ul>
      </Section>

      <Section id="writes" title="Insert, update & delete">
        <p className="prose">
          Writes target documents, not rows defined by a rigid schema. Updates often use
          operators like <code>$set</code> to change specific fields without replacing
          the whole document.
        </p>
        <ul className="prose-list">
          <li><code>insertOne(&#123; … &#125;)</code> — add a document; MongoDB assigns an <code>_id</code> if missing.</li>
          <li><code>updateMany(filter, &#123; "$set": &#123; … &#125; &#125;)</code> — patch matching docs.</li>
          <li><code>deleteMany(filter)</code> — remove all matches.</li>
        </ul>
        <Callout kind="warning" title="Schema discipline still matters">
          Flexible schema doesn't mean "no schema." Teams still define expected fields,
          validate on write, and migrate documents as the product evolves — otherwise
          typos become permanent inconsistent data.
        </Callout>
      </Section>

      <Section id="aggregation" title="Aggregation pipelines">
        <p className="prose">
          The <strong>aggregation pipeline</strong> is MongoDB's answer to SQL's{' '}
          <code>GROUP BY</code>. Documents flow through stages —{' '}
          <code>$match</code>, <code>$group</code>, <code>$sort</code>,{' '}
          <code>$limit</code> — each transforming the stream.
        </p>
        <Callout kind="note">
          <code>$group</code> with <code>$sum</code> totals revenue per city;{' '}
          <code>$avg</code> computes average product price per category. Pipelines
          are composable — add stages until the output shape is what you need.
        </Callout>
      </Section>

      <Section id="conn-pymongo" title="PyMongo driver">
        <p className="prose">
          <strong>PyMongo</strong> is the standard synchronous Python driver. A{' '}
          <code>MongoClient</code> manages the connection pool; you pick a database and
          collection, then call methods like <code>find</code>, <code>insert_one</code>,
          and <code>update_many</code>.
        </p>
        <pre className="term-output">{`from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["shop"]
orders = db.orders.find({"status": "shipped"}).limit(10)

for doc in orders:
    print(doc["city"], doc["amount"])`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'PyMongo-style client')} />
        <TryThis>
          Run the snippet, insert a document, then find it back by city.
        </TryThis>
      </Section>

      <Section id="conn-uri" title="Connection URIs">
        <p className="prose">
          Connection details are encoded in a <strong>URI</strong>. Atlas (managed
          hosting) uses <code>mongodb+srv://</code> with TLS; self-hosted uses{' '}
          <code>mongodb://host:27017/dbname</code>. Query parameters set options like{' '}
          <code>retryWrites</code> and <code>w=majority</code>.
        </p>
        <pre className="term-output">{`mongodb+srv://user:pass@cluster0.abc.mongodb.net/shop?retryWrites=true&w=majority`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Connection URI & options')} />
        <Callout kind="note" title="Atlas vs self-hosted">
          The driver API is identical — only the URI and TLS setup differ. Never commit
          credentials; use environment variables in production.
        </Callout>
      </Section>

      <Section id="conn-motor" title="Motor (async driver)">
        <p className="prose">
          <strong>Motor</strong> wraps PyMongo for <code>asyncio</code>. In FastAPI
          handlers you <code>await</code> database calls so the event loop can serve
          other requests while waiting on the network — the same concurrency idea as
          async HTTP handlers.
        </p>
        <pre className="term-output">{`from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(uri)
doc = await client.shop.orders.find_one({"_id": order_id})`}</pre>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Motor async pattern')} />
        <TryThis>
          Run the Motor snippet and note the simulated network delay — the event loop
          stays free during <code>await</code>.
        </TryThis>
      </Section>

      <Section id="conn-odm" title="ODMs (Beanie / MongoEngine)">
        <p className="prose">
          <strong>ODMs</strong> (object-document mappers) map Python classes to MongoDB
          collections — like SQLAlchemy for SQL. <strong>Beanie</strong> (async, Pydantic-based)
          and <strong>MongoEngine</strong> (sync) add validation, defaults, and query helpers.
        </p>
        <pre className="term-output">{`# Beanie + Pydantic (conceptual)
class Order(Document):
    city: str
    amount: float
    status: str = "pending"

# await Order.find(Order.amount > 100).to_list()`}</pre>
        <Callout kind="tip" title="When to use an ODM">
          ODMs shine when documents map cleanly to typed models and you want validation
          on write. Raw PyMongo is fine for ad-hoc queries, aggregations, and scripts.
        </Callout>
      </Section>

      <Section id="playground" title="Run MongoDB commands">
        <p className="prose">
          This playground runs a MongoDB-style shell against an in-memory document store
          in your browser. Try the samples for find filters, aggregation, and writes —
          then edit the JSON and re-run.
        </p>
        <MongoPlayground />
        <TryThis>
          Run <strong>Aggregate revenue</strong>, then add a <code>$limit: 2</code>{' '}
          stage. Run <strong>Insert document</strong> and <strong>Find all orders</strong>{' '}
          to see it appear. Compare with the SQL lesson's JOIN approach.
        </TryThis>
      </Section>

      <Section id="labs" title="Code lab">
        <p className="prose">
          MongoDB documents are just JSON-shaped data. These Python snippets show the
          same ideas — filtering, operators, and grouping — without a server.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Extend <strong>Filter documents</strong> to support <code>$in</code> on a
          list field, then mirror it in the playground with{' '}
          <code>db.customers.find(&#123; "tags": &#123; "$in": ["eu"] &#125; &#125;)</code>.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="When to embed vs reference">
          <p className="prose">
            <strong>Embed</strong> related data when you read it together and it doesn't
            change often (order line items inside an order). <strong>Reference</strong>{' '}
            with an <code>_id</code> when the same entity is shared and updated independently
            (customer profile linked from many orders).
          </p>
        </UnderTheHood>
        <UnderTheHood title="Indexes in MongoDB">
          <p className="prose">
            Like SQL, MongoDB uses <strong>indexes</strong> (often B-trees) to avoid
            scanning every document. Create indexes on fields you filter and sort by —
            <code>orders.city</code>, <code>customers.email</code>, compound indexes
            for common query patterns.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Replication & sharding">
          <p className="prose">
            Production MongoDB clusters replicate data for durability and shard collections
            across machines when a single server can't hold the dataset. That's how
            document stores scale horizontally — at the cost of operational complexity.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'document', def: 'A JSON-like record stored in MongoDB.' },
            { term: 'collection', def: 'A group of documents — loosely like a SQL table.' },
            { term: '_id', def: 'Unique identifier for a document within a collection.' },
            { term: 'embedding', def: 'Storing related data inside a document instead of joining.' },
            { term: 'aggregation pipeline', def: 'A sequence of stages ($match, $group, …) transforming documents.' },
            { term: 'operator', def: 'A query keyword like $gt, $in, or $set.' },
            { term: 'shard', def: 'A horizontal partition of data across cluster nodes.' },
            { term: 'driver', def: 'Library connecting your app to MongoDB (PyMongo, Motor).' },
            { term: 'connection URI', def: 'String encoding hosts, credentials, database, and options.' },
            { term: 'ODM', def: 'Object-document mapper — Python classes mapped to collections.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'In MongoDB, a document is best described as:',
              options: ['A row with fixed columns', 'A flexible JSON-like record', 'A SQL view', 'An index'],
              answer: 1,
              explain: 'Documents are schemaless JSON objects — fields can vary between records.',
            },
            {
              q: 'What does db.orders.find({ "amount": { "$gt": 100 } }) return?',
              options: ['Orders equal to 100', 'Orders with amount greater than 100', 'The 100 newest orders', 'An error'],
              answer: 1,
              explain: '$gt is a comparison operator meaning "greater than".',
            },
            {
              q: 'Aggregation $group with $sum is most similar to SQL:',
              options: ['ORDER BY', 'GROUP BY with SUM', 'LEFT JOIN', 'CREATE INDEX'],
              answer: 1,
              explain: '$group collapses documents; $sum totals a field per group.',
            },
            {
              q: 'When should you embed data vs reference it?',
              options: ['Always embed', 'Embed when read together; reference when shared and updated independently', 'Always reference', 'Never embed arrays'],
              answer: 1,
              explain: 'Embedding avoids joins on read; referencing avoids stale duplicated data.',
            },
            {
              q: 'Flexible schema means:',
              options: ['No validation ever', 'Documents in a collection can have different fields', 'No indexes needed', 'SQL is unsupported'],
              answer: 1,
              explain: 'Collections tolerate varying shapes — but teams still enforce conventions.',
            },
            {
              q: 'updateMany with { "$set": { "status": "shipped" } }:',
              options: ['Deletes documents', 'Replaces entire documents', 'Patches a field on matching documents', 'Creates an index'],
              answer: 2,
              explain: '$set updates specific fields without removing the rest of the document.',
            },
            {
              q: 'MongoDB scales out horizontally mainly via:',
              options: ['More indexes only', 'Sharding data across nodes', 'Smaller documents', 'Removing _id'],
              answer: 1,
              explain: 'Sharding splits collections across machines when one node is not enough.',
            },
            {
              q: 'Motor is used when you need:',
              options: ['Synchronous blocking I/O only', 'Async/await database calls in asyncio', 'SQL queries', 'React components'],
              answer: 1,
            },
            {
              q: 'A MongoDB connection URI typically includes:',
              options: ['Only the database name', 'Host, credentials, database, and options', 'React props', 'CSS classes'],
              answer: 1,
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>MongoDB stores <strong>documents</strong> in <strong>collections</strong> with flexible fields.</>,
            <>Query with JSON filters and operators like <code>$gt</code> and <code>$in</code>.</>,
            <>Use <strong>aggregation pipelines</strong> for grouping and analytics.</>,
            <>Choose <strong>embed vs reference</strong> based on read patterns and update independence.</>,
            <>Indexes, replication, and sharding matter at production scale — same ideas as SQL, different tooling.</>,
            <><strong>PyMongo</strong> / <strong>Motor</strong> connect your app; parse the <strong>URI</strong> for host, auth, and options.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

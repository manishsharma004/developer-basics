import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { SnippetRunner } from '../components/SnippetRunner.tsx'
import { MongoPlayground } from './MongoPlayground.tsx'
import { MONGODB_SNIPPETS, snippets } from './snippets.ts'

const mongodbIntro = createChapterLesson({
  id: 'mongodb-intro',
  modelTitle: 'Document databases',
  intro: (
    <p className="prose">
      Not every problem fits neatly into rows and columns. <strong>MongoDB</strong> is a
      popular <strong>document database</strong> — it stores flexible JSON-like records
      called <strong>documents</strong> grouped into <strong>collections</strong>. Startups
      and large teams use it when schemas evolve quickly or when nested data is the natural
      shape.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Instead of joining tables, you often embed related data in one document — or
        reference another document's <code>_id</code> when sharing is needed.
      </Callout>
      <p className="prose">
        Document databases trade rigid table schemas for flexible records. That fits products
        where fields change often, nested objects are common, or read patterns favor
        fetching one rich document instead of many joined rows.
      </p>
    </>
  ),
  playground: (
    <>
      <MongoPlayground sampleLabels={['Find all orders']} />
      <TryThis>
        Run <strong>Find all orders</strong>, then add <code>"status": "shipped"</code> to the filter.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'document', def: 'A JSON-like record stored in MongoDB.' },
    { term: 'collection', def: 'A group of documents — loosely like a SQL table.' },
    { term: 'embedding', def: 'Storing related data inside a document instead of joining.' },
  ],
  quiz: [
    {
      q: 'In MongoDB, a document is best described as:',
      options: ['A row with fixed columns', 'A flexible JSON-like record', 'A SQL view', 'An index'],
      answer: 1,
      explain: 'Documents are schemaless JSON objects — fields can vary between records.',
    },
    {
      q: 'Flexible schema means:',
      options: ['No validation ever', 'Documents in a collection can have different fields', 'No indexes needed', 'SQL is unsupported'],
      answer: 1,
      explain: 'Collections tolerate varying shapes — but teams still enforce conventions.',
    },
    {
      q: 'When should you embed data vs reference it?',
      options: ['Always embed', 'Embed when read together; reference when shared and updated independently', 'Always reference', 'Never embed arrays'],
      answer: 1,
      explain: 'Embedding avoids joins on read; referencing avoids stale duplicated data.',
    },
  ],
  recap: [
    <>MongoDB stores <strong>documents</strong> in <strong>collections</strong> with flexible fields.</>,
    <>Choose <strong>embed vs reference</strong> based on read patterns and update independence.</>,
    <>Document databases fit evolving schemas and nested data shapes.</>,
  ],
})

const mongodbDocuments = createChapterLesson({
  id: 'mongodb-documents',
  modelTitle: 'Documents & collections',
  intro: (
    <p className="prose">
      Before writing queries, understand what you are storing. A MongoDB{' '}
      <strong>document</strong> is a single JSON object; a <strong>collection</strong> holds
      many documents that need not share identical fields.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        A <strong>document</strong> is a JSON object with fields of mixed types — strings,
        numbers, arrays, nested objects. A <strong>collection</strong> is like a table, but
        every document in it need not share the same fields.
      </p>
      <ul className="prose-list">
        <li><code>_id</code> — unique identifier for each document (like a primary key).</li>
        <li><strong>Flexible schema</strong> — new fields can appear on some documents only.</li>
        <li><strong>Embedded arrays</strong> — e.g. <code>tags: ["vip", "eu"]</code> inside a customer.</li>
        <li><strong>References</strong> — e.g. <code>customer_id: 2</code> pointing at another document.</li>
      </ul>
      <Callout kind="tip" title="SQL vs MongoDB">
        SQL normalizes data across tables; MongoDB often denormalizes for read speed. Neither
        is "better" — pick based on access patterns, team skills, and how often the shape of
        your data changes.
      </Callout>
    </>
  ),
  playground: <MongoPlayground sampleLabels={['Find all orders', 'Filter by city']} />,
  terms: [
    { term: 'document', def: 'A JSON-like record stored in MongoDB.' },
    { term: 'collection', def: 'A group of documents — loosely like a SQL table.' },
    { term: '_id', def: 'Unique identifier for a document within a collection.' },
    { term: 'embedding', def: 'Storing related data inside a document instead of joining.' },
  ],
  quiz: [
    {
      q: 'What is the role of _id on a document?',
      options: ['A foreign key only', 'A unique identifier within the collection', 'An index name', 'A collection name'],
      answer: 1,
    },
    {
      q: 'Embedded arrays let you store:',
      options: ['Only strings', 'Nested lists inside a document', 'SQL JOIN results', 'Index definitions'],
      answer: 1,
    },
    {
      q: 'Flexible schema means:',
      options: ['No validation ever', 'Documents in a collection can have different fields', 'No indexes needed', 'SQL is unsupported'],
      answer: 1,
      explain: 'Collections tolerate varying shapes — but teams still enforce conventions.',
    },
  ],
  recap: [
    <>A <strong>document</strong> is a JSON object; a <strong>collection</strong> groups many documents.</>,
    <><code>_id</code> uniquely identifies each document within a collection.</>,
    <>Embed arrays and nested objects when that matches how you read the data.</>,
  ],
})

const mongodbQueries = createChapterLesson({
  id: 'mongodb-queries',
  modelTitle: 'Query filters',
  intro: (
    <p className="prose">
      MongoDB reads start with a filter — a JSON object describing which documents match.
      Plain field matches mean equality; operators express richer conditions without SQL strings.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        MongoDB queries are JSON filters, not SQL strings. A plain match means equality;
        operators like <code>$gt</code>, <code>$in</code>, and <code>$regex</code> express
        richer conditions.
      </p>
      <ul className="prose-list">
        <li><code>db.orders.find(&#123; "city": "London" &#125;)</code></li>
        <li><code>db.orders.find(&#123; "amount": &#123; "$gt": 100 &#125; &#125;)</code></li>
        <li><code>db.customers.find(&#123; "tags": &#123; "$in": ["vip"] &#125; &#125;)</code></li>
      </ul>
    </>
  ),
  playground: (
    <MongoPlayground sampleLabels={['Filter by city', 'Comparison operators', 'Array membership']} />
  ),
  terms: [
    { term: 'operator', def: 'A query keyword like $gt, $in, or $set.' },
    { term: 'filter', def: 'A JSON object passed to find() describing matching documents.' },
    { term: 'find', def: 'Returns documents that match a filter from a collection.' },
  ],
  quiz: [
    {
      q: 'What does db.orders.find({ "amount": { "$gt": 100 } }) return?',
      options: ['Orders equal to 100', 'Orders with amount greater than 100', 'The 100 newest orders', 'An error'],
      answer: 1,
      explain: '$gt is a comparison operator meaning "greater than".',
    },
    {
      q: 'A plain field match like { "city": "London" } means:',
      options: ['City contains London as substring', 'City equals London', 'City is greater than London', 'Return 404'],
      answer: 1,
    },
    {
      q: '$in on an array field matches documents where:',
      options: ['The field equals the entire array', 'The field value is one of the listed values', 'The document has no array', 'The index is missing'],
      answer: 1,
    },
  ],
  recap: [
    <>Query with JSON filters — plain fields mean equality.</>,
    <>Use operators like <code>$gt</code> and <code>$in</code> for comparisons and membership.</>,
    <>Filters mirror the shape of the documents you store.</>,
  ],
})

const mongodbWrites = createChapterLesson({
  id: 'mongodb-writes',
  modelTitle: 'Document writes',
  intro: (
    <p className="prose">
      Creating and changing data in MongoDB targets whole documents or specific fields.
      Updates often patch with <code>$set</code> instead of replacing the entire record.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Writes target documents, not rows defined by a rigid schema. Updates often use
        operators like <code>$set</code> to change specific fields without replacing the
        whole document.
      </p>
      <ul className="prose-list">
        <li><code>insertOne(&#123; … &#125;)</code> — add a document; MongoDB assigns an <code>_id</code> if missing.</li>
        <li><code>updateMany(filter, &#123; "$set": &#123; … &#125; &#125;)</code> — patch matching docs.</li>
        <li><code>deleteMany(filter)</code> — remove all matches.</li>
      </ul>
      <Callout kind="warning" title="Schema discipline still matters">
        Flexible schema doesn't mean "no schema." Teams still define expected fields,
        validate on write, and migrate documents as the product evolves — otherwise typos
        become permanent inconsistent data.
      </Callout>
    </>
  ),
  playground: (
    <MongoPlayground sampleLabels={['Insert document', 'Update many', 'Delete cancelled']} />
  ),
  terms: [
    { term: 'insertOne', def: 'Adds a single document to a collection.' },
    { term: '$set', def: 'Update operator that changes specific fields without replacing the whole document.' },
    { term: 'deleteMany', def: 'Removes all documents matching a filter.' },
  ],
  quiz: [
    {
      q: 'updateMany with { "$set": { "status": "shipped" } }:',
      options: ['Deletes documents', 'Replaces entire documents', 'Patches a field on matching documents', 'Creates an index'],
      answer: 2,
      explain: '$set updates specific fields without removing the rest of the document.',
    },
    {
      q: 'insertOne on a document without _id:',
      options: ['Fails always', 'MongoDB assigns an _id', 'Deletes the collection', 'Requires a SQL transaction'],
      answer: 1,
    },
    {
      q: 'deleteMany(filter) removes:',
      options: ['Only the first match', 'All documents matching the filter', 'The entire database', 'Indexes only'],
      answer: 1,
    },
  ],
  recap: [
    <><code>insertOne</code> adds documents; MongoDB generates <code>_id</code> when omitted.</>,
    <>Patch fields with <code>$set</code> in <code>updateMany</code> — avoid replacing whole documents unnecessarily.</>,
    <>Validate on write even with flexible schema — typos become bad data fast.</>,
  ],
})

const mongodbAggregation = createChapterLesson({
  id: 'mongodb-aggregation',
  modelTitle: 'Aggregation',
  intro: (
    <p className="prose">
      Analytics and summaries often need grouping, filtering, and sorting in one pass.
      MongoDB's <strong>aggregation pipeline</strong> chains stages that transform a stream
      of documents — the document-store answer to SQL's <code>GROUP BY</code>.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        The <strong>aggregation pipeline</strong> is MongoDB's answer to SQL's{' '}
        <code>GROUP BY</code>. Documents flow through stages — <code>$match</code>,{' '}
        <code>$group</code>, <code>$sort</code>, <code>$limit</code> — each transforming
        the stream.
      </p>
      <Callout kind="note">
        <code>$group</code> with <code>$sum</code> totals revenue per city; <code>$avg</code>{' '}
        computes average product price per category. Pipelines are composable — add stages
        until the output shape is what you need.
      </Callout>
    </>
  ),
  playground: (
    <MongoPlayground sampleLabels={['Aggregate revenue', 'Average price by category']} />
  ),
  terms: [
    { term: 'aggregation pipeline', def: 'A sequence of stages ($match, $group, …) transforming documents.' },
    { term: '$match', def: 'Pipeline stage that filters documents like find().' },
    { term: '$group', def: 'Pipeline stage that collapses documents and computes aggregates per key.' },
  ],
  quiz: [
    {
      q: 'Aggregation $group with $sum is most similar to SQL:',
      options: ['ORDER BY', 'GROUP BY with SUM', 'LEFT JOIN', 'CREATE INDEX'],
      answer: 1,
      explain: '$group collapses documents; $sum totals a field per group.',
    },
    {
      q: 'Which stage filters documents at the start of a pipeline?',
      options: ['$limit', '$match', '$sort', '$set'],
      answer: 1,
    },
    {
      q: 'Pipeline stages are applied:',
      options: ['In random order', 'Sequentially, each transforming the stream', 'Only once per database', 'By the React frontend'],
      answer: 1,
    },
  ],
  recap: [
    <>Build pipelines with <code>$match</code>, <code>$group</code>, <code>$sort</code>, <code>$limit</code>.</>,
    <><code>$group</code> + <code>$sum</code> totals fields per key — like SQL <code>GROUP BY</code>.</>,
    <>Add stages until the output shape matches what your app needs.</>,
  ],
})

const mongodbConnPymongo = createChapterLesson({
  id: 'mongodb-conn-pymongo',
  modelTitle: 'PyMongo',
  intro: (
    <p className="prose">
      Application code talks to MongoDB through a <strong>driver</strong>.{' '}
      <strong>PyMongo</strong> is the standard synchronous Python client — connect once,
      pick a database and collection, then call methods like <code>find</code> and{' '}
      <code>insert_one</code>.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        A <code>MongoClient</code> manages the connection pool; you pick a database and
        collection, then call methods like <code>find</code>, <code>insert_one</code>, and{' '}
        <code>update_many</code>.
      </p>
      <CodePreview
        language="python"
        code={`from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["shop"]
orders = db.orders.find({"status": "shipped"}).limit(10)

for doc in orders:
    print(doc["city"], doc["amount"])`}
      />
    </>
  ),
  playground: (
    <>
      <SnippetRunner snippets={snippets('PyMongo-style client')} />
      <TryThis>
        Run the snippet, insert a document, then find it back by city.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'driver', def: 'Library connecting your app to MongoDB (PyMongo, Motor).' },
    { term: 'MongoClient', def: 'PyMongo entry point that manages connections to the cluster.' },
    { term: 'collection', def: 'A group of documents — accessed as db.orders in PyMongo.' },
  ],
  quiz: [
    {
      q: 'PyMongo is used for:',
      options: ['Rendering React components', 'Synchronous Python access to MongoDB', 'Compiling TypeScript', 'Writing CSS'],
      answer: 1,
    },
    {
      q: 'In PyMongo, db.orders refers to:',
      options: ['A SQL table alias', 'The orders collection in the selected database', 'An HTTP route', 'A React hook'],
      answer: 1,
    },
    {
      q: 'MongoClient primarily manages:',
      options: ['DOM updates', 'Connection pooling to MongoDB', 'Git commits', 'JWT signing'],
      answer: 1,
    },
  ],
  recap: [
    <><strong>PyMongo</strong>: <code>MongoClient</code> → database → collection → <code>find</code> / <code>insert_one</code>.</>,
    <>The driver API mirrors MongoDB shell concepts — filters are JSON objects.</>,
    <>Use environment variables for credentials — never commit connection strings.</>,
  ],
})

const mongodbConnUri = createChapterLesson({
  id: 'mongodb-conn-uri',
  modelTitle: 'Connection strings',
  intro: (
    <p className="prose">
      Hosts, credentials, database names, and driver options travel in one{' '}
      <strong>connection URI</strong>. The same PyMongo code works against local servers
      and Atlas — only the URI (and TLS setup) changes.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        Connection details are encoded in a <strong>URI</strong>. Atlas (managed hosting)
        uses <code>mongodb+srv://</code> with TLS; self-hosted uses{' '}
        <code>mongodb://host:27017/dbname</code>. Query parameters set options like{' '}
        <code>retryWrites</code> and <code>w=majority</code>.
      </p>
      <CodePreview
        language="python"
        code={`mongodb+srv://user:pass@cluster0.abc.mongodb.net/shop?retryWrites=true&w=majority`}
      />
      <Callout kind="note" title="Atlas vs self-hosted">
        The driver API is identical — only the URI and TLS setup differ. Never commit
        credentials; use environment variables in production.
      </Callout>
    </>
  ),
  playground: <SnippetRunner snippets={snippets('Connection URI & options')} />,
  terms: [
    { term: 'connection URI', def: 'String encoding hosts, credentials, database, and options.' },
    { term: 'mongodb+srv', def: 'DNS seedlist URI scheme used by MongoDB Atlas with TLS.' },
    { term: 'write concern', def: 'Options like w=majority controlling how many nodes acknowledge a write.' },
  ],
  quiz: [
    {
      q: 'A MongoDB connection URI typically includes:',
      options: ['Only the database name', 'Host, credentials, database, and options', 'React props', 'CSS classes'],
      answer: 1,
    },
    {
      q: 'mongodb+srv:// is commonly used for:',
      options: ['Local SQLite files', 'MongoDB Atlas clusters', 'Static HTML sites', 'Redis caches'],
      answer: 1,
    },
    {
      q: 'Query parameters after ? in a URI configure:',
      options: ['React state', 'Driver options like retryWrites', 'SQL JOIN order', 'CSS themes'],
      answer: 1,
    },
  ],
  recap: [
    <>Encode host, auth, database, and options in one <strong>URI</strong>.</>,
    <><code>mongodb+srv://</code> targets Atlas; <code>mongodb://</code> targets self-hosted servers.</>,
    <>Load URIs from environment variables — never commit secrets.</>,
  ],
})

const mongodbConnMotor = createChapterLesson({
  id: 'mongodb-conn-motor',
  modelTitle: 'Motor async',
  intro: (
    <p className="prose">
      FastAPI handlers should not block the event loop while waiting on the network.{' '}
      <strong>Motor</strong> wraps PyMongo for <code>asyncio</code> so you{' '}
      <code>await</code> database calls like any other async I/O.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        In FastAPI handlers you <code>await</code> database calls so the event loop can
        serve other requests while waiting on the network — the same concurrency idea as
        async HTTP handlers.
      </p>
      <CodePreview
        language="python"
        code={`from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(uri)
doc = await client.shop.orders.find_one({"_id": order_id})`}
      />
    </>
  ),
  playground: (
    <>
      <SnippetRunner snippets={snippets('Motor async pattern')} />
      <TryThis>
        Run the Motor snippet and note the simulated network delay — the event loop stays
        free during <code>await</code>.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'Motor', def: 'Async Python driver wrapping PyMongo for asyncio.' },
    { term: 'AsyncIOMotorClient', def: 'Motor entry point — async counterpart to MongoClient.' },
    { term: 'await', def: 'Pauses the handler until the async database call completes.' },
  ],
  quiz: [
    {
      q: 'Motor is used when you need:',
      options: ['Synchronous blocking I/O only', 'Async/await database calls in asyncio', 'SQL queries', 'React components'],
      answer: 1,
    },
    {
      q: 'While awaiting a Motor find_one(), the event loop can:',
      options: ['Only crash', 'Serve other requests', 'Skip TLS', 'Disable indexes'],
      answer: 1,
    },
    {
      q: 'Motor wraps:',
      options: ['PyMongo for asyncio', 'SQLAlchemy for MongoDB', 'React DOM', 'nginx'],
      answer: 0,
    },
  ],
  recap: [
    <><strong>Motor</strong> exposes the same collection API as PyMongo with <code>async</code>/<code>await</code>.</>,
    <>Use <code>AsyncIOMotorClient</code> in FastAPI handlers to keep the server responsive.</>,
    <>Await I/O-bound database calls — do not block the event loop.</>,
  ],
})

const mongodbConnOdm = createChapterLesson({
  id: 'mongodb-conn-odm',
  modelTitle: 'ODMs',
  intro: (
    <p className="prose">
      Raw drivers are flexible but verbose. <strong>ODMs</strong> (object-document mappers)
      map Python classes to MongoDB collections — like SQLAlchemy for SQL — adding
      validation, defaults, and query helpers.
    </p>
  ),
  model: (
    <>
      <p className="prose">
        <strong>Beanie</strong> (async, Pydantic-based) and <strong>MongoEngine</strong>{' '}
        (sync) add validation, defaults, and query helpers on top of the driver layer.
      </p>
      <CodePreview
        language="python"
        code={`# Beanie + Pydantic (conceptual)
class Order(Document):
    city: str
    amount: float
    status: str = "pending"

# await Order.find(Order.amount > 100).to_list()`}
      />
      <Callout kind="tip" title="When to use an ODM">
        ODMs shine when documents map cleanly to typed models and you want validation on
        write. Raw PyMongo is fine for ad-hoc queries, aggregations, and scripts.
      </Callout>
    </>
  ),
  playground: <SnippetRunner snippets={snippets('ODM-style model (Beanie idea)')} />,
  terms: [
    { term: 'ODM', def: 'Object-document mapper — Python classes mapped to collections.' },
    { term: 'Beanie', def: 'Async ODM built on Motor and Pydantic models.' },
    { term: 'MongoEngine', def: 'Synchronous ODM with document classes and query helpers.' },
  ],
  quiz: [
    {
      q: 'An ODM primarily helps with:',
      options: ['CSS styling', 'Mapping typed Python classes to MongoDB collections', 'Compiling C code', 'Browser caching'],
      answer: 1,
    },
    {
      q: 'Beanie is built for:',
      options: ['Sync scripts only', 'Async apps with Pydantic validation', 'SQL migrations', 'React rendering'],
      answer: 1,
    },
    {
      q: 'When is raw PyMongo often enough?',
      options: ['Never', 'Ad-hoc queries, aggregations, and one-off scripts', 'Only in React components', 'When you need SQL JOINs'],
      answer: 1,
    },
  ],
  recap: [
    <><strong>ODMs</strong> add typed models and validation on top of drivers.</>,
    <>Use <strong>Beanie</strong> for async FastAPI apps; <strong>MongoEngine</strong> for sync code.</>,
    <>Reach for raw PyMongo when pipelines or ad-hoc queries do not fit a model class.</>,
  ],
})

const mongodbPlayground = createChapterLesson({
  id: 'mongodb-playground',
  modelTitle: 'Shell commands',
  intro: (
    <p className="prose">
      Reading about filters and pipelines is one thing — running them cements the syntax.
      The playground below runs MongoDB-style commands against an in-memory document store
      in your browser.
    </p>
  ),
  model: (
    <p className="prose">
      Try the samples for find filters, aggregation, and writes — then edit the JSON and
      re-run. Results appear instantly without installing a MongoDB server.
    </p>
  ),
  playground: (
    <>
      <MongoPlayground />
      <TryThis>
        Run <strong>Aggregate revenue</strong>, then add a <code>$limit: 2</code> stage.
        Run <strong>Insert document</strong> and <strong>Find all orders</strong> to see it
        appear. Compare with the SQL lesson's JOIN approach.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'find', def: 'Returns documents matching a filter from a collection.' },
    { term: 'aggregation pipeline', def: 'A sequence of stages ($match, $group, …) transforming documents.' },
    { term: 'insertOne', def: 'Adds a single document to a collection.' },
  ],
  quiz: [
    {
      q: 'In the playground, db.orders.find({}) returns:',
      options: ['An error', 'All documents in the orders collection', 'Only indexes', 'SQL rows'],
      answer: 1,
    },
    {
      q: 'Adding $limit: 2 to an aggregation pipeline:',
      options: ['Deletes two documents', 'Caps output to two grouped results', 'Creates two indexes', 'Joins two collections'],
      answer: 1,
    },
    {
      q: 'The playground runs commands:',
      options: ['On a remote Atlas cluster only', 'In-memory in the browser', 'Inside PostgreSQL', 'As React props'],
      answer: 1,
    },
  ],
  recap: [
    <>Practice <code>find</code>, aggregation stages, and writes in the live shell.</>,
    <>Edit JSON filters and pipeline stages, then re-run to see immediate results.</>,
    <>Compare document queries with the SQL lesson's JOIN-based approach.</>,
  ],
})

const mongodbLabs = createChapterLesson({
  id: 'mongodb-labs',
  modelTitle: 'Python + MongoDB',
  intro: (
    <p className="prose">
      MongoDB documents are JSON-shaped data — Python dicts are a natural fit. These labs
      simulate filtering, operators, grouping, and driver patterns without a server.
    </p>
  ),
  model: (
    <p className="prose">
      Work through each snippet: documents as dicts, filter helpers with <code>$gt</code>,
      grouping totals, and PyMongo-style client code. Each runs in the browser via Pyodide.
    </p>
  ),
  playground: (
    <>
      <SnippetRunner snippets={MONGODB_SNIPPETS} />
      <TryThis>
        Extend <strong>Filter documents</strong> to support <code>$in</code> on a list
        field, then mirror it in the playground with{' '}
        <code>db.customers.find(&#123; "tags": &#123; "$in": ["eu"] &#125; &#125;)</code>.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'operator', def: 'A query keyword like $gt, $in, or $set.' },
    { term: 'driver', def: 'Library connecting your app to MongoDB (PyMongo, Motor).' },
    { term: 'aggregation pipeline', def: 'A sequence of stages ($match, $group, …) transforming documents.' },
  ],
  quiz: [
    {
      q: 'In Python, a MongoDB document is naturally represented as:',
      options: ['A CSS class', 'A dict with string keys', 'A SQL row tuple only', 'An HTTP header'],
      answer: 1,
    },
    {
      q: 'The Filter documents lab demonstrates:',
      options: ['React hooks', 'Equality and $gt-style filters in Python', 'Git branching', 'TLS certificates'],
      answer: 1,
    },
    {
      q: 'Group & sum (aggregation) lab mirrors which MongoDB feature?',
      options: ['Replication', 'Aggregation $group with totals', 'CORS middleware', 'JWT decoding'],
      answer: 1,
    },
  ],
  recap: [
    <>Documents map cleanly to Python <strong>dicts</strong> and lists.</>,
    <>Labs show filters, operators, grouping, and client patterns without a live server.</>,
    <>Extend the filter helper, then try the same filter in the MongoDB playground.</>,
  ],
})

const mongodbHood = createChapterLesson({
  id: 'mongodb-hood',
  modelTitle: 'Overview',
  intro: (
    <p className="prose">
      Flexible documents scale from prototypes to production clusters — but design choices
      (embed vs reference, indexes, replication) matter once traffic and data volume grow.
    </p>
  ),
  model: (
    <p className="prose">
      The panels below cover data modeling, query performance, and horizontal scaling —
      the same production concerns as SQL, with document-specific trade-offs.
    </p>
  ),
  playground: <MongoPlayground sampleLabels={['Aggregate revenue']} />,
  hood: (
    <>
      <UnderTheHood title="When to embed vs reference">
        <p className="prose">
          <strong>Embed</strong> related data when you read it together and it doesn't
          change often (order line items inside an order). <strong>Reference</strong> with
          an <code>_id</code> when the same entity is shared and updated independently
          (customer profile linked from many orders).
        </p>
      </UnderTheHood>
      <UnderTheHood title="Indexes in MongoDB">
        <p className="prose">
          Like SQL, MongoDB uses <strong>indexes</strong> (often B-trees) to avoid scanning
          every document. Create indexes on fields you filter and sort by —{' '}
          <code>orders.city</code>, <code>customers.email</code>, compound indexes for
          common query patterns.
        </p>
      </UnderTheHood>
      <UnderTheHood title="Replication & sharding">
        <p className="prose">
          Production MongoDB clusters replicate data for durability and shard collections
          across machines when a single server can't hold the dataset. That's how document
          stores scale horizontally — at the cost of operational complexity.
        </p>
      </UnderTheHood>
    </>
  ),
  terms: [
    { term: 'embedding', def: 'Storing related data inside a document instead of joining.' },
    { term: 'shard', def: 'A horizontal partition of data across cluster nodes.' },
    { term: 'index', def: 'Structure that speeds up filters and sorts on specific fields.' },
  ],
  quiz: [
    {
      q: 'When should you embed data vs reference it?',
      options: ['Always embed', 'Embed when read together; reference when shared and updated independently', 'Always reference', 'Never embed arrays'],
      answer: 1,
      explain: 'Embedding avoids joins on read; referencing avoids stale duplicated data.',
    },
    {
      q: 'MongoDB scales out horizontally mainly via:',
      options: ['More indexes only', 'Sharding data across nodes', 'Smaller documents', 'Removing _id'],
      answer: 1,
      explain: 'Sharding splits collections across machines when one node is not enough.',
    },
    {
      q: 'Indexes in MongoDB help you:',
      options: ['Store passwords in plain text', 'Avoid scanning every document on common filters', 'Disable replication', 'Compile JSX'],
      answer: 1,
    },
  ],
  recap: [
    <><strong>Embed</strong> when data is read together; <strong>reference</strong> when shared and updated independently.</>,
    <>Index fields you filter and sort on — same performance idea as SQL.</>,
    <>Replication adds durability; <strong>sharding</strong> splits data when one node is not enough.</>,
  ],
})

export const MONGODB_CHAPTERS: Record<string, ComponentType> = {
  'mongodb-intro': mongodbIntro,
  'mongodb-documents': mongodbDocuments,
  'mongodb-queries': mongodbQueries,
  'mongodb-writes': mongodbWrites,
  'mongodb-aggregation': mongodbAggregation,
  'mongodb-conn-pymongo': mongodbConnPymongo,
  'mongodb-conn-uri': mongodbConnUri,
  'mongodb-conn-motor': mongodbConnMotor,
  'mongodb-conn-odm': mongodbConnOdm,
  'mongodb-playground': mongodbPlayground,
  'mongodb-labs': mongodbLabs,
  'mongodb-hood': mongodbHood,
}

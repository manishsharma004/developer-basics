import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, UnderTheHood, TryThis } from '../components/blocks.tsx'
import {
  AcidSim,
  DataModelSim,
  DbArchitectureSim,
  DbChooserSim,
  RamVsDbSim,
  ReplicationSim,
} from './DbSims.tsx'
import { NormalizationSim } from './NormalizationSim.tsx'

const databasesIntro = createChapterLesson({
  id: 'databases-intro',
  modelTitle: 'Durable state',
  intro: (
    <p className="prose">
      When your program exits, everything in RAM disappears. Real applications need{' '}
      <strong>durable storage</strong> — data that survives restarts, crashes, and
      deployments. A <strong>database</strong> is specialized software that stores,
      organizes, and retrieves that data reliably.
    </p>
  ),
  model: (
    <>
      <Callout kind="why" title="The one idea">
        Treat the database as the <strong>source of truth</strong> for long-lived
        application state. Your API or UI reads and writes through it; memory is just
        a cache of what the database holds.
      </Callout>
      <p className="prose">
        Files on disk can persist data too, but databases add structured queries,
        concurrent access, transactions, and indexes so many clients can read and write
        safely at the same time.
      </p>
    </>
  ),
  playground: (
    <>
      <RamVsDbSim />
      <TryThis>
        Leave data in RAM only, crash the process, then enable <strong>Persist to database</strong> and
        crash again — watch what survives.
      </TryThis>
    </>
  ),
  terms: [
    { term: 'database', def: 'Software that stores and queries structured data durably.' },
    { term: 'persistence', def: 'Data that outlives the process that created it.' },
    { term: 'source of truth', def: 'The authoritative copy of application state — usually the database.' },
  ],
  quiz: [
    {
      q: 'Why not keep all app data only in RAM?',
      options: ['RAM is too fast', 'RAM is cleared when the process stops', 'Databases cannot store numbers', 'Files are always faster'],
      answer: 1,
    },
    {
      q: 'The database is usually the:',
      options: ['Temporary cache only', 'Source of truth for durable state', 'CSS stylesheet', 'Build tool'],
      answer: 1,
    },
    {
      q: 'Compared to ad-hoc files, databases add:',
      options: ['Only slower writes', 'Structured queries, concurrency, and transactions', 'No indexes ever', 'Mandatory JSON only'],
      answer: 1,
    },
  ],
  recap: [
    <>Applications need <strong>durable storage</strong> that survives restarts.</>,
    <>The database is the <strong>source of truth</strong>; RAM is ephemeral.</>,
    <>Databases handle concurrency, queries, and integrity beyond plain files.</>,
  ],
})

const databasesArchitecture = createChapterLesson({
  id: 'databases-architecture',
  modelTitle: 'Architecture',
  intro: (
    <p className="prose">
      Your Python or JavaScript code does not talk to disk sectors directly. It uses a{' '}
      <strong>driver</strong> (or ORM) that speaks the database's wire protocol. The
      layout differs between <strong>embedded</strong> engines like SQLite and{' '}
      <strong>client-server</strong> engines like PostgreSQL or MongoDB.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>Embedded</strong> — the engine runs inside your process (SQLite). Great
          for dev, tests, and small apps; one file on disk.
        </li>
        <li>
          <strong>Client-server</strong> — a separate database server handles many app
          processes (Postgres, MongoDB). Required for production scale and shared access.
        </li>
        <li>
          <strong>Driver / connector</strong> — library your code imports (
          <code>sqlite3</code>, <code>psycopg2</code>, <code>pymongo</code>) that sends
          queries and returns rows or documents.
        </li>
        <li>
          <strong>Connection pool</strong> — web apps reuse warm connections instead of
          opening a new TCP handshake per request.
        </li>
      </ul>
      <Callout kind="note">
        The SQL and MongoDB chapters dive into specific drivers. Here, remember the
        pattern: <em>app → driver → database engine → disk</em>.
      </Callout>
    </>
  ),
  playground: <DbArchitectureSim />,
  terms: [
    { term: 'embedded database', def: 'Engine linked into your app process, e.g. SQLite.' },
    { term: 'client-server', def: 'Separate DB process that many apps connect to over the network.' },
    { term: 'driver', def: 'Library that translates your API calls into database protocol messages.' },
  ],
  quiz: [
    {
      q: 'SQLite is best described as:',
      options: ['A cloud-only service', 'An embedded database in your process', 'A CSS framework', 'A message queue'],
      answer: 1,
    },
    {
      q: 'Production web apps typically use client-server databases because:',
      options: ['They cannot use Python', 'Many processes need shared, concurrent access', 'Embedded DBs forbid indexes', 'SQL is unsupported'],
      answer: 1,
    },
    {
      q: 'A connection pool helps by:',
      options: ['Deleting all data on startup', 'Reusing open connections instead of reconnecting every request', 'Replacing transactions', 'Disabling queries'],
      answer: 1,
    },
  ],
  recap: [
    <>Apps talk to databases through <strong>drivers</strong>, not raw disk.</>,
    <><strong>Embedded</strong> (SQLite) vs <strong>client-server</strong> (Postgres, MongoDB).</>,
    <><strong>Connection pools</strong> reuse warm connections in web apps.</>,
  ],
})

const databasesModels = createChapterLesson({
  id: 'databases-models',
  modelTitle: 'Database families',
  intro: (
    <p className="prose">
      Not all databases organize data the same way. The <strong>data model</strong> —
      tables, documents, keys, or graphs — shapes what queries are easy, how schemas
      evolve, and how you scale.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li>
          <strong>Relational (SQL)</strong> — rows in typed tables, joined on keys.
          Excellent for structured business data with relationships.
        </li>
        <li>
          <strong>Document</strong> — JSON-like records in collections (MongoDB). Flexible
          nested shapes; great when fields evolve often.
        </li>
        <li>
          <strong>Key-value</strong> — simple get/set by key (Redis). Ultra-fast caches
          and session stores.
        </li>
        <li>
          <strong>Graph</strong> — nodes and edges (Neo4j). Optimized for relationship
          traversals like social networks or recommendations.
        </li>
      </ul>
      <Callout kind="why" title="Polyglot persistence">
        Large systems often use <em>more than one</em> database type: Postgres for
        orders, Redis for sessions, Elasticsearch for search. Pick the model that fits
        each access pattern.
      </Callout>
    </>
  ),
  playground: <DataModelSim />,
  terms: [
    { term: 'relational model', def: 'Data in tables with rows, columns, and foreign keys.' },
    { term: 'document model', def: 'Flexible JSON-like records grouped in collections.' },
    { term: 'key-value store', def: 'Lookup by string key — optimized for speed, not complex queries.' },
  ],
  quiz: [
    {
      q: 'JOIN-heavy business reports usually fit:',
      options: ['A relational SQL database', 'A pure key-value cache only', 'A static image CDN', 'A CSS preprocessor'],
      answer: 0,
    },
    {
      q: 'Document databases shine when:',
      options: ['Every row must share identical columns forever', 'Nested, evolving record shapes are common', 'You never query data', 'You only need get/set by key'],
      answer: 1,
    },
    {
      q: 'Redis is typically used as:',
      options: ['Primary ledger for bank accounts', 'A fast key-value cache or session store', 'A graph traversal engine', 'A file compiler'],
      answer: 1,
    },
  ],
  recap: [
    <>Choose the <strong>data model</strong> that matches your query patterns.</>,
    <>Relational for joins; documents for flexible nested records; key-value for speed.</>,
    <>Real systems often combine multiple database types.</>,
  ],
})

const databasesAcid = createChapterLesson({
  id: 'databases-acid',
  modelTitle: 'ACID properties',
  intro: (
    <p className="prose">
      When two related writes must succeed or fail together — transferring money between
      accounts, decrementing inventory while creating an order — you need a{' '}
      <strong>transaction</strong>. ACID describes the guarantees serious databases provide.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Atomicity</strong> — all statements in a transaction commit, or none do.</li>
        <li><strong>Consistency</strong> — constraints (keys, checks) hold before and after.</li>
        <li><strong>Isolation</strong> — concurrent transactions don't corrupt each other's partial work.</li>
        <li><strong>Durability</strong> — committed data survives crashes (written to disk/WAL).</li>
      </ul>
      <Callout kind="warning" title="Without transactions">
        A crash between debit and credit can leave balances wrong. Wrap related updates in{' '}
        <code>BEGIN … COMMIT</code> (SQL) or multi-document transactions where supported.
      </Callout>
    </>
  ),
  playground: <AcidSim />,
  terms: [
    { term: 'transaction', def: 'A group of operations treated as one atomic unit.' },
    { term: 'ACID', def: 'Atomicity, Consistency, Isolation, Durability — core DB guarantees.' },
    { term: 'commit', def: 'Make transaction changes permanent; rollback discards them.' },
  ],
  quiz: [
    {
      q: 'Atomicity means:',
      options: ['Only one user may log in', 'All operations in a transaction succeed or all are rolled back', 'Queries run without indexes', 'Data is never deleted'],
      answer: 1,
    },
    {
      q: 'Durability guarantees that after COMMIT:',
      options: ['Data survives process crashes', 'RAM is cleared immediately', 'Indexes are removed', 'Schemas cannot change'],
      answer: 0,
    },
    {
      q: 'You need a transaction when:',
      options: ['Rendering a button color', 'Two writes must stay in sync (e.g. transfer funds)', 'Reading a static file', 'Compiling TypeScript'],
      answer: 1,
    },
  ],
  recap: [
    <><strong>Transactions</strong> group related writes into one atomic unit.</>,
    <>ACID: <strong>A</strong>tomicity, <strong>C</strong>onsistency, <strong>I</strong>solation, <strong>D</strong>urability.</>,
    <>Use transactions whenever partial failure would corrupt business rules.</>,
  ],
})

const databasesSchemas = createChapterLesson({
  id: 'databases-schemas',
  modelTitle: 'Schema thinking',
  intro: (
    <p className="prose">
      A <strong>schema</strong> defines what fields exist, their types, and how records
      relate. Relational databases enforce schemas up front; document databases allow
      flexible shapes but teams still agree on conventions.
    </p>
  ),
  model: (
    <>
      <ul className="prose-list">
        <li><strong>Normalization</strong> — store each fact once; join when you need a combined view.</li>
        <li><strong>Denormalization</strong> — duplicate data to speed reads at the cost of consistency work.</li>
        <li><strong>Constraints</strong> — NOT NULL, UNIQUE, foreign keys enforce rules in the database.</li>
        <li><strong>Migrations</strong> — versioned scripts that evolve schema safely across environments.</li>
      </ul>
      <Callout kind="note">
        Start normalized in SQL; denormalize only where profiling shows pain. In MongoDB,
        embed related data when you usually read it together; reference when it is shared.
      </Callout>
    </>
  ),
  playground: (
    <>
      <NormalizationSim />
      <DataModelSim
        title="Relational vs document shape"
        hint="Relational tables store each fact once and join on read; embedded documents duplicate nested data for faster reads."
      />
    </>
  ),
  terms: [
    { term: 'schema', def: 'The structure of stored data — columns, types, and relationships.' },
    { term: 'normalization', def: 'Organizing data to reduce duplication across tables.' },
    { term: 'migration', def: 'A controlled change to database structure over time.' },
  ],
  quiz: [
    {
      q: 'Normalization primarily reduces:',
      options: ['Query speed always', 'Duplicate data stored in multiple places', 'Need for any indexes', 'Network latency'],
      answer: 1,
    },
    {
      q: 'A foreign key constraint ensures:',
      options: ['Faster CSS rendering', 'Referenced rows exist in another table', 'All strings are uppercase', 'Automatic backups'],
      answer: 1,
    },
    {
      q: 'Migrations are used to:',
      options: ['Delete production data randomly', 'Evolve schema safely across dev/staging/prod', 'Replace Git', 'Compile React'],
      answer: 1,
    },
  ],
  recap: [
    <>Schemas define <strong>shape, types, and relationships</strong>.</>,
    <>Normalize first; <strong>denormalize</strong> only for measured read bottlenecks.</>,
    <><strong>Migrations</strong> version schema changes across environments.</>,
  ],
})

const databasesChoosing = createChapterLesson({
  id: 'databases-choosing',
  modelTitle: 'Choosing a database',
  intro: (
    <p className="prose">
      SQL and MongoDB are both excellent — for different problems. Use requirements,
      not hype, to choose. The next two modules teach each in depth; here is the map.
    </p>
  ),
  model: (
    <>
      <p className="prose"><strong>Lean toward SQL when:</strong></p>
      <ul className="prose-list">
        <li>Data is highly relational with many JOINs.</li>
        <li>Strong schema and constraints matter (finance, inventory).</li>
        <li>Reporting uses aggregates across normalized tables.</li>
      </ul>
      <p className="prose"><strong>Lean toward MongoDB when:</strong></p>
      <ul className="prose-list">
        <li>Documents map naturally to your domain (catalogs, content, events).</li>
        <li>Fields evolve quickly or vary per record.</li>
        <li>Read patterns fetch one rich document instead of many joins.</li>
      </ul>
      <Callout kind="why" title="Default for most greenfield APIs">
        PostgreSQL is a safe default for structured app data. Add MongoDB when document
        flexibility clearly wins; add Redis when you need caching — not instead of a primary store.
      </Callout>
    </>
  ),
  playground: <DbChooserSim />,
  terms: [
    { term: 'polyglot persistence', def: 'Using multiple database types for different jobs in one system.' },
    { term: 'embed vs reference', def: 'MongoDB choice: nest data in a document or store an _id pointer.' },
    { term: 'JOIN', def: 'SQL operation combining rows from related tables on a key.' },
  ],
  quiz: [
    {
      q: 'Many JOINs across normalized tables suggest:',
      options: ['A relational SQL database', 'A static site generator', 'A CSS framework', 'No database at all'],
      answer: 0,
    },
    {
      q: 'Rapidly evolving optional fields per record suggest:',
      options: ['Strict CSV files only', 'A document database like MongoDB', 'Disabling all indexes', 'Removing backups'],
      answer: 1,
    },
    {
      q: 'Redis should usually:',
      options: ['Replace Postgres as the only ledger', 'Complement a primary database as cache/sessions', 'Store all migrations', 'Parse HTML'],
      answer: 1,
    },
  ],
  recap: [
    <>Pick based on <strong>relationships, schema stability, and read patterns</strong>.</>,
    <>PostgreSQL is a strong default for structured app data.</>,
    <>MongoDB fits flexible documents; Redis fits cache — often together.</>,
  ],
})

const databasesHood = createChapterLesson({
  id: 'databases-hood',
  modelTitle: 'Overview',
  intro: (
    <p className="prose">
      Before you operate databases in production, know the basics under the hood:
      how data is replicated, backed up, and scaled — topics you'll revisit in the SQL
      and MongoDB internals chapters.
    </p>
  ),
  model: (
  <Callout kind="why" title="Production checklist">
    Every serious deployment needs backups you have tested restoring, a plan for failover,
    and connection limits that match your pool size.
  </Callout>
  ),
  playground: <ReplicationSim />,
  hood: (
    <UnderTheHood title="Replication, backups & scale">
      <ul className="prose-list">
        <li>
          <strong>Replication</strong> — copy data to standby servers for read scaling
          or failover (Postgres streaming replication, MongoDB replica sets).
        </li>
        <li>
          <strong>Backups</strong> — periodic snapshots plus WAL/oplog replay; verify
          restores in staging, not just backup jobs.
        </li>
        <li>
          <strong>Sharding</strong> — split data across nodes when one server cannot
          hold or serve the load (MongoDB sharded clusters, Citus for Postgres).
        </li>
        <li>
          <strong>Indexes</strong> — speed lookups but slow writes; index columns you
          filter and sort on (covered in SQL/Mongo hood chapters).
        </li>
      </ul>
    </UnderTheHood>
  ),
  terms: [
    { term: 'replication', def: 'Copying data to additional nodes for availability or read scale.' },
    { term: 'backup', def: 'A recoverable snapshot of database state at a point in time.' },
    { term: 'sharding', def: 'Horizontally partitioning data across multiple servers.' },
  ],
  quiz: [
    {
      q: 'Replication primarily helps with:',
      options: ['Availability and read scaling', 'Removing all indexes', 'Disabling transactions', 'CSS theming'],
      answer: 0,
    },
    {
      q: 'A backup you never tested restoring is:',
      options: ['Guaranteed safe', 'Unknown — restore drills are essential', 'Faster than replication', 'A replacement for migrations'],
      answer: 1,
    },
    {
      q: 'Sharding is considered when:',
      options: ['One server cannot hold or serve the data volume', 'You have zero users', 'You only use SQLite in tests', 'You disable networking'],
      answer: 0,
    },
  ],
  recap: [
    <>Plan <strong>replication</strong> for failover and <strong>backups</strong> you can restore.</>,
    <><strong>Sharding</strong> splits data when vertical scale is exhausted.</>,
    <>Index query fields; details live in the SQL and MongoDB tracks.</>,
  ],
})

export const DATABASES_CHAPTERS: Record<string, ComponentType> = {
  'databases-intro': databasesIntro,
  'databases-architecture': databasesArchitecture,
  'databases-models': databasesModels,
  'databases-acid': databasesAcid,
  'databases-schemas': databasesSchemas,
  'databases-choosing': databasesChoosing,
  'databases-hood': databasesHood,
}

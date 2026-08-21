import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { SnippetRunner } from '../components/SnippetRunner.tsx'
import { SQL_SNIPPETS, snippets } from './snippets.ts'
import { SqlPlayground } from './SqlPlayground.tsx'

export const SQL_CHAPTERS: Record<string, ComponentType> = {
  'sql-intro': createChapterLesson({
    id: 'sql-intro',
    modelTitle: 'The one idea',
    intro: (
      <p className="prose">
        Most applications keep their data in a relational database and talk to it
        with <strong>SQL</strong>. It's one of the most durable skills in software
        — the same queries you learn today work across Postgres, MySQL, SQLite,
        and more. SQL is <em>declarative</em>: you say <em>what</em> you want,
        not how to fetch it row by row.
      </p>
    ),
    model: (
      <Callout kind="why" title="The one idea">
        Data lives in <strong>tables</strong> (rows and columns). You{' '}
        <strong>query</strong> it by describing the result you want; the database
        engine figures out how to produce it efficiently.
      </Callout>
    ),
    playground: (
      <>
        <SqlPlayground sampleLabels={['All customers']} />
        <TryThis>
          Run the query, then change <code>SELECT *</code> to <code>SELECT name, city</code> and re-run.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'SQL', def: 'Structured Query Language — the standard way to read and write relational data.' },
      { term: 'table', def: 'A set of rows with typed columns.' },
      { term: 'declarative', def: 'You describe the result you want; the engine decides how to fetch it.' },
    ],
    quiz: [
      {
        q: 'SQL is described as declarative because you specify:',
        options: ['How to loop row by row', 'What result you want, not the fetch algorithm', 'Only INSERT statements', 'Network routing'],
        answer: 1,
      },
      {
        q: 'Relational data is organized as:',
        options: ['JSON documents only', 'Tables of rows and columns', 'Key-value pairs exclusively', 'Graph nodes without edges'],
        answer: 1,
      },
      {
        q: 'The same SQL skills transfer across:',
        options: ['Only SQLite', 'Postgres, MySQL, SQLite, and more', 'Only NoSQL databases', 'Frontend frameworks only'],
        answer: 1,
      },
    ],
    recap: [
      <>Most apps store data in relational databases and query with <strong>SQL</strong>.</>,
      <>SQL is <strong>declarative</strong> — describe the result; the engine handles execution.</>,
      <>Data lives in <strong>tables</strong> (rows and columns) linked by keys.</>,
    ],
  }),

  'sql-tables': createChapterLesson({
    id: 'sql-tables',
    modelTitle: 'Tables & queries',
    intro: (
      <p className="prose">
        Before writing complex joins, you need the building blocks: selecting columns,
        filtering rows, sorting results, and combining tables. These clauses appear in
        nearly every query you'll write.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Our sample database has three related tables: <code>customers</code>,{' '}
          <code>products</code>, and <code>orders</code>. Each order links a customer
          to a product and records quantity, amount, and status.
        </p>
        <ul className="prose-list">
          <li><code>SELECT</code> columns <code>FROM</code> a table.</li>
          <li><code>WHERE</code> filters rows by a condition.</li>
          <li><code>ORDER BY</code> sorts; <code>LIMIT</code> caps the count.</li>
          <li><code>JOIN</code> combines rows from two tables on a matching key.</li>
          <li><code>GROUP BY</code> with <code>COUNT</code>/<code>SUM</code> aggregates rows.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <SqlPlayground sampleLabels={['All customers', 'Filter & sort']} />
        <TryThis>Try <strong>Filter & sort</strong> — WHERE runs before ORDER BY in the clause order.</TryThis>
      </>
    ),
    terms: [
      { term: 'SELECT', def: 'Chooses which columns to return from a query.' },
      { term: 'WHERE', def: 'Filters rows by a condition before grouping or sorting.' },
      { term: 'JOIN', def: 'Combining rows from tables on a matching key.' },
      { term: 'aggregate', def: 'A function like COUNT/SUM over grouped rows.' },
    ],
    quiz: [
      {
        q: 'Which clause filters which rows are returned?',
        options: ['SELECT', 'WHERE', 'ORDER BY', 'JOIN'],
        answer: 1,
        explain: 'WHERE applies a condition to include/exclude rows before grouping.',
      },
      {
        q: 'ORDER BY is used to:',
        options: ['Filter rows', 'Sort results', 'Create tables', 'Open connections'],
        answer: 1,
      },
      {
        q: 'LIMIT caps:',
        options: ['Column width', 'The number of rows returned', 'Transaction size', 'Index count'],
        answer: 1,
      },
    ],
    recap: [
      <><code>SELECT … FROM …</code> picks columns from a table.</>,
      <><code>WHERE</code> filters rows; <code>ORDER BY</code> sorts; <code>LIMIT</code> caps count.</>,
      <><code>JOIN</code> combines related rows; <code>GROUP BY</code> with aggregates summarizes data.</>,
    ],
  }),

  'sql-schema': createChapterLesson({
    id: 'sql-schema',
    modelTitle: 'Schema, keys & relationships',
    intro: (
      <p className="prose">
        A well-designed schema prevents duplicate data and enforces rules about how
        tables relate. Primary and foreign keys are the foundation of relational
        modeling — they keep your data consistent as the app grows.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          A <strong>primary key</strong> uniquely identifies each row (
          <code>customers.id</code>). A <strong>foreign key</strong> in{' '}
          <code>orders.customer_id</code> points at a row in another table, enforcing
          referential integrity — you can't reference a customer that doesn't exist.
        </p>
        <ul className="prose-list">
          <li><strong>One-to-many</strong> — one customer, many orders.</li>
          <li><strong>Many-to-many</strong> — usually modeled with a join table (here, orders link customers ↔ products).</li>
          <li><strong>Normalization</strong> — store each fact once; join when you need a combined view.</li>
        </ul>
        <Callout kind="note">
          Over-normalizing can mean many JOINs at read time; denormalizing (copying
          fields for speed) trades storage and consistency for simpler reads. Most
          apps start normalized and denormalize only where profiling shows pain.
        </Callout>
      </>
    ),
    playground: (
      <>
        <SqlPlayground sampleLabels={['Inner join', 'Left join (all customers)']} />
        <TryThis>
          Compare <strong>Inner join</strong> vs <strong>Left join (all customers)</strong> — find customers with zero orders.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'primary key', def: 'A column uniquely identifying each row.' },
      { term: 'foreign key', def: 'A column referencing a row in another table.' },
      { term: 'normalization', def: 'Storing each fact once and joining when you need a combined view.' },
    ],
    quiz: [
      {
        q: 'A foreign key ensures:',
        options: ['Fast sorting', 'Referential integrity between tables', 'Encryption', 'Automatic backups'],
        answer: 1,
        explain: 'Foreign keys prevent orphan rows pointing at missing parents.',
      },
      {
        q: 'PRIMARY KEY ensures:',
        options: ['Fast network', 'Each row has a unique identifier', 'UTF-8 encoding', 'No NULLs anywhere'],
        answer: 1,
        explain: 'Primary keys uniquely identify rows in a table.',
      },
      {
        q: 'One customer with many orders is a:',
        options: ['Many-to-many', 'One-to-many', 'Self-join only', 'Denormalized copy'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>Primary keys</strong> uniquely identify rows; <strong>foreign keys</strong> link tables.</>,
      <>Model <strong>one-to-many</strong> and <strong>many-to-many</strong> relationships with keys and join tables.</>,
      <>Start <strong>normalized</strong>; denormalize only when profiling shows read pain.</>,
    ],
  }),

  'sql-writes': createChapterLesson({
    id: 'sql-writes',
    modelTitle: 'Insert, update & delete',
    intro: (
      <p className="prose">
        Applications don't just read data — they create orders, update statuses, and
        remove cancelled records. Write operations need the same care as queries,
        especially when several changes must succeed or fail together.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          SQL isn't read-only. <code>INSERT</code> adds rows, <code>UPDATE</code>{' '}
          changes them, and <code>DELETE</code> removes them. Always use a{' '}
          <code>WHERE</code> clause on updates and deletes unless you truly mean
          "every row" — an unqualified <code>DELETE FROM orders</code> wipes the
          whole table.
        </p>
        <ul className="prose-list">
          <li><code>INSERT INTO orders (…) VALUES (…)</code></li>
          <li><code>UPDATE orders SET status = 'shipped' WHERE id = 7</code></li>
          <li><code>DELETE FROM orders WHERE status = 'cancelled'</code></li>
        </ul>
        <Callout kind="warning" title="Transactions">
          Real apps wrap related writes in a <strong>transaction</strong> so they
          succeed or fail together — e.g. debit one account and credit another. If
          the second step fails, the first is rolled back.
        </Callout>
      </>
    ),
    playground: (
      <>
        <SqlPlayground sampleLabels={['Insert row', 'Update & delete']} />
        <TryThis>Run <strong>Insert row</strong>, then re-run <strong>All customers</strong> in sql-intro to confirm the new order.</TryThis>
      </>
    ),
    terms: [
      { term: 'INSERT', def: 'Adds new rows to a table.' },
      { term: 'UPDATE', def: 'Modifies existing rows matching a WHERE condition.' },
      { term: 'transaction', def: 'A group of writes that commit or roll back together.' },
    ],
    quiz: [
      {
        q: 'Why use a transaction for a money transfer?',
        options: ['It runs faster', 'Both debit and credit succeed or neither does', 'It avoids indexes', 'It encrypts data'],
        answer: 1,
        explain: 'Transactions are atomic — partial updates roll back on failure.',
      },
      {
        q: 'DELETE FROM orders without WHERE:',
        options: ['Deletes one row', 'Removes every row in the table', 'Only removes cancelled rows', 'Requires a JOIN'],
        answer: 1,
      },
      {
        q: 'UPDATE should almost always include:',
        options: ['ORDER BY', 'A WHERE clause targeting specific rows', 'A new PRIMARY KEY', 'DROP TABLE'],
        answer: 1,
      },
    ],
    recap: [
      <><code>INSERT</code>, <code>UPDATE</code>, and <code>DELETE</code> modify table data.</>,
      <>Always use <code>WHERE</code> on updates and deletes unless you mean every row.</>,
      <>Wrap related writes in <strong>transactions</strong> so they commit or roll back together.</>,
    ],
  }),

  'sql-advanced': createChapterLesson({
    id: 'sql-advanced',
    modelTitle: 'Joins, aggregates & subqueries',
    intro: (
      <p className="prose">
        Real reports combine multiple tables, summarize revenue by customer, and filter
        groups by totals. Joins, aggregates, and subqueries are how you answer questions
        that span more than one table.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          <strong>INNER JOIN</strong> returns only rows with matches in both tables.{' '}
          <strong>LEFT JOIN</strong> keeps every row from the left table even when
          there's no match on the right — useful for "all customers, including those
          with zero orders."
        </p>
        <ul className="prose-list">
          <li><code>GROUP BY</code> collapses rows; aggregates like <code>COUNT</code> and <code>SUM</code> summarize each group.</li>
          <li><code>HAVING</code> filters <em>after</em> grouping (like <code>WHERE</code> but for groups).</li>
          <li>A <strong>subquery</strong> nests one SELECT inside another — e.g. products priced above the average.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <SqlPlayground sampleLabels={['Aggregate + HAVING', 'Subquery']} />
        <TryThis>Change the revenue threshold in <strong>Aggregate + HAVING</strong> and watch which cities disappear.</TryThis>
      </>
    ),
    terms: [
      { term: 'INNER JOIN', def: 'Returns only rows with matches in both tables.' },
      { term: 'LEFT JOIN', def: 'Keeps all left-table rows; unmatched right columns become NULL.' },
      { term: 'HAVING', def: 'A filter applied after GROUP BY.' },
    ],
    quiz: [
      {
        q: 'What does a LEFT JOIN do differently from INNER JOIN?',
        options: ['Sorts rows', 'Keeps all rows from the left table even without a match', 'Deletes rows', 'Counts rows'],
        answer: 1,
        explain: 'LEFT JOIN preserves left-side rows; unmatched right columns become NULL.',
      },
      {
        q: 'HAVING is used to:',
        options: ['Filter rows before grouping', 'Filter groups after aggregation', 'Sort results', 'Create indexes'],
        answer: 1,
        explain: 'HAVING filters grouped results — e.g. cities with revenue > 100.',
      },
      {
        q: 'A subquery is:',
        options: ['A second database server', 'A SELECT nested inside another query', 'An ORM-only feature', 'A type of index'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>INNER JOIN</strong> requires matches; <strong>LEFT JOIN</strong> keeps unmatched left rows.</>,
      <><code>GROUP BY</code> with <code>COUNT</code>/<code>SUM</code> summarizes; <code>HAVING</code> filters groups.</>,
      <>Subqueries nest one <code>SELECT</code> inside another for complex filters.</>,
    ],
  }),

  'sql-conn-sqlite': createChapterLesson({
    id: 'sql-conn-sqlite',
    modelTitle: 'SQLite & sqlite3',
    intro: (
      <p className="prose">
        Not every app needs a separate database server. SQLite embeds the engine in
        your process — ideal for tests, prototypes, and the interactive playground
        in this course.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          <strong>SQLite</strong> embeds the database engine in your process — no
          separate server. Python's stdlib <code>sqlite3</code> module is perfect for
          tests, prototypes, and the playground in this lesson.
        </p>
        <CodePreview
          language="python"
          code={`import sqlite3

conn = sqlite3.connect("app.db")      # file on disk
conn = sqlite3.connect(":memory:")    # ephemeral (tests)

cur = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,))
rows = cur.fetchall()
conn.close()`}
        />
      </>
    ),
    playground: (
      <>
        <SnippetRunner snippets={snippets('Connect & query')} />
        <TryThis>
          Run <strong>Connect & query</strong> and trace how <code>?</code> placeholders
          keep values separate from SQL text.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'SQLite', def: 'An embedded database engine — no separate server process.' },
      { term: 'sqlite3', def: "Python's stdlib module for SQLite connections and queries." },
      { term: 'placeholder', def: 'A ? or %s slot where driver-supplied values go — not SQL syntax.' },
    ],
    quiz: [
      {
        q: 'SQLite differs from Postgres mainly because:',
        options: ['It uses different SQL syntax entirely', 'It embeds in your process with no separate server', 'It cannot run SELECT', 'It only works in browsers'],
        answer: 1,
      },
      {
        q: 'sqlite3.connect(":memory:") creates:',
        options: ['A file on disk', 'An ephemeral in-memory database', 'A network connection', 'An ORM session'],
        answer: 1,
      },
      {
        q: 'In sqlite3, values are passed separately using:',
        options: ['String concatenation', '? placeholders in the SQL and a tuple of values', 'HTML forms', 'Git commits'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>SQLite</strong> embeds the engine — great for tests and prototypes.</>,
      <>Use Python's <code>sqlite3</code> module with <code>?</code> placeholders for values.</>,
      <><code>:memory:</code> databases are ephemeral — perfect for unit tests.</>,
    ],
  }),

  'sql-conn-postgres': createChapterLesson({
    id: 'sql-conn-postgres',
    modelTitle: 'PostgreSQL drivers',
    intro: (
      <p className="prose">
        Production apps usually talk to PostgreSQL or MySQL over the network. Drivers
        like psycopg2 handle connection setup, placeholders, and result fetching —
        your SQL stays largely the same as SQLite.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Production apps usually run <strong>PostgreSQL</strong> or MySQL as a separate
          server. <strong>psycopg2</strong> (sync) and <strong>asyncpg</strong> (async)
          are the standard Python drivers. Connection details go in a{' '}
          <strong>DSN</strong> (data source name):
        </p>
        <CodePreview
          language="python"
          code={`postgresql://user:password@db.example.com:5432/shop

# psycopg2 uses %s placeholders (not ?)
cur.execute("SELECT name FROM users WHERE id = %s", (user_id,))`}
        />
        <Callout kind="note" title="Same SQL, different wire">
          Your SELECT/JOIN queries are largely portable between SQLite and Postgres —
          only connection setup and a few dialect differences change.
        </Callout>
      </>
    ),
    playground: <SnippetRunner snippets={snippets('Postgres-style connector')} />,
    terms: [
      { term: 'PostgreSQL', def: 'A production-grade relational database server.' },
      { term: 'DSN', def: 'Connection string encoding host, port, database, and credentials.' },
      { term: 'connector / driver', def: 'Library that connects your app to a database server.' },
    ],
    quiz: [
      {
        q: 'psycopg2 is a driver for:',
        options: ['MongoDB', 'PostgreSQL', 'Redis', 'React'],
        answer: 1,
      },
      {
        q: 'A DSN encodes:',
        options: ['Only table names', 'Host, port, database, and credentials', 'CSS selectors', 'React props'],
        answer: 1,
      },
      {
        q: 'psycopg2 uses which placeholder style?',
        options: ['? only', '%s', '$HTML', '@react'],
        answer: 1,
      },
    ],
    recap: [
      <>Production apps use server databases like <strong>PostgreSQL</strong> with drivers such as <strong>psycopg2</strong>.</>,
      <>Connection details live in a <strong>DSN</strong> string.</>,
      <>SELECT/JOIN SQL is largely portable — connection setup and placeholders differ.</>,
    ],
  }),

  'sql-conn-pool': createChapterLesson({
    id: 'sql-conn-pool',
    modelTitle: 'Connection pools',
    intro: (
      <p className="prose">
        Opening a database connection involves TCP handshake and authentication — too
        slow to repeat on every HTTP request. Connection pools keep warm connections
        ready and recycle them across handlers.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Opening a database connection costs TCP handshake + authentication. A{' '}
          <strong>connection pool</strong> keeps a set of warm connections and lends
          them to request handlers, then recycles them — critical in web servers
          handling thousands of requests.
        </p>
        <Callout kind="warning" title="Always close or pool">
          Leaked connections exhaust the database limit and stall your app. Use{' '}
          <code>with</code> blocks, context managers, or a pool that recycles automatically.
        </Callout>
      </>
    ),
    playground: (
      <>
        <SnippetRunner snippets={snippets('Connection pool pattern')} />
        <TryThis>
          In <strong>Connection pool pattern</strong>, acquire more connections than
          the pool size and observe the exhaustion error.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'connection pool', def: 'A cache of reusable database connections.' },
      { term: 'acquire / release', def: 'Borrow a connection from the pool and return it when done.' },
      { term: 'pool exhaustion', def: 'When all connections are in use and no more can be lent.' },
    ],
    quiz: [
      {
        q: 'A connection pool helps because:',
        options: ['It encrypts SQL', 'Opening connections is expensive; pools reuse them', 'It replaces indexes', 'It prevents JOINs'],
        answer: 1,
      },
      {
        q: 'Leaked connections can:',
        options: ['Speed up queries', 'Exhaust the database limit and stall your app', 'Replace transactions', 'Auto-create indexes'],
        answer: 1,
      },
      {
        q: 'After using a pooled connection you should:',
        options: ['Leave it open forever', 'Release it back to the pool', 'Delete the database', 'Restart the server'],
        answer: 1,
      },
    ],
    recap: [
      <>Opening DB connections is expensive — <strong>pools</strong> reuse warm connections.</>,
      <>Always <strong>close or release</strong> connections; leaks exhaust server limits.</>,
      <>Use context managers or pool <code>acquire</code>/<code>release</code> in web servers.</>,
    ],
  }),

  'sql-conn-orm': createChapterLesson({
    id: 'sql-conn-orm',
    modelTitle: 'ORMs & SQLAlchemy',
    intro: (
      <p className="prose">
        Raw SQL is powerful but verbose for everyday CRUD. ORMs map Python classes to
        tables and generate SQL for you — SQLAlchemy is the most popular choice, with
        a lower-level Core API when you need control.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          An <strong>ORM</strong> (object-relational mapper) maps Python classes to
          tables and generates SQL for you. <strong>SQLAlchemy</strong> is the most
          popular choice in Python — it also offers a lower-level Core API when you
          need raw SQL control.
        </p>
        <CodePreview
          language="python"
          code={`from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

engine = create_engine("postgresql://user:pass@localhost/app")
with Session(engine) as session:
    users = session.execute(text("SELECT * FROM users")).all()`}
        />
      </>
    ),
    playground: <SnippetRunner snippets={snippets('ORM-style query (SQLAlchemy idea)')} />,
    hood: (
      <UnderTheHood title="ORM trade-offs">
        <p className="prose">
          ORMs speed up CRUD and migrations but can generate slow queries if you
          don't understand what SQL they emit. Use an ORM for most app code; drop
          to raw SQL for hot paths you have profiled.
        </p>
      </UnderTheHood>
    ),
    terms: [
      { term: 'ORM', def: 'Maps Python classes to tables; generates SQL under the hood.' },
      { term: 'SQLAlchemy', def: 'The most popular Python ORM, with Core and ORM layers.' },
      { term: 'migration', def: 'Versioned schema changes managed alongside application code.' },
    ],
    quiz: [
      {
        q: 'An ORM primarily:',
        options: ['Replaces the database', 'Maps classes to tables and generates SQL', 'Only works with SQLite', 'Prevents all JOINs'],
        answer: 1,
      },
      {
        q: 'When should you drop to raw SQL?',
        options: ['Never', 'For hot paths you have profiled and optimized', 'Only in HTML templates', 'When using React'],
        answer: 1,
      },
      {
        q: 'SQLAlchemy Session is used to:',
        options: ['Render React components', 'Execute queries and track objects against the database', 'Configure nginx', 'Compile TypeScript'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>ORMs</strong> like SQLAlchemy map Python classes to tables and generate SQL.</>,
      <>Great for CRUD and migrations; understand the SQL they emit.</>,
      <>Drop to raw SQL for profiled hot paths.</>,
    ],
  }),

  'sql-playground': createChapterLesson({
    id: 'sql-playground',
    modelTitle: 'Run SQL live',
    playgroundTitle: 'Interactive playground',
    intro: (
      <p className="prose">
        Reading about JOINs and aggregates is one thing — running them against real
        data cements the mental model. The playground below is a SQLite database in
        your browser via Pyodide.
      </p>
    ),
    model: (
      <p className="prose">
        This is a real SQLite database running in your browser via Pyodide. Use the
        sample buttons for joins, aggregates, subqueries, and write operations —
        then edit the query and re-run.
      </p>
    ),
    playground: (
      <>
        <SqlPlayground />
        <TryThis>
          Run <strong>Left join (all customers)</strong> and find customers with zero
          orders. Then run <strong>Aggregate + HAVING</strong> and change the revenue
          threshold. Try <strong>Insert row</strong> and confirm the new order appears.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'Pyodide', def: 'Python compiled to WebAssembly, running SQLite in the browser.' },
      { term: 'sample query', def: 'A pre-built SQL example you can run and edit to learn patterns.' },
      { term: 'live result set', def: 'Rows returned by your query, displayed immediately after execution.' },
    ],
    quiz: [
      {
        q: 'LEFT JOIN in the playground helps you find:',
        options: ['Only matched rows', 'Customers with zero orders', 'Index definitions', 'Connection pools'],
        answer: 1,
      },
      {
        q: 'HAVING filters:',
        options: ['Individual rows before grouping', 'Groups after aggregation', 'Network packets', 'CSS classes'],
        answer: 1,
      },
      {
        q: 'After INSERT in the playground you should:',
        options: ['Restart the browser', 'Re-run a SELECT to confirm the new row', 'Drop all tables', 'Disable transactions'],
        answer: 1,
      },
    ],
    recap: [
      <>The playground runs real <strong>SQLite</strong> in your browser.</>,
      <>Try sample buttons for joins, aggregates, subqueries, and writes — then edit and re-run.</>,
      <>Experiment with <strong>LEFT JOIN</strong> and <strong>HAVING</strong> to see results immediately.</>,
    ],
  }),

  'sql-labs': createChapterLesson({
    id: 'sql-labs',
    modelTitle: 'Code lab',
    playgroundTitle: 'Run the snippets',
    intro: (
      <p className="prose">
        Connecting Python to a database repeats the same patterns: open a connection,
        run parameterized SQL, fetch rows. These snippets show sqlite3 in action —
        the same engine powering the playground.
      </p>
    ),
    model: (
      <p className="prose">
        These snippets use Python's built-in <code>sqlite3</code> module — the same
        engine powering the playground. Notice how <code>?</code> placeholders keep
        user input out of the SQL string.
      </p>
    ),
    playground: (
      <>
        <SnippetRunner snippets={SQL_SNIPPETS} />
        <TryThis>
          Run <strong>Parameterized query</strong> — even malicious-looking input is
          treated as a literal string, not executable SQL.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'parameterized query', def: 'SQL with placeholders; values sent separately from the command text.' },
      { term: 'fetchone / fetchall', def: 'sqlite3 methods to read one row or all rows from a cursor.' },
      { term: 'executescript', def: 'Runs multiple SQL statements in one call — useful for setup in tests.' },
    ],
    quiz: [
      {
        q: 'How do you prevent SQL injection?',
        options: ['Trust the input', 'Use parameterized queries', 'Uppercase the SQL', 'Add more JOINs'],
        answer: 1,
        explain: 'Parameters keep data separate from SQL code, so input cannot become commands.',
      },
      {
        q: 'In JOIN in Python, GROUP BY with SUM returns:',
        options: ['Random bytes', 'Per-group totals like revenue by customer', 'Only schema metadata', 'HTTP headers'],
        answer: 1,
      },
      {
        q: 'Malicious input like \'; DROP TABLE users; -- is safe when:',
        options: ['Concatenated into the SQL string', 'Passed as a parameter value', 'Uppercased', 'Sent over FTP'],
        answer: 1,
      },
    ],
    recap: [
      <>Use <code>sqlite3</code> with <code>?</code> placeholders — values stay separate from SQL text.</>,
      <>Run all snippets to see connects, joins, Postgres-style drivers, pools, and ORM patterns.</>,
      <>Always <strong>parameterize</strong> user input to prevent SQL injection.</>,
    ],
  }),

  'sql-hood': createChapterLesson({
    id: 'sql-hood',
    modelTitle: 'Performance & safety',
    intro: (
      <p className="prose">
        Fast queries and safe apps depend on what happens inside the database engine.
        Indexes, query plans, and parameterized queries are the three ideas that
        separate prototypes from production systems.
      </p>
    ),
    model: (
      <p className="prose">
        When tables grow to millions of rows, the engine's choices about indexes and
        join order dominate latency. And at the application boundary, how you pass
        user input into queries determines whether your app stays secure.
      </p>
    ),
    playground: <SqlPlayground sampleLabels={['Inner join']} />,
    hood: (
      <>
        <UnderTheHood title="Indexes: the database's table of contents">
          <p className="prose">
            Without help, finding rows means scanning the whole table (O(n)). An{' '}
            <strong>index</strong> is a sorted structure (usually a B-tree) on a
            column that lets the database jump straight to matching rows. Queries on{' '}
            <code>orders.customer_id</code> or <code>customers.email</code> benefit
            hugely from indexes at scale.
          </p>
        </UnderTheHood>
        <UnderTheHood title="The query planner">
          <p className="prose">
            When you write SQL, the database's <strong>query planner</strong> chooses
            join order, index usage, and algorithms. Two queries that look similar
            can perform very differently — which is why <code>EXPLAIN</code> exists
            to show the plan without running the query.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Why parameterize queries (SQL injection)">
          <p className="prose">
            Never build queries by pasting user input into a string. If a value like{' '}
            <code>'; DROP TABLE users;--</code> gets concatenated in, the database
            executes it. <strong>Parameterized queries</strong> send the SQL and values
            separately, so input can never be interpreted as commands.
          </p>
        </UnderTheHood>
      </>
    ),
    terms: [
      { term: 'index', def: 'A structure that speeds up lookups on a column.' },
      { term: 'query planner', def: 'The component that chooses join order, indexes, and algorithms.' },
      { term: 'SQL injection', def: 'When untrusted input is executed as SQL commands.' },
    ],
    quiz: [
      {
        q: 'An index on orders.customer_id helps because:',
        options: ['It encrypts rows', 'Lookups skip full table scans at scale', 'It replaces JOINs', 'It deletes old data'],
        answer: 1,
      },
      {
        q: 'EXPLAIN shows:',
        options: ['Query results only', 'The query plan without running the full query', 'User passwords', 'React component trees'],
        answer: 1,
      },
      {
        q: 'SQL injection is prevented by:',
        options: ['Concatenating user input', 'Parameterized queries that separate data from SQL', 'Using more JOINs', 'Disabling WHERE'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>Indexes</strong> speed lookups; add them on columns you filter or join frequently.</>,
      <>Use <code>EXPLAIN</code> to inspect the <strong>query planner</strong>'s choices.</>,
      <>Always use <strong>parameterized queries</strong> — never paste user input into SQL strings.</>,
    ],
  }),
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'
import { SqlPlayground } from './SqlPlayground.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Connect & query',
    code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);
INSERT INTO users VALUES (1, 'Ada'), (2, 'Grace');
""")
cur = conn.execute("SELECT name FROM users WHERE id = ?", (2,))
print(cur.fetchone()[0])`,
  },
  {
    label: 'Parameterized query',
    code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")
conn.execute("INSERT INTO users VALUES (?, ?)", (1, "Ada"))

# Safe — value is data, not SQL syntax
name = "'; DROP TABLE users; --"
cur = conn.execute("SELECT * FROM users WHERE name = ?", (name,))
print("rows:", cur.fetchall())`,
  },
  {
    label: 'JOIN in Python',
    code: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
INSERT INTO customers VALUES (1, 'Ada'), (2, 'Grace');
INSERT INTO orders VALUES (1, 1, 80), (2, 1, 220), (3, 2, 50);
""")
sql = """
SELECT c.name, SUM(o.amount) AS total
FROM orders o
JOIN customers c ON c.id = o.customer_id
GROUP BY c.name
ORDER BY total DESC
"""
for row in conn.execute(sql):
    print(row)`,
  },
  {
    label: 'Postgres-style connector',
    code: `# psycopg2 / asyncpg — same SQL, different server
# Connection string: postgresql://user:pass@host:5432/dbname

class FakeConnection:
    def __init__(self, dsn):
        self.dsn = dsn
        self._open = True
    def execute(self, sql, params=()):
        print(f"EXEC on {self.dsn.split('@')[-1]}")
        print("  sql:", sql.strip().split("\\n")[0])
        print("  params:", params)
        return [("Ada",)]
    def close(self):
        self._open = False

dsn = "postgresql://app:secret@db.example.com:5432/shop"
conn = FakeConnection(dsn)
rows = conn.execute("SELECT name FROM users WHERE id = %s", (1,))
print("result:", rows)
conn.close()`,
  },
  {
    label: 'Connection pool pattern',
    code: `# Pools reuse connections — expensive to open TCP+auth every request
class Pool:
    def __init__(self, size=3):
        self.available = [f"conn-{i}" for i in range(size)]
        self.in_use = set()
    def acquire(self):
        if not self.available:
            raise RuntimeError("pool exhausted")
        c = self.available.pop()
        self.in_use.add(c)
        return c
    def release(self, conn):
        self.in_use.discard(conn)
        self.available.append(conn)

pool = Pool(2)
a = pool.acquire()
b = pool.acquire()
print("in use:", pool.in_use)
pool.release(a)
print("available:", len(pool.available))`,
  },
  {
    label: 'ORM-style query (SQLAlchemy idea)',
    code: `# ORMs map Python classes to tables — still generate SQL underneath
class User:
    table = "users"
    def __init__(self, id, name):
        self.id, self.name = id, name

def select_where(model, **filters):
    cols = " AND ".join(f"{k} = ?" for k in filters)
    sql = f"SELECT * FROM {model.table} WHERE {cols}"
    return sql, tuple(filters.values())

sql, params = select_where(User, name="Ada")
print("generated:", sql)
print("params:", params)
print("tip: ORMs help migrations + type safety; raw SQL for hot paths")`,
  },
]

export default function SqlLesson() {
  return (
    <Lesson id="sql">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Most applications keep their data in a relational database and talk to it
          with <strong>SQL</strong>. It's one of the most durable skills in software
          — the same queries you learn today work across Postgres, MySQL, SQLite,
          and more. SQL is <em>declarative</em>: you say <em>what</em> you want,
          not how to fetch it row by row.
        </p>
        <Callout kind="why" title="The one idea">
          Data lives in <strong>tables</strong> (rows and columns). You{' '}
          <strong>query</strong> it by describing the result you want; the database
          engine figures out how to produce it efficiently.
        </Callout>
      </Section>

      <Section id="model" title="Tables & queries">
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
      </Section>

      <Section id="schema" title="Schema, keys & relationships">
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
      </Section>

      <Section id="writes" title="Insert, update & delete">
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
      </Section>

      <Section id="advanced" title="Joins, aggregates & subqueries">
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
      </Section>

      <Section id="connectors" title="Connectors & drivers">
        <p className="prose">
          SQL runs on a <strong>database server</strong> (or embedded engine like SQLite).
          Your application talks to it through a <strong>connector</strong> or{' '}
          <strong>driver</strong> — a library that opens connections, sends queries, and
          returns rows. The SQL you write is mostly portable; the connection setup is not.
        </p>
        <ul className="prose-list">
          <li>
            <strong>sqlite3</strong> (stdlib) — file or <code>:memory:</code> database, zero
            server setup, great for dev and tests.
          </li>
          <li>
            <strong>psycopg2</strong> / <strong>asyncpg</strong> — PostgreSQL drivers; use
            a DSN like <code>postgresql://user:pass@host:5432/db</code>.
          </li>
          <li>
            <strong>SQLAlchemy</strong> — ORM + Core; generates SQL from Python objects and
            manages connections/pools.
          </li>
          <li>
            <strong>Connection pools</strong> — reuse open connections across requests
            instead of paying TCP + auth cost every time.
          </li>
        </ul>
        <pre className="term-output">{`# FastAPI + SQLAlchemy (typical stack)
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

engine = create_engine("postgresql://user:pass@localhost/app")
with Session(engine) as session:
    users = session.execute(text("SELECT * FROM users")).all()`}</pre>
        <SnippetRunner
          snippets={SNIPPETS.filter((s) =>
            ['Connect & query', 'Postgres-style connector', 'Connection pool pattern', 'ORM-style query (SQLAlchemy idea)'].includes(s.label),
          )}
        />
        <Callout kind="warning" title="Always close or pool">
          Leaked connections exhaust the database's limit and stall your app. Use{' '}
          <code>with</code> blocks, context managers, or a pool that recycles connections
          automatically.
        </Callout>
        <TryThis>
          Run <strong>Connection pool pattern</strong> and acquire more connections than
          the pool size — see the exhaustion error. Compare parameterized queries in{' '}
          <strong>Connect & query</strong> vs string building.
        </TryThis>
      </Section>

      <Section id="playground" title="Run SQL live">
        <p className="prose">
          This is a real SQLite database running in your browser via Pyodide. Use the
          sample buttons for joins, aggregates, subqueries, and write operations —
          then edit the query and re-run.
        </p>
        <SqlPlayground />
        <TryThis>
          Run <strong>Left join (all customers)</strong> and find customers with zero
          orders. Then run <strong>Aggregate + HAVING</strong> and change the revenue
          threshold. Try <strong>Insert row</strong> and confirm the new order appears.
        </TryThis>
      </Section>

      <Section id="labs" title="Code lab">
        <p className="prose">
          These snippets use Python's built-in <code>sqlite3</code> module — the same
          engine powering the playground. Notice how <code>?</code> placeholders keep
          user input out of the SQL string.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          Run <strong>Parameterized query</strong> — even malicious-looking input is
          treated as a literal string, not executable SQL.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
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
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'table', def: 'A set of rows with typed columns.' },
            { term: 'primary key', def: 'A column uniquely identifying each row.' },
            { term: 'foreign key', def: 'A column referencing a row in another table.' },
            { term: 'JOIN', def: 'Combining rows from tables on a matching key.' },
            { term: 'aggregate', def: 'A function like COUNT/SUM over grouped rows.' },
            { term: 'HAVING', def: 'A filter applied after GROUP BY.' },
            { term: 'transaction', def: 'A group of writes that commit or roll back together.' },
            { term: 'index', def: 'A structure that speeds up lookups on a column.' },
            { term: 'connector / driver', def: 'Library that connects your app to a database server.' },
            { term: 'DSN', def: 'Connection string encoding host, port, database, and credentials.' },
            { term: 'connection pool', def: 'A cache of reusable database connections.' },
            { term: 'ORM', def: 'Maps Python classes to tables; generates SQL under the hood.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which clause filters which rows are returned?',
              options: ['SELECT', 'WHERE', 'ORDER BY', 'JOIN'],
              answer: 1,
              explain: 'WHERE applies a condition to include/exclude rows before grouping.',
            },
            {
              q: 'What does a LEFT JOIN do differently from INNER JOIN?',
              options: ['Sorts rows', 'Keeps all rows from the left table even without a match', 'Deletes rows', 'Counts rows'],
              answer: 1,
              explain: 'LEFT JOIN preserves left-side rows; unmatched right columns become NULL.',
            },
            {
              q: 'How do you prevent SQL injection?',
              options: ['Trust the input', 'Use parameterized queries', 'Uppercase the SQL', 'Add more JOINs'],
              answer: 1,
              explain: 'Parameters keep data separate from SQL code, so input cannot become commands.',
            },
            {
              q: 'HAVING is used to:',
              options: ['Filter rows before grouping', 'Filter groups after aggregation', 'Sort results', 'Create indexes'],
              answer: 1,
              explain: 'HAVING filters grouped results — e.g. cities with revenue > 100.',
            },
            {
              q: 'A foreign key ensures:',
              options: ['Fast sorting', 'Referential integrity between tables', 'Encryption', 'Automatic backups'],
              answer: 1,
              explain: 'Foreign keys prevent orphan rows pointing at missing parents.',
            },
            {
              q: 'Why use a transaction for a money transfer?',
              options: ['It runs faster', 'Both debit and credit succeed or neither does', 'It avoids indexes', 'It encrypts data'],
              answer: 1,
              explain: 'Transactions are atomic — partial updates roll back on failure.',
            },
            {
              q: 'PRIMARY KEY ensures:',
              options: ['Fast network', 'Each row has a unique identifier', 'UTF-8 encoding', 'No NULLs anywhere'],
              answer: 1,
              explain: 'Primary keys uniquely identify rows in a table.',
            },
            {
              q: 'A connection pool helps because:',
              options: ['It encrypts SQL', 'Opening connections is expensive; pools reuse them', 'It replaces indexes', 'It prevents JOINs'],
              answer: 1,
            },
            {
              q: 'psycopg2 is a driver for:',
              options: ['MongoDB', 'PostgreSQL', 'Redis', 'React'],
              answer: 1,
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Relational data lives in <strong>tables</strong> linked by keys.</>,
            <>SQL is declarative: <code>SELECT … FROM … WHERE … JOIN … GROUP BY … HAVING</code>.</>,
            <><strong>LEFT JOIN</strong> keeps unmatched left rows; <strong>HAVING</strong> filters groups.</>,
            <>Wrap related writes in <strong>transactions</strong>; use <strong>indexes</strong> for fast lookups.</>,
            <>Always use <strong>parameterized queries</strong> to avoid SQL injection.</>,
            <><strong>Connectors</strong> (sqlite3, psycopg2, SQLAlchemy) bridge your app to the database; use <strong>pools</strong> in production.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

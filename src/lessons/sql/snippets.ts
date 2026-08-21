import type { Snippet } from '../components/SnippetRunner.tsx'

export const SQL_SNIPPETS: Snippet[] = [
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

export function snippets(...labels: string[]) {
  return SQL_SNIPPETS.filter((s) => labels.includes(s.label))
}

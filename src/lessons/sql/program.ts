// Python program for the SQL lesson. Pyodide bundles CPython's sqlite3, so this
// is a real in-memory SQLite database seeded with a tiny e-commerce schema.
export const SQL_PROGRAM = String.raw`
import sqlite3, json

_conn = sqlite3.connect(':memory:')
_conn.executescript("""
CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, product TEXT, amount REAL);

INSERT INTO customers (id, name, city) VALUES
  (1, 'Ada',   'London'),
  (2, 'Grace', 'New York'),
  (3, 'Linus', 'Helsinki'),
  (4, 'Katherine', 'New York');

INSERT INTO orders (id, customer_id, product, amount) VALUES
  (1, 1, 'Keyboard', 80.0),
  (2, 1, 'Monitor', 220.0),
  (3, 2, 'Mouse', 25.0),
  (4, 3, 'Monitor', 220.0),
  (5, 2, 'Laptop', 1300.0),
  (6, 4, 'Mouse', 25.0);
""")
_conn.commit()


def run_sql(query):
    try:
        cur = _conn.cursor()
        cur.execute(query)
        if cur.description:
            cols = [d[0] for d in cur.description]
            rows = [list(r) for r in cur.fetchall()]
            return json.dumps({'columns': cols, 'rows': rows})
        _conn.commit()
        return json.dumps({'columns': ['result'], 'rows': [['OK — ' + str(cur.rowcount) + ' row(s) affected']]})
    except Exception as e:
        return json.dumps({'error': str(e)})
`

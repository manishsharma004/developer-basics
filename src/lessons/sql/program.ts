// Python program for the SQL lesson. Pyodide bundles CPython's sqlite3, so this
// is a real in-memory SQLite database seeded with a small e-commerce schema.
export const SQL_PROGRAM = String.raw`
import sqlite3, json

_conn = sqlite3.connect(':memory:')
_conn.row_factory = sqlite3.Row
_conn.executescript("""
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO customers (id, name, city, email) VALUES
  (1, 'Ada',       'London',   'ada@math.org'),
  (2, 'Grace',     'New York', 'grace@navy.mil'),
  (3, 'Linus',     'Helsinki', 'linus@kernel.org'),
  (4, 'Katherine', 'New York', 'katherine@nasa.gov'),
  (5, 'Alan',      'London',   'alan@princeton.edu');

INSERT INTO products (id, sku, name, category, price) VALUES
  (1, 'KB-01', 'Keyboard', 'peripherals', 80.0),
  (2, 'MN-27', 'Monitor',  'displays',    220.0),
  (3, 'MS-02', 'Mouse',    'peripherals', 25.0),
  (4, 'LP-99', 'Laptop',   'computers',   1300.0),
  (5, 'HD-10', 'Headphones','audio',       60.0);

INSERT INTO orders (id, customer_id, product_id, quantity, amount, status) VALUES
  (1, 1, 1, 1,  80.0,  'shipped'),
  (2, 1, 2, 1, 220.0,  'shipped'),
  (3, 2, 3, 2,  50.0,  'shipped'),
  (4, 3, 2, 1, 220.0,  'pending'),
  (5, 2, 4, 1,1300.0,  'shipped'),
  (6, 4, 3, 1,  25.0,  'cancelled'),
  (7, 5, 5, 1,  60.0,  'pending'),
  (8, 1, 3, 1,  25.0,  'pending');
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

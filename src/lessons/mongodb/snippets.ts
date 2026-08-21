import type { Snippet } from '../components/SnippetRunner.tsx'

export const MONGODB_SNIPPETS: Snippet[] = [
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
  {
    label: 'ODM-style model (Beanie idea)',
    code: `# ODM maps a Python class to a MongoDB collection with validation
class Order:
    def __init__(self, city: str, amount: float, status: str = "pending"):
        self.city = city
        self.amount = amount
        self.status = status

    def to_doc(self):
        return {"city": self.city, "amount": self.amount, "status": self.status}

    @classmethod
    def from_doc(cls, doc):
        return cls(doc["city"], doc["amount"], doc.get("status", "pending"))

orders = [Order("London", 80, "shipped"), Order("Paris", 120, "pending")]
docs = [o.to_doc() for o in orders]
high_value = [Order.from_doc(d) for d in docs if d["amount"] > 100]
print("all:", docs)
print("amount > 100:", [o.to_doc() for o in high_value])`,
  },
]

export function snippets(...labels: string[]) {
  return MONGODB_SNIPPETS.filter((s) => labels.includes(s.label))
}

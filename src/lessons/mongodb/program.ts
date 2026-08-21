// In-memory document database with a MongoDB-style shell API for the browser lesson.
export const MONGO_PROGRAM = String.raw`
import json, copy, re

_next_id = 100

collections = {
    "customers": [
        {"_id": 1, "name": "Ada", "city": "London", "email": "ada@math.org", "tags": ["vip", "eu"]},
        {"_id": 2, "name": "Grace", "city": "New York", "email": "grace@navy.mil", "tags": ["vip"]},
        {"_id": 3, "name": "Linus", "city": "Helsinki", "email": "linus@kernel.org", "tags": ["eu"]},
        {"_id": 4, "name": "Katherine", "city": "New York", "email": "katherine@nasa.gov", "tags": ["vip", "us"]},
        {"_id": 5, "name": "Alan", "city": "London", "email": "alan@princeton.edu", "tags": ["eu"]},
    ],
    "products": [
        {"_id": 1, "sku": "KB-01", "name": "Keyboard", "category": "peripherals", "price": 80.0},
        {"_id": 2, "sku": "MN-27", "name": "Monitor", "category": "displays", "price": 220.0},
        {"_id": 3, "sku": "MS-02", "name": "Mouse", "category": "peripherals", "price": 25.0},
        {"_id": 4, "sku": "LP-99", "name": "Laptop", "category": "computers", "price": 1300.0},
        {"_id": 5, "sku": "HD-10", "name": "Headphones", "category": "audio", "price": 60.0},
    ],
    "orders": [
        {"_id": 1, "customer_id": 1, "product": "Keyboard", "amount": 80.0, "status": "shipped", "city": "London"},
        {"_id": 2, "customer_id": 1, "product": "Monitor", "amount": 220.0, "status": "shipped", "city": "London"},
        {"_id": 3, "customer_id": 2, "product": "Mouse", "amount": 50.0, "status": "shipped", "city": "New York"},
        {"_id": 4, "customer_id": 3, "product": "Monitor", "amount": 220.0, "status": "pending", "city": "Helsinki"},
        {"_id": 5, "customer_id": 2, "product": "Laptop", "amount": 1300.0, "status": "shipped", "city": "New York"},
        {"_id": 6, "customer_id": 4, "product": "Mouse", "amount": 25.0, "status": "cancelled", "city": "New York"},
        {"_id": 7, "customer_id": 5, "product": "Headphones", "amount": 60.0, "status": "pending", "city": "London"},
    ],
}


def _match(doc, filt):
    if not filt:
        return True
    for key, expected in filt.items():
        if key not in doc:
            return False
        actual = doc[key]
        if isinstance(expected, dict):
            for op, val in expected.items():
                if op == "$gt" and not (actual > val):
                    return False
                elif op == "$gte" and not (actual >= val):
                    return False
                elif op == "$lt" and not (actual < val):
                    return False
                elif op == "$lte" and not (actual <= val):
                    return False
                elif op == "$ne" and not (actual != val):
                    return False
                elif op == "$in" and actual not in val:
                    return False
                elif op == "$nin" and actual in val:
                    return False
                elif op == "$regex" and not re.search(val, str(actual)):
                    return False
        elif actual != expected:
            return False
    return True


def _get_field(doc, path):
    cur = doc
    for part in path.lstrip("$").split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    return cur


def _aggregate(collection, pipeline):
    docs = list(collection)
    for stage in pipeline:
        if "$match" in stage:
            docs = [d for d in docs if _match(d, stage["$match"])]
        elif "$project" in stage:
            projected = []
            for d in docs:
                row = {}
                for out_key, spec in stage["$project"].items():
                    if spec == 1:
                        row[out_key] = d.get(out_key)
                    elif isinstance(spec, str) and spec.startswith("$"):
                        row[out_key] = _get_field(d, spec)
                projected.append(row)
            docs = projected
        elif "$group" in stage:
            groups = {}
            group_id = stage["$group"].get("_id")
            for d in docs:
                if isinstance(group_id, str) and group_id.startswith("$"):
                    key = _get_field(d, group_id)
                else:
                    key = group_id
                bucket = groups.setdefault(key, {"_id": key})
                for out_key, spec in stage["$group"].items():
                    if out_key == "_id":
                        continue
                    if isinstance(spec, dict) and "$sum" in spec:
                        val = spec["$sum"]
                        if val == 1:
                            add = 1
                        elif isinstance(val, str) and val.startswith("$"):
                            add = _get_field(d, val) or 0
                        else:
                            add = val
                        bucket[out_key] = bucket.get(out_key, 0) + add
                    elif isinstance(spec, dict) and "$avg" in spec:
                        field = spec["$avg"]
                        val = _get_field(d, field) if isinstance(field, str) else field
                        bucket.setdefault("_vals", []).append(val)
                        bucket[out_key] = sum(bucket["_vals"]) / len(bucket["_vals"])
            docs = list(groups.values())
            for row in docs:
                row.pop("_vals", None)
        elif "$sort" in stage:
            for field, direction in reversed(list(stage["$sort"].items())):
                docs.sort(key=lambda d: d.get(field), reverse=(direction == -1))
        elif "$limit" in stage:
            docs = docs[: stage["$limit"]]
    return docs


def _parse_json(text):
    return json.loads(text)


def run_mongo(source):
    global _next_id
    try:
        source = source.strip()
        if not source:
            return json.dumps({"error": "Empty command"})

        m = re.match(r"db\.(\w+)\.find\s*\((.*)\)\s*$", source, re.S)
        if m:
            name, args = m.group(1), m.group(2).strip()
            if name not in collections:
                return json.dumps({"error": f"Unknown collection: {name}"})
            filt = _parse_json(args) if args else {}
            docs = [d for d in collections[name] if _match(d, filt)]
            return json.dumps({"kind": "find", "count": len(docs), "documents": docs})

        m = re.match(r"db\.(\w+)\.insertOne\s*\((.*)\)\s*$", source, re.S)
        if m:
            name, args = m.group(1), m.group(2).strip()
            if name not in collections:
                return json.dumps({"error": f"Unknown collection: {name}"})
            doc = _parse_json(args)
            if "_id" not in doc:
                _next_id += 1
                doc["_id"] = _next_id
            collections[name].append(doc)
            return json.dumps({"kind": "insert", "insertedId": doc["_id"], "documents": [doc]})

        m = re.match(r"db\.(\w+)\.updateMany\s*\((.*)\)\s*$", source, re.S)
        if m:
            name, args = m.group(1), m.group(2).strip()
            if name not in collections:
                return json.dumps({"error": f"Unknown collection: {name}"})
            filt_text, update_text = args.split(",", 1)
            filt = _parse_json(filt_text.strip())
            update = _parse_json(update_text.strip())
            changed = 0
            for doc in collections[name]:
                if _match(doc, filt):
                    if "$set" in update:
                        doc.update(update["$set"])
                    changed += 1
            return json.dumps({"kind": "update", "modifiedCount": changed})

        m = re.match(r"db\.(\w+)\.deleteMany\s*\((.*)\)\s*$", source, re.S)
        if m:
            name, args = m.group(1), m.group(2).strip()
            if name not in collections:
                return json.dumps({"error": f"Unknown collection: {name}"})
            filt = _parse_json(args) if args else {}
            before = len(collections[name])
            collections[name] = [d for d in collections[name] if not _match(d, filt)]
            removed = before - len(collections[name])
            return json.dumps({"kind": "delete", "deletedCount": removed})

        m = re.match(r"db\.(\w+)\.aggregate\s*\((.*)\)\s*$", source, re.S)
        if m:
            name, args = m.group(1), m.group(2).strip()
            if name not in collections:
                return json.dumps({"error": f"Unknown collection: {name}"})
            pipeline = _parse_json(args)
            docs = _aggregate(collections[name], pipeline)
            return json.dumps({"kind": "aggregate", "count": len(docs), "documents": docs})

        return json.dumps({"error": "Unsupported command. Try db.orders.find({...}) or db.orders.aggregate([...])"})
    except Exception as e:
        return json.dumps({"error": str(e)})
`

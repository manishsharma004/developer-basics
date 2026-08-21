#!/usr/bin/env python3
"""Insert extra quiz questions and bump minutes in meta.ts for all lessons."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSONS = ROOT / "src" / "lessons"
META = ROOT / "src" / "lessons" / "meta.ts"

# Two additional questions per lesson (answer index 0-based)
EXTRA_QUIZ: dict[str, list[dict]] = {
    "variables": [
        {
            "q": "What does `is` test versus `==`?",
            "options": ["Value equality", "Identity (same object in memory)", "Type match", "String length"],
            "answer": 1,
            "explain": "`is` compares object identity; `==` compares values.",
        },
        {
            "q": "Which is truthy?",
            "options": ["None", "[]", "[0]", '""'],
            "answer": 2,
            "explain": "A list containing 0 is non-empty, so it is truthy.",
        },
    ],
    "controlflow": [
        {
            "q": "What does `break` do inside a loop?",
            "options": ["Skip one iteration", "Exit the loop immediately", "Return from the function", "Restart the program"],
            "answer": 1,
            "explain": "`break` leaves the innermost loop right away.",
        },
        {
            "q": "`while True:` without a break is:",
            "options": ["Always valid", "An infinite loop", "Syntax error", "Same as for-loop"],
            "answer": 1,
            "explain": "The condition never becomes false unless you break or return.",
        },
    ],
    "data": [
        {
            "q": "How many bits are in one byte?",
            "options": ["4", "8", "16", "32"],
            "answer": 1,
            "explain": "A byte is eight bits (256 distinct values).",
        },
        {
            "q": "Why is hex popular for memory dumps?",
            "options": ["Hex is faster", "Two hex digits map cleanly to one byte", "Decimals are illegal", "Unicode requires hex"],
            "answer": 1,
            "explain": "Each byte is exactly two hex digits — easy to read at a glance.",
        },
    ],
    "json": [
        {
            "q": "JSON `null` in Python becomes:",
            "options": ["0", "False", "None", "empty string"],
            "answer": 2,
            "explain": "JSON null maps to Python None on load.",
        },
        {
            "q": "Why might pretty JSON be larger on the wire?",
            "options": ["Different data", "Extra whitespace", "Encryption", "Base64 encoding"],
            "answer": 1,
            "explain": "Indentation and newlines add bytes but the parsed data is the same.",
        },
    ],
    "floatingpoint": [
        {
            "q": "Best way to compare floats for equality?",
            "options": ["== always", "math.isclose with tolerance", "Convert to int", "Use strings"],
            "answer": 1,
            "explain": "Tolerance-based comparison handles representation error.",
        },
        {
            "q": "Summing many small floats can:",
            "options": ["Always be exact", "Accumulate tiny errors", "Crash Python", "Return NaN only"],
            "answer": 1,
            "explain": "Repeated approximation can drift from the mathematically exact total.",
        },
    ],
    "memory": [
        {
            "q": "Two variables pointing at the same list means:",
            "options": ["Two copies", "Aliasing — changes via one name affect the other", "Stack overflow", "GC cannot run"],
            "answer": 1,
            "explain": "They share one object; assignment copies references, not objects.",
        },
        {
            "q": "Garbage collection frees objects that are:",
            "options": ["On the stack", "Unreachable from live references", "Older than 1 second", "Larger than 1 MB"],
            "answer": 1,
            "explain": "GC reclaims memory when no references point to an object.",
        },
    ],
    "time": [
        {
            "q": "Unix epoch counts seconds since:",
            "options": ["2000-01-01", "1970-01-01 UTC", "Local midnight today", "First HTTP request"],
            "answer": 1,
            "explain": "Epoch is 1970-01-01 00:00:00 UTC (ignoring leap seconds in many APIs).",
        },
        {
            "q": "Storing only local time without timezone risks:",
            "options": ["Faster queries", "Ambiguity during DST shifts", "Smaller files", "Better sorting"],
            "answer": 1,
            "explain": "Local clocks jump or repeat during DST; UTC + offset is safer.",
        },
    ],
    "errors": [
        {
            "q": "What does `finally` guarantee?",
            "options": ["Only on success", "Runs whether or not an exception occurred", "Skips on error", "Retries the block"],
            "answer": 1,
            "explain": "`finally` runs on every exit path from the try/except.",
        },
        {
            "q": "Bare `except:` catches:",
            "options": ["Only ValueError", "Almost any exception — often too broad", "Syntax errors only", "Nothing"],
            "answer": 1,
            "explain": "Catch specific exceptions so you do not hide bugs like KeyboardInterrupt.",
        },
    ],
    "filesystem": [
        {
            "q": "A hard link vs copy:",
            "options": ["Hard link duplicates bytes", "Hard link adds another name for the same inode", "Copy is instant", "Hard link works across disks"],
            "answer": 1,
            "explain": "Hard links share data; copies duplicate file contents.",
        },
        {
            "q": "`..` in a path means:",
            "options": ["Hidden file", "Parent directory", "Root", "Current directory"],
            "answer": 1,
            "explain": "Dot-dot walks up one directory level.",
        },
    ],
    "process": [
        {
            "q": "Round Robin uses a:",
            "options": ["Priority queue only", "Time quantum per process", "Random pick", "Single long job first"],
            "answer": 1,
            "explain": "Each process gets a slice; the scheduler rotates.",
        },
        {
            "q": "A process in \"waiting\" state is usually:",
            "options": ["Crashed", "Blocked on I/O or a lock", "Using 100% CPU", "Finished"],
            "answer": 1,
            "explain": "Waiting means not runnable until an event (I/O, signal) completes.",
        },
    ],
    "concurrency": [
        {
            "q": "A race condition happens when:",
            "options": ["Two CPUs exist", "Outcome depends on thread interleaving", "Code is too fast", "Locks are used"],
            "answer": 1,
            "explain": "Shared mutable state without synchronization yields nondeterministic results.",
        },
        {
            "q": "A lock prevents:",
            "options": ["All parallelism", "Two threads entering a critical section at once", "Memory leaks", "DNS lookups"],
            "answer": 1,
            "explain": "Only one holder at a time protects shared updates.",
        },
    ],
    "compute": [
        {
            "q": "Containers vs VMs — containers typically:",
            "options": ["Include full OS kernel", "Share host kernel, isolate processes", "Cannot scale", "Are always serverless"],
            "answer": 1,
            "explain": "Containers share the kernel; VMs virtualize hardware + OS.",
        },
        {
            "q": "Autoscaling adds instances when:",
            "options": ["Disk is full", "Load exceeds capacity thresholds", "Code is committed", "DNS fails"],
            "answer": 1,
            "explain": "Metrics like CPU, latency, or queue depth trigger scale-out.",
        },
    ],
    "datastructures": [
        {
            "q": "Hash map average lookup time:",
            "options": ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            "answer": 2,
            "explain": "With a good hash and load factor, lookups are constant average time.",
        },
        {
            "q": "Linked list vs array for front insertions:",
            "options": ["Array is always faster", "Linked list avoids shifting elements", "Both are O(1)", "Neither supports insert"],
            "answer": 1,
            "explain": "Arrays must shift elements; linked lists update pointers.",
        },
    ],
    "algorithms": [
        {
            "q": "O(n²) means doubling input size roughly:",
            "options": ["Doubles work", "Quadruples work", "Halves work", "No change"],
            "answer": 1,
            "explain": "n² grows with the square — 2n → 4× comparisons in many quadratic algorithms.",
        },
        {
            "q": "Bubble sort is mainly useful for:",
            "options": ["Production at scale", "Teaching — simple but slow on large n", "Sorting millions of rows", "Hash tables"],
            "answer": 1,
            "explain": "It is easy to visualize but O(n²) is too slow for large data.",
        },
    ],
    "search": [
        {
            "q": "Binary search needs:",
            "options": ["A hash function", "Sorted (or ordered) data", "A graph", "Parallel CPUs"],
            "answer": 1,
            "explain": "Ordering lets you discard half each step.",
        },
        {
            "q": "For one lookup in a huge sorted list, prefer:",
            "options": ["Always linear", "Binary search", "Sort then forget", "Random pick"],
            "answer": 1,
            "explain": "Binary search is O(log n) vs O(n) linear scan.",
        },
    ],
    "recursion": [
        {
            "q": "Every recursive function needs:",
            "options": ["Two loops", "A base case", "Global variables", "Threads"],
            "answer": 1,
            "explain": "Base case stops recursion; without it you overflow the stack.",
        },
        {
            "q": "Memoization helps when:",
            "options": ["No repeated subproblems", "Same inputs are recomputed many times", "Using only loops", "Memory is unlimited"],
            "answer": 1,
            "explain": "Caching results avoids exponential recomputation (e.g. naive Fibonacci).",
        },
    ],
    "trees": [
        {
            "q": "BFS explores a graph:",
            "options": ["Depth-first", "Layer by layer from the start", "Random order", "Only trees, not graphs"],
            "answer": 1,
            "explain": "BFS uses a queue to visit nearest nodes first.",
        },
        {
            "q": "DFS on a tree can be implemented with:",
            "options": ["Only a queue", "Recursion or an explicit stack", "SQL", "Sorting"],
            "answer": 1,
            "explain": "Recursive calls or a stack mimic depth-first descent.",
        },
    ],
    "sql": [
        {
            "q": "PRIMARY KEY ensures:",
            "options": ["Fast network", "Each row has a unique identifier", "UTF-8 encoding", "No NULLs anywhere"],
            "answer": 1,
            "explain": "Primary keys uniquely identify rows in a table.",
        },
        {
            "q": "JOIN combines rows based on:",
            "options": ["Random order", "Related columns between tables", "File size", "CPU count"],
            "answer": 1,
            "explain": "Joins link tables via foreign keys or shared columns.",
        },
    ],
    "caching": [
        {
            "q": "A cache miss means:",
            "options": ["Data was deleted", "Requested key was not in cache — must fetch source", "TLS failed", "Disk full"],
            "answer": 1,
            "explain": "Misses are slower because you pay the full fetch cost.",
        },
        {
            "q": "LRU evicts:",
            "options": ["Random entry", "Least recently used item", "Largest item", "Newest item"],
            "answer": 1,
            "explain": "LRU drops the stale entry when capacity is full.",
        },
    ],
    "queues": [
        {
            "q": "Backpressure signals:",
            "options": ["Faster producers", "Consumers are overwhelmed — slow down or buffer", "DNS failure", "TLS expiry"],
            "answer": 1,
            "explain": "When queues grow, producers should throttle or drop per policy.",
        },
        {
            "q": "A message queue decouples:",
            "options": ["CPU and RAM", "Producer and consumer lifetimes", "Git branches", "CSS themes"],
            "answer": 1,
            "explain": "Producers can fire-and-forget; consumers process asynchronously.",
        },
    ],
    "network": [
        {
            "q": "A network timeout usually means:",
            "options": ["404 Not Found", "No response arrived within the deadline", "TLS succeeded", "DNS cached"],
            "answer": 1,
            "explain": "Timeouts are often connectivity, overload, or hung servers — not always 4xx/5xx.",
        },
        {
            "q": "HTTP/2 can improve performance by:",
            "options": ["Removing TLS", "Multiplexing many requests on one connection", "Using only GET", "Disabling caching"],
            "answer": 1,
            "explain": "One TCP connection carries parallel streams, cutting setup overhead.",
        },
    ],
    "loadbalancing": [
        {
            "q": "Health checks let a balancer:",
            "options": ["Encrypt traffic", "Skip dead backends", "Run SQL", "Compile code"],
            "answer": 1,
            "explain": "Unhealthy nodes are removed from rotation until they recover.",
        },
        {
            "q": "Sticky sessions trade:",
            "options": ["Security for speed", "Even load distribution for session locality", "JSON for XML", "TCP for UDP"],
            "answer": 1,
            "explain": "Pinning users to one server simplifies state but can skew load.",
        },
    ],
    "apis": [
        {
            "q": "REST POST to `/users` typically:",
            "options": ["Deletes a user", "Creates a new user resource", "Lists all users", "Returns 404"],
            "answer": 1,
            "explain": "POST on a collection URL usually creates a new item.",
        },
        {
            "q": "HTTP 201 Created often means:",
            "options": ["Server error", "Resource was created successfully", "Redirect", "Unauthorized"],
            "answer": 1,
            "explain": "201 is the standard success response after creation.",
        },
    ],
    "auth": [
        {
            "q": "Authentication proves:",
            "options": ["What you may do", "Who you are", "Server location", "JSON schema"],
            "answer": 1,
            "explain": "AuthN = identity; AuthZ = permissions.",
        },
        {
            "q": "JWT payload is:",
            "options": ["Encrypted secret", "Base64-encoded JSON — not secret", "Always empty", "Only for DNS"],
            "answer": 1,
            "explain": "Anyone can read the payload; the signature proves integrity.",
        },
    ],
    "crypto": [
        {
            "q": "Hashing is one-way — you cannot:",
            "options": ["Hash twice", "Recover the original input from the hash", "Use SHA-256", "Compare hashes"],
            "answer": 1,
            "explain": "Hashes are designed to be irreversible (unlike encryption).",
        },
        {
            "q": "Salting passwords helps against:",
            "options": ["DNS spoofing", "Rainbow table attacks", "HTTP caching", "Git merges"],
            "answer": 1,
            "explain": "Unique salts force attackers to crack each password separately.",
        },
    ],
    "security": [
        {
            "q": "Parameterized queries prevent:",
            "options": ["XSS only", "SQL injection by separating code from data", "All attacks", "Slow networks"],
            "answer": 1,
            "explain": "Bound parameters are not interpreted as SQL syntax.",
        },
        {
            "q": "Output escaping in HTML prevents:",
            "options": ["SQL injection", "XSS from untrusted text becoming markup", "TLS errors", "404s"],
            "answer": 1,
            "explain": "Escaping ensures user text displays as text, not executable HTML.",
        },
    ],
    "cli": [
        {
            "q": "In a pipeline `a | b`, stdout of `a` becomes:",
            "options": ["A file on disk", "stdin of `b`", "stderr of `b`", "Environment variable"],
            "answer": 1,
            "explain": "The pipe connects one process output to the next input.",
        },
        {
            "q": "Exit code 0 usually means:",
            "options": ["Failure", "Success", "Timeout", "Permission denied"],
            "answer": 1,
            "explain": "Unix convention: zero is success; non-zero signals an error.",
        },
    ],
    "git": [
        {
            "q": "A merge commit has:",
            "options": ["One parent", "Two parents when merging branches", "No parents", "Only tags"],
            "answer": 1,
            "explain": "Merge commits join two lines of history.",
        },
        {
            "q": "`git checkout -b feature` creates:",
            "options": ["A remote only", "A new branch and switches to it", "A merge conflict", "Deletes main"],
            "answer": 1,
            "explain": "-b creates the branch name and moves HEAD there.",
        },
    ],
    "regex": [
        {
            "q": "`^` in a regex anchors to:",
            "options": ["End of string", "Start of string (or line in multiline)", "Any digit", "Whitespace"],
            "answer": 1,
            "explain": "Caret matches the beginning position.",
        },
        {
            "q": "`\\d+` matches:",
            "options": ["Letters", "One or more digits", "Exactly one dot", "Nothing"],
            "answer": 1,
            "explain": "\\d is a digit; + means one or more.",
        },
    ],
    "testing": [
        {
            "q": "A flaky test:",
            "options": ["Always passes", "Sometimes passes, sometimes fails without code changes", "Runs only once", "Cannot be automated"],
            "answer": 1,
            "explain": "Flakiness often comes from timing, order, or external dependencies.",
        },
        {
            "q": "TDD order is:",
            "options": ["Refactor, red, green", "Red, green, refactor", "Green, deploy, red", "Skip tests"],
            "answer": 1,
            "explain": "Write failing test, make it pass, then improve design.",
        },
    ],
    "cicd": [
        {
            "q": "Branch protection can require:",
            "options": ["Manual deploy only", "Passing CI before merge", "No tests", "Force push always"],
            "answer": 1,
            "explain": "Required status checks block merging broken code.",
        },
        {
            "q": "If lint fails in CI, deploy should:",
            "options": ["Run anyway", "Be blocked — fix lint first", "Skip tests", "Delete main"],
            "answer": 1,
            "explain": "Pipeline stages stop at the first failure.",
        },
    ],
    "debugging": [
        {
            "q": "First step in debugging should be:",
            "options": ["Rewrite everything", "Reproduce the bug reliably", "Deploy to prod", "Disable logs"],
            "answer": 1,
            "explain": "You need a consistent repro before you can verify a fix.",
        },
        {
            "q": "DEBUG log level is for:",
            "options": ["User-facing errors only", "Detailed diagnostic detail during development", "Production alerts", "TLS handshakes"],
            "answer": 1,
            "explain": "DEBUG is verbose; often off in production.",
        },
    ],
    "classes": [
        {
            "q": "An instance attribute lives on:",
            "options": ["The class only", "Each object separately", "The module", "DNS cache"],
            "answer": 1,
            "explain": "Instance attrs are per-object; class attrs are shared.",
        },
        {
            "q": "`self` in Python methods refers to:",
            "options": ["The parent class", "The current instance", "Global scope", "A keyword only in Java"],
            "answer": 1,
            "explain": "self is the instance receiving the method call.",
        },
    ],
    "oop": [
        {
            "q": "Polymorphism lets you:",
            "options": ["Hide all methods", "Call the same interface on different types", "Disable inheritance", "Remove GC"],
            "answer": 1,
            "explain": "Different classes implement the same method name with type-specific behavior.",
        },
        {
            "q": "Encapsulation hides:",
            "options": ["The entire program", "Internal state behind a controlled interface", "All files", "Network ports"],
            "answer": 1,
            "explain": "Public methods expose behavior; internals stay private.",
        },
    ],
    "patterns": [
        {
            "q": "Factory pattern is for:",
            "options": ["Sorting arrays", "Creating objects without naming concrete classes at call site", "DNS lookup", "TLS only"],
            "answer": 1,
            "explain": "Factories centralize object construction logic.",
        },
        {
            "q": "Over-using patterns can:",
            "options": ["Always simplify code", "Add unnecessary complexity — pattern soup", "Fix all bugs", "Remove need for tests"],
            "answer": 1,
            "explain": "Patterns solve recurring problems; do not apply them everywhere.",
        },
    ],
    "functional": [
        {
            "q": "A pure function:",
            "options": ["Reads global state", "Same inputs → same outputs, no side effects", "Must use classes", "Cannot call other functions"],
            "answer": 1,
            "explain": "Purity makes reasoning and testing easier.",
        },
        {
            "q": "`map(f, items)` returns:",
            "options": ["Filtered items", "f applied to each element (new iterable)", "Sum of items", "Sorted list"],
            "answer": 1,
            "explain": "map transforms every element with f.",
        },
    ],
}

MINUTES_BUMP = 3

TEACHER = ROOT / "src" / "experience" / "teacherGuides.ts"

# Fourth interactive snippet for lessons that use SnippetRunner (Pyodide labs).
EXTRA_SNIPPETS: dict[str, dict[str, str]] = {
    "variables": {
        "label": "== vs is",
        "code": """a = [1, 2]
b = a
c = [1, 2]
print("==", a == b, a == c)   # same contents
print("is", a is b, a is c)   # same object in memory""",
    },
    "controlflow": {
        "label": "continue & for-else",
        "code": """for n in range(10):
    if n % 2 == 0:
        continue
    print(n, end=" ")
print()

for x in range(5):
    if x == 99:
        break
else:
    print("loop finished without break")""",
    },
    "floatingpoint": {
        "label": "math.isclose",
        "code": """import math
a = 0.1 + 0.2
b = 0.3
print("==", a == b)
print("isclose", math.isclose(a, b))""",
    },
    "json": {
        "label": "Round-trip types",
        "code": """import json
data = {"ok": True, "count": 3, "tags": ["api", "json"]}
raw = json.dumps(data)
back = json.loads(raw)
print(raw)
print(back["ok"], type(back["ok"]))""",
    },
    "functional": {
        "label": "map & filter",
        "code": """nums = [1, 2, 3, 4, 5]
squares = list(map(lambda n: n * n, nums))
evens = list(filter(lambda n: n % 2 == 0, nums))
print("squares", squares)
print("evens", evens)""",
    },
    "debugging": {
        "label": "Narrow the bug",
        "code": """def divide_all(nums, divisor):
    out = []
    for i, n in enumerate(nums):
        print(f"step {i}: {n}/{divisor}")
        out.append(n / divisor)
    return out

print(divide_all([10, 20, 0, 40], 10))""",
    },
    "security": {
        "label": "Safe query pattern",
        "code": """# Parameterized query — data is not part of the SQL string
def login(username, password):
    query = "SELECT * FROM users WHERE name = ? AND pass = ?"
    # driver binds username/password as parameters
    return query, (username, password)

print(login("admin", "' OR 1=1 --"))""",
    },
    "testing": {
        "label": "Table-driven tests",
        "code": """def clamp(n, lo, hi):
    return max(lo, min(n, hi))

cases = [(5, 0, 10, 5), (-1, 0, 10, 0), (99, 0, 10, 10)]
for n, lo, hi, want in cases:
    got = clamp(n, lo, hi)
    assert got == want, (n, lo, hi, got)
print("all cases passed")""",
    },
    "auth": {
        "label": "Verify a password",
        "code": """import hashlib, secrets

def hash_password(pw):
    salt = secrets.token_hex(8)
    digest = hashlib.sha256((salt + pw).encode()).hexdigest()
    return salt, digest

def verify(pw, salt, digest):
    return hashlib.sha256((salt + pw).encode()).hexdigest() == digest

salt, digest = hash_password("secret")
print("ok", verify("secret", salt, digest))
print("bad", verify("wrong", salt, digest))""",
    },
    "apis": {
        "label": "Status code meanings",
        "code": """STATUS = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    500: "Server Error",
}

def describe(code):
    return STATUS.get(code, "unknown")

for code in [200, 404, 418]:
    print(code, describe(code))""",
    },
    "trees": {
        "label": "BFS with a queue",
        "code": """from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["D"],
    "D": [],
}

def bfs(start):
    seen, q = {start}, deque([start])
    order = []
    while q:
        node = q.popleft()
        order.append(node)
        for nxt in graph[node]:
            if nxt not in seen:
                seen.add(nxt)
                q.append(nxt)
    return order

print(bfs("A"))""",
    },
    "search": {
        "label": "Binary search",
        "code": """def binary_search(items, target):
    lo, hi = 0, len(items) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

nums = [2, 5, 8, 12, 16, 23]
print(binary_search(nums, 12))
print(binary_search(nums, 7))""",
    },
    "algorithms": {
        "label": "Count nested-loop work",
        "code": """def count_pairs(items):
    steps = 0
    for i in items:
        for j in items:
            steps += 1
    return steps

for n in [10, 20, 40]:
    print(f"n={n} → {count_pairs(range(n))} steps")""",
    },
    "recursion": {
        "label": "Factorial",
        "code": """def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

for i in range(1, 7):
    print(f"fact({i}) = {fact(i)}")""",
    },
    "classes": {
        "label": "Define a class",
        "code": """class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

acct = BankAccount("Ada", 100)
acct.deposit(50)
print(acct.owner, acct.balance)""",
    },
    "datastructures": {
        "label": "Stack with a list",
        "code": """stack = []

def push(item):
    stack.append(item)

def pop():
    return stack.pop()

push("first")
push("second")
print("pop:", pop())
print("remaining:", stack)""",
    },
    "caching": {
        "label": "Simple dict cache",
        "code": """cache = {}

def fetch_user(user_id):
    if user_id in cache:
        print(f"  HIT  user_{user_id}")
        return cache[user_id]
    print(f"  MISS user_{user_id}")
    data = {"id": user_id}
    cache[user_id] = data
    return data

for uid in [1, 2, 1, 3]:
    fetch_user(uid)""",
    },
    "crypto": {
        "label": "Hash a password with salt",
        "code": """import hashlib, secrets

def hash_password(password):
    salt = secrets.token_hex(8)
    digest = hashlib.sha256((salt + password).encode()).hexdigest()
    return salt, digest

salt, digest = hash_password("hunter2")
print("stored:", salt, digest[:16] + "...")""",
    },
}


def format_question(q: dict, indent: str = "            ") -> str:
    opt_indent = indent + "    "
    opts = ",\n".join(f"{opt_indent}'{o}'" for o in q["options"])
    explain = q["explain"].replace("'", "\\'")
    qtext = q["q"].replace("'", "\\'")
    return (
        f"{indent}{{\n"
        f"{indent}  q: '{qtext}',\n"
        f"{indent}  options: [\n{opts},\n{indent}  ],\n"
        f"{indent}  answer: {q['answer']},\n"
        f"{indent}  explain: '{explain}',\n"
        f"{indent}}},"
    )


def insert_quizzes() -> list[str]:
    changed = []
    for lesson_id, questions in EXTRA_QUIZ.items():
        path = LESSONS / lesson_id / f"{lesson_id.capitalize()}Lesson.tsx"
        # handle camelCase folder names
        if not path.exists():
            for child in LESSONS.iterdir():
                if child.name == lesson_id:
                    for f in child.glob("*Lesson.tsx"):
                        path = f
                        break
        if not path.exists():
            print(f"SKIP missing {lesson_id}")
            continue
        text = path.read_text()
        if "q: '" + questions[0]["q"][:20] in text or questions[0]["q"][:15] in text:
            # rough duplicate check
            pass
        marker = "          ]}\n        />\n      </Section>\n\n      <Section id=\"recap\""
        if marker not in text:
            marker = "          ]}\n        />\n      </Section>\n\n      <Section id='recap'"
        if marker not in text:
            print(f"SKIP marker {lesson_id}")
            continue
        insert = "\n" + "\n".join(format_question(q) for q in questions) + "\n"
        if questions[0]["q"] in text:
            print(f"SKIP already expanded {lesson_id}")
            continue
        new_text = text.replace(marker, insert + marker, 1)
        path.write_text(new_text)
        changed.append(str(path))
    return changed


def bump_minutes(lesson_ids: list[str] | None = None) -> None:
    ids = lesson_ids or list(EXTRA_QUIZ.keys())
    text = META.read_text()
    for lesson_id in ids:
        pattern = rf"(id: '{lesson_id}',[\s\S]*?minutes: )(\d+)(,)"
        m = re.search(pattern, text)
        if m:
            new_min = int(m.group(2)) + MINUTES_BUMP
            text = text[:m.start(2)] + str(new_min) + text[m.end(2):]
    META.write_text(text)


def format_snippet(s: dict[str, str]) -> str:
    label = s["label"].replace("'", "\\'")
    code_lines = s["code"].split("\n")
    code_body = "\n".join(f"    {line}" for line in code_lines)
    return f"""  {{
    label: '{label}',
    code: `{code_body}`,
  }},"""


def find_lesson_path(lesson_id: str) -> Path | None:
    for child in LESSONS.iterdir():
        if child.name == lesson_id:
            for f in child.glob("*Lesson.tsx"):
                return f
    return None


def insert_snippets() -> list[str]:
    changed = []
    marker = "\n]\n\nexport default"
    for lesson_id, snippet in EXTRA_SNIPPETS.items():
        path = find_lesson_path(lesson_id)
        if not path or not path.exists():
            print(f"SKIP snippet missing {lesson_id}")
            continue
        text = path.read_text()
        if snippet["label"] in text:
            print(f"SKIP snippet already {lesson_id}")
            continue
        if "const SNIPPETS" not in text or marker not in text:
            print(f"SKIP no SNIPPETS {lesson_id}")
            continue
        insert = format_snippet(snippet) + "\n"
        path.write_text(text.replace(marker, "\n" + insert + marker, 1))
        changed.append(str(path))
    return changed


def update_teacher_guides() -> int:
    text = TEACHER.read_text()
    updated = 0
    for lesson_id, questions in EXTRA_QUIZ.items():
        assess_lines = []
        for q in questions:
            prompt = q["q"].replace("`", "").replace("'", "\\'")
            assess_lines.append(f"      '{prompt}',")
        block = "\n".join(assess_lines)
        pattern = rf"({lesson_id}: \{{[\s\S]*?assess: \[[\s\S]*?)(\n    \],)"
        m = re.search(pattern, text)
        if not m:
            print(f"SKIP teacher {lesson_id}")
            continue
        insert_block = m.group(1)
        if questions[0]["q"][:20] in insert_block:
            print(f"SKIP teacher already {lesson_id}")
            continue
        text = text[:m.end(1)] + "\n" + block + text[m.start(2):]
        updated += 1
    TEACHER.write_text(text)
    return updated


def fix_quiz_option_indent() -> int:
    """Normalize option lines inside quiz blocks to 16-space indent."""
    fixed = 0
    for path in LESSONS.rglob("*Lesson.tsx"):
        text = path.read_text()
        new = re.sub(
            r"(options: \[\n)(              ')",
            r"\1                '",
            text,
        )
        if new != text:
            path.write_text(new)
            fixed += 1
    return fixed


if __name__ == "__main__":
    quiz_changed = insert_quizzes()
    bump_minutes(quiz_changed and [Path(p).parent.name for p in quiz_changed])
    snippet_changed = insert_snippets()
    teacher_updated = update_teacher_guides()
    indent_fixed = fix_quiz_option_indent()
    print(
        f"Quizzes: {len(quiz_changed)}, snippets: {len(snippet_changed)}, "
        f"teacher guides: {teacher_updated}, indent fixes: {indent_fixed}"
    )

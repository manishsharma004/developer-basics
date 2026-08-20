export type PatternCategory = 'Creational' | 'Structural' | 'Behavioral' | 'Industry'

export interface Pattern {
  name: string
  category: PatternCategory
  intent: string
  whenToUse: string
  realWorld: string
  example: string
}

// The full Gang-of-Four catalog (23) plus widely-used industry patterns. Each
// example is self-contained Python that prints something when run.
export const PATTERNS: Pattern[] = [
  // ---------------- Creational ----------------
  {
    name: 'Singleton',
    category: 'Creational',
    intent: 'Ensure a class has only one instance and provide a global access point.',
    whenToUse: 'Exactly one shared resource: config, logger, connection pool.',
    realWorld: 'Application config objects; logging singletons.',
    example: `class Config:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.data = {}
        return cls._instance

a = Config(); b = Config()
a.data["theme"] = "dark"
print("same instance:", a is b, "| b sees:", b.data)`,
  },
  {
    name: 'Factory Method',
    category: 'Creational',
    intent: 'Defer instantiation to a method so callers ask for a product by name/kind.',
    whenToUse: "You need to create one of several related types chosen at runtime.",
    realWorld: 'Parsers/serializers picked by format; UI widgets by platform.',
    example: `class Dog:
    def speak(self): return "woof"
class Cat:
    def speak(self): return "meow"

def animal_factory(kind):
    return {"dog": Dog, "cat": Cat}[kind]()

for k in ("dog", "cat"):
    print(k, "->", animal_factory(k).speak())`,
  },
  {
    name: 'Abstract Factory',
    category: 'Creational',
    intent: 'Create families of related objects without specifying concrete classes.',
    whenToUse: 'You must produce matching sets (e.g. a whole themed UI kit).',
    realWorld: 'Cross-platform UI toolkits; light/dark component families.',
    example: `class LightButton:
    def render(self): return "[ Light Button ]"
class DarkButton:
    def render(self): return "[ Dark Button ]"

class LightFactory:
    def button(self): return LightButton()
class DarkFactory:
    def button(self): return DarkButton()

def build_ui(factory):
    print(factory.button().render())

build_ui(LightFactory())
build_ui(DarkFactory())`,
  },
  {
    name: 'Builder',
    category: 'Creational',
    intent: 'Construct a complex object step by step with a fluent interface.',
    whenToUse: 'Objects with many optional parts; avoid huge constructors.',
    realWorld: 'Query builders; HTTP request builders; test-data builders.',
    example: `class Burger:
    def __init__(self): self.parts = []

class BurgerBuilder:
    def __init__(self): self.b = Burger()
    def add(self, p):
        self.b.parts.append(p); return self
    def build(self): return self.b

burger = BurgerBuilder().add("bun").add("patty").add("cheese").build()
print("burger:", burger.parts)`,
  },
  {
    name: 'Prototype',
    category: 'Creational',
    intent: 'Create new objects by cloning an existing one.',
    whenToUse: 'Copying is cheaper than building from scratch, or config is complex.',
    realWorld: 'Duplicating shapes in editors; cloning configured templates.',
    example: `import copy

class Doc:
    def __init__(self, title, tags):
        self.title, self.tags = title, tags

original = Doc("Report", ["draft"])
clone = copy.deepcopy(original)
clone.title = "Report (copy)"
clone.tags.append("v2")

print(original.title, original.tags)
print(clone.title, clone.tags)`,
  },

  // ---------------- Structural ----------------
  {
    name: 'Adapter',
    category: 'Structural',
    intent: "Convert one interface into another clients expect.",
    whenToUse: 'Integrating a class whose interface does not match yours.',
    realWorld: 'Wrapping a third-party SDK behind your own interface.',
    example: `class EuropeanSocket:
    def voltage(self): return 230

class USDevice:
    def run(self, v): return f"running at {v}V"

class Adapter:            # adapts EU socket to what the device needs
    def __init__(self, socket): self.socket = socket
    def voltage(self): return 110

print(USDevice().run(Adapter(EuropeanSocket()).voltage()))`,
  },
  {
    name: 'Bridge',
    category: 'Structural',
    intent: 'Decouple an abstraction from its implementation so both can vary.',
    whenToUse: 'You have two independent dimensions (shape × renderer).',
    realWorld: 'Rendering backends; device drivers behind a stable API.',
    example: `class Circle:
    def __init__(self, renderer): self.r = renderer
    def draw(self): return self.r.shape("circle")

class SVG:
    def shape(self, s): return f"<svg:{s}/>"
class ASCII:
    def shape(self, s): return f"({s})"

print(Circle(SVG()).draw())
print(Circle(ASCII()).draw())`,
  },
  {
    name: 'Composite',
    category: 'Structural',
    intent: 'Treat individual objects and compositions uniformly (tree structures).',
    whenToUse: 'Part-whole hierarchies: files/folders, UI trees, org charts.',
    realWorld: 'Filesystem trees; DOM; scene graphs.',
    example: `class File:
    def __init__(self, name, size): self.name, self.size = name, size
    def total(self): return self.size

class Folder:
    def __init__(self, name): self.name, self.children = name, []
    def add(self, c): self.children.append(c); return self
    def total(self): return sum(c.total() for c in self.children)

root = Folder("root").add(File("a", 10)).add(Folder("sub").add(File("b", 5)))
print("total size:", root.total())`,
  },
  {
    name: 'Decorator',
    category: 'Structural',
    intent: 'Attach responsibilities to an object dynamically by wrapping it.',
    whenToUse: 'Add behavior (logging, caching, formatting) without subclassing.',
    realWorld: 'Python decorators; middleware; I/O stream wrappers.',
    example: `def bold(fn):
    def wrap():
        return "<b>" + fn() + "</b>"
    return wrap

@bold
def greet():
    return "hi"

print(greet())`,
  },
  {
    name: 'Facade',
    category: 'Structural',
    intent: 'Provide a simple unified interface over a complex subsystem.',
    whenToUse: 'Hide messy internals behind one convenient entry point.',
    realWorld: 'A "Computer.boot()" over CPU/disk/memory; SDK client facades.',
    example: `class CPU:
    def start(self): return "CPU on"
class Disk:
    def read(self): return "disk read"

class Computer:                # facade over the subsystem
    def __init__(self): self.cpu, self.disk = CPU(), Disk()
    def boot(self): return f"{self.cpu.start()}, {self.disk.read()}"

print(Computer().boot())`,
  },
  {
    name: 'Flyweight',
    category: 'Structural',
    intent: 'Share common state across many objects to save memory.',
    whenToUse: 'Huge numbers of similar objects (glyphs, tiles, particles).',
    realWorld: 'Character glyphs in a text engine; map tiles.',
    example: `class GlyphFactory:
    def __init__(self): self._cache = {}
    def get(self, ch):
        if ch not in self._cache:
            self._cache[ch] = {"char": ch}   # shared intrinsic state
        return self._cache[ch]

f = GlyphFactory()
a1, a2 = f.get("a"), f.get("a")
print("shared:", a1 is a2, "| unique glyphs:", len(f._cache))`,
  },
  {
    name: 'Proxy',
    category: 'Structural',
    intent: 'Provide a stand-in that controls access to another object.',
    whenToUse: 'Lazy loading, access control, caching, remote calls.',
    realWorld: 'Lazy image loading; ORM lazy relations; API client caches.',
    example: `class RealImage:
    def __init__(self, name):
        self.name = name; print("loading", name)
    def show(self): return f"showing {self.name}"

class LazyImage:               # proxy: defers the expensive load
    def __init__(self, name): self.name, self._real = name, None
    def show(self):
        if self._real is None:
            self._real = RealImage(self.name)
        return self._real.show()

img = LazyImage("cat.png")
print("created proxy (not loaded)")
print(img.show())`,
  },

  // ---------------- Behavioral ----------------
  {
    name: 'Chain of Responsibility',
    category: 'Behavioral',
    intent: 'Pass a request along a chain until a handler processes it.',
    whenToUse: 'Multiple possible handlers; decouple sender from receiver.',
    realWorld: 'Middleware pipelines; logging levels; event bubbling.',
    example: `class Handler:
    def __init__(self, level, nxt=None): self.level, self.nxt = level, nxt
    def handle(self, sev):
        if sev <= self.level: return f"handled by L{self.level}"
        return self.nxt.handle(sev) if self.nxt else "unhandled"

chain = Handler(1, Handler(2, Handler(3)))
print(chain.handle(2))
print(chain.handle(5))`,
  },
  {
    name: 'Command',
    category: 'Behavioral',
    intent: 'Encapsulate a request as an object (so it can be queued, logged, undone).',
    whenToUse: 'Undo/redo, task queues, macro recording.',
    realWorld: 'Editor undo stacks; job queues; GUI actions.',
    example: `class Light:
    def on(self): print("light on")

class OnCommand:
    def __init__(self, light): self.light = light
    def execute(self): self.light.on()

queue = [OnCommand(Light()), OnCommand(Light())]
for cmd in queue:
    cmd.execute()`,
  },
  {
    name: 'Interpreter',
    category: 'Behavioral',
    intent: 'Define a grammar and evaluate sentences in that language.',
    whenToUse: 'Small DSLs, expression evaluation, rule engines.',
    realWorld: 'Query filters; formula/expression evaluators.',
    example: `def interpret(expr):          # tiny postfix (RPN) calculator
    stack = []
    for t in expr.split():
        if t.isdigit(): stack.append(int(t))
        else:
            b, a = stack.pop(), stack.pop()
            stack.append(a + b if t == "+" else a * b)
    return stack[0]

print("3 4 + =", interpret("3 4 +"))
print("2 3 * =", interpret("2 3 *"))`,
  },
  {
    name: 'Iterator',
    category: 'Behavioral',
    intent: 'Access elements of a collection sequentially without exposing its internals.',
    whenToUse: 'Custom traversal; lazy sequences.',
    realWorld: "Python's for-loop protocol; database cursors.",
    example: `class Countdown:
    def __init__(self, n): self.n = n
    def __iter__(self):
        while self.n > 0:
            yield self.n
            self.n -= 1

print(list(Countdown(3)))`,
  },
  {
    name: 'Mediator',
    category: 'Behavioral',
    intent: 'Centralize communication between objects so they do not refer to each other directly.',
    whenToUse: 'Many-to-many interactions become a tangle.',
    realWorld: 'Chat rooms; UI form coordinators; air-traffic control.',
    example: `class ChatRoom:                # mediator
    def show(self, user, msg): print(f"[{user}] {msg}")

class User:
    def __init__(self, name, room): self.name, self.room = name, room
    def send(self, msg): self.room.show(self.name, msg)

room = ChatRoom()
User("Ada", room).send("hi")
User("Linus", room).send("hello")`,
  },
  {
    name: 'Memento',
    category: 'Behavioral',
    intent: "Capture and restore an object's state without exposing its internals.",
    whenToUse: 'Undo/snapshots/checkpoints.',
    realWorld: 'Editor undo; game save points.',
    example: `class Editor:
    def __init__(self): self.text = ""
    def save(self): return self.text        # memento
    def restore(self, m): self.text = m

e = Editor(); e.text = "v1"
snap = e.save()
e.text = "v2"; print("now:", e.text)
e.restore(snap); print("restored:", e.text)`,
  },
  {
    name: 'Observer',
    category: 'Behavioral',
    intent: 'Notify many dependents automatically when a subject changes.',
    whenToUse: 'Event systems; reactive UIs; pub/sub within a process.',
    realWorld: 'DOM event listeners; React state; signals.',
    example: `class Subject:
    def __init__(self): self.subs = []
    def subscribe(self, fn): self.subs.append(fn)
    def emit(self, v):
        for fn in self.subs: fn(v)

s = Subject()
s.subscribe(lambda v: print("A got", v))
s.subscribe(lambda v: print("B got", v))
s.emit(42)`,
  },
  {
    name: 'State',
    category: 'Behavioral',
    intent: "Let an object alter its behavior when its internal state changes.",
    whenToUse: 'Objects with mode-dependent behavior (state machines).',
    realWorld: 'Traffic lights; TCP connection states; order lifecycle.',
    example: `class TrafficLight:
    def __init__(self): self.state = "red"
    def next(self):
        self.state = {"red": "green", "green": "yellow", "yellow": "red"}[self.state]
        return self.state

t = TrafficLight()
print([t.next() for _ in range(4)])`,
  },
  {
    name: 'Strategy',
    category: 'Behavioral',
    intent: 'Define a family of interchangeable algorithms and swap them at runtime.',
    whenToUse: 'Multiple ways to do one thing; avoid big if/else.',
    realWorld: 'Sort comparators; pricing rules; compression choices.',
    example: `def asc(x): return sorted(x)
def desc(x): return sorted(x, reverse=True)

def process(data, strategy): return strategy(data)

print(process([3, 1, 2], asc))
print(process([3, 1, 2], desc))`,
  },
  {
    name: 'Template Method',
    category: 'Behavioral',
    intent: 'Define an algorithm skeleton, letting subclasses fill in steps.',
    whenToUse: 'Shared workflow, varying details.',
    realWorld: 'Framework hooks; report generators; test setup/teardown.',
    example: `class Report:
    def generate(self):                 # template method
        return self.header() + " | " + self.body()
    def header(self): return "REPORT"
    def body(self): raise NotImplementedError

class Sales(Report):
    def body(self): return "sales up 12%"

print(Sales().generate())`,
  },
  {
    name: 'Visitor',
    category: 'Behavioral',
    intent: 'Add operations to a set of types without modifying them.',
    whenToUse: 'Many operations over a stable object structure (ASTs).',
    realWorld: 'Compilers walking an AST; document exporters.',
    example: `class Circle:
    def __init__(self, r): self.r = r
class Square:
    def __init__(self, s): self.s = s

class AreaVisitor:
    def visit(self, shape):
        if isinstance(shape, Circle): return 3.14159 * shape.r ** 2
        return shape.s ** 2

v = AreaVisitor()
for shape in [Circle(2), Square(3)]:
    print(type(shape).__name__, round(v.visit(shape), 2))`,
  },

  // ---------------- Industry ----------------
  {
    name: 'Dependency Injection',
    category: 'Industry',
    intent: "Provide a class's dependencies from outside rather than creating them inside.",
    whenToUse: 'Almost always — for testability and swappable implementations.',
    realWorld: 'Spring, Angular, NestJS DI containers; constructor injection everywhere.',
    example: `class SmtpMailer:
    def send(self, to, msg): return f"sent to {to}: {msg}"

class SignupService:
    def __init__(self, mailer):        # dependency injected
        self.mailer = mailer
    def register(self, email):
        return self.mailer.send(email, "welcome!")

print(SignupService(SmtpMailer()).register("ada@example.com"))`,
  },
  {
    name: 'Repository',
    category: 'Industry',
    intent: 'Abstract data access behind a collection-like interface.',
    whenToUse: 'Decouple business logic from the database/ORM.',
    realWorld: 'DDD repositories; Spring Data; data-access layers.',
    example: `class UserRepo:
    def __init__(self): self._db = {}
    def add(self, u): self._db[u["id"]] = u
    def get(self, uid): return self._db.get(uid)

repo = UserRepo()
repo.add({"id": 1, "name": "Ada"})
print(repo.get(1))`,
  },
  {
    name: 'Null Object',
    category: 'Industry',
    intent: 'Provide a do-nothing object instead of null to avoid null checks.',
    whenToUse: 'An optional collaborator that can be safely absent.',
    realWorld: 'No-op loggers/metrics; default handlers.',
    example: `class RealLogger:
    def log(self, m): print("LOG:", m)
class NullLogger:
    def log(self, m): pass             # safely does nothing

def run(logger):
    logger.log("started")
    return "done"

print(run(NullLogger()))
print(run(RealLogger()))`,
  },
  {
    name: 'Object Pool',
    category: 'Industry',
    intent: 'Reuse expensive-to-create objects instead of recreating them.',
    whenToUse: 'Costly resources: DB connections, threads, buffers.',
    realWorld: 'Connection pools; thread pools.',
    example: `class Pool:
    def __init__(self, size): self.free = [f"conn{i}" for i in range(size)]
    def acquire(self): return self.free.pop()
    def release(self, c): self.free.append(c)

p = Pool(2)
c = p.acquire(); print("using", c, "| free:", p.free)
p.release(c); print("released | free:", p.free)`,
  },
  {
    name: 'Model-View-Controller',
    category: 'Industry',
    intent: 'Separate data (Model), presentation (View), and input handling (Controller).',
    whenToUse: 'UI apps that need a clean separation of concerns.',
    realWorld: 'Rails, Django, ASP.NET MVC; most UI frameworks.',
    example: `class Model:
    def __init__(self): self.value = 0
class View:
    def render(self, v): print("View shows:", v)
class Controller:
    def __init__(self, m, view): self.m, self.view = m, view
    def increment(self):
        self.m.value += 1
        self.view.render(self.m.value)

c = Controller(Model(), View())
c.increment(); c.increment()`,
  },
]

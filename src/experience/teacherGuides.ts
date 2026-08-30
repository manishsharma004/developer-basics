// Teaching content for the Teacher experience. Keyed by lesson id so it stays in
// sync with the lesson registry (meta.ts). Each guide reframes the same topic
// for an instructor: what to achieve, what to emphasize, what students get wrong,
// how to run the interactive lab, and how to assess understanding.

import { cssChapterGuides, containerizationChapterGuides, databasesChapterGuides, fastapiChapterGuides, mongodbChapterGuides, reactChapterGuides, sqlChapterGuides, webChapterGuides } from './chapterGuides.ts'

export interface TeacherGuide {
  objectives: string[]
  keyConcepts: string[]
  misconceptions: string[]
  discussion: string[]
  lab: string
  assess: string[]
}

export const teacherGuides: Record<string, TeacherGuide> = {
  variables: {
    objectives: [
      'Explain that variables are names bound to values.',
      'Name core Python types and use type() to inspect values.',
      'Predict truthy vs falsy behavior in conditionals.',
    ],
    keyConcepts: [
      'Assignment binds a name; rebinding replaces the reference.',
      'Dynamic typing — names are not locked to one type.',
      'Falsy: 0, "", [], {}, None; most other values are truthy.',
      'Parse user input with int()/float() before arithmetic.',
    ],
    misconceptions: [
      'Students think variable names have types permanently.',
      'They compare strings and numbers with == expecting coercion.',
    ],
    discussion: [
      'When is dynamic typing a productivity win vs a footgun?',
      'Why store money as integer cents instead of float dollars?',
    ],
    lab: 'Run Names & values, Truthiness, and Type conversion; have students predict output before running, then rebind a name to a different type.',
    assess: [
      'Classify values as truthy or falsy.',
      'Explain why int("42") works but "3" + 1 fails.',
      'What does is test versus ==?',
      'Which is truthy?',
    ],
  },
  controlflow: {
    objectives: [
      'Write if/elif/else chains that cover all cases.',
      'Choose for vs while appropriately.',
      'Combine boolean conditions with and/or/not.',
    ],
    keyConcepts: [
      'First true branch wins in if/elif chains.',
      'range stop is exclusive; for-else runs when no break.',
      'while needs a progress condition to avoid infinite loops.',
      'Short-circuit evaluation in and/or.',
    ],
    misconceptions: [
      'Off-by-one errors with range bounds.',
      'Confusing break with return or continue.',
    ],
    discussion: [
      'When is a while clearer than a for?',
      'How does loop-else differ from if-else?',
    ],
    lab: 'Edit grade thresholds in if/elif; use the boolean logic playground to toggle a/b/c and predict results before revealing; demonstrate loop-else with a search.',
    assess: [
      'Predict output of range(0, 10, 2).',
      'Trace which branch runs for a given score.',
      'What does break do inside a loop?',
      'while True: without a break is:',
    ],
  },
  floatingpoint: {
    objectives: [
      'Explain why float equality with == is unreliable.',
      'Use isclose or integer scaling for comparisons.',
      'Choose Decimal or cents for monetary calculations.',
    ],
    keyConcepts: [
      'IEEE 754 binary floats are approximations.',
      '0.1 has no exact binary representation.',
      'NaN != NaN; inf exists for overflow.',
      'Display rounding hides internal error.',
    ],
    misconceptions: [
      '"Python is wrong because 0.1+0.2 != 0.3."',
      'Using float for currency "because it looks like dollars."',
    ],
    discussion: [
      'When are floats still the right tool?',
      'Why do games and physics engines get away with floats?',
    ],
    lab: 'Run The classic surprise; use the isclose slider lab with 0.1+0.2 vs 0.3; sum 0.1 ten times; implement cart total with integer cents.',
    assess: [
      'Fix a broken if total == 19.99 check.',
      'Name one special float value and its comparison behavior.',
      'Best way to compare floats for equality?',
      'Summing many small floats can:',
    ],
  },
  cicd: {
    objectives: [
      'Describe lint, test, build, and deploy stages.',
      'Explain why the first failure stops a pipeline.',
      'Relate CI to this repo’s GitHub Actions workflow.',
    ],
    keyConcepts: [
      'CI integrates every change with automated checks.',
      'CD delivers artifacts that passed CI.',
      'Clean runners expose env/dependency drift.',
      'Branch protection enforces green checks before merge.',
    ],
    misconceptions: [
      '"CI replaces code review."',
      '"Deploy can run even if tests fail."',
    ],
    discussion: [
      'What belongs in CI vs running only locally?',
      'When should production deploy require manual approval?',
    ],
    lab: 'Toggle Test fail in the simulator; compare logs to a green run; open .github/workflows/deploy.yml and map stages.',
    assess: [
      'Order pipeline stages correctly.',
      'Explain one reason a green local build might fail in CI.',
      'Branch protection can require:',
      'If lint fails in CI, deploy should:',
    ],
  },
  loadbalancing: {
    objectives: [
      'Contrast round robin, least connections, and random routing.',
      'Explain L4 vs L7 load balancing.',
      'Describe behavior when all backends are saturated.',
    ],
    keyConcepts: [
      'Balancer picks a healthy backend per request.',
      'Least-conn suits variable-duration work.',
      'Health checks remove failed servers from rotation.',
      'Sticky sessions trade even load for state locality.',
    ],
    misconceptions: [
      '"Random is always as good as round robin at low volume."',
      'Ignoring capacity limits on backends.',
    ],
    discussion: [
      'When would you need session stickiness?',
      'How does autoscaling relate to load balancing?',
    ],
    lab: 'Burst traffic under least-conn vs round robin; saturate backends and discuss 503/queue/scale-out options.',
    assess: [
      'Pick an algorithm for long-polling vs uniform API calls.',
      'Name one L7 routing criterion.',
      'Health checks let a balancer:',
      'Sticky sessions trade:',
    ],
  },
  filesystem: {
    objectives: [
      'Explain the filesystem as a single tree rooted at /.',
      'Distinguish absolute vs. relative paths and use . and ..',
      'Read a permission string and explain what an inode is.',
    ],
    keyConcepts: [
      'Hierarchy and the root (/); the working directory.',
      'A filename is a label pointing at an inode (the real file).',
      'Hard links share an inode (link count); symlinks store a path.',
      'rwx permissions for owner / group / others.',
    ],
    misconceptions: [
      'Students think a file "is" its name — it\'s a directory entry pointing at an inode.',
      'They assume deleting a file frees space even if a process still has it open.',
    ],
    discussion: [
      'When would you use a symbolic link instead of copying a file?',
      'Why is renaming a huge file instant, but copying it slow?',
    ],
    lab: 'Use the live shell + tree: have students create files, make a hard link, then run `ls -l` and predict the link count before revealing it.',
    assess: [
      'Predict the link count after `ln a b`.',
      'Decode a permission string like -rw-r--r--.',
      'A hard link vs copy:',
      '.. in a path means:',
    ],
  },
  process: {
    objectives: [
      'Define a process and the states it moves through.',
      'Explain scheduling trade-offs (FCFS vs. SJF vs. Round Robin).',
      'Describe how fork/exec creates new processes.',
    ],
    keyConcepts: [
      'Ready / running / waiting states and context switches.',
      'The scheduler shares one CPU to create apparent concurrency.',
      'Quantum size trades throughput for responsiveness.',
      'fork() clones, exec() replaces the program image.',
    ],
    misconceptions: [
      '"More threads always means faster."',
      '"A waiting process is broken" — it\'s usually blocked on I/O.',
    ],
    discussion: [
      'Why do interactive systems favor Round Robin?',
      'When can Shortest-Job-First starve long jobs?',
    ],
    lab: 'Run the scheduler simulation with a fixed set of processes and compare average waiting time across the three algorithms; have students predict the winner first.',
    assess: [
      'Given processes, choose the algorithm with the lowest average wait.',
      'Explain what a context switch costs.',
      'Round Robin uses a:',
      'A process in "waiting" state is usually:',
    ],
  },
  memory: {
    objectives: [
      'Distinguish the stack from the heap.',
      'Explain references and aliasing (value vs. reference).',
      'Contrast immutable rebinding with mutable in-place mutation.',
      'Explain shallow vs deep copy and the mutable-default trap.',
      'Describe garbage collection and how leaks still happen.',
    ],
    keyConcepts: [
      'Variables hold references, not copies.',
      'is compares identity; == compares value.',
      'Immutable types rebind on +=; mutable objects alias until copied.',
      'Shallow copy shares nested mutables; deepcopy does not.',
      'Stack frames are fast but limited; recursion depth matters.',
      'GC frees unreachable objects only.',
    ],
    misconceptions: [
      '"Assignment copies the object."',
      '"A garbage-collected language can\'t leak memory."',
      '".copy() always makes a fully independent duplicate."',
    ],
    discussion: [
      'Why does aliasing cause "spooky action at a distance" bugs?',
      'When would you reach for deepcopy instead of .copy()?',
      'What makes the stack fast but size-limited?',
    ],
    lab: 'Run Aliasing vs Copy, then Shallow vs deep visual + playground snippets; use the stack/heap visualizer to trigger overflow and label garbage objects.',
    assess: [
      'Predict the output of an aliasing vs. copy snippet.',
      'Explain shallow copy behavior on nested lists.',
      'Explain one way a GC language can still leak.',
      'Two variables pointing at the same list means:',
    ],
  },
  concurrency: {
    objectives: [
      'Define concurrency and race conditions.',
      'Contrast concurrency with parallelism and async/await.',
      'Explain critical sections and locks.',
      'Demonstrate a lost update with interleaved read-add-write steps.',
      'Describe deadlock and lock ordering fixes.',
    ],
    keyConcepts: [
      'Shared mutable state is the source of races.',
      'A counter increment is really read-add-write (not atomic).',
      'Async overlaps I/O on one thread; parallelism needs multiple cores.',
      'A mutex serializes a critical section.',
      'Immutability / no sharing avoids races; deadlock is circular lock waiting.',
      'Acquire locks in a consistent global order to prevent deadlock.',
    ],
    misconceptions: [
      '"counter += 1 is atomic."',
      '"Adding threads always speeds things up."',
      '"async means parallel on all CPU cores."',
      '"Deadlock only happens with many locks."',
    ],
    discussion: [
      'How can you avoid locks entirely?',
      'When is async better than threads for I/O-bound work?',
      'What conditions produce a deadlock?',
    ],
    lab: 'Run the race simulation lock off/on, AsyncParallelSim sequential vs concurrent, then Code labs (lost update vs lock).',
    assess: [
      'Explain why the unlocked counter loses updates.',
      'Name two ways to make the increment safe.',
      'Define deadlock and one prevention strategy.',
      'A race condition happens when:',
    ],
  },
  data: {
    objectives: [
      'Explain bits, bytes, and number bases.',
      'Convert between binary, decimal, and hex.',
      'Explain how text becomes bytes via Unicode/UTF-8.',
    ],
    keyConcepts: [
      'A byte is 8 bits (0–255).',
      'Hex and decimal are just views of the same binary value.',
      'Characters are code points; UTF-8 encodes them in 1–4 bytes.',
      'Fixed-width integers overflow (wrap around).',
    ],
    misconceptions: [
      '"One character equals one byte."',
      '"Hex is a different number than its decimal value."',
    ],
    discussion: [
      'Why is hex used for colors and memory addresses?',
      'What causes mojibake (Ã© garbage)?',
    ],
    lab: 'Use the converter: enter 255 then 256 to see the second byte appear; type an emoji to see bytes exceed characters.',
    assess: [
      'Convert ff to decimal.',
      'Explain why an emoji increases the byte count more than the character count.',
      'How many bits are in one byte?',
      'Why is hex popular for memory dumps?',
    ],
  },
  network: {
    objectives: [
      'Trace a request through DNS, TCP, TLS, and HTTP.',
      'Explain round trips and where latency comes from.',
      'Read HTTP methods and status-code families.',
    ],
    keyConcepts: [
      'Each setup hop costs a round trip.',
      'Keep-alive and caching win by avoiding hops.',
      'Methods state intent; status codes state the result.',
      'Latency is bounded by physical distance.',
    ],
    misconceptions: [
      '"Slow response = slow server" (often it\'s setup/latency).',
      '"GET can safely have side effects."',
    ],
    discussion: [
      'Why do CDNs reduce latency?',
      'When is a failure your fault (4xx) vs. the server\'s (5xx)?',
    ],
    lab: 'Use the request tracer cold then cached; match HTTP methods and status codes in the pairing quiz.',
    assess: [
      'Classify a set of status codes by family.',
      'Explain why the first page load is slower than the next.',
      'A network timeout usually means:',
      'HTTP/2 can improve performance by:',
    ],
  },
  git: {
    objectives: [
      'Model history as a graph of commits.',
      'Explain branches and HEAD.',
      'Perform and interpret a merge.',
    ],
    keyConcepts: [
      'A commit is a snapshot plus parent link(s).',
      'A branch is a movable pointer; branching is cheap.',
      'A merge commit has two parents.',
      'Commit ids are content hashes.',
    ],
    misconceptions: [
      '"Creating a branch copies all the files."',
      '"Merge and rebase are the same thing."',
    ],
    discussion: [
      'When would you prefer merge vs. rebase?',
      'Why are commit ids hashes of content?',
    ],
    lab: 'Use the commit-graph builder: commit on main, branch, commit on the branch, then merge back and point out the two-parent commit.',
    assess: [
      'How many parents does a merge commit have?',
      'In one sentence, what is HEAD?',
      'A merge commit has:',
      'git checkout -b feature creates:',
    ],
  },
  cli: {
    objectives: [
      'Explain stdin, stdout, and stderr.',
      'Compose small tools into pipelines.',
      'Use common filters (grep, sort, uniq, wc).',
    ],
    keyConcepts: [
      'The pipe connects one program\'s stdout to the next\'s stdin.',
      'Filters read stdin, transform, write stdout.',
      'Exit codes signal success/failure.',
      'stderr is separate from the piped data.',
    ],
    misconceptions: [
      '"A pipe writes to a file."',
      '"Error messages flow through the pipe."',
    ],
    discussion: [
      'Why compose small tools instead of one big program?',
      'Why keep stderr separate from stdout?',
    ],
    lab: 'Build `grep ERROR | sort | uniq -c | sort -rn` step by step and read the ranked counts.',
    assess: [
      'Write a pipeline that counts lines matching a word.',
      'Explain why errors still appear when stdout is redirected.',
      'In a pipeline a | b, stdout of a becomes:',
      'Exit code 0 usually means:',
    ],
  },
  datastructures: {
    objectives: [
      'Compare arrays, linked lists, and hash maps.',
      'Explain hashing, buckets, and collisions.',
      'Reason about the operation costs of each.',
    ],
    keyConcepts: [
      'Array: O(1) index access, costly mid-insert.',
      'Linked list: cheap local insert, O(n) to find by position.',
      'Hash map: average O(1) via a hash function.',
      'Collisions chain; load factor triggers resizing.',
    ],
    misconceptions: [
      '"A hash map is always O(1)."',
      '"A linked list is always faster to insert than an array."',
    ],
    discussion: [
      'When is an array better than a list despite O(1) list inserts?',
      'What makes a hash map degrade toward O(n)?',
    ],
    lab: 'Use the hash-map visualizer: insert keys, force a collision, and observe chaining and the load factor.',
    assess: [
      'Pick the right structure for fast lookup by id.',
      'Define a collision and how it\'s resolved.',
      'Hash map average lookup time:',
      'Linked list vs array for front insertions:',
    ],
  },
  algorithms: {
    objectives: [
      'Read and compare Big-O growth rates.',
      'Connect complexity to real-world runtime.',
      'Recognize best/average/worst cases.',
    ],
    keyConcepts: [
      'Big-O describes growth, not exact time.',
      'O(1) < O(log n) < O(n) < O(n log n) < O(n²).',
      'The same algorithm can have different cases.',
      'O(n log n) sorts dominate O(n²) at scale.',
    ],
    misconceptions: [
      '"Big-O tells you the exact runtime."',
      '"O(n²) is fine for any input."',
    ],
    discussion: [
      'Why do standard libraries use O(n log n) sorts?',
      'When is an O(n²) approach acceptable?',
    ],
    lab: 'Run the sort visualizer and compare comparison counts across algorithms and array sizes.',
    assess: [
      'If O(n²) takes 1s at n=1000, estimate the time at n=2000.',
      'Order a list of complexities from fastest-growing to slowest.',
      'O(n²) means doubling input size roughly:',
      'Bubble sort is mainly useful for:',
    ],
  },
  recursion: {
    objectives: [
      'Identify base and recursive cases.',
      'Trace a recursive call tree.',
      'Explain memoization and its effect.',
    ],
    keyConcepts: [
      'Every recursion needs a reachable base case.',
      'Branching recursion can blow up exponentially.',
      'Each call uses stack; too deep overflows it.',
      'Memoization caches results — the basis of dynamic programming.',
    ],
    misconceptions: [
      '"Recursion is always elegant and efficient."',
      '"A missing base case just returns nothing."',
    ],
    discussion: [
      'When is recursion clearer than a loop?',
      'Which problems are good candidates for memoization?',
    ],
    lab: 'Raise fibonacci(n) and watch the call count explode; tick Memoize and watch it collapse to roughly linear.',
    assess: [
      'Explain why naive Fibonacci is O(2ⁿ).',
      'State what memoization changes about repeated calls.',
      'Every recursive function needs:',
      'Memoization helps when:',
    ],
  },
  ...databasesChapterGuides,
  ...sqlChapterGuides,
  ...mongodbChapterGuides,
  regex: {
    objectives: [
      'Read the core regex building blocks.',
      'Build and test patterns.',
      'Recognize greedy vs. lazy and backtracking pitfalls.',
    ],
    keyConcepts: [
      'Character classes, quantifiers, anchors, groups.',
      'Flags: g (all), i (ignore case), m (multiline).',
      'Quantifiers are greedy by default; ? makes them lazy.',
      'Complex patterns can backtrack catastrophically.',
    ],
    misconceptions: [
      '"Regex can parse anything, including HTML."',
      '"* matches any character."',
    ],
    discussion: [
      'When should you NOT reach for a regex?',
      'How do you fix a pattern that matches too much?',
    ],
    lab: 'Use the tester: switch between the email and phone presets, then change {n} counts and watch the matches.',
    assess: [
      'State what \\d{3} matches.',
      'Make .* match as little as possible.',
      '^ in a regex anchors to:',
      '\d+ matches:',
    ],
  },
  errors: {
    objectives: [
      'Explain exceptions and propagation.',
      'Use try / except / finally correctly.',
      'Read a stack trace.',
    ],
    keyConcepts: [
      'Raise signals an error; it propagates up the stack.',
      'finally always runs (cleanup).',
      'Catch specific exceptions, not everything.',
      'The bottom line of a traceback is the real error.',
    ],
    misconceptions: [
      '"Catch everything and continue is good defensive coding."',
      '"The first line of a traceback is the error."',
    ],
    discussion: [
      'When should you catch an error vs. let it propagate?',
      'Why is a bare `except:` dangerous?',
    ],
    lab: 'Run the uncaught snippet (read the traceback bottom-up), then the handled one, then show finally firing even on error.',
    assess: [
      'Point to the actual error in a traceback.',
      'State when a finally block runs.',
      'What does finally guarantee?',
      'Bare except: catches:',
    ],
  },
  caching: {
    objectives: [
      'Define hit, miss, and eviction.',
      'Explain LRU and hit rate.',
      'Understand cache invalidation.',
    ],
    keyConcepts: [
      'Caching trades memory for speed.',
      'When full, an eviction policy (LRU) chooses what to drop.',
      'Hit rate measures effectiveness.',
      'Invalidation prevents serving stale data.',
    ],
    misconceptions: [
      '"A bigger cache is always better."',
      '"Cached data is always fresh."',
    ],
    discussion: [
      'How do you keep a cache from serving stale data?',
      'What data structures make LRU O(1)?',
    ],
    lab: 'Run the LRU simulator at capacity 2 vs. 4 on the same access sequence and compare the hit rate.',
    assess: [
      'State what LRU evicts.',
      'Name one cache-invalidation strategy.',
      'A cache miss means:',
      'LRU evicts:',
    ],
  },
  crypto: {
    objectives: [
      'Distinguish hashing, encryption, and encoding.',
      'Explain the avalanche effect.',
      'Store passwords safely.',
    ],
    keyConcepts: [
      'Hashing is one-way; encryption is reversible with a key.',
      'A tiny input change flips ~half the hash.',
      'Encoding (Base64) is not security.',
      'Passwords need salted, slow hashes.',
    ],
    misconceptions: [
      '"Base64 encrypts / secures data."',
      '"A fast hash like SHA-256 alone is fine for passwords."',
    ],
    discussion: [
      'Why must password hashes be salted?',
      'For a given use case, do you need a hash or encryption?',
    ],
    lab: 'Use the SHA-256 playground: change a single character and observe how much of the digest changes.',
    assess: [
      'Describe how to store user passwords.',
      'Explain why Base64 provides no confidentiality.',
      'Hashing is one-way — you cannot:',
      'Salting passwords helps against:',
    ],
  },
  time: {
    objectives: [
      'Explain the epoch, UTC, and offsets.',
      'Convert an instant across timezones.',
      'Avoid common format and DST pitfalls.',
    ],
    keyConcepts: [
      'A Unix timestamp is one absolute instant.',
      'A timezone is UTC plus an offset.',
      'Store UTC, display local.',
      'ISO 8601 is the unambiguous string format; watch ms vs s.',
    ],
    misconceptions: [
      '"Store local time so it\'s easy to read."',
      '"A Unix timestamp includes a timezone."',
      '"Every day is exactly 86,400 seconds of local wall time."',
    ],
    discussion: [
      'Why store timestamps in UTC?',
      'What breaks around daylight-saving transitions?',
    ],
    lab: 'Use the converter across zones; discuss ISO 8601 vs ambiguous slash dates and ms vs second APIs.',
    assess: [
      'State where timestamps should be stored.',
      'Define the Unix epoch and spot a naive datetime.',
      'Unix epoch counts seconds since:',
      'Storing only local time without timezone risks:',
    ],
  },
  compute: {
    objectives: [
      'Compare VMs, containers, and serverless.',
      'Explain horizontal vs. vertical scaling.',
      'Reason about capacity, utilization, and cost.',
    ],
    keyConcepts: [
      'An instance is one running copy; scale horizontally behind a load balancer.',
      'Stateless services scale freely; state goes in a shared store.',
      'Autoscaling reacts to load but lags; cold starts add latency.',
      'More capacity costs more — right-size for utilization.',
    ],
    misconceptions: [
      '"Just buy a bigger machine" (vertical scaling has a hard ceiling).',
      '"Autoscaling is instant" (it lags; spikes can still drop requests).',
    ],
    discussion: [
      'When would you choose serverless over containers?',
      'Why must services be stateless to scale out?',
    ],
    lab: 'Use the scaling simulator: overload it to drop requests, add instances, then enable autoscaling and vary the load.',
    assess: [
      'Given a load and per-instance capacity, compute instances needed.',
      'Explain why stateless design enables horizontal scaling.',
      'Containers vs VMs — containers typically:',
      'Autoscaling adds instances when:',
    ],
  },
  queues: {
    objectives: [
      'Explain how a queue decouples producers and consumers.',
      'Describe backpressure and how to relieve it.',
      'Know delivery guarantees and idempotency.',
    ],
    keyConcepts: [
      'Producers append; consumers pull independently.',
      'Add consumers to increase throughput.',
      'At-least-once delivery → make consumers idempotent.',
      'Queues absorb spikes and downstream outages.',
    ],
    misconceptions: [
      '"A queue makes things faster" (it decouples and buffers, not speeds up work).',
      '"Messages are delivered exactly once" (usually at-least-once).',
    ],
    discussion: [
      'Work queue vs. pub/sub — when each?',
      'What happens if consumers never catch up?',
    ],
    lab: 'Run the queue simulator: make producers outrun consumers to build a backlog, then add consumers to drain it.',
    assess: [
      'Explain what a growing queue depth indicates.',
      'Why should consumers be idempotent?',
      'Backpressure signals:',
      'A message queue decouples:',
    ],
  },
  classes: {
    objectives: [
      'Distinguish a class from an object.',
      'Explain fields (per-object state) vs. methods (shared behavior).',
      'Describe the role of the constructor.',
    ],
    keyConcepts: [
      'A class is a blueprint; an object is an instance.',
      'Each object owns its fields; methods live on the class.',
      'The constructor initializes new objects.',
      'Beware shared mutable class-level state.',
    ],
    misconceptions: [
      '"Changing one object changes all of them."',
      '"Every object stores its own copy of the methods."',
    ],
    discussion: [
      'When is a class better than a plain dict/record?',
      'What is the difference between class and instance variables?',
    ],
    lab: 'Use the class builder: create several objects and mutate one to show independent state with shared behavior.',
    assess: [
      'Predict the effect of calling a method on one object.',
      'Explain where methods live vs. fields.',
      'An instance attribute lives on:',
      'self in Python methods refers to:',
    ],
  },
  oop: {
    objectives: [
      'Explain the four pillars of OOP.',
      'Recognize polymorphism replacing type-branching.',
      'Summarize the SOLID principles.',
    ],
    keyConcepts: [
      'Encapsulation, inheritance, polymorphism, abstraction.',
      'Program to interfaces; depend on abstractions (DIP).',
      'Prefer composition over deep inheritance.',
      'SOLID keeps OO code flexible and testable.',
    ],
    misconceptions: [
      '"Inheritance is always the right reuse tool."',
      '"OOP means lots of getters/setters."',
    ],
    discussion: [
      'Composition vs. inheritance — how to choose?',
      'Which SOLID principle most improves testability?',
    ],
    lab: 'Run each pillar snippet; extend Inheritance and Polymorphism with a new subclass/shape.',
    assess: [
      'Identify which pillar a code sample demonstrates.',
      'State the Dependency Inversion principle.',
      'Polymorphism lets you:',
      'Encapsulation hides:',
    ],
  },
  patterns: {
    objectives: [
      'Categorize patterns as creational, structural, or behavioral.',
      'Recognize when a specific pattern applies.',
      'Avoid over-applying patterns.',
    ],
    keyConcepts: [
      'A pattern is a reusable design shape, not copy-paste code.',
      'Many patterns share "program to an interface".',
      'The GoF 23 plus industry patterns (DI, Repository, MVC).',
      'Apply patterns to a felt problem, not preemptively.',
    ],
    misconceptions: [
      '"More patterns = better design" (pattern soup).',
      '"Patterns are language features" (they are design shapes).',
    ],
    discussion: [
      'Which patterns are really the same idea in disguise?',
      'When does a plain function beat a pattern?',
    ],
    lab: 'Browse the catalog; run Strategy, Observer, and Dependency Injection; discuss where each appears in your stack.',
    assess: [
      'Match a scenario to the right pattern.',
      'Name the three GoF categories with an example each.',
      'Factory pattern is for:',
      'Over-using patterns can:',
    ],
  },
  trees: {
    objectives: [
      'Distinguish trees from general graphs.',
      'Traverse structures depth-first and breadth-first.',
      'Explain why BFS finds shortest unweighted paths.',
    ],
    keyConcepts: [
      'A tree is a cycle-free graph with one root and unique paths.',
      'DFS uses a stack/recursion; BFS uses a queue.',
      'BFS expands in rings, so it reaches nodes in fewest edges.',
      'Graphs need a visited set to avoid looping on cycles.',
    ],
    misconceptions: [
      '"DFS and BFS visit nodes in the same order."',
      '"You never need to track visited nodes."',
    ],
    discussion: [
      'When is DFS a better fit than BFS?',
      'What changes when edges have weights?',
    ],
    lab: 'Run the DFS and BFS snippets, then animate the visual traversal and compare order; switch to BFS shortest-path and change the goal node.',
    assess: [
      'State which traversal finds the shortest unweighted path.',
      'Explain why a visited set is needed for graphs but not trees.',
      'BFS explores a graph:',
      'DFS on a tree can be implemented with:',
    ],
  },
  apis: {
    objectives: [
      'Explain REST resources, HTTP verbs, and JSON.',
      'Map methods to actions and read status-code families.',
      'Describe why REST is stateless.',
    ],
    keyConcepts: [
      'Resources are nouns (URLs); methods are verbs.',
      'GET is safe; POST is not idempotent.',
      'JSON serializes objects to text and back.',
      'Status codes group into 2xx/3xx/4xx/5xx.',
    ],
    misconceptions: [
      '"GET can safely change server state."',
      '"JSON and JavaScript objects are the same thing."',
    ],
    discussion: [
      'Why should retries be safe for GET but not POST?',
      'How does statelessness enable horizontal scaling?',
    ],
    lab: 'Run the REST router snippet; add requests and watch status codes change; classify codes by family.',
    assess: [
      'Choose the right verb for creating vs. reading a resource.',
      'Classify a set of status codes by family.',
      'REST POST to /users typically:',
      'HTTP 201 Created often means:',
    ],
  },
  auth: {
    objectives: [
      'Separate authentication from authorization.',
      'Explain salting and slow password hashing.',
      'Describe why a JWT is signed, not secret.',
    ],
    keyConcepts: [
      'AuthN proves identity; AuthZ grants permission.',
      'Salts make each password hash unique.',
      'Sessions store state server-side; tokens carry signed claims.',
      'A JWT payload is readable — never put secrets in it.',
    ],
    misconceptions: [
      '"A JWT is encrypted, so it is safe to store secrets in it."',
      '"A fast hash like SHA-256 alone is fine for passwords."',
    ],
    discussion: [
      'When would you choose sessions over tokens?',
      'Why must password hashing be deliberately slow?',
    ],
    lab: 'Run the salt/hash snippet twice to show the salt changes; decode the JWT payload to prove it is readable.',
    assess: [
      'Explain the difference between AuthN and AuthZ.',
      'State why a JWT must not contain secrets.',
      'Authentication proves:',
      'JWT payload is:',
    ],
  },
  ...webChapterGuides,
  ...cssChapterGuides,
  ...fastapiChapterGuides,
  ...reactChapterGuides,
  ...containerizationChapterGuides,
  security: {
    objectives: [
      'Recognize injection and XSS.',
      'Fix them with parameterization and escaping.',
      'Apply least privilege and defense in depth.',
    ],
    keyConcepts: [
      'Injection = untrusted input treated as code.',
      'Parameterized queries keep values as data.',
      'Escape output for its specific context to stop XSS.',
      'Least privilege limits the blast radius of a breach.',
    ],
    misconceptions: [
      '"Cleaning input once at the door is enough."',
      '"Only big companies get attacked."',
    ],
    discussion: [
      'Why is output escaping context-specific?',
      'Where in your stack does least privilege apply?',
    ],
    lab: 'Run the unsafe SQL snippet to see the attack, then the parameterized fix; show html.escape defusing an XSS payload.',
    assess: [
      'Give the correct fix for SQL injection.',
      'Explain how escaping stops XSS.',
      'Parameterized queries prevent:',
      'Output escaping in HTML prevents:',
    ],
  },
  testing: {
    objectives: [
      'Explain the value and levels of automated tests (the pyramid).',
      'Follow the red-green-refactor TDD cycle.',
      'Structure tests with Arrange–Act–Assert.',
      'Use fakes/mocks for time and external dependencies.',
      'Describe pytest fixtures and frontend testing with RTL.',
      'Recognize flaky tests and the role of CI.',
    ],
    keyConcepts: [
      'Unit < integration < end-to-end (the pyramid).',
      'A test asserts an expectation and fails loudly.',
      'TDD: write a failing test, pass it, then refactor.',
      'AAA: arrange setup, act on code, assert outcome.',
      'Inject dependencies to test deterministically.',
      'RTL queries by role/label — test visible behavior.',
      'Coverage measures execution, not assertion quality.',
    ],
    misconceptions: [
      '"100% coverage means no bugs."',
      '"Tests slow you down."',
      '"Integration tests should outnumber unit tests."',
      '"Mock every dependency always."',
    ],
    discussion: [
      'Why keep end-to-end tests few?',
      'When is TDD worth the overhead?',
      'What makes a test flaky, and how do you fix it?',
    ],
    lab: 'Click through the TDD cycle sim (red → green → refactor), then run Red/Green snippets; extend table-driven clamp cases.',
    assess: [
      'State the TDD cycle in order.',
      'Explain why most tests should be unit tests.',
      'Name one frontend query strategy RTL prefers over CSS classes.',
      'A flaky test:',
    ],
  },
  functional: {
    objectives: [
      'Define pure functions and side effects.',
      'Use map/filter/reduce to transform data.',
      'Explain how immutability prevents bugs.',
    ],
    keyConcepts: [
      'Pure = same input, same output, no side effects.',
      'Higher-order functions take/return functions.',
      'map transforms, filter selects, reduce folds.',
      'Immutability avoids shared-state and aliasing bugs.',
    ],
    misconceptions: [
      '"Functional programming needs a special language."',
      '"reduce is just a fancy loop with no benefit."',
    ],
    discussion: [
      'Why does purity enable parallelism and caching?',
      'When is a loop clearer than map/reduce?',
    ],
    lab: 'Run pure vs. impure; convert a loop into map/filter/reduce; compose two functions over an immutable tuple.',
    assess: [
      'Identify whether a function is pure.',
      'Rewrite a loop using map/filter/reduce.',
      'A pure function:',
      'map(f, items) returns:',
    ],
  },
  json: {
    objectives: [
      'Explain serialization and why APIs need a shared format.',
      'List the JSON value types and name types that do not survive a round-trip.',
      'Dump and load JSON in Python and compare compact vs pretty forms.',
    ],
    keyConcepts: [
      'Serialize = object → text; deserialize = text → object.',
      'JSON types: object, array, string, number, true/false, null.',
      'Sets, dates, and binary need an explicit encoding strategy.',
      'Schemas/version fields help producers and consumers evolve safely.',
    ],
    misconceptions: [
      '"Any Python object can be json.dumps\'d as-is."',
      '"Pretty JSON is different data from compact JSON."',
    ],
    discussion: [
      'When would you pick Protobuf or MessagePack over JSON?',
      'How do you version a JSON API without breaking old clients?',
    ],
    lab: 'Run dump/load, then force a TypeError with a set and fix it via list(); compare byte sizes of compact vs indented output.',
    assess: [
      'Name three native JSON types and one that is not.',
      'Explain what a round-trip preserves.',
      'JSON null in Python becomes:',
      'Why might pretty JSON be larger on the wire?',
    ],
  },
  search: {
    objectives: [
      'Contrast linear and binary search and their Big-O costs.',
      'State the sorted-input precondition for binary search.',
      'Decide when sorting-then-searching beats a single linear scan.',
    ],
    keyConcepts: [
      'Linear search is O(n) and order-agnostic.',
      'Binary search is O(log n) on a sorted range.',
      'Loop invariant: the target, if present, stays inside [lo, hi].',
      'Indexes and hash maps are alternative lookup tools.',
    ],
    misconceptions: [
      '"Binary search works on any list."',
      '"Sorting is free, so always binary-search."',
    ],
    discussion: [
      'How many lookups make pre-sorting worth it?',
      'When is a hash map a better fit than binary search?',
    ],
    lab: 'Run linear vs binary snippets, then the million-element step comparison; have students predict step counts first.',
    assess: [
      'Estimate binary-search steps for n = 1,000,000.',
      'Explain one off-by-one pitfall in the binary-search loop.',
      'Binary search needs:',
      'For one lookup in a huge sorted list, prefer:',
    ],
  },
  debugging: {
    objectives: [
      'Follow a reproduce → observe → hypothesize → fix loop.',
      'Use git bisect and rubber-duck debugging for regressions.',
      'Read Python tracebacks and use logging, pdb, and asserts.',
      'Debug frontend with Console, breakpoints, Network tab, and React DevTools.',
      'Choose appropriate log levels for an event.',
    ],
    keyConcepts: [
      'Reliable reproduction before deep investigation.',
      'Change one variable at a time when experimenting.',
      'DEBUG / INFO / WARNING / ERROR as a severity ladder.',
      'Tracebacks: read bottom-up for the real exception.',
      'breakpoint() / pdb for interactive inspection.',
      'Network failures often masquerade as empty UI state.',
      'Source maps connect minified bundles to original source.',
    ],
    misconceptions: [
      '"Randomly changing code is debugging."',
      '"Assertions replace input validation for users."',
      '"The top line of a traceback is the root cause."',
      '"console.log alone is enough in production."',
    ],
    discussion: [
      'What belongs in production logs vs. a local debugger session?',
      'How does flaky reproduction change your strategy?',
      'When would you use the Network tab vs a breakpoint?',
    ],
    lab: 'Walk through General practices, then Python snippets (traceback, logging, pdb comment). Discuss which DevTools tab you would open for a blank list after fetch.',
    assess: [
      'Order the debugging loop.',
      'Pick the right log level for a handled bad amount vs. a crash.',
      'Name two frontend DevTools features beyond console.log.',
      'First step in debugging should be:',
    ],
  },
  'js-fundamentals': {
    objectives: ['Explain the event loop and microtasks vs macrotasks.', 'Describe closures and promises.', 'Relate DOM basics to React.'],
    keyConcepts: ['Single-threaded JS', 'Promise microtasks before setTimeout', 'const/let, modules, DOM query'],
    misconceptions: ['"setTimeout(0) runs before Promise.then."', '"React replaces the need to understand JS."'],
    discussion: ['Why does the event loop matter for UI responsiveness?'],
    lab: 'Queue macro and micro tasks in EventLoopPlayground; predict order before ticking.',
    assess: ['Which queue drains first after sync code?', 'Objects are assigned by:'],
  },
  'package-managers': {
    objectives: ['Explain semver ranges and lockfiles.', 'Describe transitive dependencies.'],
    keyConcepts: ['^ vs ~', 'Lockfile pins tree', 'Registry + install'],
    misconceptions: ['"Deleting lockfile fixes conflicts safely."'],
    discussion: ['Why commit bun.lock / package-lock.json?'],
    lab: 'Use SemverPlayground with ^1.2.0 and versions 1.9.0 vs 2.0.0.',
    assess: ['What does ^ allow?', 'Why lockfiles?'],
  },
  'env-config': {
    objectives: ['Describe config precedence.', 'Explain why secrets must not be committed or logged.'],
    keyConcepts: ['12-factor config', 'env overrides file', 'Redaction in logs'],
    misconceptions: ['".env is safe to commit with fake keys only — still a habit problem."'],
    discussion: ['Build-time vs runtime env in Vite vs server apps.'],
    lab: 'Toggle overrides in ConfigResolver; demonstrate bad secret logging.',
    assess: ['Where should production API keys live?', 'Env vs file precedence:'],
  },
  'http-clients': {
    objectives: ['Use fetch and check response.ok.', 'Retry transient 5xx with backoff.', 'Understand timeouts via AbortController.'],
    keyConcepts: ['Status code families', 'Idempotent retries', 'Error envelopes'],
    misconceptions: ['"Retry every failed request including 404."'],
    discussion: ['When is POST safe to retry?'],
    lab: 'Run FetchPlayground scenarios: 500, 404, timeout.',
    assess: ['Retry 404?', '5xx often means:'],
  },
  'git-advanced': {
    objectives: ['Resolve merge conflict markers.', 'Compare rebase vs merge.', 'Describe PR workflow.'],
    keyConcepts: ['Conflict markers', 'Rebase rewrites ids', 'PR + CI + review'],
    misconceptions: ['"Force-push is always fine on main."'],
    discussion: ['When to rebase a feature branch before merge?'],
    lab: 'ConflictSimulator then CommitGraph merge; walk through PR checklist.',
    assess: ['After resolving conflicts:', 'Rebase rewrites:'],
  },
  'browser-rendering': {
    objectives: ['Name pipeline stages DOM→composite.', 'Explain layout vs paint invalidation.'],
    keyConcepts: ['Reflow expensive', 'transform/opacity compositor-friendly', 'Render tree'],
    misconceptions: ['"Animating width is as cheap as transform."'],
    discussion: ['How does this connect to React reconciliation?'],
    lab: 'RenderPipeline: toggle width vs color; note invalidated stages.',
    assess: ['Animating width triggers:', 'React updates:'],
  },
  capstone: {
    objectives: ['Map a full-stack task app to existing lessons.', 'Complete a vertical slice checklist.'],
    keyConcepts: ['Data model → API → UI → auth → tests → deploy', 'Vertical slice'],
    misconceptions: ['"Capstone replaces foundational lessons."'],
    discussion: ['What is the smallest shippable slice?'],
    lab: 'CapstoneChecklist: students complete unread linked chapters and mark read.',
    assess: ['Capstone helps because:', 'First step focuses on:'],
  },
}

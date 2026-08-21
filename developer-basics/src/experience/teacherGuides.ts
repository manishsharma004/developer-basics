// Teaching content for the Teacher experience. Keyed by lesson id so it stays in
// sync with the lesson registry (meta.ts). Each guide reframes the same topic
// for an instructor: what to achieve, what to emphasize, what students get wrong,
// how to run the interactive lab, and how to assess understanding.

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
      'Convert user input safely with int()/float() and handle ValueError.',
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
    lab: 'Run Names & values and Truthiness; have students predict output before running, then rebind a name to a different type.',
    assess: [
      'Classify values as truthy or falsy.',
      'Explain why int("42") works but "3" + 1 fails.',
      'Predict what int("3.9") returns and why.',
    ],
  },
  controlflow: {
    objectives: [
      'Write if/elif/else chains that cover all cases.',
      'Choose for vs while appropriately.',
      'Combine boolean conditions with and/or/not.',
      'Explain short-circuit evaluation and when continue vs break applies.',
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
    lab: 'Edit grade thresholds in if/elif; add a for-else search loop; demonstrate an infinite while and fix it.',
    assess: [
      'Predict output of range(0, 10, 2).',
      'Trace which branch runs for a given score.',
      'Distinguish what break does from continue in a loop.',
    ],
  },
  floatingpoint: {
    objectives: [
      'Explain why float equality with == is unreliable.',
      'Use isclose or integer scaling for comparisons.',
      'Choose Decimal or cents for monetary calculations.',
      'Describe how repeated float arithmetic accumulates error.',
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
    lab: 'Run The classic surprise; sum 0.1 ten times; implement cart total with integer cents.',
    assess: [
      'Fix a broken if total == 19.99 check.',
      'Name one special float value and its comparison behavior.',
      'Explain why Decimal("0.1") is safer than Decimal(0.1).',
    ],
  },
  cicd: {
    objectives: [
      'Describe lint, test, build, and deploy stages.',
      'Explain why the first failure stops a pipeline.',
      'Relate CI to this repo’s GitHub Actions workflow.',
      'Configure branch protection so green CI is required before merge.',
    ],
    keyConcepts: [
      'CI integrates every change with automated checks.',
      'CD delivers artifacts that passed CI.',
      'Clean runners expose env/dependency drift.',
      'Branch protection enforces green checks and reviews before merge.',
      'Required status checks block merge until named jobs pass.',
    ],
    misconceptions: [
      '"CI replaces code review."',
      '"Deploy can run even if tests fail."',
      '"Branch protection is optional busywork on solo projects."',
    ],
    discussion: [
      'What belongs in CI vs running only locally?',
      'When should production deploy require manual approval?',
      'Which status checks should be required on main?',
    ],
    lab: 'Toggle Test fail in the simulator; compare logs to a green run; open .github/workflows/ and map stages; discuss branch protection settings on main.',
    assess: [
      'Order pipeline stages correctly.',
      'Explain one reason a green local build might fail in CI.',
      'State what branch protection with required checks prevents.',
    ],
  },
  loadbalancing: {
    objectives: [
      'Contrast round robin, least connections, and random routing.',
      'Explain L4 vs L7 load balancing.',
      'Describe behavior when all backends are saturated.',
      'Relate sticky sessions to stateful apps.',
    ],
    keyConcepts: [
      'Balancer picks a healthy backend per request.',
      'Least-conn suits variable-duration work.',
      'Health checks remove failed servers from rotation.',
      'Sticky sessions trade even load for state locality.',
      '503 / queue / scale-out are the real responses to overload.',
    ],
    misconceptions: [
      '"Random is always as good as round robin at low volume."',
      'Ignoring capacity limits on backends.',
      '"A balancer can accept unlimited traffic if backends exist."',
    ],
    discussion: [
      'When would you need session stickiness?',
      'How does autoscaling relate to load balancing?',
      'What should happen when every backend is at max connections?',
    ],
    lab: 'Burst under least-conn vs round robin; fill one backend and watch steering; saturate all backends and discuss 503/queue/scale-out. Use Complete work to free slots between bursts.',
    assess: [
      'Pick an algorithm for long-polling vs uniform API calls.',
      'Name one L7 routing criterion.',
      'Explain when sticky sessions help and what they cost.',
    ],
  },
  filesystem: {
    objectives: [
      'Explain the filesystem as a single tree rooted at /.',
      'Distinguish absolute vs. relative paths and use . and ..',
      'Read a permission string and explain what an inode is.',
      'Build paths safely in Python with pathlib or os.path.join.',
    ],
    keyConcepts: [
      'Hierarchy and the root (/); the working directory.',
      'A filename is a label pointing at an inode (the real file).',
      'Hard links share an inode (link count); symlinks store a path.',
      'rwx permissions for owner / group / others.',
      'pathlib and os.path.join avoid manual slash bugs.',
    ],
    misconceptions: [
      'Students think a file "is" its name — it\'s a directory entry pointing at an inode.',
      'They assume deleting a file frees space even if a process still has it open.',
      'They concatenate path strings instead of using join helpers.',
    ],
    discussion: [
      'When would you use a symbolic link instead of copying a file?',
      'Why is renaming a huge file instant, but copying it slow?',
    ],
    lab: 'Use the live shell + tree: create files, make a hard link, predict link count. Then run the path snippets and resolve a relative path with normpath.',
    assess: [
      'Predict the link count after `ln a b`.',
      'Decode a permission string like -rw-r--r--.',
      'Explain why hard-link data survives until the last link is removed.',
    ],
  },
  process: {
    objectives: [
      'Define a process and the states it moves through.',
      'Explain scheduling trade-offs (FCFS vs. SJF vs. Round Robin).',
      'Describe how fork/exec creates new processes.',
      'Contrast CPU bursts with I/O waiting using runnable Python examples.',
    ],
    keyConcepts: [
      'Ready / running / waiting states and context switches.',
      'The scheduler shares one CPU to create apparent concurrency.',
      'Quantum size trades throughput for responsiveness.',
      'fork() clones, exec() replaces the program image.',
      'Waiting processes retain memory; only the CPU is released.',
    ],
    misconceptions: [
      '"More threads always means faster."',
      '"A waiting process is broken" — it\'s usually blocked on I/O.',
      '"SJF can never starve long jobs."',
    ],
    discussion: [
      'Why do interactive systems favor Round Robin?',
      'When can Shortest-Job-First starve long jobs?',
    ],
    lab: 'Run the scheduler simulation and compare average waiting time across algorithms. Then run the CPU-burst vs sleep snippets and relate timing to process states.',
    assess: [
      'Given processes, choose the algorithm with the lowest average wait.',
      'Explain what a context switch costs.',
      'Define starvation and name one scheduler prone to it.',
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
    lab: 'Run Aliasing vs Copy, then Shallow vs deep and Mutable default trap in the references playground. Use the stack/heap visualizer to trigger overflow and label garbage objects.',
    assess: [
      'Predict the output of an aliasing vs. copy snippet.',
      'Explain shallow copy behavior on nested lists.',
      'Explain one way a GC language can still leak.',
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
    lab: 'Run the race simulation lock off/on, then Code labs (lost update vs lock). Run the async snippet and discuss overlap vs parallelism.',
    assess: [
      'Explain why the unlocked counter loses updates.',
      'Name two ways to make the increment safe.',
      'Define deadlock and one prevention strategy.',
    ],
  },
  data: {
    objectives: [
      'Explain bits, bytes, and number bases.',
      'Convert between binary, decimal, and hex.',
      'Explain how text becomes bytes via Unicode/UTF-8.',
      'Diagnose mojibake from encoding mismatches.',
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
      'Convert a small binary string to decimal by hand.',
    ],
  },
  network: {
    objectives: [
      'Trace a request through DNS, TCP, TLS, and HTTP.',
      'Explain round trips and where latency comes from.',
      'Read HTTP methods and status-code families.',
      'Describe timeouts, CDNs, and HTTP/2 multiplexing.',
    ],
    keyConcepts: [
      'Each setup hop costs a round trip.',
      'Keep-alive and caching win by avoiding hops.',
      'Methods state intent; status codes state the result.',
      'Latency is bounded by physical distance.',
      'Timeouts are client-side limits — distinct from 4xx/5xx.',
      'CDNs cache static assets at the edge; HTTP/2 multiplexes over one connection.',
    ],
    misconceptions: [
      '"Slow response = slow server" (often it\'s setup/latency).',
      '"GET can safely have side effects."',
      '"A timeout is a 5xx error from the server."',
    ],
    discussion: [
      'Why do CDNs reduce latency?',
      'When is a failure your fault (4xx) vs. the server\'s (5xx)?',
      'Why set connect and read timeouts on every outbound HTTP client?',
    ],
    lab: 'Use the request tracer: send once cold, then enable DNS cache + keep-alive and resend. Discuss how a CDN and HTTP/2 would further cut time for asset-heavy pages.',
    assess: [
      'Classify a set of status codes by family.',
      'Explain why the first page load is slower than the next.',
      'Distinguish a timeout from a 503 response.',
    ],
  },
  git: {
    objectives: [
      'Model history as a graph of commits.',
      'Explain branches and HEAD.',
      'Perform and interpret a merge.',
      'Recognize and resolve a merge conflict.',
    ],
    keyConcepts: [
      'A commit is a snapshot plus parent link(s).',
      'A branch is a movable pointer; branching is cheap.',
      'A merge commit has two parents.',
      'Commit ids are content hashes.',
      'Conflicts arise when both sides edit the same lines; markers show competing edits.',
    ],
    misconceptions: [
      '"Creating a branch copies all the files."',
      '"Merge and rebase are the same thing."',
      '"Conflicts mean Git is broken — just delete the branch."',
    ],
    discussion: [
      'When would you prefer merge vs. rebase?',
      'Why are commit ids hashes of content?',
      'How do small, frequent merges reduce conflict pain?',
    ],
    lab: 'Use the commit-graph builder: commit on main, branch, commit on the branch, then merge back and point out the two-parent commit; walk through resolving mock conflict markers.',
    assess: [
      'How many parents does a merge commit have?',
      'In one sentence, what is HEAD?',
      'What do you do after editing away conflict markers?',
    ],
  },
  cli: {
    objectives: [
      'Explain stdin, stdout, and stderr.',
      'Compose small tools into pipelines.',
      'Use common filters (grep, sort, uniq, wc).',
      'Relate shell pipelines to function chains in Python.',
    ],
    keyConcepts: [
      'The pipe connects one program\'s stdout to the next\'s stdin.',
      'Filters read stdin, transform, write stdout.',
      'Exit codes signal success/failure.',
      'stderr is separate from the piped data.',
      'Pipeline stages can run concurrently with streaming buffers.',
    ],
    misconceptions: [
      '"A pipe writes to a file."',
      '"Error messages flow through the pipe."',
      '"You need a script file for multi-step text processing."',
    ],
    discussion: [
      'Why compose small tools instead of one big program?',
      'Why keep stderr separate from stdout?',
      'When is a Python loop clearer than a shell pipeline?',
    ],
    lab: 'Build `grep ERROR | sort | uniq -c | sort -rn` step by step; run the Python pipeline snippet and compare the shape.',
    assess: [
      'Write a pipeline that counts lines matching a word.',
      'Explain why errors still appear when stdout is redirected.',
      'State the usual success exit code.',
    ],
  },
  datastructures: {
    objectives: [
      'Compare arrays, linked lists, and hash maps.',
      'Explain hashing, buckets, and collisions.',
      'Reason about the operation costs of each.',
      'Choose the right structure for a given access pattern.',
    ],
    keyConcepts: [
      'Array: O(1) index access, costly mid-insert.',
      'Linked list: cheap local insert, O(n) to find by position.',
      'Hash map: average O(1) via a hash function.',
      'Collisions chain; load factor triggers resizing.',
      'Cache-friendly arrays can beat lists in practice despite Big-O.',
    ],
    misconceptions: [
      '"A hash map is always O(1)."',
      '"A linked list is always faster to insert than an array."',
    ],
    discussion: [
      'When is an array better than a list despite O(1) list inserts?',
      'What makes a hash map degrade toward O(n)?',
    ],
    lab: 'Use the hash-map visualizer: insert keys, force a collision, observe chaining. Discuss when front-insert favors a linked list.',
    assess: [
      'Pick the right structure for fast lookup by id.',
      'Define a collision and how it\'s resolved.',
      'Explain what load factor triggers a resize.',
    ],
  },
  algorithms: {
    objectives: [
      'Read and compare Big-O growth rates.',
      'Connect complexity to real-world runtime.',
      'Recognize best/average/worst cases.',
      'Predict how work scales when input size doubles.',
    ],
    keyConcepts: [
      'Big-O describes growth, not exact time.',
      'O(1) < O(log n) < O(n) < O(n log n) < O(n²).',
      'The same algorithm can have different cases.',
      'O(n log n) sorts dominate O(n²) at scale.',
      'Insertion sort is O(n) on already-sorted input.',
    ],
    misconceptions: [
      '"Big-O tells you the exact runtime."',
      '"O(n²) is fine for any input."',
    ],
    discussion: [
      'Why do standard libraries use O(n log n) sorts?',
      'When is an O(n²) approach acceptable?',
    ],
    lab: 'Run the sort visualizer on random and nearly-sorted arrays; compare bubble vs selection comparison counts.',
    assess: [
      'If O(n²) takes 1s at n=1000, estimate the time at n=2000.',
      'Order a list of complexities from fastest-growing to slowest.',
      'Explain why insertion sort can beat merge sort on tiny inputs.',
    ],
  },
  recursion: {
    objectives: [
      'Identify base and recursive cases.',
      'Trace a recursive call tree.',
      'Explain memoization and its effect.',
      'Recognize when recursion mirrors nested or self-similar data.',
    ],
    keyConcepts: [
      'Every recursion needs a reachable base case.',
      'Branching recursion can blow up exponentially.',
      'Each call uses stack; too deep overflows it.',
      'Memoization caches results — the basis of dynamic programming.',
      'Linear recursion (factorial) uses O(n) stack depth.',
    ],
    misconceptions: [
      '"Recursion is always elegant and efficient."',
      '"A missing base case just returns nothing."',
    ],
    discussion: [
      'When is recursion clearer than a loop?',
      'Which problems are good candidates for memoization?',
    ],
    lab: 'Raise fibonacci(n) with and without memoization; contrast with factorial\'s linear call chain.',
    assess: [
      'Explain why naive Fibonacci is O(2ⁿ).',
      'State what memoization changes about repeated calls.',
      'Name one problem where recursion is a natural fit.',
    ],
  },
  sql: {
    objectives: [
      'Describe tables, rows, and keys.',
      'Write SELECT / WHERE / JOIN / GROUP BY.',
      'Explain indexes and SQL injection.',
      'Contrast safe parameterized queries with string concatenation.',
    ],
    keyConcepts: [
      'SQL is declarative — say what, not how.',
      'JOIN combines rows on a matching key.',
      'Aggregates (COUNT/SUM) work with GROUP BY.',
      'Indexes speed lookups; parameters prevent injection.',
      'Foreign keys link related tables.',
    ],
    misconceptions: [
      '"SQL specifies how the data is fetched."',
      '"Building queries by string concatenation is fine."',
      '"GROUP BY and ORDER BY do the same thing."',
    ],
    discussion: [
      'When does adding an index help — and when does it hurt?',
      'Why must user input be parameterized?',
      'How does a foreign key enforce referential integrity?',
    ],
    lab: 'Run a JOIN and GROUP BY in the SQLite playground; then run the unsafe vs safe parameterization snippets side by side.',
    assess: [
      'Write a query totaling spend per city.',
      'Explain how parameterized queries stop injection.',
      'Name the difference between a primary key and a foreign key.',
    ],
  },
  regex: {
    objectives: [
      'Read the core regex building blocks.',
      'Build and test patterns.',
      'Recognize greedy vs. lazy and backtracking pitfalls.',
      'Connect browser flags to Python\'s re module.',
    ],
    keyConcepts: [
      'Character classes, quantifiers, anchors, groups.',
      'Flags: g (all), i (ignore case), m (multiline).',
      'Quantifiers are greedy by default; ? makes them lazy.',
      'Complex patterns can backtrack catastrophically (ReDoS).',
      'Anchors match positions, not characters.',
    ],
    misconceptions: [
      '"Regex can parse anything, including HTML."',
      '"* matches any character."',
      '"Lazy quantifiers are always better."',
    ],
    discussion: [
      'When should you NOT reach for a regex?',
      'How do you fix a pattern that matches too much?',
      'What input would you avoid on a production regex endpoint?',
    ],
    lab: 'Use the tester: switch between the email and phone presets, then change {n} counts; try .* vs .*? on nested tags.',
    assess: [
      'State what \\d{3} matches.',
      'Make .* match as little as possible.',
      'Name one ReDoS risk factor.',
    ],
  },
  errors: {
    objectives: [
      'Explain exceptions and propagation.',
      'Use try / except / finally correctly.',
      'Read a stack trace.',
      'Catch specific exception types instead of bare except.',
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
      'Choose the right except clause for ValueError vs KeyError.',
    ],
  },
  caching: {
    objectives: [
      'Define hit, miss, and eviction.',
      'Explain LRU and hit rate.',
      'Understand cache invalidation.',
      'Relate CDNs to geographically distributed caching.',
    ],
    keyConcepts: [
      'Caching trades memory for speed.',
      'When full, an eviction policy (LRU) chooses what to drop.',
      'Hit rate measures effectiveness.',
      'Invalidation prevents serving stale data.',
      'Working set size drives how much capacity you need.',
    ],
    misconceptions: [
      '"A bigger cache is always better."',
      '"Cached data is always fresh."',
      '"A hit moves the item to the back of an LRU cache."',
    ],
    discussion: [
      'How do you keep a cache from serving stale data?',
      'What data structures make LRU O(1)?',
      'When is a CDN worth the complexity?',
    ],
    lab: 'Run the LRU simulator at capacity 2 vs. 4 on the sample sequence; then manually evict with A→B→C→D at capacity 3 and predict which key drops.',
    assess: [
      'State what LRU evicts.',
      'Name one cache-invalidation strategy.',
      'Explain how a CDN reduces latency for static assets.',
    ],
  },
  crypto: {
    objectives: [
      'Distinguish hashing, encryption, and encoding.',
      'Explain the avalanche effect.',
      'Store passwords safely.',
      'Use checksums to verify file integrity.',
    ],
    keyConcepts: [
      'Hashing is one-way; encryption is reversible with a key.',
      'A tiny input change flips ~half the hash.',
      'Encoding (Base64) is not security.',
      'Passwords need salted, slow hashes.',
      'Checksums detect tampering; salts defeat rainbow tables.',
    ],
    misconceptions: [
      '"Base64 encrypts / secures data."',
      '"A fast hash like SHA-256 alone is fine for passwords."',
      '"Same password should produce the same hash for easy lookup."',
    ],
    discussion: [
      'Why must password hashes be salted?',
      'For a given use case, do you need a hash or encryption?',
      'When would you publish a SHA-256 checksum for a download?',
    ],
    lab: 'Use the SHA-256 playground: change a single character and observe how much of the digest changes; discuss bcrypt vs raw SHA-256 for passwords.',
    assess: [
      'Describe how to store user passwords.',
      'Explain why Base64 provides no confidentiality.',
      'Define the avalanche effect in one sentence.',
    ],
  },
  time: {
    objectives: [
      'Explain the epoch, UTC, and offsets.',
      'Convert an instant across timezones.',
      'Avoid common format and DST pitfalls.',
      'Distinguish Unix seconds from JavaScript milliseconds.',
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
      'Spot a timestamp that is likely ms instead of seconds.',
    ],
  },
  compute: {
    objectives: [
      'Compare VMs, containers, and serverless.',
      'Explain horizontal vs. vertical scaling.',
      'Reason about capacity, utilization, and cost.',
      'Explain why autoscaling lags behind sudden spikes.',
    ],
    keyConcepts: [
      'An instance is one running copy; scale horizontally behind a load balancer.',
      'Stateless services scale freely; state goes in a shared store.',
      'Autoscaling reacts to load but lags; cold starts add latency.',
      'More capacity costs more — right-size for utilization.',
      'Vertical scaling hits a hard ceiling; horizontal is how large systems grow.',
    ],
    misconceptions: [
      '"Just buy a bigger machine" (vertical scaling has a hard ceiling).',
      '"Autoscaling is instant" (it lags; spikes can still drop requests).',
    ],
    discussion: [
      'When would you choose serverless over containers?',
      'Why must services be stateless to scale out?',
    ],
    lab: 'Use the scaling simulator: overload to drop requests, add instances, enable autoscaling, then drop load and discuss warm capacity vs scale-to-zero cost.',
    assess: [
      'Given a load and per-instance capacity, compute instances needed.',
      'Explain why stateless design enables horizontal scaling.',
      'Contrast vertical and horizontal scaling with one example each.',
    ],
  },
  queues: {
    objectives: [
      'Explain how a queue decouples producers and consumers.',
      'Describe backpressure and how to relieve it.',
      'Know delivery guarantees and idempotency.',
      'Contrast work queues with pub/sub and dead-letter queues.',
    ],
    keyConcepts: [
      'Producers append; consumers pull independently.',
      'Add consumers to increase throughput.',
      'At-least-once delivery → make consumers idempotent.',
      'Queues absorb spikes and downstream outages.',
      'Dead-letter queues isolate poison messages.',
    ],
    misconceptions: [
      '"A queue makes things faster" (it decouples and buffers, not speeds up work).',
      '"Messages are delivered exactly once" (usually at-least-once).',
      '"A growing queue means consumers are too fast."',
    ],
    discussion: [
      'Work queue vs. pub/sub — when each?',
      'What happens if consumers never catch up?',
      'When would you route failed messages to a dead-letter queue?',
    ],
    lab: 'Run the queue simulator: outrun consumers to build a backlog, then add consumers mid-run and time how long draining takes vs how fast depth grew.',
    assess: [
      'Explain what a growing queue depth indicates.',
      'Why should consumers be idempotent?',
      'Name one difference between a work queue and pub/sub.',
    ],
  },
  classes: {
    objectives: [
      'Distinguish a class from an object.',
      'Explain fields (per-object state) vs. methods (shared behavior).',
      'Describe the role of the constructor.',
      'Contrast instance variables with class variables.',
    ],
    keyConcepts: [
      'A class is a blueprint; an object is an instance.',
      'Each object owns its fields; methods live on the class.',
      'The constructor initializes new objects.',
      'Beware shared mutable class-level state.',
      'self refers to the current instance inside methods.',
    ],
    misconceptions: [
      '"Changing one object changes all of them."',
      '"Every object stores its own copy of the methods."',
      '"Class variables are a good place for per-object lists."',
    ],
    discussion: [
      'When is a class better than a plain dict/record?',
      'What is the difference between class and instance variables?',
      'Why does mutating a shared class list affect every instance?',
    ],
    lab: 'Use the class builder: create several objects and mutate one to show independent state with shared behavior; discuss a class-level list bug.',
    assess: [
      'Predict the effect of calling a method on one object.',
      'Explain where methods live vs. fields.',
      'Name one danger of mutable class variables.',
    ],
  },
  oop: {
    objectives: [
      'Explain the four pillars of OOP.',
      'Recognize polymorphism replacing type-branching.',
      'Summarize the SOLID principles.',
      'Prefer composition over deep inheritance when reuse is the goal.',
    ],
    keyConcepts: [
      'Encapsulation, inheritance, polymorphism, abstraction.',
      'Program to interfaces; depend on abstractions (DIP).',
      'Prefer composition over deep inheritance.',
      'SOLID keeps OO code flexible and testable.',
      'Duck typing enables polymorphism without a shared base class.',
    ],
    misconceptions: [
      '"Inheritance is always the right reuse tool."',
      '"OOP means lots of getters/setters."',
      '"Open/Closed means never edit existing code."',
    ],
    discussion: [
      'Composition vs. inheritance — how to choose?',
      'Which SOLID principle most improves testability?',
      'When does an abstract base class clarify intent?',
    ],
    lab: 'Run each pillar snippet plus Composition; extend Inheritance and Polymorphism with a new subclass/shape.',
    assess: [
      'Identify which pillar a code sample demonstrates.',
      'State the Dependency Inversion principle.',
      'Give one reason to compose instead of inherit.',
    ],
  },
  patterns: {
    objectives: [
      'Categorize patterns as creational, structural, or behavioral.',
      'Recognize when a specific pattern applies.',
      'Avoid over-applying patterns.',
      'Connect DI and Strategy to "program to an interface".',
    ],
    keyConcepts: [
      'A pattern is a reusable design shape, not copy-paste code.',
      'Many patterns share "program to an interface".',
      'The GoF 23 plus industry patterns (DI, Repository, MVC).',
      'Apply patterns to a felt problem, not preemptively.',
      'Pattern soup adds indirection without benefit.',
    ],
    misconceptions: [
      '"More patterns = better design" (pattern soup).',
      '"Patterns are language features" (they are design shapes).',
      '"Every if/else must become a pattern."',
    ],
    discussion: [
      'Which patterns are really the same idea in disguise?',
      'When does a plain function beat a pattern?',
      'Where does Factory vs Builder split construction concerns?',
    ],
    lab: 'Browse the catalog; run Strategy, Observer, and Dependency Injection; discuss where each appears in your stack.',
    assess: [
      'Match a scenario to the right pattern.',
      'Name the three GoF categories with an example each.',
      'State one sign you are over-using patterns.',
    ],
  },
  trees: {
    objectives: [
      'Distinguish trees from general graphs.',
      'Traverse structures depth-first and breadth-first.',
      'Explain why BFS finds shortest unweighted paths.',
      'Write a simple recursive tree function (e.g. count leaves).',
    ],
    keyConcepts: [
      'A tree is a cycle-free graph with one root and unique paths.',
      'DFS uses a stack/recursion; BFS uses a queue.',
      'BFS expands in rings, so it reaches nodes in fewest edges.',
      'Graphs need a visited set to avoid looping on cycles.',
      'Leaves are nodes with no children — common recursive base cases.',
    ],
    misconceptions: [
      '"DFS and BFS visit nodes in the same order."',
      '"You never need to track visited nodes."',
    ],
    discussion: [
      'When is DFS a better fit than BFS?',
      'What changes when edges have weights?',
    ],
    lab: 'Run DFS and BFS on the same tree, then BFS shortest-path, then Count tree leaves. Compare visit orders.',
    assess: [
      'State which traversal finds the shortest unweighted path.',
      'Explain why a visited set is needed for graphs but not trees.',
      'Define a leaf node and how recursion detects one.',
    ],
  },
  apis: {
    objectives: [
      'Explain REST resources, HTTP verbs, and JSON.',
      'Map methods to actions and read status-code families.',
      'Describe why REST is stateless.',
      'Recognize pagination and structured error responses.',
    ],
    keyConcepts: [
      'Resources are nouns (URLs); methods are verbs.',
      'GET is safe; POST is not idempotent.',
      'JSON serializes objects to text and back.',
      'Status codes group into 2xx/3xx/4xx/5xx.',
      'Consistent error JSON helps clients handle failures.',
    ],
    misconceptions: [
      '"GET can safely change server state."',
      '"JSON and JavaScript objects are the same thing."',
      '"Retrying a failed POST is always safe."',
    ],
    discussion: [
      'Why should retries be safe for GET but not POST?',
      'How does statelessness enable horizontal scaling?',
      'What belongs in a good API error body?',
    ],
    lab: 'Run the REST router snippet and add requests; run Pagination & error shape and walk through page metadata; classify status codes by family.',
    assess: [
      'Choose the right verb for creating vs. reading a resource.',
      'Classify a set of status codes by family.',
      'Explain why POST retries can cause duplicate side effects.',
    ],
  },
  auth: {
    objectives: [
      'Separate authentication from authorization.',
      'Explain salting and slow password hashing.',
      'Describe why a JWT is signed, not secret.',
      'Apply scope/permission checks after identity is known.',
    ],
    keyConcepts: [
      'AuthN proves identity; AuthZ grants permission.',
      'Salts make each password hash unique.',
      'Sessions store state server-side; tokens carry signed claims.',
      'A JWT payload is readable — never put secrets in it.',
      'HttpOnly cookies and refresh tokens reduce common web risks.',
    ],
    misconceptions: [
      '"A JWT is encrypted, so it is safe to store secrets in it."',
      '"A fast hash like SHA-256 alone is fine for passwords."',
      '"403 means the password was wrong."',
    ],
    discussion: [
      'When would you choose sessions over tokens?',
      'Why must password hashing be deliberately slow?',
      'How do refresh tokens limit the blast radius of a stolen access token?',
    ],
    lab: 'Run salt/hash twice to show changing salts; decode a JWT payload; use Scopes & authorization to show AuthZ after AuthN and discuss 403 vs 401.',
    assess: [
      'Explain the difference between AuthN and AuthZ.',
      'State why a JWT must not contain secrets.',
      'Distinguish 401 Unauthorized from 403 Forbidden.',
    ],
  },
  security: {
    objectives: [
      'Recognize injection and XSS.',
      'Fix them with parameterization and escaping.',
      'Apply least privilege and defense in depth.',
      'Validate untrusted input at the security boundary.',
    ],
    keyConcepts: [
      'Injection = untrusted input treated as code.',
      'Parameterized queries keep values as data.',
      'Escape output for its specific context to stop XSS.',
      'Least privilege limits the blast radius of a breach.',
      'Validation at the boundary rejects bad shape before it spreads.',
    ],
    misconceptions: [
      '"Cleaning input once at the door is enough."',
      '"Only big companies get attacked."',
      '"HTTPS alone stops XSS."',
    ],
    discussion: [
      'Why is output escaping context-specific?',
      'Where in your stack does least privilege apply?',
      'What belongs in validation vs authorization?',
    ],
    lab: 'Run the unsafe SQL snippet to see the attack, then the parameterized fix; show html.escape defusing an XSS payload; run Validate at the boundary.',
    assess: [
      'Give the correct fix for SQL injection.',
      'Explain how escaping stops XSS.',
      'Name two layers in defense in depth for a web app.',
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
    lab: 'Run Red then Green; extend table-driven clamp cases; run Fake clock; discuss what a React RTL test would assert for a Counter button.',
    assess: [
      'State the TDD cycle in order.',
      'Explain why most tests should be unit tests.',
      'Name one frontend query strategy RTL prefers over CSS classes.',
    ],
  },
  functional: {
    objectives: [
      'Define pure functions and side effects.',
      'Use map/filter/reduce to transform data.',
      'Explain how immutability prevents bugs.',
      'Use closures to capture configuration without globals.',
    ],
    keyConcepts: [
      'Pure = same input, same output, no side effects.',
      'Higher-order functions take/return functions.',
      'map transforms, filter selects, reduce folds.',
      'Immutability avoids shared-state and aliasing bugs.',
      'Closures remember enclosing variables for configured behavior.',
    ],
    misconceptions: [
      '"Functional programming needs a special language."',
      '"reduce is just a fancy loop with no benefit."',
      '"Immutability means you can never change data."',
    ],
    discussion: [
      'Why does purity enable parallelism and caching?',
      'When is a loop clearer than map/reduce?',
      'How do closures replace some class-based configuration?',
    ],
    lab: 'Run pure vs. impure; convert a loop into map/filter/reduce; compose two functions; build multipliers with Closure captures state.',
    assess: [
      'Identify whether a function is pure.',
      'Rewrite a loop using map/filter/reduce.',
      'Explain what a closure remembers.',
    ],
  },
  json: {
    objectives: [
      'Explain serialization and why APIs need a shared format.',
      'List the JSON value types and name types that do not survive a round-trip.',
      'Dump and load JSON in Python and compare compact vs pretty forms.',
      'Distinguish a missing JSON key from an explicit null.',
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
      'Explain KeyError vs null for a missing API field.',
    ],
  },
  search: {
    objectives: [
      'Contrast linear and binary search and their Big-O costs.',
      'State the sorted-input precondition for binary search.',
      'Decide when sorting-then-searching beats a single linear scan.',
      'Use Python bisect for insertion points on sorted data.',
    ],
    keyConcepts: [
      'Linear search is O(n) and order-agnostic.',
      'Binary search is O(log n) on a sorted range.',
      'Loop invariant: the target, if present, stays inside [lo, hi].',
      'Indexes and hash maps are alternative lookup tools.',
      'bisect_left vs bisect_right matter when duplicates exist.',
    ],
    misconceptions: [
      '"Binary search works on any list."',
      '"Sorting is free, so always binary-search."',
    ],
    discussion: [
      'How many lookups make pre-sorting worth it?',
      'When is a hash map a better fit than binary search?',
    ],
    lab: 'Run linear vs binary snippets and the million-element comparison; then bisect module with duplicate values.',
    assess: [
      'Estimate binary-search steps for n = 1,000,000.',
      'Explain one off-by-one pitfall in the binary-search loop.',
      'Choose linear vs binary for a single lookup on an unsorted list.',
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
    ],
  },
}

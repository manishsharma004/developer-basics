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
    ],
  },
  memory: {
    objectives: [
      'Distinguish the stack from the heap.',
      'Explain references and aliasing (value vs. reference).',
      'Describe garbage collection and how leaks still happen.',
    ],
    keyConcepts: [
      'Variables hold references, not copies.',
      'is compares identity; == compares value.',
      'Stack frames are fast but limited; recursion depth matters.',
      'GC frees unreachable objects only.',
    ],
    misconceptions: [
      '"Assignment copies the object."',
      '"A garbage-collected language can\'t leak memory."',
    ],
    discussion: [
      'Why does aliasing cause "spooky action at a distance" bugs?',
      'What makes the stack fast but size-limited?',
    ],
    lab: 'Run the references playground (aliasing vs. copy), then the stack/heap visualizer — trigger a stack overflow and produce an unreferenced "garbage" object.',
    assess: [
      'Predict the output of an aliasing vs. copy snippet.',
      'Explain one way a GC language can still leak.',
    ],
  },
  concurrency: {
    objectives: [
      'Define concurrency and race conditions.',
      'Explain critical sections and locks.',
      'Know lock-free alternatives and the risk of deadlock.',
    ],
    keyConcepts: [
      'Shared mutable state is the source of races.',
      'A counter increment is really read-add-write (not atomic).',
      'A mutex serializes a critical section.',
      'Immutability / no sharing avoids races; deadlock is the opposite trap.',
    ],
    misconceptions: [
      '"counter += 1 is atomic."',
      '"Adding threads always speeds things up."',
    ],
    discussion: [
      'How can you avoid locks entirely?',
      'What conditions produce a deadlock?',
    ],
    lab: 'Run the race simulation with the lock off (watch correctness drop below 100%), then on (100%). Increase threads to make the race worse.',
    assess: [
      'Explain why the unlocked counter loses updates.',
      'Name two ways to make the increment safe.',
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
    lab: 'Use the request tracer: send once cold, then enable DNS cache + keep-alive and resend to watch the total latency fall.',
    assess: [
      'Classify a set of status codes by family.',
      'Explain why the first page load is slower than the next.',
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
    ],
  },
  sql: {
    objectives: [
      'Describe tables, rows, and keys.',
      'Write SELECT / WHERE / JOIN / GROUP BY.',
      'Explain indexes and SQL injection.',
    ],
    keyConcepts: [
      'SQL is declarative — say what, not how.',
      'JOIN combines rows on a matching key.',
      'Aggregates (COUNT/SUM) work with GROUP BY.',
      'Indexes speed lookups; parameters prevent injection.',
    ],
    misconceptions: [
      '"SQL specifies how the data is fetched."',
      '"Building queries by string concatenation is fine."',
    ],
    discussion: [
      'When does adding an index help — and when does it hurt?',
      'Why must user input be parameterized?',
    ],
    lab: 'Run a JOIN and a GROUP BY against the seeded SQLite database; have students modify the WHERE clause.',
    assess: [
      'Write a query totaling spend per city.',
      'Explain how parameterized queries stop injection.',
    ],
  },
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
    ],
  },
  time: {
    objectives: [
      'Explain the epoch, UTC, and offsets.',
      'Convert an instant across timezones.',
      'Avoid common time-handling bugs.',
    ],
    keyConcepts: [
      'A Unix timestamp is one absolute instant.',
      'A timezone is UTC plus an offset.',
      'Store UTC, display local.',
      'ISO 8601 is the unambiguous string format.',
    ],
    misconceptions: [
      '"Store local time so it\'s easy to read."',
      '"A Unix timestamp includes a timezone."',
    ],
    discussion: [
      'Why store timestamps in UTC?',
      'What breaks around daylight-saving transitions?',
    ],
    lab: 'Use the converter: view one instant across zones, then add a day and confirm every zone moves by 86,400 seconds.',
    assess: [
      'State where timestamps should be stored.',
      'Define the Unix epoch.',
    ],
  },
}

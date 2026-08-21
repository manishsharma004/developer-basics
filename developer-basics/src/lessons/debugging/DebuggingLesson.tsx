import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Reproduce with a print',
    code: `def average(nums):
    total = 0
    for n in nums:
        total += n
        print("debug: n=", n, "total=", total)  # temporary probe
    return total / len(nums)

print("result:", average([2, 4, 6]))`,
  },
  {
    label: 'Levels of logging',
    code: `import logging

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")

def charge(user, amount):
    logging.debug("charge called user=%s amount=%s", user, amount)
    if amount <= 0:
        logging.warning("ignored non-positive amount=%s", amount)
        return False
    logging.info("charged %s to %s", amount, user)
    return True

charge("ada", 10)
charge("ada", -1)`,
  },
  {
    label: 'Assert the invariant',
    code: `def normalize_scores(scores):
    assert scores, "scores must not be empty"
    total = sum(scores)
    assert total > 0, f"total must be > 0, got {total}"
    return [s / total for s in scores]

print(normalize_scores([1, 2, 3]))
try:
    print(normalize_scores([]))
except AssertionError as e:
    print("caught:", e)`,
  },
  {
    label: 'Read the traceback',
    code: `def divide(a, b):
    return a / b

def average_pair(nums):
    return divide(sum(nums), len(nums))   # bug when nums is empty

try:
    print(average_pair([]))
except ZeroDivisionError:
    import traceback
    print("--- traceback (read bottom-up for the real error) ---")
    traceback.print_exc()
    print("=> the crash is in divide(), called from average_pair with len=0")`,
  },
  {
    label: 'pdb breakpoint (commented)',
    code: `def buggy_total(nums):
    total = 0
    for n in nums:
        # import pdb; pdb.set_trace()  # uncomment to pause here in a terminal
        total += n
    return total

print(buggy_total([1, 2, 3]))
print("In pdb: n, total, l — step with n/s, continue with c")`,
  },
]

export default function DebuggingLesson() {
  return (
    <Lesson id="debugging">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Writing code is only half the job. Finding why it misbehaves — a wrong
          answer, a crash, a slow path — is the other half. Good debugging is a
          method: reproduce, observe, form a hypothesis, change one thing, repeat.
        </p>
        <Callout kind="why" title="The one idea">
          Don't guess randomly. <strong>Make the failure reliable</strong>, then
          gather evidence (prints, logs, asserts, a debugger) until the bug has
          nowhere to hide.
        </Callout>
      </Section>

      <Section id="general" title="General practices">
        <p className="prose">
          The same loop works in any language or stack. Treat debugging as science,
          not luck:
        </p>
        <ol className="prose-list">
          <li>
            <strong>Reproduce</strong> — smallest input or steps that still fail.
            Flaky bugs need a reliable trigger before you dig.
          </li>
          <li>
            <strong>Observe</strong> — prints, logs, breakpoints, metrics. Change one
            variable at a time.
          </li>
          <li>
            <strong>Hypothesize</strong> — "I think X is null here" — then design one
            check that proves or disproves it.
          </li>
          <li>
            <strong>Fix &amp; guard</strong> — patch the root cause and add a test or
            assert so it cannot return silently.
          </li>
        </ol>
        <UnderTheHood title="Rubber duck & bisect">
          <p className="prose">
            Explaining the code out loud (even to a rubber duck) often reveals the wrong
            assumption. For regressions, <strong>git bisect</strong> binary-searches
            commit history; you can bisect code paths too — disable half the system until
            the failure vanishes.
          </p>
        </UnderTheHood>
        <Callout kind="tip" title="Change one thing">
          If you change three things at once and the bug disappears, you learned nothing.
          Revert, then isolate.
        </Callout>
      </Section>

      <Section id="python" title="Debugging Python">
        <p className="prose">
          Python failures usually arrive as a <strong>traceback</strong>. Read it{' '}
          <em>bottom-up</em>: the last line names the exception; lines above show the
          call chain. Use temporary prints for quick probes; switch to{' '}
          <code>logging</code> for anything that might ship.
        </p>
        <ul className="prose-list">
          <li>
            <code>import pdb; pdb.set_trace()</code> or <code>breakpoint()</code> —
            pause in a terminal REPL: inspect locals, step line by line.
          </li>
          <li>
            <strong>Log levels</strong>: DEBUG (noisy), INFO (normal), WARNING
            (handled oddity), ERROR (failed operation).
          </li>
          <li>
            <strong>Assertions</strong> document invariants for programmer mistakes —
            not a substitute for validating user input.
          </li>
        </ul>
        <SnippetRunner
          snippets={SNIPPETS.filter((s) =>
            ['Read the traceback', 'Levels of logging', 'Assert the invariant', 'pdb breakpoint (commented)'].includes(s.label),
          )}
        />
        <TryThis>
          In <strong>Read the traceback</strong>, follow the stack from{' '}
          <code>average_pair</code> down to <code>divide</code>. In{' '}
          <strong>Levels of logging</strong>, change the level to{' '}
          <code>logging.INFO</code> and watch DEBUG lines disappear.
        </TryThis>
      </Section>

      <Section id="frontend" title="Debugging frontend">
        <p className="prose">
          Browser apps fail in the DOM, the network, and async state. Your main tools
          are <strong>DevTools</strong> (built into Chrome, Firefox, Edge) and
          framework-specific extensions.
        </p>
        <ul className="prose-list">
          <li>
            <strong>Console</strong> — <code>console.log</code>, <code>console.table</code>,
            and uncaught errors with file/line links. Filter noise; preserve logs across
            navigations when debugging SPAs.
          </li>
          <li>
            <strong>Sources / breakpoints</strong> — pause on a line, inspect scope,
            watch expressions, step in/over/out. Conditional breakpoints fire only when
            a predicate is true — great for loops that fail on iteration 847.
          </li>
          <li>
            <strong>Network tab</strong> — see every fetch: status codes, payloads,
            timing. A "buggy UI" is often a 404 or CORS failure disguised as empty data.
          </li>
          <li>
            <strong>React DevTools</strong> — inspect component props/state, highlight
            what re-rendered, trace why a child updated.
          </li>
        </ul>
        <Callout kind="note" title="React-specific gotchas">
          Stale closures, missing dependency arrays in <code>useEffect</code>, and
          mutating state in place are frequent sources of "it works once, then breaks."
          Log props at render time and compare with what you expect after an event.
        </Callout>
        <UnderTheHood title="Source maps">
          <p className="prose">
            Production bundles are minified; <strong>source maps</strong> map compiled
            lines back to your TypeScript/JSX so breakpoints land in the code you wrote.
            Without them, you debug gibberish names in a single huge file.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="playground" title="Probe it live">
        <p className="prose">
          Practice three everyday Python tools: a print probe inside a loop, leveled
          logging, and asserts that catch bad inputs early.
        </p>
        <SnippetRunner
          snippets={SNIPPETS.filter((s) =>
            ['Reproduce with a print', 'Levels of logging', 'Assert the invariant'].includes(s.label),
          )}
        />
        <TryThis>
          In <strong>Reproduce with a print</strong>, remove the print once you trust
          the loop, then break the function (e.g. divide by{' '}
          <code>len(nums) - 1</code>) and use a print or assert to find it.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Debuggers vs. logs">
          <p className="prose">
            A debugger lets you pause, inspect locals, and step. Logs work when you
            can't attach interactively (production, other machines). Use both:
            debugger for deep local investigation, logs for timelines across services.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Observability in production">
          <p className="prose">
            Structured logs (JSON fields), traces (request IDs across services), and
            metrics (latency histograms) replace printf in production. The debugging
            mindset is the same — correlate evidence — but at fleet scale.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'reproduce', def: 'Make the bug happen again on demand with a known input.' },
            { term: 'log level', def: 'How severe/noisy a message is (DEBUG → ERROR).' },
            { term: 'assertion', def: 'A check that must hold; failure means a programming mistake.' },
            { term: 'stack trace', def: 'The chain of calls that led to an exception.' },
            { term: 'breakpoint', def: 'A pause point where a debugger stops execution for inspection.' },
            { term: 'regression', def: 'A bug introduced by a change that used to work.' },
            { term: 'bisect', def: 'Narrow the cause by repeatedly testing half of the suspects.' },
            { term: 'source map', def: 'Mapping from bundled JS back to original source files.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'First step when something fails intermittently:',
              options: [
                'Rewrite the whole module',
                'Find a reliable way to reproduce it',
                'Delete the tests',
                'Turn off logging',
              ],
              answer: 1,
              explain: 'Without a reliable reproduction, every “fix” is guesswork.',
            },
            {
              q: 'Which log level is for routine successful operations?',
              options: ['DEBUG', 'INFO', 'ERROR', 'ASSERT'],
              answer: 1,
              explain: 'INFO is for normal events; DEBUG is verbose detail; ERROR is failures.',
            },
            {
              q: 'In a Python traceback, where is the actual error usually found?',
              options: [
                'The first line at the top',
                'The last line at the bottom',
                'Only in comments',
                'Nowhere — tracebacks are random',
              ],
              answer: 1,
              explain: 'Read tracebacks bottom-up: the last line names the exception and message.',
            },
            {
              q: 'The Network tab in DevTools is most useful for:',
              options: [
                'Editing CSS colors',
                'Inspecting HTTP requests, status codes, and response bodies',
                'Compiling TypeScript',
                'Running unit tests',
              ],
              answer: 1,
              explain: 'Many UI bugs are failed or slow API calls — the Network tab shows them directly.',
            },
            {
              q: 'React DevTools helps you:',
              options: [
                'Minify bundles',
                'Inspect component props, state, and what re-rendered',
                'Replace eslint',
                'Deploy to production',
              ],
              answer: 1,
              explain: 'Framework tools expose the component tree and state that plain DevTools hide.',
            },
            {
              q: 'git bisect is useful when:',
              options: [
                'You need to format code',
                'A regression appeared and you need to find which commit introduced it',
                'You want to delete old branches',
                'Tests are too fast',
              ],
              answer: 1,
              explain: 'Binary search through history narrows the breaking change quickly.',
            },
            {
              q: 'An assertion failing usually means:',
              options: [
                'The network is down',
                'An invariant the programmer assumed is false',
                'The user typed a bad password',
                'JSON failed to parse',
              ],
              answer: 1,
              explain: 'Asserts guard programmer assumptions, not expected user errors.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Reproduce first, then gather evidence — don't shotgun-change code.</>,
            <>Python: read tracebacks bottom-up; use logging, pdb, and asserts.</>,
            <>Frontend: Console, breakpoints, Network tab, and React DevTools.</>,
            <>Bisect history or code paths when the suspect set is large.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

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

      <Section id="model" title="Observe, then change">
        <ul className="prose-list">
          <li>
            <strong>Reproduce</strong> with the smallest input that still fails.
            Flaky bugs need a reliable trigger before you dig.
          </li>
          <li>
            <strong>Print / log</strong> key values at decision points. Temporary
            prints are fine; structured logs stay in production at the right level.
          </li>
          <li>
            <strong>Log levels</strong>: DEBUG (noisy detail), INFO (normal events),
            WARNING (unexpected but handled), ERROR (failed operation).
          </li>
          <li>
            <strong>Assertions</strong> document invariants ("this must be true").
            When they fire, you learn <em>where</em> reality diverged.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Probe it live">
        <p className="prose">
          Practice three everyday tools: a print probe inside a loop, leveled
          logging, and asserts that catch bad inputs early.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Reproduce with a print</strong>, remove the print once you
          trust the loop, then break the function (e.g. divide by{' '}
          <code>len(nums) - 1</code>) and use a print or assert to find it. In{' '}
          <strong>Levels of logging</strong>, set the level to{' '}
          <code>logging.INFO</code> and notice DEBUG lines disappear.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Rubber duck and bisect">
          <p className="prose">
            Explaining the code out loud (even to a rubber duck) often reveals the
            wrong assumption. For regressions, binary-search the history (git
            bisect) or binary-search the code path: disable half the system until
            the failure vanishes — same idea as binary search on a sorted list.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Debuggers vs. logs">
          <p className="prose">
            A debugger lets you pause, inspect locals, and step. Logs work when you
            can't attach interactively (production, other machines). Use both:
            debugger for deep local investigation, logs for timelines across
            services.
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
            { term: 'regression', def: 'A bug introduced by a change that used to work.' },
            { term: 'bisect', def: 'Narrow the cause by repeatedly testing half of the suspects.' },
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
            <><strong>Prints and logs</strong> show values over time; levels keep noise down.</>,
            <><strong>Assertions</strong> catch broken invariants close to the cause.</>,
            <>Bisect history or code paths when the suspect set is large.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

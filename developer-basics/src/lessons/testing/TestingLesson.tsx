import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Red: a failing test',
    code: `# Test-first: write the check before the code exists / is correct.
def add(a, b):
    return a - b            # a deliberate bug

def test_add():
    assert add(2, 3) == 5, f"expected 5, got {add(2, 3)}"

test_add()                  # raises AssertionError -> this is "red"
print("passed")             # never reached`,
  },
  {
    label: 'Green: make it pass',
    code: `def add(a, b):
    return a + b            # fix the implementation

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

test_add()
print("all assertions passed ✅")`,
  },
  {
    label: 'Arrange–Act–Assert',
    code: `def apply_discount(price, percent):
    return price * (1 - percent / 100)

def test_apply_discount():
    # Arrange
    price = 100
    percent = 20
    # Act
    result = apply_discount(price, percent)
    # Assert
    assert result == 80

test_apply_discount()
print("AAA test passed")`,
  },
  {
    label: 'Fake dependency (inject clock)',
    code: `class FakeClock:
    def __init__(self):
        self.now = 0
    def tick(self):
        self.now += 1
        return self.now

def expires_at(clock, ttl):
    return clock.tick() + ttl

clock = FakeClock()
assert expires_at(clock, 5) == 6
print("deterministic time test passed")`,
  },
  {
    label: 'Table-driven edge cases',
    code: `def clamp(n, lo, hi):
    return max(lo, min(n, hi))

cases = [(5, 0, 10, 5), (-1, 0, 10, 0), (99, 0, 10, 10), (0, 0, 10, 0)]
for n, lo, hi, want in cases:
    got = clamp(n, lo, hi)
    assert got == want, (n, lo, hi, got)
print("all boundary cases passed")`,
  },
  {
    label: 'A tiny test runner',
    code: `def slugify(text):
    return "-".join(text.lower().split())

tests = {
    "basic": (slugify("Hello World"), "hello-world"),
    "trim":  (slugify("  spaced  out "), "spaced-out"),
    "empty": (slugify(""), ""),
}

passed = 0
for name, (got, want) in tests.items():
    ok = got == want
    passed += ok
    print(f"{'PASS' if ok else 'FAIL'}  {name}: {got!r}")
print(f"\\n{passed}/{len(tests)} passed")`,
  },
]

export default function TestingLesson() {
  return (
    <Lesson id="testing">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Tests are how you change code without fear. A good suite catches
          regressions the moment you introduce them, documents what the code is
          supposed to do, and lets you refactor aggressively because you'll know
          instantly if you broke something.
        </p>
        <Callout kind="why" title="The one idea">
          A test states an <strong>expectation</strong> and fails loudly when reality
          disagrees. Write enough small, fast tests and they become a safety net that
          turns "I hope this works" into "I know this works."
        </Callout>
      </Section>

      <Section id="model" title="The testing pyramid">
        <ul className="prose-list">
          <li>
            <strong>Unit tests</strong> (the wide base): test one function in
            isolation. Fast, numerous, pinpoint failures.
          </li>
          <li>
            <strong>Integration tests</strong> (the middle): check that parts work
            together — code plus a database, or two modules.
          </li>
          <li>
            <strong>End-to-end tests</strong> (the narrow top): drive the whole system
            like a user. Realistic but slow and brittle, so keep them few.
          </li>
        </ul>
        <UnderTheHood title="Why the pyramid shape">
          <p className="prose">
            E2E tests need browsers, networks, and real services — minutes per run and
            flaky selectors. Unit tests run in milliseconds. Budget most effort at the
            bottom; reserve E2E for critical paths (login, checkout, publish).
          </p>
        </UnderTheHood>
      </Section>

      <Section id="tdd" title="Test-Driven Development">
        <p className="prose">
          <strong>TDD</strong> is a rhythm, not a coverage mandate:
        </p>
        <ol className="prose-list">
          <li>
            <strong>Red</strong> — write a failing test that describes desired behavior.
          </li>
          <li>
            <strong>Green</strong> — write the smallest code that passes.
          </li>
          <li>
            <strong>Refactor</strong> — clean up with tests guarding you.
          </li>
        </ol>
        <p className="prose">
          The test is the first consumer of your API — awkward interfaces show up before
          you've invested in implementation.
        </p>
        <Callout kind="warning" title="TDD is not dogma">
          Use it when behavior is unclear or regressions are costly. You do not need a
          test for every private helper — test behavior callers depend on.
        </Callout>
      </Section>

      <Section id="unit" title="What to test in a unit">
        <p className="prose">Strong unit tests usually cover:</p>
        <ul className="prose-list">
          <li>Happy path — normal inputs produce expected outputs.</li>
          <li>Edge cases — empty, zero, boundaries, off-by-one.</li>
          <li>Error paths — invalid input raises or returns a defined error.</li>
        </ul>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Table-driven edge cases')} />
        <TryThis>
          Add a case for <code>n == hi</code> and <code>n == lo</code> to the table and
          confirm <code>clamp</code> still passes.
        </TryThis>
      </Section>

      <Section id="aaa" title="Arrange–Act–Assert">
        <p className="prose">
          Structure keeps tests readable. <strong>Arrange</strong> sets up inputs,{' '}
          <strong>Act</strong> calls the code under test, <strong>Assert</strong> checks
          the outcome. One logical behavior per test when possible.
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Arrange–Act–Assert')} />
      </Section>

      <Section id="mocking" title="Mocks, stubs, and fakes">
        <p className="prose">
          Code that talks to the network, clock, or randomness is hard to test
          deterministically. Pass dependencies in so tests can substitute{' '}
          <strong>fakes</strong> (simple working implementations) or{' '}
          <strong>mocks</strong> (record calls and return canned values).
        </p>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Fake dependency (inject clock)')} />
        <Callout kind="tip" title="Prefer fakes over mocks">
          Test outputs when you can. Over-mocking couples tests to internal call order
          and breaks on harmless refactors.
        </Callout>
      </Section>

      <Section id="pytest" title="pytest-style tests (Python)">
        <p className="prose">
          <code>pytest</code> discovers <code>test_*</code> functions and rewrites{' '}
          <code>assert</code> failures with readable diffs. <strong>Fixtures</strong>{' '}
          (<code>@pytest.fixture</code>) build shared setup; <strong>parametrize</strong>{' '}
          runs the same test over many input rows.
        </p>
        <pre className="code-block">{`# test_math.py
def add(a, b):
    return a + b

def test_add():
    assert add(1, 2) == 3

# Run: pytest test_math.py -v`}</pre>
      </Section>

      <Section id="frontend" title="Frontend testing">
        <p className="prose">
          Browser UIs add DOM, events, and async rendering. Common layers:
        </p>
        <ul className="prose-list">
          <li>
            <strong>Unit</strong> — pure functions (formatters, reducers) with Vitest/Jest.
          </li>
          <li>
            <strong>Component</strong> — React Testing Library renders and simulates
            clicks; query by role and accessible label, not CSS classes.
          </li>
          <li>
            <strong>E2E</strong> — Playwright or Cypress against staging.
          </li>
        </ul>
        <pre className="code-block">{`// Vitest + React Testing Library (conceptual)
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

test('increments count', async () => {
  render(<Counter />)
  await userEvent.click(screen.getByRole('button', { name: /increment/i }))
  expect(screen.getByText('Count: 1')).toBeInTheDocument()
})`}</pre>
      </Section>

      <Section id="playground" title="Red, green, refactor">
        <p className="prose">
          Run <strong>Red</strong> to watch a test fail on buggy code, then{' '}
          <strong>Green</strong> to see it pass once fixed. The tiny test runner shows
          pass/fail per case without pytest installed.
        </p>
        <SnippetRunner
          snippets={SNIPPETS.filter((s) =>
            ['Red: a failing test', 'Green: make it pass', 'A tiny test runner'].includes(s.label),
          )}
        />
        <TryThis>
          In <strong>A tiny test runner</strong>, add a new case like{' '}
          <code>"punct": (slugify("Hi, there!"), "hi,-there!")</code> and run it —
          then decide whether the <em>test</em> or the <em>code</em> should change.
        </TryThis>
      </Section>

      <Section id="ci" title="Tests in CI">
        <p className="prose">
          Run tests on every pull request before merge. Fast unit tests first;
          integration and E2E in parallel or on a schedule if they are slow. A flaky
          test that passes sometimes erodes trust — fix timing races and shared state,
          or delete tests that only assert mocks called mocks.
        </p>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="What makes a good test">
          <p className="prose">
            Good tests are <strong>fast</strong>, <strong>isolated</strong>,{' '}
            <strong>deterministic</strong>, and <strong>focused</strong>. Test behavior
            and edge cases — not private internals — so you can refactor freely.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Coverage is a floor, not a goal">
          <p className="prose">
            Coverage tells you which lines <em>ran</em>, not whether you asserted the
            right things. Every production bug should ideally become a regression test
            that would have caught it.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'unit test', def: 'A test of one small piece in isolation.' },
            { term: 'integration test', def: 'A test combining real dependencies (DB, HTTP).' },
            { term: 'assertion', def: 'A statement that must be true, or the test fails.' },
            { term: 'TDD', def: 'Test-driven development: red → green → refactor.' },
            { term: 'fixture / mock', def: 'Controlled setup or a stand-in for a real dependency.' },
            { term: 'AAA', def: 'Arrange–Act–Assert test structure.' },
            { term: 'flaky test', def: 'Passes sometimes without code changes — fix or delete.' },
            { term: 'regression', def: 'A previously working behavior that a change breaks.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is the order of the TDD cycle?',
              options: [
                'Refactor → red → green',
                'Green → red → refactor',
                'Red (failing test) → green (make it pass) → refactor',
                'Write code → hope → ship',
              ],
              answer: 2,
              explain: 'Start with a failing test, make it pass, then clean up safely.',
            },
            {
              q: 'Why should most of your tests be unit tests?',
              options: [
                'They are the only kind that works',
                'They are fast, isolated, and pinpoint failures',
                'They test the whole system',
                'They need a browser',
              ],
              answer: 1,
              explain: 'The pyramid favors many fast unit tests over few slow end-to-end ones.',
            },
            {
              q: 'What does Arrange–Act–Assert help with?',
              options: [
                'Faster CPUs',
                'Readable, structured tests',
                'Database migrations',
                'CSS layout',
              ],
              answer: 1,
            },
            {
              q: 'Why inject a fake clock in tests?',
              options: [
                'To make code slower',
                'To control time deterministically',
                'To avoid writing assertions',
                'To replace all unit tests',
              ],
              answer: 1,
            },
            {
              q: 'React Testing Library encourages querying by:',
              options: [
                'CSS class only',
                'Internal component state',
                'Roles and accessible labels',
                'Random element IDs',
              ],
              answer: 2,
            },
            {
              q: '100% code coverage guarantees:',
              options: [
                'No bugs at all',
                'That every line ran — not that assertions are meaningful',
                'The code is fast',
                'The code is secure',
              ],
              answer: 1,
              explain: 'Coverage measures execution, not the quality of your assertions.',
            },
            {
              q: 'A flaky test is dangerous because:',
              options: [
                'It runs too fast',
                'People ignore red CI when failures are random',
                'It uses too much memory',
                'pytest forbids it',
              ],
              answer: 1,
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Favor many fast <strong>unit tests</strong>; keep slow end-to-end tests few.</>,
            <><strong>TDD</strong>: red → green → refactor when behavior is unclear.</>,
            <>Test happy paths, edges, and errors; use AAA structure.</>,
            <>Replace time/network with fakes; frontend tests query visible behavior.</>,
            <>Run everything in CI; fix flaky tests before they train you to ignore red builds.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

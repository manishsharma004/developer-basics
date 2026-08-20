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
          <li>
            <strong>TDD</strong> is a rhythm: write a failing test (<strong>red</strong>),
            write just enough code to pass (<strong>green</strong>), then{' '}
            <strong>refactor</strong> with the test guarding you.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Red, green, refactor">
        <p className="prose">
          Run <strong>Red</strong> to watch a test fail on buggy code, then{' '}
          <strong>Green</strong> to see it pass once fixed. The third snippet is a
          minimal test runner that reports pass/fail per case.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>A tiny test runner</strong>, add a new case like{' '}
          <code>"punct": (slugify("Hi, there!"), "hi,-there!")</code> and run it —
          then decide whether the <em>test</em> or the <em>code</em> should change to
          make it pass.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="What makes a good test">
          <p className="prose">
            Good tests are <strong>fast</strong> (run them constantly),{' '}
            <strong>isolated</strong> (no shared state or ordering dependencies),{' '}
            <strong>deterministic</strong> (no flaky time/network/randomness), and{' '}
            <strong>focused</strong> (one behavior, a clear name). Test behavior and
            edge cases — empty, zero, negative, boundaries — not the private internals,
            so you can refactor freely.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Coverage is a floor, not a goal">
          <p className="prose">
            Coverage tells you which lines <em>ran</em> during tests, not whether you
            asserted the right things. 100% coverage with weak assertions still ships
            bugs; thoughtful tests of the tricky paths beat chasing a number. Use
            coverage to find <em>untested</em> code, then write meaningful checks.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'unit test', def: 'A test of one small piece in isolation.' },
            { term: 'assertion', def: 'A statement that must be true, or the test fails.' },
            { term: 'TDD', def: 'Test-driven development: red → green → refactor.' },
            { term: 'regression', def: 'A previously working behavior that a change breaks.' },
            { term: 'fixture / mock', def: 'Controlled setup or a stand-in for a real dependency.' },
            { term: 'coverage', def: 'The share of code executed by the test suite.' },
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
              q: '100% code coverage guarantees:',
              options: [
                'No bugs at all',
                'That every line ran during tests — not that assertions are meaningful',
                'The code is fast',
                'The code is secure',
              ],
              answer: 1,
              explain: 'Coverage measures execution, not the quality of your assertions.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Tests turn "I hope it works" into "I know it works" and enable fearless change.</>,
            <>Favor many fast <strong>unit tests</strong>; keep slow end-to-end tests few.</>,
            <><strong>TDD</strong>: red (failing) → green (pass) → refactor.</>,
            <>Good tests are fast, isolated, deterministic, and focused; coverage is a floor.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

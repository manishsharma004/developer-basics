import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Names & values',
    code: `name = "Ada"
age = 36
pi = 3.14159
active = True

print(type(name), name)
print(type(age), age)
print(type(pi), pi)
print(type(active), active)

# Rebind: the name points at a new value
age = 37
print("after birthday:", age)`,
  },
  {
    label: 'Dynamic typing',
    code: `x = 10
print("x is", x, type(x))

x = "now a string"
print("x is", x, type(x))

# Types attach to values, not variable names
items = [1, 2, 3]
items = "oops"  # legal in Python — probably a bug in real code
print(items)`,
  },
  {
    label: 'Truthiness',
    code: `def describe(value):
    if value:
        print(repr(value), "→ truthy")
    else:
        print(repr(value), "→ falsy")

describe(0)
describe("")
describe([])
describe([0])
describe(None)
describe("hello")`,
  },
  {
    label: '== vs is',
    code: `    a = [1, 2]
    b = a
    c = [1, 2]
    print("==", a == b, a == c)   # same contents
    print("is", a is b, a is c)   # same object in memory`,
  },
  {
    label: 'Type conversion',
    code: `age_str = "36"
age = int(age_str)
print(type(age_str), age_str)
print(type(age), age)

# "3" + 1 fails — parse first
try:
    print("3" + 1)
except TypeError as e:
    print("TypeError:", e)
print(int("3") + 1)`,
  },

]

export default function VariablesLesson() {
  return (
    <Lesson id="variables">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Every program stores information in <strong>variables</strong> — named
          boxes that point at values. Understanding types, rebinding, and what
          counts as “true” in an <code>if</code> statement prevents whole classes
          of bugs before you touch APIs or databases.
        </p>
        <Callout kind="why" title="The one idea">
          A variable is a <em>name</em> for a value. The value has a type; in
          Python the name can be rebound to a different type later.
        </Callout>
      </Section>

      <Section id="model" title="Names, types & values">
        <ul className="prose-list">
          <li>
            <strong>Assignment</strong> (<code>=</code>) binds a name to a value:{' '}
            <code>count = 3</code>.
          </li>
          <li>
            Common types: <code>int</code>, <code>float</code>, <code>str</code>,{' '}
            <code>bool</code>, <code>list</code>, <code>dict</code>,{' '}
            <code>None</code>.
          </li>
          <li>
            <code>type(x)</code> tells you what kind of value you have — useful in
            debugging and REPLs.
          </li>
          <li>
            <strong>Dynamic typing</strong>: the same name can later refer to a
            different type. Flexibility with responsibility.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Explore types live">
        <p className="prose">
          Run these snippets to see types printed, names rebound, and which values
          Python treats as truthy vs falsy in conditionals.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Truthiness</strong>, add <code>describe(0.0)</code> and{' '}
          <code>describe("0")</code> — same digit, different types, different
          results.
        </TryThis>
      </Section>

      <Section id="casting" title="Converting between types">
        <p className="prose">
          Sometimes you must convert explicitly: <code>int("42")</code>,{' '}
          <code>str(3.14)</code>, <code>float("2.5")</code>. Implicit conversion
          from strings to numbers does not happen —{' '}
          <code>"3" + 1</code> raises <code>TypeError</code>.
        </p>
        <Callout kind="note">
          User input from forms and CLI arguments arrives as strings. Parse before
          doing math.
        </Callout>
        <SnippetRunner snippets={SNIPPETS.filter((s) => s.label === 'Type conversion')} />
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Names vs values in memory">
          <p className="prose">
            In CPython, a name in a namespace is an entry in a dict mapping to an
            object. Assignment updates that mapping; it does not copy the object
            (see the Memory lesson for when copies happen).
          </p>
        </UnderTheHood>
        <UnderTheHood title="Constants by convention">
          <p className="prose">
            Python has no true constant keyword. Teams use ALL_CAPS names (
            <code>MAX_RETRIES = 3</code>) and linters to signal “do not rebind.”
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'variable', def: 'A name bound to a value in the current scope.' },
            { term: 'type', def: 'The kind of value (int, str, etc.) determining valid operations.' },
            { term: 'dynamic typing', def: 'Names are not fixed to one type for the whole program.' },
            { term: 'truthy / falsy', def: 'How a value behaves in boolean context (if, and, or).' },
            { term: 'None', def: 'The singleton meaning “no value” / missing.' },
            { term: 'type conversion', def: 'Explicit cast via int(), str(), float(), etc.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'After x = 5 then x = "five", what is type(x)?',
              options: ['int', 'str', 'int | str', 'unknown until runtime'],
              answer: 1,
              explain: 'The name now points at a string; types belong to values.',
            },
            {
              q: 'Which value is falsy in Python?',
              options: ['[0]', '"0"', '0', '[False]'],
              answer: 2,
              explain: '0, empty containers, None, and "" are falsy; non-empty containers are truthy.',
            },
            {
              q: 'Why parse input with int() before adding?',
              options: [
                'Python auto-converts strings',
                'Strings and numbers use different representations; + needs matching types',
                'int() makes code slower only',
                'You cannot add numbers in Python',
              ],
              answer: 1,
              explain: '"3" + 1 is invalid; int("3") + 1 is 4.',
            },

            {
              q: 'What does `is` test versus `==`?',
              options: [
                'Value equality',
              'Identity (same object in memory)',
              'Type match',
              'String length',
              ],
              answer: 1,
              explain: '`is` compares object identity; `==` compares values.',
            },
            {
              q: 'Which is truthy?',
              options: [
                'None',
              '[]',
              '[0]',
              '""',
              ],
              answer: 2,
              explain: 'A list containing 0 is non-empty, so it is truthy.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Variables are <strong>names</strong> for values, not the values themselves.</>,
            <>Use <code>type()</code> when debugging; convert explicitly at boundaries.</>,
            <>Know falsy values: <code>0</code>, <code>""</code>, <code>[]</code>, <code>None</code>.</>,
            <>Dynamic typing is flexible — document intent and test edge types.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

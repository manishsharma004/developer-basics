import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'The classic surprise',
    code: `print(0.1 + 0.2)
print(0.1 + 0.2 == 0.3)

# What you probably wanted:
from math import isclose
print("close enough?", isclose(0.1 + 0.2, 0.3))`,
  },
  {
    label: 'Binary fractions',
    code: `# Some decimals have no exact binary representation
for x in [0.1, 0.2, 0.3, 1/3]:
    print(f"{x} stored as {x:.17f}")`,
  },
  {
    label: 'Money pattern',
    code: `# Store money as integer cents, not float dollars
price_cents = 1999  # $19.99
tax_cents = round(price_cents * 0.0825)
total_cents = price_cents + tax_cents
print("total $", total_cents / 100)

# Decimal module for exact decimal math
from decimal import Decimal
a = Decimal("0.1")
b = Decimal("0.2")
print("Decimal sum:", a + b)`,
  },
]

export default function FloatingPointLesson() {
  return (
    <Lesson id="floatingpoint">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Floating-point numbers look like everyday decimals but are stored in
          binary with finite bits. That is why <code>0.1 + 0.2</code> is not
          exactly <code>0.3</code> — and why money, scores, and scientific code
          need careful comparison and representation.
        </p>
        <Callout kind="why" title="The one idea">
          Floats are <em>approximations</em>. Never compare them with{' '}
          <code>==</code> unless you know they are integers or exact binary
          fractions.
        </Callout>
      </Section>

      <Section id="model" title="Approximation, not exact">
        <ul className="prose-list">
          <li>
            <code>float</code> follows IEEE 754 — sign, exponent, mantissa in a
            fixed number of bits (64-bit “double” in Python).
          </li>
          <li>
            Fractions like <code>0.1</code> repeat forever in binary; the stored
            value is the nearest representable number.
          </li>
          <li>
            Small errors accumulate in long chains of arithmetic — order of
            operations can matter at the last bit.
          </li>
          <li>
            Display rounding hides the noise: <code>print(0.1 + 0.2)</code> may
            show <code>0.30000000000000004</code> or a rounded <code>0.3</code>{' '}
            depending on formatting.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="See the bits drift">
        <p className="prose">
          Run the equality trap, inspect how values are actually stored, and
          compare the integer-cents and <code>Decimal</code> patterns for money.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Binary fractions</strong>, add <code>0.1 + 0.1 + 0.1</code>{' '}
          and compare to <code>0.3</code> with <code>isclose</code>. Try summing{' '}
          <code>0.1</code> ten times in a loop.
        </TryThis>
      </Section>

      <Section id="compare" title="Comparing floats safely">
        <p className="prose">
          Use <code>math.isclose(a, b)</code> with a tolerance, or compare integers
          (cents, micro-units). For decimal-heavy domains, use Python’s{' '}
          <code>decimal.Decimal</code> with string inputs.
        </p>
        <Callout kind="note">
          Never use float for currency in production ledgers. Integers + fixed scale
          or a decimal library are the standard fixes.
        </Callout>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Special values">
          <p className="prose">
            IEEE floats include <code>inf</code>, <code>-inf</code>, and{' '}
            <code>NaN</code> (not a number). <code>NaN != NaN</code> — comparisons
            with NaN are always false.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Integers are exact (until they are huge)">
          <p className="prose">
            Python integers are arbitrary precision; only floats approximate. Mixing
            them promotes to float — another place surprises appear.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'floating point', def: 'A binary approximation of real numbers with limited precision.' },
            { term: 'IEEE 754', def: 'The standard format for float bit layout and rounding.' },
            { term: 'mantissa / exponent', def: 'Parts of a float encoding significant digits and scale.' },
            { term: 'isclose', def: 'Tolerance-based float comparison in math module.' },
            { term: 'Decimal', def: 'Python type for base-10 exact decimal arithmetic.' },
            { term: 'NaN', def: 'Not-a-Number — result of undefined ops like 0/0.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Why is 0.1 + 0.2 == 0.3 often False?',
              options: [
                'Python has a bug',
                'Floats cannot represent 0.1 exactly in binary',
                'Addition is random',
                'Only integers are supported',
              ],
              answer: 1,
              explain: 'Both sides are approximations; tiny error breaks exact ==.',
            },
            {
              q: 'Best approach for USD totals in an e-commerce cart?',
              options: ['float dollars', 'int cents', 'strings only', 'NaN as placeholder'],
              answer: 1,
              explain: 'Integer cents (or Decimal) avoids cumulative float error.',
            },
            {
              q: 'NaN == NaN is:',
              options: ['True', 'False', 'SyntaxError', 'Depends on platform'],
              answer: 1,
              explain: 'NaN is defined to compare unequal even to itself.',
            },

            {
              q: 'Best way to compare floats for equality?',
              options: [
                '== always',
              'math.isclose with tolerance',
              'Convert to int',
              'Use strings',
              ],
              answer: 1,
              explain: 'Tolerance-based comparison handles representation error.',
            },
            {
              q: 'Summing many small floats can:',
              options: [
                'Always be exact',
              'Accumulate tiny errors',
              'Crash Python',
              'Return NaN only',
              ],
              answer: 1,
              explain: 'Repeated approximation can drift from the mathematically exact total.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Floats are fast approximations — fine for science, risky for money.</>,
            <>Compare with <code>isclose</code> or use integers / <code>Decimal</code>.</>,
            <>Printing rounds; internal values may still carry tiny error.</>,
            <>Know <code>inf</code> and <code>NaN</code> exist and behave oddly.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

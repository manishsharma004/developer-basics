import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'if / elif / else',
    code: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    else:
        return "F"

for s in [95, 82, 71, 60]:
    print(s, "→", grade(s))`,
  },
  {
    label: 'for loops',
    code: `total = 0
for n in [3, 1, 4, 1, 5]:
    total += n
print("sum:", total)

# range(start, stop) — stop is exclusive
evens = []
for i in range(0, 10, 2):
    evens.append(i)
print("evens:", evens)`,
  },
  {
    label: 'while & break',
    code: `n = 1
while n < 100:
    n *= 2
print("first power of 2 ≥ 100:", n)

# break exits the innermost loop early
for x in range(10):
    if x == 5:
        break
    print(x, end=" ")
print("\\n(stopped at 5)")`,
  },
  {
    label: 'continue & for-else',
    code: `    for n in range(10):
        if n % 2 == 0:
            continue
        print(n, end=" ")
    print()
    
    for x in range(5):
        if x == 99:
            break
    else:
        print("loop finished without break")`,
  },

]

export default function ControlFlowLesson() {
  return (
    <Lesson id="controlflow">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Programs rarely run in a straight line. <strong>Control flow</strong>{' '}
          decides which code runs, how often, and when to stop — branching on
          conditions, looping over data, and bailing out early when you find an
          answer.
        </p>
        <Callout kind="why" title="The one idea">
          <code>if</code> chooses a path; <code>for</code> and <code>while</code>{' '}
          repeat work until a condition ends the loop.
        </Callout>
      </Section>

      <Section id="model" title="Branching & loops">
        <ul className="prose-list">
          <li>
            <strong>if / elif / else</strong> — exactly one branch runs (first true
            condition wins).
          </li>
          <li>
            <strong>for</strong> — iterate over a sequence or <code>range</code>;
            prefer when you know how many steps or have a collection.
          </li>
          <li>
            <strong>while</strong> — repeat while a condition is true; ensure
            something inside eventually makes it false (avoid infinite loops).
          </li>
          <li>
            <strong>break</strong> exits a loop early; <strong>continue</strong>{' '}
            skips to the next iteration.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Run the branches">
        <p className="prose">
          Step through grading logic, summing with <code>for</code>, and doubling
          with <code>while</code>. Edit thresholds or ranges and re-run.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>for loops</strong>, change the <code>range</code> step to{' '}
          <code>3</code> and predict the list before running. Add an{' '}
          <code>else</code> clause on the <code>for</code> in the while snippet
          (Python runs <code>for-else</code> only if no <code>break</code>).
        </TryThis>
      </Section>

      <Section id="logic" title="Boolean logic">
        <p className="prose">
          Combine conditions with <code>and</code>, <code>or</code>, and{' '}
          <code>not</code>. Use parentheses when mixing them —{' '}
          <code>not a and b</code> is not the same as <code>not (a and b)</code>.
        </p>
        <Callout kind="note">
          Short-circuit: <code>False and expensive()</code> never calls{' '}
          <code>expensive()</code>. Same for <code>True or expensive()</code>.
        </Callout>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Indentation is syntax">
          <p className="prose">
            Python uses indentation (typically four spaces) to define blocks. A
            missing indent is a syntax error — the parser cannot guess your intent.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Loop else">
          <p className="prose">
            A <code>for</code> or <code>while</code> may have an <code>else</code>{' '}
            that runs only if the loop completes without <code>break</code>. Handy
            for search loops (“found nothing” cases).
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'control flow', def: 'The order statements execute: sequence, branch, loop.' },
            { term: 'condition', def: 'A boolean expression deciding which branch runs.' },
            { term: 'iteration', def: 'One pass through a loop body.' },
            { term: 'range', def: 'A lazy sequence of integers, often used with for.' },
            { term: 'short-circuit', def: 'and/or stop evaluating once the result is decided.' },
            { term: 'infinite loop', def: 'A while whose condition never becomes false.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'range(0, 10, 2) produces:',
              options: ['0,2,4,6,8', '0,2,4,6,8,10', '2,4,6,8', '10 numbers starting at 0'],
              answer: 0,
              explain: 'Stop is exclusive and step is 2: 0, 2, 4, 6, 8.',
            },
            {
              q: 'When does a for-else clause run?',
              options: [
                'Every iteration',
                'Only when break is used',
                'When the loop finishes without break',
                'Never in Python',
              ],
              answer: 2,
              explain: 'else on a loop is the “no break” path.',
            },
            {
              q: 'True and False or True evaluates to:',
              options: ['True', 'False', 'Error', 'None'],
              answer: 0,
              explain: 'and binds tighter: (True and False) or True → False or True → True.',
            },

            {
              q: 'What does `break` do inside a loop?',
              options: [
                'Skip one iteration',
              'Exit the loop immediately',
              'Return from the function',
              'Restart the program',
              ],
              answer: 1,
              explain: '`break` leaves the innermost loop right away.',
            },
            {
              q: '`while True:` without a break is:',
              options: [
                'Always valid',
              'An infinite loop',
              'Syntax error',
              'Same as for-loop',
              ],
              answer: 1,
              explain: 'The condition never becomes false unless you break or return.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><code>if/elif/else</code> picks one path; order conditions from specific to general.</>,
            <><code>for</code> walks sequences; <code>while</code> repeats until a condition fails.</>,
            <>Use <code>break</code>/<code>continue</code> sparingly — clear loop conditions first.</>,
            <>Combine booleans carefully; parentheses beat memorizing precedence rules.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

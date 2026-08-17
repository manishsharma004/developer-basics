import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { RegexTester } from './RegexTester.tsx'

export default function RegexLesson() {
  return (
    <Lesson id="regex">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Regular expressions are a compact language for describing text patterns —
          validating input, searching logs, extracting fields, find-and-replace.
          They look cryptic at first, but they're built from a small set of pieces
          you can learn quickly.
        </p>
        <Callout kind="why" title="The one idea">
          A regex is a pattern that either <em>matches</em> a piece of text or
          doesn't. You build patterns from character classes, quantifiers, and
          anchors.
        </Callout>
      </Section>

      <Section id="model" title="The building blocks">
        <ul className="prose-list">
          <li><strong>Literals</strong> — <code>cat</code> matches the letters c-a-t.</li>
          <li><strong>Character classes</strong> — <code>\d</code> digit, <code>\w</code> word char, <code>.</code> any char, <code>[a-z]</code> a range.</li>
          <li><strong>Quantifiers</strong> — <code>*</code> zero+, <code>+</code> one+, <code>?</code> optional, <code>{'{3}'}</code> exactly three.</li>
          <li><strong>Anchors</strong> — <code>^</code> start, <code>$</code> end, <code>\b</code> word boundary.</li>
          <li><strong>Groups</strong> — <code>( … )</code> capture part of the match for extraction.</li>
        </ul>
      </Section>

      <Section id="playground" title="Test a pattern">
        <p className="prose">
          Edit the pattern and the text; matches highlight live. Toggle flags:{' '}
          <code>g</code> finds all matches, <code>i</code> ignores case,{' '}
          <code>m</code> makes <code>^</code>/<code>$</code> work per line.
        </p>
        <RegexTester />
        <TryThis>
          Click <strong>emails</strong>, then <strong>phone numbers</strong>, then{' '}
          <strong>order ids</strong> and watch the highlights move. Change{' '}
          <code>\d{'{4}'}</code> to <code>\d{'{3}'}</code> in the phone pattern and see
          how the matches change.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Greedy vs. lazy matching">
          <p className="prose">
            Quantifiers are <strong>greedy</strong> by default: <code>.*</code> grabs
            as much as possible, then backtracks. Add <code>?</code> to make them{' '}
            <strong>lazy</strong> (<code>.*?</code>), matching as little as possible.
            This is the usual fix when a pattern "matches too much".
          </p>
        </UnderTheHood>
        <UnderTheHood title="Catastrophic backtracking">
          <p className="prose">
            Some patterns (like nested quantifiers <code>(a+)+</code> on certain
            input) can make the engine try exponentially many combinations, freezing
            on a short string. This "ReDoS" is why you should keep patterns simple and
            never run untrusted regexes on a server.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'character class', def: 'A set of characters to match, e.g. \\d or [a-z].' },
            { term: 'quantifier', def: 'How many times to match: * + ? {n}.' },
            { term: 'anchor', def: 'A position, not a character: ^ $ \\b.' },
            { term: 'capture group', def: 'Parentheses that extract part of a match.' },
            { term: 'flag', def: 'A modifier like g (global) or i (ignore case).' },
            { term: 'greedy / lazy', def: 'Match as much / as little as possible.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: <>What does <code>\d{'{3}'}</code> match?</>,
              options: ['Any three characters', 'Exactly three digits', 'Three or more digits', 'A literal d3'],
              answer: 1,
              explain: '\\d is a digit and {3} means exactly three of them.',
            },
            {
              q: <>Which flag makes a pattern find <em>all</em> matches, not just the first?</>,
              options: ['i', 'm', 'g', 's'],
              answer: 2,
              explain: 'The global flag g returns every match.',
            },
            {
              q: <>How do you make <code>.*</code> match as little as possible?</>,
              options: ['Use .*+', 'Use .*?', 'Use .**', 'You cannot'],
              answer: 1,
              explain: 'Appending ? makes the quantifier lazy: .*?',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Regexes are patterns built from classes, quantifiers, anchors, and groups.</>,
            <>Flags change behavior: <code>g</code> all, <code>i</code> case-insensitive, <code>m</code> multiline.</>,
            <>Quantifiers are greedy by default; <code>?</code> makes them lazy.</>,
            <>Keep patterns simple to avoid catastrophic backtracking.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

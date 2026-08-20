import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { PatternsCatalog } from './PatternsCatalog.tsx'

export default function PatternsLesson() {
  return (
    <Lesson id="patterns">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Design patterns are named, reusable solutions to problems that come up
          again and again in object-oriented design. Learning them gives you a
          shared vocabulary ("let's put a Strategy here") and a toolbox of proven
          structures — so you're not reinventing the wheel or over-engineering.
        </p>
        <Callout kind="why" title="The one idea">
          A pattern is not code to copy — it's a <strong>design shape</strong> that
          recurs. Recognize the problem, apply the shape, adapt it to your context.
        </Callout>
      </Section>

      <Section id="model" title="Three categories">
        <ul className="prose-list">
          <li><strong>Creational</strong> — how objects get created (Singleton, Factory, Builder, …).</li>
          <li><strong>Structural</strong> — how objects are composed (Adapter, Decorator, Facade, Proxy, …).</li>
          <li><strong>Behavioral</strong> — how objects interact and share responsibility (Observer, Strategy, State, …).</li>
        </ul>
        <Callout kind="note">
          The classic 23 come from the "Gang of Four" book. The catalog below also
          includes patterns you'll hit daily in industry — Dependency Injection,
          Repository, MVC, and more.
        </Callout>
      </Section>

      <Section id="playground" title="The pattern catalog">
        <p className="prose">
          Filter by category or search, then expand a pattern to see its intent,
          when to use it, where it shows up in the real world, and a small runnable
          example. Hit <strong>Run example</strong> to execute it in your browser.
        </p>
        <PatternsCatalog />
        <TryThis>
          Open <strong>Strategy</strong> and run it, then <strong>Observer</strong>,
          then <strong>Dependency Injection</strong>. Notice how each is just a few
          lines — the value is the <em>shape</em>, not the size.
        </TryThis>
      </Section>

      <Section id="hood" title="Using patterns well">
        <UnderTheHood title="Patterns are a means, not a goal">
          <p className="prose">
            The most common misuse is forcing patterns where a plain function would
            do — "pattern soup" adds indirection without benefit. Apply a pattern
            when you feel the specific pain it solves (e.g. a growing if/else on type
            → Strategy or Polymorphism), not preemptively.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Many patterns are one idea: program to an interface">
          <p className="prose">
            Strategy, State, Bridge, Observer, and Dependency Injection all lean on
            the same principle — depend on an abstraction and swap implementations.
            Once you internalize that, most patterns feel like variations on a theme.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'design pattern', def: 'A named, reusable solution shape for a recurring design problem.' },
            { term: 'creational', def: 'Patterns about how objects are created.' },
            { term: 'structural', def: 'Patterns about how objects are composed.' },
            { term: 'behavioral', def: 'Patterns about how objects interact.' },
            { term: 'Gang of Four', def: 'The authors of the original 23-pattern catalog.' },
            { term: 'program to an interface', def: 'Depend on abstractions so implementations can be swapped.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'A growing if/else that branches on an object\'s type is a classic sign to use:',
              options: ['Singleton', 'Strategy or Polymorphism', 'Flyweight', 'Memento'],
              answer: 1,
              explain: 'Replacing type-branching with polymorphism/Strategy removes the conditional.',
            },
            {
              q: 'Which category does the Observer pattern belong to?',
              options: ['Creational', 'Structural', 'Behavioral', 'Industry'],
              answer: 2,
              explain: 'Observer is about interaction/notification — a behavioral pattern.',
            },
            {
              q: 'What is the main risk of overusing patterns?',
              options: ['Slower code', 'Needless indirection and complexity ("pattern soup")', 'Memory leaks', 'They are deprecated'],
              answer: 1,
              explain: 'Applied without a real problem, patterns add indirection without benefit.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Patterns are reusable <strong>design shapes</strong>, grouped into creational, structural, and behavioral.</>,
            <>The catalog covers all 23 Gang-of-Four patterns plus common industry ones.</>,
            <>Many reduce to "<strong>program to an interface</strong>" and swap implementations.</>,
            <>Apply a pattern when you feel its specific pain — avoid pattern soup.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

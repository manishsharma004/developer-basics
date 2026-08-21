import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { OopPlayground } from './OopPlayground.tsx'

const PILLARS = [
  { name: 'Encapsulation', desc: 'Bundle state with the methods that guard it; hide internals behind a clean interface.' },
  { name: 'Inheritance', desc: 'A subclass reuses and specializes a base class (an "is-a" relationship).' },
  { name: 'Polymorphism', desc: 'One interface, many implementations — call the same method on different types.' },
  { name: 'Abstraction', desc: 'Expose the essential concept; depend on interfaces, not concrete details.' },
]

const SOLID = [
  { k: 'S', name: 'Single Responsibility', desc: 'A class should have one reason to change.' },
  { k: 'O', name: 'Open/Closed', desc: 'Open for extension, closed for modification — add behavior without editing existing code.' },
  { k: 'L', name: 'Liskov Substitution', desc: 'Subtypes must be usable anywhere their base type is expected.' },
  { k: 'I', name: 'Interface Segregation', desc: 'Prefer many small, focused interfaces over one fat one.' },
  { k: 'D', name: 'Dependency Inversion', desc: 'Depend on abstractions, not concretions.' },
]

export default function OopLesson() {
  return (
    <Lesson id="oop">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Object-oriented programming is the dominant way large systems are
          structured. Used well, it makes code that models the problem domain and is
          easy to extend; used poorly, it becomes rigid and tangled. The difference
          is understanding the four pillars — and the SOLID principles that keep
          them healthy.
        </p>
        <Callout kind="why" title="The one idea">
          OOP organizes code around <strong>objects</strong> that combine state and
          behavior. Four pillars — encapsulation, inheritance, polymorphism,
          abstraction — are the tools; SOLID is how you wield them without making a
          mess.
        </Callout>
      </Section>

      <Section id="model" title="The four pillars">
        <div className="concept-grid">
          {PILLARS.map((p) => (
            <div key={p.name} className="concept">
              <h4>{p.name}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="playground" title="OOP in real code">
        <p className="prose">
          Each pillar as runnable Python. Pick a snippet and run it — then tweak it.
          Notice in <strong>Polymorphism</strong> there's no <code>if type ==</code>:
          the loop calls <code>area()</code> and each object does the right thing.
        </p>
        <OopPlayground />
        <TryThis>
          Run <strong>Inheritance</strong>, then add a <code>Cat(Animal)</code> whose{' '}
          <code>speak()</code> returns "meow" and create one. Then run{' '}
          <strong>Polymorphism</strong> and add a <code>Triangle</code> with its own{' '}
          <code>area()</code> to the list.
        </TryThis>
      </Section>

      <Section id="solid" title="The SOLID principles">
        <p className="prose">
          Five guidelines for object-oriented design that keep code flexible and
          testable as it grows:
        </p>
        <div className="solid-list">
          {SOLID.map((s) => (
            <div key={s.k} className="solid-item">
              <span className="solid-letter">{s.k}</span>
              <div>
                <div className="solid-name">{s.name}</div>
                <div className="solid-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <Callout kind="tip">
          The most impactful in practice is often <strong>Dependency Inversion</strong>:
          depend on an interface (like <code>Notifier</code>) so you can swap
          implementations and test with fakes.
        </Callout>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Composition over inheritance">
          <p className="prose">
            Deep inheritance trees become brittle — a change to a base class ripples
            everywhere. Modern guidance favors <strong>composition</strong>: build
            behavior by combining small objects (has-a) rather than inheriting from
            big base classes (is-a). Reach for inheritance for genuine "is-a"
            relationships, and composition for reuse.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Duck typing">
          <p className="prose">
            In dynamic languages like Python, polymorphism doesn't require a shared
            base class — "if it has an <code>area()</code> method, it works." This{' '}
            <strong>duck typing</strong> is why the polymorphism example needs no
            common interface, though abstractions still help communicate intent.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'encapsulation', def: 'Bundling state with the methods that manage it; hiding internals.' },
            { term: 'inheritance', def: 'A subclass reusing/specializing a base class (is-a).' },
            { term: 'polymorphism', def: 'Calling one interface across many implementing types.' },
            { term: 'abstraction', def: 'Depending on an essential interface, not concrete details.' },
            { term: 'composition', def: 'Building behavior by combining objects (has-a).' },
            { term: 'SOLID', def: 'Five principles for maintainable OO design.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Iterating shapes and calling area() with no type checks demonstrates:',
              options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'],
              answer: 2,
              explain: 'One call site, many implementations behaving correctly — that is polymorphism.',
            },
            {
              q: 'Which SOLID principle says "depend on abstractions, not concretions"?',
              options: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Dependency Inversion'],
              answer: 3,
              explain: 'That is the Dependency Inversion principle (the D in SOLID).',
            },
            {
              q: 'Modern guidance often prefers composition over inheritance because:',
              options: ['It is faster', 'Deep inheritance trees become brittle and hard to change', 'Inheritance is deprecated', 'Composition uses less memory'],
              answer: 1,
              explain: 'Combining small objects avoids the fragility of deep base-class hierarchies.',
            },

            {
              q: 'Polymorphism lets you:',
              options: [
                'Hide all methods',
              'Call the same interface on different types',
              'Disable inheritance',
              'Remove GC',
              ],
              answer: 1,
              explain: 'Different classes implement the same method name with type-specific behavior.',
            },
            {
              q: 'Encapsulation hides:',
              options: [
                'The entire program',
              'Internal state behind a controlled interface',
              'All files',
              'Network ports',
              ],
              answer: 1,
              explain: 'Public methods expose behavior; internals stay private.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>OOP models systems as <strong>objects</strong> combining state and behavior.</>,
            <>The four pillars: <strong>encapsulation, inheritance, polymorphism, abstraction</strong>.</>,
            <><strong>SOLID</strong> keeps OO code flexible; Dependency Inversion is especially powerful.</>,
            <>Prefer <strong>composition</strong> over deep inheritance for reuse.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

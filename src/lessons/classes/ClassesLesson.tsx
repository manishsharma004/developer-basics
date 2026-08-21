import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ClassBuilder } from './ClassBuilder.tsx'

export default function ClassesLesson() {
  return (
    <Lesson id="classes">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Classes are the vocabulary of most large codebases. A class bundles data
          and the behavior that acts on it into one named concept — <code>User</code>,{' '}
          <code>Order</code>, <code>HttpClient</code> — so you can reason about the
          system in terms of things, not loose variables and functions.
        </p>
        <Callout kind="why" title="The one idea">
          A <strong>class</strong> is a blueprint; an <strong>object</strong> is a
          concrete instance built from it. Every object has its own copy of the{' '}
          <em>fields</em> (state) but shares the class's <em>methods</em> (behavior).
        </Callout>
      </Section>

      <Section id="model" title="Blueprints & instances">
        <ul className="prose-list">
          <li><strong>Class</strong> — the definition: what fields exist and what methods you can call.</li>
          <li><strong>Object / instance</strong> — a specific value made from the class, with its own field values.</li>
          <li><strong>Field (attribute)</strong> — a piece of per-object state, like a car's <code>speed</code>.</li>
          <li><strong>Method</strong> — a function that belongs to the class and usually acts on <code>self</code> (the object).</li>
          <li><strong>Constructor</strong> — the special method that initializes a new object's fields.</li>
        </ul>
      </Section>

      <Section id="playground" title="Make some objects">
        <p className="prose">
          The left panel is the class. On the right, create objects from it — each
          gets its own <code>speed</code>. Call <code>accelerate()</code> on one and
          notice the others are unaffected: same behavior, independent state.
        </p>
        <ClassBuilder />
        <TryThis>
          Create two or three cars, then <code>accelerate()</code> just one of them a
          few times. Each object tracks its own <code>speed</code> even though they
          all share the exact same method code from the class.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="State lives per-object; methods live once">
          <p className="prose">
            Each object stores only its own fields. The methods aren't copied into
            every object — they live on the class, and calling{' '}
            <code>car.accelerate()</code> passes that specific car in as{' '}
            <code>self</code>. That's why a million objects don't mean a million
            copies of the code.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Instance vs. class members">
          <p className="prose">
            A <strong>class variable</strong> is shared by every instance (e.g. a
            counter of how many exist); an <strong>instance variable</strong> is
            unique per object. Mixing them up — putting shared mutable state on the
            class by accident — is a classic bug.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'class', def: 'A blueprint defining fields and methods.' },
            { term: 'object / instance', def: 'A concrete value created from a class.' },
            { term: 'field / attribute', def: 'Per-object state stored on an instance.' },
            { term: 'method', def: 'A function defined on a class that acts on an object.' },
            { term: 'constructor', def: 'The method that initializes a new object (Python: __init__).' },
            { term: 'self / this', def: 'The reference to the current object inside a method.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'You call accelerate() on one car object. What happens to other car objects?',
              options: ['They all speed up', 'Only that object changes; others keep their own speed', 'They reset to zero', 'An error occurs'],
              answer: 1,
              explain: 'Fields are per-object, so mutating one object does not affect others.',
            },
            {
              q: 'Where do a class\'s methods live?',
              options: ['Copied into every object', 'On the class, shared by all instances', 'In the constructor only', 'In global scope'],
              answer: 1,
              explain: 'Methods live once on the class; the object is passed in as self/this when called.',
            },
            {
              q: 'What is the constructor\'s job?',
              options: ['Delete the object', 'Initialize a new object\'s fields', 'Compare two objects', 'Print the object'],
              answer: 1,
              explain: 'The constructor sets up the initial state of a newly created instance.',
            },

            {
              q: 'An instance attribute lives on:',
              options: [
                'The class only',
              'Each object separately',
              'The module',
              'DNS cache',
              ],
              answer: 1,
              explain: 'Instance attrs are per-object; class attrs are shared.',
            },
            {
              q: '`self` in Python methods refers to:',
              options: [
                'The parent class',
              'The current instance',
              'Global scope',
              'A keyword only in Java',
              ],
              answer: 1,
              explain: 'self is the instance receiving the method call.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A <strong>class</strong> is a blueprint; an <strong>object</strong> is an instance of it.</>,
            <>Fields are <strong>per-object</strong> state; methods are <strong>shared</strong> behavior.</>,
            <>The constructor initializes a new object's fields.</>,
            <>Keep shared mutable state off the class unless you mean it.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

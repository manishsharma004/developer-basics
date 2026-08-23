import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { EventLoopPlayground } from './EventLoopPlayground.tsx'

export default function JsFundamentalsLesson() {
  return (
    <Lesson id="js-fundamentals">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          React, the browser APIs, and most frontend tooling are JavaScript. Before hooks
          and components click, you need the language: values, functions, promises, the
          event loop, and how the DOM connects to your code.
        </p>
        <Callout kind="why" title="The one idea">
          JavaScript is <strong>single-threaded</strong> but <strong>non-blocking</strong>:
          long work is split via the event loop, callbacks, and promises.
        </Callout>
      </Section>

      <Section id="model" title="Core concepts">
        <ul className="prose-list">
          <li><strong>const / let</strong> — block-scoped bindings; prefer <code>const</code> unless you reassign.</li>
          <li><strong>Functions & closures</strong> — functions capture variables from outer scopes.</li>
          <li><strong>Promises</strong> — represent async work; <code>async/await</code> is syntactic sugar.</li>
          <li><strong>ES modules</strong> — <code>import</code>/<code>export</code> for shared code between files.</li>
          <li><strong>DOM</strong> — the tree of elements the browser renders; JS can query and mutate it.</li>
        </ul>
      </Section>

      <Section id="playground" title="Watch the event loop">
        <p className="prose">
          The event loop decides what runs next: synchronous code first, then all
          microtasks, then one macrotask. This is why <code>Promise.then</code> often
          runs before <code>setTimeout(0)</code>.
        </p>
        <EventLoopPlayground />
        <TryThis>
          Queue a setTimeout, then a Promise, then click <strong>Run one tick</strong> twice.
          Notice microtasks drain before macrotasks.
        </TryThis>
      </Section>

      <Section id="dom" title="DOM basics">
        <p className="prose">
          <code>document.querySelector</code> finds elements; <code>addEventListener</code>{' '}
          wires user input. React abstracts this, but DevTools still shows the real DOM tree.
        </p>
        <Callout kind="tip">
          In modern apps you rarely call the DOM API directly — but understanding it explains
          what React is doing when it reconciles the virtual DOM.
        </Callout>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Microtasks vs macrotasks">
          <p className="prose">
            Microtasks (Promise callbacks, <code>queueMicrotask</code>) run after the current
            call stack clears but before painting. Macrotasks (<code>setTimeout</code>, I/O,
            UI events) run one at a time between renders.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'event loop', def: 'Mechanism that processes the call stack and task queues.' },
          { term: 'closure', def: 'A function that remembers variables from its creation scope.' },
          { term: 'Promise', def: 'Object representing eventual completion of async work.' },
          { term: 'DOM', def: 'Document Object Model — the tree of HTML elements in the page.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'Which runs first after sync code finishes?', options: ['setTimeout', 'Promise.then callback', 'requestAnimationFrame always', 'None'], answer: 1, explain: 'Microtasks drain before the next macrotask.' },
          { q: 'const x = { a: 1 }; const y = x; y.a = 2; x.a is:', options: ['1', '2', 'undefined', 'Error'], answer: 1, explain: 'Objects are assigned by reference — x and y point to the same object.' },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>JS runs on one thread; async work uses queues and the event loop.</>,
          <>Promises/microtasks run before setTimeout/macrotasks.</>,
          <>Modules split code across files; the DOM is the browser's element tree.</>,
        ]} />
      </Section>
    </Lesson>
  )
}

import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ReactPlayground } from './ReactPlayground.tsx'
import { ReactStorePlayground } from './ReactStorePlayground.tsx'

export default function ReactLesson() {
  return (
    <Lesson id="react">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Modern web UIs are complex: dozens of interactive pieces that must stay in sync
          as data changes. <strong>React</strong> is a library for building user interfaces
          by composing <strong>components</strong> — reusable functions that describe what
          the UI should look like for a given state.
        </p>
        <Callout kind="why" title="The one idea">
          UI = <strong>f(state)</strong>. You describe what to render for the current
          state; when state changes, React updates the DOM efficiently.
        </Callout>
      </Section>

      <Section id="components" title="Components & JSX">
        <p className="prose">
          A React component is a function that returns <strong>JSX</strong> — HTML-like
          syntax that compiles to JavaScript function calls. Components nest like HTML tags:
        </p>
        <pre className="term-output">{`function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <UserCard name="Ada" />
    </main>
  )
}`}</pre>
        <ul className="prose-list">
          <li>One component per file is common; name components with PascalCase.</li>
          <li>JSX must have one root element (or a <code>&lt;&gt;fragment&lt;/&gt;</code>).</li>
          <li>Use <code>{'{'}</code> curly braces <code>{'}'}</code> to embed JavaScript expressions.</li>
          <li><code>className</code> instead of <code>class</code>; <code>htmlFor</code> instead of <code>for</code>.</li>
        </ul>
      </Section>

      <Section id="props" title="Props: data flows down">
        <p className="prose">
          <strong>Props</strong> (properties) are read-only inputs from a parent component.
          They let you reuse the same component with different data — like function arguments
          for UI.
        </p>
        <pre className="term-output">{`function Badge({ label, color }) {
  return <span style={{ background: color }}>{label}</span>
}

// Parent passes props:
<Badge label="New" color="#34d399" />`}</pre>
        <Callout kind="warning" title="Props are immutable">
          A child must never mutate its props. If something needs to change, lift state up
          to a parent and pass new props down — or use local state in the child.
        </Callout>
      </Section>

      <Section id="state" title="State with useState">
        <p className="prose">
          When a component needs to remember something between renders — a counter, form
          input, open/closed toggle — use the <code>useState</code> hook:
        </p>
        <pre className="term-output">{`import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
  <button onClick={() => setCount(count + 1)}>
    Count: {count}
  </button>
  )
}`}</pre>
        <ul className="prose-list">
          <li><code>useState(initial)</code> returns <code>[value, setter]</code>.</li>
          <li>Always update state with the setter — never mutate the value directly.</li>
          <li>For objects/arrays, create a new copy: <code>setUser({'{'} ...user, name: 'Ada' {'}'})</code>.</li>
          <li>Functional updates <code>setCount(c =&gt; c + 1)</code> are safe when the new value depends on the old.</li>
        </ul>
      </Section>

      <Section id="effects" title="Side effects with useEffect">
        <p className="prose">
          Rendering should be pure — same state, same output. When you need to{' '}
          <em>do</em> something after render (fetch data, subscribe, sync document title),
          use <code>useEffect</code>:
        </p>
        <pre className="term-output">{`useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])   // re-run when count changes

useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)   // cleanup on unmount
}, [])`}</pre>
        <Callout kind="tip" title="Dependency array">
          The second argument lists values the effect depends on. Omit it and the effect
          runs after every render; pass <code>[]</code> to run once on mount.
        </Callout>
      </Section>

      <Section id="stores" title="Global state & stores">
        <p className="prose">
          <code>useState</code> works for local UI state, but what when many distant
          components need the same data — logged-in user, theme, shopping cart? Passing
          props through every layer is <strong>prop drilling</strong>. React offers
          several patterns to share state globally.
        </p>
        <ul className="prose-list">
          <li>
            <strong>Lift state up</strong> — move shared state to the nearest common
            ancestor and pass props down. Simple, but gets awkward deep in the tree.
          </li>
          <li>
            <strong>Context</strong> — <code>createContext</code> + <code>Provider</code>{' '}
            lets descendants read/write shared values without intermediate props.
          </li>
          <li>
            <strong>External stores</strong> — Zustand, Redux, Jotai keep state outside
            the component tree; components <em>subscribe</em> to slices they need.
          </li>
        </ul>
        <pre className="term-output">{`// Context: good for theme, locale, auth user
const ThemeContext = createContext('light')

function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  )
}

// Zustand-style store (simplified)
const useCartStore = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}))`}</pre>
        <ReactStorePlayground />
        <Callout kind="tip" title="When to use what">
          Keep state local until you need to share it. Context fits infrequently-changing
          global data (user, theme). Stores fit frequently-updated shared state (cart,
          notifications) or complex update logic. Server state often belongs in TanStack
          Query, not a client store.
        </Callout>
        <UnderTheHood title="Redux in one sentence">
          <p className="prose">
            Redux keeps one immutable state tree, dispatches <strong>actions</strong> to
            describe what happened, and <strong>reducers</strong> compute the next state.
            Redux Toolkit is the modern standard — less boilerplate, same predictable
            data flow. Zustand is lighter when you don't need middleware or time-travel
            debugging.
          </p>
        </UnderTheHood>
        <TryThis>
          Change the profile name and role — watch Header and Sidebar update together.
          Add items to the cart from Cart store and see Cart badge update without passing
          props between them.
        </TryThis>
      </Section>

      <Section id="playground" title="Build UI live">
        <p className="prose">
          Try the counter, edit props on the greeting card, and manage a todo list — each
          demo maps directly to the concepts above.
        </p>
        <ReactPlayground />
        <TryThis>
          Increment the counter, then change the <code>name</code> prop — notice the counter
          state persists while props update independently. Add a todo and toggle checkboxes;
          each toggle creates a new array (immutable update).
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Virtual DOM & reconciliation">
          <p className="prose">
            React keeps a lightweight copy of the UI tree in memory. When state changes, it
            builds a new tree, <strong>diffs</strong> it against the previous one, and
            applies the smallest set of DOM updates. That's why you can re-render whole
            subtrees without rewriting manual DOM code.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Hooks rules">
          <p className="prose">
            Hooks (useState, useEffect, etc.) must be called at the top level of a component
            — not inside loops, conditions, or nested functions. React relies on call order
            to associate state with the right component instance.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Ecosystem">
          <p className="prose">
            React is the view layer. Real apps add a router (React Router), data fetching
            (TanStack Query), forms, and often TypeScript. Build tools like Vite compile
            JSX and bundle modules for the browser.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'component', def: 'A reusable function (or class) that returns UI.' },
            { term: 'JSX', def: 'Syntax that looks like HTML but compiles to React.createElement calls.' },
            { term: 'props', def: 'Read-only inputs passed from parent to child.' },
            { term: 'state', def: 'Mutable data owned by a component; changing it triggers a re-render.' },
            { term: 'hook', def: 'A function like useState or useEffect that taps into React features.' },
            { term: 'reconciliation', def: "React's process of diffing trees and updating the real DOM." },
            { term: 'virtual DOM', def: 'An in-memory representation of the UI used for efficient updates.' },
            { term: 'prop drilling', def: 'Passing props through many layers just to reach a deep child.' },
            { term: 'Context', def: 'A way to provide values to descendants without intermediate props.' },
            { term: 'store', def: 'External state container components subscribe to (Redux, Zustand).' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What does a React component return?',
              options: ['A database query', 'JSX describing the UI', 'A CSS file', 'An HTTP response'],
              answer: 1,
            },
            {
              q: 'Props in a child component should be treated as:',
              options: ['Mutable local variables', 'Read-only inputs from the parent', 'Global state', 'Optional only in TypeScript'],
              answer: 1,
            },
            {
              q: 'Calling setCount(count + 1) after a click will:',
              options: ['Mutate the DOM directly', 'Schedule a re-render with the new count', 'Reload the page', 'Run useEffect only'],
              answer: 1,
            },
            {
              q: 'Why use key={todo.id} in a list?',
              options: ['For CSS styling', 'So React can match items across re-renders', 'To encrypt data', 'It is optional always'],
              answer: 1,
            },
            {
              q: 'useEffect(() => {...}, []) runs:',
              options: ['Every render', 'Once after the first render (mount)', 'Never', 'Only on unmount'],
              answer: 1,
            },
            {
              q: 'UI = f(state) means:',
              options: ['State is stored in the DOM', 'The UI is derived from current state', 'Functions cannot have state', 'CSS controls all state'],
              answer: 1,
            },
            {
              q: 'Context is best for:',
              options: ['Replacing all useState calls', 'Sharing values like user/theme without prop drilling', 'Database connections', 'CSS modules'],
              answer: 1,
            },
            {
              q: 'A global store (Redux/Zustand) helps when:',
              options: ['Only one component needs the data', 'Many components need the same frequently-updated state', 'You never re-render', 'You want to avoid JavaScript'],
              answer: 1,
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Components are functions that return <strong>JSX</strong>; compose them like HTML.</>,
            <><strong>Props</strong> flow down (read-only); <strong>state</strong> is local and triggers re-renders.</>,
            <><code>useState</code> for memory; <code>useEffect</code> for side effects after render.</>,
            <><strong>Context</strong> and <strong>stores</strong> share state without prop drilling.</>,
            <>React diffs a <strong>virtual DOM</strong> to update the real page efficiently.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

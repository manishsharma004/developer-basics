import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { CounterDemo, PropsDemo, ListsDemo } from './ReactPlayground.tsx'
import { ContextStoreDemo, ExternalStoreDemo } from './ReactStorePlayground.tsx'

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

      <Section id="jsx-basics" title="Components & JSX">
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
          <li>Compose small components into pages — each owns a slice of the UI.</li>
          <li>Export the root component; import it where you mount the app.</li>
        </ul>
      </Section>

      <Section id="jsx-rules" title="JSX syntax rules">
        <p className="prose">
          JSX looks like HTML but follows JavaScript rules. These differences trip up
          beginners — memorize them early.
        </p>
        <ul className="prose-list">
          <li>JSX must have one root element (or a <code>&lt;&gt;fragment&lt;/&gt;</code>).</li>
          <li>Use <code>{'{'}</code> curly braces <code>{'}'}</code> to embed JavaScript expressions.</li>
          <li><code>className</code> instead of <code>class</code>; <code>htmlFor</code> instead of <code>for</code>.</li>
          <li>Self-close empty tags: <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code>.</li>
          <li>Boolean props can be shorthand: <code>&lt;input disabled /&gt;</code>.</li>
        </ul>
        <Callout kind="tip" title="Expressions only">
          Curly braces accept expressions, not statements — use a ternary or move logic
          above the return instead of an <code>if</code> block inline.
        </Callout>
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

      <Section id="events" title="Event handlers">
        <p className="prose">
          User interactions — clicks, typing, form submit — attach with camelCase props like{' '}
          <code>onClick</code> and <code>onChange</code>. Pass a function reference or
          arrow function; React calls it with a synthetic event.
        </p>
        <pre className="term-output">{`<button onClick={() => setCount(c => c + 1)}>+</button>

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`}</pre>
        <ul className="prose-list">
          <li>Handlers run in JavaScript — call <code>setState</code> to trigger a re-render.</li>
          <li>Prevent default form submit with <code>e.preventDefault()</code> when needed.</li>
          <li>Don't call the handler during render: <code>onClick={'{handleClick}'}</code>, not <code>onClick={'{handleClick()}'}</code>.</li>
        </ul>
      </Section>

      <Section id="lists" title="Lists & keys">
        <p className="prose">
          Render collections with <code>.map()</code>. Each child needs a stable{' '}
          <code>key</code> so React can match items across re-renders when order changes.
        </p>
        <pre className="term-output">{`{todos.map(todo => (
  <TodoItem
    key={todo.id}
    text={todo.text}
    done={todo.done}
    onToggle={() => toggle(todo.id)}
  />
))}`}</pre>
        <ul className="prose-list">
          <li>Use a unique id from your data — not array index if items can reorder or delete.</li>
          <li>Toggle or edit by mapping to a new array: <code>setTodos(t =&gt; t.map(...))</code>.</li>
          <li>Adding items: spread into a new array <code>[...todos, newItem]</code>.</li>
        </ul>
        <Callout kind="warning" title="Never mutate in place">
          <code>todos[0].done = true</code> won't trigger a re-render. Always return new
          objects/arrays from your setter.
        </Callout>
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

      <Section id="store-lift" title="Prop drilling & lifting state">
        <p className="prose">
          <code>useState</code> works for local UI state, but when many distant
          components need the same data — logged-in user, theme, shopping cart —
          passing props through every intermediate layer is <strong>prop drilling</strong>.
        </p>
        <ul className="prose-list">
          <li>
            <strong>Lift state up</strong> — move shared state to the nearest common
            ancestor and pass props down. Simple for shallow trees.
          </li>
          <li>
            As the tree deepens, you pass the same props through components that
            don't use them — just to reach one grandchild.
          </li>
          <li>
            The fix: share state via <strong>Context</strong> or an external{' '}
            <strong>store</strong> instead of threading props.
          </li>
        </ul>
        <Callout kind="note" title="Start local">
          Keep state in the component that owns it until a second branch genuinely
          needs the same value — then lift or introduce shared state.
        </Callout>
      </Section>

      <Section id="store-context" title="Context API">
        <p className="prose">
          <strong>Context</strong> lets you provide a value at the top of a subtree
          and read it anywhere below — no intermediate props required.
        </p>
        <pre className="term-output">{`const UserContext = createContext(null)

function App() {
  const [user, setUser] = useState({ name: 'Ada', role: 'admin' })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />    {/* reads user via useContext */}
      <Sidebar />   {/* same — no props passed down */}
    </UserContext.Provider>
  )
}`}</pre>
        <ContextStoreDemo />
        <TryThis>
          Edit the profile name and role — Header and Sidebar update together without
          any props between them.
        </TryThis>
        <Callout kind="tip" title="Good for">
          Infrequently-changing global data: current user, theme, locale, feature flags.
          Avoid putting fast-updating values in Context — every consumer re-renders.
        </Callout>
      </Section>

      <Section id="store-external" title="External stores (Zustand / Redux)">
        <p className="prose">
          <strong>External stores</strong> keep state outside the React tree. Components{' '}
          <em>subscribe</em> to the slices they need — Zustand and Redux are the most
          common libraries.
        </p>
        <pre className="term-output">{`// Zustand (minimal API)
const useCartStore = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}))

// Redux Toolkit: actions + reducers + one store
dispatch(addItem({ id: 1, name: 'Keyboard' }))`}</pre>
        <ExternalStoreDemo />
        <UnderTheHood title="Redux vs Zustand">
          <p className="prose">
            <strong>Redux</strong> keeps one immutable state tree; actions describe
            events, reducers compute the next state. Great for large apps with complex
            update logic and devtools. <strong>Zustand</strong> is lighter — a hook per
            store, less boilerplate, fine for most medium apps.
          </p>
        </UnderTheHood>
        <TryThis>
          Add cart items and watch the badge count update. The cart lives outside any
          single component — both Cart badge and Cart panel subscribe to the same store.
        </TryThis>
        <Callout kind="tip" title="Server state">
          Data from APIs (users list, product catalog) often belongs in{' '}
          <strong>TanStack Query</strong>, not a client store — it handles caching,
          refetching, and stale data for you.
        </Callout>
      </Section>

      <Section id="lab-counter" title="Lab: counter & state">
        <p className="prose">
          Click the buttons and watch count update — each click calls{' '}
          <code>setCount</code>, which schedules a re-render with the new value.
        </p>
        <CounterDemo />
        <TryThis>
          Use the functional form <code>setCount(c =&gt; c + 1)</code> — it always reads
          the latest count, even when several updates batch together.
        </TryThis>
      </Section>

      <Section id="lab-props" title="Lab: props playground">
        <p className="prose">
          Edit the inputs below — the Greeting card receives new props from its parent
          but keeps no state of its own.
        </p>
        <PropsDemo />
        <TryThis>
          Change <code>name</code> and <code>role</code> — the child re-renders with
          new props while sibling state (if any) stays independent.
        </TryThis>
      </Section>

      <Section id="lab-lists" title="Lab: todo list">
        <p className="prose">
          Add todos and toggle checkboxes — each toggle maps to a new array so React
          detects the change and re-renders the list.
        </p>
        <ListsDemo />
        <TryThis>
          Add a todo, toggle it done, then add another — notice each row keeps a stable{' '}
          <code>key</code> from <code>todo.id</code>.
        </TryThis>
      </Section>

      <Section id="hood-vdom" title="Virtual DOM & reconciliation">
        <UnderTheHood title="Virtual DOM & reconciliation">
          <p className="prose">
            React keeps a lightweight copy of the UI tree in memory. When state changes, it
            builds a new tree, <strong>diffs</strong> it against the previous one, and
            applies the smallest set of DOM updates. That's why you can re-render whole
            subtrees without rewriting manual DOM code.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="hood-hooks" title="Rules of hooks">
        <UnderTheHood title="Hooks rules">
          <p className="prose">
            Hooks (useState, useEffect, etc.) must be called at the top level of a component
            — not inside loops, conditions, or nested functions. React relies on call order
            to associate state with the right component instance.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="hood-stack" title="React ecosystem">
        <UnderTheHood title="Ecosystem">
          <p className="prose">
            React is the view layer. Real apps add a router (React Router), data fetching
            (TanStack Query), forms, and often TypeScript. Build tools like Vite compile
            JSX and bundle modules for the browser. Pair with a FastAPI backend for JSON APIs.
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
            { term: 'key', def: 'Stable identifier on list items so React matches elements across renders.' },
            { term: 'synthetic event', def: "React's normalized wrapper around browser events." },
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
            {
              q: 'onClick={handleClick()} is wrong because:',
              options: ['Events use onPress not onClick', 'It calls the handler during render instead of on click', 'Handlers must be async', 'React has no click events'],
              answer: 1,
            },
            {
              q: 'Updating an array in state correctly looks like:',
              options: ['items.push(x); setItems(items)', 'setItems([...items, x])', 'items[0] = x', 'delete items[0]'],
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
            <><strong>Events</strong> call setters; <strong>lists</strong> need stable <code>key</code>s and immutable updates.</>,
            <><strong>Context</strong> and <strong>stores</strong> share state without prop drilling.</>,
            <>React diffs a <strong>virtual DOM</strong> to update the real page efficiently.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}

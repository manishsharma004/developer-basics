import type { ComponentType } from 'react'
import { createChapterLesson } from '../components/ChapterLesson.tsx'
import { Callout, CodePreview, UnderTheHood, TryThis } from '../components/blocks.tsx'
import { CounterDemo, PropsDemo, ListsDemo } from './ReactPlayground.tsx'
import {
  EventsDemo,
  EffectsDemo,
  LiftStateDemo,
  JsxRulesDemo,
  VdomDiffDemo,
  HooksRulesDemo,
  EcosystemMap,
} from './ReactConceptDemos.tsx'
import { ContextStoreDemo, ExternalStoreDemo } from './ReactStorePlayground.tsx'
import {
  PropDrillingViz,
  ThemeContextDemo,
  ContextReducerDemo,
  ContextRerenderDemo,
  StateChooserSim,
  ReduxFlowDemo,
  ZustandSelectorDemo,
} from './ReactStoreDemos.tsx'

export const REACT_CHAPTERS: Record<string, ComponentType> = {
  'react-intro': createChapterLesson({
    id: 'react-intro',
    modelTitle: 'UI as a function of state',
    intro: (
      <>
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
      </>
    ),
    model: (
      <>
        <p className="prose">
          Instead of manually finding and updating DOM nodes, you declare the UI for each
          possible state. React compares the new description to the previous one and applies
          only the minimal DOM changes needed.
        </p>
        <ul className="prose-list">
          <li>Components are the building blocks — small, reusable, composable.</li>
          <li>State drives what renders; events update state, which triggers a fresh render.</li>
          <li>The same mental model scales from a single button to an entire dashboard.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <CounterDemo />
        <TryThis>
          Click + and − — each click updates state and React re-renders the UI. That&apos;s{' '}
          <strong>UI = f(state)</strong> in action.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'component', def: 'A reusable function (or class) that returns UI.' },
      { term: 'state', def: 'Mutable data owned by a component; changing it triggers a re-render.' },
      { term: 'virtual DOM', def: 'An in-memory representation of the UI used for efficient updates.' },
    ],
    quiz: [
      {
        q: 'UI = f(state) means:',
        options: ['State is stored in the DOM', 'The UI is derived from current state', 'Functions cannot have state', 'CSS controls all state'],
        answer: 1,
      },
      {
        q: 'What does a React component return?',
        options: ['A database query', 'JSX describing the UI', 'A CSS file', 'An HTTP response'],
        answer: 1,
      },
      {
        q: 'When state changes in React, what happens next?',
        options: ['The page reloads', 'React re-renders and updates the DOM efficiently', 'CSS variables update automatically', 'Nothing until you call document.write'],
        answer: 1,
      },
    ],
    recap: [
      <>React builds UIs by composing <strong>components</strong> — functions that return JSX.</>,
      <>The core idea: <strong>UI = f(state)</strong> — describe the UI for current state; React handles DOM updates.</>,
      <>State changes trigger re-renders; you rarely touch the DOM directly.</>,
    ],
  }),

  'react-jsx-basics': createChapterLesson({
    id: 'react-jsx-basics',
    modelTitle: 'Components & JSX',
    intro: (
      <p className="prose">
        React components are just functions (or classes) that return a description of UI.
        You write that description in <strong>JSX</strong> — HTML-like syntax that compiles
        to JavaScript — and nest components like HTML tags to build pages.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          A React component is a function that returns <strong>JSX</strong> — HTML-like
          syntax that compiles to JavaScript function calls. Components nest like HTML tags:
        </p>
        <CodePreview
          language="javascript"
          code={`function App() {
  return (
    <main>
      <h1>Dashboard</h1>
      <UserCard name="Ada" />
    </main>
  )
}`}
        />
        <ul className="prose-list">
          <li>One component per file is common; name components with PascalCase.</li>
          <li>Compose small components into pages — each owns a slice of the UI.</li>
          <li>Export the root component; import it where you mount the app.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <PropsDemo />
        <TryThis>
          Edit <code>name</code> and <code>role</code> — the Greeting card is a child component
          that re-renders when its parent passes new props.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'component', def: 'A reusable function (or class) that returns UI.' },
      { term: 'JSX', def: 'Syntax that looks like HTML but compiles to React.createElement calls.' },
    ],
    quiz: [
      {
        q: 'What does a React component return?',
        options: ['A database query', 'JSX describing the UI', 'A CSS file', 'An HTTP response'],
        answer: 1,
      },
      {
        q: 'React component names should use:',
        options: ['snake_case', 'PascalCase', 'ALL CAPS', 'kebab-case in JSX only'],
        answer: 1,
      },
      {
        q: 'JSX compiles to:',
        options: ['Raw HTML strings', 'React.createElement function calls', 'CSS modules', 'SQL queries'],
        answer: 1,
      },
    ],
    recap: [
      <>A component is a function that returns <strong>JSX</strong> describing the UI.</>,
      <>Name components with <strong>PascalCase</strong> and compose them like HTML tags.</>,
      <>Keep components small; each should own one slice of the interface.</>,
    ],
  }),

  'react-jsx-rules': createChapterLesson({
    id: 'react-jsx-rules',
    modelTitle: 'JSX syntax rules',
    intro: (
      <p className="prose">
        JSX looks like HTML but follows JavaScript rules. These differences trip up
        beginners — learn them early and you will avoid most syntax errors.
      </p>
    ),
    model: (
      <>
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
      </>
    ),
    playground: (
      <>
        <JsxRulesDemo />
        <TryThis>
          Toggle <strong>Broken</strong> vs <strong>Fixed</strong> — compare{' '}
          <code>className</code>, expression-only braces, and self-closing tags.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'JSX', def: 'Syntax that looks like HTML but compiles to React.createElement calls.' },
      { term: 'fragment', def: 'A wrapper (<></>) that groups children without adding a DOM node.' },
    ],
    quiz: [
      {
        q: 'In JSX you write className instead of class because:',
        options: ['CSS requires it', 'class is a reserved JavaScript keyword', 'React does not support CSS', 'HTML changed the attribute name'],
        answer: 1,
      },
      {
        q: 'Curly braces in JSX accept:',
        options: ['Full if/else statements', 'JavaScript expressions', 'Only string literals', 'Import statements'],
        answer: 1,
      },
      {
        q: 'An empty <input> tag in JSX must be:',
        options: ['Wrapped in a div', 'Self-closed with />', 'Written as <input></input> only', 'Omitted entirely'],
        answer: 1,
      },
    ],
    recap: [
      <>Use <code>className</code> and <code>htmlFor</code> — not HTML&apos;s <code>class</code> and <code>for</code>.</>,
      <>Embed JavaScript with <code>{'{'}</code> curly braces <code>{'}'}</code>; expressions only, not statements.</>,
      <>Wrap multiple siblings in one root element or a <strong>fragment</strong>.</>,
    ],
  }),

  'react-props': createChapterLesson({
    id: 'react-props',
    modelTitle: 'Props: data flows down',
    intro: (
      <p className="prose">
        Components become reusable when you pass different data into the same template.
        <strong> Props</strong> are how a parent configures a child — like function arguments for UI.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          <strong>Props</strong> (properties) are read-only inputs from a parent component.
          They let you reuse the same component with different data — like function arguments
          for UI.
        </p>
        <CodePreview
          language="javascript"
          code={`function Badge({ label, color }) {
  return <span style={{ background: color }}>{label}</span>
}

// Parent passes props:
<Badge label="New" color="#34d399" />`}
        />
        <Callout kind="warning" title="Props are immutable">
          A child must never mutate its props. If something needs to change, lift state up
          to a parent and pass new props down — or use local state in the child.
        </Callout>
      </>
    ),
    playground: (
      <>
        <PropsDemo />
        <TryThis>
          Change <code>name</code> and <code>role</code> — the child re-renders with
          new props while sibling state (if any) stays independent.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'props', def: 'Read-only inputs passed from parent to child.' },
      { term: 'prop drilling', def: 'Passing props through many layers just to reach a deep child.' },
    ],
    quiz: [
      {
        q: 'Props in a child component should be treated as:',
        options: ['Mutable local variables', 'Read-only inputs from the parent', 'Global state', 'Optional only in TypeScript'],
        answer: 1,
      },
      {
        q: 'If a child needs to change data originally from the parent, you should:',
        options: ['Mutate the prop directly', 'Lift state up or use local state', 'Delete the prop', 'Use innerHTML'],
        answer: 1,
      },
      {
        q: 'Props flow:',
        options: ['Up from child to parent', 'Down from parent to child', 'Sideways between siblings only', 'From the DOM into React'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>Props</strong> are read-only inputs — the parent owns the data; the child renders it.</>,
      <>Never mutate props inside a child; call a parent callback or use local state instead.</>,
      <>Data flows <strong>down</strong> the component tree via props.</>,
    ],
  }),

  'react-state': createChapterLesson({
    id: 'react-state',
    modelTitle: 'State with useState',
    intro: (
      <p className="prose">
        Props configure a component from outside; <strong>state</strong> is memory the
        component owns between renders — counters, form values, open/closed toggles, and more.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          When a component needs to remember something between renders — a counter, form
          input, open/closed toggle — use the <code>useState</code> hook:
        </p>
        <CodePreview
          language="javascript"
          code={`import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}`}
        />
        <ul className="prose-list">
          <li><code>useState(initial)</code> returns <code>[value, setter]</code>.</li>
          <li>Always update state with the setter — never mutate the value directly.</li>
          <li>For objects/arrays, create a new copy: <code>setUser({'{'} ...user, name: 'Ada' {'}'})</code>.</li>
          <li>Functional updates <code>setCount(c =&gt; c + 1)</code> are safe when the new value depends on the old.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <CounterDemo />
        <TryThis>
          Use the functional form <code>setCount(c =&gt; c + 1)</code> — it always reads
          the latest count, even when several updates batch together.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'state', def: 'Mutable data owned by a component; changing it triggers a re-render.' },
      { term: 'hook', def: 'A function like useState or useEffect that taps into React features.' },
    ],
    quiz: [
      {
        q: 'useState returns:',
        options: ['A single number', 'An array [value, setter]', 'A Promise', 'The DOM node'],
        answer: 1,
      },
      {
        q: 'Calling setCount(count + 1) after a click will:',
        options: ['Mutate the DOM directly', 'Schedule a re-render with the new count', 'Reload the page', 'Run useEffect only'],
        answer: 1,
      },
      {
        q: 'Updating an array in state correctly looks like:',
        options: ['items.push(x); setItems(items)', 'setItems([...items, x])', 'items[0] = x', 'delete items[0]'],
        answer: 1,
      },
    ],
    recap: [
      <><code>useState</code> returns <code>[value, setter]</code> — always update via the setter.</>,
      <>Never mutate state directly; create new objects/arrays when updating complex values.</>,
      <>Use functional updates <code>setCount(c =&gt; c + 1)</code> when the new value depends on the old.</>,
    ],
  }),

  'react-events': createChapterLesson({
    id: 'react-events',
    modelTitle: 'Event handlers',
    intro: (
      <p className="prose">
        Interactive UIs respond to clicks, typing, and form submissions. React attaches
        handlers with camelCase props like <code>onClick</code> and <code>onChange</code>.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          User interactions — clicks, typing, form submit — attach with camelCase props like{' '}
          <code>onClick</code> and <code>onChange</code>. Pass a function reference or
          arrow function; React calls it with a synthetic event.
        </p>
        <CodePreview
          language="javascript"
          code={`<button onClick={() => setCount(c => c + 1)}>+</button>

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`}
        />
        <ul className="prose-list">
          <li>Handlers run in JavaScript — call <code>setState</code> to trigger a re-render.</li>
          <li>Prevent default form submit with <code>e.preventDefault()</code> when needed.</li>
          <li>Don&apos;t call the handler during render: <code>onClick={'{handleClick}'}</code>, not <code>onClick={'{handleClick()}'}</code>.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <EventsDemo />
        <TryThis>
          Type in the name field and click the button — watch the log show handlers calling
          setters and React re-rendering.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'synthetic event', def: "React's normalized wrapper around browser events." },
      { term: 'handler', def: 'A function React calls when the user triggers an event.' },
    ],
    quiz: [
      {
        q: 'onClick={handleClick()} is wrong because:',
        options: ['Events use onPress not onClick', 'It calls the handler during render instead of on click', 'Handlers must be async', 'React has no click events'],
        answer: 1,
      },
      {
        q: 'To update state from an input field you typically use:',
        options: ['onClick', 'onChange with e.target.value', 'onLoad', 'dangerouslySetInnerHTML'],
        answer: 1,
      },
      {
        q: 'React event prop names use:',
        options: ['lowercase like onclick', 'camelCase like onClick', 'SCREAMING_SNAKE_CASE', 'PascalCase like OnClick'],
        answer: 1,
      },
    ],
    recap: [
      <>Pass a <strong>function reference</strong> to event props — <code>onClick={'{handleClick}'}</code>, not <code>onClick={'{handleClick()}'}</code>.</>,
      <>Handlers call setters to update state and trigger a re-render.</>,
      <>Use <code>e.preventDefault()</code> when you need to stop default browser behavior.</>,
    ],
  }),

  'react-lists': createChapterLesson({
    id: 'react-lists',
    modelTitle: 'Lists & keys',
    intro: (
      <p className="prose">
        Most UIs render collections — todo items, messages, table rows. React lists are built
        with <code>.map()</code>, and each item needs a stable <code>key</code>.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Render collections with <code>.map()</code>. Each child needs a stable{' '}
          <code>key</code> so React can match items across re-renders when order changes.
        </p>
        <CodePreview
          language="javascript"
          code={`{todos.map(todo => (
  <TodoItem
    key={todo.id}
    text={todo.text}
    done={todo.done}
    onToggle={() => toggle(todo.id)}
  />
))}`}
        />
        <ul className="prose-list">
          <li>Use a unique id from your data — not array index if items can reorder or delete.</li>
          <li>Toggle or edit by mapping to a new array: <code>setTodos(t =&gt; t.map(...))</code>.</li>
          <li>Adding items: spread into a new array <code>[...todos, newItem]</code>.</li>
        </ul>
        <Callout kind="warning" title="Never mutate in place">
          <code>todos[0].done = true</code> won&apos;t trigger a re-render. Always return new
          objects/arrays from your setter.
        </Callout>
      </>
    ),
    playground: (
      <>
        <ListsDemo />
        <TryThis>
          Add a todo, toggle it done, then add another — notice each row keeps a stable{' '}
          <code>key</code> from <code>todo.id</code>.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'key', def: 'Stable identifier on list items so React matches elements across renders.' },
      { term: 'immutable update', def: 'Creating a new array/object copy instead of mutating the existing one.' },
    ],
    quiz: [
      {
        q: 'Why use key={todo.id} in a list?',
        options: ['For CSS styling', 'So React can match items across re-renders', 'To encrypt data', 'It is optional always'],
        answer: 1,
      },
      {
        q: 'Updating an array in state correctly looks like:',
        options: ['items.push(x); setItems(items)', 'setItems([...items, x])', 'items[0] = x', 'delete items[0]'],
        answer: 1,
      },
      {
        q: 'Array index as key is risky when:',
        options: ['The list never changes', 'Items can reorder or be deleted', 'You use TypeScript', 'Items are strings'],
        answer: 1,
      },
    ],
    recap: [
      <>Render lists with <code>.map()</code>; give each row a stable <code>key</code> from your data.</>,
      <>Update lists immutably — <code>setTodos(t =&gt; t.map(...))</code>, never mutate in place.</>,
      <>Avoid array index as <code>key</code> when items can reorder or delete.</>,
    ],
  }),

  'react-effects': createChapterLesson({
    id: 'react-effects',
    modelTitle: 'Side effects with useEffect',
    intro: (
      <p className="prose">
        Rendering should be pure: same state, same output. When you need to fetch data,
        subscribe to events, or sync the document title after render, reach for{' '}
        <code>useEffect</code>.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Rendering should be pure — same state, same output. When you need to{' '}
          <em>do</em> something after render (fetch data, subscribe, sync document title),
          use <code>useEffect</code>:
        </p>
        <CodePreview
          language="javascript"
          code={`useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])   // re-run when count changes

useEffect(() => {
  const id = setInterval(tick, 1000)
  return () => clearInterval(id)   // cleanup on unmount
}, [])`}
        />
        <Callout kind="tip" title="Dependency array">
          The second argument lists values the effect depends on. Omit it and the effect
          runs after every render; pass <code>[]</code> to run once on mount.
        </Callout>
      </>
    ),
    playground: (
      <>
        <EffectsDemo />
        <TryThis>
          Toggle <strong>Sync on count change</strong> off — bumping count won&apos;t re-run
          the effect until you turn sync back on.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'side effect', def: 'Work that touches the outside world: fetch, timers, subscriptions.' },
      { term: 'dependency array', def: 'The second argument to useEffect listing values that should re-trigger it.' },
    ],
    quiz: [
      {
        q: 'useEffect(() => {...}, []) runs:',
        options: ['Every render', 'Once after the first render (mount)', 'Never', 'Only on unmount'],
        answer: 1,
      },
      {
        q: 'Effects should run:',
        options: ['During render', 'After render commits to the DOM', 'Before JSX is parsed', 'Only in class components'],
        answer: 1,
      },
      {
        q: 'Returning a function from useEffect is used for:',
        options: ['Rendering children', 'Cleanup when the effect re-runs or unmounts', 'Defining props', 'Importing modules'],
        answer: 1,
      },
    ],
    recap: [
      <><code>useEffect</code> runs <strong>after</strong> render for side effects like fetch, timers, and subscriptions.</>,
      <>The dependency array controls when the effect re-runs; <code>[]</code> means once on mount.</>,
      <>Return a cleanup function to cancel timers or subscriptions on unmount.</>,
    ],
  }),

  'react-store-lift': createChapterLesson({
    id: 'react-store-lift',
    modelTitle: 'Prop drilling & lifting state',
    intro: (
      <p className="prose">
        Local <code>useState</code> works until distant components need the same data.
        Passing props through every intermediate layer — even components that do not use them —
        is called <strong>prop drilling</strong>. Before reaching for Context or a global store,
        learn when <strong>lifting state up</strong> is enough — and when it is not.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          <code>useState</code> works for local UI state, but when many distant
          components need the same data — logged-in user, theme, shopping cart —
          passing props through every intermediate layer is <strong>prop drilling</strong>.
        </p>
        <ul className="prose-list">
          <li>
            <strong>Lift state up</strong> — move shared state to the nearest common
            ancestor and pass props down. Perfect when only a few levels separate siblings.
          </li>
          <li>
            As the tree deepens, you pass the same props through components that
            don&apos;t use them — just to reach one grandchild. Those intermediates still
            re-render when the prop changes.
          </li>
          <li>
            <strong>Callback props</strong> — lifting also means passing event handlers down
            many layers (<code>onUserChange</code>, <code>onThemeChange</code>), which gets
            noisy fast.
          </li>
          <li>
            The fix when depth or update frequency grows: share state via{' '}
            <strong>Context</strong> or an external <strong>store</strong> instead of threading props.
          </li>
        </ul>
        <CodePreview
          language="javascript"
          code={`// Lifted state — parent owns value, children receive props
function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <Controls count={count} onChange={setCount} />
      <Display count={count} />
    </>
  )
}

// Prop drilling — middle layers pass user down unused
function App() {
  const [user, setUser] = useState({ name: 'Ada' })
  return <Layout user={user} setUser={setUser} />  // Layout → Page → Profile
}`}
        />
        <Callout kind="note" title="Start local">
          Keep state in the component that owns it until a second branch genuinely
          needs the same value — then lift. Add Context only when drilling hurts;
          add a store when updates are frequent and widespread.
        </Callout>
      </>
    ),
    playground: (
      <>
        <LiftStateDemo />
        <PropDrillingViz />
        <TryThis>
          In <strong>Lift state</strong>, click +/− — both siblings update from one parent.
          Switch to <strong>Prop drilling vs Context</strong>, edit the user name, and watch
          render badges on each layer.
        </TryThis>
      </>
    ),
    hood: (
      <UnderTheHood title="Colocation first">
        <p className="prose">
          React docs emphasize <strong>colocation</strong>: keep state as close as possible to
          where it is used. Lifting is a deliberate step when two branches need the same source
          of truth — not something you do on day one for every field.
        </p>
      </UnderTheHood>
    ),
    terms: [
      { term: 'prop drilling', def: 'Passing props through many layers just to reach a deep child.' },
      { term: 'lifting state', def: 'Moving shared state to the nearest common ancestor component.' },
      { term: 'colocation', def: 'Keeping state near the components that use it until sharing is required.' },
    ],
    quiz: [
      {
        q: 'Prop drilling happens when:',
        options: ['You use too many hooks', 'Props pass through layers that do not use them', 'You forget keys on lists', 'JSX has two root elements'],
        answer: 1,
      },
      {
        q: 'Lifting state up means:',
        options: ['Moving state to a common ancestor', 'Deleting all props', 'Using only class components', 'Storing state in CSS'],
        answer: 1,
      },
      {
        q: 'Before adding Context or a store, you should:',
        options: ['Always use Redux first', 'Keep state local until sharing is genuinely needed', 'Never use useState', 'Put everything in the DOM'],
        answer: 1,
      },
      {
        q: 'Intermediate components in prop drilling:',
        options: ['Never re-render', 'May re-render when passed props change even if they do not use those props', 'Always use Context internally', 'Cannot receive callbacks'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>Colocate</strong> state first; <strong>lift</strong> when siblings or nearby branches need the same data.</>,
      <>Deep trees suffer <strong>prop drilling</strong> — threading props and callbacks through unused intermediates.</>,
      <>When lifting is not enough, reach for <strong>Context</strong> (slow-changing) or an external <strong>store</strong> (frequent updates).</>,
    ],
  }),

  'react-store-context': createChapterLesson({
    id: 'react-store-context',
    modelTitle: 'Context API',
    intro: (
      <p className="prose">
        When many components need the same value — current user, theme, locale —{' '}
        <strong>Context</strong> lets you provide it once at the top and read it anywhere below
        without passing props through every layer. Context is built into React; no extra library required.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          Three steps: <code>createContext</code> → wrap with <code>Provider</code> → read with{' '}
          <code>useContext</code> (often wrapped in a custom hook like <code>useUser()</code>).
        </p>
        <CodePreview
          language="javascript"
          code={`const UserContext = createContext(null)

function UserProvider({ children }) {
  const [user, setUser] = useState({ name: 'Ada', role: 'admin' })
  const value = useMemo(() => ({ user, setUser }), [user])
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser outside provider')
  return ctx
}

// Header, Sidebar, Settings — all call useUser(), no props`}
        />
        <ul className="prose-list">
          <li>
            <strong>Default value</strong> — <code>createContext(default)</code> is used only when
            no Provider exists above (useful for tests, risky in production).
          </li>
          <li>
            <strong>Multiple providers</strong> — nest Providers (theme inside auth inside router).
            Closest Provider wins for that subtree.
          </li>
          <li>
            <strong>Custom hooks</strong> — hide Context details behind <code>useTheme()</code>,{' '}
            <code>useAuth()</code> so components do not import raw Context objects.
          </li>
          <li>
            <strong>Performance</strong> — when Provider <code>value</code> changes,{' '}
            <em>all</em> consumers re-render. Split contexts or use a store for hot paths.
          </li>
        </ul>
        <Callout kind="tip" title="Good for">
          Infrequently-changing data: current user, theme, locale, feature flags, router config.
        </Callout>
        <Callout kind="warning" title="Avoid">
          Shopping cart counters, live chat message lists, or animation state — use local state,
          split contexts, or an external store instead.
        </Callout>
      </>
    ),
    playground: (
      <>
        <ContextStoreDemo />
        <ThemeContextDemo />
        <ContextRerenderDemo />
        <TryThis>
          Edit profile name/role — watch Header and Sidebar sync and render badges increment.
          Toggle theme in the theme demo. In the re-render trap, click count++ and notice component B
          re-renders even though only count changed.
        </TryThis>
      </>
    ),
    hood: (
      <>
        <UnderTheHood title="Why Provider value must be stable-ish">
          <p className="prose">
            A new object every render (<code>{'value={{ user, setUser }}'}</code> inline) forces
            all consumers to re-render even when <code>user</code> did not change. Wrap in{' '}
            <code>useMemo</code> or split state and dispatch into separate contexts.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Context is not a state manager">
          <p className="prose">
            Context is dependency injection for the tree — it does not give you selectors,
            middleware, devtools, or granular subscriptions. That is why cart-scale client state
            often moves to Zustand/Redux while user/theme stays in Context.
          </p>
        </UnderTheHood>
      </>
    ),
    terms: [
      { term: 'Context', def: 'A way to provide values to descendants without intermediate props.' },
      { term: 'Provider', def: 'A component that supplies a Context value to its subtree.' },
      { term: 'useContext', def: 'Hook that reads the nearest Provider value above in the tree.' },
      { term: 'custom hook', def: 'A function like useUser() that wraps useContext with validation and ergonomics.' },
    ],
    quiz: [
      {
        q: 'Context is best for:',
        options: ['Replacing all useState calls', 'Sharing values like user/theme without prop drilling', 'Database connections', 'CSS modules'],
        answer: 1,
      },
      {
        q: 'useContext reads a value from:',
        options: ['The nearest Provider above in the tree', 'window.localStorage only', 'The DOM attribute', 'A Redux store only'],
        answer: 0,
      },
      {
        q: 'Putting fast-updating values in Context can cause:',
        options: ['Faster renders', 'Every consumer re-rendering on each change', 'Automatic memoization', 'Smaller bundle size'],
        answer: 1,
      },
      {
        q: 'A custom hook like useUser() typically:',
        options: ['Replaces JSX', 'Wraps useContext and throws if used outside Provider', 'Only works in class components', 'Stores data in the DOM'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>Context</strong> shares values with any descendant — no prop drilling required.</>,
      <>Wrap subtrees in a <strong>Provider</strong>; consumers read via <code>useContext</code> or custom hooks.</>,
      <>Memoize Provider values; split hot state out of Context to avoid unnecessary re-renders.</>,
    ],
  }),

  'react-store-patterns': createChapterLesson({
    id: 'react-store-patterns',
    modelTitle: 'Context patterns',
    intro: (
      <p className="prose">
        Real apps combine Context with <code>useReducer</code>, split providers, and custom hooks.
        These patterns scale Context beyond a single <code>useState</code> blob — and clarify when
        you have outgrown Context entirely.
      </p>
    ),
    model: (
      <>
        <p className="prose"><strong>Pattern 1: Context + useReducer</strong> — treat updates like a mini Redux slice.</p>
        <CodePreview
          language="javascript"
          code={`const TodosContext = createContext(null)

function todosReducer(state, action) {
  switch (action.type) {
    case 'add': return [...state, action.item]
    case 'toggle': return state.map(t =>
      t.id === action.id ? { ...t, done: !t.done } : t)
    default: return state
  }
}

function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, [])
  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodosContext.Provider>
  )
}`}
        />
        <p className="prose"><strong>Pattern 2: Split state and dispatch contexts</strong></p>
        <CodePreview
          language="javascript"
          code={`// Consumers that only dispatch don't need to re-render when state changes
const StateContext = createContext([])
const DispatchContext = createContext(null)

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}`}
        />
        <ul className="prose-list">
          <li><strong>Compound providers</strong> — export <code>{'<AuthProvider><ThemeProvider>'}</code> from one module.</li>
          <li><strong>Selector libraries</strong> — <code>use-context-selector</code> re-renders only when a selected slice changes.</li>
          <li><strong>When to stop</strong> — many actions, middleware, time-travel debugging → consider Redux Toolkit.</li>
        </ul>
      </>
    ),
    playground: (
      <>
        <ContextReducerDemo />
        <TryThis>
          Add todos and toggle checkboxes — badge and list stay in sync via reducer dispatch.
          Compare render badges on the add form vs the list when toggling items.
        </TryThis>
      </>
    ),
    hood: (
      <UnderTheHood title="Dispatch context stability">
        <p className="prose">
          <code>dispatch</code> from <code>useReducer</code> is stable across renders, so a{' '}
          <code>DispatchContext</code> Provider value rarely changes. Components that only call{' '}
          <code>dispatch</code> can avoid re-rendering when state updates — a common optimization
          before adopting an external store.
        </p>
      </UnderTheHood>
    ),
    terms: [
      { term: 'useReducer', def: 'Hook for complex state transitions via a reducer function and actions.' },
      { term: 'split context', def: 'Separate Context objects for state vs dispatch to limit re-renders.' },
      { term: 'compound provider', def: 'A component that nests multiple Providers for related concerns.' },
    ],
    quiz: [
      {
        q: 'Context + useReducer is useful when:',
        options: ['You never update state', 'Updates follow action/reducer patterns with multiple event types', 'You only render static HTML', 'You avoid hooks'],
        answer: 1,
      },
      {
        q: 'Splitting dispatch into its own Context helps because:',
        options: ['Dispatch changes every render', 'Dispatch reference is stable; dispatch-only components skip state-driven re-renders', 'It removes the need for keys', 'It replaces useEffect'],
        answer: 1,
      },
      {
        q: 'use-context-selector exists to:',
        options: ['Replace React entirely', 'Subscribe to part of Context value like a store selector', 'Compile JSX', 'Fetch from APIs'],
        answer: 1,
      },
    ],
    recap: [
      <>Combine <strong>Context + useReducer</strong> for structured updates without Redux.</>,
      <>Split <strong>state</strong> and <strong>dispatch</strong> contexts to reduce re-renders.</>,
      <>If logic keeps growing, graduate to an external store with devtools and middleware.</>,
    ],
  }),

  'react-store-external': createChapterLesson({
    id: 'react-store-external',
    modelTitle: 'External stores (Zustand / Redux)',
    intro: (
      <p className="prose">
        When many components need the same <em>frequently updated</em> client state — carts,
        editors, multiplayer cursors — external <strong>stores</strong> live outside the React tree.
        Components subscribe to the slices they need. <strong>Zustand</strong> and{' '}
        <strong>Redux Toolkit</strong> are the two most common choices in 2026.
      </p>
    ),
    model: (
      <>
        <p className="prose">
          External stores implement the same idea as our cart demo: state + listeners outside
          React, hooks that subscribe and re-render when selected data changes.
        </p>
        <CodePreview
          language="javascript"
          code={`// Zustand — minimal hook per store
import { create } from 'zustand'

const useCartStore = create((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
}))

function Badge() {
  const count = useCartStore((s) => s.items.length) // selector
  return <span>{count}</span>
}

// Redux Toolkit — one global tree, actions + reducers
import { configureStore, createSlice } from '@reduxjs/toolkit'
const cartSlice = createSlice({ name: 'cart', initialState: { items: [] }, reducers: { ... } })
dispatch(cartSlice.actions.addItem({ name: 'Keyboard' }))`}
        />
        <ul className="prose-list">
          <li><strong>Zustand</strong> — tiny API, multiple stores, selectors built in, great default for new apps.</li>
          <li><strong>Redux Toolkit</strong> — single store, predictable flow, excellent devtools, RTK Query for server cache.</li>
          <li><strong>Selectors</strong> — pick <code>state.items.length</code> so unrelated updates do not re-render.</li>
          <li><strong>Immer</strong> — Redux Toolkit uses Immer so reducers can look mutable but stay immutable.</li>
        </ul>
        <Callout kind="tip" title="Server state">
          Data from APIs (users list, product catalog) belongs in{' '}
          <strong>TanStack Query</strong> or RTK Query — not duplicated in a client cart store.
        </Callout>
      </>
    ),
    playground: (
      <>
        <ExternalStoreDemo />
        <ZustandSelectorDemo />
        <ReduxFlowDemo />
        <TryThis>
          Add cart items — badge and panel stay in sync via the external store. In the selector
          demo, add items and compare render badges. Step through the Redux flow animation.
        </TryThis>
      </>
    ),
    hood: (
      <>
        <UnderTheHood title="Redux vs Zustand — when to pick which">
          <p className="prose">
            <strong>Redux</strong> shines with large teams, strict unidirectional data flow,
            time-travel debugging, and middleware (logging, analytics, sagas).{' '}
            <strong>Zustand</strong> wins when you want minimal boilerplate, multiple small stores,
            and selectors without configuring a global reducer tree.
          </p>
        </UnderTheHood>
        <UnderTheHood title="useSyncExternalStore">
          <p className="prose">
            React 18&apos;s <code>useSyncExternalStore</code> is how libraries subscribe safely
            to external stores during concurrent rendering. Zustand and Redux both build on this
            primitive under the hood.
          </p>
        </UnderTheHood>
      </>
    ),
    terms: [
      { term: 'store', def: 'External state container components subscribe to (Redux, Zustand).' },
      { term: 'selector', def: 'A function picking a slice of store state so components re-render minimally.' },
      { term: 'action', def: 'A plain object (Redux) or event describing what happened — fed to reducers.' },
      { term: 'middleware', def: 'Code between dispatch and reducer — logging, async, analytics.' },
    ],
    quiz: [
      {
        q: 'A global store (Redux/Zustand) helps when:',
        options: ['Only one component needs the data', 'Many components need the same frequently-updated state', 'You never re-render', 'You want to avoid JavaScript'],
        answer: 1,
      },
      {
        q: 'Server-fetched data (API lists) often belongs in:',
        options: ['A client cart store', 'TanStack Query or similar', 'CSS variables', 'JSX comments'],
        answer: 1,
      },
      {
        q: 'A selector like (s) => s.items.length helps because:',
        options: ['It mutates the store', 'Components re-render only when that derived value changes', 'It replaces useEffect', 'It removes the need for keys'],
        answer: 1,
      },
      {
        q: 'Zustand compared to Redux is generally:',
        options: ['Heavier with more boilerplate', 'Lighter with less boilerplate', 'Only for class components', 'Not usable with hooks'],
        answer: 1,
      },
    ],
    recap: [
      <><strong>External stores</strong> live outside the tree; components subscribe via selectors.</>,
      <>Use <strong>Redux</strong> for large apps with complex flows; <strong>Zustand</strong> for lighter client state.</>,
      <>Keep API/server data in <strong>TanStack Query</strong> — stores are for client UI state.</>,
    ],
  }),

  'react-store-choosing': createChapterLesson({
    id: 'react-store-choosing',
    modelTitle: 'Choosing state placement',
    intro: (
      <p className="prose">
        Not every piece of state belongs in Redux — and not everything fits in Context.
        A practical React developer picks the <strong>simplest tool that works</strong>, then
        upgrades when pain appears (drilling, re-renders, scattered logic).
      </p>
    ),
    model: (
      <>
        <ul className="prose-list">
          <li><strong>Local useState</strong> — modal open, input text, hover state in one component.</li>
          <li><strong>Lifted state</strong> — siblings share a tab, selection, or filter via parent props.</li>
          <li><strong>Context</strong> — auth user, theme, i18n — slow-changing, tree-wide, few updates per minute.</li>
          <li><strong>External store</strong> — cart, undo stack, canvas tools — many writers/readers, frequent updates.</li>
          <li><strong>Server cache (TanStack Query)</strong> — anything fetched from an API with stale/revalidate semantics.</li>
          <li><strong>URL state</strong> — filters, pagination, shareable views — often via React Router search params.</li>
        </ul>
        <Callout kind="warning" title="Smell tests">
          If Context causes everything to re-render, split or move hot state. If props pass through
          five layers, lift is failing — use Context or a store. If data comes from GET /api, use a
          server cache library.
        </Callout>
        <CodePreview
          language="javascript"
          code={`// Decision cheat sheet (simplified)
// 1 owner component?        → useState
// 2 sibling branches?       → lift to parent
// Many depths, slow data?   → Context + custom hook
// Many depths, hot data?    → Zustand / Redux selectors
// From HTTP API?            → TanStack Query
// Shareable in URL?         → router searchParams`}
        />
      </>
    ),
    playground: (
      <>
        <StateChooserSim />
        <TryThis>
          Work through each scenario — pick local, lift, Context, store, or TanStack Query before
          revealing the answer. Discuss trade-offs with a partner.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'client state', def: 'UI state owned by the browser — tabs, cart, theme toggles.' },
      { term: 'server state', def: 'Data fetched from APIs — cached, stale, refetched by query libraries.' },
      { term: 'URL state', def: 'Values encoded in the route or query string — shareable and bookmarkable.' },
    ],
    quiz: [
      {
        q: 'Theme (light/dark) used app-wide, toggled rarely, is best in:',
        options: ['TanStack Query', 'Context or small Zustand store', 'URL only', 'Every component\'s local state'],
        answer: 1,
      },
      {
        q: 'Product list from GET /api/products belongs in:',
        options: ['Redux cart slice', 'TanStack Query cache', 'React Context default value', 'CSS variables'],
        answer: 1,
      },
      {
        q: 'You should reach for Redux/Zustand when:',
        options: ['One checkbox in a form', 'Many distant components update shared client state often', 'You never share state', 'You only use server data'],
        answer: 1,
      },
    ],
    recap: [
      <>Start <strong>local</strong>, then <strong>lift</strong>, then <strong>Context</strong>, then <strong>store</strong> — only as complexity demands.</>,
      <>Separate <strong>client state</strong> from <strong>server state</strong> (TanStack Query).</>,
      <>Re-render and drilling pain are signals to upgrade your state strategy.</>,
    ],
  }),

  'react-lab-counter': createChapterLesson({
    id: 'react-lab-counter',
    modelTitle: 'Counter & state',
    intro: (
      <p className="prose">
        The smallest useful state example: a number that changes when you click. Each click
        calls <code>setCount</code>, which schedules a re-render with the new value.
      </p>
    ),
    model: (
      <p className="prose">
        Click the buttons and watch count update — each click calls{' '}
        <code>setCount</code>, which schedules a re-render with the new value.
      </p>
    ),
    playground: (
      <>
        <CounterDemo />
        <TryThis>
          Use the functional form <code>setCount(c =&gt; c + 1)</code> — it always reads
          the latest count, even when several updates batch together.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'useState', def: 'Hook that returns [value, setter] for local component memory.' },
      { term: 'functional update', def: 'Passing a function to the setter: setCount(c => c + 1).' },
    ],
    quiz: [
      {
        q: 'Calling setCount(count + 1) after a click will:',
        options: ['Mutate the DOM directly', 'Schedule a re-render with the new count', 'Reload the page', 'Run useEffect only'],
        answer: 1,
      },
      {
        q: 'setCount(c => c + 1) is preferred when:',
        options: ['You never click twice', 'The new value depends on the previous one', 'You use class components only', 'count is a string'],
        answer: 1,
      },
    ],
    recap: [
      <><code>useState(0)</code> gives you a value and a setter; clicking updates state and re-renders.</>,
      <>Prefer <code>setCount(c =&gt; c + 1)</code> when updates may batch or depend on prior value.</>,
    ],
  }),

  'react-lab-props': createChapterLesson({
    id: 'react-lab-props',
    modelTitle: 'Props playground',
    intro: (
      <p className="prose">
        See props in action: a parent holds the data, a child renders it. Change the inputs
        and the child receives new props without owning any state itself.
      </p>
    ),
    model: (
      <p className="prose">
        Edit the inputs below — the Greeting card receives new props from its parent
        but keeps no state of its own.
      </p>
    ),
    playground: (
      <>
        <PropsDemo />
        <TryThis>
          Change <code>name</code> and <code>role</code> — the child re-renders with
          new props while sibling state (if any) stays independent.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'props', def: 'Read-only inputs passed from parent to child.' },
      { term: 'controlled input', def: 'An input whose value comes from React state via props or local state.' },
    ],
    quiz: [
      {
        q: 'Props in a child component should be treated as:',
        options: ['Mutable local variables', 'Read-only inputs from the parent', 'Global state', 'Optional only in TypeScript'],
        answer: 1,
      },
      {
        q: 'When the parent changes props, the child:',
        options: ['Keeps the old props forever', 'Re-renders with the new props', 'Must reload the page', 'Loses all state automatically'],
        answer: 1,
      },
    ],
    recap: [
      <>The parent owns the data; the child renders whatever props it receives.</>,
      <>Changing parent inputs flows new props down — the child re-renders but does not mutate props.</>,
    ],
  }),

  'react-lab-lists': createChapterLesson({
    id: 'react-lab-lists',
    modelTitle: 'Todo list lab',
    intro: (
      <p className="prose">
        Lists combine state, events, and keys. Add todos, toggle them done, and notice how
        immutable array updates keep React in sync with the UI.
      </p>
    ),
    model: (
      <p className="prose">
        Add todos and toggle checkboxes — each toggle maps to a new array so React
        detects the change and re-renders the list.
      </p>
    ),
    playground: (
      <>
        <ListsDemo />
        <TryThis>
          Add a todo, toggle it done, then add another — notice each row keeps a stable{' '}
          <code>key</code> from <code>todo.id</code>.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'key', def: 'Stable identifier on list items so React matches elements across renders.' },
      { term: 'map', def: 'Array method used to transform data into a list of JSX elements.' },
    ],
    quiz: [
      {
        q: 'Why use key={todo.id} in a list?',
        options: ['For CSS styling', 'So React can match items across re-renders', 'To encrypt data', 'It is optional always'],
        answer: 1,
      },
      {
        q: 'Toggling a todo done should:',
        options: ['Mutate todos[i].done in place', 'Map to a new array with updated items', 'Delete the todo always', 'Skip setState'],
        answer: 1,
      },
    ],
    recap: [
      <>Build lists with <code>.map()</code> and stable <code>key</code>s from your data ids.</>,
      <>Toggle and add by returning <strong>new arrays</strong> — never mutate state in place.</>,
    ],
  }),

  'react-hood-vdom': createChapterLesson({
    id: 'react-hood-vdom',
    modelTitle: 'Why reconciliation matters',
    intro: (
      <p className="prose">
        React can re-render whole component trees on every state change and still feel fast.
        The secret is a lightweight in-memory copy of the UI used to compute minimal DOM updates.
      </p>
    ),
    model: (
      <p className="prose">
        When you call a setter, React builds a new element tree, compares it to the previous
        one, and updates only what changed in the real DOM — a process called{' '}
        <strong>reconciliation</strong>.
      </p>
    ),
    hood: (
      <UnderTheHood title="Virtual DOM & reconciliation">
        <p className="prose">
          React keeps a lightweight copy of the UI tree in memory. When state changes, it
          builds a new tree, <strong>diffs</strong> it against the previous one, and
          applies the smallest set of DOM updates. That&apos;s why you can re-render whole
          subtrees without rewriting manual DOM code.
        </p>
      </UnderTheHood>
    ),
    playground: (
      <>
        <VdomDiffDemo />
        <TryThis>
          Insert &quot;Pricing&quot; — only one new list item appears because stable{' '}
          <code>key</code> values let React patch the DOM minimally.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'virtual DOM', def: 'An in-memory representation of the UI used for efficient updates.' },
      { term: 'reconciliation', def: "React's process of diffing trees and updating the real DOM." },
    ],
    quiz: [
      {
        q: 'The virtual DOM is:',
        options: ['A second browser tab', 'An in-memory UI tree React diffs before updating the real DOM', 'A CSS framework', 'A database view'],
        answer: 1,
      },
      {
        q: 'Reconciliation means React:',
        options: ['Reloads the entire page', 'Diffs old and new trees and applies minimal DOM changes', 'Skips all updates', 'Only updates on mount'],
        answer: 1,
      },
    ],
    recap: [
      <>React keeps a <strong>virtual DOM</strong> — an in-memory copy of the UI tree.</>,
      <><strong>Reconciliation</strong> diffs the new tree against the old and patches only what changed.</>,
    ],
  }),

  'react-hood-hooks': createChapterLesson({
    id: 'react-hood-hooks',
    modelTitle: 'Why hook rules exist',
    intro: (
      <p className="prose">
        Hooks like <code>useState</code> and <code>useEffect</code> look like normal functions,
        but React relies on a strict call order to associate state with the right component instance.
      </p>
    ),
    model: (
      <p className="prose">
        Break the rules — calling hooks inside loops, conditions, or nested functions — and
        React may associate state with the wrong render, causing subtle bugs that are hard to trace.
      </p>
    ),
    hood: (
      <UnderTheHood title="Hooks rules">
        <p className="prose">
          Hooks (useState, useEffect, etc.) must be called at the top level of a component
          — not inside loops, conditions, or nested functions. React relies on call order
          to associate state with the right component instance.
        </p>
      </UnderTheHood>
    ),
    playground: (
      <>
        <HooksRulesDemo />
        <TryThis>
          Switch between <strong>Valid</strong>, <strong>Inside if</strong>, and{' '}
          <strong>Inside loop</strong> — see why hook call order must stay stable every render.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'hook', def: 'A function like useState or useEffect that taps into React features.' },
      { term: 'Rules of Hooks', def: 'Only call hooks at the top level of React functions — never conditionally.' },
    ],
    quiz: [
      {
        q: 'Hooks must be called:',
        options: ['Inside if blocks when needed', 'At the top level of a component, in the same order every render', 'Only in useEffect', 'In any nested helper function'],
        answer: 1,
      },
      {
        q: 'React tracks hook state by:',
        options: ['Variable names', 'The order hooks are called each render', 'File name', 'CSS class names'],
        answer: 1,
      },
    ],
    recap: [
      <>Call hooks only at the <strong>top level</strong> of components or custom hooks.</>,
      <>Never call hooks inside loops, conditions, or nested functions — order must stay consistent.</>,
    ],
  }),

  'react-hood-stack': createChapterLesson({
    id: 'react-hood-stack',
    modelTitle: 'Beyond the view layer',
    intro: (
      <p className="prose">
        React handles rendering and component state, but production apps add routing, data
        fetching, forms, types, and build tooling around the core library.
      </p>
    ),
    model: (
      <p className="prose">
        Think of React as the view layer in a larger stack. You will typically pair it with
        a router, an API client, and a bundler — often with a Python backend like FastAPI
        serving JSON.
      </p>
    ),
    hood: (
      <UnderTheHood title="Ecosystem">
        <p className="prose">
          React is the view layer. Real apps add a router (React Router), data fetching
          (TanStack Query), forms, and often TypeScript. Build tools like Vite compile
          JSX and bundle modules for the browser. Pair with a FastAPI backend for JSON APIs.
        </p>
      </UnderTheHood>
    ),
    playground: (
      <>
        <EcosystemMap />
        <TryThis>
          Click each chip — see how routers, data-fetching libraries, and bundlers fit
          around React in a typical full-stack app.
        </TryThis>
      </>
    ),
    terms: [
      { term: 'React Router', def: 'Library for client-side routing between pages in a React app.' },
      { term: 'Vite', def: 'Fast dev server and bundler commonly used to compile JSX for the browser.' },
    ],
    quiz: [
      {
        q: 'React alone is primarily:',
        options: ['A full backend framework', 'The view/UI layer', 'A database ORM', 'A CSS preprocessor'],
        answer: 1,
      },
      {
        q: 'TanStack Query is commonly used for:',
        options: ['Styling components', 'Fetching and caching server/API data', 'Replacing JSX', 'Git hooks'],
        answer: 1,
      },
    ],
    recap: [
      <>React is the <strong>view layer</strong> — add routing, data fetching, and tooling around it.</>,
      <>Typical stack: <strong>Vite</strong> + <strong>React Router</strong> + <strong>TanStack Query</strong> + a JSON API backend.</>,
    ],
  }),
}

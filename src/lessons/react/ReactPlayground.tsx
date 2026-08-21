import { useState } from 'react'

function Greeting({ name, role }: { name: string; role: string }) {
  return (
    <div className="obj-card" style={{ borderColor: '#38bdf8' }}>
      <div className="obj-head">
        <span className="obj-badge" style={{ background: '#38bdf8' }}>props</span>
        <span className="obj-make">Greeting</span>
      </div>
      <div className="obj-fields">
        <div>Hello, <b>{name || 'stranger'}</b>!</div>
        <div>Role: <b>{role}</b></div>
      </div>
    </div>
  )
}

function TodoItem({ text, done, onToggle }: { text: string; done: boolean; onToggle: () => void }) {
  return (
    <label className="react-todo-item">
      <input type="checkbox" checked={done} onChange={onToggle} />
      <span style={{ textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 }}>
        {text}
      </span>
    </label>
  )
}

export function ReactPlayground() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('Ada')
  const [role, setRole] = useState('admin')
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn components', done: true },
    { id: 2, text: 'Add state', done: false },
    { id: 3, text: 'Ship feature', done: false },
  ])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    const text = newTodo.trim()
    if (!text) return
    setTodos((t) => [...t, { id: Date.now(), text, done: false }])
    setNewTodo('')
  }

  return (
    <div className="demo-split demo-split--wide">
      <div className="panel">
        <div className="panel-title">1. State with useState</div>
        <pre className="term-output">{`const [count, setCount] = useState(0)

<button onClick={() => setCount(count + 1)}>
  Count: {count}
</button>`}</pre>
        <div className="react-counter">
          <button className="btn" onClick={() => setCount((c) => c - 1)}>−</button>
          <span className="react-count-display">Count: <b>{count}</b></span>
          <button className="btn" onClick={() => setCount((c) => c + 1)}>+</button>
        </div>
        <p className="panel-hint">Each click calls setCount — React re-renders with the new value.</p>
      </div>

      <div className="panel">
        <div className="panel-title">2. Props (data from parent)</div>
        <pre className="term-output">{`function Greeting({ name, role }) {
  return <p>Hello, {name}! ({role})</p>
}

<Greeting name="Ada" role="admin" />`}</pre>
        <div className="class-create">
          <label className="conv-field"><span>name</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label className="conv-field"><span>role</span><input value={role} onChange={(e) => setRole(e.target.value)} /></label>
        </div>
        <Greeting name={name} role={role} />
        <p className="panel-hint">Props flow down — the parent owns the data; the child renders it.</p>
      </div>

      <div className="panel" style={{ gridColumn: '1 / -1' }}>
        <div className="panel-title">3. Lists &amp; event handlers</div>
        <pre className="term-output">{`{todos.map(todo => (
  <TodoItem key={todo.id} text={todo.text}
    done={todo.done} onToggle={() => toggle(todo.id)} />
))}`}</pre>
        <div className="react-todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              text={todo.text}
              done={todo.done}
              onToggle={() =>
                setTodos((t) => t.map((x) => (x.id === todo.id ? { ...x, done: !x.done } : x)))
              }
            />
          ))}
        </div>
        <div className="class-create">
          <label className="conv-field"><span>new todo</span><input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTodo()} /></label>
          <button className="btn" onClick={addTodo}>add</button>
        </div>
      </div>
    </div>
  )
}

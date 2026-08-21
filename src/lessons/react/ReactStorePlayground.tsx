import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface User {
  name: string
  role: string
}

interface UserContextValue {
  user: User
  setUser: (u: User) => void
}

const UserContext = createContext<UserContextValue | null>(null)

function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ name: 'Ada', role: 'admin' })
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

function Header() {
  const { user } = useUser()
  return (
    <div className="store-panel">
      <span className="store-label">Header</span>
      <span>Logged in as <b>{user.name}</b> ({user.role})</span>
    </div>
  )
}

function Sidebar() {
  const { user } = useUser()
  return (
    <div className="store-panel">
      <span className="store-label">Sidebar</span>
      <span>Welcome back, <b>{user.name}</b></span>
    </div>
  )
}

function ProfileEditor() {
  const { user, setUser } = useUser()
  return (
    <div className="store-panel store-panel--editor">
      <span className="store-label">Profile (updates store)</span>
      <div className="class-create">
        <label className="conv-field">
          <span>name</span>
          <input
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </label>
        <label className="conv-field">
          <span>role</span>
          <select
            value={user.role}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
          >
            <option value="admin">admin</option>
            <option value="viewer">viewer</option>
            <option value="editor">editor</option>
          </select>
        </label>
      </div>
    </div>
  )
}

// Minimal "store" pattern — subscribe + setState outside React tree
type CartItem = { id: number; name: string; qty: number }
let cartState: CartItem[] = [{ id: 1, name: 'Keyboard', qty: 1 }]
const cartListeners = new Set<() => void>()

function getCart() {
  return cartState
}

function setCart(next: CartItem[]) {
  cartState = next
  cartListeners.forEach((l) => l())
}

function useCart() {
  const [, bump] = useState(0)
  useEffect(() => {
    const listener = () => bump((n) => n + 1)
    cartListeners.add(listener)
    return () => { cartListeners.delete(listener) }
  }, [])
  return {
    items: getCart(),
    addItem: (name: string) =>
      setCart([...getCart(), { id: Date.now(), name, qty: 1 }]),
    removeItem: (id: number) => setCart(getCart().filter((i) => i.id !== id)),
  }
}

function CartBadge() {
  const { items } = useCart()
  const total = items.reduce((s, i) => s + i.qty, 0)
  return (
    <div className="store-panel">
      <span className="store-label">Cart badge</span>
      <span>🛒 <b>{total}</b> item{total !== 1 ? 's' : ''}</span>
    </div>
  )
}

function CartPanel() {
  const { items, addItem, removeItem } = useCart()
  const [name, setName] = useState('')
  return (
    <div className="store-panel store-panel--editor">
      <span className="store-label">Cart store</span>
      <ul className="store-cart-list">
        {items.map((i) => (
          <li key={i.id}>
            {i.name} ×{i.qty}
            <button className="icon-btn" onClick={() => removeItem(i.id)} aria-label="remove">×</button>
          </li>
        ))}
      </ul>
      <div className="class-create">
        <label className="conv-field">
          <span>add item</span>
          <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter' && name.trim()) { addItem(name.trim()); setName('') }
          }} />
        </label>
        <button className="btn" onClick={() => { if (name.trim()) { addItem(name.trim()); setName('') } }}>add</button>
      </div>
    </div>
  )
}

export function ContextStoreDemo() {
  return (
    <div className="store-demo">
      <UserProvider>
        <div className="store-grid">
          <Header />
          <Sidebar />
          <ProfileEditor />
        </div>
      </UserProvider>
    </div>
  )
}

export function ExternalStoreDemo() {
  return (
    <div className="store-demo">
      <div className="store-grid">
        <CartBadge />
        <CartPanel />
      </div>
    </div>
  )
}

export function ReactStorePlayground() {
  return (
    <div className="store-demo">
      <ContextStoreDemo />
      <div style={{ marginTop: 12 }}>
        <ExternalStoreDemo />
      </div>
    </div>
  )
}

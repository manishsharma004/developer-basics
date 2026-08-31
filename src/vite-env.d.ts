/// <reference types="vite/client" />

declare module '*?raw' {
  const content: string
  export default content
}

declare module '*.wasm?url' {
  const url: string
  export default url
}

declare module 'v86/build/libv86.mjs' {
  export const V86: new (options: Record<string, unknown>) => {
    run(): Promise<void>
    destroy(): Promise<void>
    serial0_send(data: string): void
    save_state(): Promise<ArrayBuffer>
    add_listener(event: string, fn: (...args: unknown[]) => void): void
  }
}

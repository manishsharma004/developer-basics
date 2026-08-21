import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The base path is required for GitHub Pages project sites, which serve from
// https://<user>.github.io/<repo>/. It can be overridden at build time via the
// BASE_PATH env var (the deploy workflow sets it to the repository name).
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  // Pyodide ships large wasm/asm files and its own loader shim; excluding it
  // from dependency pre-bundling avoids esbuild choking on those assets. The
  // runtime itself is fetched from the jsDelivr CDN at load time (see
  // src/lib/pyodide.ts), so nothing extra needs to be bundled.
  optimizeDeps: {
    exclude: ['pyodide'],
  },
  worker: {
    format: 'es',
  },
})

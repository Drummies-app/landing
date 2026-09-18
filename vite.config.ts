import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Emit a real index.html for each client route. Without this GitHub Pages has
 * no file at /build-log and answers 404 — the SPA fallback recovers in a
 * browser, but crawlers that do not run JavaScript see the 404 status for a
 * page that exists.
 */
function prerenderRoutes(routes: string[]): Plugin {
  let outDir = 'dist'
  return {
    name: 'drummies:prerender-routes',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const root = resolve(process.cwd(), outDir)
      const html = readFileSync(join(root, 'index.html'))
      for (const route of routes) {
        const dir = join(root, route)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html)
      }
    },
  }
}

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), prerenderRoutes(['build-log'])],
  build: { target: 'es2022' },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
})

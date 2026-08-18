/**
 * tsdown config for the browser half (src/client -> client/client.js).
 *
 * The emitted format is CJS so the normalize step can hand the bundle's
 * `module`/`exports`/`require` to the host's __ModuleLoader__ factory.
 * `deps.neverBundle` lists the host platform module table entries: they are
 * NOT bundled, the factory `require`s them at runtime.
 */
import { defineConfig } from 'tsdown'

/** Modules provided by the host page's frozen platform module table. */
const CLIENT_EXTERNALS = [
  'react',
  'react/jsx-runtime',
  '@deepseek-ai/dsh-client-ui-primitives',
]

export default defineConfig({
  entry: ['src/client/index.ts'],
  outDir: 'client',
  format: ['cjs'],
  deps: {
    neverBundle: CLIENT_EXTERNALS,
  },
  // CSS Modules must ship inside the JS bundle (injected as a <style> tag),
  // never as a separate .css asset: the __ModuleLoader__ factory only loads
  // one file.
  css: {
    inject: true,
    splitting: false,
  },
  sourcemap: true,
  dts: false,
  clean: false,
  target: 'es2022',
})

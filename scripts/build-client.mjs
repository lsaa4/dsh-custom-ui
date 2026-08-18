/**
 * Build the browser half with tsdown (rolldown), then wrap the CJS output in
 * the host's module-loader contract:
 *
 *   window.__ModuleLoader__.load({ id, factory: (require) => { ... } })
 *
 * - external modules (react, jsx-runtime, ui-primitives) stay `require()`d
 *   against the loader's frozen platform module table;
 * - @tsdown/css emits the compiled CSS as a separate style.css asset and
 *   prepends `import './style.css';` to the chunk — illegal inside the CJS
 *   factory wrapper, and the loader ships exactly one file — so the import
 *   line is removed and the CSS is injected as a <style data-plugin> tag;
 * - the trailing sourceMappingURL comment must live OUTSIDE the wrapper;
 * - output is normalized to client/client.js regardless of tsdown's entry
 *   naming, so package.json exports can stay stable.
 */
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'client')
const ID = 'dsh-glass-ui'

// 0) fresh output dir — tsdown does not clean files it did not emit
rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

// 1) tsdown build (reads tsdown.config.ts) — run through the local install
//    so the script works without npx/pnpm on PATH (Windows spawn quirk)
const require = createRequire(import.meta.url)
const tsdownPkg = require('tsdown/package.json')
const binPath = typeof tsdownPkg.bin === 'string' ? tsdownPkg.bin : tsdownPkg.bin.tsdown
const tsdownCli = join(dirname(require.resolve('tsdown/package.json')), binPath)
execFileSync(process.execPath, [tsdownCli], { cwd: ROOT, stdio: 'inherit' })

// 2) locate the emitted bundle (entry naming and extension vary across
//    tsdown versions: index.js, index.cjs, client.js, ...)
const candidates = readdirSync(OUT_DIR)
  .filter((f) => /\.(?:c?js)$/.test(f) && !f.endsWith('.map'))
if (candidates.length !== 1) {
  throw new Error(`expected exactly one emitted client bundle, got: ${candidates.join(', ')}`)
}

// 3) normalize file name
const emitted = join(OUT_DIR, candidates[0])
const target = join(OUT_DIR, 'client.js')
if (emitted !== target) renameSync(emitted, target)

// 4) inline the compiled CSS (dropping the @tsdown/css import line)
let code = readFileSync(target, 'utf8')
const cssFile = join(OUT_DIR, 'style.css')
if (existsSync(cssFile)) {
  const css = readFileSync(cssFile, 'utf8')
  code = code.replace(/^\s*import\s+['"][^'"]*\.css['"];\s*/m, '')
  const inject =
    `(()=>{const s=document.createElement('style');` +
    `s.setAttribute('data-plugin',${JSON.stringify(ID)});` +
    `s.textContent=${JSON.stringify(css)};` +
    `(document.head||document.documentElement).appendChild(s)})();`
  code = inject + code
  rmSync(cssFile)
}

// 5) wrap in the loader contract
let mapLine = ''
const mapMatch = code.match(/\n\/\/# sourceMappingURL=.*$/)
if (mapMatch) {
  mapLine = mapMatch[0]
  code = code.slice(0, mapMatch.index)
}
const wrapped =
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(ID)}, factory: (require) => {\n` +
  `var module = { exports: {} };\n` +
  `var exports = module.exports;\n` +
  code +
  `\nreturn module.exports;\n}});\n` +
  mapLine
writeFileSync(target, wrapped, 'utf8')
console.log(`[${ID}] wrapped ${target} as __ModuleLoader__ bundle (${wrapped.length} bytes)`)

import { readdirSync } from 'node:fs'

const EXCLUDED = new Set(['run-all.ts', 'support.ts'])

const files = readdirSync(__dirname)
  .filter((name) => name.endsWith('.ts') && !EXCLUDED.has(name))
  .sort()

files.forEach((name) => {
  require(`./${name}`)
})

console.log(`\n${files.length} examples rendered into examples/svgs.`)

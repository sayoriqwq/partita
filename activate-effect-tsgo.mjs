import { spawnSync } from 'node:child_process'

const result = spawnSync(process.execPath, [
  'node_modules/@effect/tsgo/dist/effect-tsgo.js',
  'patch',
  '--typescript-package',
  '@typescript/native',
], { stdio: 'inherit' })

if (result.status !== 0)
  process.exit(result.status ?? 1)

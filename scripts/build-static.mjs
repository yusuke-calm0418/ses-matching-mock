import { copyFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = new URL('../', import.meta.url)
const files = ['index.html', 'style.css', 'data.js', 'folder-import.js', 'app.js']
for (const file of files.filter(file => file.endsWith('.js'))) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(`dist/${file}`, root))], { stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
await mkdir(new URL('build/', root), { recursive: true })
for (const file of files) {
  await copyFile(new URL(`dist/${file}`, root), new URL(`build/${file}`, root))
}
console.log('Static files copied to build/ (JavaScript syntax checked).')

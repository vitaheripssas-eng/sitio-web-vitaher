import { copyFile, mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const storagePath = fileURLToPath(new URL('../dist/storage/', import.meta.url))
const sourceStoragePath = fileURLToPath(new URL('../public/storage/', import.meta.url))
const keep = new Set(['.htaccess', 'uploads/.htaccess'])

async function clean(dir, relative = '') {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])

  for (const entry of entries) {
    const entryRelative = relative ? `${relative}/${entry.name}` : entry.name
    if (keep.has(entryRelative)) continue
    await rm(join(dir, entry.name), { recursive: true, force: true })
  }
}

await clean(storagePath)
await mkdir(join(storagePath, 'uploads'), { recursive: true })
await copyFile(join(sourceStoragePath, '.htaccess'), join(storagePath, '.htaccess')).catch(() => {})
await copyFile(
  join(sourceStoragePath, 'uploads', '.htaccess'),
  join(storagePath, 'uploads', '.htaccess'),
).catch(() => {})

import { rm } from 'node:fs/promises'
import { join } from 'node:path'

async function main() {
  const target = join(process.cwd(), '.next-dev')
  await rm(target, { recursive: true, force: true })
  console.log('Cleaned dev build cache:', target)
}

main().catch((error) => {
  console.error('Failed to clean dev cache:', error)
  process.exit(1)
})

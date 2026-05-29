import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { neon } from '@neondatabase/serverless'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: join(process.cwd(), '.env.local') })
loadEnv()

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required')

  const sql = neon(url)
  const migrationDir = join(process.cwd(), 'drizzle')
  const files = (await readdir(migrationDir)).filter((file) => file.endsWith('.sql')).sort()

  for (const file of files) {
    const migration = await readFile(join(migrationDir, file), 'utf8')
    const statements = migration
      .split(';')
      .map((segment) => segment.trim())
      .filter(Boolean)
    for (const statement of statements) {
      await sql.query(`${statement};`)
    }
  }
  console.log(`Applied ${files.length} live content database migration(s).`)
}

void main()

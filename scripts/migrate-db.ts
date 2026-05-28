import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { neon } from '@neondatabase/serverless'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: join(process.cwd(), '.env.local') })
loadEnv()

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is required')

  const sql = neon(url)
  const migration = await readFile(join(process.cwd(), 'drizzle', '0000_live_content.sql'), 'utf8')
  const statements = migration
    .split(';')
    .map((segment) => segment.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await sql.query(`${statement};`)
  }
  console.log('Applied live content database migration.')
}

void main()

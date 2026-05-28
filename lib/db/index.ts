import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let database: ReturnType<typeof createDatabase> | null = null

function createDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is required for live content.')
  }
  return drizzle(
    neon(connectionString, {
      // Prevent runtime data reads from being memoized by framework-level fetch caches.
      fetchOptions: { cache: 'no-store' },
    }),
    { schema },
  )
}

export function getDb() {
  if (!database) database = createDatabase()
  return database
}

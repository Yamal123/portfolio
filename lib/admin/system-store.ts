import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export type AdminSystemStore = {
  findUserByUsername: (username: string) => any
  getAdminUserById: (id: number | string) => any
  getUserById: (id: number | string) => any
  verifyAdminPassword: (user: any, password: string) => boolean
  updateUserLogin: (id: number, ip: string) => any
  recordAdminLoginFailure: (id: number) => any
  bumpAdminSessionVersion: (id: number) => number | null
  updateAdminPassword: (id: number, password: string) => any
  addLog: (...args: any[]) => any
  getStats: () => any
  getAnalyticsOverview: () => any
  getAnalyticsTrend: (query?: { start?: string; end?: string; days?: number }) => any
  getTopProjects: (limit?: number) => any
  getCategoryDistribution: () => any
  getRecentVisits: (limit?: number) => any
  getLogs: (query?: any) => any
  recordVisit: (ip: string, userAgent: string, pagePath: string, duration?: number) => any
  recordAgentSession: (payload?: any) => any
  getAgentSessions: (query?: any) => any
  getHotTopics: (query?: any) => any
  data?: Record<string, any>
}

let cachedStore: AdminSystemStore | null = null

export function getSystemStore() {
  if (!cachedStore) {
    cachedStore = require('../../server/services') as AdminSystemStore
  }
  return cachedStore
}

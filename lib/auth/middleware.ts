import { NextResponse } from 'next/server'
import { authResponse, getRequestFingerprint, getSessionFromRequest, verifySession } from '@/lib/auth'
import { getSystemStore } from '@/lib/admin/system-store'

export function checkAuth(request: Request): { username: string; id: number } | NextResponse {
  const token = getSessionFromRequest(request)
  const fingerprint = getRequestFingerprint(request)
  const payload = token ? verifySession(token, fingerprint) : null
  if (!payload) return authResponse()

  const store = getSystemStore()
  const user = store.getAdminUserById(payload.id)
  if (!user || user.status !== 1) return authResponse()
  if ((user.session_version || 0) !== payload.sessionVersion) return authResponse()

  return { username: user.username, id: user.id }
}

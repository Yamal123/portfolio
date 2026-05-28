import { NextResponse } from 'next/server'
import { authResponse, getSessionFromRequest, verifySession } from '@/lib/auth'

export function checkAuth(request: Request): { username: string; id: number } | NextResponse {
  const token = getSessionFromRequest(request)
  const user = token ? verifySession(token) : null
  return user || authResponse()
}

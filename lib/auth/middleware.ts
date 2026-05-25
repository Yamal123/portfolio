import { NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader, authResponse } from '@/lib/auth'

/**
 * Helper: validate admin auth from request headers.
 * Returns null if valid, or an error Response if invalid.
 */
export function checkAuth(request: Request): { username: string; id: number } | NextResponse {
  const token = getTokenFromHeader(request)
  if (!token) return authResponse()

  const user = verifyToken(token)
  if (!user) return authResponse()

  return user
}

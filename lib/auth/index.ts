/**
 * Auth utilities for admin API routes.
 * Uses HMAC-SHA256 for token signing (no external dependencies needed).
 */

import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.ADMIN_JWT_SECRET || 'aipmym_jwt_secret_key_2026'
const TOKEN_EXPIRY = 2 * 60 * 60 * 1000 // 2 hours

export function createToken(payload: { username: string; id: number }): string {
  const data = {
    ...payload,
    exp: Date.now() + TOKEN_EXPIRY,
    iat: Date.now(),
  }
  const json = JSON.stringify(data)
  const encoded = Buffer.from(json).toString('base64url')
  const hmac = crypto.createHmac('sha256', SECRET)
  hmac.update(encoded)
  const signature = hmac.digest('base64url')
  return `${encoded}.${signature}`
}

export function verifyToken(token: string): { username: string; id: number } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null

    const [encoded, signature] = parts
    const hmac = crypto.createHmac('sha256', SECRET)
    hmac.update(encoded)
    const expected = hmac.digest('base64url')

    // Constant-time comparison
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null
    }

    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString())
    if (data.exp < Date.now()) return null

    return { username: data.username, id: data.id }
  } catch {
    return null
  }
}

export function getTokenFromHeader(request: Request): string | null {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

/**
 * Authentication middleware for API routes.
 * Usage: const auth = authenticate(request); if (!auth) return authResponse;
 */
export function authResponse(): NextResponse {
  return NextResponse.json({ code: 401, message: '未登录或登录已过期' }, { status: 401 })
}

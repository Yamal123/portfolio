import crypto from 'crypto'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'admin_session'
const TOKEN_EXPIRY = 2 * 60 * 60 * 1000

function secret() {
  const configured = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_JWT_SECRET
  if (configured) return configured
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET is required in production')
  }
  return 'development-only-session-secret'
}

export function createSession(payload: { username: string; id: number }): string {
  const encoded = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_EXPIRY })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifySession(token: string): { username: string; id: number } | null {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null
    const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as { username: string; id: number; exp: number }
    return data.exp > Date.now() ? { username: data.username, id: data.id } : null
  } catch {
    return null
  }
}

export function getSessionFromRequest(request: Request): string | null {
  const cookie = request.headers.get('cookie') || ''
  const value = cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))
  return value ? decodeURIComponent(value.slice(SESSION_COOKIE.length + 1)) : null
}

export function sessionCookie(value: string, maxAge = TOKEN_EXPIRY / 1000) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  }
}

export function authResponse(): NextResponse {
  return NextResponse.json({ code: 401, message: '未登录或登录已过期' }, { status: 401 })
}

import crypto from 'crypto'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'admin_session'
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_COMPLEXITY_LABEL = '密码需至少 8 位，且包含数字、小写字母、大写字母、特殊字符中的至少 3 类'

function secret() {
  const configured = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_JWT_SECRET
  if (configured) return configured
  return 'aipmym-fixed-admin-session-secret-2026'
}

export function hashAdminPassword(password: string, salt: string) {
  return crypto.createHash('md5').update(password + salt).digest('hex')
}

export function isStrongPassword(password: string) {
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSymbol = /[^a-zA-Z0-9]/.test(password)
  const kinds = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
  return password.length >= PASSWORD_MIN_LENGTH && kinds >= 3
}

export function passwordPolicyError(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) return '密码至少需要 8 个字符'
  if (!isStrongPassword(password)) return PASSWORD_COMPLEXITY_LABEL
  return null
}

export function getRequestFingerprint(request: Request) {
  const userAgent = request.headers.get('user-agent') || ''
  const acceptLanguage = request.headers.get('accept-language') || ''
  const forwarded = request.headers.get('x-forwarded-for') || ''
  return crypto.createHash('sha256').update([userAgent, acceptLanguage, forwarded].join('|')).digest('hex')
}

export type SessionPayload = {
  id: number
  username: string
  sessionVersion?: number
  fingerprint?: string
  exp: number
}

export function createSession(payload: Omit<SessionPayload, 'exp'>): string {
  const encoded = Buffer.from(JSON.stringify({
    ...payload,
    sessionVersion: payload.sessionVersion ?? 0,
    fingerprint: payload.fingerprint ?? '',
    exp: Date.now() + TOKEN_EXPIRY,
  })).toString('base64url')
  const signature = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
  return `${encoded}.${signature}`
}

export function verifySession(token: string, fingerprint = ''): SessionPayload | null {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) return null
    const expected = crypto.createHmac('sha256', secret()).update(encoded).digest('base64url')
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
    const data = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as SessionPayload
    if (!data || data.exp <= Date.now()) return null
    if (data.fingerprint !== fingerprint) return null
    return data
  } catch {
    return null
  }
}

export function getSessionFromRequest(request: Request) {
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

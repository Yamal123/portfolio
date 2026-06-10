import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createSession,
  getRequestFingerprint,
  hashAdminPassword,
  sessionCookie,
} from '@/lib/auth'
import { getSystemStore } from '@/lib/admin/system-store'

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(100),
})

type AttemptState = { count: number; resetAt: number }
const loginAttempts = new Map<string, AttemptState>()
const MAX_ATTEMPTS_PER_HOUR = 20
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'anonymous'
}

function isRateLimited(ip: string) {
  const now = Date.now()
  const current = loginAttempts.get(ip)
  if (!current || current.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS })
    return false
  }
  if (current.count >= MAX_ATTEMPTS_PER_HOUR) return true
  current.count += 1
  return false
}

export async function POST(request: Request) {
  try {
    const body = loginSchema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ code: 1001, message: '参数格式错误' }, { status: 400 })
    }

    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
      return NextResponse.json({ code: 1006, message: '登录过于频繁，请稍后重试' }, { status: 429 })
    }

    const store = getSystemStore()
    const user = store.findUserByUsername(body.data.username)
    if (!user || user.status !== 1) {
      return NextResponse.json({ code: 1002, message: '用户名或密码错误' }, { status: 401 })
    }

    if (user.locked_until && new Date(user.locked_until).getTime() > Date.now()) {
      return NextResponse.json({ code: 1010, message: '账号已锁定，请30分钟后重试' }, { status: 403 })
    }

    const expected = hashAdminPassword(body.data.password, user.salt)
    if (expected !== user.password) {
      const failedUser = store.recordAdminLoginFailure(user.id)
      if (failedUser?.locked_until && new Date(failedUser.locked_until).getTime() > Date.now()) {
        return NextResponse.json({ code: 1010, message: '账号已锁定，请30分钟后重试' }, { status: 403 })
      }
      return NextResponse.json({ code: 1002, message: '用户名或密码错误' }, { status: 401 })
    }

    store.updateUserLogin(user.id, ip)
    const sessionVersion = (store.bumpAdminSessionVersion(user.id) || 0)
    const fingerprint = getRequestFingerprint(request)
    const token = createSession({
      id: user.id,
      username: user.username,
      sessionVersion,
      fingerprint,
    })

    loginAttempts.delete(ip)
    store.addLog(user.id, user.nickname, 'login', 'auth', user.username, { action: '登录成功' }, ip)

    const response = NextResponse.json({
      code: 0,
      message: '登录成功',
      data: {
        userInfo: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          avatar: user.avatar,
          sessionVersion,
        },
      },
    })
    response.cookies.set(sessionCookie(token))
    return response
  } catch (error) {
    console.error('[Auth login]', error)
    return NextResponse.json({ code: 1020, message: '服务器内部错误' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSession, sessionCookie } from '@/lib/auth'

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const body = loginSchema.safeParse(await request.json())
    if (!body.success) {
      return NextResponse.json({ code: 400, message: '参数格式错误' }, { status: 400 })
    }

    const adminUser = process.env.ADMIN_USERNAME
    const adminPass = process.env.ADMIN_PASSWORD
    if (!adminUser || !adminPass) {
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ code: 503, message: '管理登录未配置' }, { status: 503 })
      }
    }
    const expectedUser = adminUser || 'admin'
    const expectedPass = adminPass || 'Admin@2026'
    if (body.data.username !== expectedUser || body.data.password !== expectedPass) {
      return NextResponse.json({ code: 401, message: '用户名或密码错误' }, { status: 401 })
    }

    const userInfo = {
      id: 1, username: expectedUser, nickname: '管理员', avatar: '', email: '',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    const response = NextResponse.json({ code: 0, message: '登录成功', data: { userInfo } })
    response.cookies.set(sessionCookie(createSession({ username: expectedUser, id: 1 })))
    return response
  } catch {
    return NextResponse.json({ code: 500, message: '服务器内部错误' }, { status: 500 })
  }
}

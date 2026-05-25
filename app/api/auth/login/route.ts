import { NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ code: 401, message: '用户名和密码不能为空' }, { status: 401 })
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ code: 400, message: '参数格式错误' }, { status: 400 })
    }

    if (username.length > 50 || password.length > 100) {
      return NextResponse.json({ code: 400, message: '输入过长' }, { status: 400 })
    }

    // Credentials from environment variables (fallback for local dev)
    const adminUser = process.env.ADMIN_USERNAME || 'admin'
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@2026'

    if (username !== adminUser || password !== adminPass) {
      return NextResponse.json({ code: 401, message: '用户名或密码错误' }, { status: 401 })
    }

    const token = createToken({ username: adminUser, id: 1 })

    return NextResponse.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: 1,
          username: adminUser,
          nickname: '管理员',
          avatar: '',
          email: 'admin@aipmym.com',
          created_at: new Date().toISOString(),
        }
      }
    })
  } catch {
    return NextResponse.json({ code: 500, message: '服务器内部错误' }, { status: 500 })
  }
}

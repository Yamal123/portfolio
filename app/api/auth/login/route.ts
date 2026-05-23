import { NextResponse } from 'next/server'

// Simple token generation without external dependencies
function createToken(username: string): string {
  const payload = {
    username,
    exp: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
    iat: Date.now(),
  }
  const json = JSON.stringify(payload)
  const encoded = Buffer.from(json).toString('base64')
  return `aipmym_${encoded}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Default admin credentials (same as the Express server)
    const isValid = username === 'admin' && password === 'Admin@2026'

    if (!isValid) {
      return NextResponse.json(
        { code: 401, message: '用户名或密码错误' },
        { status: 401 }
      )
    }

    const token = createToken(username)

    return NextResponse.json({
      code: 0,
      message: '登录成功',
      data: {
        token,
        userInfo: {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: '',
          email: 'admin@aipmym.com',
          created_at: new Date().toISOString(),
        }
      }
    })
  } catch {
    return NextResponse.json(
      { code: 500, message: '服务器内部错误' },
      { status: 500 }
    )
  }
}

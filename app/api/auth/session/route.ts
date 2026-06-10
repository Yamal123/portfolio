import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { getSystemStore } from '@/lib/admin/system-store'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth

  const store = getSystemStore()
  const user = store.getAdminUserById(auth.id)
  if (!user) return NextResponse.json({ code: 401, message: '未登录或登录已过期' }, { status: 401 })

  return NextResponse.json({
    code: 0,
    data: {
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      avatar: user.avatar,
      email: '',
      created_at: user.created_at || '',
      updated_at: user.updated_at || '',
      sessionVersion: user.session_version || 0,
    },
  })
}

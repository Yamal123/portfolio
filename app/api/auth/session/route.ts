import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({
    code: 0,
    data: { id: auth.id, username: auth.username, nickname: '管理员', email: '', created_at: '', updated_at: '' },
  })
}

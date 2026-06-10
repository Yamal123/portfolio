import { NextResponse } from 'next/server'
import { SESSION_COOKIE, sessionCookie } from '@/lib/auth'
import { checkAuth } from '@/lib/auth/middleware'
import { getSystemStore } from '@/lib/admin/system-store'

export async function POST(request: Request) {
  const auth = checkAuth(request)
  if (!(auth instanceof NextResponse)) {
    const store = getSystemStore()
    store.bumpAdminSessionVersion(auth.id)
  }

  const response = NextResponse.json({ code: 0, message: '已退出' })
  response.cookies.set({ ...sessionCookie('', 0), name: SESSION_COOKIE })
  return response
}

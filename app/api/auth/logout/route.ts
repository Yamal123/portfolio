import { NextResponse } from 'next/server'
import { SESSION_COOKIE, sessionCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ code: 0, message: '已退出' })
  response.cookies.set({ ...sessionCookie('', 0), name: SESSION_COOKIE })
  return response
}

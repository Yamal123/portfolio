import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, data: { site_title: 'PM 思钱想厚', copyright: '© Yu Meng' } })
}

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '已保存' })
}

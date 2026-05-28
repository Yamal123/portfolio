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
  return NextResponse.json({ code: 501, message: '站点设置尚未开放编辑，请在个人资料或 Agent 配置中修改可发布内容' }, { status: 501 })
}

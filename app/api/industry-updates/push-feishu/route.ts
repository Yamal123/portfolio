import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { pushIndustryUpdateToFeishu } from '@/lib/industry/service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  try {
    const body = await request.json().catch(() => null) as { slug?: string } | null
    if (!body?.slug) return NextResponse.json({ code: 400, message: '缺少 slug' }, { status: 400 })
    const data = await pushIndustryUpdateToFeishu(body.slug)
    return NextResponse.json({ code: 0, data, message: '已推送飞书' })
  } catch (error) {
    console.error('[Push industry update to Feishu]', error)
    return NextResponse.json({ code: 503, message: error instanceof Error ? error.message : '推送失败' }, { status: 503 })
  }
}

import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { generateDailyIndustryUpdate } from '@/lib/industry/service'

export const dynamic = 'force-dynamic'

function allowed(request: Request) {
  const configuredSecret = process.env.INDUSTRY_CRON_SECRET
  const providedSecret = request.headers.get('x-cron-secret') || ''
  if (configuredSecret && providedSecret === configuredSecret) return true
  return !(checkAuth(request) instanceof NextResponse)
}

export async function POST(request: Request) {
  if (!allowed(request)) return NextResponse.json({ code: 401, message: '未授权' }, { status: 401 })
  try {
    const body = await request.json().catch(() => ({})) as { date?: string }
    const data = await generateDailyIndustryUpdate(body.date)
    return NextResponse.json({ code: 0, data, message: '行业动态日报已生成' })
  } catch (error) {
    console.error('[Generate daily industry update]', error)
    return NextResponse.json({ code: 503, message: error instanceof Error ? error.message : '生成失败' }, { status: 503 })
  }
}

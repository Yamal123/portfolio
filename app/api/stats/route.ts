import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'anonymous'
}

export async function GET() {
  const store = getSystemStore()
  return NextResponse.json({
    code: 0,
    data: store.getStats(),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const pagePath = typeof body?.pagePath === 'string' ? body.pagePath : '/'
    const duration = Number.isFinite(Number(body?.duration)) ? Number(body.duration) : 0
    const store = getSystemStore()
    const visit = store.recordVisit(
      getClientIp(request),
      request.headers.get('user-agent') || '',
      pagePath,
      duration,
    )
    return NextResponse.json({ code: 0, message: '已记录', data: visit })
  } catch (error) {
    console.error('[Stats POST]', error)
    return NextResponse.json({ code: 503, message: '记录失败' }, { status: 503 })
  }
}

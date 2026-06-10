import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const start = url.searchParams.get('start') || undefined
  const end = url.searchParams.get('end') || undefined
  const store = getSystemStore()
  return NextResponse.json({
    code: 0,
    data: store.getAnalyticsTrend({ start, end }),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

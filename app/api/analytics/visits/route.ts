import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

export async function GET(request: Request) {
  const limitParam = new URL(request.url).searchParams.get('limit')
  const limit = Math.max(1, Math.min(100, Number(limitParam || 20) || 20))
  const store = getSystemStore()

  return NextResponse.json({
    code: 0,
    data: {
      list: store.getRecentVisits(limit),
      total: store.data?.visitStats?.length || 0,
    },
  }, { headers: { 'Cache-Control': 'no-store' } })
}

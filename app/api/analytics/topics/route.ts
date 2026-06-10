import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

function parseRange(request: Request) {
  const url = new URL(request.url)
  return {
    start: url.searchParams.get('start') || '',
    end: url.searchParams.get('end') || '',
    limit: Math.max(1, Math.min(20, Number(url.searchParams.get('limit') || 10) || 10)),
  }
}

export async function GET(request: Request) {
  const { start, end, limit } = parseRange(request)
  const store = getSystemStore()
  return NextResponse.json({
    code: 0,
    data: store.getHotTopics({ start, end, limit }),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

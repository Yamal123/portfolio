import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

function parseQuery(request: Request) {
  const url = new URL(request.url)
  return {
    start: url.searchParams.get('start') || '',
    end: url.searchParams.get('end') || '',
    keyword: url.searchParams.get('q') || url.searchParams.get('keyword') || '',
    page: Math.max(1, Math.min(100, Number(url.searchParams.get('page') || 1) || 1)),
    pageSize: Math.max(1, Math.min(50, Number(url.searchParams.get('pageSize') || 10) || 10)),
  }
}

export async function GET(request: Request) {
  const query = parseQuery(request)
  const store = getSystemStore()
  return NextResponse.json({
    code: 0,
    data: store.getAgentSessions(query),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

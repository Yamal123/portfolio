import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

function toNumber(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = toNumber(url.searchParams.get('page'), 1)
  const pageSize = toNumber(url.searchParams.get('pageSize'), 10)
  const actionType = url.searchParams.get('actionType') || undefined
  const targetModule = url.searchParams.get('targetModule') || undefined
  const store = getSystemStore()

  return NextResponse.json({
    code: 0,
    data: store.getLogs({ page, pageSize, actionType, targetModule }),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

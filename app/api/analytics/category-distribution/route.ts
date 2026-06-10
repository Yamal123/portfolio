import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

export async function GET() {
  const store = getSystemStore()
  return NextResponse.json({
    code: 0,
    data: store.getCategoryDistribution(),
  }, { headers: { 'Cache-Control': 'no-store' } })
}

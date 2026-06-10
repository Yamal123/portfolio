import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id)
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ code: 400, message: '日志 ID 无效' }, { status: 400 })
  }

  const store = getSystemStore()
  const item = (store.data?.adminLogs || []).find((log: any) => Number(log.id) === id)
  if (!item) {
    return NextResponse.json({ code: 404, message: '日志不存在' }, { status: 404 })
  }

  return NextResponse.json({ code: 0, data: item }, { headers: { 'Cache-Control': 'no-store' } })
}

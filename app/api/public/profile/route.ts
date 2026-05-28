import { NextResponse } from 'next/server'
import { getPublicProfile } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    return NextResponse.json({ code: 0, data: await getPublicProfile() }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Public profile]', error)
    return NextResponse.json({ code: 503, message: '内容服务暂不可用' }, { status: 503 })
  }
}

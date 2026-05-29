import { NextResponse } from 'next/server'
import { getIndustryUpdate, listIndustryUpdates } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const slug = url.searchParams.get('slug')
    const query = url.searchParams.get('q') || undefined
    const data = slug ? await getIndustryUpdate(slug) : await listIndustryUpdates({ query })
    return NextResponse.json({ code: 0, data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Public industry updates]', error)
    return NextResponse.json({ code: 503, message: '内容服务暂不可用' }, { status: 503 })
  }
}

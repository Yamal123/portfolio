import { NextResponse } from 'next/server'
import { getArticle, listArticles } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const slug = new URL(request.url).searchParams.get('slug')
    const data = slug ? await getArticle(slug) : await listArticles()
    return NextResponse.json({ code: 0, data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Public methods]', error)
    return NextResponse.json({ code: 503, message: '内容服务暂不可用' }, { status: 503 })
  }
}

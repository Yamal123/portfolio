import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { deleteIndustryUpdate, getIndustryUpdate, saveIndustryUpdate } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

type BulkAction = 'delete' | 'publish' | 'unpublish'

function rejectUnlessAuthenticated(request: Request) {
  const auth = checkAuth(request)
  return auth instanceof NextResponse ? auth : null
}

function normalizeAction(value: unknown): BulkAction | null {
  return value === 'delete' || value === 'publish' || value === 'unpublish' ? value : null
}

export async function POST(request: Request) {
  const unauthorized = rejectUnlessAuthenticated(request)
  if (unauthorized) return unauthorized

  const body = await request.json().catch(() => null)
  const slugs = Array.isArray(body?.slugs) ? body.slugs.filter((slug: unknown) => typeof slug === 'string' && slug.trim()) : []
  const action = normalizeAction(body?.action)

  if (!action) {
    return NextResponse.json({ code: 400, message: '批量操作类型无效' }, { status: 400 })
  }
  if (slugs.length === 0) {
    return NextResponse.json({ code: 400, message: '缺少选择项' }, { status: 400 })
  }

  try {
    if (action === 'delete') {
      await Promise.all(slugs.map((slug: string) => deleteIndustryUpdate(slug)))
    } else {
      const published = action === 'publish'
      for (const slug of slugs) {
        const item = await getIndustryUpdate(slug, true)
        if (!item) continue
        await saveIndustryUpdate({
          slug: item.slug,
          title: item.title,
          intro: item.intro,
          keywords: item.keywords,
          content: item.content,
          coverImage: item.coverImage,
          sources: item.sources,
          newsItems: item.newsItems,
          techItems: item.techItems,
          published,
          createdAt: item.createdAt,
        }, true)
      }
    }

    return NextResponse.json({
      code: 0,
      message: action === 'delete' ? '行业动态已批量删除' : action === 'publish' ? '行业动态已批量发布' : '行业动态已批量取消发布',
      data: { count: slugs.length, slugs },
    })
  } catch (error) {
    console.error('[Management industry updates bulk]', error)
    return NextResponse.json({ code: 503, message: '批量操作失败' }, { status: 503 })
  }
}

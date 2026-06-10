import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { deleteArticle, getArticle, saveArticle } from '@/lib/content/repository'

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
      const items = await Promise.all(slugs.map((slug: string) => getArticle(slug, true)))
      const missingSlug = slugs[items.findIndex((item) => !item)] || ''
      if (missingSlug) {
        return NextResponse.json({ code: 404, message: `文章不存在：${missingSlug}` }, { status: 404 })
      }
      await Promise.all(slugs.map((slug: string) => deleteArticle(slug)))
    } else {
      const published = action === 'publish'
      for (const slug of slugs) {
        const item = await getArticle(slug, true)
        if (!item) {
          return NextResponse.json({ code: 404, message: `文章不存在：${slug}` }, { status: 404 })
        }
        if (published && item.published) {
          return NextResponse.json({ code: 409, message: `文章已发布，不能重复发布：${item.title.zh}` }, { status: 409 })
        }
        if (!published && !item.published) {
          return NextResponse.json({ code: 409, message: `文章非已发布状态，不能下架：${item.title.zh}` }, { status: 409 })
        }
        await saveArticle({
          slug: item.slug,
          title: item.title,
          intro: item.intro,
          keywords: item.keywords,
          content: item.content,
          published,
          wasPublished: true,
          createdAt: item.createdAt,
        }, true)
      }
    }

    return NextResponse.json({
      code: 0,
      message: action === 'delete' ? '文章已批量删除' : action === 'publish' ? '文章已批量发布' : '文章已批量下架',
      data: { count: slugs.length, slugs },
    })
  } catch (error) {
    console.error('[Management articles bulk]', error)
    return NextResponse.json({ code: 503, message: '批量操作失败' }, { status: 503 })
  }
}

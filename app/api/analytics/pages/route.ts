import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'
import { listArticles, listIndustryUpdates, listProjects } from '@/lib/content/repository'

function parseRange(request: Request) {
  const url = new URL(request.url)
  return {
    start: url.searchParams.get('start') || '',
    end: url.searchParams.get('end') || '',
    limit: Math.max(1, Math.min(20, Number(url.searchParams.get('limit') || 8) || 8)),
  }
}

function withinRange(visitDate: string, start: string, end: string) {
  if (start && visitDate < start) return false
  if (end && visitDate > end) return false
  return true
}

export async function GET(request: Request) {
  const { start, end, limit } = parseRange(request)
  const store = getSystemStore()
  const visits = (store.data?.visitStats || []).filter((item: any) => withinRange(item.visit_date || item.created_at?.slice(0, 10) || '', start, end))

  const [projects, articles, updates] = await Promise.all([
    listProjects({ admin: true }),
    listArticles({ admin: true }),
    listIndustryUpdates({ admin: true }),
  ])

  const titleMap = new Map<string, { title: string; href: string }>()
  titleMap.set('/', { title: '首页', href: '/' })
  titleMap.set('/portfolio', { title: '作品集', href: '/portfolio' })
  titleMap.set('/blog', { title: '方法论', href: '/blog' })
  titleMap.set('/industry', { title: '行业动态', href: '/industry' })

  projects.forEach((project) => titleMap.set(`/portfolio/${project.slug}`, { title: project.name.zh, href: `/portfolio/${project.slug}` }))
  articles.forEach((article) => titleMap.set(`/blog/${article.slug}`, { title: article.title.zh, href: `/blog/${article.slug}` }))
  updates.forEach((update) => titleMap.set(`/industry/${update.slug}`, { title: update.title.zh, href: `/industry/${update.slug}` }))

  const pageMap = new Map<string, { pagePath: string; title: string; href: string; pv: number; uvSet: Set<string> }>()
  visits.forEach((visit: any) => {
    const pagePath = String(visit.page_path || '/')
    const key = pagePath
    const existing = pageMap.get(key) || {
      pagePath,
      title: titleMap.get(pagePath)?.title || pagePath,
      href: titleMap.get(pagePath)?.href || pagePath,
      pv: 0,
      uvSet: new Set<string>(),
    }
    existing.pv += 1
    existing.uvSet.add(String(visit.ip_address || ''))
    pageMap.set(key, existing)
  })

  const list = [...pageMap.values()]
    .map((item) => ({
      pagePath: item.pagePath,
      title: item.title,
      href: item.href,
      pv: item.pv,
      uv: item.uvSet.size,
    }))
    .sort((a, b) => b.pv - a.pv || b.uv - a.uv)
    .slice(0, limit)

  if (list.length === 0) {
    const fallback = [...titleMap.entries()]
      .map(([pagePath, value]) => ({
        pagePath,
        title: value.title,
        href: value.href,
        pv: 0,
        uv: 0,
      }))
      .slice(0, limit)

    return NextResponse.json(
      {
        code: 0,
        data: fallback,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  }

  return NextResponse.json({
    code: 0,
    data: list,
  }, { headers: { 'Cache-Control': 'no-store' } })
}

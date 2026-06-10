import { NextResponse } from 'next/server'
import { getSystemStore } from '@/lib/admin/system-store'
import { listArticles } from '@/lib/content/repository'

function parseRange(request: Request) {
  const url = new URL(request.url)
  const end = url.searchParams.get('end') || new Date().toISOString().slice(0, 10)
  const start = url.searchParams.get('start') || (() => {
    const date = new Date(`${end}T00:00:00`)
    date.setDate(date.getDate() - 6)
    return date.toISOString().slice(0, 10)
  })()
  return { start, end }
}

function inRange(visitDate: string, start: string, end: string) {
  if (!visitDate) return false
  return visitDate >= start && visitDate <= end
}

export async function GET(request: Request) {
  const store = getSystemStore()
  const { start, end } = parseRange(request)
  const visits = (store.data?.visitStats || []).filter((item: any) => inRange(item.visit_date || item.created_at?.slice(0, 10) || '', start, end))
  const uv = new Set(visits.map((item: any) => String(item.ip_address || '')).filter(Boolean)).size
  const articles = await listArticles({ admin: true })

  return NextResponse.json(
    {
      code: 0,
      data: {
        total_pv: visits.length,
        total_uv: uv,
        total_articles: articles.length,
        start,
        end,
      },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

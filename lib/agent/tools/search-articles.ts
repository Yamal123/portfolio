import { listArticles } from '@/lib/content/repository'
import type { AgentTool } from '../types'

export const searchArticlesTool: AgentTool = {
  name: 'search_articles',
  description: '搜索已发布的方法论/博客文章',
  parameters: { type: 'object', properties: {
    query: { type: 'string', description: '搜索关键词；留空返回最新文章' },
    limit: { type: 'number', description: '返回条数上限，默认 5' },
  }},
  async execute(args) {
    const rows = (await listArticles({ query: String(args.query || '').trim() })).slice(0, Math.max(1, Math.min(Number(args.limit) || 5, 10)))
    return { success: true, data: { total: rows.length, items: rows.map((row) => ({
      id: row.id, title: row.title.zh, intro: row.intro.zh, date: row.createdAt, url: `/blog/${row.slug}`,
    }))}}
  },
}

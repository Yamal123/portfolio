import { articlesData } from '@/data/articles'
import type { AgentTool } from '../types'

export const searchArticlesTool: AgentTool = {
  name: 'search_articles',
  description: '搜索方法论/博客文章',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '搜索关键词，如 RAG、Agent、供应链；留空返回最新文章',
      },
      limit: {
        type: 'number',
        description: '返回条数上限，默认 5',
      },
    },
  },
  async execute(args) {
    const query = String(args.query || '').toLowerCase().trim()
    const limit = Math.min(Number(args.limit) || 5, 10)

    const matched = query
      ? articlesData.filter(
          (a) =>
            a.title.zh.toLowerCase().includes(query) ||
            a.title.en.toLowerCase().includes(query) ||
            a.intro.zh.toLowerCase().includes(query) ||
            a.keywords.some((k) => k.toLowerCase().includes(query))
        )
      : articlesData

    const items = matched.slice(0, limit).map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title.zh,
      intro: a.intro.zh,
      date: a.createdAt,
      url: `/blog/${a.slug}`,
    }))

    return {
      success: true,
      data: { total: matched.length, items },
    }
  },
}

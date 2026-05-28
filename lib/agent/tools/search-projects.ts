import { listProjects } from '@/lib/content/repository'
import type { AgentTool } from '../types'

export const searchProjectsTool: AgentTool = {
  name: 'search_projects',
  description: '搜索网站上的已发布项目/作品集，可按关键词筛选',
  parameters: { type: 'object', properties: {
    query: { type: 'string', description: '搜索关键词；留空返回项目摘要' },
    limit: { type: 'number', description: '返回条数上限，默认 5' },
  }},
  async execute(args) {
    const query = String(args.query || '').trim()
    const limit = Math.max(1, Math.min(Number(args.limit) || 5, 10))
    const rows = (await listProjects({ query })).slice(0, limit)
    return { success: true, data: {
      total: rows.length,
      items: rows.map((row) => ({
        id: row.id, name: row.name.zh, type: row.type.zh, intro: row.intro.zh,
        tags: row.tags, url: `/portfolio/${row.slug}`,
      })),
    }}
  },
}

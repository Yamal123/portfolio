import { projectsData } from '@/data/projects'
import type { AgentTool } from '../types'

export const searchProjectsTool: AgentTool = {
  name: 'search_projects',
  description: '搜索网站上的项目/作品集，可按关键词、技术栈或项目类型筛选',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '搜索关键词，如 AI、供应链、Next.js；留空则返回全部项目摘要',
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
      ? projectsData.filter(
          (p) =>
            p.name.zh.toLowerCase().includes(query) ||
            p.name.en.toLowerCase().includes(query) ||
            p.intro.zh.toLowerCase().includes(query) ||
            p.type.zh.toLowerCase().includes(query) ||
            p.tags.some((t) => t.toLowerCase().includes(query))
        )
      : projectsData

    const items = matched.slice(0, limit).map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name.zh,
      type: p.type.zh,
      intro: p.intro.zh,
      tags: p.tags,
      url: `/portfolio/${p.slug}`,
    }))

    return {
      success: true,
      data: { total: matched.length, items },
    }
  },
}

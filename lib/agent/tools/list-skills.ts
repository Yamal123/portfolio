import { skillsData } from '@/data/skills'
import type { AgentTool } from '../types'

const categoryLabels: Record<string, string> = {
  ai: 'AI 能力',
  product: '产品能力',
  technical: '技术技能',
  soft: '软技能',
}

export const listSkillsTool: AgentTool = {
  name: 'list_skills',
  description: '列出作者的技能专长，可按类别筛选',
  parameters: {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        description: '技能类别：ai | product | technical | soft，留空返回全部',
        enum: ['ai', 'product', 'technical', 'soft'],
      },
      query: {
        type: 'string',
        description: '按技能名称关键词过滤',
      },
    },
  },
  async execute(args) {
    const category = args.category ? String(args.category) : ''
    const query = String(args.query || '').toLowerCase().trim()

    let list = skillsData
    if (category) {
      list = list.filter((s) => s.category === category)
    }
    if (query) {
      list = list.filter(
        (s) =>
          s.name.zh.toLowerCase().includes(query) ||
          s.name.en.toLowerCase().includes(query)
      )
    }

    const items = list.map((s) => ({
      name: s.name.zh,
      level: s.level,
      category: categoryLabels[s.category] || s.category,
    }))

    return {
      success: true,
      data: { total: items.length, items },
    }
  },
}

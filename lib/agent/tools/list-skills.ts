import { listSkills } from '@/lib/content/repository'
import type { AgentTool } from '../types'

const labels: Record<string, string> = { ai: 'AI 能力', product: '产品能力', technical: '技术技能', soft: '软技能' }

export const listSkillsTool: AgentTool = {
  name: 'list_skills',
  description: '列出作者的公开技能专长，可按类别筛选',
  parameters: { type: 'object', properties: {
    category: { type: 'string', description: '技能类别', enum: ['ai', 'product', 'technical', 'soft'] },
    query: { type: 'string', description: '技能名称关键词' },
  }},
  async execute(args) {
    const rows = await listSkills(String(args.query || ''), args.category ? String(args.category) : undefined)
    return { success: true, data: { total: rows.length, items: rows.map((row) => ({
      name: row.nameZh, level: row.level, category: labels[row.category] || row.category,
    }))}}
  },
}

import type { AgentTool } from '../types'
import { agentConfig } from '../config'

export const getContactTool: AgentTool = {
  name: 'get_contact_info',
  description: '获取作者联系方式与社交链接',
  parameters: {
    type: 'object',
    properties: {},
  },
  async execute() {
    return {
      success: true,
      data: {
        name: '余猛',
        email: 'yumeng@aipmym.com',
        site: agentConfig.siteUrl,
        links: [
          { label: 'GitHub', url: 'https://github.com/Yamal123' },
          { label: 'LinkedIn', url: 'https://linkedin.com' },
          { label: '知乎', url: 'https://zhihu.com' },
        ],
        hint: '可在首页「关于我」区块查看完整联系方式',
      },
    }
  },
}

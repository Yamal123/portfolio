import type { AgentTool } from '../types'
import { agentConfig } from '../config'

export const getSiteInfoTool: AgentTool = {
  name: 'get_site_info',
  description: '获取网站导航与页面结构，帮助用户跳转到对应板块',
  parameters: {
    type: 'object',
    properties: {},
  },
  async execute() {
    return {
      success: true,
      data: {
        siteName: agentConfig.siteName,
        siteUrl: agentConfig.siteUrl,
        sections: [
          { id: 'home', label: '首页', path: '/#home' },
          { id: 'portfolio', label: '作品集', path: '/portfolio' },
          { id: 'blog', label: '方法论', path: '/blog' },
          { id: 'about', label: '关于我', path: '/#about' },
        ],
        description:
          '余猛的个人品牌网站，展示 AI 产品经理的作品集、方法论文章与个人简介',
      },
    }
  },
}

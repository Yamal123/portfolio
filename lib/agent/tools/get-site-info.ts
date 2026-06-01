import { SITE_NAV_ITEMS, getNavLabel } from '@/lib/site-navigation'
import type { AgentTool } from '../types'

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
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'PM 思钱想厚',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yumeng.dev',
        sections: SITE_NAV_ITEMS.map((item) => ({
          id: item.id,
          label: getNavLabel(item, 'zh'),
          path: item.href,
        })),
        description:
          '余猛的个人品牌网站，展示 AI 产品经理的作品集、方法论文章与个人简介',
      },
    }
  },
}

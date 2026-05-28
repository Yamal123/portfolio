import { getProfile } from '@/lib/content/repository'
import type { AgentTool } from '../types'

export const getContactTool: AgentTool = {
  name: 'get_contact_info',
  description: '获取作者公开联系方式与社交链接',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const profile = await getProfile()
    if (!profile) return { success: false, error: '联系方式未配置' }
    const links = [
      profile.contact.github && { label: 'GitHub', url: profile.contact.github },
      profile.contact.linkedin && { label: 'LinkedIn', url: profile.contact.linkedin },
      profile.contact.zhihu && { label: '知乎', url: profile.contact.zhihu },
    ].filter(Boolean)
    return { success: true, data: {
      name: profile.nickname,
      email: profile.contact.emailDisplayed ? profile.contact.email : '',
      phone: profile.contact.phoneDisplayed ? profile.contact.phone : '',
      wechatId: profile.contact.wechatDisplayed ? profile.contact.wechatId : '',
      links,
    }}
  },
}

import { getProfile } from '@/lib/content/repository'
import { getPublicContact } from '@/lib/content/contact-utils'
import type { AgentTool } from '../types'

export const getContactTool: AgentTool = {
  name: 'get_contact_info',
  description: '获取作者公开联系方式与社交链接',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const profile = await getProfile()
    if (!profile) return { success: false, error: '联系方式未配置' }
    const contact = getPublicContact(profile.contact)
    const links = [
      contact.github && { label: 'GitHub', url: contact.github },
      contact.linkedin && { label: 'LinkedIn', url: contact.linkedin },
      contact.zhihu && { label: '知乎', url: contact.zhihu },
    ].filter(Boolean) as Array<{ label: string; url: string }>
    return { success: true, data: {
      name: profile.nickname,
      email: contact.email,
      phone: contact.phone,
      wechatId: contact.wechatId,
      links,
    }}
  },
}

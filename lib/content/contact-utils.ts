import type { ProfileInput } from './contracts'

type Contact = ProfileInput['contact']

function hasText(value: string) {
  return value.trim().length > 0
}

export function normalizeExternalContactUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed
  if (trimmed.startsWith('//')) return `https:${trimmed}`
  return `https://${trimmed}`
}

export function getPublicContact(contact: Contact) {
  const email = contact.emailDisplayed && hasText(contact.email) ? contact.email.trim() : ''
  const phone = contact.phoneDisplayed && hasText(contact.phone) ? contact.phone.trim() : ''
  const wechatId = contact.wechatDisplayed && hasText(contact.wechatId) ? contact.wechatId.trim() : ''
  const wechatQrcode = contact.wechatDisplayed && hasText(contact.wechatQrcode) ? contact.wechatQrcode.trim() : ''

  return {
    ...contact,
    email,
    phone,
    wechatId,
    wechatQrcode,
    linkedin: hasText(contact.linkedin) ? normalizeExternalContactUrl(contact.linkedin) : '',
    github: hasText(contact.github) ? normalizeExternalContactUrl(contact.github) : '',
    zhihu: hasText(contact.zhihu) ? normalizeExternalContactUrl(contact.zhihu) : '',
  }
}

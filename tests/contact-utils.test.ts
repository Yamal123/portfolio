import { describe, expect, it } from 'vitest'
import { getPublicContact, normalizeExternalContactUrl } from '@/lib/content/contact-utils'

describe('contact utilities', () => {
  it('normalizes bare external urls for social links', () => {
    expect(normalizeExternalContactUrl('github.com/Yamal123')).toBe('https://github.com/Yamal123')
    expect(normalizeExternalContactUrl('https://zhihu.com/people/test')).toBe('https://zhihu.com/people/test')
  })

  it('hides empty public contacts and keeps only visible populated ones', () => {
    const contact = getPublicContact({
      email: '  hello@example.com  ',
      phone: '',
      wechatId: '  ',
      wechatQrcode: '',
      linkedin: 'linkedin.com/in/test',
      github: '',
      zhihu: '  zhihu.com/people/test  ',
      emailDisplayed: true,
      phoneDisplayed: true,
      wechatDisplayed: false,
    })

    expect(contact.email).toBe('hello@example.com')
    expect(contact.phone).toBe('')
    expect(contact.wechatId).toBe('')
    expect(contact.wechatQrcode).toBe('')
    expect(contact.linkedin).toBe('https://linkedin.com/in/test')
    expect(contact.github).toBe('')
    expect(contact.zhihu).toBe('https://zhihu.com/people/test')
  })
})

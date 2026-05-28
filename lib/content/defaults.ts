import type { ProfileInput } from './contracts'

export const defaultProfileInput: ProfileInput = {
  nickname: 'Yu Meng',
  avatar: '/images/profile-avatar.png',
  titleZh: '',
  titleEn: '',
  bioZh: '',
  bioEn: '',
  yearsOfExperience: 0,
  successRate: 0,
  efficiencyGain: 0,
  contact: {
    email: '',
    phone: '',
    wechatId: '',
    wechatQrcode: '',
    linkedin: '',
    github: '',
    zhihu: '',
    emailDisplayed: true,
    phoneDisplayed: false,
    wechatDisplayed: false,
  },
  experiences: [],
}

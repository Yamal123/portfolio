/**
 * 后台四大核心模块元数据模型
 *
 * 模块关系：
 *   Profile ───1:1─── Contact
 *   Profile ───1:N─── Skill
 *   Profile ───1:N─── Experience
 *   Project ───独立─── 作品集管理
 *   Article  ───独立─── 方法论管理
 *   Agent    ───独立─── Agent配置与监控
 */

// ===== 个人信息管理 =====

export interface Profile {
  nickname: string
  avatar: string
  titleZh: string
  titleEn: string
  bioZh: string
  bioEn: string
  yearsOfExperience: number
  successRate: number
  updatedAt: string
}

export interface Contact {
  email: string
  phone: string
  wechatId: string
  wechatQrcode: string
  linkedin: string
  github: string
  zhihu: string
  emailDisplayed: boolean
  phoneDisplayed: boolean
  wechatDisplayed: boolean
}

export interface Skill {
  id: number
  nameZh: string
  nameEn: string
  level: number        // 0-100
  category: 'ai' | 'product' | 'technical' | 'soft'
  sortNum: number
}

export interface Experience {
  id: number
  companyZh: string
  companyEn: string
  roleZh: string
  roleEn: string
  period: string       // "2023 - Present"
  locationZh: string
  locationEn: string
  descriptionZh: string
  descriptionEn: string
  sortNum: number
}

// ===== 作品集管理 =====

export interface ProjectMeta {
  id: number
  slug: string
  titleZh: string
  titleEn: string
  thumbnail?: string
  typeZh: string
  typeEn: string
  introZh: string
  introEn: string
  keywords: string[]
  tags: string[]
  emoji: string
  problemZh: string
  problemEn: string
  actionZh: string
  actionEn: string
  resultZh: string
  resultEn: string
  createdAt: string
  contentType: 'markdown' | 'html' | 'docx' | 'pptx' | 'pdf' | 'none'
  contentFile?: string | null
  externalUrl?: string
  viewCount: number
}

// ===== 方法论管理 =====

export interface ArticleMeta {
  id: number
  slug: string
  titleZh: string
  titleEn: string
  introZh: string
  introEn: string
  keywords: string[]
  createdAt: string
  contentType: 'markdown' | 'html' | 'docx' | 'pptx' | 'pdf' | 'none'
  contentFile?: string | null
}

// ===== Agent管理 =====

export interface AgentConfig {
  mode: 'rules' | 'llm' | 'auto'
  model: string
  baseUrl: string
  maxToolRounds: number
  siteName: string
  siteUrl: string
}

export interface AgentTool {
  name: string
  descriptionZh: string
  descriptionEn: string
  enabled: boolean
  category: 'query' | 'action' | 'system'
}

import { z } from 'zod'

const localText = z.string().trim().max(20000)
const slug = z.string().trim().min(1).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
const strings = z.array(z.string().trim().min(1).max(80)).max(20)

export const projectInputSchema = z.object({
  id: z.number().int().positive().optional(),
  slug,
  name: z.object({ zh: localText.min(1), en: localText.min(1) }),
  thumbnail: z.string().trim().max(500).default(''),
  type: z.object({ zh: localText.min(1), en: localText.min(1) }),
  intro: z.object({ zh: localText, en: localText }),
  keywords: strings.default([]),
  tags: strings.default([]),
  emoji: z.string().max(16).default(''),
  problem: z.object({ zh: localText, en: localText }),
  action: z.object({ zh: localText, en: localText }),
  result: z.object({ zh: localText, en: localText }),
  content: z.object({ zh: localText, en: localText }),
  externalUrl: z.string().trim().max(500).default(''),
  published: z.boolean().default(true),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  createdAt: z.string().optional(),
})

export const articleInputSchema = z.object({
  id: z.number().int().positive().optional(),
  slug,
  title: z.object({ zh: localText.min(1), en: localText.min(1) }),
  intro: z.object({ zh: localText, en: localText }),
  keywords: strings.default([]),
  content: z.object({ zh: localText, en: localText }),
  published: z.boolean().default(true),
  createdAt: z.string().min(1),
})

const experienceSchema = z.object({
  companyZh: localText.default(''),
  companyEn: localText.default(''),
  roleZh: localText.default(''),
  roleEn: localText.default(''),
  period: localText.default(''),
  locationZh: localText.default(''),
  locationEn: localText.default(''),
  descriptionZh: localText.default(''),
  descriptionEn: localText.default(''),
})

export const profileInputSchema = z.object({
  nickname: localText.min(1),
  avatar: z.string().trim().max(500).default(''),
  titleZh: localText,
  titleEn: localText,
  bioZh: localText,
  bioEn: localText,
  yearsOfExperience: z.number().int().min(0).max(99),
  successRate: z.number().int().min(0).max(100),
  efficiencyGain: z.number().int().min(0).max(1000),
  contact: z.object({
    email: z.string().trim().max(200).default(''),
    phone: z.string().trim().max(50).default(''),
    wechatId: z.string().trim().max(80).default(''),
    wechatQrcode: z.string().trim().max(500).default(''),
    linkedin: z.string().trim().max(500).default(''),
    github: z.string().trim().max(500).default(''),
    zhihu: z.string().trim().max(500).default(''),
    emailDisplayed: z.boolean(),
    phoneDisplayed: z.boolean(),
    wechatDisplayed: z.boolean(),
  }),
  experiences: z.array(experienceSchema).max(20).default([]),
})

export const agentConfigInputSchema = z.object({
  mode: z.enum(['rules', 'llm', 'auto']),
  provider: z.string().trim().min(1).max(50),
  model: z.string().trim().min(1).max(100),
  baseUrl: z.string().url().max(500),
  maxToolRounds: z.number().int().min(1).max(10),
  systemPrompt: z.string().trim().min(1).max(10000),
  welcomeMessage: z.object({ zh: localText.min(1), en: localText.min(1) }),
  quickQuestions: z.array(z.object({ zh: localText.min(1), en: localText.min(1) })).min(1).max(8),
})

export const skillInputSchema = z.object({
  id: z.number().int().positive().optional(),
  nameZh: localText.min(1),
  nameEn: localText.min(1),
  level: z.number().int().min(0).max(100),
  category: z.enum(['ai', 'product', 'technical', 'soft']),
  sortOrder: z.number().int().min(0).max(10000).default(0),
  enabled: z.boolean().default(true),
})

export type ProjectInput = z.infer<typeof projectInputSchema>
export type ArticleInput = z.infer<typeof articleInputSchema>
export type ProfileInput = z.infer<typeof profileInputSchema>
export type AgentConfigInput = z.infer<typeof agentConfigInputSchema>
export type SkillInput = z.infer<typeof skillInputSchema>

import { getAgentConfig } from '@/lib/content/repository'
import type { AgentMode } from './types'
import type { AgentConfigInput } from '@/lib/content/contracts'

export interface RuntimeAgentConfig {
  mode: AgentMode
  provider: string
  openaiApiKey: string
  openaiModel: string
  openaiBaseUrl: string
  maxToolRounds: number
  systemPrompt: string
  welcomeMessage: { zh: string; en: string }
  quickQuestions: Array<{ zh: string; en: string }>
  siteName: string
  siteUrl: string
  apiKeyConfigured: boolean
}

const fallbackAgentConfig: AgentConfigInput = {
  mode: 'rules',
  provider: 'openai',
  model: 'gpt-4o-mini',
  baseUrl: 'https://api.openai.com/v1',
  maxToolRounds: 4,
  systemPrompt: '你是个人网站智能助手，需要基于网站内容回答访客问题。',
  welcomeMessage: {
    zh: '你好，我是网站智能助手，可以帮你了解项目、文章、技能和联系方式。',
    en: 'Hi, I can help you explore projects, articles, skills, and contact information.',
  },
  quickQuestions: [
    { zh: '有哪些 AI 项目？', en: 'What AI projects are available?' },
    { zh: '最近写了什么文章？', en: 'What articles were published recently?' },
    { zh: '如何联系作者？', en: 'How can I contact the author?' },
  ],
}

export async function getRuntimeAgentConfig(): Promise<RuntimeAgentConfig> {
  const stored = await getAgentConfig()
  const config = stored || fallbackAgentConfig
  const key = process.env.OPENAI_API_KEY || ''
  return {
    mode: (process.env.AGENT_MODE || config.mode) as AgentMode,
    provider: config.provider,
    openaiApiKey: key,
    openaiModel: process.env.OPENAI_MODEL || config.model,
    openaiBaseUrl: process.env.OPENAI_BASE_URL || config.baseUrl,
    maxToolRounds: Number(process.env.AGENT_MAX_TOOL_ROUNDS || config.maxToolRounds),
    systemPrompt: config.systemPrompt,
    welcomeMessage: config.welcomeMessage,
    quickQuestions: config.quickQuestions,
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'PM 思钱想厚',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yumeng.dev',
    apiKeyConfigured: !!key,
  }
}

export async function resolveAgentMode(): Promise<'rules' | 'llm'> {
  const config = await getRuntimeAgentConfig()
  return config.mode !== 'rules' && config.openaiApiKey ? 'llm' : 'rules'
}

export async function isLlmEnabled(): Promise<boolean> {
  return (await resolveAgentMode()) === 'llm'
}

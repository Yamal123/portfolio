import { getAgentConfig } from '@/lib/content/repository'
import type { AgentMode } from './types'

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

export async function getRuntimeAgentConfig(): Promise<RuntimeAgentConfig> {
  const stored = await getAgentConfig()
  if (!stored) throw new Error('Agent configuration not initialized')
  const key = process.env.OPENAI_API_KEY || ''
  return {
    mode: (process.env.AGENT_MODE || stored.mode) as AgentMode,
    provider: stored.provider,
    openaiApiKey: key,
    openaiModel: process.env.OPENAI_MODEL || stored.model,
    openaiBaseUrl: process.env.OPENAI_BASE_URL || stored.baseUrl,
    maxToolRounds: Number(process.env.AGENT_MAX_TOOL_ROUNDS || stored.maxToolRounds),
    systemPrompt: stored.systemPrompt,
    welcomeMessage: stored.welcomeMessage,
    quickQuestions: stored.quickQuestions,
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

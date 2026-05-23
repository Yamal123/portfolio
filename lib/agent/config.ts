import type { AgentMode } from './types'

export const agentConfig = {
  mode: (process.env.AGENT_MODE || 'auto') as AgentMode,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  maxToolRounds: Number(process.env.AGENT_MAX_TOOL_ROUNDS || '3'),
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'PM 思钱想厚',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yumeng.dev',
}

export function resolveAgentMode(): 'rules' | 'llm' {
  if (agentConfig.mode === 'rules') return 'rules'
  if (agentConfig.mode === 'llm') {
    return agentConfig.openaiApiKey ? 'llm' : 'rules'
  }
  return agentConfig.openaiApiKey ? 'llm' : 'rules'
}

export function isLlmEnabled(): boolean {
  return resolveAgentMode() === 'llm'
}

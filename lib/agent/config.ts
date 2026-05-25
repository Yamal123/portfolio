import type { AgentMode } from './types'
import fs from 'fs'
import path from 'path'

// Load config from content/agent/config.json if available (file-based override)
function loadFileConfig() {
  try {
    const p = path.join(process.cwd(), 'content', 'agent', 'config.json')
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf-8'))
  } catch {}
  return null
}

const fileConfig = loadFileConfig()

export const agentConfig = {
  mode: (process.env.AGENT_MODE || fileConfig?.mode || 'auto') as AgentMode,
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || fileConfig?.model || 'deepseek-chat',
  openaiBaseUrl: process.env.OPENAI_BASE_URL || fileConfig?.baseUrl || 'https://api.deepseek.com/v1',
  maxToolRounds: Number(process.env.AGENT_MAX_TOOL_ROUNDS || fileConfig?.maxToolRounds || '3'),
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'PM 思钱想厚',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yumeng.dev',
  apiKeyConfigured: !!(process.env.OPENAI_API_KEY),
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

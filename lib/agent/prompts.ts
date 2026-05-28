import type { RuntimeAgentConfig } from './config'

export function getSystemPrompt(config: RuntimeAgentConfig, locale: 'zh' | 'en' = 'zh'): string {
  if (config.systemPrompt.trim()) return config.systemPrompt
  return locale === 'en'
    ? `You are the AI assistant for ${config.siteName}. Use tools for factual portfolio information and never invent data.`
    : `你是「${config.siteName}」的智能助手。必须通过工具获取事实信息，不要编造内容。`
}

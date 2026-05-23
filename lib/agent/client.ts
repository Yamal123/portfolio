import type { AgentHistoryMessage, AgentRunOutput } from './types'

export interface AgentChatRequest {
  message: string
  history?: AgentHistoryMessage[]
  locale?: 'zh' | 'en'
}

export async function callAgentChat(
  request: AgentChatRequest
): Promise<AgentRunOutput> {
  const response = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || `Agent API 错误: ${response.status}`)
  }

  return response.json()
}

export async function listAgentTools(): Promise<{
  tools: Array<{ name: string; description: string }>
  mode: string
}> {
  const response = await fetch('/api/agent/tools')
  if (!response.ok) {
    throw new Error(`获取工具列表失败: ${response.status}`)
  }
  return response.json()
}

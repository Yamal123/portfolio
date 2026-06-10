import type { AgentHistoryMessage, AgentRunOutput } from './types'

export interface AgentChatRequest {
  sessionId?: string
  message: string
  history?: AgentHistoryMessage[]
  locale?: 'zh' | 'en'
}

type AgentChatStreamMeta = Omit<AgentRunOutput, 'content'>

type AgentChatStreamEvent =
  | { type: 'start'; data: AgentChatStreamMeta }
  | { type: 'delta'; text: string }
  | { type: 'done' }
  | { type: 'error'; message: string }

export interface AgentChatStreamHandlers {
  onStart?: (meta: AgentChatStreamMeta) => void
  onDelta?: (chunk: string) => void
  onDone?: () => void
}

async function readJsonError(response: Response) {
  const err = await response.json().catch(() => ({}))
  return err.error || `Agent API 错误: ${response.status}`
}

function parseStreamEvent(line: string): AgentChatStreamEvent | null {
  try {
    return JSON.parse(line) as AgentChatStreamEvent
  } catch {
    return null
  }
}

async function streamAgentChatResponse(
  request: AgentChatRequest,
  handlers: AgentChatStreamHandlers = {}
): Promise<AgentRunOutput> {
  const response = await fetch('/api/agent/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/x-ndjson',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(await readJsonError(response))
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('Agent 流式响应不可用')
  }

  const decoder = new TextDecoder()
  let buffer = ''
  let finalMeta: AgentChatStreamMeta | null = null
  let content = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let newlineIndex = buffer.indexOf('\n')
    while (newlineIndex >= 0) {
      const rawLine = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      newlineIndex = buffer.indexOf('\n')

      if (!rawLine) continue
      const event = parseStreamEvent(rawLine)
      if (!event) continue

      if (event.type === 'start') {
        finalMeta = event.data
        handlers.onStart?.(event.data)
      } else if (event.type === 'delta') {
        content += event.text
        handlers.onDelta?.(event.text)
      } else if (event.type === 'done') {
        handlers.onDone?.()
      } else if (event.type === 'error') {
        throw new Error(event.message)
      }
    }
  }

  const tail = buffer.trim()
  if (tail) {
    const event = parseStreamEvent(tail)
    if (event?.type === 'start') {
      finalMeta = event.data
      handlers.onStart?.(event.data)
    } else if (event?.type === 'delta') {
      content += event.text
      handlers.onDelta?.(event.text)
    } else if (event?.type === 'done') {
      handlers.onDone?.()
    } else if (event?.type === 'error') {
      throw new Error(event.message)
    }
  }

  if (!finalMeta) {
    throw new Error('Agent 流式响应缺少元数据')
  }

  return {
    ...finalMeta,
    content,
  }
}

export async function callAgentChat(
  request: AgentChatRequest
): Promise<AgentRunOutput> {
  return streamAgentChatResponse(request)
}

export async function streamAgentChat(
  request: AgentChatRequest,
  handlers?: AgentChatStreamHandlers
): Promise<AgentRunOutput> {
  return streamAgentChatResponse(request, handlers)
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

export async function getAgentBootstrap(): Promise<{
  welcomeMessage: { zh: string; en: string }
  quickQuestions: Array<{ zh: string; en: string }>
  mode: 'rules' | 'llm'
}> {
  const response = await fetch('/api/agent/bootstrap', { cache: 'no-store' })
  if (!response.ok) throw new Error('助手配置加载失败')
  return (await response.json()).data
}

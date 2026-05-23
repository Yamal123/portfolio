import type { ChatResponseType, ProjectInfo } from '@/types/chatbot'

export type AgentMode = 'rules' | 'llm' | 'auto'

export interface AgentToolParameter {
  type: 'string' | 'number' | 'boolean'
  description: string
  enum?: string[]
}

export interface AgentToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, AgentToolParameter>
    required?: string[]
  }
}

export interface AgentTool<Context = void> extends AgentToolDefinition {
  execute: (args: Record<string, unknown>, context?: Context) => Promise<AgentToolResult>
}

export interface AgentToolResult {
  success: boolean
  data?: unknown
  error?: string
}

export interface AgentHistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentRunInput {
  message: string
  history?: AgentHistoryMessage[]
  locale?: 'zh' | 'en'
}

export interface AgentRunOutput {
  content: string
  mode: 'rules' | 'llm'
  type: ChatResponseType
  toolsUsed: string[]
  projects?: ProjectInfo[]
  metadata?: {
    model?: string
    toolRounds?: number
  }
}

export interface OpenAIToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

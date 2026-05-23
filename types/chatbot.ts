export interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  toolsUsed?: string[]
  agentMode?: 'rules' | 'llm'
}

export interface FAQItem {
  question: string
  answer: string
  keywords: string[]
}

export interface ProjectInfo {
  id: number
  name: string
  description: string
  type: string
  tags: string[]
}

export type ChatResponseType = 'text' | 'project' | 'faq' | 'unknown'

export interface ChatResponse {
  type: ChatResponseType
  content: string
  projects?: ProjectInfo[]
}

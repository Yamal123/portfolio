import { executeTool } from './executor'
import { toOpenAITools } from './registry'
import { getSystemPrompt } from './prompts'
import type { RuntimeAgentConfig } from './config'
import type { AgentHistoryMessage, AgentRunOutput, OpenAIToolCall } from './types'
import type { ProjectInfo } from '@/types/chatbot'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string | null
  tool_calls?: OpenAIToolCall[]
  tool_call_id?: string
}

export async function runLlmAgent(input: {
  message: string
  history?: AgentHistoryMessage[]
  locale?: 'zh' | 'en'
  config: RuntimeAgentConfig
}): Promise<AgentRunOutput> {
  const locale = input.locale || 'zh'
  const toolsUsed: string[] = []
  const foundProjects: ProjectInfo[] = []
  let toolRounds = 0
  const messages: ChatMessage[] = [
    { role: 'system', content: getSystemPrompt(input.config, locale) },
    ...(input.history || []).map((message) => ({ role: message.role, content: message.content })),
    { role: 'user', content: input.message },
  ]

  while (toolRounds < input.config.maxToolRounds) {
    const response = await fetch(`${input.config.openaiBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${input.config.openaiApiKey}` },
      body: JSON.stringify({
        model: input.config.openaiModel,
        messages,
        tools: toOpenAITools(),
        tool_choice: 'auto',
        temperature: 0.4,
      }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) throw new Error(`LLM request failed with ${response.status}`)
    const choice = (await response.json()).choices?.[0]?.message
    if (!choice) throw new Error('LLM returned no answer')

    if (choice.tool_calls?.length) {
      messages.push({ role: 'assistant', content: choice.content, tool_calls: choice.tool_calls })
      for (const call of choice.tool_calls as OpenAIToolCall[]) {
        let args: Record<string, unknown> = {}
        try { args = JSON.parse(call.function.arguments || '{}') } catch {}
        const result = await executeTool(call.function.name, args)
        toolsUsed.push(call.function.name)
        if (call.function.name === 'search_projects' && result.success) {
          const items = (result.data as { items?: Array<{ id: number; name: string; intro: string; type: string; tags: string[] }> })?.items || []
          foundProjects.push(...items.map((item) => ({ id: item.id, name: item.name, description: item.intro, type: item.type, tags: item.tags })))
        }
        messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
      }
      toolRounds++
      continue
    }

    return {
      content: choice.content?.trim() || (locale === 'zh' ? '抱歉，我暂时无法生成回复。' : 'Sorry, I could not generate a response.'),
      mode: 'llm',
      type: foundProjects.length ? 'project' : 'text',
      toolsUsed: [...new Set(toolsUsed)],
      projects: foundProjects.length ? foundProjects : undefined,
      metadata: { model: input.config.openaiModel, toolRounds },
    }
  }

  return {
    content: locale === 'zh' ? '查询步骤较多，请尝试更具体的问题。' : 'Too many tool steps. Please try a more specific question.',
    mode: 'llm', type: 'unknown', toolsUsed: [...new Set(toolsUsed)],
    metadata: { model: input.config.openaiModel, toolRounds },
  }
}

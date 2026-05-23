import { resolveAgentMode } from './config'
import { runLlmAgent } from './llm'
import { runRulesAgent } from './rules'
import type { AgentRunInput, AgentRunOutput } from './types'

export async function runAgent(input: AgentRunInput): Promise<AgentRunOutput> {
  const mode = resolveAgentMode()
  const locale = input.locale || 'zh'

  try {
    if (mode === 'llm') {
      return await runLlmAgent({
        message: input.message,
        history: input.history,
        locale,
      })
    }
    return await runRulesAgent({ message: input.message, locale })
  } catch (error) {
    console.error('[Agent] LLM failed, fallback to rules:', error)
    const fallback = await runRulesAgent({ message: input.message, locale })
    return {
      ...fallback,
      content:
        locale === 'zh'
          ? `${fallback.content}\n\n（LLM 暂不可用，已切换为规则模式）`
          : `${fallback.content}\n\n(LLM unavailable, using rules mode)`,
    }
  }
}

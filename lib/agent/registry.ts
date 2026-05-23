import { agentTools, agentToolsByName } from './tools'
import type { AgentTool, AgentToolDefinition } from './types'

export function getAgentTools(): AgentTool[] {
  return agentTools
}

export function getAgentTool(name: string): AgentTool | undefined {
  return agentToolsByName[name]
}

export function getToolDefinitions(): AgentToolDefinition[] {
  return agentTools.map(({ name, description, parameters }) => ({
    name,
    description,
    parameters,
  }))
}

export function toOpenAITools() {
  return agentTools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }))
}

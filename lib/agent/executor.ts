import { getAgentTool } from './registry'
import type { AgentToolResult } from './types'

export async function executeTool(
  name: string,
  args: Record<string, unknown> = {}
): Promise<AgentToolResult> {
  const tool = getAgentTool(name)
  if (!tool) {
    return { success: false, error: `未知工具: ${name}` }
  }

  try {
    return await tool.execute(args)
  } catch (error) {
    const message = error instanceof Error ? error.message : '工具执行失败'
    return { success: false, error: message }
  }
}

export async function executeTools(
  calls: Array<{ name: string; args: Record<string, unknown> }>
): Promise<Array<{ name: string; result: AgentToolResult }>> {
  const results = await Promise.all(
    calls.map(async (call) => ({
      name: call.name,
      result: await executeTool(call.name, call.args),
    }))
  )
  return results
}

import { NextResponse } from 'next/server'
import { getToolDefinitions, resolveAgentMode } from '@/lib/agent'

export const runtime = 'nodejs'

export async function GET() {
  const tools = getToolDefinitions().map((t) => ({
    name: t.name,
    description: t.description,
    parameters: t.parameters,
  }))

  return NextResponse.json({
    mode: resolveAgentMode(),
    tools,
  })
}

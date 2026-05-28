import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import { agentChatSchema, consumeAgentRequest } from '@/lib/agent/request'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'
  const budget = consumeAgentRequest(ip)
  if (!budget.allowed) {
    return NextResponse.json(
      { error: '请求过于频繁，请稍后重试' },
      { status: 429, headers: { 'Retry-After': String(budget.retryAfter) } }
    )
  }

  const parsed = agentChatSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: '请求格式无效' }, { status: 400 })
  }

  try {
    return NextResponse.json(await runAgent(parsed.data))
  } catch (error) {
    console.error('[API /agent/chat]', error)
    return NextResponse.json({ error: 'Agent 暂时不可用' }, { status: 503 })
  }
}

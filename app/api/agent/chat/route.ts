import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import { agentChatSchema, consumeAgentRequest } from '@/lib/agent/request'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function createLineStream(lines: string[]) {
  const encoder = new TextEncoder()
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`))
        await new Promise((resolve) => setTimeout(resolve, 8))
      }
      controller.close()
    },
  })
}

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
    const result = await runAgent(parsed.data)
    const stream = createLineStream([
      JSON.stringify({
        type: 'start',
        data: {
          mode: result.mode,
          type: result.type,
          toolsUsed: result.toolsUsed,
          projects: result.projects,
          sources: result.sources,
          metadata: result.metadata,
        },
      }),
      ...chunkText(result.content).map((text) => JSON.stringify({ type: 'delta', text })),
      JSON.stringify({ type: 'done' }),
    ])

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[API /agent/chat]', error)
    return NextResponse.json({ error: 'Agent 暂时不可用' }, { status: 503 })
  }
}

function chunkText(text: string, chunkSize = 24): string[] {
  if (!text) return ['']
  const chunks: string[] = []
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push(text.slice(index, index + chunkSize))
  }
  return chunks
}

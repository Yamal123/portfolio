import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/agent'
import type { AgentHistoryMessage } from '@/lib/agent/types'

export const runtime = 'nodejs'

interface ChatBody {
  message?: string
  history?: AgentHistoryMessage[]
  locale?: 'zh' | 'en'
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatBody
    const message = body.message?.trim()

    if (!message) {
      return NextResponse.json({ error: 'message 不能为空' }, { status: 400 })
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: 'message 过长' }, { status: 400 })
    }

    const result = await runAgent({
      message,
      history: body.history?.slice(-10),
      locale: body.locale || 'zh',
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[API /agent/chat]', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Agent 处理失败' },
      { status: 500 }
    )
  }
}

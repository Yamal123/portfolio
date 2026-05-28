import { NextResponse } from 'next/server'
import { getRuntimeAgentConfig, resolveAgentMode } from '@/lib/agent'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const config = await getRuntimeAgentConfig()
    return NextResponse.json({
      code: 0,
      data: {
        welcomeMessage: config.welcomeMessage,
        quickQuestions: config.quickQuestions,
        mode: await resolveAgentMode(),
      },
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[Agent bootstrap]', error)
    return NextResponse.json({ code: 503, message: 'Agent 配置不可用' }, { status: 503 })
  }
}

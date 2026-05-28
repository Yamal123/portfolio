import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { agentConfigInputSchema } from '@/lib/content/contracts'
import { getAgentConfig, saveAgentConfig } from '@/lib/content/repository'
import { resolveAgentMode } from '@/lib/agent/config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  try {
    const config = await getAgentConfig()
    return NextResponse.json({ code: 0, data: config && { ...config, actualMode: await resolveAgentMode(), apiKeyConfigured: !!process.env.OPENAI_API_KEY } })
  } catch (error) {
    console.error('[Management agent GET]', error)
    return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 })
  }
}

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  const parsed = agentConfigInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ code: 400, message: 'Agent 配置格式无效' }, { status: 400 })
  try {
    const config = await saveAgentConfig(parsed.data)
    return NextResponse.json({ code: 0, message: '配置已保存', data: config })
  } catch (error) {
    console.error('[Management agent PUT]', error)
    return NextResponse.json({ code: 503, message: '保存失败' }, { status: 503 })
  }
}

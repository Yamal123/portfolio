import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { profileInputSchema } from '@/lib/content/contracts'
import { defaultProfileInput } from '@/lib/content/defaults'
import { getProfile, saveProfile } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  try {
    return NextResponse.json({ code: 0, data: (await getProfile()) || defaultProfileInput })
  } catch (error) {
    console.error('[Management profile GET]', error)
    return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 })
  }
}

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  const parsed = profileInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ code: 400, message: '个人信息格式无效' }, { status: 400 })
  try {
    return NextResponse.json({ code: 0, message: '保存成功', data: await saveProfile(parsed.data) })
  } catch (error) {
    console.error('[Management profile PUT]', error)
    return NextResponse.json({ code: 503, message: '保存失败' }, { status: 503 })
  }
}

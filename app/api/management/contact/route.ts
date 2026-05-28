import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { getProfile, saveProfile } from '@/lib/content/repository'
import { profileInputSchema } from '@/lib/content/contracts'

export async function GET(request: Request) {
  const auth = checkAuth(request); if (auth instanceof NextResponse) return auth
  try { return NextResponse.json({ code: 0, data: (await getProfile())?.contact || null }) }
  catch { return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 }) }
}
export async function PUT(request: Request) {
  const auth = checkAuth(request); if (auth instanceof NextResponse) return auth
  try {
    const existing = await getProfile()
    if (!existing) return NextResponse.json({ code: 404, message: '个人资料不存在' }, { status: 404 })
    const parsed = profileInputSchema.safeParse({ ...existing, contact: await request.json() })
    if (!parsed.success) return NextResponse.json({ code: 400, message: '联系方式格式无效' }, { status: 400 })
    return NextResponse.json({ code: 0, data: (await saveProfile(parsed.data)).contact, message: '已保存' })
  } catch { return NextResponse.json({ code: 503, message: '保存失败' }, { status: 503 }) }
}

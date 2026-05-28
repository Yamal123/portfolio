import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { skillInputSchema } from '@/lib/content/contracts'
import { deleteSkill, listAdminSkills, saveSkill } from '@/lib/content/repository'

function denied(request: Request) {
  const auth = checkAuth(request)
  return auth instanceof NextResponse ? auth : null
}
export async function GET(request: Request) {
  const auth = denied(request); if (auth) return auth
  try { return NextResponse.json({ code: 0, data: await listAdminSkills() }) }
  catch { return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 }) }
}
async function write(request: Request, update: boolean) {
  const auth = denied(request); if (auth) return auth
  const input = skillInputSchema.safeParse(await request.json().catch(() => null))
  if (!input.success || (update && !input.data.id)) return NextResponse.json({ code: 400, message: '技能数据格式无效' }, { status: 400 })
  try { return NextResponse.json({ code: 0, data: await saveSkill(input.data, update) }) }
  catch { return NextResponse.json({ code: 503, message: '保存失败' }, { status: 503 }) }
}
export async function POST(request: Request) { return write(request, false) }
export async function PUT(request: Request) { return write(request, true) }
export async function DELETE(request: Request) {
  const auth = denied(request); if (auth) return auth
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ code: 400, message: '缺少 id' }, { status: 400 })
  try { await deleteSkill(id); return NextResponse.json({ code: 0, message: '技能已删除' }) }
  catch { return NextResponse.json({ code: 503, message: '删除失败' }, { status: 503 }) }
}

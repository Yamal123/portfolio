import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { projectInputSchema } from '@/lib/content/contracts'
import { deleteProject, getProject, listProjects, saveProject } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

function rejectUnlessAuthenticated(request: Request) {
  const auth = checkAuth(request)
  return auth instanceof NextResponse ? auth : null
}

export async function GET(request: Request) {
  const unauthorized = rejectUnlessAuthenticated(request)
  if (unauthorized) return unauthorized
  try {
    const slug = new URL(request.url).searchParams.get('slug')
    const data = slug ? await getProject(slug, true) : await listProjects({ admin: true })
    return NextResponse.json({ code: 0, data })
  } catch (error) {
    console.error('[Management portfolio GET]', error)
    return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 })
  }
}

async function write(request: Request, update: boolean) {
  const unauthorized = rejectUnlessAuthenticated(request)
  if (unauthorized) return unauthorized
  const parsed = projectInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ code: 400, message: '项目数据格式无效' }, { status: 400 })
  try {
    const data = await saveProject(parsed.data, update)
    return NextResponse.json({ code: 0, message: update ? '项目已更新' : '项目已创建', data })
  } catch (error) {
    console.error('[Management portfolio write]', error)
    return NextResponse.json({ code: 409, message: update ? '更新失败，请确认项目存在' : '创建失败，请确认 slug 唯一' }, { status: 409 })
  }
}

export async function POST(request: Request) { return write(request, false) }
export async function PUT(request: Request) { return write(request, true) }

export async function DELETE(request: Request) {
  const unauthorized = rejectUnlessAuthenticated(request)
  if (unauthorized) return unauthorized
  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return NextResponse.json({ code: 400, message: '缺少 slug' }, { status: 400 })
  try {
    await deleteProject(slug)
    return NextResponse.json({ code: 0, message: '项目已删除' })
  } catch (error) {
    console.error('[Management portfolio DELETE]', error)
    return NextResponse.json({ code: 503, message: '删除失败' }, { status: 503 })
  }
}

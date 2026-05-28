import { NextResponse } from 'next/server'
import { checkAuth } from '@/lib/auth/middleware'
import { articleInputSchema } from '@/lib/content/contracts'
import { deleteArticle, getArticle, listArticles, saveArticle } from '@/lib/content/repository'

export const dynamic = 'force-dynamic'

function denied(request: Request) {
  const auth = checkAuth(request)
  return auth instanceof NextResponse ? auth : null
}

export async function GET(request: Request) {
  const auth = denied(request)
  if (auth) return auth
  try {
    const slug = new URL(request.url).searchParams.get('slug')
    return NextResponse.json({ code: 0, data: slug ? await getArticle(slug, true) : await listArticles({ admin: true }) })
  } catch (error) {
    console.error('[Management methods GET]', error)
    return NextResponse.json({ code: 503, message: '数据服务暂不可用' }, { status: 503 })
  }
}

async function write(request: Request, update: boolean) {
  const auth = denied(request)
  if (auth) return auth
  const parsed = articleInputSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ code: 400, message: '方法论数据格式无效' }, { status: 400 })
  try {
    return NextResponse.json({ code: 0, data: await saveArticle(parsed.data, update), message: update ? '方法论已更新' : '方法论已创建' })
  } catch (error) {
    console.error('[Management methods write]', error)
    return NextResponse.json({ code: 409, message: '保存失败，请检查 slug' }, { status: 409 })
  }
}

export async function POST(request: Request) { return write(request, false) }
export async function PUT(request: Request) { return write(request, true) }

export async function DELETE(request: Request) {
  const auth = denied(request)
  if (auth) return auth
  const slug = new URL(request.url).searchParams.get('slug')
  if (!slug) return NextResponse.json({ code: 400, message: '缺少 slug' }, { status: 400 })
  try {
    await deleteArticle(slug)
    return NextResponse.json({ code: 0, message: '方法论已删除' })
  } catch (error) {
    console.error('[Management methods DELETE]', error)
    return NextResponse.json({ code: 503, message: '删除失败' }, { status: 503 })
  }
}

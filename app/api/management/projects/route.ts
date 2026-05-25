import { NextResponse } from 'next/server'
import { projectsData } from '@/data/projects'
import { checkAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, data: { list: projectsData, total: projectsData.length } })
}

export async function POST(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '创建成功（重新构建后生效）' })
}

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '更新成功（重新构建后生效）' })
}

export async function DELETE(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '已删除' })
}

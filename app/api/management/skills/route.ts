import { NextResponse } from 'next/server'
import { skillsData } from '@/data/skills'
import { checkAuth } from '@/lib/auth/middleware'

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, data: { list: skillsData, total: skillsData.length } })
}

export async function POST(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '创建成功' })
}

export async function PUT(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '更新成功' })
}

export async function DELETE(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth
  return NextResponse.json({ code: 0, message: '已删除' })
}

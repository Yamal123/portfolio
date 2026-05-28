import { NextResponse } from 'next/server'

export async function PUT() {
  return NextResponse.json(
    { code: 410, message: '请使用已认证的 /api/management/articles 管理文章' },
    { status: 410 }
  )
}

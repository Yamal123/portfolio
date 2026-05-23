import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: {
      nickname: '管理员',
      avatar: '',
      email: 'admin@aipmym.com',
      bio: 'AI 产品经理',
      years_of_experience: 2,
      success_rate: 88.0,
      efficiency_gain: 40.0,
    }
  })
}

export async function PUT() {
  return NextResponse.json({ code: 0, message: '保存成功', data: null })
}

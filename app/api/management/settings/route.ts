import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: {
      site_title: 'PM 思钱想厚',
      site_description: 'AI产品经理个人品牌网站',
      copyright: '© Yu Meng',
    }
  })
}

export async function PUT() {
  return NextResponse.json({ code: 0, message: '保存成功', data: null })
}

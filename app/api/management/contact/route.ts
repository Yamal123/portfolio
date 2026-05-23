import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: {
      email: 'yumeng@aipmym.com',
      phone: '',
      wechat_id: '',
      wechat_qrcode: '',
      email_displayed: true,
      phone_displayed: false,
      wechat_displayed: false,
    }
  })
}

export async function PUT() {
  return NextResponse.json({ code: 0, message: '保存成功', data: null })
}

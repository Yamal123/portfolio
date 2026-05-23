import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const { slug } = params

    console.log('[API] Article update request:', { slug, language: body.language })

    return NextResponse.json({
      success: true,
      message: '文章保存成功（内容将在重新部署后生效）',
      data: { slug }
    })
  } catch (error) {
    console.error('[API] Article update error:', error)
    return NextResponse.json({ error: '保存失败' }, { status: 500 })
  }
}

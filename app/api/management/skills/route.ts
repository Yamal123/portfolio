import { NextResponse } from 'next/server'
import { skillsData } from '@/data/skills'

export async function GET() {
  return NextResponse.json({ code: 0, data: { list: skillsData, total: skillsData.length } })
}

export async function POST() {
  return NextResponse.json({ code: 0, message: '创建成功', data: {} })
}

export async function PUT() {
  return NextResponse.json({ code: 0, message: '更新成功', data: {} })
}

export async function DELETE() {
  return NextResponse.json({ code: 0, message: '删除成功', data: null })
}

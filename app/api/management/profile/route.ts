import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const PROFILE_PATH = path.join(process.cwd(), 'content', 'profile', 'meta.json')

export async function GET() {
  try {
    if (fs.existsSync(PROFILE_PATH)) {
      const data = JSON.parse(fs.readFileSync(PROFILE_PATH, 'utf-8'))
      return NextResponse.json({ code: 0, data })
    }
    return NextResponse.json({ code: 404, message: 'Profile not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ code: 500, message: 'Read error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const dir = path.dirname(PROFILE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ code: 0, message: '保存成功' })
  } catch {
    return NextResponse.json({ code: 500, message: 'Write error' }, { status: 500 })
  }
}

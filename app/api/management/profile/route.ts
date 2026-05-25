import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { checkAuth } from '@/lib/auth/middleware'

const PROFILE_PATH = path.join(process.cwd(), 'content', 'profile', 'meta.json')

// Validate path is within project
function safePath(targetPath: string): boolean {
  const resolved = path.resolve(targetPath)
  return resolved.startsWith(path.resolve(process.cwd(), 'content'))
}

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    if (!safePath(PROFILE_PATH)) {
      return NextResponse.json({ code: 403, message: '路径访问被拒绝' }, { status: 403 })
    }
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
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ code: 400, message: '无效数据' }, { status: 400 })
    }
    if (!safePath(PROFILE_PATH)) {
      return NextResponse.json({ code: 403, message: '路径访问被拒绝' }, { status: 403 })
    }
    const dir = path.dirname(PROFILE_PATH)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(PROFILE_PATH, JSON.stringify(body, null, 2), 'utf-8')
    return NextResponse.json({ code: 0, message: '保存成功' })
  } catch {
    return NextResponse.json({ code: 500, message: 'Write error' }, { status: 500 })
  }
}

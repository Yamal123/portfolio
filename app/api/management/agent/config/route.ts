import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { checkAuth } from '@/lib/auth/middleware'

const CONFIG_PATH = path.join(process.cwd(), 'content', 'agent', 'config.json')

function readConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
  }
  return null
}

function writeConfig(data: any) {
  const dir = path.dirname(CONFIG_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET(request: Request) {
  const auth = checkAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const config = readConfig()
    if (!config) return NextResponse.json({ code: 404, message: 'Config not found' }, { status: 404 })
    return NextResponse.json({ code: 0, data: config })
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
    const existing = readConfig()
    const merged = { ...existing, ...body }
    writeConfig(merged)
    return NextResponse.json({ code: 0, message: '配置已保存', data: merged })
  } catch {
    return NextResponse.json({ code: 500, message: 'Write error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'

export async function GET() {
  const now = new Date()
  const trend = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().slice(0, 10)
    const baseUv = Math.floor(Math.random() * 50) + 20
    trend.push({
      date: dateStr,
      uv: baseUv,
      pv: baseUv * (Math.floor(Math.random() * 3) + 2),
    })
  }

  return NextResponse.json({
    code: 0,
    data: trend,
  })
}

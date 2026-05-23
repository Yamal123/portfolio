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
    data: {
      total_pv: 2847,
      total_uv: 892,
      today_pv: 124,
      today_uv: 38,
      week_pv: 856,
      week_uv: 267,
      total_projects: 8,
      total_skills: 16,
      top_projects: [],
    }
  })
}

import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: {
      project_count: 1,
      total_skills: 16,
      years_of_experience: 2,
      completed_projects: 10,
      success_rate: 88,
      client_satisfaction: 95,
      active_skills: 16,
      total_views: 1234,
      total_visits: 892,
    }
  })
}

import { NextResponse } from 'next/server'
import { projectsData } from '@/data/projects'

export async function GET() {
  return NextResponse.json({
    code: 0,
    data: projectsData,
  })
}

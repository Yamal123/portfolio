import projectsGen from './projects.gen.json'

export interface Project {
  id: number
  slug: string
  name: { zh: string; en: string }
  thumbnail?: string
  type: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  createdAt: string
  emoji: string
  problem: { zh: string; en: string }
  action: { zh: string; en: string }
  result: { zh: string; en: string }
  tags: string[]
  content: { zh: string; en: string }
  contentType?: string
  contentFile?: string | null
  externalUrl?: string
  view_count: number
}

export const projectsData: Project[] = projectsGen

export const mockProjects = projectsData

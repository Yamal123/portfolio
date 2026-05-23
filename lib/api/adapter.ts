import type { Project as BackendProject } from '@/types/admin'

export interface FrontendProject {
  id: number
  slug: string
  name: { zh: string; en: string }
  type: { zh: string; en: string }
  intro: { zh: string; en: string }
  problem: { zh: string; en: string }
  action: { zh: string; en: string }
  result: { zh: string; en: string }
  thumbnail?: string
  keywords: string[]
  tags: string[]
  content: { zh: string; en: string }
  emoji: string
  createdAt: string
  view_count: number
  externalUrl?: string
}

export interface FrontendSkill {
  name: { zh: string; en: string }
  level: number
  category: 'ai' | 'product' | 'technical' | 'soft'
  description?: string
}

export interface BackendSkill {
  id: number
  name: string
  level: number
  cate_id: number
  description?: string
}

export function adaptProjects(backendProjects: BackendProject[]): FrontendProject[] {
  return backendProjects.map(project => ({
    id: project.id,
    slug: project.slug,
    name: {
      zh: project.name_zh,
      en: project.name_en
    },
    type: {
      zh: project.type_zh || '个人项目',
      en: project.type_en || 'Personal Project'
    },
    intro: {
      zh: project.intro_zh || '',
      en: project.intro_en || ''
    },
    problem: {
      zh: project.problem_zh || '',
      en: project.problem_en || ''
    },
    action: {
      zh: project.action_zh || '',
      en: project.action_en || ''
    },
    result: {
      zh: project.result_zh || '',
      en: project.result_en || ''
    },
    thumbnail: project.thumbnail,
    keywords: project.keywords ? project.keywords.split(',').map((k: string) => k.trim()) : [],
    tags: project.tags ? project.tags.split(',').map((t: string) => t.trim()) : [],
    content: {
      zh: project.content_zh || '',
      en: project.content_en || ''
    },
    emoji: project.emoji || '📦',
    createdAt: project.created_at?.split(' ')[0] || '',
    view_count: project.view_count || 0,
    externalUrl: project.external_url
  }))
}

export function adaptSkills(backendSkills: BackendSkill[]): FrontendSkill[] {
  const categoryMap: Record<number, 'ai' | 'product' | 'technical' | 'soft'> = {
    1: 'ai',
    2: 'product',
    3: 'technical',
    4: 'soft'
  }

  return backendSkills.map(skill => ({
    name: {
      zh: skill.name,
      en: skill.name
    },
    level: skill.level || 80,
    category: categoryMap[skill.cate_id] || 'product',
    description: skill.description || ''
  }))
}

interface ProjectInput {
  slug: string
  cate_id?: number
  name?: string | { zh: string; en: string }
  type?: { zh: string; en: string }
  intro?: string | { zh: string; en: string }
  problem?: string | { zh: string; en: string }
  action?: string | { zh: string; en: string }
  result?: string | { zh: string; en: string }
  thumbnail?: string
  content?: string | { zh: string; en: string }
  keywords?: string | string[]
  tags?: string | string[]
  emoji?: string
  external_url?: string
  sort_num?: number
  status?: number
}

export function projectToBackend(project: ProjectInput): Partial<BackendProject> {
  return {
    slug: project.slug,
    cate_id: project.cate_id || 1,
    name_zh: typeof project.name === 'string' ? project.name : project.name?.zh || '',
    name_en: typeof project.name === 'string' ? project.name : project.name?.en || '',
    type_zh: project.type?.zh || '个人项目',
    type_en: project.type?.en || 'Personal Project',
    intro_zh: typeof project.intro === 'string' ? project.intro : project.intro?.zh || '',
    intro_en: typeof project.intro === 'string' ? project.intro : project.intro?.en || '',
    problem_zh: typeof project.problem === 'string' ? project.problem : project.problem?.zh || '',
    problem_en: typeof project.problem === 'string' ? project.problem : project.problem?.en || '',
    action_zh: typeof project.action === 'string' ? project.action : project.action?.zh || '',
    action_en: typeof project.action === 'string' ? project.action : project.action?.en || '',
    result_zh: typeof project.result === 'string' ? project.result : project.result?.zh || '',
    result_en: typeof project.result === 'string' ? project.result : project.result?.en || '',
    thumbnail: project.thumbnail,
    content_zh: typeof project.content === 'string' ? project.content : project.content?.zh || '',
    content_en: typeof project.content === 'string' ? project.content : project.content?.en || '',
    keywords: Array.isArray(project.keywords) ? project.keywords.join(',') : project.keywords || '',
    tags: Array.isArray(project.tags) ? project.tags.join(',') : project.tags || '',
    emoji: project.emoji || '📦',
    external_url: project.external_url || '',
    sort_num: project.sort_num || 0,
    status: project.status ?? 1
  }
}

export function adaptBackendProject(project: BackendProject): FrontendProject {
  return {
    id: project.id,
    slug: project.slug,
    name: {
      zh: project.name_zh,
      en: project.name_en
    },
    type: {
      zh: project.type_zh || '个人项目',
      en: project.type_en || 'Personal Project'
    },
    intro: {
      zh: project.intro_zh || '',
      en: project.intro_en || ''
    },
    problem: {
      zh: project.problem_zh || '',
      en: project.problem_en || ''
    },
    action: {
      zh: project.action_zh || '',
      en: project.action_en || ''
    },
    result: {
      zh: project.result_zh || '',
      en: project.result_en || ''
    },
    thumbnail: project.thumbnail,
    keywords: project.keywords ? project.keywords.split(',').map((k: string) => k.trim()) : [],
    tags: project.tags ? project.tags.split(',').map((t: string) => t.trim()) : [],
    content: {
      zh: project.content_zh || '',
      en: project.content_en || ''
    },
    emoji: project.emoji || '📦',
    createdAt: project.created_at?.split(' ')[0] || '',
    view_count: project.view_count || 0,
    externalUrl: project.external_url
  }
}

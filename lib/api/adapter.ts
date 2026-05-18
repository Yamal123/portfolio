import { Project } from '@/data/projects'
import { Skill } from '@/data/skills'

export interface BackendProject {
  id: number
  slug: string
  name_zh: string
  name_en: string
  thumbnail?: string
  content_zh: string
  content_en: string
  tags: string
  view_count: number
  cate_id: number
  created_at: string
}

interface BackendSkill {
  id: number
  name: string
  level: number
  cate_id: number
}

const projectCategoryMap: Record<number, { zh: string; en: string }> = {
  1: { zh: "AI 智能项目", en: "AI Project" },
  2: { zh: "企业级应用", en: "Enterprise App" },
  3: { zh: "国际化产品", en: "International Product" },
  4: { zh: "社会公益", en: "Social Welfare" },
}

const skillCategoryMap: Record<number, { zh: string; en: string }> = {
  1: { zh: "AI 产品", en: "AI" },
  2: { zh: "物流供应链", en: "Supply Chain" },
  3: { zh: "智能客服", en: "Customer Service" },
  4: { zh: "架构设计", en: "Architecture" },
}

export function adaptProjects(backendProjects: BackendProject[]): Project[] {
  return backendProjects.map(project => ({
    id: project.id,
    slug: project.slug,
    name: { 
      zh: project.name_zh, 
      en: project.name_en 
    },
    thumbnail: project.thumbnail || undefined,
    type: projectCategoryMap[project.cate_id] || { zh: "AI 智能项目", en: "AI Project" },
    intro: { 
      zh: project.content_zh.slice(0, 100) + (project.content_zh.length > 100 ? '...' : ''), 
      en: project.content_en.slice(0, 100) + (project.content_en.length > 100 ? '...' : '') 
    },
    keywords: project.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    createdAt: project.created_at,
    emoji: "🌐",
    problem: { zh: "", en: "" },
    action: { zh: "", en: "" },
    result: { zh: "", en: "" },
    tags: project.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    content: { 
      zh: project.content_zh, 
      en: project.content_en 
    }
  }))
}

export function adaptProject(backendProject: BackendProject): Project {
  return {
    id: backendProject.id,
    slug: backendProject.slug,
    name: { 
      zh: backendProject.name_zh, 
      en: backendProject.name_en 
    },
    thumbnail: backendProject.thumbnail || undefined,
    type: projectCategoryMap[backendProject.cate_id] || { zh: "AI 智能项目", en: "AI Project" },
    intro: { 
      zh: backendProject.content_zh.slice(0, 100) + (backendProject.content_zh.length > 100 ? '...' : ''), 
      en: backendProject.content_en.slice(0, 100) + (backendProject.content_en.length > 100 ? '...' : '') 
    },
    keywords: backendProject.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    createdAt: backendProject.created_at,
    emoji: "🌐",
    problem: { zh: "", en: "" },
    action: { zh: "", en: "" },
    result: { zh: "", en: "" },
    tags: backendProject.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    content: { 
      zh: backendProject.content_zh, 
      en: backendProject.content_en 
    }
  }
}

export function adaptSkills(backendSkills: BackendSkill[]): Skill[] {
  return backendSkills.map(skill => ({
    name: { 
      zh: skill.name, 
      en: skill.name 
    },
    level: skill.level,
    category: skillCategoryMap[skill.cate_id]?.zh as any || "技术技能"
  }))
}

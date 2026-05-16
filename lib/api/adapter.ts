import { Project } from '@/data/projects'
import { Skill } from '@/data/skills'

// 后端项目数据类型
interface BackendProject {
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

// 后端技能数据类型
interface BackendSkill {
  id: number
  name: string
  level: number
  cate_id: number
}

// 项目分类映射（根据 cate_id）
const projectCategoryMap: Record<number, { zh: string; en: string }> = {
  1: { zh: "个人项目", en: "Personal Project" },
  2: { zh: "工作项目", en: "Work Project" },
  3: { zh: "开源项目", en: "Open Source" },
  4: { zh: "学习项目", en: "Learning Project" },
}

// 技能分类映射（根据 cate_id）
const skillCategoryMap: Record<number, "ai" | "product" | "technical" | "soft"> = {
  1: "ai",
  2: "product",
  3: "technical",
  4: "soft",
}

// 将后端项目数据转换为前端格式
export function adaptProjects(backendProjects: BackendProject[]): Project[] {
  return backendProjects.map(project => ({
    id: project.id,
    slug: project.slug,
    name: { 
      zh: project.name_zh, 
      en: project.name_en 
    },
    thumbnail: project.thumbnail || undefined,
    type: projectCategoryMap[project.cate_id] || { zh: "个人项目", en: "Personal Project" },
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

// 将后端单个项目数据转换为前端格式
export function adaptProject(backendProject: BackendProject): Project {
  return {
    id: backendProject.id,
    slug: backendProject.slug,
    name: { 
      zh: backendProject.name_zh, 
      en: backendProject.name_en 
    },
    thumbnail: backendProject.thumbnail || undefined,
    type: projectCategoryMap[backendProject.cate_id] || { zh: "个人项目", en: "Personal Project" },
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

// 将后端技能数据转换为前端格式
export function adaptSkills(backendSkills: BackendSkill[]): Skill[] {
  return backendSkills.map(skill => ({
    name: { 
      zh: skill.name, 
      en: skill.name 
    },
    level: skill.level,
    category: skillCategoryMap[skill.cate_id] || "technical"
  }))
}

// 数据适配器：将后端API返回的数据格式转换为前台组件需要的格式

// 转换项目数据
export function adaptProjects(backendProjects: any[]) {
  return backendProjects.map(project => ({
    id: project.id,
    slug: project.slug,
    name: {
      zh: project.name_zh,
      en: project.name_en
    },
    type: {
      zh: project.type_zh || "个人项目",
      en: project.type_en || "Personal Project"
    },
    intro: {
      zh: project.intro_zh || "",
      en: project.intro_en || ""
    },
    problem: {
      zh: project.problem_zh || "",
      en: project.problem_en || ""
    },
    action: {
      zh: project.action_zh || "",
      en: project.action_en || ""
    },
    result: {
      zh: project.result_zh || "",
      en: project.result_en || ""
    },
    thumbnail: project.thumbnail,
    keywords: project.keywords ? project.keywords.split(',').map((k: string) => k.trim()) : [],
    tags: project.tags ? project.tags.split(',').map((t: string) => t.trim()) : [],
    content: {
      zh: project.content_zh || "",
      en: project.content_en || ""
    },
    emoji: project.emoji || "📦",
    createdAt: project.created_at?.split(' ')[0] || "",
    view_count: project.view_count || 0
  }))
}

// 转换技能数据
export function adaptSkills(backendSkills: any[]) {
  // 技能分类映射
  const categoryMap: Record<number, string> = {
    1: "ai",
    2: "product",
    3: "technical",
    4: "soft"
  }

  return backendSkills.map(skill => ({
    name: {
      zh: skill.name,
      en: skill.name // 暂时用中文做英文，后续可以优化
    },
    level: skill.level || 80,
    category: categoryMap[skill.cate_id] || "product",
    description: skill.description || ""
  }))
}

// 转换前台格式为后台API格式（用于创建/更新）
export function projectToBackend(project: any) {
  return {
    slug: project.slug,
    cate_id: project.cate_id || 1,
    name_zh: project.name?.zh || project.name,
    name_en: project.name?.en || project.name,
    type_zh: project.type?.zh || "个人项目",
    type_en: project.type?.en || "Personal Project",
    intro_zh: project.intro?.zh || project.intro,
    intro_en: project.intro?.en || project.intro,
    problem_zh: project.problem?.zh || project.problem,
    problem_en: project.problem?.en || project.problem,
    action_zh: project.action?.zh || project.action,
    action_en: project.action?.en || project.action,
    result_zh: project.result?.zh || project.result,
    result_en: project.result?.en || project.result,
    thumbnail: project.thumbnail,
    content_zh: project.content?.zh || project.content,
    content_en: project.content?.en || project.content,
    keywords: Array.isArray(project.keywords) ? project.keywords.join(',') : project.keywords,
    tags: Array.isArray(project.tags) ? project.tags.join(',') : project.tags,
    emoji: project.emoji || "📦",
    external_url: project.external_url || "",
    sort_num: project.sort_num || 0,
    status: project.status ?? 1
  }
}

// 转换后台项目数据为前台可展示格式
export function adaptBackendProject(project: any) {
  return {
    id: project.id,
    slug: project.slug,
    name: {
      zh: project.name_zh,
      en: project.name_en
    },
    type: {
      zh: project.type_zh || "个人项目",
      en: project.type_en || "Personal Project"
    },
    intro: {
      zh: project.intro_zh || "",
      en: project.intro_en || ""
    },
    problem: {
      zh: project.problem_zh || "",
      en: project.problem_en || ""
    },
    action: {
      zh: project.action_zh || "",
      en: project.action_en || ""
    },
    result: {
      zh: project.result_zh || "",
      en: project.result_en || ""
    },
    thumbnail: project.thumbnail,
    keywords: project.keywords ? project.keywords.split(',').map((k: string) => k.trim()) : [],
    tags: project.tags ? project.tags.split(',').map((t: string) => t.trim()) : [],
    content: {
      zh: project.content_zh || "",
      en: project.content_en || ""
    },
    emoji: project.emoji || "📦",
    createdAt: project.created_at?.split(' ')[0] || "",
    view_count: project.view_count || 0,
    ...project
  }
}

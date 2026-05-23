export interface Skill {
  name: { zh: string; en: string }
  level: number
  category: "ai" | "product" | "technical" | "soft"
}

export const skillsData: Skill[] = [
  // AI & 技术能力
  { name: { zh: "AI Agent 设计", en: "AI Agent Design" }, level: 95, category: "ai" },
  { name: { zh: "RAG 技术", en: "RAG Technology" }, level: 90, category: "ai" },
  { name: { zh: "意图识别", en: "Intent Recognition" }, level: 88, category: "ai" },
  { name: { zh: "LLM 应用", en: "LLM Application" }, level: 92, category: "ai" },
  
  // 产品能力
  { name: { zh: "需求分析", en: "Requirements Analysis" }, level: 95, category: "product" },
  { name: { zh: "产品设计", en: "Product Design" }, level: 90, category: "product" },
  { name: { zh: "数据分析", en: "Data Analysis" }, level: 85, category: "product" },
  { name: { zh: "用户研究", en: "User Research" }, level: 82, category: "product" },
  
  // 技术技能
  { name: { zh: "React/Next.js", en: "React/Next.js" }, level: 75, category: "technical" },
  { name: { zh: "TypeScript", en: "TypeScript" }, level: 70, category: "technical" },
  { name: { zh: "SQL & Database", en: "SQL & Database" }, level: 72, category: "technical" },
  { name: { zh: "API Design", en: "API Design" }, level: 78, category: "technical" },
  
  // 软技能
  { name: { zh: "跨团队协作", en: "Cross-team Collaboration" }, level: 95, category: "soft" },
  { name: { zh: "项目管理", en: "Project Management" }, level: 88, category: "soft" },
  { name: { zh: "沟通表达", en: "Communication" }, level: 90, category: "soft" },
  { name: { zh: "创新思维", en: "Innovation" }, level: 85, category: "soft" },
]

export const skillCategories = {
  ai: { zh: "AI 能力", en: "AI Capabilities" },
  product: { zh: "产品能力", en: "Product Skills" },
  technical: { zh: "技术技能", en: "Technical Skills" },
  soft: { zh: "软技能", en: "Soft Skills" },
}

export const mockSkills = skillsData

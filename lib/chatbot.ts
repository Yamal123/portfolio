import type { ChatResponse, FAQItem, ProjectInfo } from '@/types/chatbot'
import { projectsData } from '@/data/projects'
import { skillsData } from '@/data/skills'
import type { Project } from '@/data/projects'
import type { Skill } from '@/data/skills'

const faqList: FAQItem[] = [
  {
    question: '你是谁？',
    answer: '我是您的个人网站智能助手，很高兴为您服务！我可以帮您了解网站上的项目作品、技能专长等信息。',
    keywords: ['谁', '介绍', '助手', '客服'],
  },
  {
    question: '这个网站是做什么的？',
    answer: '这是一个个人作品展示网站，展示了我的项目作品、技能专长和个人信息。您可以浏览项目案例，了解我的技术能力。',
    keywords: ['网站', '用途', '介绍', '干什么'],
  },
  {
    question: '如何联系你？',
    answer: '您可以通过网站上的联系方式页面找到我的邮箱和社交媒体链接，我会尽快回复您的消息。',
    keywords: ['联系', '邮箱', '社交', '沟通'],
  },
  {
    question: '有哪些项目作品？',
    answer: '我有多个项目作品，包括 Web 应用、移动应用和开源项目。您可以访问项目页面查看详细信息。',
    keywords: ['项目', '作品', '案例', 'portfolio'],
  },
  {
    question: '掌握哪些技能？',
    answer: '我掌握多种技术技能，包括前端开发（React、Vue、Next.js）、后端开发（Node.js）、数据库设计、AI 技术等。',
    keywords: ['技能', '技术', '能力', '专长'],
  },
  {
    question: '工作经验多少年？',
    answer: '我拥有多年的软件开发经验，专注于全栈开发和产品设计。详细信息可以在个人主页查看。',
    keywords: ['经验', '工作', '年限', '年资'],
  },
  {
    question: '项目是用什么技术栈开发的？',
    answer: '主要使用 Next.js + React + TypeScript 开发，配合 Tailwind CSS 进行样式设计，后端使用 Node.js + Fastify。',
    keywords: ['技术栈', '开发', '技术', '框架'],
  },
  {
    question: '如何部署这个网站？',
    answer: '网站使用 Vercel 进行部署，支持自动构建和预览功能。详细的部署流程可以在项目文档中找到。',
    keywords: ['部署', 'vercel', '发布', '上线'],
  },
]

const projectInfoList: ProjectInfo[] = projectsData.map((p: Project) => ({
  id: p.id,
  name: p.name.zh,
  description: p.intro.zh,
  type: p.type.zh,
  tags: p.tags,
}))

function findMatchingFAQ(query: string): FAQItem | null {
  const lowerQuery = query.toLowerCase()
  for (const faq of faqList) {
    if (faq.keywords.some((kw) => lowerQuery.includes(kw))) {
      return faq
    }
    if (lowerQuery.includes(faq.question.toLowerCase())) {
      return faq
    }
  }
  return null
}

function searchProjects(query: string): ProjectInfo[] {
  const lowerQuery = query.toLowerCase()
  return projectInfoList.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.type.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

function searchSkills(query: string): string[] {
  const lowerQuery = query.toLowerCase()
  return skillsData
    .filter(
      (s: Skill) =>
        s.name.zh.toLowerCase().includes(lowerQuery) ||
        s.name.en.toLowerCase().includes(lowerQuery)
    )
    .map((s: Skill) => s.name.zh)
}

export async function getChatResponse(query: string): Promise<ChatResponse> {
  const lowerQuery = query.toLowerCase().trim()

  const faq = findMatchingFAQ(lowerQuery)
  if (faq) {
    return { type: 'faq', content: faq.answer }
  }

  const projects = searchProjects(lowerQuery)
  if (projects.length > 0) {
    const projectList = projects
      .slice(0, 3)
      .map((p) => `- **${p.name}** (${p.type}): ${p.description}`)
      .join('\n')
    return {
      type: 'project',
      content: `我找到了 ${projects.length} 个相关项目：\n\n${projectList}`,
      projects,
    }
  }

  const matchedSkills = searchSkills(lowerQuery)
  if (matchedSkills.length > 0) {
    return {
      type: 'faq',
      content: `我掌握的相关技能：${matchedSkills.join('、')}`,
    }
  }

  if (
    lowerQuery.includes('项目') ||
    lowerQuery.includes('作品') ||
    lowerQuery.includes('project')
  ) {
    const projectList = projectInfoList
      .slice(0, 3)
      .map((p) => `- **${p.name}** (${p.type})`)
      .join('\n')
    return {
      type: 'project',
      content: `我有多个项目作品，以下是部分展示：\n\n${projectList}\n\n您可以访问项目页面查看更多详情。`,
      projects: projectInfoList.slice(0, 3),
    }
  }

  if (lowerQuery.includes('技能') || lowerQuery.includes('skill')) {
    const skillCategories = ['AI 能力', '产品能力', '技术技能', '软技能']
    return {
      type: 'faq',
      content: `我具备多方面的技能，主要包括：\n\n${skillCategories.map((c) => `- ${c}`).join('\n')}\n\n详细的技能列表可以在技能页面查看。`,
    }
  }

  return {
    type: 'unknown',
    content: `感谢您的提问！我目前主要提供以下服务：\n\n1. **项目查询** - 了解我的项目作品\n2. **技能介绍** - 了解我的技术能力\n3. **常见问题** - 关于网站的常见问题\n\n您可以尝试提问："有哪些项目？"、"掌握什么技能？"`,
  }
}

export { faqList, projectInfoList }

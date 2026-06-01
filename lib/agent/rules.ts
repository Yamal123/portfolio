import { executeTool } from './executor'
import { faqList } from '@/lib/chatbot'
import type { AgentRunOutput } from './types'
import type { ProjectInfo } from '@/types/chatbot'
import { collectArticleSources } from './sources'

function matchFaq(query: string) {
  const lower = query.toLowerCase()
  for (const faq of faqList) {
    if (faq.keywords.some((kw) => lower.includes(kw))) return faq
    if (lower.includes(faq.question.toLowerCase())) return faq
  }
  return null
}

function formatProjectList(
  items: Array<{ name: string; type: string; intro: string; url?: string }>
): string {
  return items
    .map(
      (p) =>
        `- **${p.name}**（${p.type}）${p.url ? ` [查看详情](${p.url})` : ''}\n  ${p.intro}`
    )
    .join('\n\n')
}

function formatSkillList(
  items: Array<{ name: string; level: number; category: string }>
): string {
  return items.map((s) => `- ${s.name}（${s.category}，${s.level}%）`).join('\n')
}

function formatArticleList(
  items: Array<{ title: string; intro: string; url?: string }>
): string {
  return items
    .map((a) => `- **${a.title}**${a.url ? ` [阅读](${a.url})` : ''}\n  ${a.intro}`)
    .join('\n\n')
}

function compactIntentQuery(input: string, pattern: RegExp): string {
  return input
    .replace(pattern, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function runRulesAgent(input: {
  message: string
  locale?: 'zh' | 'en'
}): Promise<AgentRunOutput> {
  const locale = input.locale || 'zh'
  const query = input.message.trim()
  const lower = query.toLowerCase()
  const toolsUsed: string[] = []

  if (
    lower.includes('联系') ||
    lower.includes('邮箱') ||
    lower.includes('contact') ||
    lower.includes('email')
  ) {
    toolsUsed.push('get_contact_info')
    const { data } = await executeTool('get_contact_info')
    const info = data as {
      email: string
      links: Array<{ label: string; url: string }>
    }
    const links = info.links.map((l) => `- [${l.label}](${l.url})`).join('\n')
    return {
      content: `联系方式：\n- 邮箱：${info.email}\n${links}`,
      mode: 'rules',
      type: 'faq',
      toolsUsed,
    }
  }

  if (
    lower.includes('导航') ||
    lower.includes('页面') ||
    lower.includes('去哪') ||
    lower.includes('site') ||
    lower.includes('navigate')
  ) {
    toolsUsed.push('get_site_info')
    const { data } = await executeTool('get_site_info')
    const site = data as {
      sections: Array<{ label: string; path: string }>
    }
    const sections = site.sections
      .map((s) => `- [${s.label}](${s.path})`)
      .join('\n')
    return {
      content: `网站主要板块：\n${sections}`,
      mode: 'rules',
      type: 'faq',
      toolsUsed,
    }
  }

  if (
    lower.includes('技能') ||
    lower.includes('skill') ||
    lower.includes('能力')
  ) {
    toolsUsed.push('list_skills')
    const category = lower.includes('ai')
      ? 'ai'
      : lower.includes('产品') || lower.includes('product')
        ? 'product'
        : undefined
    const { data } = await executeTool('list_skills', {
      category,
      query: query.replace(/技能|skill|能力/gi, '').trim(),
    })
    const result = data as {
      items: Array<{ name: string; level: number; category: string }>
    }
    return {
      content: `相关技能：\n${formatSkillList(result.items)}`,
      mode: 'rules',
      type: 'faq',
      toolsUsed,
    }
  }

  if (
    lower.includes('文章') ||
    lower.includes('方法论') ||
    lower.includes('博客') ||
    lower.includes('article') ||
    lower.includes('blog')
  ) {
    toolsUsed.push('search_articles')
    const articleQuery = compactIntentQuery(
      query,
      /文章|方法论|博客|article|blog|最近|最新|看看|给我|介绍|一下|有哪些|有什么|写了|内容|关于|please|show|list/gi,
    )
    const primary = await executeTool('search_articles', {
      query: articleQuery,
      limit: 5,
    })
    const result = primary.data as {
      items: Array<{ title: string; intro: string; url: string }>
    }
    const fallback = !result.items.length && articleQuery
      ? await executeTool('search_articles', { query: '', limit: 5 })
      : null
    const finalResult = (fallback?.data || result) as {
      items: Array<{ title: string; intro: string; url: string; date?: string }>
    }
    const sources = collectArticleSources(finalResult.items)
    return {
      content: finalResult.items.length
        ? `相关文章：\n${formatArticleList(finalResult.items)}`
        : locale === 'zh'
          ? '暂未找到匹配文章，可访问 [方法论](/blog) 浏览全部。'
          : 'No matching articles. Visit [Methodology](/blog).',
      mode: 'rules',
      type: 'text',
      toolsUsed,
      sources: sources.length ? sources : undefined,
    }
  }

  if (
    lower.includes('项目') ||
    lower.includes('作品') ||
    lower.includes('portfolio') ||
    lower.includes('案例')
  ) {
    toolsUsed.push('search_projects')
    const projectQuery = compactIntentQuery(
      query,
      /项目|作品|案例|portfolio|project|有哪些|有什么|介绍|一下|看看|给我|请|关于|show|list/gi,
    )
    const { data } = await executeTool('search_projects', {
      query: projectQuery,
      limit: 5,
    })
    const result = data as {
      total: number
      items: Array<{
        id: number
        name: string
        type: string
        intro: string
        tags: string[]
        url: string
      }>
    }
    const projects: ProjectInfo[] = result.items.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.intro,
      type: p.type,
      tags: p.tags,
    }))
    return {
      content:
        result.total > 0
          ? `找到 ${result.total} 个相关项目：\n\n${formatProjectList(result.items)}`
          : locale === 'zh'
            ? '暂未找到匹配项目，可访问 [作品集](/portfolio) 浏览全部。'
            : 'No matching projects. Visit [Portfolio](/portfolio).',
      mode: 'rules',
      type: 'project',
      toolsUsed,
      projects,
    }
  }

  const faq = matchFaq(lower)
  if (faq) {
    return {
      content: faq.answer,
      mode: 'rules',
      type: 'faq',
      toolsUsed: [],
    }
  }

  toolsUsed.push('get_site_info')
  await executeTool('get_site_info')

  return {
    content:
      locale === 'zh'
        ? `我是网站智能助手，可以帮你：\n\n1. **查项目** — 例如「有哪些 AI 项目？」\n2. **查技能** — 例如「掌握哪些 AI 技能？」\n3. **查文章** — 例如「RAG 相关文章」\n4. **联系方式** — 例如「如何联系作者？」\n\n配置 OPENAI_API_KEY 后可启用更强的 LLM Agent 模式。`
        : `I can help you search projects, skills, articles, and contact info. Set OPENAI_API_KEY to enable LLM Agent mode.`,
    mode: 'rules',
    type: 'unknown',
    toolsUsed,
  }
}

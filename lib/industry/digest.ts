import type { IndustryDigest, IndustryDigestInput, IndustryDigestItem, IndustrySourceItem, IndustrySourceLink } from './types'

const sourceWeight: Record<string, number> = {
  'GitHub Trending': 120,
  GitHub: 90,
  'Hugging Face Blog': 110,
  'Hugging Face': 100,
  ModelScope: 85,
  HFMirror: 70,
  '机器之心': 80,
  量子位: 80,
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const value = key(item)
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}

function formatItem(item: IndustryDigestItem, index: number) {
  return `${index + 1}. [${item.title}](${item.url})\n   - 来源：${item.source}\n   - 摘要：${item.summary}`
}

export function scoreIndustryItem(item: IndustrySourceItem) {
  const stars = item.metrics?.stars || 0
  const forks = item.metrics?.forks || 0
  const rankBoost = item.metrics?.rank ? Math.max(0, 60 - item.metrics.rank * 3) : 0
  const sourceBoost = sourceWeight[item.source] || 50
  const attention = Math.log10(stars + 1) * 35 + Math.log10(forks + 1) * 15
  const freshBoost = item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt)) ? 20 : 0
  return Math.round(sourceBoost + attention + rankBoost + freshBoost)
}

export function buildIndustryDigest(input: IndustryDigestInput): IndustryDigest {
  const items = uniqueBy(input.items, (item) => item.url)
    .map<IndustryDigestItem>((item) => ({ ...item, score: scoreIndustryItem(item) }))
    .sort((a, b) => b.score - a.score)

  const newsItems = items.filter((item) => item.category === 'news')
  const techItems = items.filter((item) => item.category === 'tech')
  const sources = uniqueBy<IndustrySourceLink>(
    [...newsItems, ...techItems].map((item) => ({ name: item.source, url: item.url })),
    (source) => source.name,
  )

  const digest: IndustryDigest = {
    slug: `industry-${input.date}`,
    date: input.date,
    title: {
      zh: `AI 行业动态日报｜${input.date}`,
      en: `AI Industry Daily | ${input.date}`,
    },
    intro: {
      zh: `聚合 ${sources.map((source) => source.name).join('、')} 等渠道，按关注度筛选今日值得学习和跟踪的 AI 产品、开源与技术动态。`,
      en: `A curated daily brief from ${sources.map((source) => source.name).join(', ')} ranked by relevance and attention.`,
    },
    keywords: ['AI', 'Agent', 'GitHub', 'Hugging Face', '行业动态'],
    content: { zh: '', en: '' },
    coverImage: '',
    sources,
    newsItems,
    techItems,
    published: true,
  }
  digest.content = {
    zh: renderIndustryMarkdown(digest, 'zh'),
    en: renderIndustryMarkdown(digest, 'en'),
  }
  return digest
}

export function renderIndustryMarkdown(digest: IndustryDigest, locale: 'zh' | 'en') {
  if (locale === 'en') {
    const news = digest.newsItems.map(formatItem).join('\n\n') || 'No major news collected today.'
    const tech = digest.techItems.map(formatItem).join('\n\n') || 'No major technical trend collected today.'
    const sources = digest.sources.map((source) => `- [${source.name}](${source.url})`).join('\n')
    return `# ${digest.title.en}\n\n${digest.intro.en}\n\n## Latest News\n\n${news}\n\n## Technical Trends\n\n${tech}\n\n## Learning Takeaways\n\n- Track projects with clear adoption signals, not only launch announcements.\n- Compare open-source implementation details with product scenarios you can reuse.\n- Keep notes on evaluation, deployment cost, and workflow observability.\n\n## Sources\n\n${sources}\n`
  }

  const news = digest.newsItems.map(formatItem).join('\n\n') || '今日未收集到高关注资讯。'
  const tech = digest.techItems.map(formatItem).join('\n\n') || '今日未收集到高关注技术动向。'
  const sources = digest.sources.map((source) => `- [${source.name}](${source.url})`).join('\n')
  return `# ${digest.title.zh}\n\n${digest.intro.zh}\n\n## 最新资讯\n\n${news}\n\n## 技术动向\n\n${tech}\n\n## 学习建议\n\n- 优先跟踪有明确采用信号的项目，而不是只看发布声量。\n- 将开源实现细节和自己的产品场景做对照，记录可复用的能力边界。\n- 持续关注评测、部署成本、上下文工程和工作流可观测性。\n\n## 资料来源\n\n${sources}\n`
}

export function buildFeishuIndustryCard(digest: IndustryDigest) {
  const detailUrl = `https://yumeng.dev/industry/${digest.slug}`
  const news = digest.newsItems.slice(0, 3).map((item, index) => `${index + 1}. [${item.title}](${item.url})`).join('\n') || '暂无重点资讯'
  const tech = digest.techItems.slice(0, 3).map((item, index) => `${index + 1}. [${item.title}](${item.url})`).join('\n') || '暂无重点技术动向'

  return {
    msg_type: 'interactive',
    card: {
      config: { wide_screen_mode: true },
      header: {
        title: { tag: 'plain_text', content: digest.title.zh },
        template: 'blue',
      },
      elements: [
        { tag: 'div', text: { tag: 'lark_md', content: `**${digest.date} 行业动态**\n\n${digest.intro.zh}` } },
        { tag: 'hr' },
        { tag: 'div', text: { tag: 'lark_md', content: `**最新资讯**\n${news}` } },
        { tag: 'div', text: { tag: 'lark_md', content: `**技术动向**\n${tech}` } },
        {
          tag: 'action',
          actions: [
            {
              tag: 'button',
              text: { tag: 'plain_text', content: '查看完整文章' },
              type: 'primary',
              url: detailUrl,
            },
          ],
        },
        { tag: 'note', elements: [{ tag: 'plain_text', content: '由个人作品网站行业动态模块自动整理。' }] },
      ],
    },
  }
}

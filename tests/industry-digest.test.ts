import { describe, expect, it } from 'vitest'
import {
  buildFeishuIndustryCard,
  buildIndustryDigest,
  renderIndustryMarkdown,
  scoreIndustryItem,
} from '@/lib/industry/digest'
import type { IndustrySourceItem } from '@/lib/industry/types'

const sampleItems: IndustrySourceItem[] = [
  {
    title: 'Small AI tooling note',
    url: 'https://example.com/small',
    source: 'Example',
    summary: 'A short AI tooling note.',
    category: 'tech',
    publishedAt: '2026-05-29T08:00:00.000Z',
    metrics: { stars: 40 },
  },
  {
    title: 'Hugging Face releases agent evaluation guide',
    url: 'https://huggingface.co/blog/agent-eval',
    source: 'Hugging Face Blog',
    summary: 'A practical guide for evaluating agent workflows.',
    category: 'news',
    publishedAt: '2026-05-29T09:00:00.000Z',
    metrics: { stars: 120 },
  },
  {
    title: 'Open source RAG framework trends on GitHub',
    url: 'https://github.com/example/rag-framework',
    source: 'GitHub Trending',
    summary: 'A RAG framework gains attention from developers.',
    category: 'tech',
    publishedAt: '2026-05-29T10:00:00.000Z',
    metrics: { stars: 2000, forks: 120 },
  },
]

describe('industry digest scoring', () => {
  it('scores fresh high-attention GitHub and Hugging Face items above small notes', () => {
    expect(scoreIndustryItem(sampleItems[2])).toBeGreaterThan(scoreIndustryItem(sampleItems[0]))
    expect(scoreIndustryItem(sampleItems[1])).toBeGreaterThan(scoreIndustryItem(sampleItems[0]))
  })
})

describe('industry digest rendering', () => {
  it('groups source items into news and tech sections ordered by attention', () => {
    const digest = buildIndustryDigest({
      date: '2026-05-29',
      items: sampleItems,
      siteUrl: 'https://yumeng.dev',
    })

    expect(digest.slug).toBe('industry-2026-05-29')
    expect(digest.title.zh).toBe('AI 行业动态日报｜2026-05-29')
    expect(digest.newsItems.map((item) => item.title)).toEqual([
      'Hugging Face releases agent evaluation guide',
    ])
    expect(digest.techItems.map((item) => item.title)).toEqual([
      'Open source RAG framework trends on GitHub',
      'Small AI tooling note',
    ])
    expect(digest.sources).toEqual([
      expect.objectContaining({ name: 'Hugging Face Blog' }),
      expect.objectContaining({ name: 'GitHub Trending' }),
      expect.objectContaining({ name: 'Example' }),
    ])
  })

  it('renders markdown with source links and learning takeaways', () => {
    const digest = buildIndustryDigest({
      date: '2026-05-29',
      items: sampleItems,
      siteUrl: 'https://yumeng.dev',
    })
    const markdown = renderIndustryMarkdown(digest, 'zh')

    expect(markdown).toContain('## 最新资讯')
    expect(markdown).toContain('## 技术动向')
    expect(markdown).toContain('[GitHub Trending](https://github.com/example/rag-framework)')
    expect(markdown).toContain('学习建议')
  })

  it('builds a Feishu interactive card pointing to the detail page', () => {
    const digest = buildIndustryDigest({
      date: '2026-05-29',
      items: sampleItems,
      siteUrl: 'https://yumeng.dev',
    })
    const card = buildFeishuIndustryCard(digest)

    expect(card.msg_type).toBe('interactive')
    expect(card.card.header.title.content).toContain('AI 行业动态日报')
    expect(JSON.stringify(card)).toContain('https://yumeng.dev/industry/industry-2026-05-29')
    expect(JSON.stringify(card)).toContain('最新资讯')
    expect(JSON.stringify(card)).toContain('技术动向')
  })
})

import { buildFeishuIndustryCard, buildIndustryDigest } from './digest'
import { collectIndustrySourceItems } from './sources'
import { saveIndustryUpdate, getIndustryUpdate } from '@/lib/content/repository'

function todayInShanghai() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export async function generateDailyIndustryUpdate(date = todayInShanghai()) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yumeng.dev'
  const items = await collectIndustrySourceItems()
  if (items.length === 0) throw new Error('No industry source items were collected')
  const digest = buildIndustryDigest({ date, items, siteUrl })
  return saveIndustryUpdate({
    slug: digest.slug,
    title: digest.title,
    intro: digest.intro,
    keywords: digest.keywords,
    content: digest.content,
    coverImage: digest.coverImage,
    sources: digest.sources,
    newsItems: digest.newsItems,
    techItems: digest.techItems,
    published: digest.published,
    createdAt: digest.date,
  }, false)
}

export async function pushIndustryUpdateToFeishu(slug: string) {
  const webhook = process.env.FEISHU_WEBHOOK_URL
  if (!webhook) throw new Error('FEISHU_WEBHOOK_URL is not configured')
  const update = await getIndustryUpdate(slug, true)
  if (!update) throw new Error('Industry update not found')
  const card = buildFeishuIndustryCard({
    slug: update.slug,
    date: update.createdAt,
    title: update.title,
    intro: update.intro,
    keywords: update.keywords,
    content: update.content,
    coverImage: update.coverImage,
    sources: update.sources,
    newsItems: update.newsItems.map((item) => ({ ...item, score: item.score || 0 })),
    techItems: update.techItems.map((item) => ({ ...item, score: item.score || 0 })),
    published: update.published,
  })
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.code) {
    throw new Error(body.msg || `Feishu webhook returned ${response.status}`)
  }
  return body
}

import type { IndustrySourceItem } from './types'

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function absoluteUrl(url: string, base: string) {
  try {
    return new URL(url, base).toString()
  } catch {
    return base
  }
}

async function fetchText(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PM-Industry-Radar/1.0',
      Accept: 'text/html,application/rss+xml,application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`${url} returned ${response.status}`)
  return response.text()
}

async function collectHuggingFaceBlog(): Promise<IndustrySourceItem[]> {
  const xml = await fetchText('https://huggingface.co/blog/feed.xml')
  return [...xml.matchAll(/<item>[\s\S]*?<title><!\[CDATA\[(.*?)\]\]><\/title>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>[\s\S]*?(?:<pubDate>(.*?)<\/pubDate>)?[\s\S]*?<\/item>/g)]
    .slice(0, 8)
    .map((match) => ({
      title: stripHtml(match[1]),
      url: match[2],
      source: 'Hugging Face Blog',
      summary: stripHtml(match[3]).slice(0, 260),
      category: 'news' as const,
      publishedAt: match[4] ? new Date(match[4]).toISOString() : undefined,
    }))
}

async function collectGitHubTrending(): Promise<IndustrySourceItem[]> {
  const html = await fetchText('https://github.com/trending?since=daily')
  return [...html.matchAll(/<article[\s\S]*?href="([^"]+)"[\s\S]*?<h2[\s\S]*?>([\s\S]*?)<\/h2>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/article>/g)]
    .slice(0, 10)
    .map((match, index) => {
      const title = stripHtml(match[2]).replace(/\s*\/\s*/g, '/')
      return {
        title,
        url: absoluteUrl(match[1], 'https://github.com'),
        source: 'GitHub Trending',
        summary: stripHtml(match[3]).slice(0, 260),
        category: 'tech' as const,
        metrics: { rank: index + 1 },
      }
    })
}

async function collectGitHubSearch(): Promise<IndustrySourceItem[]> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  const query = encodeURIComponent(`(agent OR rag OR llm OR multimodal) created:>${since} stars:>50`)
  const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=8`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'PM-Industry-Radar/1.0' },
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`GitHub search returned ${response.status}`)
  const data = await response.json() as { items?: Array<{ full_name: string; html_url: string; description: string | null; stargazers_count: number; forks_count: number; created_at: string }> }
  return (data.items || []).map((repo) => ({
    title: repo.full_name,
    url: repo.html_url,
    source: 'GitHub',
    summary: repo.description || 'New AI-related open-source repository.',
    category: 'tech' as const,
    publishedAt: repo.created_at,
    metrics: { stars: repo.stargazers_count, forks: repo.forks_count },
  }))
}

async function collectSimplePage(source: string, url: string, category: IndustrySourceItem['category']): Promise<IndustrySourceItem[]> {
  const html = await fetchText(url)
  const titleMatches = [...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]{20,220}?)<\/a>/g)]
  return titleMatches
    .map((match) => ({
      title: stripHtml(match[2]),
      url: absoluteUrl(match[1], url),
      source,
      summary: stripHtml(match[2]).slice(0, 220),
      category,
    }))
    .filter((item) => item.title.length >= 12 && !item.url.includes('#'))
    .slice(0, 5)
}

export async function collectIndustrySourceItems(): Promise<IndustrySourceItem[]> {
  const collectors = [
    collectHuggingFaceBlog,
    collectGitHubTrending,
    collectGitHubSearch,
    () => collectSimplePage('ModelScope', 'https://modelscope.cn/blog', 'news'),
    () => collectSimplePage('HFMirror', 'https://hf-mirror.com', 'tech'),
    () => collectSimplePage('机器之心', 'https://www.jiqizhixin.com/', 'news'),
    () => collectSimplePage('量子位', 'https://www.qbitai.com/', 'news'),
  ]

  const settled = await Promise.allSettled(collectors.map((collector) => collector()))
  return settled.flatMap((result) => result.status === 'fulfilled' ? result.value : [])
}

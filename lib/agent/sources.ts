export interface ArticleSource {
  title: string
  url: string
  intro?: string
  date?: string
}

export function collectArticleSources(
  items: Array<{ title?: string; url?: string; intro?: string; date?: string }>
): ArticleSource[] {
  const seen = new Set<string>()
  const sources: ArticleSource[] = []

  for (const item of items) {
    if (!item.title || !item.url || seen.has(item.url)) continue
    seen.add(item.url)
    sources.push({
      title: item.title,
      url: item.url,
      intro: item.intro,
      date: item.date,
    })
  }

  return sources
}

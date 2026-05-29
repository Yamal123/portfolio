export type IndustryCategory = 'news' | 'tech'

export interface IndustrySourceItem {
  title: string
  url: string
  source: string
  summary: string
  category: IndustryCategory
  publishedAt?: string
  metrics?: {
    stars?: number
    forks?: number
    rank?: number
  }
}

export interface IndustrySourceLink {
  name: string
  url: string
}

export interface IndustryDigestItem extends IndustrySourceItem {
  score: number
}

export interface IndustryDigest {
  slug: string
  date: string
  title: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  content: { zh: string; en: string }
  coverImage: string
  sources: IndustrySourceLink[]
  newsItems: IndustryDigestItem[]
  techItems: IndustryDigestItem[]
  published: boolean
}

export interface IndustryDigestInput {
  date: string
  items: IndustrySourceItem[]
  siteUrl: string
}

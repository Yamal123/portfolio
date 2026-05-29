export interface IndustrySourceLink {
  name: string
  url: string
}

export interface IndustryItem {
  title: string
  url: string
  source: string
  summary: string
  category: 'news' | 'tech'
  publishedAt?: string
  score?: number
  metrics?: {
    stars?: number
    forks?: number
    rank?: number
  }
}

export interface IndustryUpdate {
  id?: number
  slug: string
  title: { zh: string; en: string }
  intro: { zh: string; en: string }
  keywords: string[]
  content: { zh: string; en: string }
  coverImage: string
  sources: IndustrySourceLink[]
  newsItems: IndustryItem[]
  techItems: IndustryItem[]
  published: boolean
  createdAt: string
}

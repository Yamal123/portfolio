export interface Article {
  id: number
  slug: string
  title: { zh: string; en: string }
  createdAt: string
  intro: { zh: string; en: string }
  keywords: string[]
  content: { zh: string; en: string }
}

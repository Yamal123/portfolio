export type ArticleStatus = 'draft' | 'pending' | 'published'

export interface ArticlePersistenceState {
  published: boolean
  wasPublished: boolean
}

export function deriveArticleStatus(state: ArticlePersistenceState): ArticleStatus {
  if (state.published) return 'published'
  return state.wasPublished ? 'pending' : 'draft'
}

export function getArticleStatusLabel(status: ArticleStatus) {
  if (status === 'published') return '已发布'
  if (status === 'pending') return '待发布'
  return '草稿'
}

export function getPrimaryActionLabel(status: ArticleStatus) {
  return status === 'published' ? '下架' : '发布'
}


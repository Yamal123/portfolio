import type { ArticleStatus } from '@/lib/admin/article-status'
import { getPrimaryActionLabel as getArticlePrimaryActionLabel } from '@/lib/admin/article-status'

export type BulkAction = 'delete' | 'publish' | 'unpublish'

export function getPrimaryActionLabel(status: ArticleStatus) {
  return getArticlePrimaryActionLabel(status)
}

export function getBulkActionCopy(action: BulkAction, count = 3) {
  if (action === 'delete') {
    return {
      title: '批量删除',
      confirm: '确认删除',
      description: `将删除 ${count} 篇文章。此操作不可恢复，请再次确认。`,
      helper: '',
    }
  }

  if (action === 'publish') {
    return {
      title: '批量发布',
      confirm: '确认发布',
      description: `将把 ${count} 篇未发布文章发布到前台。`,
      helper: '系统会校验所选文章是否全部为未发布状态。',
    }
  }

  return {
    title: '批量下架',
    confirm: '确认下架',
    description: `将把 ${count} 篇已发布文章下架。`,
    helper: '系统会校验所选文章是否全部为已发布状态。',
  }
}

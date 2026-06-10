import { describe, expect, it } from 'vitest'
import {
  getBulkActionCopy,
  getPrimaryActionLabel,
} from '@/lib/admin/content-workbench'
import {
  deriveArticleStatus,
  getArticleStatusLabel,
} from '@/lib/admin/article-status'

describe('content workbench action copy', () => {
  it('shows publish for drafts and take-down for published articles', () => {
    expect(getPrimaryActionLabel('draft')).toBe('发布')
    expect(getPrimaryActionLabel('pending')).toBe('发布')
    expect(getPrimaryActionLabel('published')).toBe('下架')
  })

  it('derives draft pending and published states from persistence flags', () => {
    expect(deriveArticleStatus({ published: false, wasPublished: false })).toBe('draft')
    expect(deriveArticleStatus({ published: false, wasPublished: true })).toBe('pending')
    expect(deriveArticleStatus({ published: true, wasPublished: false })).toBe('published')
  })

  it('labels pending articles as 待发布', () => {
    expect(getArticleStatusLabel('draft')).toBe('草稿')
    expect(getArticleStatusLabel('pending')).toBe('待发布')
    expect(getArticleStatusLabel('published')).toBe('已发布')
  })

  it('renames unpublish copy to 下架 everywhere in bulk actions', () => {
    expect(getBulkActionCopy('publish')).toEqual({
      title: '批量发布',
      confirm: '确认发布',
      description: '将把 3 篇未发布文章发布到前台。',
      helper: '系统会校验所选文章是否全部为未发布状态。',
    })
    expect(getBulkActionCopy('unpublish')).toEqual({
      title: '批量下架',
      confirm: '确认下架',
      description: '将把 3 篇已发布文章下架。',
      helper: '系统会校验所选文章是否全部为已发布状态。',
    })
  })
})

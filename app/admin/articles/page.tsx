'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContentWorkbench, type WorkbenchItem } from '@/components/admin/ContentWorkbench'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { del, fetcher, post, put } from '@/lib/admin/fetcher'
import { deriveArticleStatus } from '@/lib/admin/article-status'
import type { ArticleInput } from '@/lib/content/contracts'

const today = new Date().toISOString().slice(0, 10)

const blankArticle: ArticleInput = {
  slug: '',
  title: { zh: '', en: '' },
  intro: { zh: '', en: '' },
  keywords: [],
  content: { zh: '', en: '' },
  published: false,
  wasPublished: false,
  createdAt: today,
}

function toWorkbench(item: ArticleInput): WorkbenchItem {
  return {
    slug: item.slug,
    title: item.title.zh,
    intro: item.intro.zh,
    createdAt: item.createdAt,
    status: deriveArticleStatus({ published: item.published, wasPublished: item.wasPublished ?? false }),
    keywords: item.keywords,
    markdown: item.content.zh,
  }
}

function fromWorkbench(item: WorkbenchItem, original?: ArticleInput): ArticleInput {
  const base = original || blankArticle
  const nextStatus = item.status
  return {
    ...base,
    slug: item.slug,
    title: { zh: item.title, en: base.title.en || item.title },
    intro: { zh: item.intro, en: base.intro.en || item.intro },
    keywords: item.keywords || base.keywords || [],
    content: { zh: item.markdown, en: base.content.en },
    published: nextStatus === 'published',
    wasPublished: nextStatus === 'published' || nextStatus === 'pending',
    createdAt: item.createdAt,
  }
}

function ArticlesContent() {
  const { data = [], mutate, isLoading } = useSWR<ArticleInput[]>('/api/management/articles', fetcher)
  const [selected, setSelected] = useState<WorkbenchItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const items = useMemo(() => data.map(toWorkbench), [data])
  const persist = async (
    item: WorkbenchItem,
    operation: 'save' | 'publish' | 'unpublish',
    nextStatus: WorkbenchItem['status'] = item.status
  ) => {
    const original = data.find((entry) => entry.slug === item.slug)
    const payload = fromWorkbench({ ...item, status: nextStatus }, original)
    if (!payload.slug || !payload.title.zh) {
      toast.error('请填写标题和 slug')
      return
    }
    const isPublishing = operation !== 'save'
    const loading = isPublishing ? setPublishing : setSaving
    loading(true)
    try {
      const exists = data.some((entry) => entry.slug === payload.slug)
      exists ? await put('/api/management/articles', payload) : await post('/api/management/articles', payload)
      await mutate()
      setSelected(toWorkbench(payload))
      setIsNew(false)
      if (operation === 'publish') {
        toast.success('方法论已发布到生产')
      } else if (operation === 'unpublish') {
        toast.success('方法论已下架为待发布')
      } else if (nextStatus === 'published') {
        toast.success('方法论已保存并保持已发布')
      } else if (nextStatus === 'pending') {
        toast.success('方法论已保存并保持待发布')
      } else {
        toast.success('方法论草稿已保存')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const remove = async (item: WorkbenchItem) => {
    const message = item.status === 'published'
      ? '该方法论已发布到生产。删除后前台生产环境会同步下架，确定删除？'
      : item.status === 'pending'
        ? '该方法论处于待发布状态。删除后将彻底移除，确定删除？'
      : '确定删除该方法论草稿？'
    if (!item.slug || !window.confirm(message)) return
    try {
      await del(`/api/management/articles?slug=${encodeURIComponent(item.slug)}`)
      await mutate()
      if (selected?.slug === item.slug) setSelected(null)
      toast.success('方法论已删除')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  const runBulk = async (action: 'delete' | 'publish' | 'unpublish', selectedItems: WorkbenchItem[]) => {
    if (selectedItems.length === 0) return
    try {
      await post('/api/management/articles/bulk', {
        action,
        slugs: selectedItems.map((item) => item.slug),
      })
      await mutate()
      setSelected(null)
      setIsNew(false)
      toast.success(action === 'delete' ? '文章已批量删除' : action === 'publish' ? '文章已批量发布' : '文章已批量下架')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '批量操作失败')
    }
  }

  return (
    <AdminLayout title="方法论">
      <ContentWorkbench
        items={items}
        selected={selected}
        isNew={isNew}
        isLoading={isLoading}
        isSaving={saving}
        isPublishing={publishing}
        supportsKeywords
        supportsBulk
        onNew={() => {
          setSelected(toWorkbench(blankArticle))
          setIsNew(true)
        }}
        onSelect={(item) => {
          setSelected(item)
          setIsNew(false)
        }}
        onChange={setSelected}
        onSaveDraft={() => selected && persist(selected, 'save', selected.status)}
        onPublish={(item) => persist(item || selected!, 'publish', 'published')}
        onUnpublish={(item) => persist(item || selected!, 'unpublish', 'pending')}
        onDelete={remove}
        onBulkDelete={(items) => runBulk('delete', items)}
        onBulkPublish={(items) => runBulk('publish', items)}
        onBulkUnpublish={(items) => runBulk('unpublish', items)}
      />
    </AdminLayout>
  )
}

export default function ArticlesPage() {
  return <ProtectedRoute><ArticlesContent /></ProtectedRoute>
}

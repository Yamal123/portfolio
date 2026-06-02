'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContentWorkbench, type WorkbenchItem } from '@/components/admin/ContentWorkbench'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { del, fetcher, post, put } from '@/lib/admin/fetcher'
import type { ArticleInput } from '@/lib/content/contracts'

const today = new Date().toISOString().slice(0, 10)

const blankArticle: ArticleInput = {
  slug: '',
  title: { zh: '', en: '' },
  intro: { zh: '', en: '' },
  keywords: [],
  content: { zh: '', en: '' },
  published: false,
  createdAt: today,
}

function toWorkbench(item: ArticleInput): WorkbenchItem {
  return {
    slug: item.slug,
    title: item.title.zh,
    intro: item.intro.zh,
    createdAt: item.createdAt,
    status: item.published ? 'published' : 'draft',
    markdown: item.content.zh,
  }
}

function fromWorkbench(item: WorkbenchItem, original?: ArticleInput): ArticleInput {
  const base = original || blankArticle
  return {
    ...base,
    slug: item.slug,
    title: { zh: item.title, en: base.title.en || item.title },
    intro: { zh: item.intro, en: base.intro.en || item.intro },
    content: { zh: item.markdown, en: base.content.en },
    published: item.status === 'published',
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
  const persist = async (item: WorkbenchItem, publish: boolean) => {
    const original = data.find((entry) => entry.slug === item.slug)
    const payload = fromWorkbench({ ...item, status: publish ? 'published' : 'draft' }, original)
    if (!payload.slug || !payload.title.zh) {
      toast.error('请填写标题和 slug')
      return
    }
    publish ? setPublishing(true) : setSaving(true)
    try {
      const exists = data.some((entry) => entry.slug === payload.slug)
      exists ? await put('/api/management/articles', payload) : await post('/api/management/articles', payload)
      await mutate()
      setSelected(toWorkbench(payload))
      setIsNew(false)
      toast.success(publish ? '方法论已发布到生产' : '方法论草稿已保存')
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

  return (
    <AdminLayout title="方法论">
      <ContentWorkbench
        items={items}
        selected={selected}
        isNew={isNew}
        isLoading={isLoading}
        isSaving={saving}
        isPublishing={publishing}
        onNew={() => {
          setSelected(toWorkbench(blankArticle))
          setIsNew(true)
        }}
        onSelect={(item) => {
          setSelected(item)
          setIsNew(false)
        }}
        onChange={setSelected}
        onSaveDraft={() => selected && persist(selected, false)}
        onPublish={(item) => persist(item || selected!, true)}
        onDelete={remove}
      />
    </AdminLayout>
  )
}

export default function ArticlesPage() {
  return <ProtectedRoute><ArticlesContent /></ProtectedRoute>
}

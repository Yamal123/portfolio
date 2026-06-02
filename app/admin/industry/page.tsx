'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContentWorkbench, type WorkbenchItem } from '@/components/admin/ContentWorkbench'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { del, fetcher, post, put } from '@/lib/admin/fetcher'
import type { IndustryUpdateInput } from '@/lib/content/contracts'

const today = new Date().toISOString().slice(0, 10)

const blankIndustry: IndustryUpdateInput = {
  slug: '',
  title: { zh: '', en: '' },
  intro: { zh: '', en: '' },
  keywords: [],
  content: { zh: '', en: '' },
  coverImage: '',
  sources: [],
  newsItems: [],
  techItems: [],
  published: false,
  createdAt: today,
}

function toWorkbench(item: IndustryUpdateInput): WorkbenchItem {
  return {
    slug: item.slug,
    title: item.title.zh,
    intro: item.intro.zh,
    createdAt: item.createdAt,
    status: item.published ? 'published' : 'draft',
    markdown: item.content.zh,
  }
}

function fromWorkbench(item: WorkbenchItem, original?: IndustryUpdateInput): IndustryUpdateInput {
  const base = original || blankIndustry
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

function IndustryContent() {
  const { data = [], mutate, isLoading } = useSWR<IndustryUpdateInput[]>('/api/management/industry-updates', fetcher)
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
      exists ? await put('/api/management/industry-updates', payload) : await post('/api/management/industry-updates', payload)
      await mutate()
      setSelected(toWorkbench(payload))
      setIsNew(false)
      toast.success(publish ? '行业动态已发布到生产' : '行业动态草稿已保存')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const remove = async (item: WorkbenchItem) => {
    const message = item.status === 'published'
      ? '该行业动态已发布到生产。删除后前台生产环境会同步下架，确定删除？'
      : '确定删除该行业动态草稿？'
    if (!item.slug || !window.confirm(message)) return
    try {
      await del(`/api/management/industry-updates?slug=${encodeURIComponent(item.slug)}`)
      await mutate()
      if (selected?.slug === item.slug) setSelected(null)
      toast.success('行业动态已删除')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <AdminLayout title="行业动态">
      <ContentWorkbench
        title="行业动态"
        items={items}
        selected={selected}
        isNew={isNew}
        isLoading={isLoading}
        isSaving={saving}
        isPublishing={publishing}
        onNew={() => {
          setSelected(toWorkbench(blankIndustry))
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

export default function IndustryAdminPage() {
  return <ProtectedRoute><IndustryContent /></ProtectedRoute>
}

'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ContentWorkbench, type WorkbenchItem } from '@/components/admin/ContentWorkbench'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { del, fetcher, post, put } from '@/lib/admin/fetcher'
import type { ProjectInput } from '@/lib/content/contracts'

const today = new Date().toISOString().slice(0, 10)

const blankProject: ProjectInput = {
  slug: '',
  name: { zh: '', en: '' },
  thumbnail: '',
  type: { zh: '个人项目', en: 'Personal Project' },
  intro: { zh: '', en: '' },
  keywords: [],
  tags: [],
  emoji: '',
  problem: { zh: '', en: '' },
  action: { zh: '', en: '' },
  result: { zh: '', en: '' },
  content: { zh: '', en: '' },
  externalUrl: '',
  published: false,
  sortOrder: 0,
  createdAt: today,
}

function toWorkbench(item: ProjectInput): WorkbenchItem {
  const hasDocument = Boolean(item.content.zh.trim())
  return {
    slug: item.slug,
    title: item.name.zh,
    intro: item.intro.zh,
    createdAt: item.createdAt || today,
    status: item.published ? 'published' : 'draft',
    kind: hasDocument ? 'document' : 'link',
    markdown: item.content.zh,
  }
}

function fromWorkbench(item: WorkbenchItem, original?: ProjectInput): ProjectInput {
  const base = original || blankProject
  return {
    ...base,
    slug: item.slug,
    name: { zh: item.title, en: base.name.en || item.title },
    intro: { zh: item.intro, en: base.intro.en || item.intro },
    content: { zh: item.kind === 'link' ? '' : item.markdown, en: base.content.en },
    externalUrl: item.kind === 'link' ? base.externalUrl : base.externalUrl,
    published: item.status === 'published',
    createdAt: item.createdAt,
  }
}

function PortfolioContent() {
  const { data = [], mutate, isLoading } = useSWR<ProjectInput[]>('/api/management/projects', fetcher)
  const [selected, setSelected] = useState<WorkbenchItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const items = useMemo(() => data.map(toWorkbench), [data])

  const persist = async (item: WorkbenchItem, publish: boolean) => {
    const original = data.find((entry) => entry.slug === item.slug)
    const payload = fromWorkbench({ ...item, status: publish ? 'published' : 'draft' }, original)
    if (!payload.slug || !payload.name.zh) {
      toast.error('请填写标题和 slug')
      return
    }
    publish ? setPublishing(true) : setSaving(true)
    try {
      const exists = data.some((entry) => entry.slug === payload.slug)
      exists ? await put('/api/management/projects', payload) : await post('/api/management/projects', payload)
      await mutate()
      setSelected(toWorkbench(payload))
      setIsNew(false)
      toast.success(publish ? '作品管理已发布到生产' : '作品管理草稿已保存')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const remove = async (item: WorkbenchItem) => {
    const message = item.status === 'published'
      ? '该作品已发布到生产。删除后前台生产环境会同步下架，确定删除？'
      : '确定删除该作品草稿？'
    if (!item.slug || !window.confirm(message)) return
    try {
      await del(`/api/management/projects?slug=${encodeURIComponent(item.slug)}`)
      await mutate()
      if (selected?.slug === item.slug) setSelected(null)
      toast.success('作品管理已删除')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  const runBulk = async (action: 'delete' | 'publish' | 'unpublish', selectedItems: WorkbenchItem[]) => {
    if (selectedItems.length === 0) return
    try {
      await post('/api/management/projects/bulk', {
        action,
        slugs: selectedItems.map((item) => item.slug),
      })
      await mutate()
      setSelected(null)
      setIsNew(false)
      toast.success(action === 'delete' ? '项目已批量删除' : action === 'publish' ? '项目已批量发布' : '项目已批量取消发布')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '批量操作失败')
    }
  }

  return (
    <AdminLayout title="作品管理">
      <ContentWorkbench
        items={items}
        selected={selected}
        isNew={isNew}
        isLoading={isLoading}
        isSaving={saving}
        isPublishing={publishing}
        supportsKind
        supportsBulk
        onNew={() => {
          setSelected(toWorkbench(blankProject))
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
        onBulkDelete={(items) => runBulk('delete', items)}
        onBulkPublish={(items) => runBulk('publish', items)}
        onBulkUnpublish={(items) => runBulk('unpublish', items)}
      />
    </AdminLayout>
  )
}

export default function PortfolioPage() {
  return <ProtectedRoute><PortfolioContent /></ProtectedRoute>
}

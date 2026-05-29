'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Edit, Eye, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { del, fetcher, post, put } from '@/lib/admin/fetcher'
import type { IndustryUpdate } from '@/types/industry'

const blank: IndustryUpdate = {
  slug: '',
  title: { zh: '', en: '' },
  intro: { zh: '', en: '' },
  keywords: [],
  content: { zh: '', en: '' },
  coverImage: '',
  sources: [],
  newsItems: [],
  techItems: [],
  published: true,
  createdAt: new Date().toISOString().slice(0, 10),
}

function parseJson<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

function IndustryContent() {
  const { data = [], mutate, isLoading } = useSWR<IndustryUpdate[]>('/api/management/industry-updates', fetcher)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<IndustryUpdate | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [sourcesText, setSourcesText] = useState('[]')
  const [newsText, setNewsText] = useState('[]')
  const [techText, setTechText] = useState('[]')

  const filtered = useMemo(() => data.filter((item) => `${item.title.zh} ${item.title.en} ${item.intro.zh}`.toLowerCase().includes(search.toLowerCase())), [data, search])
  const baseEditing = useMemo(() => (editing && !isNew ? data.find((item) => item.slug === editing.slug) || null : null), [data, editing, isNew])
  const hasDraftChanges = useMemo(() => {
    if (!editing) return false
    if (isNew) return true
    return baseEditing ? JSON.stringify(baseEditing) !== JSON.stringify(editing) : false
  }, [baseEditing, editing, isNew])

  const openEditor = (item: IndustryUpdate, nextIsNew: boolean) => {
    setEditing(item)
    setIsNew(nextIsNew)
    setSourcesText(JSON.stringify(item.sources, null, 2))
    setNewsText(JSON.stringify(item.newsItems, null, 2))
    setTechText(JSON.stringify(item.techItems, null, 2))
  }

  const save = async () => {
    if (!editing) return
    const payload = {
      ...editing,
      sources: parseJson(sourcesText, editing.sources),
      newsItems: parseJson(newsText, editing.newsItems),
      techItems: parseJson(techText, editing.techItems),
    }
    setSaving(true)
    try {
      isNew ? await post('/api/management/industry-updates', payload) : await put('/api/management/industry-updates', payload)
      await mutate()
      setEditing(null)
      toast.success('行业动态已保存并公开生效')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (slug: string) => {
    if (!window.confirm('确定删除该行业动态？')) return
    try {
      await del(`/api/management/industry-updates?slug=${encodeURIComponent(slug)}`)
      await mutate()
      toast.success('行业动态已删除')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <AdminLayout title="行业动态管理">
      <div className="mb-4 flex gap-3">
        <Input className="max-w-xs" placeholder="搜索行业动态..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button className="bg-orange-500 hover:bg-orange-600" onClick={() => openEditor({ ...blank }, true)}>
          <Plus className="mr-1 h-4 w-4" />新建动态
        </Button>
      </div>

      {isLoading ? <Loader2 className="mx-auto my-20 h-8 w-8 animate-spin" /> : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.slug}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-semibold">{item.title.zh}</p>
                  <p className="text-xs text-slate-500">{item.createdAt} / {item.published ? '已发布' : '未发布'} / {item.newsItems.length + item.techItems.length} 条信息</p>
                </div>
                <div className="flex gap-1">
                  <a className="p-2 text-slate-500" href={`/industry/${item.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" /></a>
                  <Button variant="ghost" size="icon" onClick={() => openEditor(item, false)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => remove(item.slug)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => {
        if (open) return
        if (hasDraftChanges && !window.confirm('有未保存内容，确认关闭？')) return
        setEditing(null)
      }}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogHeader><DialogTitle>{isNew ? '新建行业动态' : '编辑行业动态'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{hasDraftChanges ? '有未保存更改' : '内容已同步'}</div>
              <Entry label="Slug"><Input disabled={!isNew} value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: event.target.value })} /></Entry>
              <Bilingual label="标题" value={editing.title} set={(title) => setEditing({ ...editing, title })} />
              <Bilingual label="摘要" value={editing.intro} set={(intro) => setEditing({ ...editing, intro })} />
              <div className="grid gap-2 sm:grid-cols-3">
                <Entry label="发布日期"><Input type="date" value={editing.createdAt} onChange={(event) => setEditing({ ...editing, createdAt: event.target.value })} /></Entry>
                <Entry label="关键词（逗号分隔）"><Input value={editing.keywords.join(',')} onChange={(event) => setEditing({ ...editing, keywords: event.target.value.split(',').map((value) => value.trim()).filter(Boolean) })} /></Entry>
                <Entry label="封面图 URL"><Input value={editing.coverImage} onChange={(event) => setEditing({ ...editing, coverImage: event.target.value })} /></Entry>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Entry label="正文 Markdown（中文）"><textarea className="h-72 w-full rounded-md border p-3 text-sm" value={editing.content.zh} onChange={(event) => setEditing({ ...editing, content: { ...editing.content, zh: event.target.value } })} /></Entry>
                <Entry label="正文 Markdown（English）"><textarea className="h-72 w-full rounded-md border p-3 text-sm" value={editing.content.en} onChange={(event) => setEditing({ ...editing, content: { ...editing.content, en: event.target.value } })} /></Entry>
              </div>
              <div className="grid gap-2 lg:grid-cols-3">
                <Entry label="来源 JSON"><textarea className="h-48 w-full rounded-md border p-3 font-mono text-xs" value={sourcesText} onChange={(event) => setSourcesText(event.target.value)} /></Entry>
                <Entry label="最新资讯 JSON"><textarea className="h-48 w-full rounded-md border p-3 font-mono text-xs" value={newsText} onChange={(event) => setNewsText(event.target.value)} /></Entry>
                <Entry label="技术动向 JSON"><textarea className="h-48 w-full rounded-md border p-3 font-mono text-xs" value={techText} onChange={(event) => setTechText(event.target.value)} /></Entry>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(event) => setEditing({ ...editing, published: event.target.checked })} />公开发布</label>
              <div className="flex justify-end">
                <Button disabled={saving || !hasDraftChanges} onClick={save} className="bg-orange-500 hover:bg-orange-600">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}保存
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function Entry({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1 text-xs text-slate-500"><span>{label}</span>{children}</label>
}

function Bilingual({ label, value, set }: { label: string; value: { zh: string; en: string }; set: (value: { zh: string; en: string }) => void }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      <Entry label={`${label}（中文）`}><Input value={value.zh} onChange={(event) => set({ ...value, zh: event.target.value })} /></Entry>
      <Entry label={`${label}（English）`}><Input value={value.en} onChange={(event) => set({ ...value, en: event.target.value })} /></Entry>
    </div>
  )
}

export default function IndustryAdminPage() {
  return <ProtectedRoute><IndustryContent /></ProtectedRoute>
}

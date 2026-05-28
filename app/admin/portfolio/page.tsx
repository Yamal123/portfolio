'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Edit, Eye, Loader2, Plus, Save, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetcher, post, put, del } from '@/lib/admin/fetcher'
import type { ProjectInput } from '@/lib/content/contracts'

const blank: ProjectInput = {
  slug: '', name: { zh: '', en: '' }, thumbnail: '', type: { zh: '个人项目', en: 'Personal Project' },
  intro: { zh: '', en: '' }, keywords: [], tags: [], emoji: '', problem: { zh: '', en: '' },
  action: { zh: '', en: '' }, result: { zh: '', en: '' }, content: { zh: '', en: '' },
  externalUrl: '', published: true, sortOrder: 0,
}

function PortfolioContent() {
  const { data = [], mutate, isLoading } = useSWR<ProjectInput[]>('/api/management/projects', fetcher)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ProjectInput | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const filtered = useMemo(() => data.filter((item) => `${item.name.zh} ${item.name.en} ${item.slug}`.toLowerCase().includes(search.toLowerCase())), [data, search])
  const baseEditing = useMemo(
    () => (editing && !isNew ? data.find((item) => item.slug === editing.slug) || null : null),
    [data, editing, isNew],
  )
  const hasDraftChanges = useMemo(() => {
    if (!editing) return false
    if (isNew) return true
    return baseEditing ? JSON.stringify(baseEditing) !== JSON.stringify(editing) : false
  }, [baseEditing, editing, isNew])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    try {
      if (isNew) await post('/api/management/projects', editing)
      else await put('/api/management/projects', editing)
      await mutate()
      setEditing(null)
      toast.success('项目已保存并公开生效')
    } catch (error) { toast.error(error instanceof Error ? error.message : '保存失败') }
    finally { setSaving(false) }
  }
  const remove = async (slug: string) => {
    if (!window.confirm('确定删除该项目？')) return
    try { await del(`/api/management/projects?slug=${encodeURIComponent(slug)}`); await mutate(); toast.success('项目已删除') }
    catch (error) { toast.error(error instanceof Error ? error.message : '删除失败') }
  }
  return (
    <AdminLayout title="作品集管理">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Input className="max-w-xs" placeholder="搜索项目..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <Button onClick={() => { setEditing({ ...blank }); setIsNew(true) }} className="bg-orange-500 hover:bg-orange-600"><Plus className="mr-1 h-4 w-4" />新建项目</Button>
      </div>
      {isLoading ? <Loader2 className="mx-auto my-20 h-8 w-8 animate-spin" /> : <div className="space-y-3">{filtered.map((item) => (
        <Card key={item.slug}><CardContent className="flex items-center justify-between py-4">
          <div><p className="font-semibold">{item.name.zh}</p><p className="text-xs text-slate-500">{item.slug} / {item.published ? '已发布' : '未发布'}</p></div>
          <div className="flex gap-1">
            <a href={`/portfolio/${item.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-500"><Eye className="h-4 w-4" /></a>
            <Button size="icon" variant="ghost" onClick={() => { setEditing(item); setIsNew(false) }}><Edit className="h-4 w-4" /></Button>
            <Button size="icon" variant="ghost" className="text-red-500" onClick={() => remove(item.slug)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </CardContent></Card>
      ))}</div>}
      <Dialog open={!!editing} onOpenChange={(open) => {
        if (open) return
        if (hasDraftChanges && !window.confirm('有未保存内容，确认关闭？')) return
        setEditing(null)
      }}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>{isNew ? '新建项目' : '编辑项目'}</DialogTitle></DialogHeader>
          {editing && <div className="space-y-3">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
              {hasDraftChanges ? '有未保存更改' : '内容已同步'}
            </div>
            <div className="grid gap-2 sm:grid-cols-2"><Entry label="Slug"><Input disabled={!isNew} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Entry><Entry label="Emoji"><Input value={editing.emoji} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} /></Entry></div>
            <Bilingual label="标题" value={editing.name} set={(name) => setEditing({ ...editing, name })} />
            <Bilingual label="类型" value={editing.type} set={(type) => setEditing({ ...editing, type })} />
            <Bilingual label="简介" value={editing.intro} set={(intro) => setEditing({ ...editing, intro })} />
            <div className="grid gap-2 sm:grid-cols-2"><Entry label="关键词（逗号分隔）"><Input value={editing.keywords.join(',')} onChange={(e) => setEditing({ ...editing, keywords: csv(e.target.value) })} /></Entry><Entry label="标签（逗号分隔）"><Input value={editing.tags.join(',')} onChange={(e) => setEditing({ ...editing, tags: csv(e.target.value) })} /></Entry></div>
            <Bilingual label="问题" value={editing.problem} set={(problem) => setEditing({ ...editing, problem })} />
            <Bilingual label="行动" value={editing.action} set={(action) => setEditing({ ...editing, action })} />
            <Bilingual label="成果" value={editing.result} set={(result) => setEditing({ ...editing, result })} />
            <Entry label="封面 URL"><Input value={editing.thumbnail} onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })} /></Entry>
            <Entry label="外部链接"><Input value={editing.externalUrl} onChange={(e) => setEditing({ ...editing, externalUrl: e.target.value })} /></Entry>
            <BilingualText label="正文 Markdown" value={editing.content} set={(content) => setEditing({ ...editing, content })} />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />公开发布</label>
            <div className="flex justify-end"><Button onClick={save} disabled={saving || !hasDraftChanges} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}保存</Button></div>
          </div>}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
function csv(value: string) { return value.split(',').map((item) => item.trim()).filter(Boolean) }
function Entry({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1 text-xs text-slate-500"><span>{label}</span>{children}</label> }
function Bilingual({ label, value, set }: { label: string; value: { zh: string; en: string }; set: (value: { zh: string; en: string }) => void }) { return <div className="grid gap-2 sm:grid-cols-2"><Entry label={`${label}（中文）`}><Input value={value.zh} onChange={(e) => set({ ...value, zh: e.target.value })} /></Entry><Entry label={`${label}（English）`}><Input value={value.en} onChange={(e) => set({ ...value, en: e.target.value })} /></Entry></div> }
function BilingualText({ label, value, set }: { label: string; value: { zh: string; en: string }; set: (value: { zh: string; en: string }) => void }) { return <div className="grid gap-2 sm:grid-cols-2"><Entry label={`${label}（中文）`}><textarea className="h-44 w-full rounded-md border p-3 text-sm" value={value.zh} onChange={(e) => set({ ...value, zh: e.target.value })} /></Entry><Entry label={`${label}（English）`}><textarea className="h-44 w-full rounded-md border p-3 text-sm" value={value.en} onChange={(e) => set({ ...value, en: e.target.value })} /></Entry></div> }
export default function PortfolioPage() { return <ProtectedRoute><PortfolioContent /></ProtectedRoute> }

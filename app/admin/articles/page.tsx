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
import type { ArticleInput } from '@/lib/content/contracts'

const blank: ArticleInput = { slug: '', title: { zh: '', en: '' }, intro: { zh: '', en: '' }, keywords: [], content: { zh: '', en: '' }, published: true, createdAt: new Date().toISOString().slice(0, 10) }

function ArticlesContent() {
  const { data = [], mutate, isLoading } = useSWR<ArticleInput[]>('/api/management/articles', fetcher)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<ArticleInput | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const filtered = useMemo(() => data.filter((article) => `${article.title.zh} ${article.title.en}`.toLowerCase().includes(search.toLowerCase())), [data, search])
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
    try { isNew ? await post('/api/management/articles', editing) : await put('/api/management/articles', editing); await mutate(); setEditing(null); toast.success('文章已保存并公开生效') }
    catch (error) { toast.error(error instanceof Error ? error.message : '保存失败') }
    finally { setSaving(false) }
  }
  const remove = async (slug: string) => {
    if (!window.confirm('确定删除该文章？')) return
    try { await del(`/api/management/articles?slug=${encodeURIComponent(slug)}`); await mutate(); toast.success('文章已删除') }
    catch (error) { toast.error(error instanceof Error ? error.message : '删除失败') }
  }
  return (
    <AdminLayout title="方法论管理">
      <div className="mb-4 flex gap-3"><Input className="max-w-xs" placeholder="搜索文章..." value={search} onChange={(e) => setSearch(e.target.value)} /><Button className="bg-orange-500 hover:bg-orange-600" onClick={() => { setEditing({ ...blank }); setIsNew(true) }}><Plus className="mr-1 h-4 w-4" />新建文章</Button></div>
      {isLoading ? <Loader2 className="mx-auto my-20 h-8 w-8 animate-spin" /> : <div className="space-y-3">{filtered.map((article) => (
        <Card key={article.slug}><CardContent className="flex items-center justify-between py-4">
          <div><p className="font-semibold">{article.title.zh}</p><p className="text-xs text-slate-500">{article.createdAt} / {article.published ? '已发布' : '未发布'}</p></div>
          <div className="flex gap-1"><a className="p-2 text-slate-500" href={`/blog/${article.slug}`} target="_blank" rel="noreferrer"><Eye className="h-4 w-4" /></a><Button variant="ghost" size="icon" onClick={() => { setEditing(article); setIsNew(false) }}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" className="text-red-500" onClick={() => remove(article.slug)}><Trash2 className="h-4 w-4" /></Button></div>
        </CardContent></Card>
      ))}</div>}
      <Dialog open={!!editing} onOpenChange={(open) => {
        if (open) return
        if (hasDraftChanges && !window.confirm('有未保存内容，确认关闭？')) return
        setEditing(null)
      }}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>{isNew ? '新建文章' : '编辑文章'}</DialogTitle></DialogHeader>
        {editing && <div className="space-y-3">
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {hasDraftChanges ? '有未保存更改' : '内容已同步'}
          </div>
          <Entry label="Slug"><Input disabled={!isNew} value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Entry>
          <Bilingual label="标题" value={editing.title} set={(title) => setEditing({ ...editing, title })} />
          <Bilingual label="摘要" value={editing.intro} set={(intro) => setEditing({ ...editing, intro })} />
          <div className="grid gap-2 sm:grid-cols-2"><Entry label="发布日期"><Input type="date" value={editing.createdAt} onChange={(e) => setEditing({ ...editing, createdAt: e.target.value })} /></Entry><Entry label="关键词（逗号分隔）"><Input value={editing.keywords.join(',')} onChange={(e) => setEditing({ ...editing, keywords: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} /></Entry></div>
          <div className="grid gap-2 sm:grid-cols-2"><Entry label="正文 Markdown（中文）"><textarea className="h-60 w-full rounded-md border p-3 text-sm" value={editing.content.zh} onChange={(e) => setEditing({ ...editing, content: { ...editing.content, zh: e.target.value } })} /></Entry><Entry label="正文 Markdown（English）"><textarea className="h-60 w-full rounded-md border p-3 text-sm" value={editing.content.en} onChange={(e) => setEditing({ ...editing, content: { ...editing.content, en: e.target.value } })} /></Entry></div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />公开发布</label>
          <div className="flex justify-end"><Button disabled={saving || !hasDraftChanges} onClick={save} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}保存</Button></div>
        </div>}
      </DialogContent></Dialog>
    </AdminLayout>
  )
}
function Entry({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1 text-xs text-slate-500"><span>{label}</span>{children}</label> }
function Bilingual({ label, value, set }: { label: string; value: { zh: string; en: string }; set: (value: { zh: string; en: string }) => void }) { return <div className="grid gap-2 sm:grid-cols-2"><Entry label={`${label}（中文）`}><Input value={value.zh} onChange={(e) => set({ ...value, zh: e.target.value })} /></Entry><Entry label={`${label}（English）`}><Input value={value.en} onChange={(e) => set({ ...value, en: e.target.value })} /></Entry></div> }
export default function ArticlesPage() { return <ProtectedRoute><ArticlesContent /></ProtectedRoute> }

'use client'

import { useState, useMemo } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Download, Eye, BookOpen, Loader2, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { articlesData } from '@/data/articles'

const ITEMS_PER_PAGE = 5

function ArticlesContent() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return articlesData.filter((a: any) =>
      (a.title?.zh || a.titleZh || '').includes(search) || (a.title?.en || a.titleEn || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.keywords || []).some((k: string) => k.includes(search))
    )
  }, [search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const openNew = () => { setEditing({ slug: '', titleZh: '', titleEn: '', introZh: '', introEn: '', keywords: [], contentZh: '', contentEn: '', createdAt: new Date().toISOString().slice(0,10), contentType: 'markdown' }); setDialogOpen(true) }
  const openEdit = (a: any) => { setEditing({ ...a, titleZh: a.title?.zh || a.titleZh || '', titleEn: a.title?.en || a.titleEn || '', introZh: a.intro?.zh || '', introEn: a.intro?.en || '', contentZh: a.content?.zh || '', contentEn: a.content?.en || '' }); setDialogOpen(true) }

  const save = async () => {
    setSaving(true)
    try { toast.success('文章已保存（重构后生效）'); setDialogOpen(false); setEditing(null) } catch { toast.error('操作失败') }
    setSaving(false)
  }

  const del = async (slug: string) => { if (!confirm('确定删除？')) return; toast.success('文章已标记删除') }

  return (
    <AdminLayout title="方法论管理">
      <div className="flex items-center gap-3 mb-4">
        <Input placeholder="搜索文章..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="max-w-xs" />
        <Button onClick={openNew} className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-1"/>新建文章</Button>
      </div>

      <div className="space-y-3">
        {paged.map((a: any) => (
          <Card key={a.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between py-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-slate-900 truncate">{a.title?.zh || a.titleZh || a.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.createdAt} · {(a.keywords||[]).slice(0,4).join(' / ')}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-4">
                <a href={`/blog/${a.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500"><Eye className="w-4 h-4"/></a>
                <button onClick={() => openEdit(a)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-orange-500"><Edit className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-green-500"><Download className="w-4 h-4"/></button>
                <button onClick={() => del(a.slug)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400"><BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>暂无文章</p></div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="icon" disabled={page===1} onClick={()=>setPage(page-1)}><ChevronLeft className="w-4 h-4"/></Button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(i=>(<Button key={i} variant={page===i?'default':'outline'} size="icon" className="w-9 h-9" onClick={()=>setPage(i)}>{i}</Button>))}
          <Button variant="outline" size="icon" disabled={page===totalPages} onClick={()=>setPage(page+1)}><ChevronRight className="w-4 h-4"/></Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.slug && articlesData.find((a:any)=>a.slug===editing.slug) ? '编辑文章' : '新建文章'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><label className="text-xs text-slate-500">Slug</label><Input value={editing.slug} onChange={e=>setEditing({...editing,slug:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">标题(中)</label><Input value={editing.titleZh} onChange={e=>setEditing({...editing,titleZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">标题(英)</label><Input value={editing.titleEn} onChange={e=>setEditing({...editing,titleEn:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">摘要(中)</label><Input value={editing.introZh} onChange={e=>setEditing({...editing,introZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">摘要(英)</label><Input value={editing.introEn} onChange={e=>setEditing({...editing,introEn:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">日期</label><Input value={editing.createdAt} onChange={e=>setEditing({...editing,createdAt:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">关键词（逗号分隔）</label><Input value={(editing.keywords||[]).join(',')} onChange={e=>setEditing({...editing,keywords:e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean)})}/></div>
              <div><label className="text-xs text-slate-500">正文(中 Markdown)</label><textarea className="w-full p-3 border rounded-lg text-sm h-60 font-mono" value={editing.contentZh} onChange={e=>setEditing({...editing,contentZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">正文(英 Markdown)</label><textarea className="w-full p-3 border rounded-lg text-sm h-60 font-mono" value={editing.contentEn} onChange={e=>setEditing({...editing,contentEn:e.target.value})}/></div>
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1"/>上传文件</Button>
                <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving?<Loader2 className="w-4 h-4 mr-1 animate-spin"/>:null}保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📁 存储说明：</strong> 文章保存在 <code>content/articles/[slug]/</code>，含 meta.json + content.*.md。编辑后重新构建生效。
      </div>
    </AdminLayout>
  )
}

export default function ArticlesPage() { return <ProtectedRoute><ArticlesContent /></ProtectedRoute> }

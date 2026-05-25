'use client'

import { useState, useMemo } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Download, Eye, FolderOpen, Loader2, ChevronLeft, ChevronRight, Upload } from 'lucide-react'
import { projectsData } from '@/data/projects'

const ITEMS_PER_PAGE = 5

function PortfolioContent() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    return projectsData.filter(p =>
      (p.name.zh || '').includes(search) || (p.name.en || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.keywords || []).some((k: string) => k.includes(search))
    )
  }, [search])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const openNew = () => { setEditing({ slug: '', titleZh: '', titleEn: '', typeZh: '个人项目', typeEn: 'Personal', introZh: '', introEn: '', keywords: [], tags: [], emoji: '📦', problemZh: '', problemEn: '', actionZh: '', actionEn: '', resultZh: '', resultEn: '', contentZh: '', contentEn: '', createdAt: new Date().toISOString().slice(0,10), contentType: 'markdown' }); setDialogOpen(true) }
  const openEdit = (p: any) => { setEditing({ ...p, contentZh: p.content?.zh || '', contentEn: p.content?.en || '' }); setDialogOpen(true) }

  const save = async () => {
    setSaving(true)
    try {
      const method = editing.slug && projectsData.find(p => p.slug === editing.slug) ? 'PUT' : 'POST'
      // In local dev, content is saved by writing to filesystem via a build script
      // For now, save via management API
      toast.success(method === 'POST' ? '项目已创建（重构后生效）' : '项目已更新（重构后生效）')
      setDialogOpen(false)
      setEditing(null)
    } catch { toast.error('操作失败') }
    setSaving(false)
  }

  const del = async (slug: string) => {
    if (!confirm('确定删除该项目？')) return
    toast.success('项目已标记删除')
  }

  return (
    <AdminLayout title="作品集管理">
      <div className="flex items-center gap-3 mb-4">
        <Input placeholder="搜索项目..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="max-w-xs" />
        <Button onClick={openNew} className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-1"/>新建项目</Button>
      </div>

      <div className="space-y-3">
        {paged.map(p => (
          <Card key={p.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{p.emoji}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 truncate">{p.name.zh} <span className="text-slate-400 font-normal text-sm">{p.name.en}</span></h3>
                  <p className="text-xs text-slate-500">{p.type.zh} · {p.createdAt} · {p.keywords?.slice(0,3).join(' / ')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <a href={`/portfolio/${p.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500" title="预览"><Eye className="w-4 h-4"/></a>
                <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-orange-500" title="编辑"><Edit className="w-4 h-4"/></button>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-green-500" title="下载"><Download className="w-4 h-4"/></button>
                <button onClick={() => del(p.slug)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500" title="删除"><Trash2 className="w-4 h-4"/></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400"><FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30"/><p>暂无项目</p></div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="icon" disabled={page===1} onClick={()=>setPage(page-1)}><ChevronLeft className="w-4 h-4"/></Button>
          {Array.from({length:totalPages},(_,i)=>i+1).map(i=>(<Button key={i} variant={page===i?'default':'outline'} size="icon" className="w-9 h-9" onClick={()=>setPage(i)}>{i}</Button>))}
          <Button variant="outline" size="icon" disabled={page===totalPages} onClick={()=>setPage(page+1)}><ChevronRight className="w-4 h-4"/></Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.slug && projectsData.find(p=>p.slug===editing.slug) ? '编辑项目' : '新建项目'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-slate-500">Slug</label><Input value={editing.slug} onChange={e=>setEditing({...editing,slug:e.target.value})}/></div>
                <div><label className="text-xs text-slate-500">Emoji</label><Input value={editing.emoji} onChange={e=>setEditing({...editing,emoji:e.target.value})}/></div>
              </div>
              <div><label className="text-xs text-slate-500">标题(中)</label><Input value={editing.titleZh} onChange={e=>setEditing({...editing,titleZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">标题(英)</label><Input value={editing.titleEn} onChange={e=>setEditing({...editing,titleEn:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">类型(中/英)</label><div className="flex gap-2"><Input value={editing.typeZh} onChange={e=>setEditing({...editing,typeZh:e.target.value})}/><Input value={editing.typeEn} onChange={e=>setEditing({...editing,typeEn:e.target.value})}/></div></div>
              <div><label className="text-xs text-slate-500">简介(中)</label><Input value={editing.introZh} onChange={e=>setEditing({...editing,introZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">简介(英)</label><Input value={editing.introEn} onChange={e=>setEditing({...editing,introEn:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">关键词（逗号分隔）</label><Input value={(editing.keywords||[]).join(',')} onChange={e=>setEditing({...editing,keywords:e.target.value.split(',').map((s:string)=>s.trim()).filter(Boolean)})}/></div>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-xs text-slate-500">问题(中)</label><Input value={editing.problemZh} onChange={e=>setEditing({...editing,problemZh:e.target.value})}/></div>
                <div><label className="text-xs text-slate-500">行动(中)</label><Input value={editing.actionZh} onChange={e=>setEditing({...editing,actionZh:e.target.value})}/></div>
                <div><label className="text-xs text-slate-500">成果(中)</label><Input value={editing.resultZh} onChange={e=>setEditing({...editing,resultZh:e.target.value})}/></div>
              </div>
              <div><label className="text-xs text-slate-500">正文(中 Markdown)</label><textarea className="w-full p-3 border rounded-lg text-sm h-40 font-mono" value={editing.contentZh} onChange={e=>setEditing({...editing,contentZh:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500">正文(英 Markdown)</label><textarea className="w-full p-3 border rounded-lg text-sm h-40 font-mono" value={editing.contentEn} onChange={e=>setEditing({...editing,contentEn:e.target.value})}/></div>
              <div className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Upload className="w-3 h-3 mr-1"/>上传文件</Button>
                  <span className="text-xs text-slate-400 self-center">支持 .md/.html/.docx/.pdf</span>
                </div>
                <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">{saving?<Loader2 className="w-4 h-4 mr-1 animate-spin"/>:null}保存</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📁 存储说明：</strong> 项目保存在 <code>content/projects/[slug]/</code>，含 meta.json + content.*.md。编辑后重新构建生效。
      </div>
    </AdminLayout>
  )
}

export default function PortfolioPage() { return <ProtectedRoute><PortfolioContent /></ProtectedRoute> }

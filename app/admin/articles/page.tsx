'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Eye, Edit, BookOpen } from 'lucide-react'
import { articlesData } from '@/data/articles'

function ArticlesContent() {
  const [search, setSearch] = useState('')
  const filtered = articlesData.filter(a =>
    (a.title?.zh || '').includes(search) || (a.title?.en || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.keywords || []).some((k: string) => k.includes(search))
  )

  return (
    <AdminLayout title="方法论管理">
      <div className="flex items-center gap-3 mb-4">
        <Input placeholder="搜索文章..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Button className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-1"/>新建文章</Button>
      </div>

      <div className="space-y-3">
        {filtered.map(a => (
          <Card key={a.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">{(a.title as any)?.zh || a.title || ''}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.createdAt} · {(a.keywords || []).slice(0, 3).join(' / ')}</p>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <a href={`/blog/${a.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500"><Eye className="w-4 h-4"/></a>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-orange-500"><Edit className="w-4 h-4"/></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p>{search ? '没有匹配的文章' : '暂无文章，点击"新建文章"开始'}</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📁 文件存储说明：</strong> 每篇文章的元数据保存在 <code>content/articles/[slug]/meta.json</code>，
        正文以 Markdown 文件保存，支持中英双语。编辑时直接修改源文件。
      </div>
    </AdminLayout>
  )
}

export default function ArticlesPage() { return <ProtectedRoute><ArticlesContent /></ProtectedRoute> }

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, ExternalLink, Edit, Eye, FolderOpen } from 'lucide-react'
import { projectsData } from '@/data/projects'

function PortfolioContent() {
  const [search, setSearch] = useState('')
  const filtered = projectsData.filter(p =>
    p.name.zh.includes(search) || p.name.en.toLowerCase().includes(search.toLowerCase()) ||
    p.keywords.some(k => k.includes(search))
  )

  return (
    <AdminLayout title="作品集管理">
      <div className="flex items-center gap-3 mb-4">
        <Input placeholder="搜索项目..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Button className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-1"/>新建项目</Button>
      </div>

      <div className="space-y-3">
        {filtered.map(p => (
          <Card key={p.slug} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.emoji}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{p.name.zh} <span className="text-slate-400 font-normal text-sm">{p.name.en}</span></h3>
                  <p className="text-xs text-slate-500 mt-0.5">{p.type.zh} · {p.createdAt} · 浏览 {p.view_count}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <a href={`/portfolio/${p.slug}`} target="_blank" className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-500"><Eye className="w-4 h-4"/></a>
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-orange-500"><Edit className="w-4 h-4"/></button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30"/>
            <p>{search ? '没有匹配的项目' : '暂无项目，点击"新建项目"开始'}</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📁 文件存储说明：</strong> 每个项目的元数据保存在 <code>content/projects/[slug]/meta.json</code>，
        正文内容以 Markdown 文件保存。编辑项目时直接修改源文件，提交后生效。
      </div>
    </AdminLayout>
  )
}

export default function PortfolioPage() { return <ProtectedRoute><PortfolioContent /></ProtectedRoute> }

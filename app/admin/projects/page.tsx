'use client'

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { fetcher, post, put, del } from '@/lib/admin/fetcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Eye, Check, X, Briefcase, FileText, Image, Settings } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types/admin'
import { Badge } from '@/components/ui/badge'

function ProjectsContent() {
  const { data: projects, isLoading } = useSWR<Project[]>('/projects', fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState({
    slug: '',
    name_zh: '',
    name_en: '',
    type_zh: '个人项目',
    type_en: 'Personal Project',
    intro_zh: '',
    intro_en: '',
    problem_zh: '',
    problem_en: '',
    action_zh: '',
    action_en: '',
    result_zh: '',
    result_en: '',
    thumbnail: '',
    content_zh: '',
    content_en: '',
    keywords: '',
    tags: '',
    emoji: '📦',
    external_url: '',
    cate_id: 1,
    status: 1,
    sort_num: 0,
  })

  const handleAdd = () => {
    setEditingProject(null)
    setFormData({
      slug: '',
      name_zh: '',
      name_en: '',
      type_zh: '个人项目',
      type_en: 'Personal Project',
      intro_zh: '',
      intro_en: '',
      problem_zh: '',
      problem_en: '',
      action_zh: '',
      action_en: '',
      result_zh: '',
      result_en: '',
      thumbnail: '',
      content_zh: '',
      content_en: '',
      keywords: '',
      tags: '',
      emoji: '📦',
      external_url: '',
      cate_id: 1,
      status: 1,
      sort_num: 0,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      slug: project.slug,
      name_zh: project.name_zh,
      name_en: project.name_en,
      type_zh: project.type_zh || '个人项目',
      type_en: project.type_en || 'Personal Project',
      intro_zh: project.intro_zh || '',
      intro_en: project.intro_en || '',
      problem_zh: project.problem_zh || '',
      problem_en: project.problem_en || '',
      action_zh: project.action_zh || '',
      action_en: project.action_en || '',
      result_zh: project.result_zh || '',
      result_en: project.result_en || '',
      thumbnail: project.thumbnail || '',
      content_zh: project.content_zh || '',
      content_en: project.content_en || '',
      keywords: project.keywords || '',
      tags: project.tags || '',
      emoji: project.emoji || '📦',
      external_url: project.external_url || '',
      cate_id: project.cate_id,
      status: project.status,
      sort_num: project.sort_num,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (project: Project) => {
    setDeletingProject(project)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProject) {
        await put(`/projects/${editingProject.id}`, formData)
        toast.success('项目更新成功')
      } else {
        await post('/projects', formData)
        toast.success('项目创建成功')
      }
      mutate('/projects')
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const confirmDelete = async () => {
    if (!deletingProject) return
    try {
      await del(`/projects/${deletingProject.id}`)
      toast.success('项目删除成功')
      mutate('/projects')
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <AdminLayout title="项目管理">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">项目管理</h2>
            <p className="text-gray-500 mt-1">管理您的项目案例</p>
          </div>
          <Button 
            onClick={handleAdd} 
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-200 px-6 py-2.5"
          >
            <Plus className="w-5 h-5 mr-2" />
            添加项目
          </Button>
        </div>

        <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 rounded-xl">
          <CardHeader className="bg-gray-50 border-b border-gray-100 rounded-t-xl">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              项目列表
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="divide-y divide-gray-100">
              <TableHeader className="bg-gray-50/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-gray-700 px-6">项目名称</TableHead>
                  <TableHead className="font-semibold text-gray-700">分类</TableHead>
                  <TableHead className="font-semibold text-gray-700">状态</TableHead>
                  <TableHead className="font-semibold text-gray-700">浏览量</TableHead>
                  <TableHead className="font-semibold text-gray-700">排序</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-right px-6">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-500 font-medium">加载中...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : projects?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Briefcase className="w-10 h-10 text-gray-400" />
                        </div>
                        <span className="text-gray-500 font-medium">暂无项目</span>
                        <Button 
                          variant="outline" 
                          size="default" 
                          onClick={handleAdd} 
                          className="mt-2 px-5"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          创建第一个项目
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  projects?.map((project) => (
                    <TableRow key={project.id} className="hover:bg-blue-50/60 transition-colors">
                      <TableCell className="font-medium px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{project.emoji || '📦'}</span>
                          <div>
                            <div className="text-gray-900 font-medium text-base">{project.name_zh}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{project.name_en}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant="secondary" 
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium px-3 py-1"
                        >
                          分类 {project.cate_id}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                            project.status === 1
                              ? 'bg-green-50 text-green-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {project.status === 1 ? (
                            <Check className="w-3.5 h-3.5 mr-1.5" />
                          ) : (
                            <X className="w-3.5 h-3.5 mr-1.5" />
                          )}
                          {project.status === 1 ? '启用' : '禁用'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-gray-600 font-medium">{project.view_count}</TableCell>
                      <TableCell className="py-4 text-gray-600 font-medium">{project.sort_num}</TableCell>
                      <TableCell className="text-right px-6 py-4">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="w-4.5 h-4.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() => handleDelete(project)}
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 shadow-2xl rounded-2xl border border-gray-200">
            <DialogHeader className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-6 rounded-t-2xl">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {editingProject ? '编辑项目' : '添加项目'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base">基本信息</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="project-slug"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Emoji</label>
                    <Input
                      value={formData.emoji}
                      onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="📦"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      项目名称 (中文) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name_zh}
                      onChange={(e) => setFormData({ ...formData, name_zh: e.target.value })}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="项目名称"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      项目名称 (英文) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                      required
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">项目类型 (中文)</label>
                    <Input
                      value={formData.type_zh}
                      onChange={(e) => setFormData({ ...formData, type_zh: e.target.value })}
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="个人项目"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">项目类型 (英文)</label>
                    <Input
                      value={formData.type_en}
                      onChange={(e) => setFormData({ ...formData, type_en: e.target.value })}
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="Personal Project"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-800 text-base">项目内容</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">简介 (中文)</label>
                    <Textarea
                      value={formData.intro_zh}
                      onChange={(e) => setFormData({ ...formData, intro_zh: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="项目简介..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">简介 (英文)</label>
                    <Textarea
                      value={formData.intro_en}
                      onChange={(e) => setFormData({ ...formData, intro_en: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Project intro..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">问题/挑战 (中文)</label>
                    <Textarea
                      value={formData.problem_zh}
                      onChange={(e) => setFormData({ ...formData, problem_zh: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="遇到的问题..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">问题/挑战 (英文)</label>
                    <Textarea
                      value={formData.problem_en}
                      onChange={(e) => setFormData({ ...formData, problem_en: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Challenges..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">行动/方案 (中文)</label>
                    <Textarea
                      value={formData.action_zh}
                      onChange={(e) => setFormData({ ...formData, action_zh: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="采取的行动..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">行动/方案 (英文)</label>
                    <Textarea
                      value={formData.action_en}
                      onChange={(e) => setFormData({ ...formData, action_en: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Actions taken..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">结果/成果 (中文)</label>
                    <Textarea
                      value={formData.result_zh}
                      onChange={(e) => setFormData({ ...formData, result_zh: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="取得的成果..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">结果/成果 (英文)</label>
                    <Textarea
                      value={formData.result_en}
                      onChange={(e) => setFormData({ ...formData, result_en: e.target.value })}
                      rows={2}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Results achieved..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base">详细内容</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">内容 (中文)</label>
                    <Textarea
                      value={formData.content_zh}
                      onChange={(e) => setFormData({ ...formData, content_zh: e.target.value })}
                      rows={4}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="详细描述..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">内容 (英文)</label>
                    <Textarea
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      rows={4}
                      className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Detailed description..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl border border-green-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
                    <Image className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-800 text-base">媒体与标签</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">缩略图 URL</label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">关键词 (逗号分隔)</label>
                      <Input
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                        placeholder="React, Next.js, TypeScript"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">标签 (逗号分隔)</label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                        placeholder="Web, Mobile, Desktop"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base">设置</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">分类 ID</label>
                    <Input
                      type="number"
                      value={formData.cate_id}
                      onChange={(e) =>
                        setFormData({ ...formData, cate_id: parseInt(e.target.value) || 1 })
                      }
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">排序</label>
                    <Input
                      type="number"
                      value={formData.sort_num}
                      onChange={(e) =>
                        setFormData({ ...formData, sort_num: parseInt(e.target.value) || 0 })
                      }
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">状态</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: parseInt(e.target.value) })
                      }
                      className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/30 focus:outline-none transition-all"
                    >
                      <option value={1}>启用</option>
                      <option value={0}>禁用</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">外部链接</label>
                    <Input
                      value={formData.external_url}
                      onChange={(e) => setFormData({ ...formData, external_url: e.target.value })}
                      className="h-11 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/30 text-gray-900 placeholder-gray-400"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-11 px-6 rounded-lg border-gray-200 hover:bg-gray-50 font-medium"
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 px-8 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 font-medium"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {editingProject ? '更新项目' : '创建项目'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-xl border-gray-200 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-gray-900">确认删除</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                您确定要删除项目 "{deletingProject?.name_zh}" 吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="h-10 px-6 rounded-lg border-gray-200 hover:bg-gray-50 font-medium">
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="h-10 px-6 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 font-medium"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}

export default function ProjectsPage() {
  return (
    <ProtectedRoute>
      <ProjectsContent />
    </ProtectedRoute>
  )
}

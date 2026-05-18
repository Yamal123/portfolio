'use client'

import { useState } from 'react'
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
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'
import type { Project } from '@/types/admin'

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
    thumbnail: '',
    content_zh: '',
    content_en: '',
    tags: '',
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
      thumbnail: '',
      content_zh: '',
      content_en: '',
      tags: '',
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
      thumbnail: project.thumbnail || '',
      content_zh: project.content_zh,
      content_en: project.content_en,
      tags: project.tags,
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
          <p className="text-slate-500">管理您的项目案例</p>
          <Button onClick={handleAdd} className="bg-[#3370ff] hover:bg-[#2958cc]">
            <Plus className="w-4 h-4 mr-2" />
            添加项目
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>项目名称</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>浏览量</TableHead>
                  <TableHead>排序</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : projects?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      暂无项目
                    </TableCell>
                  </TableRow>
                ) : (
                  projects?.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        <div>{project.name_zh}</div>
                        <div className="text-xs text-slate-400">
                          {project.name_en}
                        </div>
                      </TableCell>
                      <TableCell>分类 {project.cate_id}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 1
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {project.status === 1 ? '启用' : '禁用'}
                        </span>
                      </TableCell>
                      <TableCell>{project.view_count}</TableCell>
                      <TableCell>{project.sort_num}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(project)}
                          >
                            <Trash2 className="w-4 h-4" />
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? '编辑项目' : '添加项目'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Slug
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    外部链接
                  </label>
                  <Input
                    value={formData.external_url}
                    onChange={(e) =>
                      setFormData({ ...formData, external_url: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    项目名称 (中文)
                  </label>
                  <Input
                    value={formData.name_zh}
                    onChange={(e) =>
                      setFormData({ ...formData, name_zh: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    项目名称 (英文)
                  </label>
                  <Input
                    value={formData.name_en}
                    onChange={(e) =>
                      setFormData({ ...formData, name_en: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  缩略图 URL
                </label>
                <Input
                  value={formData.thumbnail}
                  onChange={(e) =>
                    setFormData({ ...formData, thumbnail: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  内容 (中文)
                </label>
                <Textarea
                  value={formData.content_zh}
                  onChange={(e) =>
                    setFormData({ ...formData, content_zh: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  内容 (英文)
                </label>
                <Textarea
                  value={formData.content_en}
                  onChange={(e) =>
                    setFormData({ ...formData, content_en: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  标签 (逗号分隔)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    分类 ID
                  </label>
                  <Input
                    type="number"
                    value={formData.cate_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cate_id: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    排序
                  </label>
                  <Input
                    type="number"
                    value={formData.sort_num}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sort_num: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    状态
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3370ff]"
                  >
                    <option value={1}>启用</option>
                    <option value={0}>禁用</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit" className="bg-[#3370ff] hover:bg-[#2958cc]">
                  保存
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除项目 "{deletingProject?.name_zh}" 吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700"
              >
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

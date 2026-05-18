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
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Skill } from '@/types/admin'

function SkillsContent() {
  const { data: skills, isLoading } = useSWR<Skill[]>('/skills', fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    cate_id: 1,
    description: '',
    tags: '',
    icon_url: '',
    sort_num: 0,
    status: 1,
  })

  const handleAdd = () => {
    setEditingSkill(null)
    setFormData({
      name: '',
      level: 50,
      cate_id: 1,
      description: '',
      tags: '',
      icon_url: '',
      sort_num: 0,
      status: 1,
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      level: skill.level,
      cate_id: skill.cate_id,
      description: skill.description || '',
      tags: skill.tags || '',
      icon_url: skill.icon_url || '',
      sort_num: skill.sort_num,
      status: skill.status,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (skill: Skill) => {
    setDeletingSkill(skill)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingSkill) {
        await put(`/skills/${editingSkill.id}`, formData)
        toast.success('技能更新成功')
      } else {
        await post('/skills', formData)
        toast.success('技能创建成功')
      }
      mutate('/skills')
      setIsDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败')
    }
  }

  const confirmDelete = async () => {
    if (!deletingSkill) return
    try {
      await del(`/skills/${deletingSkill.id}`)
      toast.success('技能删除成功')
      mutate('/skills')
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }

  return (
    <AdminLayout title="技能管理">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-slate-500">管理您的专业技能</p>
          <Button onClick={handleAdd} className="bg-[#3370ff] hover:bg-[#2958cc]">
            <Plus className="w-4 h-4 mr-2" />
            添加技能
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>技能名称</TableHead>
                  <TableHead>熟练度</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>状态</TableHead>
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
                ) : skills?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      暂无技能
                    </TableCell>
                  </TableRow>
                ) : (
                  skills?.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell className="font-medium">{skill.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#3370ff] rounded-full"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-500">
                            {skill.level}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>分类 {skill.cate_id}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            skill.status === 1
                              ? 'bg-green-100 text-green-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {skill.status === 1 ? '启用' : '禁用'}
                        </span>
                      </TableCell>
                      <TableCell>{skill.sort_num}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(skill)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(skill)}
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSkill ? '编辑技能' : '添加技能'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  技能名称
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  熟练度 (0-100)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      level: parseInt(e.target.value) || 0,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  图标 URL
                </label>
                <Input
                  value={formData.icon_url}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  描述
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
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
                您确定要删除技能 "{deletingSkill?.name}" 吗？此操作无法撤销。
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

export default function SkillsPage() {
  return (
    <ProtectedRoute>
      <SkillsContent />
    </ProtectedRoute>
  )
}

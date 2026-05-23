'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { DataTable } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { fetcher, post, put, del } from '@/lib/admin/fetcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Check, X } from 'lucide-react'
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

  const columns = [
    {
      key: 'name',
      label: '技能名称',
    },
    {
      key: 'level',
      label: '熟练度',
      render: (skill: Skill) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              style={{ width: `${skill.level}%` }}
            />
          </div>
          <span className="text-sm text-gray-600 font-medium">{skill.level}%</span>
        </div>
      ),
    },
    {
      key: 'cate_id',
      label: '分类',
      render: (skill: Skill) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
          分类 {skill.cate_id}
        </span>
      ),
    },
    {
      key: 'status',
      label: '状态',
      render: (skill: Skill) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            skill.status === 1
              ? 'bg-green-50 text-green-600'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {skill.status === 1 ? (
            <Check className="w-3 h-3 mr-1" />
          ) : (
            <X className="w-3 h-3 mr-1" />
          )}
          {skill.status === 1 ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      key: 'sort_num',
      label: '排序',
    },
  ]

  return (
    <AdminLayout title="技能管理">
      <PageHeader
        title="技能管理"
        subtitle="管理您的专业技能"
        actionLabel="添加技能"
        onAction={handleAdd}
      />

      <Card className="shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <DataTable<Skill>
            data={skills || []}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
            emptyText="暂无技能"
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl -mx-6 -mt-6">
            <DialogTitle className="text-lg font-bold">
              {editingSkill ? '编辑技能' : '添加技能'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  技能名称 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  熟练度 (0-100) <span className="text-red-500">*</span>
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
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">图标 URL</label>
                <Input
                  value={formData.icon_url}
                  onChange={(e) =>
                    setFormData({ ...formData, icon_url: e.target.value })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">分类 ID</label>
                <Input
                  type="number"
                  value={formData.cate_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cate_id: parseInt(e.target.value) || 1,
                    })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">描述</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="rounded-lg resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  标签 (逗号分隔)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">排序</label>
                <Input
                  type="number"
                  value={formData.sort_num}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_num: parseInt(e.target.value) || 0,
                    })
                  }
                  className="h-10 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-blue-400 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value={1}>启用</option>
                  <option value={0}>禁用</option>
                </select>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-gray-100 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-10 px-6 rounded-lg"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="h-10 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                <Check className="w-4 h-4 mr-2" />
                {editingSkill ? '更新技能' : '创建技能'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-gray-900">确认删除</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              您确定要删除技能 "{deletingSkill?.name}" 吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="h-10 px-6 rounded-lg">取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="h-10 px-6 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

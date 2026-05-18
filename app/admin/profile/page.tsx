'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { fetcher, put } from '@/lib/admin/fetcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { UserProfile } from '@/types/admin'

function ProfileContent() {
  const { data: profile, isLoading } = useSWR<UserProfile>('/profile', fetcher)
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    signature: '',
    introduction: '',
    years_of_experience: 0,
    project_count: 0,
    success_rate: 0,
    location: '',
    website: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  React.useEffect(() => {
    if (profile) {
      setFormData({
        nickname: profile.nickname,
        avatar: profile.avatar || '',
        signature: profile.signature || '',
        introduction: profile.introduction || '',
        years_of_experience: profile.years_of_experience || 0,
        project_count: profile.project_count || 0,
        success_rate: profile.success_rate || 0,
        location: profile.location || '',
        website: profile.website || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || '',
        twitter_url: profile.twitter_url || '',
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await put('/profile', formData)
      toast.success('个人信息更新成功')
      mutate('/profile')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="个人主页信息">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">加载中...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="个人主页信息">
      <div className="space-y-6">
        <p className="text-slate-500">管理您的个人主页展示信息</p>

        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    昵称
                  </label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    所在地
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  头像 URL
                </label>
                <Input
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData({ ...formData, avatar: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  个性签名
                </label>
                <Input
                  value={formData.signature}
                  onChange={(e) =>
                    setFormData({ ...formData, signature: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  个人简介
                </label>
                <Textarea
                  value={formData.introduction}
                  onChange={(e) =>
                    setFormData({ ...formData, introduction: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    工作年限
                  </label>
                  <Input
                    type="number"
                    value={formData.years_of_experience}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        years_of_experience: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    项目数量
                  </label>
                  <Input
                    type="number"
                    value={formData.project_count}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        project_count: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    成功率 (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.success_rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        success_rate: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>社交媒体链接</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  个人网站
                </label>
                <Input
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  GitHub
                </label>
                <Input
                  value={formData.github_url}
                  onChange={(e) =>
                    setFormData({ ...formData, github_url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  LinkedIn
                </label>
                <Input
                  value={formData.linkedin_url}
                  onChange={(e) =>
                    setFormData({ ...formData, linkedin_url: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Twitter
                </label>
                <Input
                  value={formData.twitter_url}
                  onChange={(e) =>
                    setFormData({ ...formData, twitter_url: e.target.value })
                  }
                />
              </div>
              <Button
                type="submit"
                className="bg-[#3370ff] hover:bg-[#2958cc]"
                disabled={isSaving}
              >
                {isSaving ? '保存中...' : '保存更改'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

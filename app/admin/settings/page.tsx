'use client'

import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { fetcher, put } from '@/lib/admin/fetcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { SiteSettingsData } from '@/types/admin'

function SettingsContent() {
  const { data: settings, isLoading } = useSWR<SiteSettingsData>('/settings', fetcher)
  const [formData, setFormData] = useState({
    site_title: '',
    site_description: '',
    copyright: '',
    favicon: '',
    icp_number: '',
    ga_id: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  React.useEffect(() => {
    if (settings) {
      setFormData({
        site_title: settings.site_title,
        site_description: settings.site_description,
        copyright: settings.copyright,
        favicon: settings.favicon,
        icp_number: settings.icp_number,
        ga_id: settings.ga_id,
      })
    }
  }, [settings])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await put('/settings', formData)
      toast.success('系统设置更新成功')
      mutate('/settings')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="系统设置">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">加载中...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="系统设置">
      <div className="space-y-6">
        <p className="text-slate-500">管理网站的基本设置</p>

        <Card>
          <CardHeader>
            <CardTitle>网站基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  网站标题
                </label>
                <Input
                  value={formData.site_title}
                  onChange={(e) =>
                    setFormData({ ...formData, site_title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  网站描述
                </label>
                <Textarea
                  value={formData.site_description}
                  onChange={(e) =>
                    setFormData({ ...formData, site_description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  版权信息
                </label>
                <Input
                  value={formData.copyright}
                  onChange={(e) =>
                    setFormData({ ...formData, copyright: e.target.value })
                  }
                />
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>其他设置</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Favicon URL
                </label>
                <Input
                  value={formData.favicon}
                  onChange={(e) =>
                    setFormData({ ...formData, favicon: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  ICP 备案号
                </label>
                <Input
                  value={formData.icp_number}
                  onChange={(e) =>
                    setFormData({ ...formData, icp_number: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Google Analytics ID
                </label>
                <Input
                  value={formData.ga_id}
                  onChange={(e) =>
                    setFormData({ ...formData, ga_id: e.target.value })
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

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}

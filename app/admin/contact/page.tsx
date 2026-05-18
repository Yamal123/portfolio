'use client'

import { useState } from 'react'
import useSWR, { mutate } from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { fetcher, put } from '@/lib/admin/fetcher'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import type { ContactInfo } from '@/types/admin'

function ContactContent() {
  const { data: contact, isLoading } = useSWR<ContactInfo>('/contact', fetcher)
  const [formData, setFormData] = useState({
    email: '',
    email_displayed: true,
    phone: '',
    phone_displayed: true,
    wechat_id: '',
    wechat_displayed: true,
    wechat_qrcode: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
  })
  const [isSaving, setIsSaving] = useState(false)

  React.useEffect(() => {
    if (contact) {
      setFormData({
        email: contact.email,
        email_displayed: contact.email_displayed,
        phone: contact.phone,
        phone_displayed: contact.phone_displayed,
        wechat_id: contact.wechat_id,
        wechat_displayed: contact.wechat_displayed,
        wechat_qrcode: contact.wechat_qrcode || '',
        github_url: contact.github_url || '',
        linkedin_url: contact.linkedin_url || '',
        twitter_url: contact.twitter_url || '',
      })
    }
  }, [contact])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      await put('/contact', formData)
      toast.success('联系方式更新成功')
      mutate('/contact')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '更新失败')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout title="联系方式">
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">加载中...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="联系方式">
      <div className="space-y-6">
        <p className="text-slate-500">管理您的联系方式和社交信息</p>

        <Card>
          <CardHeader>
            <CardTitle>联系方式</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      邮箱
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">显示</span>
                    <Switch
                      checked={formData.email_displayed}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, email_displayed: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      电话
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">显示</span>
                    <Switch
                      checked={formData.phone_displayed}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, phone_displayed: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      微信号
                    </label>
                    <Input
                      value={formData.wechat_id}
                      onChange={(e) =>
                        setFormData({ ...formData, wechat_id: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">显示</span>
                    <Switch
                      checked={formData.wechat_displayed}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, wechat_displayed: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  微信二维码 URL
                </label>
                <Input
                  value={formData.wechat_qrcode}
                  onChange={(e) =>
                    setFormData({ ...formData, wechat_qrcode: e.target.value })
                  }
                />
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

export default function ContactPage() {
  return (
    <ProtectedRoute>
      <ContactContent />
    </ProtectedRoute>
  )
}

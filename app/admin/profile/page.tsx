'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetcher, put } from '@/lib/admin/fetcher'
import type { ProfileInput } from '@/lib/content/contracts'
import { defaultProfileInput } from '@/lib/content/defaults'

function ProfileContent() {
  const { data, mutate, isLoading } = useSWR<ProfileInput>('/api/management/profile', fetcher)
  const [profile, setProfile] = useState<ProfileInput | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setProfile(data || defaultProfileInput)
  }, [data])

  const hasChanges = useMemo(() => {
    if (!data || !profile) return false
    return JSON.stringify(data) !== JSON.stringify(profile)
  }, [data, profile])

  if (isLoading || !profile) {
    return (
      <AdminLayout title="个人信息">
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </AdminLayout>
    )
  }

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await put('/api/management/profile', profile)
      await mutate()
      toast.success('个人信息已保存并立即生效')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout title="个人信息">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
          <span className={hasChanges ? 'text-amber-700' : 'text-emerald-700'}>
            {hasChanges ? '有未保存更改' : '已与数据库同步'}
          </span>
          <Button onClick={save} disabled={saving || !hasChanges} className="bg-orange-500 hover:bg-orange-600">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            保存
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="昵称">
                <Input value={profile.nickname} onChange={(event) => setProfile({ ...profile, nickname: event.target.value })} />
              </Field>
              <Field label="头像 URL">
                <Input value={profile.avatar} onChange={(event) => setProfile({ ...profile, avatar: event.target.value })} />
              </Field>
              <Field label="中文职位">
                <Input value={profile.titleZh} onChange={(event) => setProfile({ ...profile, titleZh: event.target.value })} />
              </Field>
              <Field label="中文简介">
                <textarea
                  className="h-36 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                  value={profile.bioZh}
                  onChange={(event) => setProfile({ ...profile, bioZh: event.target.value })}
                />
              </Field>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>公开联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['email', 'phone', 'wechatId', 'wechatQrcode', 'github', 'linkedin', 'zhihu'] as const).map((key) => (
                <Field key={key} label={key}>
                  <Input
                    value={profile.contact[key]}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        contact: {
                          ...profile.contact,
                          [key]: event.target.value,
                        },
                      })
                    }
                  />
                </Field>
              ))}

              <div className="flex flex-wrap gap-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                {([
                  ['emailDisplayed', '公开邮箱'],
                  ['phoneDisplayed', '公开电话'],
                  ['wechatDisplayed', '公开微信'],
                ] as const).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-slate-700">
                    <input
                      type="checkbox"
                      checked={profile.contact[key]}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          contact: {
                            ...profile.contact,
                            [key]: event.target.checked,
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm text-slate-600">
      <span>{label}</span>
      {children}
    </label>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

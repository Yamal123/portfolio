'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import { ChevronDown, Loader2, Save, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { fetcher, put } from '@/lib/admin/fetcher'
import type { ProfileInput } from '@/lib/content/contracts'
import { defaultProfileInput } from '@/lib/content/defaults'
import { cn } from '@/lib/utils'

function ProfileContent() {
  const { data, mutate, isLoading } = useSWR<ProfileInput>('/api/management/profile', fetcher)
  const [profile, setProfile] = useState<ProfileInput | null>(null)
  const [saving, setSaving] = useState(false)
  const [basicOpen, setBasicOpen] = useState(true)
  const [contactOpen, setContactOpen] = useState(true)
  const wechatUploadRef = useRef<HTMLInputElement | null>(null)

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

  const uploadWechatQrcode = async (file: File | null) => {
    if (!profile || !file) return
    if (!file.type.startsWith('image/')) {
      toast.error('请上传图片格式的二维码')
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setProfile({
      ...profile,
      contact: {
        ...profile.contact,
        wechatQrcode: dataUrl,
      },
    })
    toast.success('二维码已载入，保存后前台可见')
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

        <div className="space-y-4">
          <SectionCard
            title="基本信息"
            description="维护昵称、头像、中文职位和中文简介"
            open={basicOpen}
            onOpenChange={setBasicOpen}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="昵称">
                <Input value={profile.nickname} onChange={(event) => setProfile({ ...profile, nickname: event.target.value })} />
              </Field>
              <Field label="头像 URL">
                <Input value={profile.avatar} onChange={(event) => setProfile({ ...profile, avatar: event.target.value })} />
              </Field>
              <Field label="中文职位">
                <Input value={profile.titleZh} onChange={(event) => setProfile({ ...profile, titleZh: event.target.value })} />
              </Field>
              <div className="md:col-span-2">
                <Field label="中文简介">
                  <Textarea
                    className="min-h-36 rounded-xl border-slate-200 bg-white p-3 text-sm shadow-sm transition focus-visible:border-orange-300 focus-visible:ring-2 focus-visible:ring-orange-100"
                    value={profile.bioZh}
                    onChange={(event) => setProfile({ ...profile, bioZh: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="联系方式"
            description="公开邮箱、微信和社交链接，前台仅展示非空内容"
            open={contactOpen}
            onOpenChange={setContactOpen}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="邮箱">
                <Input
                  value={profile.contact.email}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        email: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="电话">
                <Input
                  value={profile.contact.phone}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        phone: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="微信 ID">
                <Input
                  value={profile.contact.wechatId}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        wechatId: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="微信二维码">
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={profile.contact.wechatQrcode}
                      onChange={(event) =>
                        setProfile({
                          ...profile,
                          contact: {
                            ...profile.contact,
                            wechatQrcode: event.target.value,
                          },
                        })
                      }
                      placeholder="可填写图片链接，也可直接上传本地二维码"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-slate-300 text-slate-700 hover:bg-slate-50"
                      onClick={() => wechatUploadRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      上传二维码
                    </Button>
                    <input
                      ref={wechatUploadRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (event) => {
                        const file = event.target.files?.[0] || null
                        event.target.value = ''
                        await uploadWechatQrcode(file)
                      }}
                    />
                  </div>
                  {profile.contact.wechatQrcode ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <img
                        src={profile.contact.wechatQrcode}
                        alt="微信二维码预览"
                        className="h-20 w-20 rounded-xl border border-slate-200 bg-white object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">二维码预览</p>
                        <p className="mt-1 break-all text-xs text-slate-500">
                          保存后前台会优先展示二维码，没有图片时显示微信 ID。
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Field>
              <Field label="GitHub">
                <Input
                  value={profile.contact.github}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        github: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="LinkedIn">
                <Input
                  value={profile.contact.linkedin}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        linkedin: event.target.value,
                      },
                    })
                  }
                />
              </Field>
              <Field label="知乎">
                <Input
                  value={profile.contact.zhihu}
                  onChange={(event) =>
                    setProfile({
                      ...profile,
                      contact: {
                        ...profile.contact,
                        zhihu: event.target.value,
                      },
                    })
                  }
                />
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              {([
                ['emailDisplayed', '展示邮箱'],
                ['phoneDisplayed', '展示电话'],
                ['wechatDisplayed', '展示微信'],
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
          </SectionCard>
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

function SectionCard({
  title,
  description,
  open,
  onOpenChange,
  children,
}: {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}) {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-slate-50/80"
          >
            <div className="space-y-1">
              <CardTitle className="text-lg text-slate-950">{title}</CardTitle>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
            <ChevronDown className={cn('h-5 w-5 shrink-0 text-slate-400 transition-transform', open ? 'rotate-180' : '')} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4 px-5 py-5">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error || new Error('读取图片失败'))
    reader.readAsDataURL(file)
  })
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { fetcher, put } from '@/lib/admin/fetcher'
import type { ProfileInput } from '@/lib/content/contracts'
import { defaultProfileInput } from '@/lib/content/defaults'

function ProfileContent() {
  const { data, mutate, isLoading } = useSWR<ProfileInput>('/api/management/profile', fetcher)
  const [profile, setProfile] = useState<ProfileInput | null>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => { setProfile(data || defaultProfileInput) }, [data])
  const hasChanges = useMemo(() => {
    if (!data || !profile) return false
    return JSON.stringify(data) !== JSON.stringify(profile)
  }, [data, profile])
  if (isLoading || !profile) return <AdminLayout title="个人信息"><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div></AdminLayout>

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try { await put('/api/management/profile', profile); await mutate(); toast.success('个人信息已保存并立即生效') }
    catch (error) { toast.error(error instanceof Error ? error.message : '保存失败') }
    finally { setSaving(false) }
  }
  return (
    <AdminLayout title="个人信息管理">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
        <span className={hasChanges ? 'text-amber-700' : 'text-emerald-700'}>{hasChanges ? '有未保存更改' : '已与数据库同步'}</span>
        <Button onClick={save} disabled={saving || !hasChanges} className="bg-orange-500 hover:bg-orange-600">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}保存</Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>基本信息</CardTitle></CardHeader><CardContent className="space-y-3">
          <Field label="昵称"><Input value={profile.nickname} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} /></Field>
          <Field label="头像 URL"><Input value={profile.avatar} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })} /></Field>
          <div className="grid gap-3 sm:grid-cols-2"><Field label="中文职位"><Input value={profile.titleZh} onChange={(e) => setProfile({ ...profile, titleZh: e.target.value })} /></Field><Field label="English Title"><Input value={profile.titleEn} onChange={(e) => setProfile({ ...profile, titleEn: e.target.value })} /></Field></div>
          <Field label="中文简介"><textarea className="h-24 w-full rounded-md border p-3 text-sm" value={profile.bioZh} onChange={(e) => setProfile({ ...profile, bioZh: e.target.value })} /></Field>
          <Field label="English Bio"><textarea className="h-24 w-full rounded-md border p-3 text-sm" value={profile.bioEn} onChange={(e) => setProfile({ ...profile, bioEn: e.target.value })} /></Field>
          <div className="grid grid-cols-3 gap-3">
            {([['年经验', 'yearsOfExperience'], ['解决率', 'successRate'], ['效率提升', 'efficiencyGain']] as const).map(([label, key]) => <Field key={key} label={label}><Input type="number" value={profile[key]} onChange={(e) => setProfile({ ...profile, [key]: Number(e.target.value) })} /></Field>)}
          </div>
        </CardContent></Card>
        <Card><CardHeader><CardTitle>公开联系方式</CardTitle></CardHeader><CardContent className="space-y-3">
          {(['email', 'phone', 'wechatId', 'wechatQrcode', 'github', 'linkedin', 'zhihu'] as const).map((key) => <Field key={key} label={key}><Input value={profile.contact[key]} onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, [key]: e.target.value } })} /></Field>)}
          <div className="flex flex-wrap gap-4 pt-2">
            {([['emailDisplayed', '公开邮箱'], ['phoneDisplayed', '公开电话'], ['wechatDisplayed', '公开微信']] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={profile.contact[key]} onChange={(e) => setProfile({ ...profile, contact: { ...profile.contact, [key]: e.target.checked } })} />{label}</label>
            ))}
          </div>
        </CardContent></Card>
      </div>
    </AdminLayout>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1 text-sm text-slate-600"><span>{label}</span>{children}</label> }
export default function ProfilePage() { return <ProtectedRoute><ProfileContent /></ProtectedRoute> }

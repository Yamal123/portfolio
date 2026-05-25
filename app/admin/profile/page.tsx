'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Save, Plus, Trash2, Loader2 } from 'lucide-react'

function ProfileContent() {
  const { data, mutate, isLoading } = useSWR('/profile', async (url) => {
    const res = await fetch('/api/management/profile')
    const j = await res.json()
    return j.data || j
  })

  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (data) setProfile(data) }, [data])

  const save = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await fetch('/api/management/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      mutate()
      toast.success('个人信息已保存')
    } catch {
      toast.error('保存失败')
    }
    setSaving(false)
  }

  const updateContact = (key: string, value: string) => {
    setProfile((p: any) => ({ ...p, contact: { ...p.contact, [key]: value } }))
  }

  const updateSkill = (idx: number, field: string, value: any) => {
    setProfile((p: any) => {
      const skills = [...p.skills]
      skills[idx] = { ...skills[idx], [field]: value }
      return { ...p, skills }
    })
  }

  const addSkill = () => setProfile((p: any) => ({ ...p, skills: [...p.skills, { nameZh: '', nameEn: '', level: 50, category: 'ai' }] }))
  const removeSkill = (idx: number) => setProfile((p: any) => ({ ...p, skills: p.skills.filter((_: any, i: number) => i !== idx) }))

  const updateExp = (idx: number, field: string, value: string) => {
    setProfile((p: any) => {
      const exps = [...p.experiences]
      exps[idx] = { ...exps[idx], [field]: value }
      return { ...p, experiences: exps }
    })
  }

  const addExp = () => setProfile((p: any) => ({ ...p, experiences: [...p.experiences, { companyZh: '', companyEn: '', roleZh: '', roleEn: '', period: '', locationZh: '', locationEn: '', descriptionZh: '', descriptionEn: '' }] }))
  const removeExp = (idx: number) => setProfile((p: any) => ({ ...p, experiences: p.experiences.filter((_: any, i: number) => i !== idx) }))

  if (isLoading || !profile) return <AdminLayout title="个人信息"><div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div></AdminLayout>

  return (
    <AdminLayout title="个人信息管理">
      <div className="flex justify-end mb-4">
        <Button onClick={save} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <Save className="w-4 h-4 mr-1"/>}保存全部
        </Button>
      </div>

      <Tabs defaultValue="base" className="space-y-4">
        <TabsList>
          <TabsTrigger value="base">基本信息</TabsTrigger>
          <TabsTrigger value="contact">联系方式</TabsTrigger>
          <TabsTrigger value="skills">技能管理</TabsTrigger>
          <TabsTrigger value="experience">工作经历</TabsTrigger>
        </TabsList>

        <TabsContent value="base">
          <Card><CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {['nickname','titleZh','titleEn','avatar'].map(k => (
                <div key={k}><label className="text-sm text-slate-600 mb-1 block">{k}</label>
                  <Input value={profile[k] || ''} onChange={e => setProfile({...profile, [k]: e.target.value})}/>
                </div>
              ))}
              {['bioZh','bioEn'].map(k => (
                <div key={k}><label className="text-sm text-slate-600 mb-1 block">{k}</label>
                  <textarea className="w-full p-3 border rounded-lg text-sm h-24" value={profile[k] || ''} onChange={e => setProfile({...profile, [k]: e.target.value})}/>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-sm text-slate-600 mb-1 block">工作年限</label><Input type="number" value={profile.yearsOfExperience||0} onChange={e => setProfile({...profile, yearsOfExperience: Number(e.target.value)})}/></div>
                <div><label className="text-sm text-slate-600 mb-1 block">成功率(%)</label><Input type="number" value={profile.successRate||0} onChange={e => setProfile({...profile, successRate: Number(e.target.value)})}/></div>
                <div><label className="text-sm text-slate-600 mb-1 block">效率提升(%)</label><Input type="number" value={profile.efficiencyGain||0} onChange={e => setProfile({...profile, efficiencyGain: Number(e.target.value)})}/></div>
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card><CardHeader><CardTitle>联系方式</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {['email','phone','wechatId','linkedin','github','zhihu'].map(k => (
                <div key={k}><label className="text-sm text-slate-600 mb-1 block">{k}</label>
                  <Input value={profile.contact?.[k] || ''} onChange={e => updateContact(k, e.target.value)}/>
                </div>
              ))}
              <div className="flex gap-4">
                {['emailDisplayed','phoneDisplayed','wechatDisplayed'].map(k => (
                  <label key={k} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={profile.contact?.[k] || false} onChange={e => updateContact(k, String(e.target.checked))} />
                    {k}
                  </label>
                ))}
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>技能列表</CardTitle><Button size="sm" variant="outline" onClick={addSkill}><Plus className="w-4 h-4 mr-1"/>添加</Button></CardHeader>
            <CardContent><div className="space-y-2">
              {(profile.skills||[]).map((s: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <Input className="flex-1" value={s.nameZh} placeholder="中文名" onChange={e => updateSkill(i, 'nameZh', e.target.value)}/>
                  <Input className="flex-1" value={s.nameEn} placeholder="English" onChange={e => updateSkill(i, 'nameEn', e.target.value)}/>
                  <Input className="w-20" type="number" value={s.level} min={0} max={100} onChange={e => updateSkill(i, 'level', Number(e.target.value))}/>
                  <select className="border rounded p-2 text-sm" value={s.category} onChange={e => updateSkill(i, 'category', e.target.value)}>
                    <option value="ai">AI</option><option value="product">产品</option><option value="technical">技术</option><option value="soft">软技能</option>
                  </select>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeSkill(i)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              ))}
            </div></CardContent></Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>工作经历</CardTitle><Button size="sm" variant="outline" onClick={addExp}><Plus className="w-4 h-4 mr-1"/>添加</Button></CardHeader>
            <CardContent><div className="space-y-4">
              {(profile.experiences||[]).map((exp: any, i: number) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={exp.companyZh} placeholder="公司(中)" onChange={e => updateExp(i, 'companyZh', e.target.value)}/>
                    <Input value={exp.companyEn} placeholder="Company(EN)" onChange={e => updateExp(i, 'companyEn', e.target.value)}/>
                    <Input value={exp.roleZh} placeholder="职位(中)" onChange={e => updateExp(i, 'roleZh', e.target.value)}/>
                    <Input value={exp.roleEn} placeholder="Role(EN)" onChange={e => updateExp(i, 'roleEn', e.target.value)}/>
                    <Input value={exp.period} placeholder="时段" onChange={e => updateExp(i, 'period', e.target.value)}/>
                    <Input value={exp.locationZh} placeholder="地点" onChange={e => updateExp(i, 'locationZh', e.target.value)}/>
                  </div>
                  <Input value={exp.descriptionZh} placeholder="描述(中)" onChange={e => updateExp(i, 'descriptionZh', e.target.value)}/>
                  <Input value={exp.descriptionEn} placeholder="Description(EN)" onChange={e => updateExp(i, 'descriptionEn', e.target.value)}/>
                  <div className="flex justify-end"><Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeExp(i)}><Trash2 className="w-4 h-4 mr-1"/>删除</Button></div>
                </div>
              ))}
            </div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default function ProfilePage() { return <ProtectedRoute><ProfileContent /></ProtectedRoute> }

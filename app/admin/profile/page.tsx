'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'

function ProfileContent() {
  const [profile, setProfile] = useState({ nickname: 'Yu Meng', titleZh: 'AI产品经理', titleEn: 'AI Product Manager', bioZh: '热爱产品设计与技术探索', bioEn: 'Passionate about product design.', yearsOfExperience: 2, successRate: 88 })
  const [contact, setContact] = useState({ email: 'yumeng@aipmym.com', phone: '', wechatId: '', linkedin: '', github: 'https://github.com/Yamal123', zhihu: '' })
  const [skills, setSkills] = useState([{ id: 1, nameZh: 'AI Agent 设计', nameEn: 'AI Agent Design', level: 95, category: 'ai' as const }, { id: 2, nameZh: '需求分析', nameEn: 'Requirements Analysis', level: 95, category: 'product' as const }])
  const [experiences, setExperiences] = useState([{ id: 1, companyZh: '极兔速递', companyEn: 'J&T Express', roleZh: 'AI客服产品经理', roleEn: 'AI CS PM', period: '2023 - Present', locationZh: '上海', locationEn: 'Shanghai', descZh: 'Dify AI Agent，88%解决率', descEn: 'Dify AI Agent, 88% resolution' }])

  return (
    <AdminLayout title="个人信息管理">
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">基本信息</TabsTrigger>
          <TabsTrigger value="contact">联系方式</TabsTrigger>
          <TabsTrigger value="skills">技能管理</TabsTrigger>
          <TabsTrigger value="experience">工作经历</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardHeader><CardTitle>基本信息</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[{l:'昵称',k:'nickname'},{l:'中文头衔',k:'titleZh'},{l:'英文头衔',k:'titleEn'}].map(f=>(<div key={f.k}><label className="text-sm text-slate-600 mb-1 block">{f.l}</label><Input value={(profile as any)[f.k]} onChange={e=>setProfile({...profile,[f.k]:e.target.value})}/></div>))}
              {[{l:'中文简介',k:'bioZh'},{l:'英文简介',k:'bioEn'}].map(f=>(<div key={f.k}><label className="text-sm text-slate-600 mb-1 block">{f.l}</label><textarea className="w-full p-3 border rounded-lg text-sm h-20" value={(profile as any)[f.k]} onChange={e=>setProfile({...profile,[f.k]:e.target.value})}/></div>))}
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-slate-600 mb-1 block">工作年限</label><Input type="number" value={profile.yearsOfExperience} onChange={e=>setProfile({...profile,yearsOfExperience:Number(e.target.value)})}/></div>
                <div><label className="text-sm text-slate-600 mb-1 block">成功率 (%)</label><Input type="number" value={profile.successRate} onChange={e=>setProfile({...profile,successRate:Number(e.target.value)})}/></div>
              </div>
              <Button className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-1"/>保存</Button>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card><CardHeader><CardTitle>联系方式</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(contact).map(([k,v])=>(<div key={k}><label className="text-sm text-slate-600 mb-1 block capitalize">{k}</label><Input value={v} onChange={e=>setContact({...contact,[k]:e.target.value})}/></div>))}
              <Button className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-1"/>保存</Button>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="skills">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>技能管理</CardTitle><Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/>添加</Button></CardHeader>
            <CardContent><div className="space-y-2">{skills.map(s=>(<div key={s.id} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"><GripVertical className="w-4 h-4 text-slate-300"/><Input className="flex-1" value={s.nameZh} placeholder="中文名"/><Input className="flex-1" value={s.nameEn} placeholder="English"/><Input className="w-20" type="number" value={s.level}/><Button variant="ghost" size="sm" className="text-red-400"><Trash2 className="w-4 h-4"/></Button></div>))}</div></CardContent></Card>
        </TabsContent>

        <TabsContent value="experience">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>工作经历</CardTitle><Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-1"/>添加</Button></CardHeader>
            <CardContent><div className="space-y-3">{experiences.map(exp=>(<div key={exp.id} className="p-3 bg-slate-50 rounded-lg"><div className="grid grid-cols-2 gap-2 mb-2"><Input value={exp.companyZh} placeholder="公司（中文）"/><Input value={exp.companyEn} placeholder="Company"/><Input value={exp.roleZh} placeholder="职位"/><Input value={exp.roleEn} placeholder="Role"/></div><div className="flex gap-2 justify-end"><Button variant="ghost" size="sm" className="text-red-400"><Trash2 className="w-4 h-4 mr-1"/>删除</Button></div></div>))}</div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default function ProfilePage() { return <ProtectedRoute><ProfileContent /></ProtectedRoute> }

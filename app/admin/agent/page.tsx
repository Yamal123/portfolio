'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Settings, Wrench, Activity, CheckCircle, AlertTriangle } from 'lucide-react'

function AgentContent() {
  const tools = [
    { name: 'search_projects', desc: '搜索项目作品', category: 'query', enabled: true },
    { name: 'search_articles', desc: '检索方法论文章', category: 'query', enabled: true },
    { name: 'list_skills', desc: '查询技能专长', category: 'query', enabled: true },
    { name: 'get_contact', desc: '获取联系方式', category: 'query', enabled: true },
    { name: 'get_site_info', desc: '站点导航与信息', category: 'system', enabled: true },
  ]

  return (
    <AdminLayout title="Agent 管理">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5"/>配置信息</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: '运行模式', value: 'auto（有 API Key 时用 LLM，否则规则模式）' },
              { label: '默认模型', value: 'gpt-4o-mini' },
              { label: '最大工具轮次', value: '3' },
              { label: '站点名称', value: 'PM 思钱想厚' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-500">{item.label}</span>
                <span className="text-sm font-medium text-slate-700">{item.value}</span>
              </div>
            ))}
            <div className="pt-2 text-xs text-slate-400">
              配置通过环境变量 <code>OPENAI_API_KEY</code>, <code>AGENT_MODE</code> 等设置，修改后需重新部署生效。
            </div>
          </CardContent>
        </Card>

        {/* Tools */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5"/>工具列表</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tools.map(t => (
                <div key={t.name} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{t.name}</span>
                      <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5"/>运行状态</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'LLM 模式', status: 'ok', desc: '需配置 OPENAI_API_KEY' },
                { label: '规则模式', status: 'ok', desc: '无需 API Key，离线可用' },
                { label: '工具调用', status: 'ok', desc: '5 个工具全部就绪' },
                { label: '对话历史', status: 'ok', desc: '最多保留 10 轮' },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  {s.status === 'ok' ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/> : <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0"/>}
                  <div>
                    <p className="text-sm font-medium text-slate-700">{s.label}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function AgentPage() { return <ProtectedRoute><AgentContent /></ProtectedRoute> }

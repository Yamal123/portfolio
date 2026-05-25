'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Bot, Settings, Wrench, MessageSquare, Brain, Save, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react'

function AgentContent() {
  const [config, setConfig] = useState({
    mode: 'auto', model: 'gpt-4o-mini', baseUrl: 'https://api.openai.com/v1',
    maxToolRounds: 3, apiKey: '', siteName: 'PM 思钱想厚',
  })

  const [tools, setTools] = useState([
    { name: 'search_projects', desc: '搜索项目作品', category: 'query', enabled: true },
    { name: 'search_articles', desc: '检索方法论文章', category: 'query', enabled: true },
    { name: 'list_skills', desc: '查询技能专长', category: 'query', enabled: true },
    { name: 'get_contact', desc: '获取联系方式', category: 'query', enabled: true },
    { name: 'get_site_info', desc: '站点导航信息', category: 'system', enabled: true },
  ])

  const [memoryConfig, setMemoryConfig] = useState({
    maxHistoryRounds: 10,
    persistHistory: true,
    enableLongTermMemory: false,
    sessionTimeout: 30, // minutes
  })

  // Simulated conversation history
  const conversations = [
    { id: 1, user: '你能做什么？', bot: '我可以帮你查询项目、搜索文章、查看技能...', time: '2026-05-25 14:30', rounds: 3 },
    { id: 2, user: '极兔的项目是什么？', bot: '极兔AI客服体系是一个Multi-Agent协作系统...', time: '2026-05-25 10:15', rounds: 5 },
  ]

  const saveConfig = () => toast.success('Agent 配置已保存（需重新部署生效）')
  const addTool = () => setTools([...tools, { name: '', desc: '', category: 'query', enabled: true }])
  const removeTool = (idx: number) => setTools(tools.filter((_, i) => i !== idx))
  const toggleTool = (idx: number) => setTools(tools.map((t, i) => i === idx ? { ...t, enabled: !t.enabled } : t))

  return (
    <AdminLayout title="Agent 管理">
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config"><Settings className="w-4 h-4 mr-1"/>配置</TabsTrigger>
          <TabsTrigger value="tools"><Wrench className="w-4 h-4 mr-1"/>工具</TabsTrigger>
          <TabsTrigger value="history"><MessageSquare className="w-4 h-4 mr-1"/>对话历史</TabsTrigger>
          <TabsTrigger value="memory"><Brain className="w-4 h-4 mr-1"/>记忆设置</TabsTrigger>
        </TabsList>

        {/* Config */}
        <TabsContent value="config">
          <Card><CardHeader><CardTitle>Agent 配置</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-slate-600 mb-1 block">运行模式</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.mode} onChange={e => setConfig({...config, mode: e.target.value})}>
                    <option value="auto">auto（自动判断）</option><option value="llm">llm（强制LLM）</option><option value="rules">rules（规则模式）</option>
                  </select></div>
                <div><label className="text-sm text-slate-600 mb-1 block">模型</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.model} onChange={e => setConfig({...config, model: e.target.value})}>
                    <option value="gpt-4o-mini">gpt-4o-mini</option><option value="gpt-4o">gpt-4o</option><option value="claude-3-haiku">claude-3-haiku</option><option value="deepseek-chat">deepseek-chat</option>
                  </select></div>
              </div>
              <div><label className="text-sm text-slate-600 mb-1 block">API Key</label><Input type="password" value={config.apiKey} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="sk-..."/></div>
              <div><label className="text-sm text-slate-600 mb-1 block">API Base URL</label><Input value={config.baseUrl} onChange={e => setConfig({...config, baseUrl: e.target.value})}/></div>
              <div><label className="text-sm text-slate-600 mb-1 block">最大工具轮次</label><Input type="number" value={config.maxToolRounds} onChange={e => setConfig({...config, maxToolRounds: Number(e.target.value)})}/></div>
              <div><label className="text-sm text-slate-600 mb-1 block">System Prompt</label>
                <textarea className="w-full p-3 border rounded-lg text-sm h-32 font-mono" defaultValue={
                  `你是 PM 思钱想厚的 AI 助手。你可以：
- 搜索项目作品（search_projects）
- 检索方法论文章（search_articles）
- 查询技能专长（list_skills）
- 获取联系方式（get_contact）
- 提供站点导航（get_site_info）
用友好、专业的语气回复。`
                }/>
              </div>
              <Button onClick={saveConfig} className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-1"/>保存配置</Button>
            </CardContent></Card>
        </TabsContent>

        {/* Tools */}
        <TabsContent value="tools">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>工具管理</CardTitle><Button size="sm" variant="outline" onClick={addTool}><Plus className="w-4 h-4 mr-1"/>添加工具</Button></CardHeader>
            <CardContent><div className="space-y-2">
              {tools.map((t, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <input type="checkbox" checked={t.enabled} onChange={() => toggleTool(i)} className="w-4 h-4"/>
                  <Input className="flex-1" value={t.name} placeholder="工具名称" onChange={e => { const n = [...tools]; n[i] = {...n[i], name: e.target.value}; setTools(n) }}/>
                  <Input className="flex-2" value={t.desc} placeholder="描述" onChange={e => { const n = [...tools]; n[i] = {...n[i], desc: e.target.value}; setTools(n) }}/>
                  <select className="border rounded p-2 text-xs" value={t.category} onChange={e => { const n = [...tools]; n[i] = {...n[i], category: e.target.value}; setTools(n) }}>
                    <option value="query">查询</option><option value="action">操作</option><option value="system">系统</option>
                  </select>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeTool(i)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              ))}
            </div></CardContent></Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card><CardHeader><CardTitle>对话历史</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.map(c => (
                  <div key={c.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-slate-400">{c.time}</span>
                      <Badge variant="outline" className="text-xs">{c.rounds} 轮</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-600">👤 {c.user}</p>
                      <p className="text-slate-600">🤖 {c.bot}</p>
                    </div>
                  </div>
                ))}
                {conversations.length === 0 && <p className="text-center text-slate-400 py-8">暂无对话记录</p>}
              </div>
            </CardContent></Card>
        </TabsContent>

        {/* Memory */}
        <TabsContent value="memory">
          <Card><CardHeader><CardTitle>记忆与保存设置</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">最大历史轮数</label>
                  <Input type="number" value={memoryConfig.maxHistoryRounds} onChange={e => setMemoryConfig({...memoryConfig, maxHistoryRounds: Number(e.target.value)})}/>
                  <p className="text-xs text-slate-400 mt-1">超出后自动截断最早的对话</p>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">会话超时（分钟）</label>
                  <Input type="number" value={memoryConfig.sessionTimeout} onChange={e => setMemoryConfig({...memoryConfig, sessionTimeout: Number(e.target.value)})}/>
                  <p className="text-xs text-slate-400 mt-1">超时后清除对话上下文</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.persistHistory} onChange={e => setMemoryConfig({...memoryConfig, persistHistory: e.target.checked})}/>
                  持久化对话历史（localStorage）
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.enableLongTermMemory} onChange={e => setMemoryConfig({...memoryConfig, enableLongTermMemory: e.target.checked})}/>
                  启用长期记忆（跨会话保留用户偏好）
                </label>
              </div>
              <Button onClick={() => toast.success('记忆设置已保存')} className="bg-orange-500 hover:bg-orange-600"><Save className="w-4 h-4 mr-1"/>保存设置</Button>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default function AgentPage() { return <ProtectedRoute><AgentContent /></ProtectedRoute> }

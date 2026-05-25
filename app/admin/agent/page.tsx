'use client'

import { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Settings, Wrench, MessageSquare, Brain, Save, Plus, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import useSWR from 'swr'

function AgentContent() {
  // Load config from API
  const { data: remoteConfig, mutate } = useSWR('/management/agent/config', async () => {
    const res = await fetch('/api/management/agent/config')
    if (!res.ok) return null
    const j = await res.json()
    return j.data
  })

  const [config, setConfig] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [tools, setTools] = useState<any[]>([])
  const [memoryConfig, setMemoryConfig] = useState({
    maxHistoryRounds: 10, persistHistory: true, enableLongTermMemory: false, sessionTimeout: 30,
  })
  const [conversations, setConversations] = useState<any[]>([])

  // Load from remote config
  useEffect(() => {
    if (remoteConfig) {
      setConfig({
        mode: remoteConfig.mode || 'auto',
        model: remoteConfig.model || 'gpt-4o-mini',
        baseUrl: remoteConfig.baseUrl || 'https://api.openai.com/v1',
        maxToolRounds: remoteConfig.maxToolRounds || 3,
        systemPrompt: remoteConfig.systemPrompt || '',
        welcomeMessage: remoteConfig.welcomeMessage || { zh: '', en: '' },
        quickQuestions: remoteConfig.quickQuestions || [],
      })
      setTools(remoteConfig.tools || [
        { name: 'search_projects', desc: '搜索项目作品', category: 'query', enabled: true },
        { name: 'search_articles', desc: '检索方法论文章', category: 'query', enabled: true },
        { name: 'list_skills', desc: '查询技能专长', category: 'query', enabled: true },
        { name: 'get_contact', desc: '获取联系方式', category: 'query', enabled: true },
        { name: 'get_site_info', desc: '站点导航信息', category: 'system', enabled: true },
      ])
    }
  }, [remoteConfig])

  // Load conversations from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('chat_history')
      if (raw) {
        const msgs = JSON.parse(raw)
        // Group by rough session (every 6 messages = 1 session)
        const sessions: any[] = []
        for (let i = 0; i < msgs.length; i += 6) {
          const group = msgs.slice(i, i + 6)
          if (group.length > 0) {
            sessions.push({
              id: i,
              time: group[0]?.timestamp ? new Date(group[0].timestamp).toLocaleString('zh-CN') : '-',
              rounds: Math.floor(group.length / 2),
              preview: group[0]?.content?.slice(0, 60) || '-',
            })
          }
        }
        setConversations(sessions)
      }
    } catch {}
  }, [])

  const saveConfig = async () => {
    if (!config) return
    setSaving(true)
    try {
      await fetch('/api/management/agent/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...config, tools }),
      })
      mutate()
      toast.success('Agent 配置已保存，重启生效')
    } catch {
      toast.error('保存失败')
    }
    setSaving(false)
  }

  const addTool = () => setTools([...tools, { name: '', desc: '', category: 'query', enabled: true }])
  const removeTool = (idx: number) => setTools(tools.filter((_: any, i: number) => i !== idx))
  const toggleTool = (idx: number) => setTools(tools.map((t: any, i: number) => i === idx ? { ...t, enabled: !t.enabled } : t))
  const updateTool = (idx: number, field: string, value: any) => {
    setTools(tools.map((t: any, i: number) => i === idx ? { ...t, [field]: value } : t))
  }

  if (!config) return <AdminLayout title="Agent"><div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div></AdminLayout>

  return (
    <AdminLayout title="Agent 管理">
      <div className="flex justify-end mb-4">
        <Button onClick={saveConfig} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <Save className="w-4 h-4 mr-1"/>}保存全部配置
        </Button>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config"><Settings className="w-4 h-4 mr-1"/>配置</TabsTrigger>
          <TabsTrigger value="tools"><Wrench className="w-4 h-4 mr-1"/>工具</TabsTrigger>
          <TabsTrigger value="history"><MessageSquare className="w-4 h-4 mr-1"/>对话历史</TabsTrigger>
          <TabsTrigger value="memory"><Brain className="w-4 h-4 mr-1"/>记忆设置</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card><CardHeader><CardTitle>Agent 运行配置</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">运行模式</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.mode} onChange={e => setConfig({...config, mode: e.target.value})}>
                    <option value="auto">auto（自动判断 LLM/Rules）</option>
                    <option value="llm">llm（强制 LLM 模式）</option>
                    <option value="rules">rules（规则模式，免费）</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-slate-600 mb-1 block">默认模型</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.model} onChange={e => setConfig({...config, model: e.target.value})}>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                    <option value="deepseek-chat">deepseek-chat</option>
                    <option value="claude-3-haiku">claude-3-haiku</option>
                  </select>
                </div>
              </div>
              <div><label className="text-sm text-slate-600 mb-1 block">API Base URL</label><Input value={config.baseUrl} onChange={e => setConfig({...config, baseUrl: e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-sm text-slate-600 mb-1 block">最大工具轮次（1-10）</label><Input type="number" min={1} max={10} value={config.maxToolRounds} onChange={e => setConfig({...config, maxToolRounds: Number(e.target.value)})}/></div>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">System Prompt（同 Prompt 模板）</label>
                <textarea className="w-full p-3 border rounded-lg text-sm h-40 font-mono" value={config.systemPrompt} onChange={e => setConfig({...config, systemPrompt: e.target.value})}/>
              </div>
              <div>
                <label className="text-sm text-slate-600 mb-1 block">欢迎消息（中文）</label>
                <textarea className="w-full p-3 border rounded-lg text-sm h-20" value={config.welcomeMessage?.zh} onChange={e => setConfig({...config, welcomeMessage: {...config.welcomeMessage, zh: e.target.value}})}/>
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="tools">
          <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>工具管理</CardTitle><Button size="sm" variant="outline" onClick={addTool}><Plus className="w-4 h-4 mr-1"/>添加工具</Button></CardHeader>
            <CardContent><div className="space-y-2">
              {tools.map((t: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg flex-wrap">
                  <input type="checkbox" checked={t.enabled} onChange={() => toggleTool(i)} className="w-4 h-4"/>
                  <Input className="flex-1 min-w-[120px]" value={t.name} placeholder="名称" onChange={e => updateTool(i, 'name', e.target.value)}/>
                  <Input className="flex-[2] min-w-[160px]" value={t.desc} placeholder="描述" onChange={e => updateTool(i, 'desc', e.target.value)}/>
                  <select className="border rounded p-2 text-xs" value={t.category} onChange={e => updateTool(i, 'category', e.target.value)}>
                    <option value="query">查询</option><option value="action">操作</option><option value="system">系统</option>
                  </select>
                  <Button variant="ghost" size="sm" className="text-red-400" onClick={() => removeTool(i)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              ))}
            </div></CardContent></Card>
        </TabsContent>

        <TabsContent value="history">
          <Card><CardHeader><CardTitle>对话历史（localStorage）</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((c: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{c.preview}</p>
                      <p className="text-xs text-slate-400">{c.time} · {c.rounds} 轮</p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">{c.rounds} 轮</Badge>
                  </div>
                ))}
                {conversations.length === 0 && <p className="text-center text-slate-400 py-8">暂无对话记录</p>}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-600">
                对话历史保存在浏览器 localStorage，清除浏览器数据会丢失。如需云端存储，可接入 Vercel KV。
              </div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="memory">
          <Card><CardHeader><CardTitle>记忆与持久化设置</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-600 mb-1 block">最大历史轮数</label><Input type="number" value={memoryConfig.maxHistoryRounds} onChange={e => setMemoryConfig({...memoryConfig, maxHistoryRounds: Number(e.target.value)})}/><p className="text-xs text-slate-400 mt-1">超出自动截断</p></div>
                <div><label className="text-sm text-slate-600 mb-1 block">会话超时（分钟）</label><Input type="number" value={memoryConfig.sessionTimeout} onChange={e => setMemoryConfig({...memoryConfig, sessionTimeout: Number(e.target.value)})}/><p className="text-xs text-slate-400 mt-1">超时清除上下文</p></div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.persistHistory} onChange={e => setMemoryConfig({...memoryConfig, persistHistory: e.target.checked})} className="w-4 h-4"/>
                  持久化对话历史（localStorage，保留最近 20 条消息）
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.enableLongTermMemory} onChange={e => setMemoryConfig({...memoryConfig, enableLongTermMemory: e.target.checked})} className="w-4 h-4"/>
                  启用长期记忆（跨会话记住用户偏好）
                </label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { localStorage.removeItem('chat_history'); toast.success('已清除全部对话历史') }} variant="outline" size="sm">清除对话历史</Button>
                <Button onClick={() => toast.success('记忆设置已保存')} className="bg-orange-500 hover:bg-orange-600" size="sm"><Save className="w-4 h-4 mr-1"/>保存设置</Button>
              </div>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default function AgentPage() { return <ProtectedRoute><AgentContent /></ProtectedRoute> }

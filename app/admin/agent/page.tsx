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
import { Settings, Wrench, MessageSquare, Brain, Save, Plus, Trash2, Loader2 } from 'lucide-react'
import useSWR from 'swr'

// Provider presets
const PROVIDERS = {
  deepseek: { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', models: ['deepseek-chat', 'deepseek-reasoner'] },
  openai: { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-3.5-turbo'] },
  custom: { name: '自定义', baseUrl: '', models: [] },
}

function AgentContent() {
  const { data: remoteConfig, mutate } = useSWR('/management/agent/config', async () => {
    const res = await fetch('/api/management/agent/config')
    if (!res.ok) return null
    const j = await res.json()
    return j.data
  })

  const [config, setConfig] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [provider, setProvider] = useState('deepseek')
  const [tools, setTools] = useState<any[]>([])
  const [memoryConfig, setMemoryConfig] = useState({ maxHistoryRounds: 10, persistHistory: true, enableLongTermMemory: false, sessionTimeout: 30 })
  const [conversations, setConversations] = useState<any[]>([])

  // Load from remote
  useEffect(() => {
    if (remoteConfig) {
      const prov = remoteConfig.provider || detectProvider(remoteConfig.baseUrl)
      setProvider(prov)
      setConfig({
        mode: remoteConfig.mode || 'auto',
        provider: prov,
        model: remoteConfig.model || 'deepseek-chat',
        baseUrl: remoteConfig.baseUrl || 'https://api.deepseek.com/v1',
        maxToolRounds: remoteConfig.maxToolRounds || 3,
        systemPrompt: remoteConfig.systemPrompt || '',
        welcomeMessage: remoteConfig.welcomeMessage || { zh: '', en: '' },
        quickQuestions: remoteConfig.quickQuestions || [],
      })
      setTools(remoteConfig.tools || [])
    }
  }, [remoteConfig])

  // Load conversations
  useEffect(() => {
    try {
      const sessions: any[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('agent_session_')) {
          const raw = localStorage.getItem(key)
          if (raw) {
            const msgs = JSON.parse(raw)
            const firstUser = msgs.find((m: any) => m.type === 'user')
            sessions.push({
              id: key.replace('agent_session_', ''),
              time: firstUser?.timestamp ? new Date(firstUser.timestamp).toLocaleString('zh-CN') : '-',
              rounds: Math.floor(msgs.length / 2),
              preview: firstUser?.content?.slice(0, 60) || '(空)',
              msgCount: msgs.length,
            })
          }
        }
      }
      sessions.sort((a: any, b: any) => Number(b.id) - Number(a.id))
      setConversations(sessions)
    } catch {}
  }, [])

  function detectProvider(url: string) {
    if (url?.includes('deepseek')) return 'deepseek'
    if (url?.includes('openai')) return 'openai'
    return 'custom'
  }

  const handleProviderChange = (prov: string) => {
    setProvider(prov)
    const preset = PROVIDERS[prov as keyof typeof PROVIDERS]
    setConfig({
      ...config,
      provider: prov,
      baseUrl: preset.baseUrl,
      model: preset.models[0] || config.model,
    })
  }

  const availableModels = provider === 'custom'
    ? (config.model ? [config.model] : ['custom-model'])
    : PROVIDERS[provider as keyof typeof PROVIDERS]?.models || []

  const saveConfig = async () => {
    if (!config) return
    setSaving(true)
    try {
      const saveData = { ...config, provider, apiKey: apiKey || undefined }
      await fetch('/api/management/agent/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      })
      mutate()
      toast.success('Agent 配置已保存')
    } catch {
      toast.error('保存失败')
    }
    setSaving(false)
  }

  if (!config) return <AdminLayout title="Agent"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-slate-300"/></div></AdminLayout>

  return (
    <AdminLayout title="Agent 管理">
      <div className="flex justify-end mb-4">
        <Button onClick={saveConfig} disabled={saving} className="bg-orange-500 hover:bg-orange-600">
          {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin"/> : <Save className="w-4 h-4 mr-1"/>}保存全部配置
        </Button>
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList>
          <TabsTrigger value="config"><Settings className="w-4 h-4 mr-1"/>模型配置</TabsTrigger>
          <TabsTrigger value="tools"><Wrench className="w-4 h-4 mr-1"/>工具管理</TabsTrigger>
          <TabsTrigger value="history"><MessageSquare className="w-4 h-4 mr-1"/>对话历史</TabsTrigger>
          <TabsTrigger value="memory"><Brain className="w-4 h-4 mr-1"/>记忆设置</TabsTrigger>
        </TabsList>

        {/* ===== Model Config ===== */}
        <TabsContent value="config">
          <Card><CardHeader><CardTitle>模型配置</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">模型提供商</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={provider}
                    onChange={e => handleProviderChange(e.target.value)}>
                    {Object.entries(PROVIDERS).map(([k, v]) => (
                      <option key={k} value={k}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">运行模式</label>
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.mode}
                    onChange={e => setConfig({...config, mode: e.target.value})}>
                    <option value="auto">auto（自动判断）</option>
                    <option value="llm">llm（强制LLM）</option>
                    <option value="rules">rules（规则/免费）</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">API Key</label>
                <div className="flex gap-2">
                  <Input type={showKey ? 'text' : 'password'} value={apiKey} placeholder="sk-..."
                    onChange={e => setApiKey(e.target.value)}
                    className="flex-1 font-mono text-sm"/>
                  <Button variant="outline" size="sm" onClick={() => setShowKey(!showKey)}>
                    {showKey ? '隐藏' : '显示'}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-1">仅当前会话有效，不会存储到文件。配置 OPENAI_API_KEY 环境变量可持久化。</p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">API 接口地址</label>
                <Input value={config.baseUrl} onChange={e => setConfig({...config, baseUrl: e.target.value})} className="font-mono text-sm"/>
                {provider !== 'custom' && (
                  <p className="text-xs text-slate-400 mt-1">切换提供商时自动填充，也可手动修改</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">模型</label>
                {provider === 'custom' ? (
                  <Input value={config.model} onChange={e => setConfig({...config, model: e.target.value})} placeholder="输入模型名称"/>
                ) : (
                  <select className="w-full border rounded-lg p-2.5 text-sm" value={config.model}
                    onChange={e => setConfig({...config, model: e.target.value})}>
                    {availableModels.map((m: string) => <option key={m} value={m}>{m}</option>)}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">最大工具轮次</label>
                  <Input type="number" min={1} max={10} value={config.maxToolRounds}
                    onChange={e => setConfig({...config, maxToolRounds: Number(e.target.value)})}/>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">System Prompt</label>
                <textarea className="w-full p-3 border rounded-lg text-sm h-36 font-mono" value={config.systemPrompt}
                  onChange={e => setConfig({...config, systemPrompt: e.target.value})}/>
              </div>
            </CardContent></Card>
        </TabsContent>

        {/* ===== Tools ===== */}
        <TabsContent value="tools">
          <Card><CardHeader className="flex items-center justify-between flex-row"><CardTitle>工具管理</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setTools([...tools, { name: '', desc: '', category: 'query', enabled: true }])}>
              <Plus className="w-4 h-4 mr-1"/>添加</Button>
          </CardHeader>
            <CardContent><div className="space-y-2">
              {tools.map((t: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg flex-wrap">
                  <input type="checkbox" checked={t.enabled} onChange={() => {
                    const n = [...tools]; n[i] = {...n[i], enabled: !n[i].enabled}; setTools(n)
                  }} className="w-4 h-4"/>
                  <Input className="flex-1 min-w-[100px]" value={t.name} placeholder="名称"
                    onChange={e => { const n=[...tools]; n[i]={...n[i],name:e.target.value}; setTools(n) }}/>
                  <Input className="flex-[2] min-w-[140px]" value={t.desc} placeholder="描述"
                    onChange={e => { const n=[...tools]; n[i]={...n[i],desc:e.target.value}; setTools(n) }}/>
                  <select className="border rounded p-2 text-xs" value={t.category}
                    onChange={e => { const n=[...tools]; n[i]={...n[i],category:e.target.value}; setTools(n) }}>
                    <option value="query">查询</option><option value="action">操作</option><option value="system">系统</option>
                  </select>
                  <Button variant="ghost" size="sm" className="text-red-400"
                    onClick={() => setTools(tools.filter((_:any, j:number) => j!==i))}>
                    <Trash2 className="w-4 h-4"/></Button>
                </div>
              ))}
            </div></CardContent></Card>
        </TabsContent>

        {/* ===== History ===== */}
        <TabsContent value="history">
          <Card><CardHeader><CardTitle>对话历史</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversations.map((c: any, i: number) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 truncate">{c.preview}</p>
                      <p className="text-xs text-slate-400">{c.time} · {c.msgCount}条 · {c.rounds}轮</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{c.rounds}轮</Badge>
                  </div>
                ))}
                {conversations.length === 0 && <p className="text-center text-slate-400 py-8">暂无对话记录</p>}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-600">
                对话保存在浏览器 localStorage。清除浏览器缓存会丢失历史记录。
              </div>
            </CardContent></Card>
        </TabsContent>

        {/* ===== Memory ===== */}
        <TabsContent value="memory">
          <Card><CardHeader><CardTitle>记忆与持久化</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm text-slate-600 mb-1 block">最大历史轮数</label>
                  <Input type="number" value={memoryConfig.maxHistoryRounds}
                    onChange={e => setMemoryConfig({...memoryConfig, maxHistoryRounds: Number(e.target.value)})}/>
                  <p className="text-xs text-slate-400 mt-1">超出自动截断</p></div>
                <div><label className="text-sm text-slate-600 mb-1 block">会话超时(分钟)</label>
                  <Input type="number" value={memoryConfig.sessionTimeout}
                    onChange={e => setMemoryConfig({...memoryConfig, sessionTimeout: Number(e.target.value)})}/>
                  <p className="text-xs text-slate-400 mt-1">超时清除上下文</p></div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.persistHistory} className="w-4 h-4"
                    onChange={e => setMemoryConfig({...memoryConfig, persistHistory: e.target.checked})}/>
                  持久化对话历史（localStorage）
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={memoryConfig.enableLongTermMemory} className="w-4 h-4"
                    onChange={e => setMemoryConfig({...memoryConfig, enableLongTermMemory: e.target.checked})}/>
                  启用长期记忆（跨会话偏好）
                </label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  for (let i = localStorage.length-1; i>=0; i--) {
                    const k = localStorage.key(i); if (k?.startsWith('agent_session_')) localStorage.removeItem(k)
                  }
                  setConversations([]); toast.success('已清除全部历史')
                }}>清除对话历史</Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600" onClick={() => toast.success('已保存')}>
                  <Save className="w-4 h-4 mr-1"/>保存</Button>
              </div>
            </CardContent></Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}

export default function AgentPage() { return <ProtectedRoute><AgentContent /></ProtectedRoute> }

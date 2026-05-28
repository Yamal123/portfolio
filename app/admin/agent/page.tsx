'use client'

import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { Settings, Save, Loader2, Activity } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { fetcher, put } from '@/lib/admin/fetcher'
import type { AgentConfigInput } from '@/lib/content/contracts'

type ManagedConfig = AgentConfigInput & { actualMode?: 'rules' | 'llm'; apiKeyConfigured?: boolean }
const providers = {
  deepseek: { name: 'DeepSeek', url: 'https://api.deepseek.com/v1', models: ['deepseek-chat', 'deepseek-reasoner'] },
  openai: { name: 'OpenAI', url: 'https://api.openai.com/v1', models: ['gpt-4o-mini', 'gpt-4o'] },
  custom: { name: '自定义', url: '', models: [] as string[] },
}

function AgentContent() {
  const { data, mutate, isLoading, error } = useSWR<ManagedConfig>('/api/management/agent/config', fetcher)
  const [config, setConfig] = useState<ManagedConfig | null>(null)
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (data) setConfig(data) }, [data])
  const hasChanges = useMemo(() => {
    if (!data || !config) return false
    const next = {
      mode: config.mode, provider: config.provider, model: config.model, baseUrl: config.baseUrl,
      maxToolRounds: config.maxToolRounds, systemPrompt: config.systemPrompt,
      welcomeMessage: config.welcomeMessage, quickQuestions: config.quickQuestions,
    }
    const base = {
      mode: data.mode, provider: data.provider, model: data.model, baseUrl: data.baseUrl,
      maxToolRounds: data.maxToolRounds, systemPrompt: data.systemPrompt,
      welcomeMessage: data.welcomeMessage, quickQuestions: data.quickQuestions,
    }
    return JSON.stringify(next) !== JSON.stringify(base)
  }, [config, data])

  const save = async () => {
    if (!config) return
    setSaving(true)
    try {
      await put('/api/management/agent/config', {
        mode: config.mode, provider: config.provider, model: config.model, baseUrl: config.baseUrl,
        maxToolRounds: config.maxToolRounds, systemPrompt: config.systemPrompt,
        welcomeMessage: config.welcomeMessage, quickQuestions: config.quickQuestions,
      })
      await mutate()
      toast.success('Agent 配置已保存并立即生效')
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : '保存失败')
    } finally { setSaving(false) }
  }

  if (isLoading || !config) {
    return <AdminLayout title="Agent 管理"><div className="flex justify-center py-20">{error ? <p className="text-red-500">配置加载失败</p> : <Loader2 className="h-8 w-8 animate-spin text-slate-300" />}</div></AdminLayout>
  }

  const preset = providers[config.provider as keyof typeof providers] || providers.custom
  return (
    <AdminLayout title="Agent 管理">
      <div className="mb-4 flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
        <span className={hasChanges ? 'text-amber-700' : 'text-emerald-700'}>{hasChanges ? '有未保存更改' : '配置已同步'}</span>
        <Button onClick={save} disabled={saving || !hasChanges} className="bg-orange-500 hover:bg-orange-600">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}保存配置
        </Button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Settings className="h-5 w-5" />模型与回复配置</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="模型提供商">
                <select className="h-10 w-full rounded-md border px-3 text-sm" value={config.provider} onChange={(event) => {
                  const provider = event.target.value as keyof typeof providers
                  const next = providers[provider]
                  setConfig({ ...config, provider, baseUrl: next.url || config.baseUrl, model: next.models[0] || config.model })
                }}>
                  {Object.entries(providers).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
                </select>
              </Field>
              <Field label="运行模式">
                <select className="h-10 w-full rounded-md border px-3 text-sm" value={config.mode} onChange={(event) => setConfig({ ...config, mode: event.target.value as AgentConfigInput['mode'] })}>
                  <option value="auto">auto（有密钥时启用 LLM）</option>
                  <option value="llm">llm（优先 LLM）</option>
                  <option value="rules">rules（规则模式）</option>
                </select>
              </Field>
            </div>
            <Field label="API 接口地址"><Input value={config.baseUrl} onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} className="font-mono" /></Field>
            <Field label="模型">
              {config.provider === 'custom' ? <Input value={config.model} onChange={(event) => setConfig({ ...config, model: event.target.value })} /> : (
                <select className="h-10 w-full rounded-md border px-3 text-sm" value={config.model} onChange={(event) => setConfig({ ...config, model: event.target.value })}>
                  {preset.models.map((model) => <option key={model} value={model}>{model}</option>)}
                </select>
              )}
            </Field>
            <Field label="最大工具轮次"><Input type="number" min={1} max={10} value={config.maxToolRounds} onChange={(event) => setConfig({ ...config, maxToolRounds: Number(event.target.value) })} /></Field>
            <Field label="System Prompt"><textarea className="h-40 w-full rounded-md border p-3 text-sm" value={config.systemPrompt} onChange={(event) => setConfig({ ...config, systemPrompt: event.target.value })} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="中文欢迎语"><textarea className="h-32 w-full rounded-md border p-3 text-sm" value={config.welcomeMessage.zh} onChange={(event) => setConfig({ ...config, welcomeMessage: { ...config.welcomeMessage, zh: event.target.value } })} /></Field>
              <Field label="English Welcome"><textarea className="h-32 w-full rounded-md border p-3 text-sm" value={config.welcomeMessage.en} onChange={(event) => setConfig({ ...config, welcomeMessage: { ...config.welcomeMessage, en: event.target.value } })} /></Field>
            </div>
            <Field label="快捷问题">
              <div className="space-y-2">
                {config.quickQuestions.map((question, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-2">
                    <Input value={question.zh} onChange={(event) => {
                      const questions = [...config.quickQuestions]; questions[index] = { ...question, zh: event.target.value }; setConfig({ ...config, quickQuestions: questions })
                    }} />
                    <Input value={question.en} onChange={(event) => {
                      const questions = [...config.quickQuestions]; questions[index] = { ...question, en: event.target.value }; setConfig({ ...config, quickQuestions: questions })
                    }} />
                  </div>
                ))}
              </div>
            </Field>
          </CardContent>
        </Card>
        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Activity className="h-5 w-5" />运行状态</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between"><span className="text-slate-500">实际模式</span><Badge>{config.actualMode || 'rules'}</Badge></div>
            <div className="flex items-center justify-between"><span className="text-slate-500">API Key</span><Badge variant={config.apiKeyConfigured ? 'default' : 'outline'}>{config.apiKeyConfigured ? '已通过环境变量配置' : '未配置'}</Badge></div>
            <p className="rounded-md bg-slate-50 p-3 text-xs text-slate-500">API Key 仅通过服务器环境变量管理，不会保存到内容数据库。</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5 text-sm font-medium text-slate-700"><span>{label}</span>{children}</label>
}

export default function AgentPage() { return <ProtectedRoute><AgentContent /></ProtectedRoute> }

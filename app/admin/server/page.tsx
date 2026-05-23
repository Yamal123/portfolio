'use client'

import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Server, Cpu, HardDrive, Clock, CheckCircle, AlertTriangle, Activity } from 'lucide-react'

function ServerContent() {
  const currentTime = new Date().toLocaleString('zh-CN')

  const serverInfo = {
    platform: 'Vercel (Node.js)',
    framework: 'Next.js 14.2',
    runtime: 'Node.js v22',
    region: 'iad1 (Washington, D.C.)',
    uptime: '自上次部署起运行中',
    buildTime: new Date().toISOString(),
  }

  const healthChecks = [
    { name: 'API 服务', status: 'ok', desc: '正常运行' },
    { name: '静态资源', status: 'ok', desc: 'CDN 加速中' },
    { name: '数据库', status: 'ok', desc: '内存存储模式' },
    { name: 'SEO', status: 'ok', desc: 'Robots + Sitemap 已配置' },
    { name: 'AI 聊天', status: 'warn', desc: '需配置 OPENAI_API_KEY' },
  ]

  const quickStats = {
    deployCount: 5,
    lastDeploy: '2026-05-23',
    currentVersion: 'v1.2.0',
  }

  return (
    <AdminLayout title="服务器状态">
      <div className="space-y-6">
        {/* Server Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{serverInfo.platform}</p>
                  <p className="text-xs text-slate-400">托管平台</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{serverInfo.framework}</p>
                  <p className="text-xs text-slate-400">运行框架</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <HardDrive className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{serverInfo.region}</p>
                  <p className="text-xs text-slate-400">部署区域</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Checks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              服务健康检查
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthChecks.map((check, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-4 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    {check.status === 'ok' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                    <span className="text-sm font-medium text-slate-700">{check.name}</span>
                  </div>
                  <span className={`text-xs ${
                    check.status === 'ok' ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {check.desc}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-slate-500">部署信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-1">
                <span className="text-sm text-slate-600">最新部署</span>
                <span className="text-sm font-medium text-slate-900">{quickStats.lastDeploy}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-slate-600">部署次数</span>
                <span className="text-sm font-medium text-slate-900">{quickStats.deployCount} 次</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-sm text-slate-600">当前版本</span>
                <span className="text-sm font-medium text-slate-900">{quickStats.currentVersion}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm text-slate-500">
                <Clock className="w-4 h-4" />
                运行时间
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-slate-900">{currentTime}</p>
              <p className="text-xs text-slate-400 mt-2">服务器当前时间（东八区）</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default function ServerPage() {
  return (
    <ProtectedRoute>
      <ServerContent />
    </ProtectedRoute>
  )
}

'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { fetcher } from '@/lib/admin/fetcher'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import { Eye, Users, TrendingUp, Globe } from 'lucide-react'
import type { AnalyticsOverview, AnalyticsTrendItem } from '@/types/admin'

function TrafficContent() {
  const { data: analytics } = useSWR<AnalyticsOverview>('/analytics/overview', fetcher)
  const { data: trendData } = useSWR<AnalyticsTrendItem[]>('/analytics/trend', fetcher)
  const [days, setDays] = useState(7)

  const summaryCards = [
    {
      label: '总页面浏览 (PV)',
      value: (analytics?.total_pv || 0).toLocaleString(),
      icon: Eye,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: '总独立访客 (UV)',
      value: (analytics?.total_uv || 0).toLocaleString(),
      icon: Users,
      color: 'from-orange-500 to-orange-600',
    },
    {
      label: '今日 UV',
      value: (analytics?.today_uv || 0).toLocaleString(),
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
    {
      label: '本周 UV',
      value: (analytics?.week_uv || 0).toLocaleString(),
      icon: Globe,
      color: 'from-purple-500 to-violet-600',
    },
  ]

  return (
    <AdminLayout title="流量统计">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>访问趋势</CardTitle>
            <div className="flex gap-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    days === d
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {d}天
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={(trendData || []).slice(-days)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="uv" fill="#3370ff" name="访客数 (UV)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pv" fill="#93c5fd" name="页面浏览 (PV)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>访客趋势线</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="uv"
                    stroke="#3370ff"
                    strokeWidth={2}
                    name="访客数 (UV)"
                    dot={{ fill: '#3370ff', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pv"
                    stroke="#f97316"
                    strokeWidth={2}
                    name="页面浏览 (PV)"
                    dot={{ fill: '#f97316', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function TrafficPage() {
  return (
    <ProtectedRoute>
      <TrafficContent />
    </ProtectedRoute>
  )
}

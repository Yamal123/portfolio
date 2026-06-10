'use client'

import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CalendarRange, FileText, RefreshCcw, Sparkles, TrendingUp, Users } from 'lucide-react'
import { toast } from 'sonner'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { fetcher } from '@/lib/admin/fetcher'

type OverviewData = {
  total_pv: number
  total_uv: number
  total_articles: number
  start: string
  end: string
}

type TrendPoint = { date: string; uv: number; pv: number }
type PageItem = { pagePath: string; title: string; href: string; pv: number; uv: number }
type TopicItem = { keyword: string; count: number }

const MAX_RANGE_DAYS = 31

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftDays(date: Date, offset: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + offset)
  return next
}

function getDefaultRange() {
  const end = new Date()
  const start = shiftDays(end, -6)
  return {
    start: formatDateInput(start),
    end: formatDateInput(end),
  }
}

function normalizeRange(start: string, end: string) {
  if (!start || !end) return null
  let startDate = new Date(`${start}T00:00:00`)
  let endDate = new Date(`${end}T00:00:00`)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null
  if (startDate > endDate) {
    const temp = startDate
    startDate = endDate
    endDate = temp
  }
  const diffDays = Math.floor((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1
  if (diffDays > MAX_RANGE_DAYS) {
    const limitedEnd = shiftDays(startDate, MAX_RANGE_DAYS - 1)
    return {
      start: formatDateInput(startDate),
      end: formatDateInput(limitedEnd),
      limited: true,
    }
  }
  return {
    start: formatDateInput(startDate),
    end: formatDateInput(endDate),
    limited: false,
  }
}

function metricCard({ icon: Icon, label, value, hint }: { icon: ComponentType<{ className?: string }>; label: string; value: string | number; hint?: string }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{Number(value).toLocaleString('zh-CN')}</div>
          {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
        </div>
        <div className="rounded-2xl bg-orange-50 p-3 text-orange-600">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

function AnalyticsContent() {
  const initialRange = useMemo(() => getDefaultRange(), [])
  const [draftStart, setDraftStart] = useState(initialRange.start)
  const [draftEnd, setDraftEnd] = useState(initialRange.end)
  const [range, setRange] = useState(initialRange)

  const overviewUrl = `/api/analytics/overview?start=${range.start}&end=${range.end}`
  const trendUrl = `/api/analytics/trend?start=${range.start}&end=${range.end}`
  const pagesUrl = `/api/analytics/pages?start=${range.start}&end=${range.end}&limit=10`
  const topicsUrl = `/api/analytics/topics?start=${range.start}&end=${range.end}&limit=10`

  const { data: overview } = useSWR<OverviewData>(overviewUrl, fetcher)
  const { data: trend = [] } = useSWR<TrendPoint[]>(trendUrl, fetcher)
  const { data: pages = [] } = useSWR<PageItem[]>(pagesUrl, fetcher)
  const { data: topics = [] } = useSWR<TopicItem[]>(topicsUrl, fetcher)

  const applyRange = () => {
    const next = normalizeRange(draftStart, draftEnd)
    if (!next) {
      toast.error('请选择正确的时间范围')
      return
    }
    if (next.limited) {
      toast.warning('时间范围最多支持 31 天，已自动截断')
      setDraftEnd(next.end)
    }
    setRange({ start: next.start, end: next.end })
  }

  const resetRange = () => {
    const next = getDefaultRange()
    setDraftStart(next.start)
    setDraftEnd(next.end)
    setRange(next)
  }

  return (
    <AdminLayout title="运营数据">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[540px]">
              <label className="space-y-1 text-sm text-slate-600">
                <span>开始日期</span>
                <Input type="date" value={draftStart} onChange={(event) => setDraftStart(event.target.value)} />
              </label>
              <label className="space-y-1 text-sm text-slate-600">
                <span>结束日期</span>
                <Input type="date" value={draftEnd} onChange={(event) => setDraftEnd(event.target.value)} />
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2 border-slate-200" onClick={resetRange}>
                <RefreshCcw className="h-4 w-4" />
                重置近 7 天
              </Button>
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600" onClick={applyRange}>
                <CalendarRange className="h-4 w-4" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {metricCard({ icon: TrendingUp, label: 'PV数量', value: overview?.total_pv ?? 0, hint: `${range.start} 至 ${range.end}` })}
          {metricCard({ icon: Users, label: 'UV数量', value: overview?.total_uv ?? 0, hint: '去重访客数' })}
          {metricCard({ icon: FileText, label: '总文章数量', value: overview?.total_articles ?? 0, hint: '当前后台文章总数' })}
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>PV / UV 趋势</CardTitle>
            </CardHeader>
            <CardContent className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" name="PV" stroke="#f97316" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="uv" name="UV" stroke="#0f172a" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>热门话题</CardTitle>
              <p className="text-sm text-slate-500">来源：前台 AI 助手会话关键词</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {topics.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">当前时间范围内还没有可统计的话题。</div>
              ) : (
                topics.map((item) => (
                  <div key={item.keyword} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                        <Sparkles className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-slate-900">{item.keyword}</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>热门页面</CardTitle>
              <p className="text-sm text-slate-500">点击标题可跳转到对应前台页面</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">页面标题</th>
                      <th className="px-4 py-3 text-right font-medium">PV</th>
                      <th className="px-4 py-3 text-right font-medium">UV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {pages.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                          当前时间范围内没有页面访问数据。
                        </td>
                      </tr>
                    ) : (
                      pages.map((item) => (
                        <tr key={item.pagePath} className="hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <Link href={item.href || '#'} className="font-medium text-slate-900 hover:text-orange-600">
                              {item.title}
                            </Link>
                            <div className="mt-1 text-xs text-slate-500">{item.pagePath}</div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">{item.pv.toLocaleString('zh-CN')}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-900">{item.uv.toLocaleString('zh-CN')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>范围说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                当前统计区间：<span className="font-medium text-slate-900">{range.start}</span> 至 <span className="font-medium text-slate-900">{range.end}</span>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                热门页面的数据来自前台页面访问记录，热门话题来自前台 AI 助手对话关键词。
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                默认统计近 7 天，最大跨度为 31 天。
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}

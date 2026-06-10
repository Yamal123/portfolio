'use client'

import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { ChevronLeft, ChevronRight, Search, MessageSquareText } from 'lucide-react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { fetcher } from '@/lib/admin/fetcher'

type SessionMessage = { role: string; content: string }
type SessionItem = {
  id: number
  session_id: string
  locale: string
  message_count: number
  first_message: string
  last_message: string
  snippet: string
  keywords: string[]
  messages: SessionMessage[]
  created_at: string
  updated_at: string
}

type SessionResponse = {
  list: SessionItem[]
  total: number
  page: number
  pageSize: number
  totalPage: number
}

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

function SessionContent() {
  const initialRange = useMemo(() => getDefaultRange(), [])
  const [draftStart, setDraftStart] = useState(initialRange.start)
  const [draftEnd, setDraftEnd] = useState(initialRange.end)
  const [keyword, setKeyword] = useState('')
  const [query, setQuery] = useState({ start: initialRange.start, end: initialRange.end, keyword: '' })
  const [page, setPage] = useState(1)
  const [selectedSession, setSelectedSession] = useState<SessionItem | null>(null)

  const url = `/api/analytics/sessions?start=${query.start}&end=${query.end}&q=${encodeURIComponent(query.keyword)}&page=${page}&pageSize=12`
  const { data } = useSWR<SessionResponse>(url, fetcher)

  const applyFilters = () => {
    const next = normalizeRange(draftStart, draftEnd)
    if (!next) return
    if (next.limited) {
      setDraftEnd(next.end)
    }
    setPage(1)
    setQuery({ start: next.start, end: next.end, keyword: keyword.trim() })
  }

  const resetFilters = () => {
    const next = getDefaultRange()
    setDraftStart(next.start)
    setDraftEnd(next.end)
    setKeyword('')
    setPage(1)
    setQuery({ start: next.start, end: next.end, keyword: '' })
  }

  return (
    <AdminLayout title="会话明细">
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto bg-slate-50 p-4">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle>来自前台 AI 助手的对话记录</CardTitle>
            <p className="text-sm text-slate-500">
              可以按时间范围和对话内容筛选，并查看每个会话的完整消息。
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 xl:grid-cols-[1fr_1fr_1.2fr_auto] xl:items-end">
            <label className="space-y-1 text-sm text-slate-600">
              <span>开始日期</span>
              <Input type="date" value={draftStart} onChange={(event) => setDraftStart(event.target.value)} />
            </label>
            <label className="space-y-1 text-sm text-slate-600">
              <span>结束日期</span>
              <Input type="date" value={draftEnd} onChange={(event) => setDraftEnd(event.target.value)} />
            </label>
            <label className="space-y-1 text-sm text-slate-600">
              <span>对话内容</span>
              <Input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="按关键词、问题或回复内容筛选"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2 border-slate-200" onClick={resetFilters}>
                重置
              </Button>
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600" onClick={applyFilters}>
                <Search className="h-4 w-4" />
                筛选
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">时间</th>
                    <th className="px-4 py-3 text-left font-medium">会话 ID</th>
                    <th className="px-4 py-3 text-left font-medium">消息数</th>
                    <th className="px-4 py-3 text-left font-medium">关键词</th>
                    <th className="px-4 py-3 text-left font-medium">内容摘要</th>
                    <th className="px-4 py-3 text-right font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(data?.list || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                        当前筛选条件下没有会话记录。
                      </td>
                    </tr>
                  ) : (
                    (data?.list || []).map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-700">{item.created_at}</td>
                        <td className="px-4 py-3 font-medium text-slate-900">{item.session_id}</td>
                        <td className="px-4 py-3 text-slate-700">{item.message_count}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {(item.keywords || []).slice(0, 4).map((keywordItem) => (
                              <Badge key={keywordItem} variant="secondary">
                                {keywordItem}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          <div className="max-w-[24rem] truncate">{item.snippet || item.last_message || item.first_message}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="outline" size="sm" onClick={() => setSelectedSession(item)}>
                            查看详情
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <div>
            共 {data?.total || 0} 条，当前第 {data?.page || 1} / {data?.totalPage || 1} 页
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= (data?.totalPage || 1)}
              onClick={() => setPage((value) => value + 1)}
              className="gap-1"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selectedSession)} onOpenChange={(open) => !open && setSelectedSession(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-orange-500" />
              会话详情
            </DialogTitle>
            <DialogDescription>
              {selectedSession?.session_id} · {selectedSession?.created_at}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoCard label="消息数" value={selectedSession?.message_count ?? 0} />
              <InfoCard label="语言" value={selectedSession?.locale || 'zh'} />
              <InfoCard label="更新时间" value={selectedSession?.updated_at || '-'} />
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-medium text-slate-900">关键词</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedSession?.keywords || []).length === 0 ? (
                  <span className="text-sm text-slate-500">暂无关键词</span>
                ) : (
                  selectedSession?.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary">
                      {keyword}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-900">完整对话</div>
              {(selectedSession?.messages || []).length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">暂无消息内容。</div>
              ) : (
                selectedSession?.messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === 'assistant' ? 'bg-orange-50 text-slate-800' : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {message.role === 'assistant' ? '助手' : '用户'}
                    </div>
                    {message.content}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

export default function LogsPage() {
  return (
    <ProtectedRoute>
      <SessionContent />
    </ProtectedRoute>
  )
}

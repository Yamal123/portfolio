'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bold,
  Code,
  Edit,
  Heading1,
  Heading2,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Quote,
  Save,
  SeparatorHorizontal,
  Table,
  Trash2,
  Underline,
} from 'lucide-react'
import { ArticleMarkdown } from '@/components/article-markdown'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getArticleStatusLabel } from '@/lib/admin/article-status'
import { getBulkActionCopy, getPrimaryActionLabel } from '@/lib/admin/content-workbench'
import { toast } from 'sonner'

export type ContentStatus = 'draft' | 'pending' | 'published'
export type ContentKind = 'link' | 'document'

export interface WorkbenchItem {
  slug: string
  title: string
  intro: string
  createdAt: string
  status: ContentStatus
  kind?: ContentKind
  keywords?: string[]
  markdown: string
}

interface ContentWorkbenchProps {
  items: WorkbenchItem[]
  selected: WorkbenchItem | null
  isNew: boolean
  isLoading?: boolean
  isSaving?: boolean
  isPublishing?: boolean
  supportsKind?: boolean
  supportsKeywords?: boolean
  supportsBulk?: boolean
  onNew: () => void
  onSelect: (item: WorkbenchItem) => void
  onChange: (item: WorkbenchItem) => void
  onSaveDraft: () => void
  onPublish: (item?: WorkbenchItem) => void
  onUnpublish?: (item?: WorkbenchItem) => void
  onDelete: (item: WorkbenchItem) => void
  onBulkDelete?: (items: WorkbenchItem[]) => Promise<void> | void
  onBulkPublish?: (items: WorkbenchItem[]) => Promise<void> | void
  onBulkUnpublish?: (items: WorkbenchItem[]) => Promise<void> | void
}

function inRange(date: string, start: string, end: string) {
  if (start && date < start) return false
  if (end && date > end) return false
  return true
}

function insertAtCursor(textarea: HTMLTextAreaElement | null, markdown: string, onValue: (value: string) => void) {
  if (!textarea) return
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const current = textarea.value
  const next = `${current.slice(0, start)}${markdown}${current.slice(end)}`
  onValue(next)
  window.requestAnimationFrame(() => {
    textarea.focus()
    textarea.selectionStart = start + markdown.length
    textarea.selectionEnd = start + markdown.length
  })
}

function statusLabel(status: ContentStatus) {
  return getArticleStatusLabel(status)
}

export function ContentWorkbench({
  items,
  selected,
  isNew,
  isLoading = false,
  isSaving = false,
  isPublishing = false,
  supportsKind = false,
  supportsKeywords = false,
  supportsBulk = false,
  onNew,
  onSelect,
  onChange,
  onSaveDraft,
  onPublish,
  onUnpublish,
  onDelete,
  onBulkDelete,
  onBulkPublish,
  onBulkUnpublish,
}: ContentWorkbenchProps) {
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tab, setTab] = useState<'all' | ContentStatus | ContentKind>('all')
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState<'delete' | 'publish' | 'unpublish' | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const filtered = useMemo(() => {
    return items
      .filter((item) => `${item.title} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((item) => inRange(item.createdAt || '', startDate, endDate))
      .filter((item) => {
        if (tab === 'all') return true
        if (tab === 'draft' || tab === 'pending' || tab === 'published') return item.status === tab
        return item.kind === tab
      })
      .slice(0, 10)
  }, [endDate, items, query, startDate, tab])

  const setSelectedValue = (patch: Partial<WorkbenchItem>) => {
    if (!selected) return
    onChange({ ...selected, ...patch })
  }

  const setMarkdown = (markdown: string) => setSelectedValue({ markdown })

  const selectedItems = useMemo(
    () => filtered.filter((item) => selectedSlugs.includes(item.slug)),
    [filtered, selectedSlugs]
  )
  const selectedCount = selectedItems.length
  const allSelected = filtered.length > 0 && filtered.every((item) => selectedSlugs.includes(item.slug))
  const canPublishSelected = selectedItems.length > 0 && selectedItems.every((item) => item.status !== 'published')
  const canUnpublishSelected = selectedItems.length > 0 && selectedItems.every((item) => item.status === 'published')
  const hasFilter = Boolean(query.trim() || startDate || endDate || tab !== 'all')

  useEffect(() => {
    setSelectedSlugs((current) => current.filter((slug) => filtered.some((item) => item.slug === slug)))
  }, [filtered])

  const toggleSelect = (slug: string) => {
    setSelectedSlugs((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    )
  }

  const toggleSelectAll = (checked: boolean) => {
    setSelectedSlugs(checked ? filtered.map((item) => item.slug) : [])
  }

  const openBulkAction = (type: 'delete' | 'publish' | 'unpublish') => {
    if (!selectedItems.length) return
    if (type === 'publish' && !canPublishSelected) {
      toast.error('批量发布仅支持未发布文章，请先取消已发布文章的选择。')
      return
    }
    if (type === 'unpublish' && !canUnpublishSelected) {
      toast.error('批量下架仅支持已发布文章，请先取消草稿文章的选择。')
      return
    }
    setBulkAction(type)
  }

  const handleBulk = async (type: 'delete' | 'publish' | 'unpublish') => {
    const handlers = {
      delete: onBulkDelete,
      publish: onBulkPublish,
      unpublish: onBulkUnpublish,
    }
    const handler = handlers[type]
    if (!handler) return

    await handler(selectedItems)
    setSelectedSlugs([])
    setBulkAction(null)
    setSelectionMode(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-slate-200 bg-white">
      <header className="shrink-0 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className="text-xs font-medium text-slate-500">筛选</span>
              <span className="text-xs text-slate-400">{filtered.length} / {items.length}</span>
            </div>
            <Input
              className="h-9 w-[180px]"
              placeholder="按标题或 slug 筛选"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
              <span className="text-xs font-medium text-slate-500">开始</span>
              <Input className="h-9 w-[140px] border-0 px-0 shadow-none focus-visible:ring-0" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2">
              <span className="text-xs font-medium text-slate-500">结束</span>
              <Input className="h-9 w-[140px] border-0 px-0 shadow-none focus-visible:ring-0" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
            </div>
            {hasFilter ? (
              <Button
                variant="ghost"
                className="h-9 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                onClick={() => {
                  setQuery('')
                  setStartDate('')
                  setEndDate('')
                  setTab('all')
                }}
              >
                清空筛选
              </Button>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {selected && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  selected.status === 'published'
                    ? 'bg-emerald-50 text-emerald-700'
                    : selected.status === 'pending'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-orange-50 text-orange-700'
                }`}
              >
                {statusLabel(selected.status)}
              </span>
            )}
            {selectionMode && supportsBulk ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-9 border-slate-200">
                    操作
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => openBulkAction('publish')} disabled={!selectedCount || !canPublishSelected}>
                    批量发布
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openBulkAction('unpublish')} disabled={!selectedCount || !canUnpublishSelected}>
                    批量下架
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openBulkAction('delete')} disabled={!selectedCount}>
                    批量删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
            {selected && mode === 'preview' && !selectionMode && (
              <>
                {(() => {
                  const isPrimaryLoading = selected.status === 'published' ? isSaving : isPublishing
                  return (
                    <Button
                      className="h-9 bg-orange-500 hover:bg-orange-600"
                      disabled={isPrimaryLoading}
                      onClick={() => (selected.status === 'published' ? onUnpublish?.(selected) : onPublish())}
                    >
                      {isPrimaryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {getPrimaryActionLabel(selected.status)}
                    </Button>
                  )
                })()}
              </>
            )}
            {selected && mode === 'preview' && !selectionMode && (
              <Button variant="outline" className="h-9" onClick={() => setMode('edit')}>
                <Edit className="mr-2 h-4 w-4" />
                编辑
              </Button>
            )}
            {selected && mode === 'edit' && !selectionMode && (
              <Button variant="outline" className="h-9" disabled={isSaving} onClick={onSaveDraft}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {selected.status === 'draft' ? '保存草稿' : '保存修改'}
              </Button>
            )}
            {selected && !selectionMode && (
              <Button variant="outline" className="h-9 text-red-600 hover:text-red-600" onClick={() => onDelete(selected)}>
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </Button>
            )}
            {supportsBulk && (
              <Button
                variant={selectionMode ? 'default' : 'outline'}
                className={`h-9 ${selectionMode ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                onClick={() => {
                  setSelectionMode((current) => !current)
                  setSelectedSlugs([])
                  setBulkAction(null)
                }}
              >
                {selectionMode ? '退出选择' : '选择'}
              </Button>
            )}
            <Button onClick={() => { setMode('edit'); onNew() }} className="h-9 bg-orange-500 hover:bg-orange-600">
              <Plus className="mr-1.5 h-4 w-4" />
              新增
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {[
              ['all', '全部'],
              ['draft', '草稿'],
              ['pending', '待发布'],
              ['published', '已发布'],
              ...(supportsKind ? [['link', '链接'], ['document', '文档']] : []),
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key as typeof tab)}
                className={`h-8 rounded-md border px-3 text-sm font-medium ${tab === key ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>
          {selectionMode && supportsBulk && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500">已选 {selectedCount} 项</span>
            </div>
          )}
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[390px_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto border-r border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-2">
              {selectionMode && supportsBulk && (
                <Checkbox checked={allSelected} onCheckedChange={(checked) => toggleSelectAll(Boolean(checked))} />
              )}
              <span>每页最多 10 条</span>
            </span>
            <span>{filtered.length} / {items.length}</span>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => {
                const checked = selectedSlugs.includes(item.slug)
                return (
                  <article
                    key={item.slug}
                    className={`rounded-lg border bg-white p-3 ${selected?.slug === item.slug ? 'border-orange-300 bg-orange-50/40' : 'border-slate-200'}`}
                  >
                    <div className="flex items-start gap-2">
                      {selectionMode && supportsBulk && (
                        <Checkbox checked={checked} onCheckedChange={() => toggleSelect(item.slug)} className="mt-1" />
                      )}
                      <button
                        type="button"
                        className="block flex-1 text-left"
                        onClick={() => {
                          if (selectionMode) {
                            toggleSelect(item.slug)
                            return
                          }
                          setMode('preview')
                          onSelect(item)
                        }}
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <h2
                            className="min-w-0 break-words text-left text-sm font-semibold leading-6 text-slate-950"
                            title={item.title || '未命名内容'}
                          >
                            {item.title || '未命名内容'}
                          </h2>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700'
                                : item.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-orange-50 text-orange-700'
                            }`}
                          >
                            {statusLabel(item.status)}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-slate-500">
                          {item.intro || '暂无摘要'}
                        </p>
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{item.createdAt || '-'}{item.kind ? ` · ${item.kind === 'link' ? '链接' : '文档'}` : ''}</span>
                      <div className="flex items-center gap-2">
                        {!selectionMode && (
                          <button
                            type="button"
                            className="font-medium text-orange-700"
                            onClick={() => (item.status === 'published' ? onUnpublish?.(item) : onPublish(item))}
                          >
                            {getPrimaryActionLabel(item.status)}
                          </button>
                        )}
                        {!selectionMode && (
                          <>
                            <button type="button" className="font-medium text-slate-700" onClick={() => { setMode('edit'); onSelect(item) }}>编辑</button>
                            <button type="button" className="font-medium text-red-600" onClick={() => onDelete(item)}>删除</button>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </aside>

        <section className="min-w-0 overflow-y-auto p-4">
          {selected && mode === 'preview' ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-950">详情预览</h2>
                <p className="text-xs text-slate-500">
                  {selectionMode ? '选择模式下可通过顶部操作菜单批量处理' : '编辑、发布/下架和删除请使用顶部操作栏'}
                </p>
              </div>
              <article className="rounded-lg border border-slate-200 bg-white p-5">
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h1 className="text-xl font-semibold text-slate-950">{selected.title || '未命名内容'}</h1>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{selected.intro || '暂无摘要'}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${selected.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                    {statusLabel(selected.status)}
                  </span>
                </div>
                <ArticleMarkdown content={selected.markdown || ''} theme="light" />
              </article>
            </div>
          ) : selectionMode ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
              选择模式已开启。请在左侧勾选内容后使用右上角“操作”菜单执行批量处理。
            </div>
          ) : selected ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-950">{isNew ? '新增内容' : '编辑内容'}</h2>
                <Button variant="outline" onClick={() => setMode('preview')}>返回预览</Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_150px] gap-3">
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>标题</span>
                    <Input value={selected.title} onChange={(event) => setSelectedValue({ title: event.target.value })} />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>创建时间</span>
                    <Input type="date" value={selected.createdAt} onChange={(event) => setSelectedValue({ createdAt: event.target.value })} />
                  </label>
                </div>
                <div className={isNew ? 'grid grid-cols-[1fr_150px] gap-3' : 'grid grid-cols-[150px] gap-3'}>
                  {isNew && (
                    <label className="space-y-1 text-xs font-medium text-slate-500">
                      <span>Slug</span>
                      <Input value={selected.slug} onChange={(event) => setSelectedValue({ slug: event.target.value })} />
                    </label>
                  )}
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>状态</span>
                    <Input value={statusLabel(selected.status)} disabled />
                  </label>
                </div>
                <label className="space-y-1 text-xs font-medium text-slate-500">
                  <span>摘要</span>
                  <Input value={selected.intro} onChange={(event) => setSelectedValue({ intro: event.target.value })} />
                </label>

                {supportsKeywords && (
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>标签</span>
                    <Input
                      value={(selected.keywords || []).join(', ')}
                      onChange={(event) =>
                        setSelectedValue({
                          keywords: event.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="请输入标签，多个标签用英文逗号分隔"
                    />
                  </label>
                )}

                {supportsKind && (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setSelectedValue({ kind: 'link' })} className={`h-8 rounded-md border px-3 text-sm font-medium ${selected.kind === 'link' ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-700'}`}>链接</button>
                    <button type="button" onClick={() => setSelectedValue({ kind: 'document' })} className={`h-8 rounded-md border px-3 text-sm font-medium ${selected.kind !== 'link' ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-slate-200 bg-white text-slate-700'}`}>文档</button>
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap gap-1 rounded-t-md border border-slate-200 bg-slate-50 p-2">
                    {[
                      [Heading1, '# ', '标题 1'],
                      [Heading2, '## ', '标题 2'],
                      [Bold, '**加粗**', '加粗'],
                      [Italic, '*斜体*', '斜体'],
                      [Underline, '<u>下划线</u>', '下划线'],
                      [List, '- 列表项', '无序列表'],
                      [ListOrdered, '1. 列表项', '有序列表'],
                      [Quote, '> 引用内容', '引用'],
                      [LinkIcon, '[链接文字](https://example.com)', '链接'],
                      [ImagePlus, '![图片描述](/images/example.png)', '图片'],
                      [Code, '```ts\\n// code\\n```', '代码块'],
                      [Table, '| 列 | 值 |\\n| --- | --- |\\n| A | B |', '表格'],
                      [SeparatorHorizontal, '\\n---\\n', '分割线'],
                    ].map(([Icon, markdown, label]) => (
                      <button
                        key={label as string}
                        type="button"
                        title={label as string}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        onClick={() => insertAtCursor(textareaRef.current, markdown as string, setMarkdown)}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    ref={textareaRef}
                    className="min-h-[520px] rounded-t-none font-mono text-sm"
                    value={selected.markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                  />
                </div>

                <p className="text-xs text-slate-500">保存会保留当前状态，发布成功后状态更新为已发布。保存、发布/下架和删除请使用顶部操作栏。</p>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">请选择或新增内容</div>
          )}
        </section>
      </div>

      <Dialog open={Boolean(bulkAction)} onOpenChange={(open) => !open && setBulkAction(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {bulkAction ? getBulkActionCopy(bulkAction, selectedCount).title : ''}
            </DialogTitle>
            <DialogDescription>
              {bulkAction ? getBulkActionCopy(bulkAction, selectedCount).description : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm text-slate-600">
            {bulkAction !== 'delete' && (
              <div className="rounded-xl bg-slate-50 p-3">
                {bulkAction ? getBulkActionCopy(bulkAction, selectedCount).helper : ''}
              </div>
            )}
            <div className="rounded-xl border border-slate-200 p-3">
              已选文章：{selectedItems.slice(0, 5).map((item) => item.title || item.slug).join('、')}
              {selectedItems.length > 5 ? '…' : ''}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkAction(null)}>取消</Button>
            <Button
              className={bulkAction === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}
              onClick={() => bulkAction && handleBulk(bulkAction)}
            >
              {bulkAction ? getBulkActionCopy(bulkAction, selectedCount).confirm : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

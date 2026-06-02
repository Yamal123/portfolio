'use client'

import { useMemo, useRef, useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export type ContentStatus = 'draft' | 'published'
export type ContentKind = 'link' | 'document'

export interface WorkbenchItem {
  slug: string
  title: string
  intro: string
  createdAt: string
  status: ContentStatus
  kind?: ContentKind
  markdown: string
}

interface ContentWorkbenchProps {
  title: string
  items: WorkbenchItem[]
  selected: WorkbenchItem | null
  isNew: boolean
  isLoading?: boolean
  isSaving?: boolean
  isPublishing?: boolean
  supportsKind?: boolean
  onNew: () => void
  onSelect: (item: WorkbenchItem) => void
  onChange: (item: WorkbenchItem) => void
  onSaveDraft: () => void
  onPublish: (item?: WorkbenchItem) => void
  onDelete: (item: WorkbenchItem) => void
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
  return status === 'published' ? '已发布' : '草稿'
}

export function ContentWorkbench({
  title,
  items,
  selected,
  isNew,
  isLoading = false,
  isSaving = false,
  isPublishing = false,
  supportsKind = false,
  onNew,
  onSelect,
  onChange,
  onSaveDraft,
  onPublish,
  onDelete,
}: ContentWorkbenchProps) {
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tab, setTab] = useState<'all' | ContentStatus | ContentKind>('all')
  const [mode, setMode] = useState<'preview' | 'edit'>('preview')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const filtered = useMemo(() => {
    return items
      .filter((item) => `${item.title} ${item.slug}`.toLowerCase().includes(query.trim().toLowerCase()))
      .filter((item) => inRange(item.createdAt || '', startDate, endDate))
      .filter((item) => {
        if (tab === 'all') return true
        if (tab === 'draft' || tab === 'published') return item.status === tab
        return item.kind === tab
      })
      .slice(0, 10)
  }, [endDate, items, query, startDate, tab])

  const setSelectedValue = (patch: Partial<WorkbenchItem>) => {
    if (!selected) return
        onChange({ ...selected, ...patch })
  }

  const setMarkdown = (markdown: string) => setSelectedValue({ markdown })

  return (
    <div className="flex min-h-[calc(100vh-104px)] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-950">{title}</h1>
          <p className="mt-1 text-xs text-slate-500">列表 / 新增 / 编辑 / 发布</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${selected?.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
            当前：{selected ? statusLabel(selected.status) : '-'}
          </span>
          <Button onClick={() => { setMode('edit'); onNew() }} className="h-9 bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-1.5 h-4 w-4" />
            新增
          </Button>
        </div>
      </header>

      <div className="flex gap-2 border-b border-slate-200 px-5 py-3">
        {[
          ['all', '全部'],
          ['draft', '草稿'],
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

      <div className="grid min-h-0 flex-1 grid-cols-[390px_minmax(0,1fr)]">
        <aside className="min-h-0 border-r border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 grid grid-cols-[1fr_132px_132px] gap-2">
            <Input className="h-9" placeholder="按标题筛选" value={query} onChange={(event) => setQuery(event.target.value)} />
            <Input className="h-9" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
            <Input className="h-9" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </div>
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>每页最多 10 条</span>
            <span>{filtered.length} / {items.length}</span>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => (
                <article
                  key={item.slug}
                  className={`rounded-lg border bg-white p-3 ${selected?.slug === item.slug ? 'border-orange-300 bg-orange-50/40' : 'border-slate-200'}`}
                >
                  <button type="button" className="block w-full text-left" onClick={() => { setMode('preview'); onSelect(item) }}>
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-sm font-semibold leading-5 text-slate-950">{item.title || '未命名内容'}</h2>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.intro || item.slug}</p>
                  </button>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{item.createdAt || '-'}{item.kind ? ` · ${item.kind === 'link' ? '链接' : '文档'}` : ''}</span>
                    <div className="flex items-center gap-2">
                      {item.status === 'draft' && (
                      <button type="button" className="font-medium text-orange-700" onClick={() => onPublish(item)}>发布</button>
                      )}
                      <button type="button" className="font-medium text-slate-700" onClick={() => { setMode('edit'); onSelect(item) }}>编辑</button>
                      <button type="button" className="font-medium text-red-600" onClick={() => onDelete(item)}>删除</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>

        <section className="min-w-0 p-4">
          {selected && mode === 'preview' ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-950">详情预览</h2>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setMode('edit')}>
                    <Edit className="mr-2 h-4 w-4" />
                    编辑
                  </Button>
                  {selected.status === 'draft' && (
                    <Button className="bg-orange-500 hover:bg-orange-600" disabled={isPublishing} onClick={() => onPublish()}>
                      {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      发布到生产
                    </Button>
                  )}
                  <Button variant="outline" className="text-red-600 hover:text-red-600" onClick={() => onDelete(selected)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </Button>
                </div>
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
                <div className="grid grid-cols-[1fr_150px] gap-3">
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>Slug</span>
                    <Input value={selected.slug} disabled={!isNew} onChange={(event) => setSelectedValue({ slug: event.target.value })} />
                  </label>
                  <label className="space-y-1 text-xs font-medium text-slate-500">
                    <span>状态</span>
                    <Input value={statusLabel(selected.status)} disabled />
                  </label>
                </div>
                <label className="space-y-1 text-xs font-medium text-slate-500">
                  <span>摘要</span>
                  <Input value={selected.intro} onChange={(event) => setSelectedValue({ intro: event.target.value })} />
                </label>

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
                    className="min-h-[310px] rounded-t-none font-mono text-sm"
                    value={selected.markdown}
                    onChange={(event) => setMarkdown(event.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" disabled={isSaving} onClick={onSaveDraft}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    保存草稿
                  </Button>
                  <Button className="bg-orange-500 hover:bg-orange-600" disabled={isPublishing} onClick={() => onPublish()}>
                    {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    发布到生产
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-600" onClick={() => onDelete(selected)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </Button>
                  <span className="ml-auto text-xs text-slate-500">保存默认为草稿，发布成功后状态更新为已发布</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">请选择或新增内容</div>
          )}
        </section>
      </div>
    </div>
  )
}

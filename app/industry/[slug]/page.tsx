'use client'

import { useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Calendar, Check, Copy, ExternalLink, Image as ImageIcon, Tag } from 'lucide-react'
import PageNav from '@/components/page-nav'
import { ArticleMarkdown } from '@/components/article-markdown'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/contexts/theme-context'
import { fetchAPI } from '@/lib/api/client'
import type { IndustryUpdate } from '@/types/industry'

interface IndustryDetailPageProps {
  params: { slug: string }
}

export default function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = params
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const { data: update } = useSWR<IndustryUpdate | null>(slug ? `/api/public/industry-updates?slug=${encodeURIComponent(slug)}` : null, fetchAPI)

  const copyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareCard = async () => {
    setShareMessage(language === 'zh' ? '正在推送...' : 'Pushing...')
    try {
      const response = await fetch('/api/industry-updates/push-feishu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await response.json()
      setShareMessage(response.ok ? (language === 'zh' ? '已推送到飞书' : 'Pushed to Feishu') : data.message || 'Failed')
    } catch {
      setShareMessage(language === 'zh' ? '推送失败' : 'Push failed')
    }
  }

  if (!update) {
    return (
      <main className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <PageNav showBack backUrl="/industry" />
        <div className="mx-auto max-w-4xl px-6 pt-32 text-center">
          <h1 className={`mb-4 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{language === 'zh' ? '行业动态未找到' : 'Industry update not found'}</h1>
          <Link href="/industry" className={theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}>{language === 'zh' ? '返回列表' : 'Back to list'}</Link>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <PageNav showBack backUrl="/industry" />
      <div className="pt-32 pb-24">
        <article className="mx-auto max-w-4xl px-6">
          <header className="mb-10">
            <div className={`mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${theme === 'dark' ? 'bg-gray-900 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>
              <Calendar className="h-4 w-4" />{update.createdAt}
            </div>
            <h1 className={`mb-4 text-3xl font-bold md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{update.title[language]}</h1>
            <p className={`mb-6 text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{update.intro[language]}</p>
            <div className="mb-6 flex flex-wrap gap-2">
              {update.keywords.map((keyword) => (
                <span key={keyword} className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                  <Tag className="mr-1 h-3 w-3" />{keyword}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={copyLink} className={theme === 'dark' ? 'border-gray-700 bg-transparent text-gray-200 hover:bg-gray-900' : ''}>
                {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制链接' : 'Copy link')}
              </Button>
              <Button onClick={shareCard} className="bg-orange-500 hover:bg-orange-600">
                <ImageIcon className="mr-2 h-4 w-4" />{language === 'zh' ? '推送飞书卡片' : 'Push Feishu card'}
              </Button>
              {shareMessage && <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{shareMessage}</span>}
            </div>
          </header>

          <div className={`mb-10 grid gap-4 md:grid-cols-2`}>
            <SignalPanel title={language === 'zh' ? '最新资讯' : 'Latest News'} items={update.newsItems} theme={theme} />
            <SignalPanel title={language === 'zh' ? '技术动向' : 'Technical Trends'} items={update.techItems} theme={theme} />
          </div>

          <div className={`prose max-w-none ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
            <ArticleMarkdown content={update.content[language]} theme={theme} />
          </div>
        </article>
      </div>
    </main>
  )
}

function SignalPanel({ title, items, theme }: { title: string; items: IndustryUpdate['newsItems']; theme: 'dark' | 'light' }) {
  return (
    <section className={`rounded-xl border p-5 ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
      <h2 className={`mb-4 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      <div className="space-y-3">
        {items.slice(0, 5).map((item) => (
          <a key={item.url} href={item.url} target="_blank" rel="noreferrer" className={`group block rounded-lg p-3 ${theme === 'dark' ? 'bg-black/40 hover:bg-black' : 'bg-white hover:bg-orange-50'}`}>
            <div className={`mb-1 flex items-start justify-between gap-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
              <span>{item.title}</span>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
            </div>
            <p className={`line-clamp-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{item.source} · {item.summary}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

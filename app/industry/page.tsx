'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { Calendar, Search, Tag, ArrowUpRight } from 'lucide-react'
import PageNav from '@/components/page-nav'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/contexts/theme-context'
import { fetchAPI } from '@/lib/api/client'
import type { IndustryUpdate } from '@/types/industry'

export default function IndustryPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const { data: updates = [] } = useSWR<IndustryUpdate[]>('/api/public/industry-updates', fetchAPI)

  const filtered = useMemo(() => {
    const lowered = query.trim().toLowerCase()
    return updates.filter((update) => {
      const matchesDate = !date || update.createdAt === date
      if (!lowered) return matchesDate
      const haystack = [
        update.title[language],
        update.intro[language],
        update.content[language],
        ...update.keywords,
        ...update.sources.map((source) => source.name),
      ].join(' ').toLowerCase()
      return matchesDate && haystack.includes(lowered)
    })
  }, [date, language, query, updates])

  const t = {
    zh: { title: '行业动态', subtitle: '按日期和内容筛选每日 AI 行业观察', search: '搜索标题、摘要、来源或正文...', date: '按日期筛选', empty: '没有找到匹配的行业动态' },
    en: { title: 'Industry Updates', subtitle: 'Filter daily AI industry briefs by date and content', search: 'Search title, summary, source or content...', date: 'Filter by date', empty: 'No industry updates found' },
  }[language]

  return (
    <main className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <PageNav showBack backUrl="/" />
      <div className="pt-32 pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h1 className={`mb-4 text-4xl font-bold md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.title}</h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.subtitle}</p>
          </div>

          <div className="mx-auto mb-12 grid max-w-3xl gap-3 sm:grid-cols-[1fr_180px]">
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className={`pl-12 py-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}`} />
            </div>
            <Input type="date" aria-label={t.date} value={date} onChange={(event) => setDate(event.target.value)} className={`py-6 ${theme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-200 bg-gray-50 text-gray-900'}`} />
          </div>

          <div className="space-y-4">
            {filtered.map((update) => (
              <Link key={update.slug} href={`/industry/${update.slug}`} className={`group block rounded-xl border p-6 transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'border-gray-800 bg-gray-900/50 hover:border-orange-500/30' : 'border-gray-200 bg-white hover:border-orange-300'}`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="flex-1">
                    <div className={`mb-3 flex flex-wrap items-center gap-3 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{update.createdAt}</span>
                      <span>{update.newsItems.length} news</span>
                      <span>{update.techItems.length} tech</span>
                    </div>
                    <h2 className={`mb-2 text-xl font-semibold transition-colors ${theme === 'dark' ? 'text-white group-hover:text-orange-400' : 'text-gray-900 group-hover:text-orange-500'}`}>{update.title[language]}</h2>
                    <p className={`mb-4 line-clamp-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{update.intro[language]}</p>
                    <div className="flex flex-wrap gap-2">
                      {update.keywords.slice(0, 4).map((keyword) => (
                        <span key={keyword} className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                          <Tag className="mr-1 h-3 w-3" />{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className={`h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && <p className={`py-16 text-center text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.empty}</p>}
        </div>
      </div>
    </main>
  )
}

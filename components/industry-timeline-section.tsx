'use client'

import Link from 'next/link'
import useSWR from 'swr'
import { ArrowUpRight, CalendarDays, Newspaper } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/contexts/theme-context'
import { fetchAPI } from '@/lib/api/client'
import type { IndustryUpdate } from '@/types/industry'

export function IndustryTimelineSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const { data: updates = [], isLoading } = useSWR<IndustryUpdate[]>('/api/public/industry-updates', fetchAPI)
  const visibleUpdates = updates.slice(0, 5)

  const t = {
    zh: {
      label: '每日追踪',
      title: '行业动态',
      description: '聚合 AI 产品、开源项目与技术生态，筛出值得学习和扩展视野的信息。',
      more: '更多行业动态',
      empty: '暂无行业动态',
      read: '查看详情',
    },
    en: {
      label: 'Daily Radar',
      title: 'Industry Updates',
      description: 'Curated AI product, open-source and technical signals for learning and market awareness.',
      more: 'More Updates',
      empty: 'No industry updates yet',
      read: 'Read details',
    },
  }[language]

  return (
    <section id="industry" className="relative overflow-hidden py-16 sm:py-24" style={{ background: theme === 'dark' ? '#000000' : '#ffffff' }}>
      <div className={`absolute left-0 top-0 h-px w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className={`mb-3 text-sm font-medium tracking-wide sm:text-base ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>{t.label}</p>
          <h2 className={`mb-4 text-3xl font-bold sm:text-4xl md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{t.title}</h2>
          <p className={`mx-auto max-w-2xl text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{t.description}</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className={`h-28 animate-pulse rounded-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`} />
            ))}
          </div>
        ) : visibleUpdates.length === 0 ? (
          <div className={`rounded-xl border p-8 text-center ${theme === 'dark' ? 'border-gray-800 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
            {t.empty}
          </div>
        ) : (
          <div className="relative mx-auto max-w-4xl">
            <div className={`absolute left-4 top-0 h-full w-px sm:left-1/2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <div className="space-y-6">
              {visibleUpdates.map((update, index) => (
                <Link
                  key={update.slug}
                  href={`/industry/${update.slug}`}
                  className={`group relative block pl-12 sm:w-1/2 sm:pl-0 ${index % 2 === 0 ? 'sm:pr-10' : 'sm:ml-auto sm:pl-10'}`}
                >
                  <span className={`absolute left-[9px] top-6 z-10 flex h-4 w-4 rounded-full border-2 sm:left-auto ${index % 2 === 0 ? 'sm:-right-2' : 'sm:-left-2'} ${theme === 'dark' ? 'border-orange-400 bg-black' : 'border-orange-500 bg-white'}`} />
                  <article className={`rounded-xl border p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${theme === 'dark' ? 'border-gray-800 bg-gray-900/60 group-hover:border-orange-500/40' : 'border-gray-200 bg-white group-hover:border-orange-300'}`}>
                    <div className={`mb-3 flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      <CalendarDays className="h-3.5 w-3.5" />
                      <span>{update.createdAt}</span>
                      <span>·</span>
                      <span>{update.newsItems.length + update.techItems.length} signals</span>
                    </div>
                    <h3 className={`mb-2 text-lg font-semibold transition-colors ${theme === 'dark' ? 'text-white group-hover:text-orange-400' : 'text-gray-900 group-hover:text-orange-500'}`}>
                      {update.title[language]}
                    </h3>
                    <p className={`mb-4 line-clamp-2 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {update.intro[language]}
                    </p>
                    <div className={`flex items-center justify-between text-sm font-medium ${theme === 'dark' ? 'text-orange-400' : 'text-orange-500'}`}>
                      <span className="inline-flex items-center gap-1"><Newspaper className="h-4 w-4" />{t.read}</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/industry" className={`inline-flex items-center rounded-full border px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 ${theme === 'dark' ? 'border-gray-700 text-white hover:border-orange-400 hover:text-orange-400' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}>
            {t.more}
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

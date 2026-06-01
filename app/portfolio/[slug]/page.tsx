"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Calendar, Tag, Copy, Check, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchAPI } from "@/lib/api/client"
import type { Project } from '@/data/projects'
import PageNav from "@/components/page-nav"
import { SafeMarkdown } from "@/components/safe-markdown"

interface ProjectDetailPageProps {
  params: { slug: string }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const { data: project, isLoading, error } = useSWR(
    slug ? `/api/public/projects?slug=${slug}` : null,
    (url) => fetchAPI<Project | null>(url),
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      suspense: false,
    }
  )

  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const t = {
    zh: {
      title: "作品详情",
      notFound: "作品未找到",
      back: "返回作品列表",
      copyLink: "复制链接",
      copied: "已复制",
      viewGithub: "查看 GitHub 仓库",
      loading: "加载中...",
      problem: "问题",
      action: "行动",
      result: "成果",
    },
    en: {
      title: "Project Detail",
      notFound: "Project not found",
      back: "Back to portfolio",
      copyLink: "Copy link",
      copied: "Copied!",
      viewGithub: "View on GitHub",
      loading: "Loading...",
      problem: "Challenge",
      action: "Action",
      result: "Result",
    },
  }[language]

  if (isLoading && !error) {
    return (
      <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <PageNav showBack backUrl="/portfolio" />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
          <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {t.loading}
          </p>
        </div>
      </main>
    )
  }

  if (error || !project) {
    return (
      <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <PageNav showBack backUrl="/portfolio" />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {t.notFound}
          </h1>
          <Link href="/portfolio" className={`inline-flex items-center gap-2 ${theme === "dark" ? "text-orange-400" : "text-orange-600"} hover:underline`}>
            <ArrowLeft className="w-4 h-4" />
            {t.back}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <PageNav showBack backUrl="/portfolio" />
      
      <div className="pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-5xl">{project.emoji}</span>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-full">
                {project.type[language === "zh" ? "zh" : "en"]}
              </span>
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {project.name[language === "zh" ? "zh" : "en"]}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(project.createdAt)}</span>
              </span>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400 hover:text-orange-400" : "text-gray-600 hover:text-orange-600"} transition-colors`}
              >
                {copied ? <Check className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-500"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copied ? t.copied : t.copyLink}</span>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {project.keywords.map((keyword: string, index: number) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {keyword}
                </span>
              ))}
            </div>
            
            <p className={`text-lg italic ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {project.intro[language === "zh" ? "zh" : "en"]}
            </p>
          </header>

          {/* Problem/Action/Result */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-900/50 border border-gray-800" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-amber-500/20" : "bg-amber-50"}`}>
                  <span className="text-lg">🎯</span>
                </div>
                <span className={`font-semibold ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`}>{t.problem}</span>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {project.problem[language === "zh" ? "zh" : "en"]}
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-900/50 border border-gray-800" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-orange-500/20" : "bg-orange-50"}`}>
                  <span className="text-lg">🚀</span>
                </div>
                <span className={`font-semibold ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}>{t.action}</span>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {project.action[language === "zh" ? "zh" : "en"]}
              </p>
            </div>
            
            <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-gray-900/50 border border-gray-800" : "bg-white border border-gray-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === "dark" ? "bg-green-500/20" : "bg-green-50"}`}>
                  <span className="text-lg">✨</span>
                </div>
                <span className={`font-semibold ${theme === "dark" ? "text-green-400" : "text-green-600"}`}>{t.result}</span>
              </div>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {project.result[language === "zh" ? "zh" : "en"]}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={`max-w-none ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            <SafeMarkdown theme={theme}>{project.content[language === "zh" ? "zh" : "en"]}</SafeMarkdown>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/portfolio" className={`inline-flex items-center gap-2 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"} transition-colors`}>
                <ArrowLeft className="w-4 h-4" />
                {t.back}
              </Link>
              
              <a
                href="https://github.com/Yamal123/portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-5 h-5" />
                <span>{t.viewGithub}</span>
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}

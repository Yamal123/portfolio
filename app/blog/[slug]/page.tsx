"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Calendar, Tag, Copy, Check } from "lucide-react"
import { articlesData } from "@/data/articles"
import type { Article } from "@/types/article"
import PageNav from "@/components/page-nav"
import { ArticleMarkdown } from "@/components/article-markdown"

interface ArticleDetailPageProps {
  params: { slug: string }
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = params
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const article: Article | undefined = useMemo(() => {
    return articlesData.find(a => a.slug === slug)
  }, [slug])

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

  if (!article) {
    return (
      <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <PageNav showBack backUrl="/blog" />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "文章未找到" : "Article not found"}
          </h1>
          <Link href="/blog" className={`${theme === "dark" ? "text-orange-400" : "text-orange-500"} hover:underline`}>
            {language === "zh" ? "返回文章列表" : "Back to article list"}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <PageNav showBack backUrl="/blog" />
      
      <div className="pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-6">
          {/* 文章标题区 */}
          <header className="mb-12">
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {article.title[language === "zh" ? "zh" : "en"]}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDate(article.createdAt)}</span>
              </span>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} transition-colors`}
              >
                {copied ? <Check className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-500"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === "zh" ? "已复制" : "Copied!") : (language === "zh" ? "复制链接" : "Copy link")}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {article.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {keyword}
                </span>
              ))}
            </div>
            <p className={`text-lg italic ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              {article.intro[language === "zh" ? "zh" : "en"]}
            </p>
          </header>

          {/* 文章内容区 */}
          <div className={`prose max-w-none ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            <ArticleMarkdown
              content={article.content[language === "zh" ? "zh" : "en"]}
              theme={theme}
            />
          </div>
        </article>
      </div>
    </main>
  )
}

"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { use } from "react"
import { ExternalLink, Calendar, Tag, Copy, Check, ArrowLeft } from "lucide-react"
import { articlesData, type Article } from "@/data/articles"
import PageNav from "@/components/page-nav"

// 简单的Markdown渲染器
const MarkdownRenderer = ({ content, theme }: { content: string, theme: string }) => {
  const renderContent = content.split('\n').map((line, index) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mt-6 mb-3 text-orange-400">{line.slice(4)}</h3>
    } else if (line.startsWith('## ')) {
      return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-orange-400">{line.slice(3)}</h2>
    } else if (line.startsWith('# ')) {
      return <h1 key={index} className="text-3xl font-bold mt-10 mb-6 text-orange-400">{line.slice(2)}</h1>
    } else if (line.startsWith('- **')) {
      return (
        <li key={index} className="ml-6 my-2 list-disc">
          <strong>{line.slice(3, line.indexOf('**', 3))}</strong>{line.slice(line.indexOf('**', 3) + 2)}
        </li>
      )
    } else if (line.startsWith('- ')) {
      return <li key={index} className="ml-6 my-2 list-disc">{line.slice(2)}</li>
    } else if (line.match(/^\d+\. /)) {
      return <li key={index} className="ml-6 my-2 list-decimal">{line.replace(/^\d+\. /, '')}</li>
    } else if (line.trim() === '') {
      return <br key={index} />
    } else {
      let formattedLine = line
      // 粗体
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={index} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{__html: formattedLine}} />
    }
  })
  return <div>{renderContent}</div>
}

export default function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
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
          <Link href="/blog" className={`text-orange-400 hover:underline`}>
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
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
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
            <MarkdownRenderer 
              content={article.content[language === "zh" ? "zh" : "en"]} 
              theme={theme} 
            />
          </div>
        </article>
      </div>
    </main>
  )
}

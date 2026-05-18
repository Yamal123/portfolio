"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Calendar, Tag, Copy, Check, Loader2 } from "lucide-react"
import { fetchAPI } from "@/lib/api/client"
import { adaptBackendProject } from "@/lib/api/adapter"
import type { Project } from '@/data/projects'
import PageNav from "@/components/page-nav"

// 简单的Markdown渲染器
const MarkdownRenderer = ({ content, theme }: { content: string, theme: string }) => {
  const renderContent = content.split('\n').map((line, index) => {
    const orangeColor = theme === "dark" ? "text-orange-400" : "text-orange-500"
    if (line.startsWith('### ')) {
      return <h3 key={index} className={`text-xl font-bold mt-6 mb-3 ${orangeColor}`}>{line.slice(4)}</h3>
    } else if (line.startsWith('## ')) {
      return <h2 key={index} className={`text-2xl font-bold mt-8 mb-4 ${orangeColor}`}>{line.slice(3)}</h2>
    } else if (line.startsWith('# ')) {
      return <h1 key={index} className={`text-3xl font-bold mt-10 mb-6 ${orangeColor}`}>{line.slice(2)}</h1>
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
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      return <p key={index} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{__html: formattedLine}} />
    }
  })
  return <div>{renderContent}</div>
}

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
    (url) => fetchAPI<any | null>(url).then(data => {
      if (data) {
        return adaptBackendProject(data)
      }
      return null
    })
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

  if (isLoading) {
    return (
      <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
        <PageNav showBack backUrl="/portfolio" />
        <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          <Loader2 className={`w-8 h-8 animate-spin mx-auto ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
          <p className={`mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {language === "zh" ? "加载中..." : "Loading..."}
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
          <h1 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "作品未找到" : "Project not found"}
          </h1>
          <Link href="/portfolio" className={`${theme === "dark" ? "text-orange-400" : "text-orange-500"} hover:underline`}>
            {language === "zh" ? "返回作品列表" : "Back to portfolio"}
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
          {/* 作品标题区 */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{project.emoji}</span>
              <span className="px-3 py-1 bg-orange-500/90 text-white text-sm font-semibold rounded-full">
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
                className={`flex items-center gap-1 ${theme === "dark" ? "text-gray-400 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"} transition-colors`}
              >
                {copied ? <Check className={`w-4 h-4 ${theme === "dark" ? "text-green-400" : "text-green-500"}`} /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (language === "zh" ? "已复制" : "Copied!") : (language === "zh" ? "复制链接" : "Copy link")}</span>
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

          {/* 作品内容区 */}
          <div className={`prose max-w-none ${theme === "dark" ? "text-gray-300" : "text-gray-800"}`}>
            <MarkdownRenderer 
              content={project.content[language === "zh" ? "zh" : "en"]} 
              theme={theme}
            />
          </div>

          {/* GitHub 链接 */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <a
              href="https://github.com/Yamal123/portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-orange-500"
                  : "bg-gray-100 text-gray-900 hover:bg-orange-500 hover:text-white"
              }`}
            >
              <ExternalLink className="w-5 h-5" />
              <span>{language === "zh" ? "查看 GitHub 仓库" : "View on GitHub"}</span>
            </a>
          </div>
        </article>
      </div>
    </main>
  )
}

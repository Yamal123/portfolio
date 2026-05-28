"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ExternalLink, Calendar, Tag } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import useSWR from "swr"
import { fetchAPI } from "@/lib/api/client"
import type { Article as ContentArticle } from "@/types/article"

interface Article {
  id: number
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
}

export default function BlogSection() {
  const { data: source = [], isLoading: loading } = useSWR<ContentArticle[]>('/api/public/articles', fetchAPI)
  const { language } = useLanguage()
  const { theme } = useTheme()

  const articles = useMemo<Article[]>(
    () =>
      source.slice(0, 6).map((article) => ({
      id: article.id,
      slug: article.slug,
      title: article.title[language === "zh" ? "zh" : "en"],
      date: article.createdAt,
      tags: article.keywords,
      summary: article.intro[language === "zh" ? "zh" : "en"]
      })),
    [language, source],
  )

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  return (
    <section id="blog" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
            {language === "zh" ? "深度思考" : "Deep Insights"}
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "方法论" : "Methodology"}
          </h2>
          <p className={`max-w-2xl mx-auto text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {language === "zh" ? "分享产品设计、AI技术与跨境业务的思考与实践" : "Sharing thoughts and practices on product design, AI technology and cross-border business"}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"} animate-pulse`}>
                <div className="h-6 bg-gray-700/50 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-600/50 rounded w-full mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-700/50 rounded-full px-4"></div>
                  <div className="h-8 bg-gray-700/50 rounded-full px-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className={`group relative block p-6 rounded-xl border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-900/50 border-gray-800 hover:border-orange-500/30"
                    : "bg-white border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors ${
                        theme === "dark" ? "text-white group-hover:text-orange-400" : "text-gray-900 group-hover:text-orange-500"
                      }`}
                    >
                      {article.title}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {article.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(article.date)}
                      </span>
                      <div className="flex gap-2">
                        {article.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 group-hover:bg-orange-500 text-gray-400 group-hover:text-white"
                          : "bg-gray-100 group-hover:bg-orange-500 text-gray-600 group-hover:text-white"
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center ${
              theme === "dark"
                ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400"
                : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {language === "zh" ? "查看更多文章" : "View More Articles"}
            <ExternalLink className="w-5 h-5 inline-block ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

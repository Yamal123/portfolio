"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Calendar, Tag, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageNav from "@/components/page-nav"
import { articlesData, type Article } from "@/data/articles"

export default function BlogListPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articlesData
    const query = searchQuery.toLowerCase()
    return articlesData.filter(article => 
      article.title[language === "zh" ? "zh" : "en"].toLowerCase().includes(query) ||
      article.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      article.intro[language === "zh" ? "zh" : "en"].toLowerCase().includes(query)
    )
  }, [searchQuery, language])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(language === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <PageNav showBack backUrl="/" />
      
      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {language === "zh" ? "方法论" : "Methodology"}
            </h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {language === "zh" ? "分享产品设计、AI技术与跨境业务的思考与实践" : "Sharing thoughts and practices on product design, AI technology and cross-border business"}
            </p>
          </div>

          <div className="relative max-w-md mx-auto mb-12">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
            <Input
              type="text"
              placeholder={language === "zh" ? "搜索文章..." : "Search articles..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className={`pl-12 py-6 ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`}
            />
          </div>

          <div className="space-y-4 mb-12">
            {currentArticles.map((article) => (
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
                    <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                      theme === "dark" ? "text-white group-hover:text-orange-400" : "text-gray-900 group-hover:text-orange-500"
                    }`}>
                      {article.title[language === "zh" ? "zh" : "en"]}
                    </h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {article.intro[language === "zh" ? "zh" : "en"]}
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`flex items-center text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(article.createdAt)}
                      </span>
                      <div className="flex gap-2">
                        {article.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`p-2 rounded-lg transition-all duration-300 ${
                      theme === "dark"
                        ? "bg-gray-800 group-hover:bg-orange-500 text-gray-400 group-hover:text-white"
                        : "bg-gray-100 group-hover:bg-orange-500 text-gray-600 group-hover:text-white"
                    }`}>
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {language === "zh" ? "没有找到匹配的文章" : "No articles found"}
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 ${
                    currentPage === page 
                      ? "bg-orange-500 hover:bg-orange-600" 
                      : theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-100"}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

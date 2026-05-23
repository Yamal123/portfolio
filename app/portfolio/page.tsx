"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Search, ChevronLeft, ChevronRight, ExternalLink, Calendar, Tag, Github, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageNav from "@/components/page-nav"
import { fetchAPI } from "@/lib/api/client"
import { adaptProjects } from "@/lib/api/adapter"
import { mockProjects } from "@/data/projects"
import type { Project } from "@/data/projects"

export default function PortfolioPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const { data: projects, isLoading, error } = useSWR(
    '/api/public/projects',
    (url) => fetchAPI<any[]>(url).then(adaptProjects),
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      fallbackData: mockProjects,
      suspense: false,
    }
  )

  const displayProjects = useMemo(() => {
    if (!projects || projects.length === 0) return mockProjects
    return projects
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (!displayProjects || !searchQuery) return displayProjects || []
    const query = searchQuery.toLowerCase()
    return displayProjects.filter((project: Project) =>
      project.name[language === "zh" ? "zh" : "en"].toLowerCase().includes(query) ||
      project.type[language === "zh" ? "zh" : "en"].toLowerCase().includes(query) ||
      project.keywords.some((keyword: string) => keyword.toLowerCase().includes(query)) ||
      project.intro[language === "zh" ? "zh" : "en"].toLowerCase().includes(query)
    )
  }, [searchQuery, language, displayProjects])

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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

  const t = {
    zh: {
      label: "成功案例",
      title: "作品集",
      subtitle: "深度思考与实践的沉淀",
      description: "深耕跨境供应链与AI领域，用产品思维解决真实业务问题",
      search: "搜索项目...",
      viewGithub: "查看我的 GitHub",
      loading: "加载中...",
      error: "加载项目失败，请稍后重试",
      noProjects: "没有找到匹配的项目",
      back: "返回",
    },
    en: {
      label: "Case Studies",
      title: "Portfolio",
      subtitle: "Precipitation of deep thinking and practice",
      description: "Deep expertise in cross-border supply chain and AI, solving real business problems with product thinking",
      search: "Search projects...",
      viewGithub: "View My GitHub",
      loading: "Loading...",
      error: "Failed to load projects, please try again later",
      noProjects: "No projects found",
      back: "Back",
    },
  }[language]

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <PageNav showBack backUrl="/" />
      
      {/* Error Banner */}
      {error && (
        <div className={`fixed top-20 left-0 right-0 z-40 px-4 py-3 ${
          theme === "dark" ? "bg-amber-500/20 border-amber-500/50" : "bg-amber-50 border-amber-200"
        } border-b`}>
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className={`w-4 h-4 ${theme === "dark" ? "text-amber-400" : "text-amber-600"}`} />
            <span className={`text-sm ${theme === "dark" ? "text-amber-300" : "text-amber-700"}`}>
              {t.error}
            </span>
          </div>
        </div>
      )}
      
      <div className="pt-32 pb-24" style={{ marginTop: error ? '48px' : '0' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${
              theme === "dark" ? "text-orange-400" : "text-orange-500"
            }`}>
              {t.label}
            </p>
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {t.title}
            </h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"} max-w-2xl mx-auto mb-8`}>
              {t.subtitle}
            </p>
            
            <a 
              href="https://github.com/Yamal123" 
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Github className="w-5 h-5" />
              {t.viewGithub}
            </a>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto mb-12">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
            <Input
              type="text"
              placeholder={t.search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className={`pl-12 py-6 rounded-2xl ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`}
            />
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentProjects.map((project: Project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className={`group block rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800 hover:border-blue-500/30"
                    : "bg-white border border-gray-200 hover:border-blue-300"
                } hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2`}
              >
                <div className="relative h-48 md:h-52 overflow-hidden">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.name[language === "zh" ? "zh" : "en"]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      quality={80}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-5xl">{project.emoji}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full">
                      {project.type[language === "zh" ? "zh" : "en"]}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{project.emoji}</span>
                    <h3 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                      {project.name[language === "zh" ? "zh" : "en"]}
                    </h3>
                  </div>
                  
                  <p className={`text-sm mb-3 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    {project.intro[language === "zh" ? "zh" : "en"]}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`flex items-center text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(project.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.keywords.slice(0, 3).map((keyword: string, index: number) => (
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
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {t.noProjects}
              </p>
            </div>
          )}

          {/* Pagination */}
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
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" 
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

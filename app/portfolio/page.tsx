"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Search, ChevronLeft, ChevronRight, ExternalLink, Calendar, Tag, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import PageNav from "@/components/page-nav"
import { projectsData } from "@/data/projects"

export default function PortfolioPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projectsData
    const query = searchQuery.toLowerCase()
    return projectsData.filter(project => 
      project.name[language === "zh" ? "zh" : "en"].toLowerCase().includes(query) ||
      project.type[language === "zh" ? "zh" : "en"].toLowerCase().includes(query) ||
      project.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
      project.intro[language === "zh" ? "zh" : "en"].toLowerCase().includes(query)
    )
  }, [searchQuery, language])

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

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <PageNav showBack backUrl="/" />
      
      <div className="pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {language === "zh" ? "作品集" : "Portfolio"}
            </h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-8`}>
              {language === "zh" ? "深耕跨境供应链与AI领域，用产品思维解决真实业务问题" : "Deep expertise in cross-border supply chain and AI, solving real business problems with product thinking"}
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
              {language === "zh" ? "查看我的 GitHub" : "View My GitHub"}
            </a>
          </div>

          <div className="relative max-w-md mx-auto mb-12">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`} />
            <Input
              type="text"
              placeholder={language === "zh" ? "搜索项目..." : "Search projects..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className={`pl-12 py-6 ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"}`}
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className={`group block rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                    : "bg-white border border-gray-200 hover:border-orange-300"
                } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2`}
              >
                <div className={`aspect-video relative overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.name[language === "zh" ? "zh" : "en"]}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">{project.emoji}</span>
                    </div>
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`}></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-orange-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                      {project.type[language === "zh" ? "zh" : "en"]}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className={`text-lg font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {project.name[language === "zh" ? "zh" : "en"]}
                  </h3>
                  
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
                    {project.keywords.slice(0, 3).map((keyword, index) => (
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

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {language === "zh" ? "没有找到匹配的项目" : "No projects found"}
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

"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, CheckCircle, Zap, Loader2 } from "lucide-react"
import { fetchAPI } from "@/lib/api/client"
import { adaptProjects } from "@/lib/api/adapter"

export default function PortfolioSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const { data: projects, isLoading, error } = useSWR(
    '/api/public/projects',
    (url) => fetchAPI<any[]>(url).then(adaptProjects)
  )

  if (isLoading) {
    return (
      <section id="portfolio" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
        <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
              {language === "zh" ? "精选项目" : "Featured Projects"}
            </p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {language === "zh" ? "作品集" : "Portfolio"}
            </h2>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-8 h-8 animate-spin ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
          </div>
        </div>
      </section>
    )
  }

  if (error || !projects) {
    return (
      <section id="portfolio" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
        <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
              {language === "zh" ? "精选项目" : "Featured Projects"}
            </p>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              {language === "zh" ? "作品集" : "Portfolio"}
            </h2>
          </div>
          <div className="text-center py-12">
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {language === "zh" ? "加载项目失败，请稍后重试" : "Failed to load projects, please try again later"}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const displayProjects = projects.slice(0, 6) // 首页只显示前6个项目

  return (
    <section id="portfolio" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
            {language === "zh" ? "精选项目" : "Featured Projects"}
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "作品集" : "Portfolio"}
          </h2>
          <p className={`max-w-2xl mx-auto text-sm sm:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {language === "zh" ? "深耕跨境供应链与AI领域，用产品思维解决真实业务问题" : "Deep expertise in cross-border supply chain and AI, solving real business problems with product thinking"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className={`group rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                  : "bg-white border border-gray-200 hover:border-orange-300"
              } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
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
                    <span className="text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{project.emoji}</span>
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent`}></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-orange-500/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                    {project.type[language === "zh" ? "zh" : "en"]}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {project.name[language === "zh" ? "zh" : "en"]}
                </h3>
                
                <div className="space-y-3 mb-6">
                  {project.problem[language === "zh" ? "zh" : "en"] && (
                    <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <Zap className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
                      <span><span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>{language === "zh" ? "痛点：" : "Problem: "}</span>{project.problem[language === "zh" ? "zh" : "en"]}</span>
                    </div>
                  )}
                  {project.action[language === "zh" ? "zh" : "en"] && (
                    <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
                      <span><span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>{language === "zh" ? "动作：" : "Action: "}</span>{project.action[language === "zh" ? "zh" : "en"]}</span>
                    </div>
                  )}
                  {project.result[language === "zh" ? "zh" : "en"] && (
                    <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                      <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${theme === "dark" ? "text-green-400" : "text-green-500"}`} />
                      <span><span className={theme === "dark" ? "text-gray-500" : "text-gray-500"}>{language === "zh" ? "结果：" : "Result: "}</span><span className={`font-medium ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>{project.result[language === "zh" ? "zh" : "en"]}</span></span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                        <span
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      hoveredProject === project.id
                        ? "bg-orange-500 text-white"
                        : theme === "dark"
                          ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {language === "zh" ? "查看详情" : "View Details"}
                    <ArrowRight className={`w-4 h-4 transition-transform ${hoveredProject === project.id ? "translate-x-1" : ""}`} />
                  </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/portfolio"
            className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center ${
              theme === "dark"
                ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400"
                : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
            }`}
          >
            {language === "zh" ? "查看更多项目" : "View More Projects"}
            <ArrowRight className="w-5 h-5 inline-block ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
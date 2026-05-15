"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"
import { projectsData } from "@/data/projects"

interface Project {
  id: number
  emoji: string
  category: string
  title: string
  problem: string
  action: string
  result: string
  tags: string[]
  image?: string
}

export default function PortfolioSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)

  const projects: Project[] = [
    {
      id: 1,
      emoji: "🌐",
      category: language === "zh" ? "个人项目" : "Personal Project",
      title: language === "zh" ? "AI 产品经理作品集" : "AI PM Portfolio",
      problem: language === "zh" ? "需要一个专业的在线作品集" : "Need a professional online portfolio",
      action: language === "zh" ? "使用 Next.js 构建现代化响应式网站" : "Built modern responsive website with Next.js",
      result: language === "zh" ? "成功展示个人品牌" : "Successfully showcased personal brand",
      tags: ["Next.js", "React", "TypeScript"],
      image: "/images/portfolio/ai-portfolio.png"
    }
  ]

  return (
    <section id="portfolio" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 text-orange-400">
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
          {projects.map((project) => (
            <Link
              key={project.id}
              href="/portfolio"
              className={`group rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                  : "bg-white border border-gray-200 hover:border-orange-300"
              } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className={`aspect-video relative overflow-hidden ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
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
                    {project.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {project.title}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <Zap className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span><span className="text-gray-500">{language === "zh" ? "痛点：" : "Problem: "}</span>{project.problem}</span>
                  </div>
                  <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    <ArrowRight className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span><span className="text-gray-500">{language === "zh" ? "动作：" : "Action: "}</span>{project.action}</span>
                  </div>
                  <div className={`flex items-start gap-2 text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span><span className="text-gray-500">{language === "zh" ? "结果：" : "Result: "}</span><span className="text-orange-400 font-medium">{project.result}</span></span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag, tagIndex) => (
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
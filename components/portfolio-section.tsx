'use client'

import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useLanguage } from '@/contexts/language-context'
import { fetchAPI } from '@/lib/api/client'
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Target,
  Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/contexts/theme-context'
import type { Project } from '@/data/projects'

interface PortfolioSectionProps {
  className?: string
}

export function PortfolioSection({ className }: PortfolioSectionProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const { data: displayProjects = [] } = useSWR<Project[]>('/api/public/projects', fetchAPI)

  const t = {
    zh: {
      label: '成功案例',
      title: '作品集',
      description: '深度思考与实践的沉淀',
      viewDetails: '查看详情',
      visitProject: '访问项目',
      viewMore: '查看更多作品',
    },
    en: {
      label: 'Case Studies',
      title: 'Portfolio',
      description: 'Precipitation of deep thinking and practice',
      viewDetails: 'View Details',
      visitProject: 'Visit Project',
      viewMore: 'View More Projects',
    },
  }[language]

  return (
    <section
      className={`py-16 sm:py-24 relative overflow-hidden ${className}`}
      id="portfolio"
      style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}
    >
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${
            theme === "dark" ? "text-orange-400" : "text-orange-500"
          }`}>
            {t.label}
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {t.title}
          </h2>
          <p className={`text-sm sm:text-base md:text-lg max-w-xl mx-auto ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {t.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {displayProjects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/portfolio/${project.slug}`}
              className="block group"
            >
              <ProjectCard
                project={project}
                index={index}
                theme={theme}
                language={language}
              />
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
            {t.viewMore}
            <ExternalLink className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  theme,
  language,
}: {
  project: Project
  index: number
  theme: "dark" | "light"
  language: "zh" | "en"
}) {
  const t = {
    zh: {
      viewDetails: '查看详情',
      visitProject: '访问项目',
      problem: '问题',
      action: '行动',
      result: '成果',
    },
    en: {
      viewDetails: 'View Details',
      visitProject: 'Visit Project',
      problem: 'Challenge',
      action: 'Action',
      result: 'Result',
    },
  }[language]

  return (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
      theme === "dark"
        ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
        : "bg-white border border-gray-200 hover:border-orange-300"
    } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1`}>
      <div className="grid md:grid-cols-2">
        <div className="relative h-48 md:h-auto aspect-video md:aspect-auto overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.name[language]}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center">
              <span className="text-5xl">{project.emoji}</span>
            </div>
          )}
          <Badge className={`absolute top-3 sm:top-4 left-3 sm:left-4 ${
            theme === "dark"
              ? "bg-gray-900/90 backdrop-blur-sm text-white border-gray-700"
              : "bg-white/90 backdrop-blur-sm text-gray-900 border-gray-200"
          } shadow-md`}>
            {project.type[language]}
          </Badge>
        </div>

        <div className="p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">{project.emoji}</span>
              <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
                theme === "dark"
                  ? "text-white group-hover:text-orange-400"
                  : "text-gray-900 group-hover:text-orange-500"
              }`}>
                {project.name[language]}
              </h3>
            </div>
            <p className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {project.intro[language]}
            </p>
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {project.keywords.slice(0, 3).map((tag: string, tagIndex: number) => (
                <Badge
                  key={tagIndex}
                  variant="outline"
                  className={`text-xs ${
                    theme === "dark"
                      ? "bg-gray-800/50 text-gray-400 border-gray-700"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1 sm:gap-2 text-xs">
              <div className="flex items-center gap-1 text-orange-500">
                <Target className="w-3 h-3" />
                <span className="line-clamp-1">{project.problem[language]}</span>
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <Rocket className="w-3 h-3" />
                <span className="line-clamp-1">{project.action[language]}</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <Sparkles className="w-3 h-3" />
                <span className="line-clamp-1">{project.result[language]}</span>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-3 border-t ${
              theme === "dark" ? "border-gray-800" : "border-gray-100"
            }`}>
              <span className="text-xs text-gray-500">{project.createdAt}</span>
              <div className="flex gap-2">
                {project.externalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={`h-7 px-2 sm:h-8 sm:px-3 ${
                      theme === "dark"
                        ? "text-gray-400 hover:text-orange-400"
                        : "text-gray-500 hover:text-orange-500"
                    }`}
                  >
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  </Button>
                )}
                <span className={`h-7 px-3 sm:h-8 sm:px-4 inline-flex items-center gap-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 group-hover:scale-105`}>
                  {t.viewDetails}
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

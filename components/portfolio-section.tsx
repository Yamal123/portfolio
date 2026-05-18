'use client'

import React, { useState, useMemo } from 'react'
import { useLanguage } from '@/contexts/language-context'
import useSWR from 'swr'
import { publicFetcher } from '@/lib/api/client'
import { adaptProjects } from '@/lib/api/adapter'
import { mockProjects } from '@/data/projects'
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Sparkles,
  Target,
  Rocket,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ProjectDetailView } from './project-detail-view'
import { useTheme } from '@/contexts/theme-context'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { Project } from '@/data/projects'

interface PortfolioSectionProps {
  className?: string
}

export function PortfolioSection({ className }: PortfolioSectionProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 从真实API获取数据
  const { data: projects, isLoading, error } = useSWR(
    '/api/public/projects',
    publicFetcher<any[]>
  )

  // 使用适配器转换数据，fallback到mock数据
  const displayProjects = useMemo(() => {
    if (projects && projects.length > 0) {
      return adaptProjects(projects)
    }
    return mockProjects
  }, [projects])

  const categories = useMemo(() => {
    const cats = new Set(['all'])
    displayProjects.forEach((p) => {
      const typeKey = language === 'zh' ? 'zh' : 'en'
      cats.add(p.type[typeKey])
    })
    return Array.from(cats)
  }, [displayProjects, language])

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return displayProjects
    return displayProjects.filter(
      (p) =>
        (language === 'zh' ? p.type.zh : p.type.en) === selectedCategory
    )
  }, [displayProjects, selectedCategory, language])

  const selectedProject = displayProjects.find(
    (p) => p.slug === selectedProjectSlug
  )

  const t = {
    zh: {
      title: '我的作品',
      subtitle: '精选项目案例',
      viewDetails: '查看详情',
      visitProject: '访问项目',
      viewGithub: '查看源码',
      categories: '分类',
      all: '全部',
      problem: '问题',
      action: '行动',
      result: '成果',
      loading: '加载中...',
      error: '加载失败',
    },
    en: {
      title: 'Portfolio',
      subtitle: 'Featured Projects',
      viewDetails: 'View Details',
      visitProject: 'Visit Project',
      viewGithub: 'View Source',
      categories: 'Categories',
      all: 'All',
      problem: 'Challenge',
      action: 'Action',
      result: 'Result',
      loading: 'Loading...',
      error: 'Failed to load',
    },
  }[language]

  if (isLoading) {
    return (
      <section
        className={`py-24 px-6 md:px-12 ${className}`}
        id="portfolio"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t.title}
            </h2>
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className={`py-24 px-6 md:px-12 ${className}`}
        id="portfolio"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t.title}
            </h2>
            <p className="text-muted-foreground">{t.error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      className={`py-24 px-6 md:px-12 ${className}`}
      id="portfolio"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" className="mb-12" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-center overflow-x-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat === 'all' ? t.all : cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              onViewDetails={setSelectedProjectSlug}
            />
          ))}
        </div>

        {/* Project Detail Dialog */}
        <Dialog
          open={!!selectedProject}
          onOpenChange={(open) => {
            if (!open) setSelectedProjectSlug(null)
          }}
        >
          <DialogContent className="max-w-4xl h-[90vh] overflow-hidden p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>
                {selectedProject?.name[language]}
              </DialogTitle>
              <DialogDescription />
            </DialogHeader>
            {selectedProject && (
              <ProjectDetailView
                project={selectedProject}
                onClose={() => setSelectedProjectSlug(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  onViewDetails,
}: {
  project: Project
  index: number
  onViewDetails: (slug: string) => void
}) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const t = {
    zh: {
      viewDetails: '查看详情',
      visitProject: '访问项目',
      viewGithub: '查看源码',
      problem: '问题',
      action: '行动',
      result: '成果',
    },
    en: {
      viewDetails: 'View Details',
      visitProject: 'Visit Project',
      viewGithub: 'View Source',
      problem: 'Challenge',
      action: 'Action',
      result: 'Result',
    },
  }[language]

  const isDark = theme === 'dark'

  return (
    <Card
      className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800`}
    >
      {/* Image Preview */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name[language]}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-4xl">{project.emoji}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-black/50 text-white border-0">
            {project.type[language]}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold line-clamp-1">
            {project.emoji} {project.name[language]}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-muted-foreground text-xs">
              {project.createdAt}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {project.intro[language]}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.keywords.slice(0, 3).map((tag: string, tagIndex: number) => (
            <Badge
              key={tagIndex}
              variant="outline"
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <Target className="w-3 h-3 text-amber-500 mb-1" />
            <div className="text-muted-foreground line-clamp-2">
              {project.problem[language]}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <Rocket className="w-3 h-3 text-blue-500 mb-1" />
            <div className="text-muted-foreground line-clamp-2">
              {project.action[language]}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <Sparkles className="w-3 h-3 text-green-500 mb-1" />
            <div className="text-muted-foreground line-clamp-2">
              {project.result[language]}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex gap-2">
        <Button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => onViewDetails(project.slug)}
        >
          {t.viewDetails}
          <ArrowUpRight className="w-4 h-4 ml-2" />
        </Button>
        {project.externalUrl && (
          <Button variant="ghost" size="icon" asChild>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.visitProject}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

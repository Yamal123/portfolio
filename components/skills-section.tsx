'use client'

import React, { useState, useMemo } from 'react'
import useSWR from 'swr'
import { publicFetcher } from '@/lib/api/client'
import { adaptSkills } from '@/lib/api/adapter'
import { mockSkills } from '@/data/skills'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/contexts/theme-context'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Cpu,
  Palette,
  BarChart3,
  Brain,
  BriefcaseBusiness,
} from 'lucide-react'

interface SkillsSectionProps {
  className?: string
}

const categoryConfig = {
  ai: {
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  product: {
    icon: BriefcaseBusiness,
    color: 'from-blue-500 to-cyan-500',
  },
  technical: {
    icon: Cpu,
    color: 'from-orange-500 to-amber-500',
  },
  soft: {
    icon: Palette,
    color: 'from-green-500 to-emerald-500',
  },
} as const

export function SkillsSection({ className }: SkillsSectionProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState<string>('ai')

  // 从真实API获取数据
  const { data: skills, isLoading, error } = useSWR(
    '/api/public/skills',
    publicFetcher<any[]>
  )

  // 使用适配器转换数据，fallback到mock数据
  const displaySkills = useMemo(() => {
    if (skills && skills.length > 0) {
      return adaptSkills(skills)
    }
    return mockSkills
  }, [skills])

  const categories = useMemo(() => {
    const cats = new Set(displaySkills.map((s) => s.category))
    return Array.from(cats)
  }, [displaySkills])

  const filteredSkills = useMemo(() => {
    return displaySkills.filter((s) => s.category === activeCategory)
  }, [displaySkills, activeCategory])

  const t = {
    zh: {
      title: '专业技能',
      subtitle: '我的技术栈与能力模型',
      loading: '加载中...',
      error: '加载失败',
    },
    en: {
      title: 'Skills',
      subtitle: 'Tech Stack & Capabilities',
      loading: 'Loading...',
      error: 'Failed to load',
    },
  }[language]

  if (isLoading) {
    return (
      <section
        className={`py-24 px-6 md:px-12 ${className}`}
        id="skills"
      >
        <div className="max-w-6xl mx-auto">
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
        id="skills"
      >
        <div className="max-w-6xl mx-auto">
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
      id="skills"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t.title}
          </h2>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Category Tabs */}
        <Tabs
          defaultValue={activeCategory}
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="w-full justify-center mb-12 flex-wrap gap-2 bg-transparent h-auto p-1">
            {categories.map((category) => {
              const config =
                categoryConfig[category as keyof typeof categoryConfig] ||
                categoryConfig.ai
              const Icon = config.icon
              return (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSkills.map((skill, index) => (
                  <SkillCard
                    key={skill.name.zh}
                    skill={skill}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function SkillCard({
  skill,
  index,
}: {
  skill: any
  index: number
}) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [hovered, setHovered] = useState(false)

  const config =
    categoryConfig[skill.category as keyof typeof categoryConfig] ||
    categoryConfig.ai

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className="h-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-white`}
                >
                  <config.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{skill.name[language]}</h4>
                  <Badge variant="outline" className="capitalize text-xs">
                    {skill.category}
                  </Badge>
                </div>
              </div>
              {skill.description && (
                <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                  {skill.description}
                </p>
              )}
            </div>
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: hovered ? 1.1 : 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {skill.level}%
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground mb-1">
              <span>熟练度</span>
              <span className="font-mono">{skill.level}%</span>
            </div>
            <Progress
              value={skill.level}
              className={`h-2 bg-gray-200 dark:bg-gray-800 ${
                hovered ? 'scale-[1.02]' : ''
              } transition-transform`}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

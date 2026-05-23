'use client'

import React from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/contexts/theme-context'
import { Button } from '@/components/ui/button'
import { X, ExternalLink } from 'lucide-react'
import type { Project } from '@/data/projects'

interface ProjectDetailViewProps {
  project: Project
  onClose: () => void
}

export function ProjectDetailView({ project, onClose }: ProjectDetailViewProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">
          {project.emoji} {project.name[language]}
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {project.thumbnail && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={project.thumbnail}
              alt={project.name[language]}
              className="w-full h-48 object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
              {language === 'zh' ? '项目简介' : 'Introduction'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {project.intro[language]}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-amber-600 dark:text-amber-400">
              {language === 'zh' ? '问题/挑战' : 'Challenge'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {project.problem[language]}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
              {language === 'zh' ? '行动/方案' : 'Action'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {project.action[language]}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-green-600 dark:text-green-400">
              {language === 'zh' ? '结果/成果' : 'Result'}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {project.result[language]}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'zh' ? '详细内容' : 'Details'}
            </h3>
            <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {project.content[language]}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {project.externalUrl && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Button asChild>
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              {language === 'zh' ? '访问项目' : 'Visit Project'}
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileEdit, BookOpen, Save, Eye, Code, ExternalLink } from 'lucide-react'
import { articlesData } from '@/data/articles'
import type { Article } from '@/types/article'

function EditorContent() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editIntro, setEditIntro] = useState('')
  const [editKeywords, setEditKeywords] = useState('')
  const [isPreview, setIsPreview] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article)
    setEditTitle(article.title[language])
    setEditContent(article.content[language])
    setEditIntro(article.intro[language])
    setEditKeywords(article.keywords.join(', '))
    setIsPreview(false)
    setSaved(false)
  }

  const handleLanguageSwitch = (lang: 'zh' | 'en') => {
    setLanguage(lang)
    if (selectedArticle) {
      setEditTitle(selectedArticle.title[lang])
      setEditContent(selectedArticle.content[lang])
      setEditIntro(selectedArticle.intro[lang])
      setEditKeywords(selectedArticle.keywords.join(', '))
    }
  }

  const handleSave = async () => {
    if (!selectedArticle) return

    try {
      const response = await fetch('/api/articles/' + selectedArticle.slug, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('admin_token') || ''),
        },
        body: JSON.stringify({
          language,
          title: editTitle,
          content: editContent,
          intro: editIntro,
          keywords: editKeywords.split(/[,，]/).map(k => k.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <AdminLayout title="内容编辑">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Article List Sidebar */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                方法论文章
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {articlesData.map((article) => (
                <button
                  key={article.id}
                  onClick={() => handleSelectArticle(article)}
                  className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                    selectedArticle?.id === article.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="font-medium line-clamp-1">{article.title.zh}</div>
                  <div className="text-xs text-slate-400 mt-1">{article.createdAt} · {article.keywords.slice(0, 2).join(' / ')}</div>
                </button>
              ))}
              {articlesData.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-8">暂无可编辑的文章</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-8">
          {selectedArticle ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileEdit className="w-5 h-5" />
                    编辑文章
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    slug: {selectedArticle.slug} · ID: {selectedArticle.id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPreview(!isPreview)}
                  >
                    {isPreview ? (
                      <><Code className="w-4 h-4 mr-1" /> 编辑</>
                    ) : (
                      <><Eye className="w-4 h-4 mr-1" /> 预览</>
                    )}
                  </Button>
                  <a
                    href={`/blog/${selectedArticle.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs border rounded-lg text-slate-500 hover:text-blue-500"
                  >
                    <ExternalLink className="w-3 h-3" />
                    查看
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                {/* Language Switch */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => handleLanguageSwitch('zh')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      language === 'zh'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    onClick={() => handleLanguageSwitch('en')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      language === 'en'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    English
                  </button>
                </div>

                {/* Title */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">标题</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="font-medium"
                  />
                </div>

                {/* Intro */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">摘要</label>
                  <Input
                    value={editIntro}
                    onChange={(e) => setEditIntro(e.target.value)}
                  />
                </div>

                {/* Keywords */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-slate-700 mb-1">关键词（逗号分隔）</label>
                  <Input
                    value={editKeywords}
                    onChange={(e) => setEditKeywords(e.target.value)}
                    placeholder="AI, LLM, 产品经理"
                  />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    正文（Markdown）
                  </label>
                  {isPreview ? (
                    <div className="prose max-w-none p-4 border rounded-lg min-h-[400px] bg-white">
                      <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {editContent}
                      </div>
                    </div>
                  ) : (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[400px] p-4 border rounded-lg font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="输入 Markdown 内容..."
                    />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-sm ${saved ? 'text-green-500' : 'text-transparent'}`}>
                    ✓ 已保存
                  </span>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    保存修改
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <FileEdit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">选择左侧的文章开始编辑</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default function EditorPage() {
  return (
    <ProtectedRoute>
      <EditorContent />
    </ProtectedRoute>
  )
}

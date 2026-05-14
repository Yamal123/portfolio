"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ExternalLink, Calendar, Tag, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Article {
  id: number
  title: string
  link: string
  date: string
  tags: string[]
  summary: string
}

export default function BlogPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 6

  useEffect(() => {
    const mockArticles: Article[] = [
      {
        id: 1,
        title: language === "zh" ? "RAG技术实战：如何构建企业级知识库问答系统" : "RAG in Action: Building Enterprise Knowledge Base Q&A Systems",
        link: "#",
        date: "2024-01-15",
        tags: ["RAG", "LLM", "AI"],
        summary: language === "zh" ? "深入探讨RAG技术原理，分享企业级知识库问答系统的设计与实现经验" : "Deep dive into RAG technology, sharing design and implementation experience for enterprise knowledge base Q&A systems"
      },
      {
        id: 2,
        title: language === "zh" ? "AI Agent设计模式：从单Agent到Multi-Agent协作" : "AI Agent Design Patterns: From Single Agent to Multi-Agent Collaboration",
        link: "#",
        date: "2024-01-10",
        tags: ["AI Agent", "Multi-Agent", "架构"],
        summary: language === "zh" ? "分析AI Agent的设计模式，探讨Multi-Agent协作系统的架构设计" : "Analyze AI Agent design patterns, explore architecture design for Multi-Agent collaboration systems"
      },
      {
        id: 3,
        title: language === "zh" ? "跨境供应链数字化转型：AI驱动的智能决策" : "Cross-border Supply Chain Digital Transformation: AI-driven Intelligent Decision Making",
        link: "#",
        date: "2024-01-05",
        tags: ["供应链", "AI", "数字化"],
        summary: language === "zh" ? "探讨AI技术如何赋能跨境供应链，实现智能决策与效率提升" : "Explore how AI empowers cross-border supply chain, enabling intelligent decision making and efficiency improvement"
      },
      {
        id: 4,
        title: language === "zh" ? "意图识别技术在客服系统中的应用实践" : "Intent Recognition in Customer Service Systems: Practical Applications",
        link: "#",
        date: "2023-12-28",
        tags: ["意图识别", "NLP", "客服"],
        summary: language === "zh" ? "分享意图识别技术在智能客服系统中的应用案例与优化策略" : "Share intent recognition applications in intelligent customer service systems and optimization strategies"
      },
      {
        id: 5,
        title: language === "zh" ? "产品经理如何理解与应用LLM技术" : "How Product Managers Understand and Apply LLM Technology",
        link: "#",
        date: "2023-12-20",
        tags: ["产品管理", "LLM", "AI"],
        summary: language === "zh" ? "从产品视角解读LLM技术能力边界，指导产品设计与落地" : "Interpret LLM capabilities from a product perspective, guiding product design and implementation"
      },
      {
        id: 6,
        title: language === "zh" ? "中东市场产品设计：本地化策略与合规要点" : "Product Design for Middle East Market: Localization Strategies and Compliance",
        link: "#",
        date: "2023-12-15",
        tags: ["国际化", "本地化", "合规"],
        summary: language === "zh" ? "分享中东市场产品设计的本地化策略与合规注意事项" : "Share localization strategies and compliance considerations for Middle East market product design"
      },
      {
        id: 7,
        title: language === "zh" ? "产品数据驱动决策：从指标到洞察" : "Data-Driven Product Decisions: From Metrics to Insights",
        link: "#",
        date: "2023-12-10",
        tags: ["数据分析", "产品决策", "增长"],
        summary: language === "zh" ? "如何用数据指导产品决策，从指标体系到数据洞察" : "How to guide product decisions with data, from metrics system to data insights"
      },
      {
        id: 8,
        title: language === "zh" ? "用户增长方法论：从0到1构建增长引擎" : "User Growth Methodology: Building Growth Engine from 0 to 1",
        link: "#",
        date: "2023-12-05",
        tags: ["用户增长", "增长黑客", "产品运营"],
        summary: language === "zh" ? "系统讲解用户增长方法论，从用户获取到留存变现" : "Systematic explanation of user growth methodology, from user acquisition to retention and monetization"
      },
      {
        id: 9,
        title: language === "zh" ? "B端产品设计：从需求到落地" : "B2B Product Design: From Requirements to Launch",
        link: "#",
        date: "2023-11-30",
        tags: ["B端产品", "产品设计", "SaaS"],
        summary: language === "zh" ? "深入探讨B端产品设计方法论，从需求调研到产品落地" : "Deep dive into B2B product design methodology, from research to launch"
      },
      {
        id: 10,
        title: language === "zh" ? "AI时代产品经理能力模型" : "Product Manager Competency Model in AI Era",
        link: "#",
        date: "2023-11-25",
        tags: ["产品经理", "能力模型", "AI"],
        summary: language === "zh" ? "AI时代产品经理需要具备哪些能力？如何构建自己的能力体系" : "What competencies do PMs need in AI era? How to build your competency system"
      },
      {
        id: 11,
        title: language === "zh" ? "产品经理如何做技术选型" : "How Product Managers Make Technology Choices",
        link: "#",
        date: "2023-11-20",
        tags: ["技术选型", "产品管理", "架构"],
        summary: language === "zh" ? "产品经理需要懂技术吗？如何进行技术选型的方法论" : "Do PMs need to understand tech? Methodology for technology selection"
      },
      {
        id: 12,
        title: language === "zh" ? "从0到1构建产品中台" : "Building Product Platform from 0 to 1",
        link: "#",
        date: "2023-11-15",
        tags: ["产品中台", "架构设计", "平台"],
        summary: language === "zh" ? "产品中台建设实践，从架构设计到落地推广" : "Product platform construction practice, from architecture design to rollout"
      }
    ]
    setArticles(mockArticles)
    setLoading(false)
  }, [language])

  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles
    const query = searchQuery.toLowerCase()
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query)) ||
      article.summary.toLowerCase().includes(query)
    )
  }, [articles, searchQuery])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const currentArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${theme === "dark" ? "bg-black/90" : "bg-white/90"} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className={`w-5 h-5 ${theme === "dark" ? "text-white" : "text-gray-900"}`} />
              <span className={`font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {language === "zh" ? "返回首页" : "Back to Home"}
              </span>
            </Link>
            <span className="text-xl font-bold">
              <span className="text-orange-400">PM</span>
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}> 思钱想厚</span>
            </span>
          </div>
        </div>
      </nav>

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

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`p-6 rounded-xl ${theme === "dark" ? "bg-gray-900/50" : "bg-gray-50"} animate-pulse`}>
                  <div className="h-6 bg-gray-700/50 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-600/50 rounded w-full mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-700/50 rounded-full px-4"></div>
                    <div className="h-8 bg-gray-700/50 rounded-full px-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-12">
                {currentArticles.map((article) => (
                  <article
                    key={article.id}
                    className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-xl cursor-pointer ${
                      theme === "dark"
                        ? "bg-gray-900/50 border-gray-800 hover:border-orange-500/30"
                        : "bg-white border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <a
                          href={article.link}
                          className={`block text-lg font-semibold mb-2 transition-colors ${
                            theme === "dark" ? "text-white hover:text-orange-400" : "text-gray-900 hover:text-orange-500"
                          }`}
                        >
                          {article.title}
                        </a>
                        <p className={`text-sm mb-4 line-clamp-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                          {article.summary}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(article.date)}
                          </span>
                          <div className="flex gap-2">
                            {article.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            theme === "dark"
                              ? "bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white"
                              : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </article>
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
            </>
          )}
        </div>
      </div>
    </main>
  )
}

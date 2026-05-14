"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Calendar, Tag, Copy, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

interface Article {
  id: number
  title: string
  link: string
  date: string
  tags: string[]
  summary: string
}

export default function BlogSection() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { language } = useLanguage()
  const { theme } = useTheme()

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
      }
    ]
    setArticles(mockArticles)
    setLoading(false)
  }, [language])

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

  const copyToClipboard = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section id="blog" className="py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-medium tracking-wide mb-4 text-orange-400">
            {language === "zh" ? "深度思考" : "Deep Insights"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "方法论" : "Methodology"}
          </h2>
          <p className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {language === "zh" ? "分享产品设计、AI技术与跨境业务的思考与实践" : "Sharing thoughts and practices on product design, AI technology and cross-border business"}
          </p>
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
          <div className="space-y-4">
            {articles.map((article) => (
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
                    <button
                      onClick={() => copyToClipboard(article.link, article.id)}
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                      }`}
                      title={language === "zh" ? "复制链接" : "Copy link"}
                    >
                      {copiedId === article.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white"
                          : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                      }`}
                      title={language === "zh" ? "在新窗口打开" : "Open in new tab"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
            theme === "dark"
              ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400"
              : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
          }`}>
            {language === "zh" ? "查看更多文章" : "View More Articles"}
            <ExternalLink className="w-5 h-5 inline-block ml-2" />
          </button>
        </div>
      </div>
    </section>
  )
}
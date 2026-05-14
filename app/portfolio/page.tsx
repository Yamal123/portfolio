"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, CheckCircle, Zap, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function PortfolioPage() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const projects: Project[] = [
    {
      id: 1,
      emoji: "🤖",
      category: language === "zh" ? "AI Agent" : "AI Agent",
      title: language === "zh" ? "兔智星智能助手" : "Tuzhixing AI Assistant",
      problem: language === "zh" ? "巴西市场客服效率低下，多语言沟通困难" : "Low customer service efficiency in Brazilian market, multi-language communication challenges",
      action: language === "zh" ? "基于Dify+GPT-4o构建智能客服系统，集成RAG知识库" : "Built AI customer service system based on Dify+GPT-4o, integrated RAG knowledge base",
      result: language === "zh" ? "问答准确率88%，客服效率提升3倍" : "88% Q&A accuracy, 3x efficiency improvement",
      tags: ["Dify", "GPT-4o", "RAG", "多语言"],
      image: "/images/portfolio/betrustyportada.png"
    },
    {
      id: 2,
      emoji: "🚚",
      category: language === "zh" ? "跨境供应链" : "Cross-border Supply Chain",
      title: language === "zh" ? "极兔物流AI系统" : "J&T AI Logistics System",
      problem: language === "zh" ? "跨境物流追踪复杂，异常处理滞后" : "Complex cross-border logistics tracking, delayed exception handling",
      action: language === "zh" ? "设计Multi-Agent协作系统，实时追踪+智能预警" : "Designed Multi-Agent collaboration system with real-time tracking and intelligent alerts",
      result: language === "zh" ? "工单处理效率提升40%，异常响应时间缩短60%" : "40% efficiency improvement, 60% faster exception response",
      tags: ["Multi-Agent", "物流", "自动化"],
      image: "/images/portfolio/ownomad-portada.png"
    },
    {
      id: 3,
      emoji: "🌍",
      category: language === "zh" ? "国际化产品" : "International",
      title: language === "zh" ? "中东物流平台" : "Middle East Logistics Platform",
      problem: language === "zh" ? "阿联酋、沙特、科威特等多国合规要求复杂" : "Complex compliance requirements across UAE, Saudi Arabia, Kuwait",
      action: language === "zh" ? "构建统一物流中台，适配各国法规差异" : "Built unified logistics platform adapting to regional regulatory differences",
      result: language === "zh" ? "支持8个国家/地区，合规通过率99.5%" : "Supports 8 countries/regions, 99.5% compliance rate",
      tags: ["国际化", "合规", "中台"],
      image: "/images/portfolio/glocalportada.png"
    },
    {
      id: 4,
      emoji: "🌊",
      category: language === "zh" ? "ESG公益" : "ESG & Social Good",
      title: language === "zh" ? "海好有你" : "Ocean Care Platform",
      problem: language === "zh" ? "海洋生态治理缺乏数字化手段，公众参与度低" : "Lack of digital tools for marine ecosystem management, low public engagement",
      action: language === "zh" ? "打造海洋生态治理数字化平台，连接政府、企业与公众" : "Built marine ecosystem digital platform connecting government, enterprises and public",
      result: language === "zh" ? "浙江省共同富裕最佳实践案例，覆盖10万+用户" : "Zhejiang Province best practice, 100K+ users",
      tags: ["ESG", "公益", "数字化"],
      image: "/images/portfolio/snetportada.png"
    },
    {
      id: 5,
      emoji: "💬",
      category: language === "zh" ? "意图识别" : "Intent Recognition",
      title: language === "zh" ? "智能对话系统" : "Smart Dialogue System",
      problem: language === "zh" ? "用户意图识别准确率低，多轮对话能力不足" : "Low intent recognition accuracy, insufficient multi-turn dialogue capability",
      action: language === "zh" ? "结合LLM与传统NLP，构建混合意图识别模型" : "Combined LLM with traditional NLP for hybrid intent recognition",
      result: language === "zh" ? "意图识别准确率提升至92%，用户满意度提升25%" : "92% intent recognition accuracy, 25% user satisfaction improvement",
      tags: ["NLP", "LLM", "对话系统"],
      image: "/images/portfolio/c2tportada.png"
    },
    {
      id: 6,
      emoji: "📦",
      category: language === "zh" ? "供应链管理" : "Supply Chain",
      title: language === "zh" ? "跨境仓储管理系统" : "Cross-border Warehouse System",
      problem: language === "zh" ? "库存周转慢，缺货与积压并存" : "Slow inventory turnover, stockouts and overstock coexist",
      action: language === "zh" ? "基于AI预测的智能库存管理，动态补货策略" : "AI-based predictive inventory management with dynamic replenishment",
      result: language === "zh" ? "库存周转率提升50%，缺货率降低30%" : "50% inventory turnover improvement, 30% stockout reduction",
      tags: ["库存管理", "AI预测", "供应链"],
      image: "/images/portfolio/eluterportada.png"
    },
    {
      id: 7,
      emoji: "🎯",
      category: language === "zh" ? "用户增长" : "User Growth",
      title: language === "zh" ? "社交电商增长引擎" : "Social E-commerce Growth Engine",
      problem: language === "zh" ? "用户获取成本高，留存率低" : "High user acquisition cost, low retention rate",
      action: language === "zh" ? "设计裂变传播机制，构建用户成长体系" : "Designed viral growth mechanism, built user growth system",
      result: language === "zh" ? "用户量增长5倍，次日留存提升40%" : "5x user growth, 40% improvement in day-2 retention",
      tags: ["增长黑客", "社交电商", "用户运营"],
      image: "/images/portfolio/baiaportada.png"
    },
    {
      id: 8,
      emoji: "📊",
      category: language === "zh" ? "数据分析" : "Data Analytics",
      title: language === "zh" ? "智能数据分析平台" : "Smart Data Analytics Platform",
      problem: language === "zh" ? "数据分散，分析效率低" : "Data scattered, low analysis efficiency",
      action: language === "zh" ? "构建统一数据中台，支持多维度分析" : "Built unified data platform, support multi-dimensional analysis",
      result: language === "zh" ? "分析效率提升6倍，决策周期缩短70%" : "6x efficiency improvement, 70% reduction in decision cycle",
      tags: ["数据中台", "BI", "数据可视化"],
      image: "/images/portfolio/nerdconfportada.png"
    },
    {
      id: 9,
      emoji: "🔐",
      category: language === "zh" ? "金融科技" : "FinTech",
      title: language === "zh" ? "智能风控系统" : "Smart Risk Control System",
      problem: language === "zh" ? "人工审核效率低，风控识别准确率不高" : "Low manual review efficiency, low risk identification accuracy",
      action: language === "zh" ? "基于机器学习构建智能风控模型" : "Built smart risk control model based on machine learning",
      result: language === "zh" ? "风控准确率提升至95%，审核效率提升8倍" : "95% risk control accuracy, 8x review efficiency improvement",
      tags: ["风控", "机器学习", "金融"],
      image: "/images/portfolio/prutopiaportada.png"
    }
  ]

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects
    const query = searchQuery.toLowerCase()
    return projects.filter(project => 
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.tags.some(tag => tag.toLowerCase().includes(query)) ||
      project.problem.toLowerCase().includes(query)
    )
  }, [projects, searchQuery, language])

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage)
  const currentProjects = filteredProjects.slice(
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
              {language === "zh" ? "作品集" : "Portfolio"}
            </h1>
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {language === "zh" ? "深耕跨境供应链与AI领域，用产品思维解决真实业务问题" : "Deep expertise in cross-border supply chain and AI, solving real business problems with product thinking"}
            </p>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentProjects.map((project) => (
              <div
                key={project.id}
                className={`group rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                    : "bg-white border border-gray-200 hover:border-orange-300"
                } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2`}
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

                  <div className="flex flex-wrap gap-2">
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
                </div>
              </div>
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

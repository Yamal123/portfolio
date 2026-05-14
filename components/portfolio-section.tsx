"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"

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
    }
  ]

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-medium tracking-wide mb-4 text-orange-400">
            {language === "zh" ? "精选项目" : "Featured Projects"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "作品集" : "Portfolio"}
          </h2>
          <p className={`max-w-2xl mx-auto ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {language === "zh" ? "深耕跨境供应链与AI领域，用产品思维解决真实业务问题" : "Deep expertise in cross-border supply chain and AI, solving real business problems with product thinking"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
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

                        <Link
                    href="/portfolio"
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
                  </Link>
              </div>
            </div>
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
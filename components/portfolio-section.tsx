"use client"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight } from "lucide-react"

export default function PortfolioSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const projects = [
    {
      title: language === "zh" ? "兔智星智能助手" : "Tu Zhi Xing AI",
      category: language === "zh" ? "AI 助手" : "AI Assistant",
      description: language === "zh" ? "基于Dify+GPT-4o的巴西市场智能助手，问答准确率88%" : "Dify+GPT-4o based Brazil market intelligent assistant, 88% answer accuracy",
      tags: ["Dify", "GPT-4o", "RAG"]
    },
    {
      title: language === "zh" ? "极兔AI客服" : "Jitu AI CS",
      category: language === "zh" ? "企业级应用" : "Enterprise App",
      description: language === "zh" ? "Multi-Agent协作系统，工单处理效率提升40%" : "Multi-Agent collaboration system, 40% improvement in ticket efficiency",
      tags: ["Multi-Agent", "Enterprise", "Automation"]
    },
    {
      title: language === "zh" ? "中东物流系统" : "Middle East Logistics",
      category: language === "zh" ? "国际化产品" : "Global Product",
      description: language === "zh" ? "适配阿联酋、沙特、科威特的复杂物流需求" : "Complex logistics requirements adapted for UAE, KSA, Kuwait",
      tags: ["International", "Logistics", "Compliance"]
    },
    {
      title: language === "zh" ? "海好有你" : "Hai Hao You Ni",
      category: language === "zh" ? "社会公益" : "Social Good",
      description: language === "zh" ? "海洋生态治理数字化平台，浙江省共同富裕最佳实践" : "Marine ecological governance digital platform, Zhejiang Common Prosperity Best Practice",
      tags: ["ESG", "Social", "Digital"]
    }
  ]

  return (
    <section id="portfolio" className={`py-24 relative ${
      theme === "dark" ? "bg-black" : "bg-white"
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-medium tracking-wide mb-4 ${
            theme === "dark" ? "text-orange-400" : "text-orange-500"
          }`}>
            {language === "zh" ? "我的作品" : "My Work"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {language === "zh" ? "来看看我的项目" : "Let's look at my Portfolio"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`group rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/50"
                  : "bg-white border border-gray-200 hover:border-orange-400"
              } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2`}
            >
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">{index === 0 ? "🐰" : index === 1 ? "🚚" : index === 2 ? "🌍" : "🌊"}</div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                  <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-600 hover:scale-105 active:scale-95">
                    {language === "zh" ? "查看详情" : "View Project"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <p className="text-orange-400 font-medium text-sm mb-2">{project.category}</p>
                <h3 className={`text-2xl font-bold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{project.title}</h3>
                <p className={`mb-6 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`px-3 py-1 rounded-full text-xs ${
                        theme === "dark"
                          ? "bg-gray-800 text-gray-400"
                          : "bg-gray-100 text-gray-600"
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
      </div>
    </section>
  )
}

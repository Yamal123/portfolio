"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Sparkles, Zap, Database, Palette, Wand2, Globe } from "lucide-react"

export default function SkillsSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const skills = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: language === "zh" ? "AI 产品规划" : "AI Product Planning",
      description: language === "zh" ? "从0到1构建AI驱动产品的完整方案" : "End-to-end AI-driven product development",
      tags: ["Strategy", "Roadmap", "Research"]
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: language === "zh" ? "智能助手开发" : "Intelligent Assistant",
      description: language === "zh" ? "基于大模型的智能对话系统设计与实现" : "Design and implement LLM-based conversation systems",
      tags: ["LLM", "RAG", "Agents"]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: language === "zh" ? "数据产品设计" : "Data Product Design",
      description: language === "zh" ? "数据驱动的产品迭代与分析" : "Data-driven product iteration and analysis",
      tags: ["Analytics", "Dashboard", "Insights"]
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: language === "zh" ? "产品体验设计" : "Product Experience",
      description: language === "zh" ? "用户体验优化与界面设计" : "User experience optimization and interface design",
      tags: ["UI/UX", "Design", "Usability"]
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: language === "zh" ? "AI 工具链" : "AI Toolchain",
      description: language === "zh" ? "AI开发工具链与工作流优化" : "AI development toolchain and workflow optimization",
      tags: ["Automation", "Workflow", "Tools"]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: language === "zh" ? "国际化产品" : "International Products",
      description: language === "zh" ? "多语言与跨文化产品设计" : "Multilingual and cross-cultural product design",
      tags: ["Global", "Localization", "Multilingual"]
    }
  ]

  return (
    <section id="skills" className={`py-24 relative ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-medium tracking-wide mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
            {language === "zh" ? "专业能力" : "My Skills"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "擅长领域" : "Areas of Expertise"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`group rounded-3xl p-8 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/50"
                  : "bg-white border border-gray-200 hover:border-orange-400"
              } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 cursor-pointer`}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {skill.icon}
              </div>

              <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                {skill.title}
              </h3>

              <p className={`mb-6 leading-relaxed ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {skill.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className={`px-3 py-1 rounded-full text-xs ${
                      theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
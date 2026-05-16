"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Mail, Linkedin, MessageCircle } from "lucide-react"

export default function AboutSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [hoveredContact, setHoveredContact] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)

  const stats = [
    { value: "2+", label: language === "zh" ? "年经验" : "Years Exp" },
    { value: "10+", label: language === "zh" ? "成功项目" : "Projects" },
    { value: "88%", label: language === "zh" ? "解决率" : "Resolution Rate" },
    { value: "40%", label: language === "zh" ? "效率提升" : "Efficiency Gain" },
  ]

  const skills = [
    { name: "AI Agent", level: 95 },
    { name: "RAG", level: 90 },
    { name: "LLM", level: 88 },
    { name: "意图识别", level: 85 },
    { name: "跨境供应链", level: 92 },
    { name: "产品设计", level: 88 },
    { name: "数据分析", level: 82 },
    { name: "项目管理", level: 85 },
  ]

  return (
    <section id="about" className="py-16 sm:py-24 relative overflow-hidden" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute top-0 left-0 w-full h-px ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
            {language === "zh" ? "关于我" : "About Me"}
          </p>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "PM 思钱想厚" : "Professional Profile"}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 sm:mb-20">
          <div className="relative max-w-sm mx-auto lg:mx-0">
            <div className="absolute -top-4 sm:-top-8 -left-4 sm:-left-8 w-full h-full border-2 border-orange-500/20 rounded-[2rem] sm:rounded-[3rem]"></div>
            <div className={`absolute -bottom-4 sm:-bottom-8 -right-4 sm:-right-8 w-full h-full border-2 rounded-[2rem] sm:rounded-[3rem] ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}></div>
            
            <div className={`relative w-full aspect-square rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}>
              <Image
                src="/images/profile-avatar.png"
                alt="Yu Meng"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" 
                ? "拥有2年AI产品经理实战经验，深度理解LLM、RAG、Agent技术原理，主导过基于Dify的企业级大模型应用从0到1落地。" 
                : "2 years of AI Product Manager experience, deep understanding of LLM, RAG, and Agent technologies, led enterprise-grade AI applications from 0 to 1 based on Dify."}
            </p>

            <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" 
                ? "具备国际化产品视野，有中东、拉美地区产品经验，能打造可复制的海外AI产品方案。热爱摄影、旅行与美食，相信好的产品源于对生活的深度观察。" 
                : "International product perspective with Middle East and Latin America experience, able to build replicable overseas AI product solutions. Passionate about photography, travel and food, believing great products come from deep observation of life."}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200"
                }`}>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">{stat.value}</div>
                  <div className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16 sm:mb-20">
          <h3 className={`text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "技能标签" : "Skills"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {skills.map((skill, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                    : "bg-white border border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    {skill.name}
                  </span>
                  <span className={`text-sm ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>{skill.level}%</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${
                  theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-2xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "联系方式" : "Contact"}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:yumeng@aipmym.com"
              className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                theme === "dark" ? "bg-gray-900 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"
              }`}
              onMouseEnter={() => setHoveredContact("email")}
              onMouseLeave={() => setHoveredContact(null)}
            >
              <Mail className={`w-6 h-6 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`} />
              {hoveredContact === "email" && (
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                  yumeng@aipmym.com
                </div>
              )}
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                theme === "dark" ? "bg-gray-900 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"
              }`}
              onMouseEnter={() => setHoveredContact("linkedin")}
              onMouseLeave={() => setHoveredContact(null)}
            >
              <Linkedin className={`w-6 h-6 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`} />
              {hoveredContact === "linkedin" && (
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                  LinkedIn
                </div>
              )}
            </a>

            <div className="relative">
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className={`group relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  theme === "dark" ? "bg-gray-900 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"
                }`}
                onMouseEnter={() => setHoveredContact("wechat")}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <MessageCircle className={`w-6 h-6 ${theme === "dark" ? "text-gray-400 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`} />
                {hoveredContact === "wechat" && !showQRCode && (
                  <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                    {language === "zh" ? "微信" : "WeChat"}
                  </div>
                )}
              </button>

              {showQRCode && (
                <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl border border-gray-200 z-50">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📱</span>
                  </div>
                  <p className="text-center text-xs text-gray-600 mt-2">
                    {language === "zh" ? "微信二维码" : "WeChat QR Code"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

export default function AboutSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const stats = [
    { value: "2+", label: language === "zh" ? "年经验" : "Years Exp" },
    { value: "10+", label: language === "zh" ? "成功项目" : "Projects" },
    { value: "88%", label: language === "zh" ? "解决率" : "Resolution Rate" },
    { value: "40%", label: language === "zh" ? "效率提升" : "Efficiency Gain" },
  ]

  return (
    <section id="about" className={`py-24 relative ${theme === "dark" ? "bg-black" : "bg-gray-50"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Avatar */}
          <div className="relative">
            <div className="absolute -top-8 -left-8 w-full h-full border-2 border-orange-500/20 rounded-[3rem]"></div>
            <div className={`absolute -bottom-8 -right-8 w-full h-full border-2 rounded-[3rem] ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}></div>
            
            <div className={`relative w-full aspect-square rounded-[2.5rem] overflow-hidden border ${
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

          {/* Right - Content */}
          <div className="space-y-8">
            <div>
              <p className={`font-medium tracking-wide mb-4 ${
                theme === "dark" ? "text-orange-400" : "text-orange-500"
              }`}>
                {language === "zh" ? "关于我" : "About Me"}
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {language === "zh" ? "为什么雇用我？" : "Why Hire Me?"}
              </h2>
            </div>

            <p className={`text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" 
                ? "拥有2年AI产品经理实战经验，深度理解LLM、RAG、Agent技术原理，主导过基于Dify的企业级大模型应用从0到1落地。" 
                : "2 years of AI Product Manager experience, deep understanding of LLM, RAG, and Agent technologies, led enterprise-grade AI applications from 0 to 1 based on Dify."}
            </p>

            <p className={`text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" 
                ? "具备国际化产品视野，有中东、拉美地区产品经验，能打造可复制的海外AI产品方案。" 
                : "International product perspective with Middle East and Latin America experience, able to build replicable overseas AI product solutions."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              {stats.map((stat, index) => (
                <div key={index} className={`rounded-2xl p-6 text-center ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800"
                    : "bg-white border border-gray-200"
                }`}>
                  <div className="text-4xl font-bold text-orange-400 mb-2">{stat.value}</div>
                  <div className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105"
            >
              {language === "zh" ? "开始合作" : "Let's Work Together"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import useSWR from "swr"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Sparkles, Zap, Database, Palette, Wand2, Globe, Loader2 } from "lucide-react"
import { fetchAPI } from "@/lib/api/client"
import { adaptSkills } from "@/lib/api/adapter"

const skillIcons = [Sparkles, Zap, Database, Palette, Wand2, Globe]

export default function SkillsSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const { data: skills, isLoading, error } = useSWR(
    '/api/public/skills',
    (url) => fetchAPI<any[]>(url).then(adaptSkills)
  )

  if (isLoading) {
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
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-8 h-8 animate-spin ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`} />
          </div>
        </div>
      </section>
    )
  }

  if (error || !skills) {
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
          <div className="text-center py-12">
            <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {language === "zh" ? "加载技能失败，请稍后重试" : "Failed to load skills, please try again later"}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const displaySkills = skills.slice(0, 6) // 显示前6个技能

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
          {displaySkills.map((skill, index) => {
            const IconComponent = skillIcons[index % skillIcons.length]
            return (
              <div
                key={skill.name[language === "zh" ? "zh" : "en"]}
                className={`group rounded-3xl p-8 transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/50"
                    : "bg-white border border-gray-200 hover:border-orange-400"
                } hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 cursor-pointer`}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <IconComponent className="w-6 h-6" />
                </div>

                <h3 className={`text-xl font-bold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {skill.name[language === "zh" ? "zh" : "en"]}
                </h3>

                <div className="mb-4">
                  <div className={`flex items-center justify-between mb-2`}>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {language === "zh" ? "熟练度" : "Proficiency"}
                    </span>
                    <span className={`text-sm font-medium ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
                      {skill.level}%
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}>
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {skill.category}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
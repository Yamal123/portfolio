"use client"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function ExperienceSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const experiences = [
    {
      company: language === "zh" ? "极兔速递" : "Jitu Express",
      period: "2023 - Present",
      location: language === "zh" ? "上海" : "Shanghai",
      role: language === "zh" ? "AI 客服产品经理" : "AI Customer Service PM",
      description: language === "zh" ? "基于Dify的AI Agent系统，AI解决率88%，工单处理效率提升40%" : "Dify-based AI Agent system, 88% AI resolution rate, 40% improvement in ticket processing efficiency"
    },
    {
      company: language === "zh" ? "浙江蓝景科技" : "Zhejiang Lanjing Tech",
      period: "2021 - 2023",
      location: language === "zh" ? "杭州" : "Hangzhou",
      role: language === "zh" ? "供应链产品经理" : "Supply Chain PM",
      description: language === "zh" ? "WMS/TMS/OMS系统从0到1落地" : "WMS/TMS/OMS system from 0 to 1"
    },
    {
      company: language === "zh" ? "杭州微未计算机" : "Hangzhou Weiwei Computer",
      period: "2021",
      location: language === "zh" ? "杭州" : "Hangzhou",
      role: language === "zh" ? "AI 产品经理" : "AI Product Manager",
      description: language === "zh" ? "NLP文字校对SaaS，短视频舆情监测平台" : "NLP text proofreading SaaS, short video public opinion monitoring platform"
    }
  ]

  return (
    <section id="experience" className={`py-24 relative ${
      theme === "dark" ? "bg-black" : "bg-white"
    }`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className={`font-medium tracking-wide mb-4 ${
            theme === "dark" ? "text-orange-400" : "text-orange-500"
          }`}>
            {language === "zh" ? "职业经历" : "My Journey"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {language === "zh" ? "工作经历" : "Work Experience"}
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {experiences.map((exp, index) => {
            const { ref, isVisible } = useScrollAnimation()
            return (
              <div key={index} ref={ref} className="group">
                {/* Timeline Line */}
                {index < experiences.length - 1 && (
                  <div className={`absolute left-6 top-24 w-0.5 h-full transition-all duration-700 ${
                    theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                  } ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: `${index * 200}ms` }}></div>
                )}
                
                <div className="flex gap-6 relative">
                  {/* Timeline Dot */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 z-10 transition-all duration-500 ${
                    isVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-75 -translate-x-4"
                  }`} style={{ transitionDelay: `${index * 200 + 100}ms` }}>
                    <span className="text-2xl">{index + 1}</span>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 rounded-2xl p-8 transition-all duration-500 ${
                    theme === "dark"
                      ? "bg-gray-900/50 border border-gray-800"
                      : "bg-gray-50 border border-gray-200"
                  } ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"} group-hover:border-orange-500/30`} style={{ transitionDelay: `${index * 200 + 200}ms` }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className={`text-2xl font-bold mb-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}>{exp.role}</h3>
                        <p className="text-orange-400 font-medium">{exp.company}</p>
                      </div>
                      <div className="mt-2 md:mt-0 md:text-right">
                        <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{exp.period}</p>
                        <p className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{exp.location}</p>
                      </div>
                    </div>
                    <p className={`leading-relaxed ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}>{exp.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

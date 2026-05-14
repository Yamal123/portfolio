"use client"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

export default function TestimonialsSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()

  const testimonials = [
    {
      name: language === "zh" ? "李总监" : "Director Li",
      role: language === "zh" ? "客服中心负责人" : "Customer Service Director",
      company: "Jitu Express",
      content: language === "zh" ? "余猛主导的AI客服系统上线后，我们的人工咨询量减少了30%，用户满意度大幅提升。" : "After Yu Meng's AI customer service system went live, our manual inquiries decreased by 30%, and user satisfaction improved significantly."
    },
    {
      name: language === "zh" ? "王经理" : "Manager Wang",
      role: language === "zh" ? "产品总监" : "Product Director",
      company: "Lanjing Tech",
      content: language === "zh" ? "他的数据驱动产品决策方式让我们的产品迭代效率提升了40%，非常专业。" : "His data-driven product decision approach improved our product iteration efficiency by 40%, very professional."
    },
    {
      name: language === "zh" ? "陈总" : "VP Chen",
      role: language === "zh" ? "业务负责人" : "Business Head",
      company: "International Division",
      content: language === "zh" ? "中东业务系统的成功落地，完全体现了他的国际化产品视野和执行力。" : "The successful implementation of the Middle East business system fully demonstrated his international product perspective and execution ability."
    }
  ]

  return (
    <section className={`py-24 relative ${
      theme === "dark" ? "bg-black" : "bg-gray-50"
    }`}>
      <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className={`font-medium tracking-wide mb-4 ${
            theme === "dark" ? "text-orange-400" : "text-orange-500"
          }`}>
            {language === "zh" ? "客户评价" : "Testimonials"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {language === "zh" ? "他们怎么说" : "What They Say"}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                  : "bg-white border border-gray-200 hover:border-orange-400/30"
              }`}
            >
              <div className="text-4xl mb-6">"</div>
              <p className={`mb-8 leading-relaxed ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
                {testimonial.content}
              </p>
              <div className={`border-t pt-6 ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              }`}>
                <div className={`font-bold text-lg ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>{testimonial.name}</div>
                <div className="text-orange-400">{testimonial.role}</div>
                <div className={`text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>{testimonial.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useState } from "react"
import { Check, Copy, Phone, Mail, Send, Loader2 } from "lucide-react"

export default function Footer() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [copiedPhone, setCopiedPhone] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("15690630301")
    setCopiedPhone(true)
    setTimeout(() => setCopiedPhone(false), 3000)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("yumengfine@163.com")
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert(language === "zh" ? "感谢您的联系！我会尽快回复。" : "Thank you for your message! I'll get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  return (
    <footer id="contact" className={`py-24 relative ${
      theme === "dark" ? "bg-black" : "bg-white"
    }`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-orange-500/10"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <p className={`font-medium tracking-wide mb-4 ${
            theme === "dark" ? "text-orange-400" : "text-orange-500"
          }`}>
            {language === "zh" ? "联系我" : "Contact"}
          </p>
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {language === "zh" ? "有一个很棒的项目想法？" : "Have an Awesome Project Idea?"}
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {language === "zh" ? "让我们一起把它变为现实" : "Let's talk about it"}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Contact Info */}
          <div className="space-y-8">
            <div className={`rounded-3xl p-8 flex items-center gap-6 transition-all duration-300 group cursor-pointer ${
              theme === "dark"
                ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                : "bg-gray-50 border border-gray-200 hover:border-orange-400/30"
            }`} onClick={handleCopyPhone}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className={`text-sm mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>{language === "zh" ? "电话" : "Phone"}</p>
                <p className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>15690630301</p>
              </div>
              {copiedPhone ? <Check className="w-5 h-5 text-green-500" /> : <Copy className={`w-5 h-5 ${
                theme === "dark" ? "text-gray-400 group-hover:text-orange-400" : "text-gray-500 group-hover:text-orange-500"
              }`} />}
            </div>

            <div className={`rounded-3xl p-8 flex items-center gap-6 transition-all duration-300 group cursor-pointer ${
              theme === "dark"
                ? "bg-gray-900/50 border border-gray-800 hover:border-orange-500/30"
                : "bg-gray-50 border border-gray-200 hover:border-orange-400/30"
            }`} onClick={handleCopyEmail}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className={`text-sm mb-1 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}>{language === "zh" ? "邮箱" : "Email"}</p>
                <p className={`text-xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}>yumengfine@163.com</p>
              </div>
              {copiedEmail ? <Check className="w-5 h-5 text-green-500" /> : <Copy className={`w-5 h-5 ${
                theme === "dark" ? "text-gray-400 group-hover:text-orange-400" : "text-gray-500 group-hover:text-orange-500"
              }`} />}
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className={`rounded-3xl p-8 ${
            theme === "dark"
              ? "bg-gray-900/50 border border-gray-800"
              : "bg-gray-50 border border-gray-200"
          }`}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm mb-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>{language === "zh" ? "姓名" : "Name"}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                      : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                  }`}
                  placeholder={language === "zh" ? "您的姓名" : "Your name"}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>{language === "zh" ? "邮箱" : "Email"}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                      : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                  }`}
                  placeholder={language === "zh" ? "您的邮箱" : "Your email"}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm mb-2 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>{language === "zh" ? "消息" : "Message"}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className={`w-full px-6 py-4 rounded-2xl focus:outline-none transition-all duration-300 h-32 resize-none ${
                    theme === "dark"
                      ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                      : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                  }`}
                  placeholder={language === "zh" ? "您想说什么？" : "What would you like to say?"}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed opacity-70"
                    : "bg-orange-500 hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98]"
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === "zh" ? "发送中..." : "Sending..."}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {language === "zh" ? "发送消息" : "Send Message"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className={`mt-24 pt-12 border-t text-center ${
          theme === "dark" ? "border-gray-800" : "border-gray-200"
        }`}>
          <p className={`mb-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            {language === "zh" ? "用 ❤️ 和 AI 构建" : "Built with ❤️ and AI"}
          </p>
          <p className={theme === "dark" ? "text-gray-500" : "text-gray-500"} className="text-sm">
            © {new Date().getFullYear()} Yu Meng. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

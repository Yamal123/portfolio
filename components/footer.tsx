"use client"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { Send, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default function Footer() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientInfo, setClientInfo] = useState({ ip: "", device: "" })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const getClientInfo = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        setClientInfo(prev => ({ ...prev, ip: ipData.ip || 'Unknown' }))
      } catch {
        setClientInfo(prev => ({ ...prev, ip: 'Unknown' }))
      }
      
      const device = /Mobile|Android|iOS|iPhone|iPad|iPod/.test(navigator.userAgent) 
        ? 'Mobile' 
        : 'Desktop'
      setClientInfo(prev => ({ ...prev, device }))
    }
    getClientInfo()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.contact.trim()) {
      setToast({ message: language === "zh" ? "请填写联系方式" : "Please fill in contact information", type: 'error' })
      return
    }
    
    if (!formData.message.trim()) {
      setToast({ message: language === "zh" ? "请填写备注" : "Please fill in message", type: 'error' })
      return
    }

    setIsSubmitting(true)

    try {
      const message = `
称呼: ${formData.name || '未填写'}
联系方式: ${formData.contact}
备注: ${formData.message}
IP地址: ${clientInfo.ip}
发送设备: ${clientInfo.device}
发送时间: ${new Date().toLocaleString('zh-CN')}
      `.trim()

      const webhookUrl = process.env.NEXT_PUBLIC_FEISHU_WEBHOOK_URL || ''
      if (!webhookUrl) {
        setToast({ message: language === "zh" ? "消息服务未配置，请联系管理员" : "Message service not configured, please contact admin", type: 'error' })
        setIsSubmitting(false)
        return
      }
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          msg_type: 'text',
          content: {
            text: message
          }
        })
      })

      if (response.ok) {
        setToast({ message: language === "zh" ? "感谢您的联系！我会尽快回复。" : "Thank you for your message! I'll get back to you soon.", type: 'success' })
        setFormData({ name: "", contact: "", message: "" })
      } else {
        setToast({ message: language === "zh" ? "发送失败，请稍后重试" : "Failed to send, please try again later", type: 'error' })
      }
    } catch {
      setToast({ message: language === "zh" ? "发送失败，请稍后重试" : "Failed to send, please try again later", type: 'error' })
    }

    setIsSubmitting(false)
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, 1000)
    setFormData({ ...formData, message: value })
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 100)
    setFormData({ ...formData, name: value })
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 100)
    setFormData({ ...formData, contact: value })
  }

  return (
    <>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <footer id="contact" className={`py-16 sm:py-24 relative ${
        theme === "dark" ? "bg-black" : "bg-white"
      }`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-orange-500/10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <p className={`text-sm sm:text-base font-medium tracking-wide mb-3 sm:mb-4 ${
              theme === "dark" ? "text-orange-400" : "text-orange-500"
            }`}>
              {language === "zh" ? "联系我" : "Contact"}
            </p>
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}>
              {language === "zh" ? "有一个很棒的项目想法？" : "Have an Awesome Project Idea?"}
            </h2>
            <p className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" ? "让我们一起把它变为现实" : "Let's talk about it"}
            </p>
          </div>

          {/* Contact Form */}
          <div className="max-w-xl mx-auto">
            <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-8 ${
              theme === "dark"
                ? "bg-gray-900/50 border border-gray-800"
                : "bg-gray-50 border border-gray-200"
            }`}>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className={`block text-xs sm:text-sm mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>{language === "zh" ? "称呼" : "Name"}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    maxLength={100}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                    }`}
                    placeholder={language === "zh" ? "怎么称呼您？" : "How should I address you?"}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>{language === "zh" ? "联系方式" : "Contact"}</label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={handleContactChange}
                    maxLength={100}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                    }`}
                    placeholder={language === "zh" ? "您的邮箱/电话/VX" : "Your email/phone/wechat"}
                    required
                  />
                </div>
                <div className="relative">
                  <label className={`block text-xs sm:text-sm mb-2 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>{language === "zh" ? "备注" : "Message"}</label>
                  <textarea
                    value={formData.message}
                    onChange={handleMessageChange}
                    className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 h-24 sm:h-32 resize-none text-sm sm:text-base ${
                      theme === "dark"
                        ? "bg-black border border-gray-800 text-white focus:border-orange-500"
                        : "bg-white border border-gray-300 text-gray-900 focus:border-orange-500"
                    }`}
                    placeholder={language === "zh" ? "请输入备注内容..." : "Enter your message..."}
                    required
                  />
                  <span className={`absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-xs ${
                    formData.message.length >= 1000 
                      ? "text-red-500" 
                      : theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}>
                    {formData.message.length}/1000
                  </span>
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed opacity-70"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 hover:scale-105"
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      {language === "zh" ? "发送中..." : "Sending..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      {language === "zh" ? "发送消息" : "Send Message"}
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className={`mt-16 sm:mt-24 pt-8 sm:pt-12 border-t text-center ${
            theme === "dark" ? "border-gray-800" : "border-gray-200"
          }`}>
            <p className={`mb-4 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" ? "用 ❤️ 和 AI 构建" : "Built with ❤️ and AI"}
            </p>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Yu Meng. All rights reserved.
            </p>
            <Link href="/admin/login" className="inline-block mt-3 text-xs text-gray-400 hover:text-gray-300 transition-colors">
              后台系统
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

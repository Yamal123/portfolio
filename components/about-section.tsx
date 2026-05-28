"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Mail, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { fetchAPI } from "@/lib/api/client"
import type { ProfileInput } from "@/lib/content/contracts"

export default function AboutSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [hoveredContact, setHoveredContact] = useState<string | null>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const { data: profile } = useSWR<ProfileInput>('/api/public/profile', fetchAPI)

  const stats = [
    { value: `${profile?.yearsOfExperience ?? 0}+`, label: language === "zh" ? "年经验" : "Years Exp" },
    { value: `${profile?.successRate ?? 0}%`, label: language === "zh" ? "解决率" : "Resolution Rate" },
    { value: `${profile?.efficiencyGain ?? 0}%`, label: language === "zh" ? "效率提升" : "Efficiency Gain" },
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
                src={profile?.avatar || "/images/profile-avatar.png"}
                alt={profile?.nickname || "Yu Meng"}
                fill
                className="object-cover"
                priority
                quality={80}
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <p className={`text-sm sm:text-base md:text-lg leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}>
              {language === "zh" ? profile?.bioZh : profile?.bioEn}
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

        <div>
          <h3 className={`text-2xl font-bold mb-8 text-center ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "联系方式" : "Contact"}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.contact.emailDisplayed && <Button
              variant="ghost"
              size="icon"
              asChild
              className={`w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-gray-900 hover:bg-orange-500 text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredContact("email")}
              onMouseLeave={() => setHoveredContact(null)}
            >
              <a href={`mailto:${profile?.contact.email || ''}`}>
                <Mail className="w-6 h-6" />
              </a>
            </Button>}
            {profile?.contact.emailDisplayed && hoveredContact === "email" && (
              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                {profile?.contact.email}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-gray-900 hover:bg-orange-500 text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredContact("linkedin")}
              onMouseLeave={() => setHoveredContact(null)}
            >
              <a href={profile?.contact.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-6 h-6" />
              </a>
            </Button>
            {hoveredContact === "linkedin" && (
              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                LinkedIn
              </div>
            )}

            {profile?.contact.wechatDisplayed && <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQRCode(!showQRCode)}
                className={`w-14 h-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark" ? "bg-gray-900 hover:bg-orange-500 text-gray-400 hover:text-white" : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                onMouseEnter={() => setHoveredContact("wechat")}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <MessageCircle className="w-6 h-6" />
              </Button>
              {hoveredContact === "wechat" && !showQRCode && (
                <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-2 text-xs rounded-lg whitespace-nowrap shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                  {language === "zh" ? "微信" : "WeChat"}
                </div>
              )}
              {showQRCode && (
                <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 bg-white p-3 rounded-xl shadow-2xl border border-gray-200 z-50">
                  {profile.contact.wechatQrcode ? <Image src={profile.contact.wechatQrcode} width={128} height={128} alt="WeChat QR Code" /> : <p className="p-6 text-xs text-gray-500">{profile.contact.wechatId}</p>}
                  <p className="text-center text-xs text-gray-600 mt-2">
                    {language === "zh" ? "微信二维码" : "WeChat QR Code"}
                  </p>
                </div>
              )}
            </div>}
          </div>
        </div>
      </div>
    </section>
  )
}

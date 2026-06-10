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

  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-24" style={{ background: theme === "dark" ? "#000000" : "#ffffff" }}>
      <div className={`absolute left-0 top-0 h-px w-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <p className={`mb-3 text-sm font-medium tracking-wide sm:mb-4 sm:text-base ${theme === "dark" ? "text-orange-400" : "text-orange-500"}`}>
            {language === "zh" ? "关于我" : "About Me"}
          </p>
          <h2 className={`mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "PM 思钱想厚" : "Professional Profile"}
          </h2>
        </div>

        <div className="mb-16 grid items-center gap-8 lg:mb-20 lg:grid-cols-2 lg:gap-16">
          <div className="relative mx-auto max-w-sm lg:mx-0">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-[2rem] border-2 border-orange-500/20 sm:-left-8 sm:-top-8 sm:rounded-[3rem]" />
            <div className={`absolute -bottom-4 -right-4 h-full w-full rounded-[2rem] border-2 sm:-bottom-8 sm:-right-8 sm:rounded-[3rem] ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`} />

            <div className={`relative aspect-square w-full overflow-hidden rounded-[1.5rem] border sm:rounded-[2.5rem] ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
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
            <p className={`text-sm leading-relaxed sm:text-base md:text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {profile?.bioZh || '暂无简介。'}
            </p>
          </div>
        </div>

        <div>
          <h3 className={`mb-8 text-center text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "联系方式" : "Contact"}
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {profile?.contact.emailDisplayed && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`h-14 w-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  theme === "dark" ? "bg-gray-900 text-gray-400 hover:bg-orange-500 hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-500 hover:text-white"
                }`}
                onMouseEnter={() => setHoveredContact("email")}
                onMouseLeave={() => setHoveredContact(null)}
              >
                <a href={`mailto:${profile?.contact.email || ''}`}>
                  <Mail className="h-6 w-6" />
                </a>
              </Button>
            )}
            {profile?.contact.emailDisplayed && hoveredContact === "email" && (
              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                {profile?.contact.email}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              asChild
              className={`h-14 w-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                theme === "dark" ? "bg-gray-900 text-gray-400 hover:bg-orange-500 hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-500 hover:text-white"
              }`}
              onMouseEnter={() => setHoveredContact("linkedin")}
              onMouseLeave={() => setHoveredContact(null)}
            >
              <a href={profile?.contact.linkedin || '#'} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-6 w-6" />
              </a>
            </Button>
            {hoveredContact === "linkedin" && (
              <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                LinkedIn
              </div>
            )}

            {profile?.contact.wechatDisplayed && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQRCode(!showQRCode)}
                  className={`h-14 w-14 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    theme === "dark" ? "bg-gray-900 text-gray-400 hover:bg-orange-500 hover:text-white" : "bg-gray-100 text-gray-600 hover:bg-orange-500 hover:text-white"
                  }`}
                  onMouseEnter={() => setHoveredContact("wechat")}
                  onMouseLeave={() => setHoveredContact(null)}
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
                {hoveredContact === "wechat" && !showQRCode && (
                  <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-lg ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-800 text-white"}`}>
                    {language === "zh" ? "微信" : "WeChat"}
                  </div>
                )}
                {showQRCode && (
                  <div className="absolute -bottom-48 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl">
                    {profile.contact.wechatQrcode ? <Image src={profile.contact.wechatQrcode} width={128} height={128} alt="WeChat QR Code" /> : <p className="p-6 text-xs text-gray-500">{profile.contact.wechatId}</p>}
                    <p className="mt-2 text-center text-xs text-gray-600">
                      {language === "zh" ? "微信二维码" : "WeChat QR Code"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

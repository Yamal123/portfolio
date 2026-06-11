"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import {
  BookOpenText,
  Github,
  Linkedin,
  Mail,
  MessageCircleMore,
  Phone,
  QrCode,
  type LucideIcon,
} from "lucide-react"
import useSWR from "swr"
import { fetchAPI } from "@/lib/api/client"
import type { ProfileInput } from "@/lib/content/contracts"
import { getPublicContact, normalizeExternalContactUrl } from "@/lib/content/contact-utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AboutSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const [wechatOpen, setWechatOpen] = useState(false)
  const { data: profile } = useSWR<ProfileInput>('/api/public/profile', fetchAPI)
  const contact = useMemo(() => (profile ? getPublicContact(profile.contact) : null), [profile])
  const publicContact = contact as NonNullable<typeof contact> | null
  const hasAnyContact = Boolean(
    contact && (contact.email || contact.phone || contact.wechatId || contact.wechatQrcode || contact.github || contact.linkedin || contact.zhihu)
  )

  const contactCards = useMemo(() => {
    if (!contact) return []
    return [
      contact.email && {
        key: 'email',
        label: language === 'zh' ? '邮箱' : 'Email',
        icon: Mail,
        href: `mailto:${contact.email}`,
      },
      contact.phone && {
        key: 'phone',
        label: language === 'zh' ? '电话' : 'Phone',
        icon: Phone,
        href: `tel:${contact.phone}`,
      },
      contact.github && {
        key: 'github',
        label: 'GitHub',
        icon: Github,
        href: normalizeExternalContactUrl(contact.github),
      },
      contact.linkedin && {
        key: 'linkedin',
        label: 'LinkedIn',
        icon: Linkedin,
        href: normalizeExternalContactUrl(contact.linkedin),
      },
      contact.zhihu && {
        key: 'zhihu',
        label: language === 'zh' ? '知乎' : 'Zhihu',
        icon: BookOpenText,
        href: normalizeExternalContactUrl(contact.zhihu),
      },
    ].filter(Boolean) as Array<{
      key: string
      label: string
      icon: LucideIcon
      href: string
    }>
  }, [contact, language])

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

        <div className="relative">
          <h3 className={`mb-8 text-center text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {language === "zh" ? "联系方式" : "Contact"}
          </h3>
          {hasAnyContact ? (
            <TooltipProvider delayDuration={0}>
              <div className="flex flex-wrap justify-center gap-4">
                {contactCards.map(({ key, label, icon: Icon, href }) => (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        aria-label={label}
                        className={`group flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                          theme === "dark"
                            ? "border-gray-800 bg-gray-900 text-gray-300 hover:border-orange-500/40 hover:bg-orange-500 hover:text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{label}</TooltipContent>
                  </Tooltip>
                ))}

                {publicContact && (publicContact.wechatId || publicContact.wechatQrcode) ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setWechatOpen(true)}
                        className={`group flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                          theme === "dark"
                            ? "border-gray-800 bg-gray-900 text-gray-300 hover:border-orange-500/40 hover:bg-orange-500 hover:text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-500 hover:text-white"
                        }`}
                      >
                        {publicContact.wechatQrcode ? <QrCode className="h-6 w-6" /> : <MessageCircleMore className="h-6 w-6" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{language === "zh" ? "微信" : "WeChat"}</TooltipContent>
                  </Tooltip>
                ) : null}
              </div>
            </TooltipProvider>
          ) : (
            <p className={`text-center text-sm ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
              {language === "zh" ? "暂无可展示的联系方式" : "No public contact methods available."}
            </p>
          )}
        </div>
      </div>

      <Dialog open={wechatOpen} onOpenChange={setWechatOpen}>
        <DialogContent className="max-w-sm border-slate-200 bg-white p-0">
          <DialogHeader className="border-b border-slate-100 px-6 py-4">
            <DialogTitle className="text-base font-semibold text-slate-950">
              {language === "zh" ? "微信联系方式" : "WeChat Contact"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {contact?.wechatQrcode
                ? language === "zh"
                  ? "优先展示二维码，扫码即可添加。"
                  : "The QR code is shown first for quick contact."
                : language === "zh"
                  ? "当前仅提供微信 ID。"
                  : "Only the WeChat ID is available right now."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6 py-6">
            {publicContact?.wechatQrcode ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <img
                  src={publicContact.wechatQrcode}
                  alt="WeChat QR Code"
                  className="mx-auto aspect-square w-full max-w-[240px] rounded-xl object-cover"
                />
              </div>
            ) : null}
            {publicContact?.wechatId ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {language === "zh" ? "微信 ID" : "WeChat ID"}
                </p>
                <p className="mt-2 break-all text-base font-semibold text-slate-950">{publicContact.wechatId}</p>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

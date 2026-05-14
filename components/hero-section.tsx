"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, Sparkles, Video, BookOpen, MessageCircle, Github, MessageSquare, Users } from "lucide-react"
import { useState, useEffect, useMemo } from "react"

export default function HeroSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  
  const [titleText1, setTitleText1] = useState("")
  const [titleText2, setTitleText2] = useState("")
  const [descText, setDescText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  const title1 = language === "zh" ? "你好，我是" : "Hello, I'm"
  const title2 = "PM 思钱想厚"
  const description = language === "zh" 
    ? "拥有2年AI产品经验，专注于将AI技术转化为实际业务价值。" 
    : "2 years of AI Product Manager experience, focused on turning AI technology into real business value."

  const colors = [
    "text-orange-400",
    "text-blue-400",
    "text-purple-400",
    "text-green-400",
  ]

  const coloredIndices = useMemo(() => {
    const indices = new Set<number>()
    const maxColored = Math.floor(description.length * 0.3)
    while (indices.size < maxColored) {
      indices.add(Math.floor(Math.random() * description.length))
    }
    return indices
  }, [description])

  useEffect(() => {
    let title1Index = 0
    let title2Index = 0
    let descIndex = 0

    const timer1 = setInterval(() => {
      if (title1Index <= title1.length) {
        setTitleText1(title1.slice(0, title1Index))
        title1Index++
      } else {
        clearInterval(timer1)
      }
    }, 104)

    const timer2 = setInterval(() => {
      if (title2Index <= title2.length) {
        setTitleText2(title2.slice(0, title2Index))
        title2Index++
      } else {
        clearInterval(timer2)
      }
    }, 69)

    const timer3 = setInterval(() => {
      if (descIndex <= description.length) {
        setDescText(description.slice(0, descIndex))
        descIndex++
      } else {
        clearInterval(timer3)
        setShowCursor(true)
      }
    }, 43)

    return () => {
      clearInterval(timer1)
      clearInterval(timer2)
      clearInterval(timer3)
    }
  }, [language, title1, title2, description])

  useEffect(() => {
    if (!showCursor) return
    
    const cursorTimer = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 500)

    return () => clearInterval(cursorTimer)
  }, [showCursor])

  const getCharColor = (index: number) => {
    if (coloredIndices.has(index)) {
      return colors[index % colors.length]
    }
    return theme === "dark" ? "text-gray-400" : "text-gray-600"
  }

  return (
    <section id="home" className={`min-h-screen relative flex items-center pt-20 ${
      theme === "dark" ? "bg-black" : "bg-white"
    } overflow-hidden`}>
      <div className="absolute top-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className={`font-medium tracking-wide min-h-[1.5em] ${
                theme === "dark" ? "text-orange-400" : "text-orange-500"
              }`}>
                {titleText1}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight min-h-[1.2em]">
                {titleText2.split("").map((char, index) => {
                  if (index < 2) {
                    return <span key={index} className="text-orange-400">{char}</span>
                  }
                  return <span key={index} className={theme === "dark" ? "text-white" : "text-gray-900"}>{char}</span>
                })}
              </h1>
            </div>

            <div className={`text-lg md:text-xl max-w-lg leading-relaxed min-h-[4em]`}>
              {descText.split("").map((char, index) => (
                <span key={index} className={getCharColor(index)}>
                  {char}
                </span>
              ))}
              {showCursor && (
                <span 
                  className={`inline-block w-[3px] h-[1.2em] bg-orange-400 ml-1 align-middle ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transition: "opacity 0.1s" }}
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {language === "zh" ? "联系我" : "Contact Me"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 ${
                  theme === "dark"
                    ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400"
                    : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"
                }`}
              >
                {language === "zh" ? "查看项目" : "View Projects"}
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://www.google.com/search?q=Bilibili+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white"
                aria-label="Bilibili"
              >
                <Video className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "Bilibili · @余猛" : "Bilibili · @余猛"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=语雀+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                aria-label="Yuque"
              >
                <BookOpen className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "语雀 · @余猛" : "Yuque · @余猛"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=知乎+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                aria-label="Zhihu"
              >
                <MessageCircle className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "知乎 · @余猛" : "Zhihu · @余猛"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=GitHub+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  GitHub · @余猛
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=微信公众号+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                aria-label="WeChat"
              >
                <MessageSquare className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "微信公众号 · @余猛" : "WeChat · @余猛"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=脉脉+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500 text-gray-300 hover:text-white"
                    : "bg-gray-100 hover:bg-orange-500 text-gray-600 hover:text-white"
                }`}
                aria-label="Maimai"
              >
                <Users className="w-6 h-6" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "脉脉 · @余猛" : "Maimai · @余猛"}
                </div>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className={`absolute -top-10 -right-10 w-full h-full border-2 rounded-[3.5rem] ${
              theme === "dark" ? "border-gray-800" : "border-gray-200"
            }`}></div>
            <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-orange-500/30 rounded-[3.5rem]"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-[4rem] blur-xl"></div>
            
            <div className="relative">
              <div className={`w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-gray-700"
                  : "bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200"
              }`}>
                <Image
                  src="/images/profile-avatar.png"
                  alt="Yu Meng"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
              
              <div className={`absolute -top-4 -right-4 rounded-2xl p-4 shadow-xl ${
                theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{language === "zh" ? "AI 驱动" : "AI Powered"}</div>
                    <div className="text-xs text-gray-500">{language === "zh" ? "产品创新" : "Product Innovation"}</div>
                  </div>
                </div>
              </div>

              <div className={`absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-xl ${
                theme === "dark"
                  ? "bg-gray-900 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">10+</div>
                  <div className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}>
                    {language === "zh" ? "成功项目" : "Projects Completed"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const keywordEmojis: Record<string, string> = {
  "AI Agent": "🤖",
  "AI": "🤖",
  "摄影": "📷",
  "旅行": "✈️",
  "美食": "🍜",
  "产品设计": "🎨",
  "供应链": "📦",
}

export default function HeroSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  
  const [titleText1, setTitleText1] = useState("")
  const [titleText2, setTitleText2] = useState("")
  const [descText, setDescText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [visibleSections, setVisibleSections] = useState<number[]>([])

  const title1 = language === "zh" ? "你好，我是" : "Hello, I'm"
  const title2 = "PM 思钱想厚"
  const description = language === "zh" 
    ? "热爱产品设计与 AI 探索，专注深耕供应链与AI Agent赛道。热爱摄影、旅行与美食，奔赴山海，记录烟火。" 
    : "Passionate about product design and AI exploration, with deep expertise in supply chain and AI Agent. Enjoying photography, travel and food, chasing mountains and seas, recording the warmth of life."

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        setMouseX((e.clientX - rect.left - rect.width / 2) / 20)
        setMouseY((e.clientY - rect.top - rect.height / 2) / 20)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0")
            setTimeout(() => {
              setVisibleSections(prev => [...new Set([...prev, index])])
            }, index * 150)
          }
        })
      },
      { threshold: 0.1 }
    )

    const sections = document.querySelectorAll("[data-index]")
    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  const renderDescriptionWithEmojis = (text: string) => {
    const parts: JSX.Element[] = []
    let lastIndex = 0
    let keyCounter = 0

    Object.keys(keywordEmojis).forEach(keyword => {
      const regex = new RegExp(keyword, "g")
      let match
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${keyCounter++}`}>
              {text.slice(lastIndex, match.index)}
            </span>
          )
        }
        parts.push(
          <span 
            key={`keyword-${keyCounter++}`}
            className="relative group inline-block cursor-help"
          >
            <span className="border-b-2 border-dashed border-orange-400 pb-0.5">
              {keyword}
            </span>
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20 shadow-lg">
              {keywordEmojis[keyword]} {keyword}
            </span>
          </span>
        )
        lastIndex = match.index + keyword.length
      }
    })

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {text.slice(lastIndex)}
        </span>
      )
    }

    return parts.length > 0 ? parts : <span>{text}</span>
  }

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className={`min-h-screen relative flex items-center pt-20 ${theme === "dark" ? "bg-black" : "bg-white"} overflow-hidden`}
    >
      <div 
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl transition-transform duration-300 ease-out"
        style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transition-transform duration-300 ease-out"
        style={{ transform: `translate(${-mouseX * 0.8}px, ${-mouseY * 0.8}px)` }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p 
                data-index="0"
                className={`font-medium tracking-wide min-h-[1.5em] transition-all duration-700 ${theme === "dark" ? "text-orange-400" : "text-orange-500"} ${visibleSections.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {titleText1}
              </p>
              <h1 
                data-index="1"
                className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight min-h-[1.2em] transition-all duration-700 ${visibleSections.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {titleText2.split("").map((char, index) => {
                  if (index < 2) {
                    return <span key={index} className="text-orange-400">{char}</span>
                  }
                  return <span key={index} className={theme === "dark" ? "text-white" : "text-gray-900"}>{char}</span>
                })}
              </h1>
            </div>

            <div 
              data-index="2"
              className={`text-lg md:text-xl max-w-lg leading-relaxed min-h-[8em] transition-all duration-700 ${theme === "dark" ? "text-gray-400" : "text-gray-600"} ${visibleSections.includes(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              {renderDescriptionWithEmojis(descText)}
              {showCursor && (
                <span 
                  className={`inline-block w-[3px] h-[1.2em] bg-orange-400 ml-1 align-middle ${cursorVisible ? "opacity-100" : "opacity-0"}`}
                  style={{ transition: "opacity 0.1s" }}
                />
              )}
            </div>

            <div 
              data-index="3"
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 ${visibleSections.includes(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {language === "zh" ? "联系我" : "Contact Me"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 ${theme === "dark" ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400" : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"}`}
              >
                {language === "zh" ? "查看项目" : "View Projects"}
              </button>
            </div>

            <div 
              data-index="4"
              className={`flex flex-wrap gap-4 transition-all duration-700 ${visibleSections.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <a
                href="https://www.google.com/search?q=GitHub+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="GitHub"
              >
                <Image 
                  src="/images/githubb.svg" 
                  alt="GitHub" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  GitHub · @Yu Meng
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=知乎+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="Zhihu"
              >
                <Image 
                  src="/images/知乎.svg" 
                  alt="Zhihu" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "知乎 · @余猛" : "Zhihu · @Yu Meng"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=脉脉+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="Maimai"
              >
                <Image 
                  src="/images/脉脉.svg" 
                  alt="Maimai" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "脉脉 · @余猛" : "Maimai · @Yu Meng"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=语雀+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="Yuque"
              >
                <Image 
                  src="/images/语雀.svg" 
                  alt="Yuque" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "语雀 · @余猛" : "Yuque · @Yu Meng"}
                </div>
              </a>
              <a
                href="https://www.google.com/search?q=微信公众号+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="WeChat"
              >
                <Image 
                  src="/images/微信公众号.svg" 
                  alt="WeChat" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  {language === "zh" ? "微信公众号 · @余猛" : "WeChat · @Yu Meng"}
                </div>
              </a>
            </div>
          </div>

          <div 
            data-index="5"
            className={`relative transition-all duration-700 ${visibleSections.includes(5) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className={`absolute -top-10 -right-10 w-full h-full border-2 rounded-[3.5rem] ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}></div>
            <div className="absolute -bottom-10 -left-10 w-full h-full border-2 border-orange-500/30 rounded-[3.5rem]"></div>
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-500/10 to-blue-500/10 rounded-[4rem] blur-xl"></div>
            
            <div className="relative">
              <div className={`w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl ${theme === "dark" ? "bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-gray-700" : "bg-gradient-to-br from-orange-100 to-orange-200 border border-orange-200"}`}>
                <Image
                  src="/images/profile-avatar.png"
                  alt="Yu Meng"
                  fill
                  className="object-cover rounded-[3rem]"
                  priority
                />
              </div>
              
              <div className={`absolute -top-4 -right-4 rounded-2xl p-4 shadow-xl ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
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

              <div className={`absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-xl ${theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">10+</div>
                  <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
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
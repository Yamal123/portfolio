"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function HeroSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  
  const [titleText1, setTitleText1] = useState("")
  const [titleText2, setTitleText2] = useState("")
  const [descText, setDescText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const title1 = language === "zh" ? "你好，我是" : "Hello, I'm"
  const title2 = "PM 思钱想厚"
  const description = language === "zh" 
    ? "热爱产品设计与 AI 探索，专注深耕供应链与AI Agent赛道。热爱摄影、旅行与美食，奔赴山海，记录烟火。" 
    : "Passionate about product design and AI exploration, with deep expertise in supply chain and AI Agent. Enjoying photography, travel and food, chasing mountains and seas, recording the warmth of life."

  const keywords = language === "zh" 
    ? ["产品设计", "AI", "探索", "供应链", "AI Agent", "摄影", "旅行", "美食"]
    : ["product design", "AI", "exploration", "supply chain", "AI Agent", "photography", "travel", "food"]

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
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const renderHighlightedText = (text: string) => {
    let result: JSX.Element[] = []
    let lastIndex = 0
    
    keywords.forEach((keyword, idx) => {
      const regex = new RegExp(keyword, 'g')
      let match
      
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          result.push(
            <span key={`text-${idx}-${match.index}`} className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
              {text.slice(lastIndex, match.index)}
            </span>
          )
        }
        
        result.push(
          <span 
            key={`keyword-${idx}-${match.index}`} 
            className={`inline-block transition-all duration-300 cursor-default hover:text-orange-400 hover:-translate-y-0.5 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {keyword}
          </span>
        )
        
        lastIndex = match.index + keyword.length
      }
    })
    
    if (lastIndex < text.length) {
      result.push(
        <span key="text-end" className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
          {text.slice(lastIndex)}
        </span>
      )
    }
    
    if (result.length === 0) {
      return <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{text}</span>
    }
    
    return result
  }

  return (
    <section id="home" className={`min-h-screen relative flex items-center pt-20 ${
      theme === "dark" ? "bg-black" : "bg-white"
    } overflow-hidden`} ref={containerRef}>
      <div 
        className="absolute top-20 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl transition-all duration-500"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`
        }}
      ></div>
      <div 
        className="absolute bottom-20 right-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl transition-all duration-500"
        style={{
          transform: `translate(${(mousePosition.x - 1) * 30}px, ${(mousePosition.y - 1) * 30}px)`
        }}
      ></div>
      
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ opacity: 0.03 }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${theme === "dark" ? "bg-orange-400" : "bg-orange-500"}`}
            style={{
              width: Math.random() * 4 + 1 + "px",
              height: Math.random() * 4 + 1 + "px",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 0.8; }
          }
        `}</style>
      </div>
      
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
              <div className={`flex items-center gap-2 mt-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                <span className="text-sm">AI Product Manager</span>
                <span className="w-1 h-1 rounded-full bg-orange-400 animate-pulse"></span>
                <span className="text-sm">
                  {language === "zh" ? "正在探索" : "Exploring"}
                </span>
                <span 
                  className={`inline-block w-[2px] h-4 bg-orange-400 ${
                    cursorVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transition: "opacity 0.1s" }}
                />
              </div>
            </div>

            <div className={`text-lg md:text-xl max-w-lg leading-relaxed min-h-[8em] whitespace-pre-wrap`}>
              {renderHighlightedText(descText)}
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
                href="https://www.google.com/search?q=GitHub+余猛"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500"
                    : "bg-gray-100 hover:bg-orange-500"
                }`}
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
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500"
                    : "bg-gray-100 hover:bg-orange-500"
                }`}
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
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500"
                    : "bg-gray-100 hover:bg-orange-500"
                }`}
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
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500"
                    : "bg-gray-100 hover:bg-orange-500"
                }`}
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
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-orange-500"
                    : "bg-gray-100 hover:bg-orange-500"
                }`}
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
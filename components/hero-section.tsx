"use client"

import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { ArrowRight, Sparkles } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const keywordEmojis: Record<string, string> = {
  "跨境供应链": "📦",
  "AI Agent": "🤖",
  "AI": "🤖",
  "RAG": "🧠",
  "意图识别": "🎯",
  "摄影": "📷",
  "旅行": "✈️",
  "美食": "🍜",
  "产品设计": "🎨",
  "供应链": "📦",
}

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export default function HeroSection() {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const sectionRef = useRef<HTMLElement>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [particles, setParticles] = useState<Particle[]>([])
  
  const [titleText1, setTitleText1] = useState("")
  const [titleText2, setTitleText2] = useState("")
  const [descText, setDescText] = useState("")
  const [showCursor, setShowCursor] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [visibleSections, setVisibleSections] = useState<number[]>([])

  const title1 = language === "zh" ? "产品经理" : "Product Manager"
  const title2 = language === "zh" ? "跨境供应链 × AI Agent" : "Cross-border Supply Chain × AI Agent"
  const description = language === "zh" 
    ? "深耕跨境供应链与AI Agent赛道，专注RAG与意图识别技术应用。热爱摄影、旅行与美食，奔赴山海，记录烟火。" 
    : "Deep expertise in cross-border supply chain and AI Agent, focusing on RAG and intent recognition applications. Passionate about photography, travel and food."

  useEffect(() => {
    const particlesArray: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particlesArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }
    setParticles(particlesArray)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX) % 100,
        y: (p.y + p.speedY) % 100,
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [])

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
    }, 80)

    const timer2 = setTimeout(() => {
      const interval = setInterval(() => {
        if (title2Index <= title2.length) {
          setTitleText2(title2.slice(0, title2Index))
          title2Index++
        } else {
          clearInterval(interval)
        }
      }, 60)
      return () => clearInterval(interval)
    }, title1.length * 80 + 300)

    const timer3 = setTimeout(() => {
      const interval = setInterval(() => {
        if (descIndex <= description.length) {
          setDescText(description.slice(0, descIndex))
          descIndex++
        } else {
          clearInterval(interval)
          setShowCursor(true)
        }
      }, 40)
      return () => clearInterval(interval)
    }, (title1.length * 80) + (title2.length * 60) + 600)

    return () => {
      clearInterval(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
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
        setMouseX((e.clientX - rect.left - rect.width / 2) / 30)
        setMouseY((e.clientY - rect.top - rect.height / 2) / 30)
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
            <span className="text-orange-400 font-semibold border-b-2 border-dashed border-orange-400 pb-0.5 hover:text-orange-300 transition-colors">
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
      className="min-h-screen relative flex items-center pt-20 overflow-hidden"
      style={{
        background: theme === "dark" 
          ? "linear-gradient(180deg, #1A1A1A 0%, #000000 100%)" 
          : "linear-gradient(180deg, #fafafa 0%, #ffffff 100%)"
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-orange-500"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: theme === "dark" ? particle.opacity * 0.6 : particle.opacity * 0.3,
              transform: `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          />
        ))}
      </div>

      <div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate(${mouseX}px, ${mouseY}px)` }}
      ></div>
      <div 
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl transition-transform duration-500 ease-out"
        style={{ transform: `translate(${-mouseX * 0.8}px, ${-mouseY * 0.8}px)` }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p 
                data-index="0"
                className={`font-medium tracking-wide min-h-[1.5em] transition-all duration-700 text-orange-400 ${visibleSections.includes(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {titleText1}
              </p>
              <h1 
                data-index="1"
                className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight min-h-[1.2em] transition-all duration-700 ${visibleSections.includes(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {titleText2.split("").map((char, index) => (
                  <span 
                    key={index} 
                    className={`inline-block transition-all duration-300 hover:translate-y-[-2px] hover:translate-x-[1px] ${
                      char === "×" 
                        ? "text-gray-500 mx-2" 
                        : theme === "dark" 
                          ? "text-white" 
                          : "text-gray-900"
                    }`}
                  >
                    {char}
                  </span>
                ))}
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
                onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                {language === "zh" ? "联系我" : "Contact Me"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
                className={`px-8 py-4 border rounded-full font-semibold transition-all duration-300 ${theme === "dark" ? "border-gray-700 text-white hover:border-orange-400 hover:text-orange-400" : "border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500"}`}
              >
                {language === "zh" ? "查看作品集" : "View Portfolio"}
              </button>
            </div>

            <div 
              data-index="4"
              className={`flex flex-wrap gap-4 transition-all duration-700 ${visibleSections.includes(4) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <a
                href="https://github.com/Yamal123"
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
                  GitHub
                </div>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="LinkedIn"
              >
                <Image 
                  src="/icons/linkedin.svg" 
                  alt="LinkedIn" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  LinkedIn
                </div>
              </a>
              <a
                href="https://zhihu.com"
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
                  {language === "zh" ? "知乎" : "Zhihu"}
                </div>
              </a>
              <a
                href="https://medium.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${theme === "dark" ? "bg-gray-800 hover:bg-orange-500" : "bg-gray-100 hover:bg-orange-500"}`}
                aria-label="Medium"
              >
                <Image 
                  src="/icons/medium.svg" 
                  alt="Medium" 
                  width={24} 
                  height={24} 
                  className={`w-6 h-6 ${theme === "dark" ? "text-gray-300 group-hover:text-white" : "text-gray-600 group-hover:text-white"}`}
                />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-10 shadow-lg">
                  Medium
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
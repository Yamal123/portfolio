"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon } from "lucide-react"

export default function Navbar() {
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "home", label: language === "zh" ? "首页" : "Home" },
    { id: "skills", label: language === "zh" ? "擅长领域" : "Skills" },
    { id: "projects", label: language === "zh" ? "Vibe Coding项目" : "Vibe Coding" },
    { id: "about", label: language === "zh" ? "关于" : "About" },
  ]

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? (theme === "dark" ? "bg-black/90" : "bg-white/90") + " backdrop-blur-md" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={() => handleNavClick("home")}
          >
            <span className="text-xl font-bold">
              <span className="text-orange-400">PM</span>
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}> 思钱想厚</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`${
                  theme === "dark" ? "text-white/70 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"
                } transition-colors duration-300 font-medium`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              theme === "dark" 
                ? "bg-gray-800 text-orange-400 hover:bg-gray-700"
                : "bg-orange-100 text-gray-700 hover:bg-orange-200"
            }`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden backdrop-blur-md ${
          theme === "dark" ? "bg-black/95" : "bg-white/95"
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left ${
                  theme === "dark" 
                    ? "text-white/70 hover:text-orange-400" 
                    : "text-gray-600 hover:text-orange-500"
                } transition-colors duration-300 py-2 font-medium`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

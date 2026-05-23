"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    { id: "home", label: language === "zh" ? "首页" : "Home", href: null },
    { id: "portfolio", label: language === "zh" ? "作品集" : "Portfolio", href: "/portfolio" },
    { id: "blog", label: language === "zh" ? "方法论" : "Methodology", href: "/blog" },
    { id: "about", label: language === "zh" ? "关于我" : "About", href: null },
  ]

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      })
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
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
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`${
                    theme === "dark" ? "text-white/70 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"
                  } transition-colors duration-300 font-medium`}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`${
                    theme === "dark" ? "text-white/70 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"
                  } transition-colors duration-300 font-medium`}
                >
                  {item.label}
                </button>
              )
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full transition-all duration-300 ${
                theme === "dark" 
                  ? "bg-gray-800 text-orange-400 hover:bg-gray-700"
                  : "bg-orange-100 text-gray-700 hover:bg-orange-200"
              }`}
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden backdrop-blur-md ${
          theme === "dark" ? "bg-black/95" : "bg-white/95"
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
            {navItems.map((item) => (
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left ${
                    theme === "dark" 
                      ? "text-white/70 hover:text-orange-400" 
                      : "text-gray-600 hover:text-orange-500"
                  } transition-colors duration-300 py-2 font-medium`}
                >
                  {item.label}
                </Link>
              ) : (
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
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

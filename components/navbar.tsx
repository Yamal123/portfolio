"use client"

import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  SITE_NAV_ITEMS,
  getNavDestination,
  getNavLabel,
} from "@/lib/site-navigation"

export default function Navbar() {
  const { language } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const handleScrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId)
    if (!element) return false
    window.scrollTo({
      top: Math.max(0, element.offsetTop - 80),
      behavior: "smooth",
    })
    closeMobileMenu()
    return true
  }

  const renderNavItem = (item: (typeof SITE_NAV_ITEMS)[number], isMobile: boolean) => {
    const label = getNavLabel(item, language)
    const destination = getNavDestination(item, isHomePage)
    const baseClass = isMobile
      ? `block w-full text-left transition-colors duration-300 py-2 font-medium ${
          theme === "dark" ? "text-white/70 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"
        }`
      : `transition-colors duration-300 font-medium ${
          theme === "dark" ? "text-white/70 hover:text-orange-400" : "text-gray-600 hover:text-orange-500"
        }`

    if (destination.type === "scroll") {
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => {
            if (!handleScrollToSection(destination.targetId)) {
              window.location.href = item.href
              closeMobileMenu()
            }
          }}
          className={baseClass}
        >
          {label}
        </button>
      )
    }

    return (
      <Link
        key={item.id}
        href={destination.href}
        className={baseClass}
        onClick={closeMobileMenu}
      >
        {label}
      </Link>
    )
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
          <div
            className="cursor-pointer"
            onClick={() => {
              if (!handleScrollToSection("home")) {
                window.location.href = "/"
              }
            }}
          >
            <span className="text-xl font-bold">
              <span className="text-orange-400">PM</span>
              <span className={theme === "dark" ? "text-white" : "text-gray-900"}> 思钱想厚</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {SITE_NAV_ITEMS.map((item) => renderNavItem(item, false))}
          </div>

          <div className="flex items-center gap-2">
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

      {mobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-md ${
            theme === "dark" ? "bg-black/95" : "bg-white/95"
          }`}
        >
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-4">
            {SITE_NAV_ITEMS.map((item) => renderNavItem(item, true))}
          </div>
        </div>
      )}
    </nav>
  )
}

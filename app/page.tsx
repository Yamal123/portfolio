"use client"

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import PortfolioSection from "@/components/portfolio-section"
import BlogSection from "@/components/blog-section"
import AboutSection from "@/components/about-section"
import Footer from "@/components/footer"
import { useTheme } from "@/contexts/theme-context"

export default function Home() {
  const { theme } = useTheme()

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <Navbar />
      <HeroSection />
      <PortfolioSection />
      <BlogSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
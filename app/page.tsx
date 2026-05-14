"use client"

import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import AboutSection from "@/components/about-section"
import Footer from "@/components/footer"
import ScrollFadeWrapper from "@/components/scroll-fade-wrapper"
import { useTheme } from "@/contexts/theme-context"

export default function Home() {
  const { theme } = useTheme()

  return (
    <main className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-white"}`}>
      <Navbar />

      <ScrollFadeWrapper delay={0}>
        <HeroSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={100}>
        <SkillsSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={200}>
        <ProjectsSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={300}>
        <AboutSection />
      </ScrollFadeWrapper>

      <ScrollFadeWrapper delay={400}>
        <Footer />
      </ScrollFadeWrapper>
    </main>
  )
}
"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { ReactNode } from "react"

interface ScrollFadeWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
  animationType?: "fade" | "slide-up" | "slide-left" | "slide-right" | "zoom"
}

export default function ScrollFadeWrapper({ 
  children, 
  delay = 0, 
  className = "",
  animationType = "slide-up"
}: ScrollFadeWrapperProps) {
  const { ref, isVisible } = useScrollAnimation()

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700 ease-out"
    
    switch (animationType) {
      case "fade":
        return `${baseClasses} ${isVisible ? "opacity-100" : "opacity-0"}`
      case "slide-up":
        return `${baseClasses} ${
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10"
        }`
      case "slide-left":
        return `${baseClasses} ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-10"
        }`
      case "slide-right":
        return `${baseClasses} ${
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-10"
        }`
      case "zoom":
        return `${baseClasses} ${
          isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        }`
      default:
        return baseClasses
    }
  }

  return (
    <div ref={ref} className={className}>
      <div
        className={getAnimationClasses()}
        style={{
          transitionDelay: `${delay}ms`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

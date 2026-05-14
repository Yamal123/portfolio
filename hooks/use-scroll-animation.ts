"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollAnimation(options: IntersectionObserverInit = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "-50px",
      }
    )

    const element = ref.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [options])

  return { ref, isVisible }
}
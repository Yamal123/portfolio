'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function sendVisit(pagePath: string, duration: number) {
  try {
    const payload = JSON.stringify({ pagePath, duration: Math.max(0, Math.round(duration / 1000)) })
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/stats', new Blob([payload], { type: 'application/json' }))
      return
    }
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {})
  } catch {
    // Ignore tracking failures
  }
}

export function VisitTracker() {
  const pathname = usePathname()
  const enterAtRef = useRef(Date.now())

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return
    enterAtRef.current = Date.now()
    const onHide = () => sendVisit(pathname, Date.now() - enterAtRef.current)
    window.addEventListener('pagehide', onHide)
    return () => {
      window.removeEventListener('pagehide', onHide)
      onHide()
    }
  }, [pathname])

  return null
}

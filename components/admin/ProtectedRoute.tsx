'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/admin/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, router, pathname])

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

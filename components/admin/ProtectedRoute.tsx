'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/admin/AuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

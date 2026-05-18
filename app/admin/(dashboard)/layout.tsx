'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Spin } from 'antd'
import { useAuth } from '@/contexts/admin/AuthContext'

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setChecked(true)
        if (!isAuthenticated) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`)
        }
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, loading, router, pathname])

  if (loading || !checked) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f2f3f5',
        gap: 16,
      }}>
        <Spin size="large" />
        <span style={{ color: '#86909c', fontSize: 14 }}>加载中...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
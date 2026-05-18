'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { post } from '@/lib/admin/api'
import { TOKEN_KEY } from '@/lib/admin/constants'
import type { User, LoginParams } from '@/types/admin'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (params: LoginParams) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(TOKEN_KEY)
      if (storedToken) {
        setToken(storedToken)
      }
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (params: LoginParams) => {
    try {
      setLoading(true)
      const res = await post<any>('/auth/login', params)
      const { token: newToken, userInfo: newUser } = res.data || res
      localStorage.setItem(TOKEN_KEY, newToken)
      setToken(newToken)
      setUser(newUser)
      message.success('登录成功')
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 100)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    message.success('已退出登录')
    router.push('/admin/login')
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

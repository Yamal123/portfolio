'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User } from '@/types/admin'

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => Promise<void>
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'same-origin' })
      .then(async (response) => response.ok ? (await response.json()).data : null)
      .then(setUser)
      .finally(() => setIsLoading(false))
  }, [])

  const login = (newUser: User) => setUser(newUser)
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    setUser(null)
    window.location.href = '/admin/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

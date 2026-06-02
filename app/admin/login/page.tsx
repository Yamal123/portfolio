'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/admin/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  const getRedirect = () => {
    if (typeof window === 'undefined') return '/admin/portfolio'
    return new URLSearchParams(window.location.search).get('redirect') || '/admin/portfolio'
  }

  useEffect(() => {
    if (isAuthenticated) router.push(getRedirect())
  }, [isAuthenticated, router])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!username.trim() || !password) {
      toast.error('请输入账号和密码')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      const data = await response.json()
      if (!response.ok) {
        toast.error(data.message || '用户名或密码错误')
        return
      }
      login(data.data.userInfo)
      router.push(getRedirect())
    } catch {
      toast.error('网络连接失败，请检查网络后重试')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) return null

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-slate-950">内容管理后台</h1>
          <p className="mt-1 text-sm text-slate-500">PM 思钱想厚</p>
        </div>
        <label className="mb-3 block space-y-1.5 text-sm font-medium text-slate-700">
          <span>账号</span>
          <Input value={username} onChange={(event) => setUsername(event.target.value)} disabled={isLoading} />
        </label>
        <label className="mb-5 block space-y-1.5 text-sm font-medium text-slate-700">
          <span>密码</span>
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isLoading} />
        </label>
        <Button type="submit" disabled={isLoading} className="w-full bg-orange-500 hover:bg-orange-600">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          登录
        </Button>
      </form>
    </main>
  )
}

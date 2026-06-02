'use client'

import { LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/admin/AuthContext'

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5">
      <h1 className="text-base font-semibold text-slate-950">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{user?.username || 'admin'}</span>
        <button
          type="button"
          onClick={logout}
          className="inline-flex h-8 items-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          退出登录
        </button>
      </div>
    </header>
  )
}

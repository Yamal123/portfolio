'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Briefcase,
  BookOpen,
  Bot,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/admin/AuthContext'

const menuItems = [
  {
    key: 'dashboard',
    label: '总览',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    key: 'profile',
    label: '个人信息',
    icon: User,
    path: '/admin/profile',
  },
  {
    key: 'portfolio',
    label: '作品集',
    icon: Briefcase,
    path: '/admin/portfolio',
  },
  {
    key: 'articles',
    label: '方法论',
    icon: BookOpen,
    path: '/admin/articles',
  },
  {
    key: 'agent',
    label: 'Agent',
    icon: Bot,
    path: '/admin/agent',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <aside className="w-60 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white text-sm font-bold">PM</span>
          </div>
          <div>
            <h1 className="text-white text-base font-bold">管理后台</h1>
            <p className="text-slate-400 text-[11px]">AI PM Portfolio</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.path}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 flex-shrink-0`} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className={`w-3 h-3 transition-all ${
                active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
              }`} />
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-slate-700/50">
        {user && (
          <div className="mb-3 px-1">
            <p className="text-white text-sm font-medium">{user.nickname}</p>
            <p className="text-slate-400 text-xs">{user.username}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4 mr-2" />
          退出登录
        </button>
      </div>
    </aside>
  )
}

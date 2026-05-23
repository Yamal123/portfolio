'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Zap,
  User,
  Phone,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '@/contexts/admin/AuthContext'

const menuItems = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    key: 'projects',
    label: '项目管理',
    icon: Briefcase,
    path: '/admin/projects',
  },
  {
    key: 'skills',
    label: '技能管理',
    icon: Zap,
    path: '/admin/skills',
  },
  {
    key: 'profile',
    label: '个人主页信息',
    icon: User,
    path: '/admin/profile',
  },
  {
    key: 'contact',
    label: '联系方式',
    icon: Phone,
    path: '/admin/contact',
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: Settings,
    path: '/admin/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen flex flex-col shadow-xl">
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">管理后台</h1>
            <p className="text-slate-400 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-transform duration-200 ${
                isActive ? '' : 'group-hover:translate-x-1'
              }`} />
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronRight className={`w-4 h-4 opacity-0 transition-all duration-200 ${
                isActive ? 'opacity-100' : 'group-hover:opacity-50 group-hover:translate-x-1'
              }`} />
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        {user && (
          <div className="mb-4 p-3 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user.nickname}</p>
                <p className="text-slate-400 text-xs">{user.username}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white rounded-xl transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
          退出登录
        </button>
      </div>
    </aside>
  )
}

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
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-white text-xl font-bold">后台管理系统</h1>
        <p className="text-slate-400 text-sm mt-1">Admin Dashboard</p>
      </div>

      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                href={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#3370ff] text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="mb-4">
            <p className="text-white text-sm font-medium">{user.nickname}</p>
            <p className="text-slate-400 text-xs">{user.username}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          退出登录
        </button>
      </div>
    </div>
  )
}

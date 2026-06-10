'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Briefcase,
  BookOpen,
  FileText,
  Newspaper,
  Settings,
  UserRound,
} from 'lucide-react'

const menuItems = [
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
    key: 'industry',
    label: '行业动态',
    icon: Newspaper,
    path: '/admin/industry',
  },
  {
    key: 'analytics',
    label: '运营数据',
    icon: BarChart3,
    path: '/admin/analytics',
  },
  {
    key: 'logs',
    label: '会话明细',
    icon: FileText,
    path: '/admin/logs',
  },
  {
    key: 'profile',
    label: '个人信息',
    icon: UserRound,
    path: '/admin/profile',
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

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`)

  return (
    <aside className="flex h-dvh w-60 shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <Link href="/admin/analytics" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500">
            <span className="text-xs font-bold text-white">PM</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-950">内容管理</h1>
            <p className="text-xs text-slate-500">PM 思钱想厚</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <Link
              key={item.key}
              href={item.path}
              className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-orange-50 text-orange-700 shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="mr-3 h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

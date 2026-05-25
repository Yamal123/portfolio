'use client'

import { Bell, Search, Sun, Moon, User, LogOut, Settings, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/admin/AuthContext'

interface HeaderProps {
  title: string
}

// Simulated notifications
const mockNotifications = [
  { id: 1, text: '作品"AI 产品经理作品集"获得 100 次浏览', time: '5分钟前', type: 'info' },
  { id: 2, text: '文章"Agent闭环" 已更新', time: '15分钟前', type: 'success' },
  { id: 3, text: '有用户通过联系表单提交了消息', time: '1小时前', type: 'warning' },
  { id: 4, text: 'Agent 工具列表已更新', time: '2小时前', type: 'info' },
  { id: 5, text: '网站构建成功', time: '3小时前', type: 'success' },
]

// Search targets
const searchTargets = [
  { label: '个人信息管理', href: '/admin/profile', keywords: ['profile', '个人信息', '技能', '经历'] },
  { label: '作品集管理', href: '/admin/portfolio', keywords: ['portfolio', '作品集', '项目', '案例'] },
  { label: '方法论管理', href: '/admin/articles', keywords: ['articles', '方法论', '文章', '博客'] },
  { label: 'Agent 管理', href: '/admin/agent', keywords: ['agent', 'AI', '工具', '配置'] },
  { label: '管理总览', href: '/admin/dashboard', keywords: ['dashboard', '仪表盘', '总览'] },
]

export function Header({ title }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()

  // Theme
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    setIsDark(stored === 'dark')
  }, [])
  const toggleTheme = () => {
    const next = !isDark
    setIsDark(next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
    if (next) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.setProperty('color-scheme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.setProperty('color-scheme', 'light')
    }
  }

  // Search
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return searchTargets
    const q = searchQuery.toLowerCase()
    return searchTargets.filter(t =>
      t.label.toLowerCase().includes(q) || t.keywords.some(k => k.includes(q))
    )
  }, [searchQuery])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications] = useState(mockNotifications)
  const [readIds, setReadIds] = useState<Set<number>>(new Set())
  const notifRef = useRef<HTMLDivElement>(null)
  const markRead = (id: number) => setReadIds(prev => new Set([...prev, id]))
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-amber-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

        {/* Right Actions */}
        <div className="flex items-center gap-2">

          {/* ----- Search ----- */}
          <div ref={searchRef} className="relative">
            <div className={`flex items-center transition-all ${searchOpen ? 'w-80' : 'w-10'}`}>
              {searchOpen ? (
                <>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索页面..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-10 pr-8 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                    autoFocus
                  />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <Search className="w-4 h-4" />
                </Button>
              )}
            </div>
            {/* Search Results Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50 max-h-64 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">无匹配结果</p>
                ) : (
                  searchResults.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { router.push(item.href); setSearchOpen(false); setSearchQuery('') }}
                      className="w-full text-left px-4 py-2.5 hover:bg-orange-50 text-sm text-gray-700 flex items-center gap-2"
                    >
                      <Search className="w-3 h-3 text-gray-400" />
                      {item.label}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* ----- Theme Toggle ----- */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            title={isDark ? '切换亮色模式' : '切换暗色模式'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* ----- Notifications ----- */}
          <div ref={notifRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNotifOpen(!notifOpen)}
              className="h-9 w-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold px-1">
                  {unreadCount}
                </span>
              )}
            </Button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">通知</p>
                  {unreadCount > 0 && <span className="text-xs text-orange-500">{unreadCount} 条未读</span>}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`px-4 py-3 cursor-pointer transition-colors flex gap-3 items-start ${
                        readIds.has(n.id) ? 'bg-white hover:bg-gray-50' : 'bg-orange-50/50 hover:bg-orange-50'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getTypeColor(n.type)} ${readIds.has(n.id) ? 'opacity-0' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <button onClick={() => setReadIds(new Set(notifications.map(n => n.id)))} className="w-full text-xs text-orange-500 hover:text-orange-600">
                    全部标为已读
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ----- Profile Dropdown ----- */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-3 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 leading-tight">{user?.nickname || '管理员'}</p>
                <p className="text-xs text-gray-400 leading-tight">{user?.username || 'admin'}</p>
              </div>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-50">
                <div className="px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.nickname || '管理员'}</p>
                  <p className="text-xs text-gray-400">{user?.email || 'admin@aipmym.com'}</p>
                </div>
                <button onClick={() => { router.push('/admin/profile'); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />个人信息
                </button>
                <button onClick={() => { router.push('/admin/agent'); setProfileOpen(false) }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-400" />系统设置
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button onClick={() => { setProfileOpen(false); logout() }} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

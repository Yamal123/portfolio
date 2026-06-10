'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  CircleHelp,
  ExternalLink,
  KeyRound,
  LogOut,
  PanelsTopLeft,
} from 'lucide-react'
import { useAuth } from '@/contexts/admin/AuthContext'

interface HeaderProps {
  title: string
}

const helpItems = [
  '作品集：管理个人项目案例，支持新增、编辑、发布、删除与批量操作。',
  '方法论：管理文章内容，支持多选批量发布、取消发布与删除。',
  '行业动态：管理行业资讯，支持编辑、发布和删除。',
  '运营数据：查看 PV、UV、热门页面和热门话题统计。',
  '会话明细：查看来自前台 AI 助手的对话记录，并按时间和关键词筛选。',
  '个人信息：维护公开简介、联系方式和展示内容。',
  '系统设置：修改管理员密码并管理账号安全策略。',
]

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setHelpOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const username = useMemo(() => user?.username || 'admin', [user?.username])

  const goPersonalSite = () => {
    window.open('/', '_blank', 'noopener,noreferrer')
    setMenuOpen(false)
  }

  const goChangePassword = () => {
    router.push('/admin/settings?tab=password')
    setMenuOpen(false)
  }

  const openHelp = () => {
    setHelpOpen(true)
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-base font-semibold text-slate-950">{title}</h1>
          <span className="hidden rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700 md:inline-flex">
            管理后台
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-orange-200 hover:text-slate-950 hover:shadow-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-semibold text-white">
              {username.slice(0, 1).toUpperCase()}
            </span>
            <span className="max-w-28 truncate">{username}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{username}</p>
                <p className="mt-0.5 text-xs text-slate-500">账号操作</p>
              </div>
              <div className="p-2">
                <MenuItem icon={ExternalLink} label="个人网站" onClick={goPersonalSite} />
                <MenuItem icon={KeyRound} label="修改密码" onClick={goChangePassword} />
                <MenuItem icon={CircleHelp} label="帮助" onClick={openHelp} />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {helpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4" onClick={() => setHelpOpen(false)}>
          <div
            className="max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div className="flex items-center gap-3">
                <PanelsTopLeft className="h-5 w-5 text-orange-500" />
                <div>
                  <h2 className="text-base font-semibold text-slate-950">后台功能帮助</h2>
                  <p className="text-sm text-slate-500">简要说明当前后台各模块的用途。</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                关闭
              </button>
            </div>
            <div className="max-h-[calc(80vh-5rem)] space-y-3 overflow-y-auto px-6 py-5">
              {helpItems.map((item) => (
                <p key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function MenuItem({ icon: Icon, label, onClick }: { icon: ComponentType<{ className?: string }>; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
    >
      <Icon className="h-4 w-4 text-slate-500" />
      {label}
    </button>
  )
}

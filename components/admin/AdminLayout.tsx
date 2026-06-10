'use client'

import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AdminLayoutProps {
  children: ReactNode
  title: string
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="admin-shell flex h-dvh overflow-hidden bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header title={title} />
        <main className="min-h-0 flex-1 overflow-hidden bg-slate-100">
          <div className="h-full min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

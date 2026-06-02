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
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-5">
          <div className="mx-auto max-w-[1500px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

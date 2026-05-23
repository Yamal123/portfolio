'use client'

import { AuthProvider } from '@/contexts/admin/AuthContext'
import { Toaster } from '@/components/ui/sonner'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="admin-layout">
        {children}
      </div>
      <Toaster position="top-center" richColors />
    </AuthProvider>
  )
}

'use client'

import { AuthProvider } from '@/contexts/admin/AuthContext'

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthProvider>{children}</AuthProvider>
}

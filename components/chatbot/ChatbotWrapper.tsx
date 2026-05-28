'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ChatButton } from './ChatButton'
import { ChatPanel } from './ChatPanel'

export function ChatbotWrapper() {
  const pathname = usePathname()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) return null

  return (
    <>
      <ChatButton onClick={() => setIsChatOpen(true)} />
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

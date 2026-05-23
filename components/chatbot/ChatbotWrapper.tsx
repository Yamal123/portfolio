'use client'

import { useState } from 'react'
import { ChatButton } from './ChatButton'
import { ChatPanel } from './ChatPanel'

export function ChatbotWrapper() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <ChatButton onClick={() => setIsChatOpen(true)} />
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

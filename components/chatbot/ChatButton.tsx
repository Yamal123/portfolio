'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatButtonProps {
  onClick: () => void
}

export function ChatButton({ onClick }: ChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="打开 AI 助手"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-110 flex items-center justify-center"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  )
}

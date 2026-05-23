'use client'

import type { ChatMessage } from '@/types/chatbot'
import { User, Bot } from 'lucide-react'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user'

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser
            ? 'bg-orange-500 text-white'
            : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="text-xs text-gray-400 mb-1">
          {isUser ? '我' : '智能助手'}
          <span className="ml-2 opacity-60">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div
          className={`inline-block px-4 py-2.5 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-200/80">
              工具: {message.toolsUsed.join(', ')}
              {message.agentMode ? ` · ${message.agentMode}` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

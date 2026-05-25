'use client'

import type { ChatMessage } from '@/types/chatbot'
import { User, Bot } from 'lucide-react'

function renderMarkdown(text: string): string {
  if (!text) return ''
  let html = text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-gray-200 rounded text-xs font-mono">$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-orange-500 underline" onclick="event.stopPropagation()">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br/>')
    // Bullet lists
    .replace(/(?:^|\n)- (.+)/g, '<div class="flex gap-2"><span class="text-orange-400">•</span><span>$1</span></div>')
    // Numbered lists
    .replace(/(?:^|\n)(\d+)\. (.+)/g, '<div class="flex gap-2"><span class="text-orange-400">$1.</span><span>$2</span></div>')
  return html
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user'

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`flex gap-2.5 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
        isUser ? 'bg-orange-500 text-white' : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
      }`}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
      </div>
      <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="text-[10px] text-gray-400 mb-0.5">
          {isUser ? '我' : '智能助手'}
          <span className="ml-1.5 opacity-60">{formatTime(message.timestamp)}</span>
        </div>
        <div className={`inline-block px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-body prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
          )}
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <p className="text-[10px] text-gray-400 mt-2 pt-1.5 border-t border-gray-200/80">
              工具: {message.toolsUsed.join(', ')}
              {message.agentMode ? ` · ${message.agentMode}` : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

interface MessageBubbleProps {
  message: ChatMessage
}

'use client'

import type { ChatMessage } from '@/types/chatbot'
import { User, Bot, Copy, Check } from 'lucide-react'
import { SafeMarkdown } from '@/components/safe-markdown'
import { useState } from 'react'

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.type === 'user'
  const time = message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  const [copied, setCopied] = useState(false)
  const modeLabel = message.agentMode === 'llm' ? 'LLM' : message.agentMode === 'rules' ? 'Rules' : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`mb-4 flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${isUser ? 'bg-orange-500' : 'bg-gradient-to-br from-orange-500 to-orange-600'} text-white`}>
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div className={`max-w-[78%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className="mb-0.5 text-[10px] text-gray-400">
          {isUser ? '我' : '智能助手'} <span className="ml-1.5 opacity-60">{time}</span>
        </div>
        <div className={`inline-block rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed relative ${
          isUser ? 'rounded-br-md bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'rounded-bl-md bg-gray-100 text-gray-800'
        } ${isUser ? '' : 'pr-10'}`}>
          {!isUser && (
            <button
              type="button"
              onClick={copy}
              className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
              aria-label="复制回复"
              title="复制回复"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          )}
          {modeLabel && !isUser && (
            <span className="mb-2 inline-flex rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] text-gray-500">
              {modeLabel}
            </span>
          )}
          {isUser ? <p className="whitespace-pre-wrap">{message.content}</p> : <SafeMarkdown compact>{message.content}</SafeMarkdown>}
          {message.toolsUsed && message.toolsUsed.length > 0 && (
            <p className="mt-2 border-t border-gray-200/80 pt-1.5 text-[10px] text-gray-400">
              工具: {message.toolsUsed.join(', ')}
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
